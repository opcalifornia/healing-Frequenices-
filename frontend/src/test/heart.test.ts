import { describe, expect, it } from "vitest";
import { parseHeartRate } from "../rooted/heartFeed";
import { median, pointers, rmssd, summarize, windowed, type Pt } from "../rooted/hrInsights";

const dv = (...b: number[]) => new DataView(new Uint8Array(b).buffer);

describe("Bluetooth heart rate decoding", () => {
  it("reads an 8-bit rate", () => {
    expect(parseHeartRate(dv(0x00, 72))).toEqual({ bpm: 72, rr: [], contact: null });
  });
  it("reads a 16-bit rate", () => {
    expect(parseHeartRate(dv(0x01, 0x2c, 0x01)).bpm).toBe(300);
  });
  it("reads beat intervals in 1/1024 second units and skips energy expended", () => {
    // flags: RR present (0x10) + energy present (0x08); hr 60; energy 0x0005; RR 1024 and 512 -> 1000 ms and 500 ms
    const r = parseHeartRate(dv(0x18, 60, 0x05, 0x00, 0x00, 0x04, 0x00, 0x02));
    expect(r.bpm).toBe(60);
    expect(r.rr).toEqual([1000, 500]);
  });
  it("reports sensor contact when the device supports it", () => {
    expect(parseHeartRate(dv(0x06, 70)).contact).toBe(true);
    expect(parseHeartRate(dv(0x04, 70)).contact).toBe(false);
  });
});

const series = (f: (s: number) => number, secs: number): Pt[] => Array.from({ length: secs }, (_, s) => ({ s, bpm: Math.round(f(s)), rr: [Math.round(60000 / f(s))] }));

describe("heart rate insights", () => {
  it("windows readings to a session and drops impossible values", () => {
    const w = windowed([{ t: 500, bpm: 70 }, { t: 1500, bpm: 5 }, { t: 2500, bpm: 72 }, { t: 9000, bpm: 70 }], 1000, 3000);
    expect(w).toEqual([{ s: 1.5, bpm: 72, rr: undefined }]);
  });
  it("computes RMSSD and ignores misreads", () => {
    const rr = [800, 820, 790, 810, 800, 830, 790, 800, 815, 805, 5000, 800];
    expect(rmssd(rr)).toBeGreaterThan(10);
    expect(rmssd(rr)).toBeLessThan(40);
    expect(rmssd([800, 810])).toBeNull();
  });
  it("finds a drop from start to end", () => {
    const s = summarize(series((t) => 80 - t / 12, 120), 10)!;
    expect(s.enough).toBe(true);
    expect(s.delta).toBeLessThanOrEqual(-5);
    expect(pointers(s).join(" ")).toMatch(/settled by/);
  });
  it("says nothing much changed when it did not", () => {
    const s = summarize(series(() => 70, 120))!;
    expect(s.delta).toBe(0);
    expect(pointers(s).join(" ")).toMatch(/about the same/);
  });
  it("measures the swing with each breath", () => {
    const s = summarize(series((t) => 70 + 4 * Math.sin((2 * Math.PI * t) / 10), 120), 10)!;
    expect(s.swing).toBeGreaterThanOrEqual(6);
    expect(pointers(s).join(" ")).toMatch(/with each breath/);
  });
  it("won't compare start and end on too little data", () => {
    const s = summarize(series(() => 70, 20))!;
    expect(s === null || !s.enough).toBe(true);
    if (s) expect(pointers(s).join(" ")).toMatch(/Not enough/);
  });
  it("labels demo data and never gives medical advice or alarm", () => {
    const s = summarize(series((t) => 80 - t / 12, 120))!;
    const text = pointers(s, true).join(" ").toLowerCase();
    expect(text).toContain("demo data");
    for (const bad of ["diagnos", "disease", "anxiety disorder", "cure", "dangerous", "calm"]) expect(text, bad).not.toContain(bad);
    expect(text).toContain("not a medical measurement");
  });
  it("median works", () => {
    expect(median([3, 1, 2])).toBe(2);
    expect(median([1, 2, 3, 4])).toBe(2.5);
  });
});

import { connectAppleWatch, cueWatch, watchProblem, type RootedHeartPlugin, type WatchStatus } from "../rooted/heartNative";

const ready: WatchStatus = { healthAvailable: true, watchSupported: true, paired: true, appInstalled: true, reachable: true };
function fakePlugin(status: Partial<WatchStatus> = {}, granted = true) {
  const handlers: Record<string, (d: never) => void> = {};
  const calls: string[] = [];
  const plugin = {
    status: async () => ({ ...ready, ...status }),
    requestAuthorization: async () => ({ granted }),
    startWatchSession: async () => { calls.push("start"); return { started: true }; },
    stopWatchSession: async () => { calls.push("stop"); },
    cue: async ({ kind }: { kind: string }) => { calls.push(`cue:${kind}`); },
    addListener: async (e: string, cb: (d: never) => void) => { handlers[e] = cb; return { remove: async () => { calls.push(`remove:${e}`); } }; },
  } as unknown as RootedHeartPlugin;
  return { plugin, handlers, calls };
}

describe("Apple Watch feed", () => {
  it("explains why a watch can't be used", () => {
    expect(watchProblem({ ...ready, healthAvailable: false })).toMatch(/Health data/);
    expect(watchProblem({ ...ready, paired: false })).toMatch(/paired/);
    expect(watchProblem({ ...ready, appInstalled: false })).toMatch(/Watch app/);
    expect(watchProblem(ready)).toBeNull();
  });
  it("starts the watch session and passes heart rate through", async () => {
    const { plugin, handlers, calls } = fakePlugin();
    const got: number[] = [];
    const feed = await connectAppleWatch((s) => got.push(s.bpm), () => undefined, plugin);
    expect(calls).toContain("start");
    (handlers.heartSample as (d: { bpm: number }) => void)({ bpm: 71.6 });
    (handlers.heartSample as (d: { bpm: number }) => void)({ bpm: 0 });
    expect(got).toEqual([72]);
    expect(feed.name).toBe("Apple Watch");
    expect(feed.demo).toBe(false);
    feed.stop();
    await Promise.resolve();
    expect(calls).toContain("stop");
  });
  it("ends the feed when the watch says the session stopped", async () => {
    const { plugin, handlers } = fakePlugin();
    let ended = 0;
    await connectAppleWatch(() => undefined, () => ended++, plugin);
    (handlers.watchState as (d: WatchStatus) => void)({ ...ready, running: true });
    expect(ended).toBe(0);
    (handlers.watchState as (d: WatchStatus) => void)({ ...ready, running: false });
    expect(ended).toBe(1);
  });
  it("refuses cleanly when there is no watch or no permission, without starting anything", async () => {
    const a = fakePlugin({ paired: false });
    await expect(connectAppleWatch(() => undefined, () => undefined, a.plugin)).rejects.toThrow(/paired/);
    expect(a.calls).not.toContain("start");
    const b = fakePlugin({}, false);
    await expect(connectAppleWatch(() => undefined, () => undefined, b.plugin)).rejects.toThrow(/Health access/);
    expect(b.calls).not.toContain("start");
  });
  it("sends breathing cues to the wrist", async () => {
    const { plugin, calls } = fakePlugin();
    cueWatch("out", plugin);
    await Promise.resolve();
    expect(calls).toContain("cue:out");
  });
});
