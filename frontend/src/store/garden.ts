import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUser } from "./user";
import { todayKey } from "./nourish";

/** What someone is growing, with the day it was planted. */
export interface Planting {
  plantId: string;
  planted: string;
}

interface GardenState {
  beds: Record<string, Planting[]>;
  plant(id: string, day?: string): void;
  remove(id: string): void;
}

export const useGarden = create<GardenState>()(
  persist(
    (set, get) => ({
      beds: {},
      plant(id, day = todayKey()) {
        const p = useUser.getState().activeProfileId ?? "guest";
        const mine = (get().beds[p] ?? []).filter((x) => x.plantId !== id);
        set({ beds: { ...get().beds, [p]: [...mine, { plantId: id, planted: day }] } });
      },
      remove(id) {
        const p = useUser.getState().activeProfileId ?? "guest";
        set({ beds: { ...get().beds, [p]: (get().beds[p] ?? []).filter((x) => x.plantId !== id) } });
      },
    }),
    { name: "rooted-garden", version: 1 },
  ),
);

const EMPTY: Planting[] = [];
export function useMyGarden(): Planting[] {
  const p = useUser((s) => s.activeProfileId) ?? "guest";
  return useGarden((s) => s.beds[p] ?? EMPTY);
}

export function daysSince(day: string, now = new Date()): number {
  const [y, m, d] = day.split("-").map(Number);
  const then = new Date(y, m - 1, d);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.max(0, Math.round((today.getTime() - then.getTime()) / 86400000));
}
