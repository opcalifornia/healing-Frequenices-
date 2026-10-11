import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUser } from "./user";
import { todayKey } from "./nourish";

/** The health calendar: things people schedule for their wellbeing, per profile. */

export type EventKind = "breathe" | "move" | "nourish" | "light" | "spirit" | "healing" | "program" | "sleep" | "appointment" | "other";
export type Repeat = "none" | "daily" | "weekdays" | "weekly";

export interface HealthEvent {
  id: string;
  title: string;
  kind: EventKind;
  /** First (or only) date, YYYY-MM-DD. */
  date: string;
  time: string;
  minutes: number;
  repeat: Repeat;
  /** In-app link to start it. */
  to?: string;
  note?: string;
  /** Dates it was marked done. */
  done?: Record<string, true>;
  /** Dates removed from a repeating series. */
  skip?: Record<string, true>;
}

/** A busy block imported from someone's work or personal calendar. Stays on this device. */
export interface BusyBlock {
  start: string; // ISO local "YYYY-MM-DDTHH:MM"
  end: string;
  title: string;
  repeat?: "daily" | "weekly";
  byDay?: number[];
  until?: string;
}

interface CalendarState {
  events: Record<string, HealthEvent[]>;
  busy: Record<string, BusyBlock[]>;
  add(e: Omit<HealthEvent, "id">): HealthEvent;
  update(id: string, patch: Partial<HealthEvent>): void;
  remove(id: string): void;
  skipDate(id: string, date: string): void;
  toggleDone(id: string, date: string): void;
  setBusy(b: BusyBlock[]): void;
}

const pid = () => useUser.getState().activeProfileId ?? "guest";

export const useCalendar = create<CalendarState>()(
  persist(
    (set, get) => {
      const edit = (fn: (l: HealthEvent[]) => HealthEvent[]) => {
        const p = pid();
        set({ events: { ...get().events, [p]: fn(get().events[p] ?? []) } });
      };
      return {
        events: {},
        busy: {},
        add(e) {
          const ev = { ...e, id: `ev-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}` };
          edit((l) => [...l, ev].slice(-500));
          return ev;
        },
        update(id, patch) {
          edit((l) => l.map((e) => (e.id === id ? { ...e, ...patch } : e)));
        },
        remove(id) {
          edit((l) => l.filter((e) => e.id !== id));
        },
        skipDate(id, date) {
          edit((l) => l.map((e) => (e.id === id ? { ...e, skip: { ...e.skip, [date]: true } } : e)));
        },
        toggleDone(id, date) {
          edit((l) =>
            l.map((e) => {
              if (e.id !== id) return e;
              const done = { ...e.done };
              if (done[date]) delete done[date];
              else done[date] = true;
              return { ...e, done };
            }),
          );
        },
        setBusy(b) {
          set({ busy: { ...get().busy, [pid()]: b } });
        },
      };
    },
    { name: "rooted-calendar", version: 1 },
  ),
);

const EMPTY: HealthEvent[] = [];
const EMPTY_B: BusyBlock[] = [];
export function useEvents(): HealthEvent[] {
  const p = useUser((s) => s.activeProfileId) ?? "guest";
  return useCalendar((s) => s.events[p] ?? EMPTY);
}
export function useBusy(): BusyBlock[] {
  const p = useUser((s) => s.activeProfileId) ?? "guest";
  return useCalendar((s) => s.busy[p] ?? EMPTY_B);
}

/* ------------------------------------------------------------------ */
/* Dates                                                               */
/* ------------------------------------------------------------------ */

export const parseDay = (d: string) => {
  const [y, m, dd] = d.split("-").map(Number);
  return new Date(y, m - 1, dd);
};
export const addDays = (d: string, n: number) => {
  const x = parseDay(d);
  x.setDate(x.getDate() + n);
  return todayKey(x);
};
export const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
export const fromMin = (m: number) => `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

/** Does this event happen on this day? */
export function occursOn(e: HealthEvent, day: string): boolean {
  if (day < e.date || e.skip?.[day]) return false;
  if (e.repeat === "none") return day === e.date;
  if (e.repeat === "daily") return true;
  const dow = parseDay(day).getDay();
  if (e.repeat === "weekdays") return dow >= 1 && dow <= 5;
  return dow === parseDay(e.date).getDay();
}

export function eventsOn(events: HealthEvent[], day: string): HealthEvent[] {
  return events.filter((e) => occursOn(e, day)).sort((a, b) => toMin(a.time) - toMin(b.time));
}

/** Busy blocks overlapping a day, as minute ranges. */
export function busyOn(blocks: BusyBlock[], day: string): Array<{ start: number; end: number; title: string }> {
  const out: Array<{ start: number; end: number; title: string }> = [];
  const dow = parseDay(day).getDay();
  for (const b of blocks) {
    const sDay = b.start.slice(0, 10);
    const s = toMin(b.start.slice(11, 16));
    const e = b.end.slice(0, 10) > sDay ? 24 * 60 : toMin(b.end.slice(11, 16));
    let on = sDay === day;
    if (!on && b.repeat && day > sDay && (!b.until || day <= b.until)) {
      on = b.repeat === "daily" ? true : (b.byDay?.length ? b.byDay.includes(dow) : parseDay(sDay).getDay() === dow);
    }
    if (on) out.push({ start: s, end: Math.max(e, s + 15), title: b.title });
  }
  return out;
}

/** Health events that overlap busy time on a day. */
export function conflicts(events: HealthEvent[], blocks: BusyBlock[], day: string): string[] {
  const busy = busyOn(blocks, day);
  return eventsOn(events, day)
    .filter((e) => busy.some((b) => toMin(e.time) < b.end && toMin(e.time) + e.minutes > b.start))
    .map((e) => e.id);
}

/** First open slot of a given length near a preferred time, avoiding busy blocks and other events. */
export function findFreeSlot(events: HealthEvent[], blocks: BusyBlock[], day: string, preferred: string, minutes: number): string {
  const taken = [...busyOn(blocks, day), ...eventsOn(events, day).map((e) => ({ start: toMin(e.time), end: toMin(e.time) + e.minutes }))];
  const free = (s: number) => s >= 5 * 60 && s + minutes <= 23 * 60 && !taken.some((t) => s < t.end && s + minutes > t.start);
  const p = toMin(preferred);
  for (let d = 0; d <= 12 * 60; d += 15) {
    if (free(p + d)) return fromMin(p + d);
    if (free(p - d)) return fromMin(p - d);
  }
  return preferred;
}
