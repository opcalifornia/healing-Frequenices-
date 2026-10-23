import { loadAmbience, type AmbienceId } from "../audio/ambience";

/** Soft cue tones for guided practices. Its own tiny audio context, separate from the session engine. */
let ctx: AudioContext | null = null;

export function unlockChime() {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
}

const PITCH = { in: 528, top: 660, hold: 396, out: 352, rest: 396, bell: 792 } as const;

export function chime(kind: keyof typeof PITCH, volume = 0.07) {
  if (!ctx) return;
  const t = ctx.currentTime;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(volume, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0005, t + 2.2);
  g.connect(ctx.destination);
  for (const [ratio, level] of [[1, 1], [2.01, 0.18], [3.02, 0.06]] as const) {
    const o = ctx.createOscillator();
    const og = ctx.createGain();
    o.frequency.value = PITCH[kind] * ratio;
    og.gain.value = level;
    o.connect(og).connect(g);
    o.start(t);
    o.stop(t + 2.3);
  }
}

/* ------------------------------------------------------------------ */
/* Breath tone: a soft pad that rises as you inhale and falls as you   */
/* exhale, so you can follow with your eyes closed.                    */
/* ------------------------------------------------------------------ */

let tone: { osc: OscillatorNode[]; gain: GainNode; filter: BiquadFilterNode } | null = null;
const TONE_LOW = 174;
const TONE_HIGH = 261;

function ensureTone() {
  if (!ctx) return null;
  if (tone) return tone;
  const gain = ctx.createGain();
  gain.gain.value = 0;
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 700;
  filter.connect(gain).connect(ctx.destination);
  const osc = [0, 7].map((cents) => {
    const o = ctx!.createOscillator();
    o.type = "triangle";
    o.frequency.value = TONE_LOW;
    o.detune.value = cents;
    o.connect(filter);
    o.start();
    return o;
  });
  tone = { osc, gain, filter };
  return tone;
}

/** Glide the breath tone for one phase. */
export function breathTone(kind: "in" | "top" | "hold" | "out" | "rest", secs: number, volume = 0.05) {
  const t = ensureTone();
  if (!t || !ctx) return;
  const now = ctx.currentTime;
  const target = kind === "in" ? TONE_HIGH : kind === "top" ? TONE_HIGH * 1.12 : kind === "out" ? TONE_LOW : null;
  for (const o of t.osc) {
    o.frequency.cancelScheduledValues(now);
    o.frequency.setValueAtTime(o.frequency.value, now);
    if (target) o.frequency.linearRampToValueAtTime(target, now + secs);
  }
  t.gain.gain.cancelScheduledValues(now);
  t.gain.gain.setValueAtTime(t.gain.gain.value, now);
  const level = kind === "hold" || kind === "rest" ? volume * 0.45 : volume;
  t.gain.gain.linearRampToValueAtTime(level, now + Math.min(0.8, secs / 2));
  t.filter.frequency.setTargetAtTime(kind === "in" || kind === "top" ? 1100 : 600, now, secs / 3);
}

export function stopBreathTone() {
  if (!tone || !ctx) return;
  const t = tone;
  tone = null;
  const now = ctx.currentTime;
  t.gain.gain.cancelScheduledValues(now);
  t.gain.gain.setValueAtTime(t.gain.gain.value, now);
  t.gain.gain.linearRampToValueAtTime(0, now + 0.8);
  setTimeout(() => t.osc.forEach((o) => { try { o.stop(); } catch { /* ignore */ } }), 1000);
}

/* ------------------------------------------------------------------ */
/* Soundscapes under a session, from the same nature renders the       */
/* frequency sessions use.                                             */
/* ------------------------------------------------------------------ */


let scape: { src: AudioBufferSourceNode; gain: GainNode } | null = null;
let scapeToken = 0;

export async function startSoundscape(id: AmbienceId, volume = 0.5) {
  stopSoundscape();
  if (!ctx) return;
  const token = ++scapeToken;
  const { buffer, loopEnd } = await loadAmbience(ctx, id);
  if (token !== scapeToken || !ctx) return;
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.loop = true;
  src.loopEnd = loopEnd;
  const gain = ctx.createGain();
  gain.gain.value = 0;
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 2);
  src.connect(gain).connect(ctx.destination);
  src.start();
  scape = { src, gain };
}

/** Change the background volume while it plays. */
export function setSoundscapeVolume(volume: number) {
  if (!scape || !ctx) return;
  const now = ctx.currentTime;
  scape.gain.gain.cancelScheduledValues(now);
  scape.gain.gain.setValueAtTime(scape.gain.gain.value, now);
  scape.gain.gain.linearRampToValueAtTime(volume, now + 0.15);
}

export function stopSoundscape() {
  scapeToken++;
  if (!scape || !ctx) return;
  const s = scape;
  scape = null;
  const now = ctx.currentTime;
  s.gain.gain.cancelScheduledValues(now);
  s.gain.gain.setValueAtTime(s.gain.gain.value, now);
  s.gain.gain.linearRampToValueAtTime(0, now + 1.2);
  setTimeout(() => { try { s.src.stop(); } catch { /* ignore */ } }, 1400);
}
