import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUser } from "./user";
import { dayKey } from "../rooted/ritualLogic";

/** Heart-rate summaries from real (not demo) sessions, per profile, on this device. Only summaries are kept, never the raw readings. */
export interface HrRecord {
  day: string;
  at: number;
  technique: string;
  minutes: number;
  start: number;
  end: number;
  delta: number;
  hrvStart: number | null;
  hrvEnd: number | null;
  swing: number | null;
}
interface State {
  sessions: Record<string, HrRecord[]>;
  add(r: Omit<HrRecord, "day" | "at">): void;
}
const pid = () => useUser.getState().activeProfileId ?? "guest";

export const useHrSessions = create<State>()(
  persist(
    (set, get) => ({
      sessions: {},
      add(r) {
        const p = pid();
        const cur = get().sessions[p] ?? [];
        set({ sessions: { ...get().sessions, [p]: [...cur, { ...r, day: dayKey(), at: Date.now() }].slice(-200) } });
      },
    }),
    { name: "rooted-hr-sessions", version: 1 },
  ),
);
const EMPTY: HrRecord[] = [];
export function useMyHrSessions(): HrRecord[] {
  const p = useUser((s) => s.activeProfileId) ?? "guest";
  return useHrSessions((s) => s.sessions[p] ?? EMPTY);
}
