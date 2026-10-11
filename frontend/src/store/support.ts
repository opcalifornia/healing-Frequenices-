import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUser } from "./user";
import { todayKey } from "./nourish";
import type { PlanStepId } from "../rooted/supportContent";

/** Safety plan and mood check-ins, per profile, on this device only. */

export type SafetyPlan = Partial<Record<PlanStepId, string[]>>;
export type Mood = 1 | 2 | 3 | 4 | 5;

interface SupportState {
  plans: Record<string, SafetyPlan>;
  moods: Record<string, Record<string, Mood>>;
  setStep(id: PlanStepId, lines: string[]): void;
  setMood(m: Mood): void;
}

const pid = () => useUser.getState().activeProfileId ?? "guest";

export const useSupport = create<SupportState>()(
  persist(
    (set, get) => ({
      plans: {},
      moods: {},
      setStep(id, lines) {
        const p = pid();
        set({ plans: { ...get().plans, [p]: { ...get().plans[p], [id]: lines } } });
      },
      setMood(m) {
        const p = pid();
        const mine = get().moods[p] ?? {};
        const days = Object.keys(mine).sort().slice(-120);
        set({ moods: { ...get().moods, [p]: { ...Object.fromEntries(days.map((d) => [d, mine[d]])), [todayKey()]: m } } });
      },
    }),
    { name: "rooted-support", version: 1 },
  ),
);

const EMPTY_PLAN: SafetyPlan = {};
export function useSafetyPlan(): SafetyPlan {
  const p = useUser((s) => s.activeProfileId) ?? "guest";
  return useSupport((s) => s.plans[p] ?? EMPTY_PLAN);
}
export function useTodayMood(): Mood | undefined {
  const p = useUser((s) => s.activeProfileId) ?? "guest";
  return useSupport((s) => s.moods[p]?.[todayKey()]);
}
export function useMoods(): Record<string, Mood> {
  const p = useUser((s) => s.activeProfileId) ?? "guest";
  return useSupport((s) => s.moods[p]) ?? {};
}

/** Pull a phone number out of a line like "Sam, 555-123-4567". */
export function phoneIn(line: string): string | null {
  const m = line.match(/(\+?\d[\d\s().-]{6,}\d)/);
  return m ? m[1].replace(/[^\d+]/g, "") : null;
}

/** Whether to open the crisis sheet, shared app-wide. */
export const useCrisis = create<{ open: boolean; show(): void; hide(): void }>((set) => ({
  open: false,
  show: () => set({ open: true }),
  hide: () => set({ open: false }),
}));
