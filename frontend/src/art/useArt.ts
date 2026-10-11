import { useEffect, useState } from "react";
import type { ArtShape } from "../types";
import { paintArt, type ArtSpec } from "./painter";

const cache = new Map<string, string>();
const pending = new Map<string, Promise<string>>();
const queue: Array<() => void> = [];
let draining = false;

/** Paint at most one image per frame so scrolling never janks. */
function drain() {
  if (draining) return;
  draining = true;
  const step = () => {
    const job = queue.shift();
    if (!job) {
      draining = false;
      return;
    }
    job();
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export function artWidth(shape: ArtShape | "hero"): number {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  if (shape === "hero") return Math.round(Math.min(1920, window.innerWidth * dpr) / 2) * 2;
  return shape === "poster" ? Math.round(240 * dpr) : Math.round(320 * dpr);
}

export function renderArt(spec: ArtSpec, shape: ArtShape | "hero", width = artWidth(shape)): Promise<string> {
  const key = `${spec.seed}|${spec.hue}|${spec.pattern}|${shape}|${width}`;
  const hit = cache.get(key);
  if (hit) return Promise.resolve(hit);
  const inflight = pending.get(key);
  if (inflight) return inflight;
  const p = new Promise<string>((resolve) => {
    queue.push(() => {
      const canvas = document.createElement("canvas");
      paintArt(canvas, spec, shape, width);
      canvas.toBlob(
        (blob) => {
          const url = blob ? URL.createObjectURL(blob) : canvas.toDataURL("image/jpeg", 0.85);
          cache.set(key, url);
          pending.delete(key);
          resolve(url);
        },
        "image/jpeg",
        0.86,
      );
    });
    drain();
  });
  pending.set(key, p);
  return p;
}

/** Returns an object URL for the title art once painted (null while pending). */
export function useArt(spec: ArtSpec | null, shape: ArtShape | "hero", enabled = true): string | null {
  const width = artWidth(shape);
  const key = spec ? `${spec.seed}|${spec.hue}|${spec.pattern}|${shape}|${width}` : "";
  const [url, setUrl] = useState<string | null>(() => (key ? cache.get(key) ?? null : null));

  useEffect(() => {
    if (!spec || !enabled) return;
    const hit = cache.get(key);
    if (hit) {
      setUrl(hit);
      return;
    }
    let live = true;
    renderArt(spec, shape, width).then((u) => live && setUrl(u));
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled]);

  return url;
}
