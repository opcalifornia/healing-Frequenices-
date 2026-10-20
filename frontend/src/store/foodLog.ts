import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUser } from "./user";
import type { Slot } from "./mealPlan";

/**
 * A light daily food log per profile: which planned meals were eaten, anything else, which food groups showed up, and
 * which plants. No calories, portions or targets are stored.
 */
export interface Extra {
  id: string;
  slot: Slot;
  text: string;
}
export interface DayLog {
  eaten?: Slot[];
  extras?: Extra[];
  groups?: string[];
  plants?: string[];
}

interface State {
  logs: Record<string, Record<string, DayLog>>;
  toggleEaten(day: string, slot: Slot): void;
  addExtra(day: string, slot: Slot, text: string): void;
  removeExtra(day: string, id: string): void;
  toggleGroup(day: string, group: string): void;
  addPlant(day: string, name: string): void;
  removePlant(day: string, name: string): void;
}

const pid = () => useUser.getState().activeProfileId ?? "guest";

export const useFoodLog = create<State>()(
  persist(
    (set, get) => {
      const edit = (day: string, fn: (d: DayLog) => DayLog) => {
        const p = pid();
        const mine = get().logs[p] ?? {};
        const next = { ...mine, [day]: fn(mine[day] ?? {}) };
        // About four months of history keeps the saved data small.
        const keep = Object.keys(next).sort().slice(-120);
        set({ logs: { ...get().logs, [p]: Object.fromEntries(keep.map((k) => [k, next[k]])) } });
      };
      return {
        logs: {},
        toggleEaten: (day, slot) => edit(day, (d) => ({ ...d, eaten: d.eaten?.includes(slot) ? d.eaten.filter((s) => s !== slot) : [...(d.eaten ?? []), slot] })),
        addExtra: (day, slot, text) => edit(day, (d) => ({ ...d, extras: [...(d.extras ?? []), { id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`, slot, text: text.trim().slice(0, 80) }] })),
        removeExtra: (day, id) => edit(day, (d) => ({ ...d, extras: (d.extras ?? []).filter((e) => e.id !== id) })),
        toggleGroup: (day, g) => edit(day, (d) => ({ ...d, groups: d.groups?.includes(g) ? d.groups.filter((x) => x !== g) : [...(d.groups ?? []), g] })),
        addPlant: (day, name) =>
          edit(day, (d) => {
            const n = name.trim().slice(0, 40);
            if (!n || d.plants?.some((x) => x.toLowerCase() === n.toLowerCase())) return d;
            return { ...d, plants: [...(d.plants ?? []), n] };
          }),
        removePlant: (day, name) => edit(day, (d) => ({ ...d, plants: (d.plants ?? []).filter((x) => x !== name) })),
      };
    },
    { name: "rooted-foodlog", version: 1 },
  ),
);

const EMPTY: Record<string, DayLog> = {};
export function useMyLog(): Record<string, DayLog> {
  const p = useUser((s) => s.activeProfileId) ?? "guest";
  return useFoodLog((s) => s.logs[p] ?? EMPTY);
}
