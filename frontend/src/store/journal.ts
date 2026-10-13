import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUser } from "./user";
import { todayKey } from "./nourish";

/** Short written reflections from combos (gratitude and the like). Private, on this device. */
export interface JournalEntry {
  day: string;
  prompt: string;
  lines: string[];
}

interface JournalState {
  entries: Record<string, JournalEntry[]>;
  add(prompt: string, lines: string[]): void;
}

export const useJournal = create<JournalState>()(
  persist(
    (set, get) => ({
      entries: {},
      add(prompt, lines) {
        const pid = useUser.getState().activeProfileId ?? "guest";
        const kept = lines.map((l) => l.trim()).filter(Boolean);
        if (!kept.length) return;
        set({ entries: { ...get().entries, [pid]: [...(get().entries[pid] ?? []), { day: todayKey(), prompt, lines: kept }].slice(-500) } });
      },
    }),
    { name: "rooted-journal", version: 1 },
  ),
);

const EMPTY: JournalEntry[] = [];
export function useJournalEntries(): JournalEntry[] {
  const pid = useUser((s) => s.activeProfileId) ?? "guest";
  return useJournal((s) => s.entries[pid] ?? EMPTY);
}
