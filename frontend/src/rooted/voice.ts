/**
 * Spoken breathing cues. Uses recorded clips when they exist (drop files
 * into public/audio/voice/ named after the cue: in.mp3, hold.mp3, out.mp3,
 * top.mp3, rest.mp3, done.mp3), and falls back to the device's built-in
 * speech voice otherwise.
 */

export type VoiceCue = "in" | "top" | "hold" | "out" | "rest" | "done";

const WORDS: Record<VoiceCue, string> = {
  in: "Breathe in",
  top: "Sip in a little more",
  hold: "Hold",
  out: "Breathe out",
  rest: "Hold",
  done: "Well done. Let your breath return to normal.",
};

const clipOk = new Map<VoiceCue, boolean>();
const base = `${import.meta.env.BASE_URL ?? "/"}audio/voice/`;

async function hasClip(cue: VoiceCue): Promise<boolean> {
  if (clipOk.has(cue)) return clipOk.get(cue)!;
  try {
    const res = await fetch(`${base}${cue}.mp3`, { method: "HEAD" });
    const ok = res.ok && (res.headers.get("content-type") ?? "").includes("audio");
    clipOk.set(cue, ok);
    return ok;
  } catch {
    clipOk.set(cue, false);
    return false;
  }
}

let voice: SpeechSynthesisVoice | null = null;
function pickVoice(): SpeechSynthesisVoice | null {
  if (voice || typeof speechSynthesis === "undefined") return voice;
  const all = speechSynthesis.getVoices().filter((v) => v.lang.startsWith("en"));
  // Prefer the gentler, more natural voices most platforms ship.
  const preferred = ["Samantha", "Ava", "Allison", "Google US English", "Microsoft Aria", "Microsoft Jenny", "Karen", "Moira", "Serena"];
  voice = preferred.map((n) => all.find((v) => v.name.includes(n))).find(Boolean) ?? all.find((v) => v.localService) ?? all[0] ?? null;
  return voice;
}
if (typeof speechSynthesis !== "undefined") speechSynthesis.onvoiceschanged = () => { voice = null; pickVoice(); };

let current: HTMLAudioElement | null = null;

export const voiceSupported = () => typeof speechSynthesis !== "undefined";

/** Speak a cue. Phases shorter than about two seconds are too quick to speak over, so they're skipped. */
export async function speakCue(cue: VoiceCue, secs = 3, volume = 0.9) {
  if (secs < 2 && cue !== "done") return;
  stopVoice();
  if (await hasClip(cue)) {
    current = new Audio(`${base}${cue}.mp3`);
    current.volume = volume;
    void current.play().catch(() => undefined);
    return;
  }
  if (!voiceSupported()) return;
  const u = new SpeechSynthesisUtterance(WORDS[cue]);
  const v = pickVoice();
  if (v) u.voice = v;
  u.rate = 0.82;
  u.pitch = 0.92;
  u.volume = volume;
  speechSynthesis.speak(u);
}

export function stopVoice() {
  current?.pause();
  current = null;
  if (voiceSupported()) speechSynthesis.cancel();
}
