import type { HeartSample } from "./heartFeed";

/** A reading with time in seconds from the start of the session. */
export interface Pt { s: number; bpm: number; rr?: number[] }

export const median = (xs: number[]) => {
  if (!xs.length) return NaN;
  const a = [...xs].sort((x, y) => x - y);
  const m = Math.floor(a.length / 2);
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
};

/** Readings inside a session window, with time counted from the session start. */
export function windowed(samples: HeartSample[], startMs: number, endMs: number): Pt[] {
  return samples.filter((x) => x.t >= startMs && x.t <= endMs && x.bpm >= 30 && x.bpm <= 220).map((x) => ({ s: (x.t - startMs) / 1000, bpm: x.bpm, rr: x.rr }));
}

/** RMSSD in milliseconds from beat intervals, ignoring obvious misreads and extra or missed beats. */
export function rmssd(rr: number[]): number | null {
  const clean: number[] = [];
  for (const x of rr) {
    if (x < 300 || x > 2000) continue;
    const prev = clean[clean.length - 1];
    if (prev && Math.abs(x - prev) / prev > 0.2) continue;
    clean.push(x);
  }
  if (clean.length < 10) return null;
  const d = clean.slice(1).map((x, i) => x - clean[i]);
  return Math.round(Math.sqrt(d.reduce((a, v) => a + v * v, 0) / d.length));
}

export interface HrSummary {
  samples: number;
  /** Median over the first and last thirty seconds. */
  start: number;
  end: number;
  delta: number;
  lowest: number;
  highest: number;
  hrvStart: number | null;
  hrvEnd: number | null;
  /** Average swing in beats per minute across each breath, when there are enough readings. */
  swing: number | null;
  enough: boolean;
}

/** Summarize a session. Needs at least about a minute of readings to say anything. */
export function summarize(pts: Pt[], cycleSecs?: number): HrSummary | null {
  if (pts.length < 8) return null;
  const last = pts[pts.length - 1].s;
  const head = pts.filter((p) => p.s <= 30);
  const tail = pts.filter((p) => p.s >= last - 30);
  if (head.length < 4 || tail.length < 4 || last < 45) return { samples: pts.length, start: NaN, end: NaN, delta: NaN, lowest: Math.min(...pts.map((p) => p.bpm)), highest: Math.max(...pts.map((p) => p.bpm)), hrvStart: null, hrvEnd: null, swing: null, enough: false };
  const start = median(head.map((p) => p.bpm));
  const end = median(tail.map((p) => p.bpm));
  const hrvStart = rmssd(head.flatMap((p) => p.rr ?? []));
  const hrvEnd = rmssd(tail.flatMap((p) => p.rr ?? []));
  let swing: number | null = null;
  if (cycleSecs && cycleSecs >= 3 && last >= cycleSecs * 4) {
    const swings: number[] = [];
    for (let t = 0; t + cycleSecs <= last; t += cycleSecs) {
      const w = pts.filter((p) => p.s >= t && p.s < t + cycleSecs).map((p) => p.bpm);
      if (w.length >= Math.max(3, cycleSecs / 2)) swings.push(Math.max(...w) - Math.min(...w));
    }
    if (swings.length >= 3) swing = Math.round(median(swings) * 10) / 10;
  }
  return { samples: pts.length, start: Math.round(start), end: Math.round(end), delta: Math.round(end - start), lowest: Math.min(...pts.map((p) => p.bpm)), highest: Math.max(...pts.map((p) => p.bpm)), hrvStart, hrvEnd, swing, enough: true };
}

/** Plain, careful pointers. They describe what the numbers show, not what they mean for your health. */
export function pointers(s: HrSummary, demo = false): string[] {
  const out: string[] = [];
  if (demo) out.push("This is demo data, made up to show the screen. Connect a real monitor to see your own.");
  if (!s.enough) {
    out.push("Not enough heart-rate readings to compare the start and end. Try a session of at least a minute or two with the monitor snug and steady.");
    return out;
  }
  if (s.start < 40 || s.start > 150 || s.end < 40 || s.end > 150) out.push("Some readings look unusual. Check that the sensor is snug and moist (chest straps) or sitting right on the wrist, then try again.");
  if (s.delta <= -5) out.push(`Your heart rate settled by ${Math.abs(s.delta)} beats a minute, from about ${s.start} to ${s.end}. That is a common response to slow breathing, but responses vary from person to person and day to day.`);
  else if (s.delta < 5) out.push(`Your heart rate stayed about the same (${s.start} to ${s.end}). That's normal, especially if you were already at rest. A few beats either way is within everyday variation.`);
  else out.push(`Your heart rate was higher at the end (${s.start} to ${s.end}). Movement, caffeine, a recent stressful thought or sitting up straight can all raise it. Try again seated, with a longer breath out.`);
  if (s.hrvStart && s.hrvEnd) {
    const ch = Math.round(((s.hrvEnd - s.hrvStart) / s.hrvStart) * 100);
    if (ch >= 15) out.push(`Heart rate variability (RMSSD) rose from ${s.hrvStart} to ${s.hrvEnd} ms, up ${ch}%. Higher usually means the heart is responding more flexibly.`);
    else if (ch <= -15) out.push(`Heart rate variability (RMSSD) fell from ${s.hrvStart} to ${s.hrvEnd} ms. That can happen with fast or uneven breathing, or when you tense up. Try an even, easy pace.`);
    else out.push(`Heart rate variability (RMSSD) stayed close to ${s.hrvStart} ms. It varies a lot between people, so compare yourself with yourself over weeks.`);
  }
  if (s.swing !== null) out.push(`Your heart rate rose and fell about ${s.swing} beats with each breath. That breathing-linked swing is the pattern slow breathing is known for, and it tends to be largest near your own comfortable pace.`);
  out.push("Wrist and optical sensors are less accurate than chest straps, especially for variability. This is not a medical measurement. If you are worried about your heart, talk to a clinician.");
  return out;
}
