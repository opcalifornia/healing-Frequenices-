import { useEffect } from "react";
import { usePlayer } from "../store/player";
import { renderArt } from "../art/useArt";
import { specForTitle } from "../art/painter";
import { formatHz } from "../format";

/** Lock-screen / hardware-key controls via the Media Session API. */
export function useMediaSession() {
  const current = usePlayer((s) => s.current);
  const status = usePlayer((s) => s.status);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    const ms = navigator.mediaSession;
    if (!current) {
      ms.metadata = null;
      ms.playbackState = "none";
      return;
    }
    const base = {
      title: current.name,
      artist: "Healing Frequencies",
      album: current.kind === "program" ? "Deep Sync" : `${formatHz(current.beat)} binaural`,
    };
    ms.metadata = new MediaMetadata({ ...base, artwork: [{ src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }] });
    let live = true;
    renderArt(specForTitle(current), "poster", 512).then((src) => {
      if (live) ms.metadata = new MediaMetadata({ ...base, artwork: [{ src, sizes: "512x768", type: "image/jpeg" }, { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }] });
    });

    const p = () => usePlayer.getState();
    const handlers: Array<[MediaSessionAction, MediaSessionActionHandler]> = [
      ["play", () => p().status === "paused" && p().togglePlay()],
      ["pause", () => p().status !== "paused" && p().togglePlay()],
      ["stop", () => p().stop()],
      ["seekbackward", (d) => p().seek(p().elapsed - (d.seekOffset ?? 30))],
      ["seekforward", (d) => p().seek(p().elapsed + (d.seekOffset ?? 30))],
      ["seekto", (d) => d.seekTime !== undefined && p().seek(d.seekTime)],
    ];
    for (const [action, fn] of handlers) {
      try {
        ms.setActionHandler(action, fn);
      } catch {
        /* unsupported action */
      }
    }
    return () => {
      live = false;
      for (const [action] of handlers) {
        try {
          ms.setActionHandler(action, null);
        } catch {
          /* ignore */
        }
      }
    };
  }, [current]);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.playbackState = status === "paused" ? "paused" : status === "idle" ? "none" : "playing";
  }, [status]);

  // Keep the lock-screen scrubber in sync every few seconds.
  useEffect(() => {
    if (!("mediaSession" in navigator) || !navigator.mediaSession.setPositionState) return;
    const id = window.setInterval(() => {
      const s = usePlayer.getState();
      if (!s.current || s.endAt <= 0) return;
      try {
        navigator.mediaSession.setPositionState({ duration: s.endAt, position: Math.min(s.elapsed, s.endAt), playbackRate: 1 });
      } catch {
        /* ignore */
      }
    }, 2000);
    return () => window.clearInterval(id);
  }, []);
}
