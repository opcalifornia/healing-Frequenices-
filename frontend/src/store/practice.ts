import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUser } from "./user";
import { todayKey } from "./nourish";

/** A log of non-audio practices (breathing, grounding, combos) for streaks and the hub. */
export interface PracticeEntry {
  day: string;
  kind: string;
  minutes: number;
}

interface PracticeState {
  logs: Record<string, PracticeEntry[]>;
  log(kind: string, minutes: number): void;
}

export const usePractice = create<PracticeState>()(
  persist(
    (set, get) => ({
      logs: {},
      log(kind, minutes) {
        const pid = useUser.getState().activeProfileId ?? "guest";
        const list = get().logs[pid] ?? [];
        set({ logs: { ...get().logs, [pid]: [...list, { day: todayKey(), kind, minutes: Math.round(minutes * 10) / 10 }].slice(-1000) } });
      },
    }),
    { name: "rooted-practice", version: 1 },
  ),
);

const EMPTY: PracticeEntry[] = [];
export function usePracticeLog(): PracticeEntry[] {
  const pid = useUser((s) => s.activeProfileId) ?? "guest";
  return usePractice((s) => s.logs[pid] ?? EMPTY);
}

/** Consecutive days with any practice, ending today (or yesterday if today has none yet). */
export function practiceStreak(entries: PracticeEntry[], now = new Date()): number {
  const days = new Set(entries.map((e) => e.day));
  const d = new Date(now);
  if (!days.has(todayKey(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (days.has(todayKey(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export const minutesOn = (entries: PracticeEntry[], day = todayKey()) => entries.filter((e) => e.day === day).reduce((a, e) => a + e.minutes, 0);
