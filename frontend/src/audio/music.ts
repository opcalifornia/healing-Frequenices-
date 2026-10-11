/**
 * Generative ambient music, composed live.
 *
 * Slow pad chords drift through a short progression, with occasional soft
 * bell notes, all inside a generated reverb. Every pitch is a just-intonation
 * ratio of a root derived from the session's carrier, so the harmony sits in
 * tune with the binaural tones instead of fighting them. A seeded random
 * generator makes each session sound the same every time it is played.
 */

export type MusicStyle = "sleep" | "meditate" | "relax" | "focus" | "energize";

export const MUSIC_STYLES: Array<{ id: MusicStyle; name: string }> = [
  { id: "sleep", name: "Night pads" },
  { id: "meditate", name: "Drone" },
  { id: "relax", name: "Warm ambient" },
  { id: "focus", name: "Steady focus" },
  { id: "energize", name: "Bright" },
];

// Chord shapes as just-intonation ratios.
const SHAPE = {
  maj: [1, 5 / 4, 3 / 2],
  min: [1, 6 / 5, 3 / 2],
  sus2: [1, 9 / 8, 3 / 2],
  maj7: [1, 5 / 4, 3 / 2, 15 / 8],
  min7: [1, 6 / 5, 3 / 2, 9 / 5],
  add9: [1, 5 / 4, 3 / 2, 9 / 4],
  fifth: [1, 3 / 2, 2],
};
type Chord = [degree: number, shape: number[]];

interface StyleSpec {
  progression: Chord[];
  /** Seconds per chord, [min, max]. */
  length: [number, number];
  /** Root range in Hz the carrier is folded into. */
  rootRange: [number, number];
  /** Lowpass cutoff around which pads breathe. */
  cutoff: number;
  /** Chance per chord of a few bell notes. */
  bells: number;
  bass: boolean;
}

const STYLES: Record<MusicStyle, StyleSpec> = {
  sleep: {
    progression: [[1, SHAPE.min7], [8 / 5, SHAPE.maj7], [4 / 3, SHAPE.min7], [1, SHAPE.sus2]],
    length: [16, 24], rootRange: [55, 110], cutoff: 900, bells: 0.15, bass: true,
  },
  meditate: {
    progression: [[1, SHAPE.fifth], [1, SHAPE.sus2], [4 / 3, SHAPE.fifth], [1, SHAPE.fifth], [3 / 2, SHAPE.sus2]],
    length: [20, 30], rootRange: [65, 130], cutoff: 1100, bells: 0.35, bass: true,
  },
  relax: {
    progression: [[1, SHAPE.add9], [4 / 3, SHAPE.maj7], [5 / 3, SHAPE.min7], [3 / 2, SHAPE.sus2]],
    length: [12, 18], rootRange: [80, 160], cutoff: 1600, bells: 0.45, bass: true,
  },
  focus: {
    progression: [[1, SHAPE.maj7], [5 / 3, SHAPE.min7], [4 / 3, SHAPE.maj7], [1, SHAPE.sus2]],
    length: [16, 20], rootRange: [90, 180], cutoff: 1300, bells: 0.1, bass: false,
  },
  energize: {
    progression: [[1, SHAPE.add9], [3 / 2, SHAPE.maj], [5 / 3, SHAPE.min7], [4 / 3, SHAPE.maj7]],
    length: [8, 11], rootRange: [110, 220], cutoff: 2600, bells: 0.6, bass: true,
  },
};

const PENTATONIC = [1, 9 / 8, 5 / 4, 3 / 2, 5 / 3, 2];

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** Fold the carrier by octaves into the style's root range. */
export function rootFor(carrier: number, style: MusicStyle): number {
  const [lo, hi] = STYLES[style].rootRange;
  let r = carrier;
  while (r >= hi) r /= 2;
  while (r < lo) r *= 2;
  return r;
}

/** Pitches for one chord, folded into a two-octave pad range, avoiding the binaural tones themselves. */
export function chordVoices(root: number, chord: Chord, avoid: number[]): number[] {
  const [degree, shape] = chord;
  const out: number[] = [];
  for (const ratio of shape) {
    let f = root * degree * ratio;
    while (f >= root * 4) f /= 2;
    while (f < root) f *= 2;
    // A pad note right on a binaural tone would smear the beat: lift it an octave.
    if (avoid.some((a) => Math.abs(f / a - 1) < 0.04)) f *= 2;
    out.push(f);
  }
  return out;
}

function makeImpulse(ctx: BaseAudioContext, seconds: number, seed: number): AudioBuffer {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  const r = rng(seed);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    let lp = 0;
    for (let i = 0; i < len; i++) {
      const t = i / len;
      lp = lp * 0.6 + (r() * 2 - 1) * 0.4; // gentle darkening
      d[i] = lp * Math.pow(1 - t, 3.2);
    }
  }
  return buf;
}

export interface MusicOptions {
  style: MusicStyle;
  carrier: number;
  seed: number;
  /** Frequencies to keep pad notes away from (the binaural tones). */
  avoid?: number[];
}

export class MusicLayer {
  private bus: GainNode;
  private dry: GainNode;
  private wet: GainNode;
  private reverb: ConvolverNode;
  private nextStart = 0;
  private chordIndex = 0;
  private timer: ReturnType<typeof setInterval> | null = null;
  private live = new Set<AudioScheduledSourceNode>();
  private rand: () => number;
  private root: number;
  private stopped = false;

  constructor(private ctx: BaseAudioContext, out: AudioNode, private opts: MusicOptions) {
    this.rand = rng(opts.seed);
    this.root = rootFor(opts.carrier, opts.style);
    this.bus = ctx.createGain();
    this.dry = ctx.createGain();
    this.wet = ctx.createGain();
    this.reverb = ctx.createConvolver();
    this.reverb.buffer = makeImpulse(ctx, 4.5, opts.seed);
    this.dry.gain.value = 0.55;
    this.wet.gain.value = 0.9;
    this.bus.connect(this.dry).connect(out);
    this.bus.connect(this.reverb).connect(this.wet).connect(out);
    this.chordIndex = Math.floor(this.rand() * STYLES[opts.style].progression.length);
  }

  get style(): MusicStyle {
    return this.opts.style;
  }

  start(at = this.ctx.currentTime + 0.1) {
    this.nextStart = at;
    this.fill(2);
    // Poll so scheduling follows the audio clock (it simply waits while paused).
    this.timer = setInterval(() => this.fill(2), 500);
  }

  /** Schedule chords until `horizon` seconds past now. Used directly by offline renders. */
  fill(horizon: number) {
    if (this.stopped) return;
    while (this.nextStart < this.ctx.currentTime + horizon) this.scheduleChord(this.nextStart);
  }

  /** Future chords follow a new carrier (Deep Sync stages, Build Your Own). */
  setCarrier(carrier: number, avoid?: number[]) {
    this.root = rootFor(carrier, this.opts.style);
    if (avoid) this.opts.avoid = avoid;
  }

  private scheduleChord(t: number) {
    const spec = STYLES[this.opts.style];
    const chord = spec.progression[this.chordIndex % spec.progression.length];
    this.chordIndex++;
    const dur = spec.length[0] + this.rand() * (spec.length[1] - spec.length[0]);
    const attack = Math.min(6, dur * 0.4);
    const release = 7;
    const end = t + dur;
    const ctx = this.ctx;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.Q.value = 0.5;
    const cutoff = spec.cutoff * (0.8 + this.rand() * 0.4);
    filter.frequency.setValueAtTime(cutoff * 0.55, t);
    filter.frequency.linearRampToValueAtTime(cutoff, t + attack + (dur - attack) * 0.5);
    filter.frequency.linearRampToValueAtTime(cutoff * 0.6, end + release);
    filter.connect(this.bus);

    const voices = chordVoices(this.root, chord, this.opts.avoid ?? []);
    if (spec.bass) voices.push((this.root * chord[0]) / (chord[0] >= 2 ? 4 : 2));
    const level = 0.11 / Math.sqrt(voices.length);

    voices.forEach((f, i) => {
      const env = ctx.createGain();
      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(level * (i === voices.length - 1 && spec.bass ? 0.8 : 1), t + attack);
      env.gain.setValueAtTime(level, end);
      env.gain.linearRampToValueAtTime(0, end + release);
      const pan = ctx.createStereoPanner();
      pan.pan.value = (this.rand() * 2 - 1) * 0.6;
      env.connect(pan).connect(filter);
      // Two slightly detuned oscillators per note give the pad its width.
      for (const [type, cents] of [["triangle", -5], ["sine", 6]] as const) {
        const o = ctx.createOscillator();
        o.type = type;
        o.frequency.value = f;
        o.detune.value = cents + (this.rand() - 0.5) * 4;
        o.connect(env);
        this.track(o, t, end + release + 0.1);
      }
    });

    if (this.rand() < spec.bells) {
      const notes = 1 + Math.floor(this.rand() * 3);
      for (let n = 0; n < notes; n++) {
        const bt = t + attack + this.rand() * (dur - attack);
        this.bell(this.root * 4 * PENTATONIC[Math.floor(this.rand() * PENTATONIC.length)], bt);
      }
    }
    // Overlap chords by part of the release for a seamless cross-fade.
    this.nextStart = end + release * 0.35;
  }

  private bell(f: number, t: number) {
    const ctx = this.ctx;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(0.05, t + 0.04);
    env.gain.exponentialRampToValueAtTime(0.0008, t + 4.5);
    const pan = ctx.createStereoPanner();
    pan.pan.value = (this.rand() * 2 - 1) * 0.8;
    env.connect(pan).connect(this.bus);
    for (const [ratio, gain] of [[1, 1], [2.76, 0.25]] as const) {
      const o = ctx.createOscillator();
      o.frequency.value = f * ratio;
      const g = ctx.createGain();
      g.gain.value = gain;
      o.connect(g).connect(env);
      this.track(o, t, t + 4.7);
    }
  }

  private track(o: AudioScheduledSourceNode, start: number, stop: number) {
    o.start(start);
    o.stop(stop);
    this.live.add(o);
    o.onended = () => {
      this.live.delete(o);
      try {
        o.disconnect();
      } catch {
        /* ignore */
      }
    };
  }

  stop() {
    this.stopped = true;
    if (this.timer) clearInterval(this.timer);
    for (const o of this.live) {
      try {
        o.stop();
      } catch {
        /* not started */
      }
    }
    this.live.clear();
    setTimeout(() => {
      for (const n of [this.bus, this.dry, this.wet, this.reverb]) {
        try {
          n.disconnect();
        } catch {
          /* ignore */
        }
      }
    }, 100);
  }
}

/** Default style for a session goal. */
export function styleForGoal(goal: string | undefined): MusicStyle {
  return (["sleep", "meditate", "relax", "focus", "energize"] as const).find((g) => g === goal) ?? "relax";
}
