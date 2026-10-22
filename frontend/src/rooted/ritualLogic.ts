import type { RitualSession } from "./rituals";

/** Pure helpers for Rituals: schedule, which ritual is "now", session hertz, streaks and the 24-hour clock. */

const DAY = 1440;
export const toMin = (hhmm: string): number => {
  const [h, m] = hhmm.split(":").map(Number);
  return ((h * 60 + m) % DAY + DAY) % DAY;
};
export const fromMin = (m: number): string => {
  const n = ((Math.round(m) % DAY) + DAY) % DAY;
  return `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;
};
export const niceTime = (hhmm: string): string => {
  const [h, m] = hhmm.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`;
};

export type RitualTimes = { revive: string; calm: string; unwind: string };

/** Revive at waking, Calm 6.5 hours later (kept between noon and 4 pm), Unwind 75 minutes before bed. */
export function computeSchedule(wake: string, bed: string): RitualTimes {
  const w = toMin(wake);
  return {
    revive: fromMin(w),
    calm: fromMin(Math.min(16 * 60, Math.max(12 * 60, w + 390))),
    unwind: fromMin(toMin(bed) - 75),
  };
}

/** Which ritual fits `nowMin` (minutes since midnight) best, to highlight on the home screen. */
export function ritualNow(nowMin: number, t: RitualTimes): "revive" | "calm" | "unwind" {
  const unwind = toMin(t.unwind);
  const calm = toMin(t.calm);
  if (nowMin >= unwind - 30 || nowMin < toMin(t.revive) - 120) return "unwind";
  if (nowMin >= calm - 90) return "calm";
  return "revive";
}

/** Beat and ear frequencies `progress` (0 to 1) of the way through a session. Linear, as the audio engine ramps them. */
export function sessionAt(s: RitualSession, progress: number) {
  const p = Math.min(1, Math.max(0, progress));
  const lerp = (a: number, b: number) => a + (b - a) * p;
  return { beat: lerp(s.beatHz.start, s.beatHz.end), left: s.leftHz, right: lerp(s.rightHz.start, s.rightHz.end) };
}

/** True when each ear's tone is exactly the carrier plus the beat, start and end. */
export function sessionIsConsistent(s: RitualSession): boolean {
  const ok = (beat: number, right: number) => Math.abs(s.leftHz + beat - right) < 1e-6;
  return s.leftHz === s.carrierHz && ok(s.beatHz.start, s.rightHz.start) && ok(s.beatHz.end, s.rightHz.end);
}

export const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const shiftDay = (key: string, n: number) => {
  const [y, m, d] = key.split("-").map(Number);
  return dayKey(new Date(y, m - 1, d + n));
};

export interface RitualDay {
  drink?: boolean;
  session?: boolean;
}
/** day -> ritual id -> what was done. */
export type RitualLog = Record<string, Record<string, RitualDay>>;

export const didAnything = (day: Record<string, RitualDay> | undefined) => !!day && Object.values(day).some((r) => r.drink || r.session);

/**
 * Days in a row with at least one drink or session done. Today not being done yet does not break
 * the streak: it counts from yesterday until today is done.
 */
export function streak(log: RitualLog, today: string): number {
  let day = didAnything(log[today]) ? today : shiftDay(today, -1);
  let n = 0;
  while (didAnything(log[day])) {
    n++;
    day = shiftDay(day, -1);
  }
  return n;
}

export interface HistoryDay {
  day: string;
  rituals: Record<string, RitualDay>;
}
/** The last seven days, oldest first, ending today. */
export function lastSeven(log: RitualLog, today: string, ids: string[]): HistoryDay[] {
  return Array.from({ length: 7 }, (_, i) => {
    const day = shiftDay(today, i - 6);
    return { day, rituals: Object.fromEntries(ids.map((id) => [id, log[day]?.[id] ?? {}])) };
  });
}

export const countDone = (days: HistoryDay[]) => days.reduce((a, d) => a + Object.values(d.rituals).reduce((b, r) => b + (r.drink ? 1 : 0) + (r.session ? 1 : 0), 0), 0);

/* ---- The 24-hour clock ---- */

export interface ClockArc {
  id: string;
  label: string;
  /** Minutes since midnight. May wrap past midnight (end < start). */
  start: number;
  end: number;
  ring: 0 | 1 | 2;
  color: string;
  note: string;
}

/**
 * Typical shape of a day for someone who wakes at `wake` and sleeps at `bed`. These are general patterns that
 * vary a lot between people (chronotype), not a measurement of you.
 */
export function circadianArcs(wake: string, bed: string): ClockArc[] {
  const w = toMin(wake);
  const b = toMin(bed);
  const at = (h: number) => (w + Math.round(h * 60)) % DAY;
  return [
    { id: "cortisol", label: "Cortisol rise", start: w, end: at(1.5), ring: 0, color: "#ff8a3d", note: "Cortisol climbs in the first hour after waking, which helps you feel alert. Morning light and moving around support it." },
    { id: "peak", label: "Focus peak", start: at(2), end: at(5), ring: 0, color: "#ffd166", note: "For many people, alertness and concentration are at their best in the late morning." },
    { id: "dip", label: "Afternoon dip", start: at(6.5), end: at(8.5), ring: 0, color: "#3fc1b0", note: "A natural dip in alertness comes in the early afternoon, whether or not you ate lunch. A short walk or a short rest helps." },
    { id: "strength", label: "Second wind", start: at(9.5), end: at(12), ring: 0, color: "#ef476f", note: "Body temperature and coordination often peak in the late afternoon and early evening, a good time for exercise." },
    { id: "melatonin", label: "Melatonin rises", start: (b - 120 + DAY) % DAY, end: (w + 90) % DAY, ring: 1, color: "#8b7bff", note: "About two hours before your usual bedtime, your body starts making melatonin, helped by dim light. Bright screens can delay it." },
    { id: "deep", label: "Deep sleep", start: b, end: (b + 200) % DAY, ring: 2, color: "#4b3fd1", note: "Most deep sleep, the most physically restoring stage, happens in the first half of the night." },
    { id: "rem", label: "REM sleep", start: (w - 150 + DAY) % DAY, end: w, ring: 2, color: "#7aa2ff", note: "REM sleep, linked with dreaming and memory, gets longer toward morning." },
  ];
}

/** Length in minutes of an arc, handling wrap past midnight. */
export const arcLength = (a: ClockArc) => ((a.end - a.start) % DAY + DAY) % DAY;
