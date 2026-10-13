import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUser } from "./user";
import type { AllergenId } from "../rooted/allergens";

/** The allergens each profile wants flagged on scans. Kept on this device only. */
interface State {
  byProfile: Record<string, AllergenId[]>;
  toggle(id: AllergenId, pid?: string): void;
}

const pidNow = () => useUser.getState().activeProfileId ?? "guest";

export const useAllergenStore = create<State>()(
  persist(
    (set) => ({
      byProfile: {},
      toggle: (id, pid = pidNow()) =>
        set((s) => {
          const cur = s.byProfile[pid] ?? [];
          return { byProfile: { ...s.byProfile, [pid]: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] } };
        }),
    }),
    { name: "rooted.allergens" },
  ),
);

const NONE: AllergenId[] = [];

export function useWatchedAllergens(): AllergenId[] {
  const pid = useUser((s) => s.activeProfileId) ?? "guest";
  return useAllergenStore((s) => s.byProfile[pid] ?? NONE);
}
