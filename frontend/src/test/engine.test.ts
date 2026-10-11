import { describe, expect, it } from "vitest";
import { BinauralEngine, channelFrequencies, DEFAULT_MIX, type EngineSettings } from "../audio/engine";
import { FakeContext, FakeGain, FakeNode, FakeOscillator } from "./fakeAudio";
import { stageIndexAt, fadeOutSeconds } from "../audio/program";

const base: EngineSettings = { carrier: 200, beat: 10, noise: null, solfeggio: null, isochronic: false, mix: DEFAULT_MIX, volume: 0.5 };

function setup(settings: Partial<EngineSettings> = {}) {
  const ctx = new FakeContext();
  const engine = new BinauralEngine(() => ctx as unknown as BaseAudioContext);
  engine.start({ ...base, ...settings });
  return { ctx, engine };
}

/** Follows gain nodes from an oscillator to the merger and returns the merger input (0 = left, 1 = right). */
function earOf(osc: FakeOscillator): number | null {
  let node: FakeNode = osc;
  for (let hops = 0; hops < 4; hops++) {
    const c = node.connections[0];
    if (!c) return null;
    if (c.to instanceof FakeNode && c.to.kind === "merger") return c.input;
    if (!(c.to instanceof FakeGain)) return null;
    node = c.to;
  }
  return null;
}

function binauralPair(ctx: FakeContext) {
  const routed = ctx.nodes.filter((n): n is FakeOscillator => n instanceof FakeOscillator && earOf(n) !== null);
  const left = routed.find((o) => earOf(o) === 0)!;
  const right = routed.find((o) => earOf(o) === 1)!;
  return { left, right, routed };
}

describe("binaural channels", () => {
  it("channelFrequencies puts carrier left and carrier + beat right", () => {
    expect(channelFrequencies(200, 10)).toEqual({ left: 200, right: 210 });
  });

  const cases: Array<[number, number]> = [
    [200, 10],
    [136.1, 2.5],
    [100, 0.5],
    [400, 40],
    [264, 6],
    [200, 7.83],
    [247, 14],
    [110, 0.8],
  ];

  it.each(cases)("carrier %f Hz, beat %f Hz: right ear minus left ear equals the beat", (carrier, beat) => {
    const { ctx } = setup({ carrier, beat });
    const { left, right, routed } = binauralPair(ctx);
    expect(routed).toHaveLength(2);
    expect(left.type).toBe("sine");
    expect(right.type).toBe("sine");
    expect(left.frequency.value).toBe(carrier);
    expect(right.frequency.value - left.frequency.value).toBeCloseTo(beat, 9);
  });

  it("hard-pans each oscillator to exactly one ear through a 2-input merger", () => {
    const { ctx } = setup();
    const { left, right } = binauralPair(ctx);
    expect(earOf(left)).toBe(0);
    expect(earOf(right)).toBe(1);
    const mergers = ctx.nodes.filter((n) => n.kind === "merger");
    expect(mergers).toHaveLength(1);
    expect((mergers[0] as FakeNode & { numberOfInputs: number }).numberOfInputs).toBe(2);
  });

  it("keeps the difference equal to the new beat after retuning", () => {
    const { ctx, engine } = setup();
    engine.setCarrierBeat(180, 4.5, 20);
    const { left, right } = binauralPair(ctx);
    expect(left.frequency.target).toBe(180);
    expect(right.frequency.target - left.frequency.target).toBeCloseTo(4.5, 9);
    expect(engine.readFrequencies()).toEqual({ left: 180, right: 184.5 });
  });

  it("fades in from silence instead of starting abruptly", () => {
    const { ctx } = setup();
    const gains = ctx.nodes.filter((n): n is FakeGain => n instanceof FakeGain);
    const fader = gains[0]; // created at unlock, before any session
    const sessionBus = gains.find((g) => g.connections.some((c) => c.to === fader))!;
    expect(fader.gain.events[0]).toMatchObject({ type: "set", value: 0 });
    expect(sessionBus.gain.events[0]).toMatchObject({ type: "set", value: 0 });
    const last = sessionBus.gain.events.at(-1)!;
    expect(last).toMatchObject({ type: "ramp", value: 1 });
    expect(last.time).toBeGreaterThan(1);
  });

  it("only starts oscillators once start() is called", () => {
    const ctx = new FakeContext();
    new BinauralEngine(() => ctx as unknown as BaseAudioContext);
    expect(ctx.nodes.filter((n) => n instanceof FakeOscillator)).toHaveLength(0);
  });
});

describe("program helpers", () => {
  const stages = [
    { at: 0, beat: 10, label: "Settle" },
    { at: 5, beat: 6, label: "Descend" },
    { at: 12, beat: 4, label: "Stillpoint" },
  ];
  it("finds the active stage", () => {
    expect(stageIndexAt(stages, 0)).toBe(0);
    expect(stageIndexAt(stages, 299)).toBe(0);
    expect(stageIndexAt(stages, 300)).toBe(1);
    expect(stageIndexAt(stages, 12 * 60 + 1)).toBe(2);
  });
  it("bounds the timer fade-out", () => {
    expect(fadeOutSeconds(60)).toBe(8);
    expect(fadeOutSeconds(300)).toBe(30);
    expect(fadeOutSeconds(3600)).toBe(45);
  });
});

describe("layered pairs and surf", () => {
  it("every layered pair is hard-panned with right - left equal to its own beat", () => {
    const pairs = [
      { carrier: 150, beat: 4, level: 0.6 },
      { carrier: 250, beat: 10, level: 0.4 },
    ];
    const { ctx } = setup({ carrier: 100, beat: 6, pairs });
    const routed = ctx.nodes.filter((n): n is FakeOscillator => n instanceof FakeOscillator && earOf(n) !== null);
    expect(routed).toHaveLength(6);
    const left = routed.filter((o) => earOf(o) === 0).map((o) => o.frequency.value).sort((a, b) => a - b);
    const right = routed.filter((o) => earOf(o) === 1).map((o) => o.frequency.value).sort((a, b) => a - b);
    expect(left).toEqual([100, 150, 250]);
    expect(right.map((r, i) => +(r - left[i]).toFixed(9))).toEqual([6, 4, 10]);
  });

  it("surf noise sweeps a lowpass with a slow LFO", () => {
    const { ctx } = setup({ noise: "surf" });
    const filters = ctx.nodes.filter((n) => n.kind === "biquad") as Array<FakeNode & { frequency: { inputs: FakeNode[] } }>;
    const surfFilter = filters.find((f) => f.frequency.inputs.length > 0 && f.frequency.inputs.some((g) => g.connections.length));
    expect(surfFilter).toBeTruthy();
    const lfos = ctx.nodes.filter((n): n is FakeOscillator => n instanceof FakeOscillator && n.frequency.value < 0.2);
    expect(lfos.length).toBeGreaterThanOrEqual(2);
  });
});
