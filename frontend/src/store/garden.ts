import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUser } from "./user";
import { todayKey } from "./nourish";

/** The things you can be reminded to do for a plant. */
export type TaskKind = "water" | "feed";

export interface JournalEntry {
  date: string;
  text: string;
  kind: "note" | "harvest";
}

/** What someone is growing, with the day it was planted and how its care is going. */
export interface Planting {
  plantId: string;
  planted: string;
  /** Last day each task was done. */
  done?: Partial<Record<TaskKind, string>>;
  /** "Not yet": hide a task until this day. */
  snooze?: Partial<Record<TaskKind, string>>;
  /** The person's own rhythm, in days, replacing the typical one. */
  every?: Partial<Record<TaskKind, number>>;
  journal?: JournalEntry[];
}

/** How and when the person wants garden reminders. */
export interface GardenPrefs {
  water: boolean;
  feed: boolean;
  /** "rhythm": each plant on its own schedule. "daily": one check every day. */
  mode: "rhythm" | "daily";
  time: string;
  /** Remind inside Rooted (a banner, and a system notification when allowed). */
  app: boolean;
  /** The last day the in-app reminder was shown. */
  lastShown?: string;
}

export const DEFAULT_PREFS: GardenPrefs = { water: true, feed: true, mode: "rhythm", time: "08:00", app: false };

/** A plant the person added themselves, such as a rose or a houseplant. */
export interface CustomPlant {
  id: string;
  name: string;
  kind: "herb" | "vegetable" | "fruit" | "flower" | "houseplant" | "tree" | "other";
  waterDays: number;
  feedDays?: number;
}

interface GardenState {
  beds: Record<string, Planting[]>;
  custom: Record<string, CustomPlant[]>;
  prefs: Record<string, GardenPrefs>;
  setPrefs(patch: Partial<GardenPrefs>): void;
  plant(id: string, day?: string): void;
  remove(id: string): void;
  complete(id: string, task: TaskKind, day?: string): void;
  snooze(id: string, task: TaskKind, until: string): void;
  setEvery(id: string, task: TaskKind, days: number | null): void;
  addEntry(id: string, kind: JournalEntry["kind"], text: string, day?: string): void;
  addCustom(p: Omit<CustomPlant, "id">): CustomPlant;
  removeCustom(id: string): void;
}

const pid = () => useUser.getState().activeProfileId ?? "guest";

export const useGarden = create<GardenState>()(
  persist(
    (set, get) => {
      const edit = (fn: (l: Planting[]) => Planting[]) => set({ beds: { ...get().beds, [pid()]: fn(get().beds[pid()] ?? []) } });
      const patch = (id: string, fn: (p: Planting) => Planting) => edit((l) => l.map((x) => (x.plantId === id ? fn(x) : x)));
      return {
        beds: {},
        custom: {},
        prefs: {},
        setPrefs(patch) {
          set({ prefs: { ...get().prefs, [pid()]: { ...DEFAULT_PREFS, ...get().prefs[pid()], ...patch } } });
        },
        plant(id, day = todayKey()) {
          edit((l) => [...l.filter((x) => x.plantId !== id), { plantId: id, planted: day }]);
        },
        remove(id) {
          edit((l) => l.filter((x) => x.plantId !== id));
        },
        complete(id, task, day = todayKey()) {
          patch(id, (p) => ({ ...p, done: { ...p.done, [task]: day }, snooze: { ...p.snooze, [task]: undefined } }));
        },
        snooze(id, task, until) {
          patch(id, (p) => ({ ...p, snooze: { ...p.snooze, [task]: until } }));
        },
        setEvery(id, task, days) {
          patch(id, (p) => {
            const every = { ...p.every };
            if (days === null) delete every[task];
            else every[task] = days;
            return { ...p, every };
          });
        },
        addEntry(id, kind, text, day = todayKey()) {
          const t = text.trim().slice(0, 500);
          if (!t && kind === "note") return;
          patch(id, (p) => ({ ...p, journal: [{ date: day, text: t, kind }, ...(p.journal ?? [])].slice(0, 200) }));
        },
        addCustom(p) {
          const c: CustomPlant = { ...p, name: p.name.trim().slice(0, 40), id: `c-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}` };
          set({ custom: { ...get().custom, [pid()]: [...(get().custom[pid()] ?? []), c].slice(-60) } });
          return c;
        },
        removeCustom(id) {
          set({ custom: { ...get().custom, [pid()]: (get().custom[pid()] ?? []).filter((c) => c.id !== id) } });
          edit((l) => l.filter((x) => x.plantId !== id));
        },
      };
    },
    { name: "rooted-garden", version: 1 },
  ),
);

const EMPTY: Planting[] = [];
const EMPTY_CUSTOM: CustomPlant[] = [];
export function useGardenPrefs(): GardenPrefs {
  const p = useUser((s) => s.activeProfileId) ?? "guest";
  const stored = useGarden((s) => s.prefs[p]);
  return stored ? { ...DEFAULT_PREFS, ...stored } : DEFAULT_PREFS;
}
export function useMyGarden(): Planting[] {
  const p = useUser((s) => s.activeProfileId) ?? "guest";
  return useGarden((s) => s.beds[p] ?? EMPTY);
}
export function useMyCustomPlants(): CustomPlant[] {
  const p = useUser((s) => s.activeProfileId) ?? "guest";
  return useGarden((s) => s.custom[p] ?? EMPTY_CUSTOM);
}

export function daysSince(day: string, now = new Date()): number {
  const [y, m, d] = day.split("-").map(Number);
  const then = new Date(y, m - 1, d);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.max(0, Math.round((today.getTime() - then.getTime()) / 86400000));
}
