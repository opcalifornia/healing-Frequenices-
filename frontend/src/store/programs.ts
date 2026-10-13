import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUser } from "./user";
import { todayKey } from "./nourish";

export interface Enrollment {
  started: string;
  /** Day index → the date it was completed. */
  done: Record<number, string>;
}

interface ProgramState {
  enrolled: Record<string, Record<string, Enrollment>>;
  enroll(programId: string): void;
  completeDay(programId: string, day: number): void;
  reset(programId: string): void;
}

const pid = () => useUser.getState().activeProfileId ?? "guest";

export const usePrograms = create<ProgramState>()(
  persist(
    (set, get) => ({
      enrolled: {},
      enroll(programId) {
        const p = pid();
        const mine = get().enrolled[p] ?? {};
        if (mine[programId]) return;
        set({ enrolled: { ...get().enrolled, [p]: { ...mine, [programId]: { started: todayKey(), done: {} } } } });
      },
      completeDay(programId, day) {
        const p = pid();
        const mine = get().enrolled[p] ?? {};
        const e = mine[programId] ?? { started: todayKey(), done: {} };
        set({ enrolled: { ...get().enrolled, [p]: { ...mine, [programId]: { ...e, done: { ...e.done, [day]: todayKey() } } } } });
      },
      reset(programId) {
        const p = pid();
        const mine = { ...(get().enrolled[p] ?? {}) };
        delete mine[programId];
        set({ enrolled: { ...get().enrolled, [p]: mine } });
      },
    }),
    { name: "rooted-programs", version: 1 },
  ),
);

const EMPTY: Record<string, Enrollment> = {};
export function useEnrollments(): Record<string, Enrollment> {
  const p = useUser((s) => s.activeProfileId) ?? "guest";
  return usePrograms((s) => s.enrolled[p] ?? EMPTY);
}

/** The next day to do, and whether today's lesson is already done (so the next is suggested for tomorrow). */
export function nextDay(e: Enrollment | undefined, total: number): { index: number; doneToday: boolean; finished: boolean } {
  if (!e) return { index: 0, doneToday: false, finished: false };
  const doneCount = Object.keys(e.done).length;
  const finished = doneCount >= total;
  let index = 0;
  while (e.done[index] && index < total - 1) index++;
  const doneToday = Object.values(e.done).includes(todayKey());
  return { index: finished ? total - 1 : index, doneToday, finished };
}
