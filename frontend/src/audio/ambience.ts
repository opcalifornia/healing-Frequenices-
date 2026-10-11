/**
 * Nature soundscapes, rendered offline into a looping stereo buffer.
 *
 * Each one is synthesized (filtered noise, droplets, chirps), so there is
 * nothing to license. To use a recording instead, set `src` to a file in
 * /public/ambience and fill in `credit`; the engine then decodes the file and
 * the synthesized version is skipped.
 */

export type AmbienceId = "rain" | "waterfall" | "stream" | "rainforest";

export interface AmbienceInfo {
  id: AmbienceId;
  name: string;
  description: string;
  /** Optional recorded file (relative URL). Takes priority over synthesis. */
  src?: string;
  /** Attribution for a recorded file, shown in the app's sound credits. */
  credit?: string;
}

export const AMBIENCES: AmbienceInfo[] = [
  { id: "rain", name: "Rain", description: "Steady rain with soft droplets on leaves." },
  { id: "waterfall", name: "Waterfall", description: "A broad, even roar of falling water." },
  { id: "stream", name: "Mountain stream", description: "A shallow brook babbling over stones." },
  { id: "rainforest", name: "Rainforest", description: "Light rain, distant birds and insects in the canopy." },
];

const SECONDS = 24;
const TAIL = 1;

/** Deterministic noise so each soundscape sounds the same every session. */
function rng(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function noiseBuffer(ctx: OfflineAudioContext, kind: "white" | "brown", seed: number): AudioBuffer {
  const len = ctx.length;
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  const r = rng(seed);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const w = r() * 2 - 1;
      if (kind === "white") d[i] = w;
      else {
        last = (last + 0.02 * w) / 1.02;
        d[i] = last * 3.5;
      }
    }
  }
  return buf;
}

function play(ctx: OfflineAudioContext, buf: AudioBuffer, chain: AudioNode[], gain: number) {
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const g = ctx.createGain();
  g.gain.value = gain;
  let node: AudioNode = src;
  for (const n of chain) node = node.connect(n);
  node.connect(g).connect(ctx.destination);
  src.start();
  return g;
}

function filter(ctx: BaseAudioContext, type: BiquadFilterType, freq: number, q = 0.7) {
  const f = ctx.createBiquadFilter();
  f.type = type;
  f.frequency.value = freq;
  f.Q.value = q;
  return f;
}

function lfo(ctx: OfflineAudioContext, rate: number, depth: number, target: AudioParam) {
  const o = ctx.createOscillator();
  o.frequency.value = rate;
  const g = ctx.createGain();
  g.gain.value = depth;
  o.connect(g).connect(target);
  o.start();
}

/** Sparse droplets: short decaying noise bursts at random times and positions. */
function droplets(ctx: OfflineAudioContext, perSecond: number, seed: number): AudioBuffer {
  const len = ctx.length;
  const sr = ctx.sampleRate;
  const buf = ctx.createBuffer(2, len, sr);
  const L = buf.getChannelData(0);
  const R = buf.getChannelData(1);
  const r = rng(seed);
  const count = Math.floor(perSecond * (len / sr));
  for (let k = 0; k < count; k++) {
    const start = Math.floor(r() * len);
    const amp = 0.15 + r() * r() * 0.85;
    const pan = r();
    const dur = Math.floor(sr * (0.004 + r() * 0.014));
    const decay = 3 / dur;
    for (let i = 0; i < dur && start + i < len; i++) {
      const v = (r() * 2 - 1) * amp * Math.exp(-i * decay);
      L[start + i] += v * (1 - pan);
      R[start + i] += v * pan;
    }
  }
  return buf;
}

/** Bird calls: short whistled sweeps with vibrato, in phrases of 2-5 notes. */
function birds(ctx: OfflineAudioContext, seed: number): AudioBuffer {
  const len = ctx.length;
  const sr = ctx.sampleRate;
  const buf = ctx.createBuffer(2, len, sr);
  const L = buf.getChannelData(0);
  const R = buf.getChannelData(1);
  const r = rng(seed);
  let t = 0.6 + r();
  while (t < len / sr - 1) {
    const pan = r();
    const base = 1800 + r() * 2600;
    const notes = 2 + Math.floor(r() * 4);
    const amp = 0.05 + r() * 0.12; // birds sit in the distance
    const sweep = (r() - 0.4) * base * 0.6;
    let nt = t;
    for (let n = 0; n < notes; n++) {
      const dur = 0.06 + r() * 0.16;
      const s0 = Math.floor(nt * sr);
      const ns = Math.floor(dur * sr);
      let phase = 0;
      for (let i = 0; i < ns && s0 + i < len; i++) {
        const u = i / ns;
        const f = base + sweep * u + 120 * Math.sin(2 * Math.PI * 28 * (i / sr));
        phase += (2 * Math.PI * f) / sr;
        const env = Math.sin(Math.PI * u) ** 2;
        const v = (Math.sin(phase) + 0.2 * Math.sin(2 * phase)) * env * amp;
        L[s0 + i] += v * (1 - pan);
        R[s0 + i] += v * pan;
      }
      nt += dur + 0.04 + r() * 0.12;
    }
    t = nt + 1.2 + r() * 3.5;
  }
  return buf;
}

/** Blend the tail into the head so looping over [0, length - tail) is seamless. */
function crossfade(buf: AudioBuffer, tailSamples: number) {
  for (let ch = 0; ch < buf.numberOfChannels; ch++) {
    const d = buf.getChannelData(ch);
    const n = d.length;
    for (let i = 0; i < tailSamples; i++) {
      const t = i / tailSamples;
      d[i] = d[i] * t + d[n - tailSamples + i] * (1 - t);
    }
  }
}

/** Bring every soundscape to a similar loudness without clipping. */
function normalize(buf: AudioBuffer, targetRms: number, maxPeak: number) {
  let sum = 0;
  let peak = 0;
  let n = 0;
  for (let ch = 0; ch < buf.numberOfChannels; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < d.length; i++) {
      sum += d[i] * d[i];
      peak = Math.max(peak, Math.abs(d[i]));
    }
    n += d.length;
  }
  const rms = Math.sqrt(sum / n);
  if (!rms || !peak) return;
  const k = Math.min(targetRms / rms, maxPeak / peak);
  for (let ch = 0; ch < buf.numberOfChannels; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < d.length; i++) d[i] *= k;
  }
}

export const AMBIENCE_TAIL = TAIL;

export async function renderAmbience(id: AmbienceId, sampleRate: number): Promise<AudioBuffer> {
  const ctx = new OfflineAudioContext(2, Math.floor(sampleRate * (SECONDS + TAIL)), sampleRate);
  const seed = { rain: 11, waterfall: 23, stream: 37, rainforest: 51 }[id];

  if (id === "rain") {
    play(ctx, noiseBuffer(ctx, "white", seed), [filter(ctx, "highpass", 1400), filter(ctx, "lowpass", 8000)], 0.07);
    play(ctx, droplets(ctx, 45, seed + 1), [filter(ctx, "bandpass", 2600, 0.6)], 1.1);
    play(ctx, noiseBuffer(ctx, "brown", seed + 2), [filter(ctx, "lowpass", 350)], 0.25);
  } else if (id === "waterfall") {
    const roar = play(ctx, noiseBuffer(ctx, "brown", seed), [filter(ctx, "lowpass", 600)], 0.7);
    play(ctx, noiseBuffer(ctx, "white", seed + 1), [filter(ctx, "bandpass", 1100, 0.35)], 0.22);
    play(ctx, noiseBuffer(ctx, "white", seed + 2), [filter(ctx, "highpass", 3500)], 0.035);
    lfo(ctx, 0.13, 0.08, roar.gain);
  } else if (id === "stream") {
    const low = filter(ctx, "bandpass", 750, 3.5);
    const high = filter(ctx, "bandpass", 1900, 3);
    play(ctx, noiseBuffer(ctx, "brown", seed), [low], 1.6);
    play(ctx, noiseBuffer(ctx, "white", seed + 1), [high], 0.12);
    // Several unrelated LFO rates make the "babble" irregular.
    for (const [rate, depth] of [[0.7, 260], [1.9, 170], [3.3, 110]]) lfo(ctx, rate, depth, low.frequency);
    for (const [rate, depth] of [[1.1, 500], [2.7, 300]]) lfo(ctx, rate, depth, high.frequency);
    play(ctx, droplets(ctx, 8, seed + 2), [filter(ctx, "bandpass", 1500, 1.5)], 0.5);
  } else {
    play(ctx, noiseBuffer(ctx, "white", seed), [filter(ctx, "highpass", 1800), filter(ctx, "lowpass", 7000)], 0.035);
    play(ctx, droplets(ctx, 14, seed + 1), [filter(ctx, "bandpass", 2200, 0.7)], 0.6);
    play(ctx, birds(ctx, seed + 2), [], 1);
    // Two insects: high tones pulsing quickly, swelling in and out.
    for (const [hz, pulse, swell, pan] of [[4900, 34, 0.07, -0.7], [6300, 22, 0.05, 0.7]]) {
      const tone = ctx.createOscillator();
      tone.frequency.value = hz;
      const am = ctx.createGain();
      am.gain.value = 0;
      const p = ctx.createOscillator();
      p.type = "square";
      p.frequency.value = pulse;
      const pd = ctx.createGain();
      pd.gain.value = 0.5;
      p.connect(pd).connect(am.gain);
      const level = ctx.createGain();
      level.gain.value = 0.012;
      lfo(ctx, swell, 0.012, level.gain);
      const panner = ctx.createStereoPanner();
      panner.pan.value = pan;
      tone.connect(am).connect(level).connect(panner).connect(ctx.destination);
      tone.start();
      p.start();
    }
  }

  const out = await ctx.startRendering();
  crossfade(out, Math.floor(sampleRate * TAIL));
  normalize(out, 0.07, 0.9);
  return out;
}

/** Decode a recorded file, or synthesize. */
export async function loadAmbience(ctx: BaseAudioContext, id: AmbienceId): Promise<{ buffer: AudioBuffer; loopEnd: number }> {
  const info = AMBIENCES.find((a) => a.id === id)!;
  if (info.src) {
    const res = await fetch(info.src);
    const buffer = await ctx.decodeAudioData(await res.arrayBuffer());
    return { buffer, loopEnd: buffer.duration };
  }
  const buffer = await renderAmbience(id, ctx.sampleRate);
  return { buffer, loopEnd: buffer.duration - TAIL };
}
