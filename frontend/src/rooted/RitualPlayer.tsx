import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "../components/Icon";
import { PLAYER_WARNING, SESSION_EVIDENCE, type Ritual } from "./rituals";
import { RitualArt } from "./RitualArt";
import { Evidence, useModalFocus } from "./ui";
import { RitualAudio } from "./ritualAudio";
import { sessionAt } from "./ritualLogic";
import { useRituals, useRitualPrefs, type Ambient } from "../store/rituals";

type Stage = "gate" | "run" | "done";
const AMBIENTS: Array<{ id: Ambient; label: string }> = [{ id: "none", label: "None" }, { id: "pink", label: "Pink noise" }, { id: "rain", label: "Rain" }];
const clock = (s: number) => `${Math.floor(Math.max(0, s) / 60)}:${String(Math.floor(Math.max(0, s) % 60)).padStart(2, "0")}`;

/** Full-screen session: headphones prompt, then a slow animated visual with timer, play/pause and volume. */
export function RitualPlayer({ ritual, minutes, onClose }: { ritual: Ritual; minutes: number; onClose(): void }) {
  const prefs = useRitualPrefs();
  const setAmbient = useRituals((s) => s.setAmbient);
  const markDone = useRituals((s) => s.setSessionDone);
  const total = minutes * 60;
  const [stage, setStage] = useState<Stage>("gate");
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [volume, setVolume] = useState(0.6);
  const [tested, setTested] = useState<"left" | "right" | null>(null);
  const audio = useRef<RitualAudio | null>(null);
  const elapsedRef = useRef(0);
  const doneRef = useRef(false);
  const panel = useRef<HTMLDivElement>(null);
  useModalFocus(panel, true, onClose);

  if (!audio.current) audio.current = new RitualAudio(ritual, total, ritual.session.fadeOutMin * 60);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    markDone(ritual.id);
    setPlaying(false);
    setStage("done");
    void audio.current?.stop(1.5);
  }, [markDone, ritual.id]);

  // Count time only while playing.
  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const id = window.setInterval(() => {
      const now = performance.now();
      elapsedRef.current += (now - last) / 1000;
      last = now;
      setElapsed(elapsedRef.current);
      audio.current?.tick(total - elapsedRef.current);
      if (elapsedRef.current >= total) finish();
    }, 250);
    return () => window.clearInterval(id);
  }, [playing, total, finish]);

  // Lock-screen controls and a screen that stays on while the session plays.
  useEffect(() => {
    if (!playing) return;
    let lock: { release(): Promise<void> } | null = null;
    (navigator as Navigator & { wakeLock?: { request(t: "screen"): Promise<{ release(): Promise<void> }> } }).wakeLock?.request("screen").then((l) => (lock = l)).catch(() => undefined);
    return () => void lock?.release().catch(() => undefined);
  }, [playing]);
  useEffect(() => {
    if (!("mediaSession" in navigator) || typeof MediaMetadata === "undefined") return;
    navigator.mediaSession.metadata = new MediaMetadata({ title: `${ritual.name} session`, artist: "Rooted Rituals", album: ritual.session.brainState });
    navigator.mediaSession.playbackState = playing ? "playing" : "paused";
    navigator.mediaSession.setActionHandler("play", () => toggle());
    navigator.mediaSession.setActionHandler("pause", () => toggle());
    return () => { navigator.mediaSession.setActionHandler("play", null); navigator.mediaSession.setActionHandler("pause", null); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, ritual]);

  // Leave nothing playing.
  useEffect(() => () => { void audio.current?.stop(0.8); }, []);

  const begin = () => {
    audio.current!.start(prefs.ambient, volume);
    setStage("run");
    setPlaying(true);
  };
  const toggle = () => {
    if (stage !== "run") return;
    if (playing) { void audio.current!.pause(); setPlaying(false); }
    else { audio.current!.resume(); setPlaying(true); }
  };
  const close = () => {
    // A session that ran at least 80% of the way counts.
    if (!doneRef.current && elapsedRef.current >= total * 0.8) markDone(ritual.id);
    onClose();
  };
  const test = async (side: "left" | "right") => {
    setTested(side);
    await audio.current!.testEar(side);
    setTested(null);
  };

  const now = sessionAt(ritual.session, total ? elapsed / total : 0);
  const style = { "--a": ritual.accentColor, "--a2": ritual.accentColor2 } as React.CSSProperties;

  return createPortal(
    <motion.div className="rplayer" style={style} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div ref={panel} role="dialog" aria-modal="true" aria-label={`${ritual.name} session`} tabIndex={-1} className="rplayer__inner">
        <RitualArt ritual={ritual} className="rplayer__art" />
        <button className="rplayer__close icon-btn" onClick={close} aria-label="Close session"><Icon name="close" size={22} /></button>

        <AnimatePresence mode="wait">
          {stage === "gate" && (
            <motion.div key="gate" className="rplayer__card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <Icon name="headphones" size={44} />
              <h2>Headphones required</h2>
              <p>Binaural beats only work when each ear hears its own tone. Put on stereo headphones or earbuds. Speakers won't work.</p>
              <div className="rplayer__test">
                <button className="btn btn--secondary btn--small" onClick={() => void test("left")} disabled={!!tested}>{tested === "left" ? "Playing…" : "Test left ear"}</button>
                <button className="btn btn--secondary btn--small" onClick={() => void test("right")} disabled={!!tested}>{tested === "right" ? "Playing…" : "Test right ear"}</button>
              </div>
              <p className="rplayer__warn" role="note"><Icon name="info" size={16} /> {PLAYER_WARNING}</p>
              <p className="rplayer__fine"><Evidence s={SESSION_EVIDENCE.level} /> Research on binaural beats is mixed. See details on the ritual page.</p>
              <button className="btn btn--primary" onClick={begin}>I'm wearing headphones. Start {minutes} min</button>
            </motion.div>
          )}

          {stage === "run" && (
            <motion.div key="run" className="rplayer__run" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <span className="rooted__eyebrow">{ritual.name} · {ritual.session.brainState}</span>
              <div className={`rplayer__orb ${playing ? "is-on" : ""}`} aria-hidden="true">
                <i /><i /><i /><b />
                <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" /><circle className="rplayer__prog" cx="50" cy="50" r="46" pathLength="100" strokeDasharray="100" strokeDashoffset={100 - (elapsed / total) * 100} /></svg>
              </div>
              <p className="rplayer__time" role="timer" aria-label="Time left">{clock(total - elapsed)}</p>
              <p className="rplayer__hz">Left {now.left} Hz · Right {now.right.toFixed(1)} Hz · Beat {now.beat.toFixed(1)} Hz</p>
              <div className="rplayer__controls">
                <button className="rplayer__play" onClick={toggle} aria-label={playing ? "Pause" : "Play"}><Icon name={playing ? "pause" : "play"} size={32} /></button>
              </div>
              <label className="rplayer__vol"><Icon name="volume" size={18} /><span className="visually-hidden">Volume</span>
                <input type="range" min={0} max={1} step={0.01} value={volume} onChange={(e) => { const v = Number(e.target.value); setVolume(v); audio.current?.setVolume(v); }} />
              </label>
              <div className="rplayer__amb" role="group" aria-label="Background sound">
                {AMBIENTS.map((a) => <button key={a.id} className={`chip ${prefs.ambient === a.id ? "is-on" : ""}`} aria-pressed={prefs.ambient === a.id} onClick={() => { setAmbient(a.id); audio.current?.setAmbient(a.id); }}>{a.label}</button>)}
              </div>
              <p className="rplayer__warn"><Icon name="info" size={16} /> {PLAYER_WARNING}</p>
            </motion.div>
          )}

          {stage === "done" && (
            <motion.div key="done" className="rplayer__card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Icon name="check" size={44} />
              <h2>Session complete</h2>
              <p>Nicely done. It's been checked off for today. Take a moment before you get up.</p>
              <button className="btn btn--primary" onClick={onClose}>Done</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>,
    document.body,
  );
}
