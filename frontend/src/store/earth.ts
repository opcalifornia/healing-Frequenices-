import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUser } from "./user";
import { todayKey } from "./nourish";

/** One entry in the good deeds journal. */
export interface Deed {
  id: string;
  /** YYYY-MM-DD */
  date: string;
  text: string;
}

interface EarthState {
  /** Pledged habit ids, per profile. */
  pledges: Record<string, string[]>;
  /** Good deeds journal, newest first, per profile. */
  deeds: Record<string, Deed[]>;
  togglePledge(id: string): void;
  addDeed(text: string, date?: string): void;
  removeDeed(id: string): void;
}

const me = () => useUser.getState().activeProfileId ?? "guest";

export const useEarth = create<EarthState>()(
  persist(
    (set, get) => ({
      pledges: {},
      deeds: {},
      togglePledge(id) {
        const p = me();
        const mine = get().pledges[p] ?? [];
        set({ pledges: { ...get().pledges, [p]: mine.includes(id) ? mine.filter((x) => x !== id) : [...mine, id] } });
      },
      addDeed(text, date = todayKey()) {
        const t = text.trim();
        if (!t) return;
        const p = me();
        const deed: Deed = { id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`, date, text: t.slice(0, 280) };
        set({ deeds: { ...get().deeds, [p]: [deed, ...(get().deeds[p] ?? [])].slice(0, 500) } });
      },
      removeDeed(id) {
        const p = me();
        set({ deeds: { ...get().deeds, [p]: (get().deeds[p] ?? []).filter((d) => d.id !== id) } });
      },
    }),
    { name: "rooted-earth", version: 1 },
  ),
);

const NO_IDS: string[] = [];
const NO_DEEDS: Deed[] = [];

export function useMyPledges(): string[] {
  const p = useUser((s) => s.activeProfileId) ?? "guest";
  return useEarth((s) => s.pledges[p] ?? NO_IDS);
}

export function useMyDeeds(): Deed[] {
  const p = useUser((s) => s.activeProfileId) ?? "guest";
  return useEarth((s) => s.deeds[p] ?? NO_DEEDS);
}
