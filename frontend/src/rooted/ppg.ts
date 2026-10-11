/**
 * Photoplethysmography (PPG) from a fingertip over the camera: each heartbeat
 * pushes a little more blood into the fingertip, which slightly darkens the
 * red channel. We sample the average red brightness ~30 times a second,
 * filter it, find the beats, and turn the gaps between beats into heart rate
 * and heart rate variability (RMSSD).
 */

export interface Sample {
  t: number;
  v: number;
}

/** Remove slow drift and fast noise: subtract a ~1 s moving average, then smooth lightly. */
export function filterSignal(samples: Sample[]): Sample[] {
  if (samples.length < 10) return [];
  const dt = (samples[samples.length - 1].t - samples[0].t) / (samples.length - 1) || 1 / 30;
  const win = Math.max(3, Math.round(1 / dt));
  // Centered window, so steady drift cancels out instead of lagging behind.
  const half = Math.floor(win / 2);
  const vals = samples.map((s) => s.v);
  const prefix = [0];
  for (const v of vals) prefix.push(prefix[prefix.length - 1] + v);
  const out: Sample[] = vals.map((v, i) => {
    const a = Math.max(0, i - half);
    const b = Math.min(vals.length, i + half + 1);
    const mean = (prefix[b] - prefix[a]) / (b - a);
    // Blood in the fingertip darkens the image, so invert to make beats peaks.
    return { t: samples[i].t, v: mean - v };
  });
  const sm = Math.max(1, Math.round(0.1 / dt));
  return out.map((s, i) => {
    let a = 0;
    let n = 0;
    for (let k = Math.max(0, i - sm); k <= Math.min(out.length - 1, i + sm); k++) {
      a += out[k].v;
      n++;
    }
    return { t: s.t, v: a / n };
  });
}

/** Beat times: local maxima above an adaptive threshold, at least 0.33 s apart (under 180 bpm). */
export function findBeats(f: Sample[]): number[] {
  if (f.length < 10) return [];
  const mean = f.reduce((a, s) => a + s.v, 0) / f.length;
  const sd = Math.sqrt(f.reduce((a, s) => a + (s.v - mean) ** 2, 0) / f.length) || 1;
  const thr = mean + 0.3 * sd;
  const beats: number[] = [];
  for (let i = 1; i < f.length - 1; i++) {
    if (f[i].v > thr && f[i].v >= f[i - 1].v && f[i].v > f[i + 1].v) {
      if (!beats.length || f[i].t - beats[beats.length - 1] >= 0.33) beats.push(f[i].t);
      else if (f[i].v > (f.find((s) => s.t === beats[beats.length - 1])?.v ?? 0)) beats[beats.length - 1] = f[i].t;
    }
  }
  return beats;
}

export interface HeartReading {
  bpm: number;
  rmssd: number;
  beats: number;
  /** 0 to 1: share of beat intervals that looked clean. */
  quality: number;
}

/** Heart rate from the median interval; RMSSD from successive clean intervals, in milliseconds. */
export function analyze(beats: number[]): HeartReading | null {
  if (beats.length < 6) return null;
  const ibis = beats.slice(1).map((b, i) => b - beats[i]);
  const sorted = [...ibis].sort((a, b) => a - b);
  const med = sorted[Math.floor(sorted.length / 2)];
  const clean = ibis.filter((x) => Math.abs(x - med) / med < 0.25 && x > 0.33 && x < 1.5);
  if (clean.length < 4) return null;
  const diffs = clean.slice(1).map((x, i) => (x - clean[i]) * 1000);
  const rmssd = Math.sqrt(diffs.reduce((a, d) => a + d * d, 0) / Math.max(1, diffs.length));
  const cleanMed = [...clean].sort((a, b) => a - b)[Math.floor(clean.length / 2)];
  return { bpm: Math.round(60 / cleanMed), rmssd: Math.round(rmssd), beats: beats.length, quality: clean.length / ibis.length };
}

/** Is a fingertip covering the lens? The frame should be bright and strongly red. */
export function fingerOn(r: number, g: number, b: number): boolean {
  return r > 90 && r > g * 1.6 && r > b * 1.6;
}

/** Pick the colour channel with the stronger pulse. With a bright flash the red channel can saturate, and green then carries the beat. */
export function bestChannel(red: Sample[], green: Sample[]): Sample[] {
  const spread = (xs: Sample[]) => {
    const f = filterSignal(xs);
    if (!f.length) return 0;
    const m = f.reduce((a, x) => a + x.v, 0) / f.length;
    return Math.sqrt(f.reduce((a, x) => a + (x.v - m) ** 2, 0) / f.length);
  };
  const redSaturated = red.length > 0 && red.reduce((a, x) => a + x.v, 0) / red.length > 248;
  if (redSaturated) return green;
  return spread(green) > spread(red) * 1.2 ? green : red;
}
