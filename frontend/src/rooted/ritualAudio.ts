import { BinauralEngine, DEFAULT_MIX } from "../audio/engine";
import { usePlayer } from "../store/player";
import type { Ambient } from "../store/rituals";
import type { Ritual } from "./rituals";

/**
 * Plays a ritual's binaural session with the app's live Web Audio engine: the left carrier goes only to the left ear,
 * the right carrier (left plus the beat) only to the right. The beat and right tone glide in a straight line from the
 * start value to the end value over the whole session, and the volume fades out over the last `fadeOutMin` minutes.
 *
 * It uses its own engine and a hidden <audio> element, so audio keeps playing with the screen off or the app in the
 * background on phones, and it never fights the main player.
 */

let element: HTMLAudioElement | null = null;
let engine: BinauralEngine | null = null;

function getEngine(): BinauralEngine {
  if (!engine) {
    if (!element && typeof document !== "undefined") {
      element = document.createElement("audio");
      element.setAttribute("playsinline", "");
      element.hidden = true;
      document.body.appendChild(element);
    }
    engine = new BinauralEngine(undefined, { mediaElement: element });
  }
  return engine;
}

/** Quiet beds sit well under the tones. */
const BED_MIX = { ...DEFAULT_MIX, binaural: 1, isochronic: 0, solfeggio: 0, noise: 0.16, ambience: 0.22, music: 0 };

export class RitualAudio {
  constructor(private ritual: Ritual, private totalSec: number, private fadeSec: number, private e: BinauralEngine = getEngine()) {}

  /** Tap-time unlock plus a one-ear test tone, used by the headphones prompt. */
  testEar(side: "left" | "right") {
    return this.e.channelTest(side);
  }

  /** Call from a tap. */
  start(ambient: Ambient, volume: number) {
    // Only one thing plays at a time.
    if (typeof window !== "undefined") usePlayer.getState().stop();
    const s = this.ritual.session;
    this.e.start(
      { carrier: s.carrierHz, beat: s.beatHz.start, noise: ambient === "pink" ? "pink" : null, ambience: ambient === "rain" ? "rain" : null, solfeggio: null, isochronic: false, mix: BED_MIX, volume },
      3,
    );
    this.glide();
  }

  /** One straight-line ramp of the beat from now to the end of the session. */
  private glide(remainingSec = this.totalSec) {
    const s = this.ritual.session;
    if (s.beatHz.start !== s.beatHz.end) this.e.setCarrierBeat(s.carrierHz, s.beatHz.end, remainingSec);
  }

  pause() {
    return this.e.pause(0.6);
  }
  resume() {
    this.e.resume(0.8);
  }
  setVolume(v: number) {
    this.e.setVolume(v);
  }
  setAmbient(a: Ambient) {
    this.e.setLayers({ noise: a === "pink" ? "pink" : null, ambience: a === "rain" ? "rain" : null });
  }

  /** Call about once a second. In the last `fadeSec` the level follows the time left, so pausing and resuming can't undo the fade. */
  tick(remainingSec: number) {
    if (remainingSec <= this.fadeSec) {
      this.e.fadeTo(Math.max(0, remainingSec / this.fadeSec), 1);
    }
  }

  stop(fade = 1.5) {
    return this.e.stop(fade);
  }
  get frequencies() {
    return this.e.readFrequencies();
  }
}
