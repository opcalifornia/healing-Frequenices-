import type { Strength } from "../learn/brainContent";
import type { Source } from "./pantryContent";

export type PhaseKind = "in" | "top" | "hold" | "out" | "rest";
export interface Phase {
  kind: PhaseKind;
  secs: number;
  say: string;
}

export interface Technique {
  id: string;
  name: string;
  short: string;
  when: string;
  /** One cycle; repeats until time is up. */
  cycle: Phase[];
  minutes: number[];
  evidence: Strength;
  why: string;
  sources: Source[];
  hue: number;
  /** Goal of a frequency session to suggest afterwards. */
  next: "relax" | "sleep" | "focus" | "energize" | "meditate";
  /** Needs the safety gate before it starts. */
  gated?: boolean;
  /** Power breathing runs rounds instead of a fixed cycle. */
  rounds?: { breaths: number; maxHold: number; recoveryHold: number; count: number };
}

const BALBAN: Source = { text: "Balban MY et al. Brief structured respiration practices enhance mood and reduce physiological arousal. Cell Reports Medicine, 2023", url: "https://doi.org/10.1016/j.xcrm.2022.100895" };

export const TECHNIQUES: Technique[] = [
  {
    id: "calm", name: "Calm down", short: "4 in · 6 out", when: "Any time you feel wound up. The best place to start.",
    cycle: [{ kind: "in", secs: 4, say: "Breathe in" }, { kind: "out", secs: 6, say: "Breathe out" }],
    minutes: [1, 3, 5], evidence: "Moderate", hue: 160, next: "relax",
    why: "Breathing out for longer than you breathe in, at around six breaths a minute, shifts your body toward its calm, rest-and-digest mode. Slow-paced breathing reliably raises heart rate variability, a marker of that shift.",
    sources: [{ text: "Lehrer P et al. Heart rate variability biofeedback improves emotional and physical health and performance: a systematic review and meta-analysis. Appl Psychophysiol Biofeedback, 2020", url: "https://doi.org/10.1007/s10484-020-09466-z" }],
  },
  {
    id: "sigh", name: "Physiological sigh", short: "In, top up, long out", when: "The fastest reset when stress spikes. Even one or two help.",
    cycle: [{ kind: "in", secs: 2.5, say: "Breathe in through your nose" }, { kind: "top", secs: 1, say: "Sip in a little more" }, { kind: "out", secs: 6, say: "Long, slow breath out" }],
    minutes: [1, 3, 5], evidence: "Moderate", hue: 200, next: "relax",
    why: "In a Stanford trial of 111 people, five minutes a day of cyclic sighing for a month improved mood and lowered breathing rate more than mindfulness meditation did. The double inhale re-opens tiny air sacs in the lungs; the long exhale slows the heart.",
    sources: [BALBAN],
  },
  {
    id: "box", name: "Box breathing", short: "4 · 4 · 4 · 4", when: "Before a big moment: a meeting, a game, a hard conversation.",
    cycle: [{ kind: "in", secs: 4, say: "Breathe in" }, { kind: "hold", secs: 4, say: "Hold" }, { kind: "out", secs: 4, say: "Breathe out" }, { kind: "rest", secs: 4, say: "Hold" }],
    minutes: [2, 4, 6], evidence: "Weak", hue: 230, next: "focus",
    why: "Used by military and first responders to stay steady under pressure. In the same Stanford trial, box breathing improved mood too, a little less than cyclic sighing. Research on it alone is limited.",
    sources: [BALBAN],
  },
  {
    id: "478", name: "4-7-8 breathing", short: "4 in · 7 hold · 8 out", when: "In bed, to help you drift off. Popularized by Dr. Andrew Weil.",
    cycle: [{ kind: "in", secs: 4, say: "Breathe in through your nose" }, { kind: "hold", secs: 7, say: "Hold" }, { kind: "out", secs: 8, say: "Whoosh out through your mouth" }],
    minutes: [1, 2, 4], evidence: "Weak", hue: 265, next: "sleep",
    why: "A very long exhale with a hold slows breathing to about three breaths a minute. Small studies show short-term drops in heart rate and blood pressure. It may feel light-headed at first; start with four cycles.",
    sources: [{ text: "Vierra J et al. Effects of sleep deprivation and 4-7-8 breathing control on heart rate variability, blood pressure, blood glucose, and endothelial function in healthy young adults. Physiol Rep, 2022" }],
  },
  {
    id: "coherent", name: "Coherent breathing", short: "5.5 in · 5.5 out", when: "A steady 10-minute practice for everyday resilience.",
    cycle: [{ kind: "in", secs: 5.5, say: "Breathe in" }, { kind: "out", secs: 5.5, say: "Breathe out" }],
    minutes: [5, 10, 20], evidence: "Moderate", hue: 180, next: "meditate",
    why: "About five and a half breaths a minute lines your breathing up with your heart's natural rhythm (resonance). A meta-analysis of 58 studies found practicing this pace improves anxiety, stress and mood.",
    sources: [{ text: "Lehrer P et al. Appl Psychophysiol Biofeedback, 2020", url: "https://doi.org/10.1007/s10484-020-09466-z" }],
  },
  {
    id: "power", name: "Power breathing", short: "Rounds of deep breaths and holds", when: "Morning energy. Inspired by the Wim Hof style. Sit or lie down.",
    cycle: [{ kind: "in", secs: 1.6, say: "Deep breath in" }, { kind: "out", secs: 1.4, say: "Let go" }],
    minutes: [], evidence: "Mixed", hue: 25, next: "energize", gated: true,
    rounds: { breaths: 30, maxHold: 90, recoveryHold: 15, count: 3 },
    why: "Fast, deep breathing followed by a breath hold. In the Stanford trial it raised energy and mood. A well-known 2014 study found trained practitioners had a dampened immune response to a bacterial toxin. It's powerful, and it can make you faint.",
    sources: [BALBAN, { text: "Kox M et al. Voluntary activation of the sympathetic nervous system and attenuation of the innate immune response in humans. PNAS, 2014", url: "https://doi.org/10.1073/pnas.1322174111" }],
  },
];

export const POWER_SAFETY = [
  "Only do this sitting or lying down. Never while driving, in or near water (including the bath or shower), or standing.",
  "Tingling and light-headedness are common. If you feel faint, stop and breathe normally.",
  "Skip it if you are pregnant, or have epilepsy, heart disease, high blood pressure, a history of fainting, or panic attacks, unless your doctor says it's okay.",
];

/** 5-4-3-2-1 grounding: a classic way to come back to the present during anxiety. */
export const GROUNDING = [
  { n: 5, sense: "see", prompt: "Name five things you can see. Small ones count: a crack in the ceiling, light on a cup." },
  { n: 4, sense: "feel", prompt: "Notice four things you can feel: your feet on the floor, the fabric of your shirt, the air on your skin." },
  { n: 3, sense: "hear", prompt: "Listen for three sounds, near and far." },
  { n: 2, sense: "smell", prompt: "Find two things you can smell, or two smells you like." },
  { n: 1, sense: "taste", prompt: "Notice one thing you can taste. Then take one slow breath." },
];

/** Progressive muscle relaxation: tense for 5 seconds, release for 10. */
export const PMR = [
  "Hands: make tight fists",
  "Arms: bend your elbows and tighten your biceps",
  "Shoulders: lift them up toward your ears",
  "Face: scrunch your eyes and forehead",
  "Jaw: clench your teeth gently",
  "Stomach: tighten your belly",
  "Legs: press your knees together and tighten your thighs",
  "Feet: curl your toes down",
];
export const PMR_SOURCE: Source = { text: "Toussaint L et al. Effectiveness of progressive muscle relaxation, deep breathing, and guided imagery in promoting psychological and physiological states of relaxation. Evid Based Complement Alternat Med, 2021", url: "https://doi.org/10.1155/2021/5924040" };
