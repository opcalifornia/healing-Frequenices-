import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUser } from "./user";

/**
 * A weekly meal plan per profile, kept on this device (and synced with the account like the rest of Nourish).
 * Each slot holds a recipe, or a short note such as "Leftovers" or "Eating out".
 */
export type Slot = "breakfast" | "lunch" | "dinner";
export const SLOTS: Slot[] = ["breakfast", "lunch", "dinner"];
export const SLOT_LABEL: Record<Slot, string> = { breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner" };

export interface MealEntry {
  recipeId?: string;
  /** A free note, used when there is no recipe. */
  text?: string;
}
export type DayPlan = Partial<Record<Slot, MealEntry>>;

interface State {
  /** profile id, then date key (YYYY-MM-DD). */
  plans: Record<string, Record<string, DayPlan>>;
  setMeal(day: string, slot: Slot, entry: MealEntry | null): void;
  setMany(changes: Array<{ day: string; slot: Slot; entry: MealEntry }>): void;
  clearDays(days: string[]): void;
}

const pid = () => useUser.getState().activeProfileId ?? "guest";

export const useMealPlan = create<State>()(
  persist(
    (set, get) => {
      const edit = (fn: (mine: Record<string, DayPlan>) => Record<string, DayPlan>) => {
        const p = pid();
        const mine = get().plans[p] ?? {};
        const next = fn(mine);
        // Keep about four months so the saved data stays small.
        const keep = Object.keys(next).sort().slice(-120);
        set({ plans: { ...get().plans, [p]: Object.fromEntries(keep.map((k) => [k, next[k]])) } });
      };
      return {
        plans: {},
        setMeal(day, slot, entry) {
          edit((mine) => {
            const d = { ...(mine[day] ?? {}) };
            if (entry) d[slot] = entry;
            else delete d[slot];
            return { ...mine, [day]: d };
          });
        },
        setMany(changes) {
          edit((mine) => {
            const out = { ...mine };
            for (const c of changes) out[c.day] = { ...(out[c.day] ?? {}), [c.slot]: c.entry };
            return out;
          });
        },
        clearDays(days) {
          edit((mine) => {
            const out = { ...mine };
            for (const d of days) delete out[d];
            return out;
          });
        },
      };
    },
    { name: "rooted-mealplan", version: 1 },
  ),
);

const EMPTY: Record<string, DayPlan> = {};
export function useMyPlan(): Record<string, DayPlan> {
  const p = useUser((s) => s.activeProfileId) ?? "guest";
  return useMealPlan((s) => s.plans[p] ?? EMPTY);
}
