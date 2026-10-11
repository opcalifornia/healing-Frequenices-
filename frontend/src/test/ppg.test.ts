import { describe, expect, it } from "vitest";
import { analyze, filterSignal, findBeats, fingerOn, type Sample } from "../rooted/ppg";

/** A synthetic fingertip signal: brightness dips with each beat, plus drift and noise. */
function synth(bpm: number, secs: number, jitter = 0.02, seed = 3): Sample[] {
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647) - 0.5;
  const out: Sample[] = [];
  let next = 0.5;
  const beats: number[] = [];
  while (next < secs) {
    beats.push(next);
    next += (60 / bpm) * (1 + rnd() * jitter * 2);
  }
  for (let t = 0; t < secs; t += 1 / 30) {
    let pulse = 0;
    for (const b of beats) {
      const d = t - b;
      if (d > 0 && d < 0.6) pulse += Math.exp(-((d - 0.12) ** 2) / 0.004);
    }
    out.push({ t, v: 180 + 6 * Math.sin(t * 0.4) - 3 * pulse + rnd() * 0.4 });
  }
  return out;
}

describe("camera heart rate", () => {
  it("recovers heart rate from a noisy signal", () => {
    for (const bpm of [58, 72, 95]) {
      const r = analyze(findBeats(filterSignal(synth(bpm, 30))));
      expect(r).not.toBeNull();
      expect(Math.abs(r!.bpm - bpm)).toBeLessThanOrEqual(3);
      expect(r!.quality).toBeGreaterThan(0.8);
    }
  });
  it("reports higher HRV for a more variable rhythm", () => {
    const steady = analyze(findBeats(filterSignal(synth(70, 30, 0.01))))!;
    const variable = analyze(findBeats(filterSignal(synth(70, 30, 0.08, 9))))!;
    expect(variable.rmssd).toBeGreaterThan(steady.rmssd);
  });
  it("needs enough beats", () => {
    expect(analyze([0, 1, 2])).toBeNull();
  });
  it("detects a fingertip over the lens", () => {
    expect(fingerOn(200, 40, 30)).toBe(true);
    expect(fingerOn(120, 110, 100)).toBe(false);
  });
});

import { bestChannel } from "../rooted/ppg";
describe("channel choice", () => {
  it("falls back to green when red is saturated", () => {
    const red = Array.from({ length: 300 }, (_, i) => ({ t: i / 30, v: 255 }));
    const green = Array.from({ length: 300 }, (_, i) => ({ t: i / 30, v: 60 + Math.sin(i / 4) }));
    expect(bestChannel(red, green)).toBe(green);
  });
});
