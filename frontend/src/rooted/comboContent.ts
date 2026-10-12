import type { GoalId } from "../store/wellness";
import type { flags } from "../store/wellness";
import type { Strength } from "../learn/brainContent";

type FlagKey = keyof ReturnType<typeof flags>;

export type ComboStep =
  | { type: "breath"; technique: string; minutes: number; alt?: { technique: string; minutes: number; when: FlagKey } }
  | { type: "move"; routine: string; minutes?: number; skipIf?: FlagKey; alt?: { routine: string; minutes?: number; when: FlagKey } }
  | { type: "check"; title: string; body: string; action?: "water" }
  | { type: "timer"; title: string; body: string; secs: number }
  | { type: "reflect"; prompt: string; lines: number; hint: string }
  | { type: "ground" }
  | { type: "frequency"; goal: "sleep" | "relax" | "focus" | "energize" | "meditate"; title: string };

export interface Combo {
  id: string;
  name: string;
  tagline: string;
  why: string;
  evidence: Strength;
  goals: GoalId[];
  when: "morning" | "midday" | "evening" | "any";
  hue: number;
  hue2: number;
  steps: ComboStep[];
}

export const COMBOS: Combo[] = [
  {
    id: "evening", name: "Evening Reset", tagline: "From wired to winding down", when: "evening", hue: 255, hue2: 300, goals: ["sleep", "stress"], evidence: "Moderate",
    why: "Each piece has its own evidence: dim light and no screens before bed, slow breathing, muscle relaxation, and a calming sound. Together they give your body a clear signal that the day is over.",
    steps: [
      { type: "check", title: "Dim the lights", body: "Switch to lamps or warm, low light. Put your phone on the charger outside the bedroom if you can." },
      { type: "breath", technique: "478", minutes: 2, alt: { technique: "calm", minutes: 2, when: "breathHoldCare" } },
      { type: "move", routine: "bedtime" },
      { type: "reflect", prompt: "Three good things from today", lines: 3, hint: "Small is fine: a good cup of coffee, a kind text, the sky on the way home." },
      { type: "frequency", goal: "sleep", title: "Drift off with a sleep session" },
    ],
  },
  {
    id: "morning", name: "Morning Armor", tagline: "Light, water, breath, go", when: "morning", hue: 40, hue2: 15, goals: ["energy", "focus"], evidence: "Moderate",
    why: "Morning daylight sets your body clock and helps you feel alert, water replaces what you lost overnight, and a few minutes of breathing and movement wake up your body before the day starts pulling at you.",
    steps: [
      { type: "check", title: "Get some daylight", body: "Open the curtains or step outside for a few minutes. Outdoor light, even on a cloudy day, is far brighter than indoor light." },
      { type: "check", title: "Drink a glass of water", body: "We'll log 250 ml for you.", action: "water" },
      { type: "breath", technique: "power", minutes: 0, alt: { technique: "calm", minutes: 3, when: "noPowerBreathing" } },
      { type: "move", routine: "wake", alt: { routine: "desk", when: "seated" } },
      { type: "frequency", goal: "focus", title: "Start your day with a focus session" },
    ],
  },
  {
    id: "sos", name: "Gentle Reset", tagline: "Three minutes back to calm", when: "any", hue: 195, hue2: 160, goals: ["stress"], evidence: "Moderate",
    why: "Cyclic sighing is one of the fastest ways to lower arousal, grounding pulls your attention out of the spiral and into the room, and slow breathing keeps you there.",
    steps: [
      { type: "breath", technique: "sigh", minutes: 1 },
      { type: "ground" },
      { type: "breath", technique: "calm", minutes: 1 },
    ],
  },
  {
    id: "midday", name: "Midday Reset", tagline: "Undo the morning slump", when: "midday", hue: 140, hue2: 90, goals: ["energy", "aches", "move"], evidence: "Moderate",
    why: "Breaking up sitting, light walking after a meal, and a glass of water are simple, well-supported ways to steady energy and blood sugar in the afternoon.",
    steps: [
      { type: "move", routine: "desk" },
      { type: "check", title: "Refill your water", body: "We'll log 250 ml for you.", action: "water" },
      { type: "move", routine: "walk", minutes: 5, skipIf: "seated" },
      { type: "breath", technique: "box", minutes: 2, alt: { technique: "calm", minutes: 2, when: "breathHoldCare" } },
    ],
  },
  {
    id: "focus", name: "Focus Launch", tagline: "Clear the decks, then go deep", when: "any", hue: 220, hue2: 260, goals: ["focus"], evidence: "Weak",
    why: "Removing your phone from sight reduces distraction, and a short breathing practice settles you before you start. The evidence for binaural beats and focus is mixed, so treat the session as a pleasant, consistent start signal.",
    steps: [
      { type: "check", title: "Clear your space", body: "Phone in another room or a drawer. Close the tabs you don't need. Decide the one thing you'll work on." },
      { type: "breath", technique: "box", minutes: 2, alt: { technique: "calm", minutes: 2, when: "breathHoldCare" } },
      { type: "frequency", goal: "focus", title: "Deep work with a focus session" },
    ],
  },
  {
    id: "sunday", name: "Sunday Restore", tagline: "A slower reset for the week ahead", when: "any", hue: 280, hue2: 175, goals: ["stress", "aches", "connect"], evidence: "Moderate",
    why: "Gentle yoga eases stiffness and stress, a moment of reflection helps you choose what matters, and reaching out to someone is one of the most reliable mood boosters there is.",
    steps: [
      { type: "move", routine: "yoga", alt: { routine: "desk", when: "seated" } },
      { type: "reflect", prompt: "What do you want more of this week?", lines: 2, hint: "More sleep, more time outside, more laughing with friends. Anything." },
      { type: "check", title: "Reach out to someone", body: "Send a message or call someone you care about. No reason needed." },
      { type: "frequency", goal: "meditate", title: "Settle in with a meditation session" },
    ],
  },
  {
    id: "gratitude", name: "Gratitude Minute", tagline: "Write it down, breathe it in", when: "any", hue: 30, hue2: 340, goals: ["connect", "stress"], evidence: "Mixed",
    why: "Regularly writing down things you're grateful for is linked with better mood in many studies, though effects are modest. Pairing it with slow breathing makes it a calm minute either way.",
    steps: [
      { type: "reflect", prompt: "Three things you're grateful for", lines: 3, hint: "People, moments, things you usually take for granted." },
      { type: "breath", technique: "calm", minutes: 1 },
    ],
  },
];

export const STEP_LABEL: Record<ComboStep["type"], string> = { breath: "Breathe", move: "Move", check: "Habit", timer: "Pause", reflect: "Reflect", ground: "Ground", frequency: "Listen" };

import { TECHNIQUES } from "./breathContent";
import { ROUTINES } from "./moveContent";
import { buildPlan, planSeconds } from "./breathPlan";

/** Apply someone's safety flags: swap in alternatives and drop steps that don't fit. */
export function resolveSteps(c: Combo, f: Record<FlagKey, boolean>): ComboStep[] {
  const out: ComboStep[] = [];
  for (const s of c.steps) {
    if (s.type === "breath" && s.alt && f[s.alt.when]) out.push({ type: "breath", technique: s.alt.technique, minutes: s.alt.minutes });
    else if (s.type === "move" && s.skipIf && f[s.skipIf]) continue;
    else if (s.type === "move" && s.alt && f[s.alt.when]) out.push({ type: "move", routine: s.alt.routine, minutes: s.alt.minutes });
    else out.push(s);
  }
  return out;
}

/** Rough minutes for the active steps (the closing listening session isn't counted). */
export function comboMinutes(steps: ComboStep[]): number {
  let secs = 0;
  for (const s of steps) {
    if (s.type === "breath") {
      const t = TECHNIQUES.find((x) => x.id === s.technique);
      if (t) secs += planSeconds(buildPlan(t, s.minutes)) + (t.rounds ? t.rounds.count * 45 : 0);
    } else if (s.type === "move") {
      const r = ROUTINES.find((x) => x.id === s.routine);
      if (r) secs += s.minutes ? s.minutes * 60 : r.minutes * 60;
    } else if (s.type === "reflect") secs += 60;
    else if (s.type === "ground") secs += 90;
    else if (s.type === "timer") secs += s.secs;
    else if (s.type === "check") secs += 30;
  }
  return Math.max(1, Math.round(secs / 60));
}
