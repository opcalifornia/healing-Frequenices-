import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUser } from "./user";

/** Who someone is and what they want from Rooted. Drives the daily plan and safety flags. Stored on this device. */

export type GoalId = "sleep" | "stress" | "energy" | "focus" | "eat" | "move" | "aches" | "connect";
export type Activity = "low" | "some" | "active";
export type Consideration = "pregnant" | "heart" | "bp" | "epilepsy" | "diabetes" | "thinners" | "mobility" | "eating";

export interface AboutYou {
  goals: GoalId[];
  activity: Activity;
  minutes: 5 | 10 | 20;
  considerations: Consideration[];
  onboarded: boolean;
  skipped?: boolean;
  /** The 60-second first session: what brought them here and how it went. */
  firstWin?: { goal: GoalId; before: number; after: number; day: string };
}

export const DEFAULT_ABOUT: AboutYou = { goals: [], activity: "some", minutes: 10, considerations: [], onboarded: false };

export const GOALS: Array<{ id: GoalId; label: string; blurb: string; hue: number }> = [
  { id: "sleep", label: "Sleep better", blurb: "Fall asleep easier, wake up rested", hue: 255 },
  { id: "stress", label: "Feel calmer", blurb: "Less stress and anxiety", hue: 190 },
  { id: "energy", label: "More energy", blurb: "Feel awake and steady all day", hue: 35 },
  { id: "focus", label: "Focus", blurb: "Clearer thinking, deeper work", hue: 220 },
  { id: "eat", label: "Eat better", blurb: "Simple, science-backed food habits", hue: 90 },
  { id: "move", label: "Move more", blurb: "Gentle, everyday activity", hue: 15 },
  { id: "aches", label: "Ease aches", blurb: "Less stiffness and back pain", hue: 300 },
  { id: "connect", label: "Less screen time", blurb: "More time offline, with people", hue: 140 },
];

export const ACTIVITY: Array<{ id: Activity; label: string; blurb: string }> = [
  { id: "low", label: "Just starting", blurb: "I don't move much right now" },
  { id: "some", label: "Somewhat active", blurb: "I walk or exercise now and then" },
  { id: "active", label: "Very active", blurb: "I exercise most days" },
];

export const CONSIDERATIONS: Array<{ id: Consideration; label: string }> = [
  { id: "pregnant", label: "Pregnant or breastfeeding" },
  { id: "heart", label: "A heart condition" },
  { id: "bp", label: "High or low blood pressure" },
  { id: "epilepsy", label: "Epilepsy or seizures" },
  { id: "diabetes", label: "Diabetes or blood sugar medicine" },
  { id: "thinners", label: "Blood thinners" },
  { id: "mobility", label: "Limited mobility, or I prefer seated moves" },
  { id: "eating", label: "A history of disordered eating" },
];

interface WellnessState {
  about: Record<string, AboutYou>;
  setAbout(patch: Partial<AboutYou>): void;
}

export const useWellness = create<WellnessState>()(
  persist(
    (set, get) => ({
      about: {},
      setAbout(patch) {
        const pid = useUser.getState().activeProfileId ?? "guest";
        set({ about: { ...get().about, [pid]: { ...DEFAULT_ABOUT, ...get().about[pid], ...patch } } });
      },
    }),
    { name: "rooted-wellness", version: 1 },
  ),
);

export function useAbout(): AboutYou {
  const pid = useUser((s) => s.activeProfileId) ?? "guest";
  return useWellness((s) => s.about[pid] ?? DEFAULT_ABOUT);
}

/** Things to avoid or approach carefully, given someone's considerations. */
export function flags(c: Consideration[]) {
  const has = (x: Consideration) => c.includes(x);
  return {
    noPowerBreathing: has("pregnant") || has("heart") || has("bp") || has("epilepsy"),
    noFasting: has("pregnant") || has("diabetes") || has("eating"),
    careSauna: has("pregnant") || has("heart") || has("bp"),
    seated: has("mobility"),
    careHerbs: has("pregnant") || has("thinners") || has("diabetes") || has("bp"),
    breathHoldCare: has("pregnant") || has("heart") || has("epilepsy"),
  };
}
