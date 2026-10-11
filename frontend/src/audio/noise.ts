import type { NoiseColor } from "../types";

/** Seconds at the end of each buffer that are blended into its start. Loop
 *  sources should set `loopEnd = buffer.duration - LOOP_TAIL`. */
export const LOOP_TAIL = 0.25;

/** Generates a looping stereo noise buffer. Left and right are independent so
 *  the bed feels wide and does not interfere with the binaural tones. */
export function makeNoiseBuffer(ctx: BaseAudioContext, color: NoiseColor, seconds = 12): AudioBuffer {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    if (color === "pink") fillPink(data);
    else fillBrown(data);
    crossfadeLoop(data, Math.floor(ctx.sampleRate * LOOP_TAIL));
  }
  return buffer;
}

/** Paul Kellet's refined pink filter (-3 dB/octave). */
function fillPink(out: Float32Array) {
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < out.length; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.969 * b2 + white * 0.153852;
    b3 = 0.8665 * b3 + white * 0.3104856;
    b4 = 0.55 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.016898;
    out[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
    b6 = white * 0.115926;
  }
}

/** Brownian (-6 dB/octave) noise via a leaky integrator. */
function fillBrown(out: Float32Array) {
  let last = 0;
  for (let i = 0; i < out.length; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    out[i] = last * 3.5;
  }
}

/** Blend the tail into the head so looping over [0, len - n) is seamless:
 *  the sample after data[len - n - 1] is data[len - n], which now equals data[0]. */
function crossfadeLoop(data: Float32Array, n: number) {
  const len = data.length;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    data[i] = data[i] * t + data[len - n + i] * (1 - t);
  }
}
