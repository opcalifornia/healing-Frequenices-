import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUser } from "./user";
import { computeSchedule, dayKey, type RitualDay, type RitualLog, type RitualTimes } from "../rooted/ritualLogic";

/**
 * Per-profile Rituals data: wake and bed times, reminder times, ambient bed choice and the daily check-offs.
 * Kept on this device for now. Everything is keyed by profile id and day, so it can sync to a backend later
 * the same way meal plans and food logs do.
 */

export type Ambient = "none" | "pink" | "rain";

export interface RitualPrefs {
  onboarded: boolean;
  wake: string;
  bed: string;
  times: RitualTimes;
  /** Times the person edited by hand; changing wake or bed leaves these alone. */
  custom: Partial<Record<keyof RitualTimes, true>>;
  enabled: Record<keyof RitualTimes, boolean>;
  ambient: Ambient;
  /** The FDA-style disclaimer has been read. */
  disclaimerSeen: boolean;
}

export const DEFAULT_PREFS: RitualPrefs = {
  onboarded: false,
  wake: "07:00",
  bed: "23:00",
  times: computeSchedule("07:00", "23:00"),
  custom: {},
  enabled: { revive: true, calm: true, unwind: true },
  ambient: "none",
  disclaimerSeen: false,
};

interface State {
  prefs: Record<string, RitualPrefs>;
  log: Record<string, RitualLog>;
  /** Calendar event ids used for each ritual's reminder, per profile. */
  eventIds: Record<string, Partial<Record<keyof RitualTimes, string>>>;
  acceptDisclaimer(): void;
  setSchedule(wake: string, bed: string): void;
  setTime(id: keyof RitualTimes, time: string): void;
  resetTimes(): void;
  setEnabled(id: keyof RitualTimes, on: boolean): void;
  setAmbient(a: Ambient): void;
  toggleDrink(id: string, day?: string): void;
  setSessionDone(id: string, day?: string): void;
  setEventId(id: keyof RitualTimes, eventId: string | null): void;
}

const pid = () => useUser.getState().activeProfileId ?? "guest";

export const useRituals = create<State>()(
  persist(
    (set, get) => {
      const mine = (): RitualPrefs => ({ ...DEFAULT_PREFS, ...(get().prefs[pid()] ?? {}) });
      const savePrefs = (patch: Partial<RitualPrefs>) => set({ prefs: { ...get().prefs, [pid()]: { ...mine(), ...patch } } });
      const editDay = (id: string, day: string, fn: (d: RitualDay) => RitualDay) => {
        const p = pid();
        const log = get().log[p] ?? {};
        const keys = Object.keys(log).sort().slice(-120);
        const keep = Object.fromEntries(keys.map((k) => [k, log[k]]));
        const today = keep[day] ?? {};
        set({ log: { ...get().log, [p]: { ...keep, [day]: { ...today, [id]: fn(today[id] ?? {}) } } } });
      };
      return {
        prefs: {},
        log: {},
        eventIds: {},
        acceptDisclaimer: () => savePrefs({ disclaimerSeen: true }),
        setSchedule(wake, bed) {
          const cur = mine();
          const auto = computeSchedule(wake, bed);
          const times = { ...auto, ...Object.fromEntries(Object.entries(cur.custom).map(([k]) => [k, cur.times[k as keyof RitualTimes]])) } as RitualTimes;
          savePrefs({ wake, bed, times, onboarded: true });
        },
        setTime(id, time) {
          const cur = mine();
          savePrefs({ times: { ...cur.times, [id]: time }, custom: { ...cur.custom, [id]: true } });
        },
        resetTimes() {
          const cur = mine();
          savePrefs({ times: computeSchedule(cur.wake, cur.bed), custom: {} });
        },
        setEnabled(id, on) {
          savePrefs({ enabled: { ...mine().enabled, [id]: on } });
        },
        setAmbient: (ambient) => savePrefs({ ambient }),
        toggleDrink(id, day = dayKey()) {
          editDay(id, day, (d) => ({ ...d, drink: !d.drink }));
        },
        setSessionDone(id, day = dayKey()) {
          editDay(id, day, (d) => ({ ...d, session: true }));
        },
        setEventId(id, eventId) {
          const p = pid();
          const cur = { ...(get().eventIds[p] ?? {}) };
          if (eventId) cur[id] = eventId;
          else delete cur[id];
          set({ eventIds: { ...get().eventIds, [p]: cur } });
        },
      };
    },
    { name: "rooted-rituals", version: 1 },
  ),
);

export function useRitualPrefs(): RitualPrefs {
  const p = useUser((s) => s.activeProfileId) ?? "guest";
  const stored = useRituals((s) => s.prefs[p]);
  return { ...DEFAULT_PREFS, ...(stored ?? {}) };
}
const EMPTY_LOG: RitualLog = {};
export function useRitualLog(): RitualLog {
  const p = useUser((s) => s.activeProfileId) ?? "guest";
  return useRituals((s) => s.log[p]) ?? EMPTY_LOG;
}
