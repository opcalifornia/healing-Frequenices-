import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUser } from "./user";
import type { Title } from "../types";

/**
 * Per-profile bedtime routine: schedule, which sessions to play, reminder
 * preference, and a log of nights listened (for streaks). Stored on this
 * device only for now.
 */

export interface BedtimePlan {
  /** "HH:MM", 24-hour. */
  bedtime: string;
  wake: string;
  /** Minutes of wind-down before lights out. */
  windDown: number;
  /** Minutes the sleep session plays after lights out before fading. */
  sleepTimer: number;
  windDownId: string;
  sleepId: string;
  remind: boolean;
}

export const DEFAULT_PLAN: BedtimePlan = {
  bedtime: "22:30",
  wake: "06:30",
  windDown: 30,
  sleepTimer: 60,
  windDownId: "evening-wind-down",
  sleepId: "deep-rest",
  remind: false,
};

interface BedtimeState {
  plans: Record<string, BedtimePlan>;
  /** Night keys ("YYYY-MM-DD" of the evening) with 10+ minutes of evening listening. */
  nights: Record<string, string[]>;
  setPlan(patch: Partial<BedtimePlan>): void;
  noteListening(title: Title, elapsedSeconds: number, at?: Date): void;
}

export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return (h * 60 + m) % 1440;
}

export function fromMinutes(min: number): string {
  const m = ((Math.round(min) % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

/** The evening a moment belongs to: anything before noon counts as the previous night. */
export function nightKey(d: Date): string {
  const x = new Date(d);
  if (x.getHours() < 12) x.setDate(x.getDate() - 1);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
}

/** Consecutive nights ending tonight (or last night, if tonight isn't logged yet). */
export function streak(nights: string[], today = new Date()): number {
  const set = new Set(nights);
  const d = new Date(today);
  if (d.getHours() < 12) d.setDate(d.getDate() - 1);
  const key = (x: Date) => nightKey(new Date(x.getFullYear(), x.getMonth(), x.getDate(), 20));
  if (!set.has(key(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (set.has(key(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

const isEvening = (d: Date) => d.getHours() >= 18 || d.getHours() < 5;

export const useBedtime = create<BedtimeState>()(
  persist(
    (set, get) => ({
      plans: {},
      nights: {},
      setPlan(patch) {
        const pid = useUser.getState().activeProfileId;
        if (!pid) return;
        const plan = { ...DEFAULT_PLAN, ...get().plans[pid], ...patch };
        set({ plans: { ...get().plans, [pid]: plan } });
      },
      noteListening(title, elapsed, at = new Date()) {
        const pid = useUser.getState().activeProfileId;
        if (!pid || elapsed < 600 || !isEvening(at)) return;
        const sleepy = title.goal === "sleep" || title.goal === "relax" || title.band === "delta" || title.band === "theta" || title.id.startsWith("c-routine");
        if (!sleepy) return;
        const key = nightKey(at);
        const list = get().nights[pid] ?? [];
        if (list.includes(key)) return;
        set({ nights: { ...get().nights, [pid]: [...list, key].slice(-400) } });
      },
    }),
    { name: "hf-bedtime", version: 1 },
  ),
);

export function usePlan(): BedtimePlan {
  const pid = useUser((s) => s.activeProfileId);
  return useBedtime((s) => (pid && s.plans[pid]) || DEFAULT_PLAN);
}

export function useNights(): string[] {
  const pid = useUser((s) => s.activeProfileId);
  return useBedtime((s) => (pid && s.nights[pid]) || EMPTY);
}
const EMPTY: string[] = [];

/** A daily calendar event with an alarm at wind-down time: reminders that work when the app is closed. */
export function bedtimeIcs(plan: BedtimePlan, now = new Date()): string {
  const start = toMinutes(plan.bedtime) - plan.windDown;
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  const startMin = ((start % 1440) + 1440) % 1440;
  const pad = (n: number) => String(n).padStart(2, "0");
  const ymd = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  const t = (min: number) => `${pad(Math.floor(min / 60) % 24)}${pad(min % 60)}00`;
  const endMin = (startMin + plan.windDown) % 1440;
  const stamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Healing Frequencies//Bedtime//EN",
    "BEGIN:VEVENT",
    `UID:bedtime-${ymd}@healing-frequencies`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${ymd}T${t(startMin)}`,
    `DTEND:${ymd}T${t(endMin < startMin ? startMin + 1 : endMin)}`,
    "RRULE:FREQ=DAILY",
    "SUMMARY:Wind down: Healing Frequencies",
    `DESCRIPTION:Dim the lights and start your wind-down. Lights out at ${plan.bedtime}.`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Time to wind down",
    "TRIGGER:PT0M",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}
