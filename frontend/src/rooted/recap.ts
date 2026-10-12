import type { PracticeEntry } from "../store/practice";
import type { Mood } from "../store/support";
import { addDays, eventsOn, type HealthEvent } from "../store/calendar";

/**
 * The weekly recap: what someone did over 7 days, from data the app already
 * keeps on the device. Pure functions so they are easy to test.
 */

export interface DayRecap {
  day: string;
  minutes: number;
  sessions: number;
  mood?: Mood;
  water: number;
  planned: number;
  done: number;
}

export interface CheckIn {
  day: string;
  kind: string;
  before: number;
  after: number;
}

export interface WeekRecap {
  days: DayRecap[];
  totalMinutes: number;
  prevMinutes: number;
  activeDays: number;
  sessions: number;
  checkIns: CheckIn[];
  avgBefore?: number;
  avgAfter?: number;
  byArea: Array<{ area: string; minutes: number }>;
  planned: number;
  done: number;
  waterDaysMet: number;
  /** Honest, plain-language observations. Empty when there isn't enough data. */
  insights: string[];
}

const AREAS: Array<[RegExp, string]> = [
  [/^breath|^pmr|^ground/, "Breathe"],
  [/^move/, "Move"],
  [/^combo/, "Combos"],
  [/^meditate|^bowl|^spirit/, "Spirit"],
  [/^light/, "Light"],
  [/^program/, "Programs"],
  [/^listen|^session|^healing/, "Sound"],
];

export function areaOf(kind: string): string {
  return AREAS.find(([re]) => re.test(kind))?.[1] ?? "Other";
}

export function weekDays(endDay: string): string[] {
  return Array.from({ length: 7 }, (_, i) => addDays(endDay, i - 6));
}

const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : undefined);
const round1 = (n: number) => Math.round(n * 10) / 10;

export function buildRecap(input: {
  endDay: string;
  logs: PracticeEntry[];
  moods: Record<string, Mood>;
  water: Record<string, number>;
  waterGoal: number;
  events: HealthEvent[];
}): WeekRecap {
  const { endDay, logs, moods, water, waterGoal, events } = input;
  const days = weekDays(endDay);
  const inWeek = new Set(days);
  const prevStart = addDays(days[0], -7);

  const perDay: DayRecap[] = days.map((day) => {
    const mine = logs.filter((l) => l.day === day);
    const evs = eventsOn(events, day);
    return {
      day,
      minutes: Math.round(mine.reduce((a, l) => a + l.minutes, 0)),
      sessions: mine.length,
      mood: moods[day],
      water: water[day] ?? 0,
      planned: evs.length,
      done: evs.filter((e) => e.done?.[day]).length,
    };
  });

  const weekLogs = logs.filter((l) => inWeek.has(l.day));
  const prevMinutes = Math.round(logs.filter((l) => l.day >= prevStart && l.day < days[0]).reduce((a, l) => a + l.minutes, 0));

  const checkIns: CheckIn[] = weekLogs
    .filter((l): l is PracticeEntry & { before: number; after: number } => typeof l.before === "number" && typeof l.after === "number")
    .map((l) => ({ day: l.day, kind: l.kind, before: l.before, after: l.after }));

  const areaMin = new Map<string, number>();
  for (const l of weekLogs) areaMin.set(areaOf(l.kind), (areaMin.get(areaOf(l.kind)) ?? 0) + l.minutes);
  const byArea = [...areaMin.entries()].map(([area, minutes]) => ({ area, minutes: Math.round(minutes) })).filter((a) => a.minutes > 0).sort((a, b) => b.minutes - a.minutes);

  const totalMinutes = perDay.reduce((a, d) => a + d.minutes, 0);
  const avgBefore = avg(checkIns.map((c) => c.before));
  const avgAfter = avg(checkIns.map((c) => c.after));
  const planned = perDay.reduce((a, d) => a + d.planned, 0);
  const done = perDay.reduce((a, d) => a + d.done, 0);

  const recap: WeekRecap = {
    days: perDay,
    totalMinutes,
    prevMinutes,
    activeDays: perDay.filter((d) => d.sessions > 0).length,
    sessions: weekLogs.length,
    checkIns,
    avgBefore: avgBefore === undefined ? undefined : round1(avgBefore),
    avgAfter: avgAfter === undefined ? undefined : round1(avgAfter),
    byArea,
    planned,
    done,
    waterDaysMet: perDay.filter((d) => waterGoal > 0 && d.water >= waterGoal).length,
    insights: [],
  };
  recap.insights = insightsFor(recap);
  return recap;
}

/** Plain observations, only when there's enough data, always framed as patterns, not proof. */
export function insightsFor(r: WeekRecap): string[] {
  const out: string[] = [];
  if (r.checkIns.length >= 2 && r.avgBefore !== undefined && r.avgAfter !== undefined) {
    const drop = round1(r.avgBefore - r.avgAfter);
    if (drop >= 0.5) out.push(`Your stress check-ins dropped by ${drop} points on average after a practice (${r.avgBefore} → ${r.avgAfter} out of 10).`);
    else out.push("Your stress check-ins stayed about the same after practices. That's useful to know: try a different technique or a longer session.");
  }
  const withP = r.days.filter((d) => d.mood && d.sessions > 0).map((d) => d.mood!);
  const without = r.days.filter((d) => d.mood && d.sessions === 0).map((d) => d.mood!);
  if (withP.length >= 2 && without.length >= 2) {
    const a = round1(avg(withP)!);
    const b = round1(avg(without)!);
    if (a - b >= 0.5) out.push(`Your mood averaged ${a} out of 5 on days you practiced and ${b} on days you didn't. A pattern worth noticing, not proof.`);
    else if (b - a >= 0.5) out.push(`Your mood was a little higher on days you didn't practice (${b} vs ${a}). Busy days can go either way; keep noticing.`);
  }
  if (r.prevMinutes > 0 && r.totalMinutes > 0) {
    const change = r.totalMinutes - r.prevMinutes;
    if (change >= 10) out.push(`${change} more minutes for yourself than the week before.`);
  }
  if (r.planned >= 3) out.push(`You checked off ${r.done} of ${r.planned} things on your health calendar.`);
  return out;
}

/** Current run of days with at least one practice, counting back from endDay (today may still be open). */
export function practiceStreak(logs: PracticeEntry[], endDay: string): number {
  const days = new Set(logs.map((l) => l.day));
  let d = days.has(endDay) ? endDay : addDays(endDay, -1);
  let n = 0;
  while (days.has(d)) {
    n++;
    d = addDays(d, -1);
  }
  return n;
}
