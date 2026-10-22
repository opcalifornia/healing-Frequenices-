import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUser } from "./user";

/** Small per-profile Breathe settings: the pace found with the pace finder. */
interface State {
  pace: Record<string, number | undefined>;
  setPace(rate: number | null): void;
}
const pid = () => useUser.getState().activeProfileId ?? "guest";

export const useBreatheTools = create<State>()(
  persist(
    (set, get) => ({
      pace: {},
      setPace(rate) {
        set({ pace: { ...get().pace, [pid()]: rate ?? undefined } });
      },
    }),
    { name: "rooted-breathe-tools", version: 1 },
  ),
);

export function useMyPace(): number | undefined {
  const p = useUser((s) => s.activeProfileId) ?? "guest";
  return useBreatheTools((s) => s.pace[p]);
}
