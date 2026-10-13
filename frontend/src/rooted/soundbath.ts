/**
 * Synthesized singing bowls, chimes and gong, with a generated reverb.
 * Bowls use the inharmonic partial ratios of real metal bowls, each split
 * into two slightly detuned copies so they beat and "wobble" like the real
 * thing. Nothing is recorded; it's all generated live.
 */

let ctx: AudioContext | null = null;
let out: GainNode | null = null;

function rngFrom(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function bathContext(): { ctx: AudioContext; out: GainNode } {
  if (!ctx) {
    ctx = new AudioContext();
    out = ctx.createGain();
    out.gain.value = 0.9;
    const verb = ctx.createConvolver();
    const len = ctx.sampleRate * 6;
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    const r = rngFrom(7);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (r() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
    verb.buffer = buf;
    const wet = ctx.createGain();
    wet.gain.value = 0.35;
    const dry = ctx.createGain();
    dry.gain.value = 0.8;
    out.connect(dry).connect(ctx.destination);
    out.connect(verb).connect(wet).connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return { ctx, out: out! };
}

export function setBathVolume(v: number) {
  const { ctx, out } = bathContext();
  out.gain.setTargetAtTime(v, ctx.currentTime, 0.1);
}

function partial(c: AudioContext, dest: AudioNode, f: number, level: number, t: number, attack: number, decay: number, pan: number) {
  const g = c.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(level, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
  const p = c.createStereoPanner();
  p.pan.value = pan;
  g.connect(p).connect(dest);
  const o = c.createOscillator();
  o.frequency.value = f;
  o.connect(g);
  o.start(t);
  o.stop(t + attack + decay + 0.1);
}

/** Bowl partial ratios (struck Tibetan-style bowl) and how long each rings. */
const BOWL = [
  [1, 1, 1],
  [2.71, 0.45, 0.6],
  [5.12, 0.2, 0.32],
  [8.0, 0.08, 0.18],
] as const;

export interface BowlSpec {
  id: string;
  name: string;
  hz: number;
  hue: number;
}
/** A gentle pentatonic set: the bowls always sound good together. */
export const BOWLS: BowlSpec[] = [
  { id: "low", name: "Low bowl", hz: 130.8, hue: 280 },
  { id: "d", name: "Deep bowl", hz: 146.8, hue: 250 },
  { id: "mid", name: "Mid bowl", hz: 196, hue: 200 },
  { id: "a", name: "Warm bowl", hz: 220, hue: 160 },
  { id: "high", name: "High bowl", hz: 261.6, hue: 40 },
];

/** Strike a bowl. `soft` is a gentle tap with a slower bloom. */
export function strikeBowl(hz: number, { level = 0.22, pan = 0, soft = false, length = 1 } = {}) {
  const { ctx: c, out: o } = bathContext();
  const t = c.currentTime + 0.01;
  const attack = soft ? 0.25 : 0.006;
  for (const [ratio, amp, decayK] of BOWL) {
    const decay = 24 * decayK * length;
    // Two close copies beat against each other: the bowl's characteristic wobble.
    partial(c, o, hz * ratio, level * amp * 0.55, t, attack, decay, pan - 0.15);
    partial(c, o, hz * ratio * (1 + 0.0035 / ratio), level * amp * 0.55, t, attack, decay, pan + 0.15);
  }
  if (!soft) {
    // Mallet contact: a very short filtered noise tick.
    const n = c.createBufferSource();
    const b = c.createBuffer(1, c.sampleRate * 0.05, c.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    n.buffer = b;
    const f = c.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = hz * 6;
    const g = c.createGain();
    g.gain.value = level * 0.25;
    n.connect(f).connect(g).connect(o);
    n.start(t);
  }
}

/** Wind chimes: a few quick, bright tubes. */
const CHIME_NOTES = [523.3, 587.3, 659.3, 784, 880, 1046.5];
export function chimes(count = 4) {
  const { ctx: c, out: o } = bathContext();
  const t0 = c.currentTime + 0.02;
  for (let k = 0; k < count; k++) {
    const t = t0 + k * (0.09 + Math.random() * 0.22);
    const f = CHIME_NOTES[Math.floor(Math.random() * CHIME_NOTES.length)];
    const pan = Math.random() * 1.6 - 0.8;
    for (const [ratio, amp] of [[1, 1], [2.76, 0.35], [5.4, 0.12]] as const) partial(c, o, f * ratio, 0.05 * amp, t, 0.003, 5 / ratio, pan);
  }
}

/** A gong: a slow swell of many inharmonic partials with a long tail. */
export function gong(level = 0.25) {
  const { ctx: c, out: o } = bathContext();
  const t = c.currentTime + 0.02;
  const base = 65.4;
  const ratios = [1, 1.47, 2.09, 2.56, 3.2, 3.93, 4.7, 5.6, 6.8];
  ratios.forEach((r, k) => {
    const pan = (k % 2 ? 1 : -1) * (0.1 + k * 0.05);
    partial(c, o, base * r * (1 + (Math.random() - 0.5) * 0.004), (level / (1 + k * 0.6)) * 0.6, t + k * 0.04, 0.8 + k * 0.15, 18 - k, pan);
  });
  const n = c.createBufferSource();
  const b = c.createBuffer(2, c.sampleRate * 3, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = b.getChannelData(ch);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  n.buffer = b;
  const f = c.createBiquadFilter();
  f.type = "lowpass";
  f.frequency.value = 400;
  const g = c.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(level * 0.08, t + 0.6);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 3);
  n.connect(f).connect(g).connect(o);
  n.start(t);
}

/**
 * An unattended sound bath: bowls, chimes and the occasional gong at a slow,
 * random pace. Returns a stop function.
 */
export function startSoundBath(onEvent?: (kind: "bowl" | "chimes" | "gong", id?: string) => void): () => void {
  bathContext();
  let stopped = false;
  let timer: ReturnType<typeof setTimeout>;
  let n = 0;
  const step = () => {
    if (stopped) return;
    n++;
    const r = Math.random();
    if (n === 1 || (n % 9 === 0 && r < 0.6)) {
      gong(0.2);
      onEvent?.("gong");
    } else if (r < 0.18) {
      chimes(3 + Math.floor(Math.random() * 4));
      onEvent?.("chimes");
    } else {
      const b = BOWLS[Math.floor(Math.random() * BOWLS.length)];
      strikeBowl(b.hz, { level: 0.14 + Math.random() * 0.08, pan: Math.random() * 1.2 - 0.6, soft: Math.random() < 0.5 });
      onEvent?.("bowl", b.id);
    }
    timer = setTimeout(step, 5500 + Math.random() * 6500);
  };
  timer = setTimeout(step, 400);
  return () => {
    stopped = true;
    clearTimeout(timer);
  };
}
