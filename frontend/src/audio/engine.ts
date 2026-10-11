import type { BinauralPair, LayerMix, NoiseColor } from "../types";
import { LOOP_TAIL, makeNoiseBuffer } from "./noise";
import { loadAmbience, type AmbienceId } from "./ambience";

/**
 * Live binaural engine built on the Web Audio API. No audio files.
 *
 *   leftOsc  (carrier)        -> leftGain  -> merger input 0 (left ear)
 *   rightOsc (carrier + beat) -> rightGain -> merger input 1 (right ear)
 *   merger -> binauralBus --+
 *   isochronic tone (AM at beat rate) --+--> mixBus -> fader -> volume -> output
 *   solfeggio tone --------------------+
 *   pink/brown noise (looped buffer) --+
 *   surf: brown noise -> lowpass + gain, both swept by slow LFOs (~11 s swells)
 *   extra binaural pairs: more carrier/beat pairs into the same merger
 *
 * The ChannelMerger hard-pans each oscillator to one ear, so the two channels
 * differ by exactly the beat frequency. The fader handles click-free fade in/out
 * and session fade-outs; volume is the user's level.
 */

export interface EngineSettings {
  carrier: number;
  beat: number;
  noise: NoiseColor | null;
  solfeggio: number | null;
  isochronic: boolean;
  /** Extra binaural pairs layered under the main one. */
  pairs?: BinauralPair[];
  ambience?: AmbienceId | null;
  mix: LayerMix;
  volume: number;
}

/** Ocean-swell timing: one wave roughly every 11 seconds. */
export const SURF_RATE = 0.09;

export const DEFAULT_MIX: LayerMix = { binaural: 0.8, isochronic: 0.35, solfeggio: 0.3, noise: 0.5, ambience: 0.7 };

/** Per-layer headroom so a full mix never clips. */
const LEVEL = { binaural: 0.28, isochronic: 0.1, solfeggio: 0.07, noise: 0.42, ambience: 0.55 };
const MIN_RAMP = 0.03;

export function channelFrequencies(carrier: number, beat: number): { left: number; right: number } {
  return { left: carrier, right: carrier + beat };
}

type ContextFactory = () => BaseAudioContext;

interface Graph {
  leftOsc: OscillatorNode;
  rightOsc: OscillatorNode;
  binauralBus: GainNode;
  isoOsc: OscillatorNode;
  isoLfo: OscillatorNode;
  isoSmooth: BiquadFilterNode;
  isoBus: GainNode;
  solfOsc: OscillatorNode;
  solfBus: GainNode;
  noiseSrc: AudioBufferSourceNode | null;
  noiseColor: NoiseColor | null;
  /** Filter, swell gain and LFOs used by the surf layer. */
  noiseChain: AudioNode[];
  pairOscs: OscillatorNode[];
  noiseBus: GainNode;
  ambienceBus: GainNode;
  ambienceSrc: AudioBufferSourceNode | null;
  ambienceId: AmbienceId | null;
  mixBus: GainNode;
  nodes: AudioNode[];
}

export interface EngineOptions {
  /** Route output through an <audio> element (enables lock-screen controls and
   *  background playback on mobile). Ignored for offline contexts. */
  mediaElement?: HTMLAudioElement | null;
}

export class BinauralEngine {
  private ctx: BaseAudioContext | null = null;
  private fader: GainNode | null = null;
  private volumeNode: GainNode | null = null;
  private graph: Graph | null = null;
  private settings: EngineSettings | null = null;
  private noiseCache = new Map<NoiseColor, AudioBuffer>();
  private ambienceCache = new Map<AmbienceId, Promise<{ buffer: AudioBuffer; loopEnd: number }>>();
  private streamDest: MediaStreamAudioDestinationNode | null = null;
  /** Bumped on resume/start so a pending pause() does not suspend a resumed session. */
  private generation = 0;

  constructor(
    private factory: ContextFactory = () => new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)(),
    private options: EngineOptions = {},
  ) {}

  get context(): BaseAudioContext | null {
    return this.ctx;
  }

  get isRunning(): boolean {
    return this.graph !== null;
  }

  get current(): EngineSettings | null {
    return this.settings;
  }

  /** Must be called synchronously inside a user gesture (tap/click/keypress). */
  unlock(): BaseAudioContext {
    if (!this.ctx) {
      this.ctx = this.factory();
      this.fader = this.ctx.createGain();
      this.fader.gain.value = 0;
      this.volumeNode = this.ctx.createGain();
      this.fader.connect(this.volumeNode);
      this.connectOutput();
    }
    const ctx = this.ctx;
    if ("resume" in ctx && ctx.state === "suspended") (ctx as AudioContext).resume().catch(() => {});
    const el = this.options.mediaElement;
    if (el && this.streamDest && el.paused) el.play().catch(() => this.fallbackToDestination());
    return ctx;
  }

  private connectOutput() {
    const ctx = this.ctx!;
    const el = this.options.mediaElement;
    const isRealtime = typeof AudioContext !== "undefined" && ctx instanceof AudioContext;
    if (el && isRealtime && "createMediaStreamDestination" in ctx) {
      try {
        this.streamDest = (ctx as AudioContext).createMediaStreamDestination();
        this.streamDest.channelCount = 2;
        this.volumeNode!.connect(this.streamDest);
        el.srcObject = this.streamDest.stream;
        return;
      } catch {
        this.streamDest = null;
      }
    }
    this.volumeNode!.connect(ctx.destination);
  }

  private fallbackToDestination() {
    if (!this.ctx || !this.volumeNode || !this.streamDest) return;
    try {
      this.volumeNode.disconnect(this.streamDest);
    } catch {
      /* already disconnected */
    }
    this.streamDest = null;
    this.volumeNode.connect(this.ctx.destination);
  }

  private ramp(param: AudioParam, value: number, seconds: number) {
    const ctx = this.ctx!;
    const now = ctx.currentTime;
    param.cancelScheduledValues(now);
    param.setValueAtTime(param.value, now);
    param.linearRampToValueAtTime(value, now + Math.max(MIN_RAMP, seconds));
  }

  private noiseBuffer(color: NoiseColor): AudioBuffer {
    const base = color === "pink" ? "pink" : "brown"; // surf is shaped brown noise
    let buf = this.noiseCache.get(base);
    if (!buf) {
      buf = makeNoiseBuffer(this.ctx!, base);
      this.noiseCache.set(base, buf);
    }
    return buf;
  }

  /** Builds the graph and fades in. Replaces any running session. */
  start(settings: EngineSettings, fadeIn = 2.5): void {
    const ctx = this.unlock();
    this.generation++;
    if (this.graph) {
      // Cross-fade out the previous session instead of cutting it (no click).
      const old = this.graph;
      this.ramp(old.mixBus.gain, 0, 0.3);
      setTimeout(() => this.teardown(old), 400);
      this.graph = null;
    }
    this.settings = { ...settings, mix: { ...settings.mix } };
    const { left, right } = channelFrequencies(settings.carrier, settings.beat);
    const nodes: AudioNode[] = [];
    const track = <T extends AudioNode>(n: T) => (nodes.push(n), n);

    const mixBus = track(ctx.createGain());
    mixBus.gain.value = 0;
    mixBus.connect(this.fader!);

    // Binaural pair, hard-panned through a 2-input merger.
    const merger = track(ctx.createChannelMerger(2));
    const binauralBus = track(ctx.createGain());
    binauralBus.gain.value = LEVEL.binaural * settings.mix.binaural;
    merger.connect(binauralBus);
    binauralBus.connect(mixBus);

    const leftOsc = track(ctx.createOscillator());
    leftOsc.type = "sine";
    leftOsc.frequency.value = left;
    const leftGain = track(ctx.createGain());
    leftOsc.connect(leftGain);
    leftGain.connect(merger, 0, 0);

    const rightOsc = track(ctx.createOscillator());
    rightOsc.type = "sine";
    rightOsc.frequency.value = right;
    const rightGain = track(ctx.createGain());
    rightOsc.connect(rightGain);
    rightGain.connect(merger, 0, 1);

    // Layered pairs: each extra pair is also hard-panned, so every pair's
    // right ear sits exactly its own beat above its left ear.
    const pairOscs: OscillatorNode[] = [];
    for (const p of settings.pairs ?? []) {
      const f = channelFrequencies(p.carrier, p.beat);
      ([[f.left, 0], [f.right, 1]] as const).forEach(([hz, ear]) => {
        const osc = track(ctx.createOscillator());
        osc.type = "sine";
        osc.frequency.value = hz;
        const g = track(ctx.createGain());
        g.gain.value = Math.max(0, Math.min(1, p.level));
        osc.connect(g);
        g.connect(merger, 0, ear);
        pairOscs.push(osc);
      });
    }

    // Isochronic: a centred tone gated on/off at the beat rate. A square LFO is
    // low-passed so each pulse has soft edges instead of clicks.
    const isoOsc = track(ctx.createOscillator());
    isoOsc.frequency.value = settings.carrier * 1.5;
    const isoAm = track(ctx.createGain());
    isoAm.gain.value = 0.5;
    const isoLfo = track(ctx.createOscillator());
    isoLfo.type = "square";
    isoLfo.frequency.value = settings.beat;
    const isoDepth = track(ctx.createGain());
    isoDepth.gain.value = 0.5;
    const isoSmooth = track(ctx.createBiquadFilter());
    isoSmooth.type = "lowpass";
    isoSmooth.frequency.value = Math.min(400, Math.max(20, settings.beat * 6));
    isoLfo.connect(isoDepth);
    isoDepth.connect(isoSmooth);
    isoSmooth.connect(isoAm.gain);
    const isoBus = track(ctx.createGain());
    isoBus.gain.value = settings.isochronic ? LEVEL.isochronic * settings.mix.isochronic : 0;
    isoOsc.connect(isoAm);
    isoAm.connect(isoBus);
    isoBus.connect(mixBus);

    // Solfeggio tone.
    const solfOsc = track(ctx.createOscillator());
    solfOsc.frequency.value = settings.solfeggio ?? 528;
    const solfBus = track(ctx.createGain());
    solfBus.gain.value = settings.solfeggio ? LEVEL.solfeggio * settings.mix.solfeggio : 0;
    solfOsc.connect(solfBus);
    solfBus.connect(mixBus);

    // Noise bed.
    const noiseBus = track(ctx.createGain());
    noiseBus.gain.value = settings.noise ? LEVEL.noise * settings.mix.noise : 0;
    noiseBus.connect(mixBus);

    // Nature soundscape bed (loaded asynchronously).
    const ambienceBus = track(ctx.createGain());
    ambienceBus.gain.value = settings.ambience ? LEVEL.ambience * settings.mix.ambience : 0;
    ambienceBus.connect(mixBus);

    const now = ctx.currentTime;
    for (const osc of [leftOsc, rightOsc, isoOsc, isoLfo, solfOsc, ...pairOscs]) osc.start(now);

    this.graph = {
      leftOsc, rightOsc, binauralBus, isoOsc, isoLfo, isoSmooth, isoBus, solfOsc, solfBus,
      noiseSrc: null, noiseColor: null, noiseChain: [], pairOscs, noiseBus, mixBus, nodes,
      ambienceBus, ambienceSrc: null, ambienceId: null,
    };
    if (settings.noise) this.startNoise(settings.noise);
    if (settings.ambience) void this.startAmbience(settings.ambience);

    this.volumeNode!.gain.value = settings.volume;
    // The session bus carries the slow fade-in; the master fader just opens.
    this.ramp(mixBus.gain, 1, fadeIn);
    this.ramp(this.fader!.gain, 1, Math.min(fadeIn, 0.3));
  }

  private startNoise(color: NoiseColor) {
    const g = this.graph!;
    if (g.noiseSrc && g.noiseColor === color) return;
    this.stopNoise();
    const src = this.ctx!.createBufferSource();
    src.buffer = this.noiseBuffer(color);
    src.loop = true;
    src.loopStart = 0;
    src.loopEnd = src.buffer.duration - LOOP_TAIL;
    if (color === "surf") g.noiseChain = this.buildSurf(src, g.noiseBus);
    else src.connect(g.noiseBus);
    src.start();
    g.noiseSrc = src;
    g.noiseColor = color;
  }

  /**
   * Ocean surf: a lowpass whose cutoff and a gain both swell slowly. Two LFOs
   * at unrelated rates keep consecutive waves from sounding identical.
   */
  private buildSurf(src: AudioBufferSourceNode, out: GainNode): AudioNode[] {
    const ctx = this.ctx!;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 700;
    filter.Q.value = 0.4;
    const swell = ctx.createGain();
    swell.gain.value = 0.62;

    const wave = ctx.createOscillator();
    wave.frequency.value = SURF_RATE;
    const waveToCutoff = ctx.createGain();
    waveToCutoff.gain.value = 480;
    const waveToLevel = ctx.createGain();
    waveToLevel.gain.value = 0.28;
    wave.connect(waveToCutoff).connect(filter.frequency);
    wave.connect(waveToLevel).connect(swell.gain);

    const drift = ctx.createOscillator();
    drift.frequency.value = SURF_RATE * 0.37;
    const driftToLevel = ctx.createGain();
    driftToLevel.gain.value = 0.1;
    drift.connect(driftToLevel).connect(swell.gain);

    src.connect(filter).connect(swell).connect(out);
    wave.start();
    drift.start();
    return [filter, swell, wave, waveToCutoff, waveToLevel, drift, driftToLevel];
  }

  private stopNoise(g: Graph | null = this.graph) {
    if (!g?.noiseSrc) return;
    for (const n of [g.noiseSrc, ...g.noiseChain]) {
      try {
        if ("stop" in n && typeof n.stop === "function") (n as AudioScheduledSourceNode).stop();
        n.disconnect();
      } catch {
        /* already stopped */
      }
    }
    g.noiseSrc = null;
    g.noiseColor = null;
    g.noiseChain = [];
  }

  private async startAmbience(id: AmbienceId) {
    const g = this.graph;
    if (!g || !this.ctx || g.ambienceId === id) return;
    g.ambienceId = id;
    let pending = this.ambienceCache.get(id);
    if (!pending) {
      pending = loadAmbience(this.ctx, id);
      this.ambienceCache.set(id, pending);
      pending.catch(() => this.ambienceCache.delete(id));
    }
    let loaded: { buffer: AudioBuffer; loopEnd: number };
    try {
      loaded = await pending;
    } catch (err) {
      console.warn("[ambience] could not load", id, err);
      return;
    }
    // The session or the choice may have changed while rendering.
    if (this.graph !== g || g.ambienceId !== id) return;
    this.stopAmbience(g);
    const src = this.ctx.createBufferSource();
    src.buffer = loaded.buffer;
    src.loop = true;
    src.loopEnd = loaded.loopEnd;
    const fade = this.ctx.createGain();
    fade.gain.value = 0;
    src.connect(fade).connect(g.ambienceBus);
    src.start();
    fade.gain.setValueAtTime(0, this.ctx.currentTime);
    fade.gain.linearRampToValueAtTime(1, this.ctx.currentTime + 2);
    g.ambienceSrc = src;
  }

  private stopAmbience(g: Graph | null = this.graph) {
    if (!g?.ambienceSrc) return;
    try {
      g.ambienceSrc.stop();
      g.ambienceSrc.disconnect();
    } catch {
      /* already stopped */
    }
    g.ambienceSrc = null;
  }

  /** Retune the pair. Both ears ramp together so right - left stays equal to the beat at the target. */
  setCarrierBeat(carrier: number, beat: number, rampSeconds = 0.08) {
    if (!this.graph || !this.settings) return;
    const { left, right } = channelFrequencies(carrier, beat);
    const g = this.graph;
    this.ramp(g.leftOsc.frequency, left, rampSeconds);
    this.ramp(g.rightOsc.frequency, right, rampSeconds);
    this.ramp(g.isoLfo.frequency, beat, rampSeconds);
    this.ramp(g.isoOsc.frequency, carrier * 1.5, rampSeconds);
    g.isoSmooth.frequency.value = Math.min(400, Math.max(20, beat * 6));
    this.settings = { ...this.settings, carrier, beat };
  }

  setMix(mix: LayerMix) {
    if (!this.graph || !this.settings) return;
    this.settings = { ...this.settings, mix: { ...mix } };
    this.applyLevels();
  }

  setLayers(layers: Partial<Pick<EngineSettings, "noise" | "solfeggio" | "isochronic" | "ambience">>) {
    if (!this.graph || !this.settings) return;
    this.settings = { ...this.settings, ...layers };
    if ("noise" in layers) {
      if (layers.noise) this.startNoise(layers.noise);
    }
    if (layers.solfeggio) this.ramp(this.graph.solfOsc.frequency, layers.solfeggio, 0.05);
    if ("ambience" in layers) {
      if (layers.ambience) void this.startAmbience(layers.ambience);
      else this.graph.ambienceId = null;
    }
    this.applyLevels();
  }

  private applyLevels() {
    const g = this.graph!;
    const s = this.settings!;
    const t = 0.25;
    this.ramp(g.binauralBus.gain, LEVEL.binaural * s.mix.binaural, t);
    this.ramp(g.isoBus.gain, s.isochronic ? LEVEL.isochronic * s.mix.isochronic : 0, t);
    this.ramp(g.solfBus.gain, s.solfeggio ? LEVEL.solfeggio * s.mix.solfeggio : 0, t);
    this.ramp(g.noiseBus.gain, s.noise ? LEVEL.noise * s.mix.noise : 0, t);
    this.ramp(g.ambienceBus.gain, s.ambience ? LEVEL.ambience * s.mix.ambience : 0, t);
    if (!s.ambience && g.ambienceSrc) {
      setTimeout(() => this.graph === g && !this.settings?.ambience && this.stopAmbience(g), 400);
    }
    if (!s.noise && g.noiseSrc) {
      const src = g.noiseSrc;
      setTimeout(() => this.graph?.noiseSrc === src && !this.settings?.noise && this.stopNoise(), 400);
    }
  }

  setVolume(volume: number) {
    if (!this.volumeNode || !this.ctx) return;
    this.ramp(this.volumeNode.gain, volume, 0.08);
    if (this.settings) this.settings = { ...this.settings, volume };
  }

  /** Fade the session level (0..1) over `seconds`. Used for timer fade-outs. */
  fadeTo(level: number, seconds: number) {
    if (this.fader && this.ctx) this.ramp(this.fader.gain, level, seconds);
  }

  async pause(fade = 0.6) {
    if (!this.ctx) return;
    const gen = ++this.generation;
    this.fadeTo(0, fade);
    await wait(fade * 1000 + 30);
    if (gen !== this.generation) return;
    if ("suspend" in this.ctx && this.ctx.state === "running") await (this.ctx as AudioContext).suspend().catch(() => {});
  }

  /** Call from a user gesture. */
  resume(fade = 0.8) {
    if (!this.ctx) return;
    this.generation++;
    this.unlock();
    this.fadeTo(1, fade);
  }

  async stop(fade = 1.5) {
    if (!this.ctx || !this.graph) return;
    this.fadeTo(0, fade);
    const g = this.graph;
    await wait(fade * 1000 + 50);
    if (this.graph === g) this.teardown(g);
  }

  private teardown(g: Graph) {
    this.stopNoise(g);
    this.stopAmbience(g);
    for (const osc of [g.leftOsc, g.rightOsc, g.isoOsc, g.isoLfo, g.solfOsc, ...g.pairOscs]) {
      try {
        osc.stop();
      } catch {
        /* not started */
      }
    }
    for (const n of g.nodes) {
      try {
        n.disconnect();
      } catch {
        /* ignore */
      }
    }
    if (this.graph === g) {
      this.graph = null;
      this.settings = null;
    }
  }

  /** Plays a short soft tone in one ear only, independent of any session. */
  async channelTest(side: "left" | "right", seconds = 1.2): Promise<void> {
    const ctx = this.unlock();
    const osc = ctx.createOscillator();
    osc.frequency.value = side === "left" ? 330 : 440;
    const env = ctx.createGain();
    env.gain.value = 0;
    const merger = ctx.createChannelMerger(2);
    osc.connect(env);
    env.connect(merger, 0, side === "left" ? 0 : 1);
    merger.connect(this.volumeNode!);
    const now = ctx.currentTime;
    env.gain.setValueAtTime(0, now);
    env.gain.linearRampToValueAtTime(0.22, now + 0.08);
    env.gain.setValueAtTime(0.22, now + seconds - 0.15);
    env.gain.linearRampToValueAtTime(0, now + seconds);
    osc.start(now);
    osc.stop(now + seconds + 0.05);
    await wait(seconds * 1000 + 100);
    merger.disconnect();
  }

  /** Current oscillator frequencies (for readouts and tests). */
  readFrequencies(): { left: number; right: number } | null {
    if (!this.graph) return null;
    return { left: this.graph.leftOsc.frequency.value, right: this.graph.rightOsc.frequency.value };
  }
}

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
