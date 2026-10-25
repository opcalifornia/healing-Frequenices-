import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUser } from "./user";

/** Which Breathe lessons this profile has finished reading. Kept on this device. */
interface State {
  read: Record<string, string[]>;
  mark(id: string, on?: boolean): void;
}
const pid = () => useUser.getState().activeProfileId ?? "guest";

export const useLessons = create<State>()(
  persist(
    (set, get) => ({
      read: {},
      mark(id, on = true) {
        const p = pid();
        const cur = get().read[p] ?? [];
        const next = on ? (cur.includes(id) ? cur : [...cur, id]) : cur.filter((x) => x !== id);
        set({ read: { ...get().read, [p]: next } });
      },
    }),
    { name: "rooted-lessons", version: 1 },
  ),
);

const EMPTY: string[] = [];
export function useReadLessons(): string[] {
  const p = useUser((s) => s.activeProfileId) ?? "guest";
  return useLessons((s) => s.read[p] ?? EMPTY);
}
