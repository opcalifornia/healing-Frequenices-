import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUser } from "./user";

/** Recipes a person has saved, per profile. */
interface State {
  saved: Record<string, string[]>;
  toggle(id: string): void;
}

const pid = () => useUser.getState().activeProfileId ?? "guest";

export const useRecipeBox = create<State>()(
  persist(
    (set, get) => ({
      saved: {},
      toggle(id) {
        const p = pid();
        const mine = get().saved[p] ?? [];
        set({ saved: { ...get().saved, [p]: mine.includes(id) ? mine.filter((x) => x !== id) : [id, ...mine] } });
      },
    }),
    { name: "rooted-recipebox", version: 1 },
  ),
);

const NONE: string[] = [];
export function useSavedRecipes(): string[] {
  const p = useUser((s) => s.activeProfileId) ?? "guest";
  return useRecipeBox((s) => s.saved[p] ?? NONE);
}
