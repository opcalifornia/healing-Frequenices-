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
