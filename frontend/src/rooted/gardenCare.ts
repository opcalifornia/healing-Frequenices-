import { CARE, PLANTS, type PlantKind } from "./gardenContent";
import type { CustomPlant, GardenPrefs, Planting, TaskKind } from "../store/garden";
import { icsText, fold } from "./calendarIcs";

/** A plant as the care tools see it, whether it came from our list or the person added it. */
export interface ResolvedPlant {
  id: string;
  name: string;
  hue: number;
  kind: PlantKind | CustomPlant["kind"];
  waterDays: number;
  feedDays?: number;
  custom: boolean;
}

export function resolvePlant(id: string, custom: CustomPlant[]): ResolvedPlant | undefined {
  const c = custom.find((x) => x.id === id);
  if (c) return { id: c.id, name: c.name, hue: 140, kind: c.kind, waterDays: c.waterDays, feedDays: c.feedDays, custom: true };
  const p = PLANTS.find((x) => x.id === id);
  if (!p) return undefined;
  const care = CARE[p.id] ?? { water: 3 };
  return { id: p.id, name: p.name, hue: p.hue, kind: p.kind, waterDays: care.water, feedDays: care.feed, custom: false };
}

export const TASK_LABEL: Record<TaskKind, string> = { water: "Check water", feed: "Feed" };
export const TASK_HELP: Record<TaskKind, string> = {
  water: "Press a finger into the top inch of soil. If it's dry, water at the base until it drains.",
  feed: "A diluted, balanced fertiliser, following the label. Skip it in winter or when the plant is dormant.",
};

export interface CareTask {
  kind: TaskKind;
  everyDays: number;
}

/** The tasks a planting has, using the person's own rhythm where they set one. */
export function tasksOf(pl: Planting, plant: ResolvedPlant): CareTask[] {
  const out: CareTask[] = [{ kind: "water", everyDays: pl.every?.water ?? plant.waterDays }];
  const feed = pl.every?.feed ?? plant.feedDays; // 0 means the person turned feeding off
  if (feed) out.push({ kind: "feed", everyDays: feed });
  return out;
}

const parse = (day: string) => {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const addDays = (day: string, n: number) => {
  const d = parse(day);
  d.setDate(d.getDate() + n);
  return fmt(d);
};
export const daysBetween = (a: string, b: string) => Math.round((parse(b).getTime() - parse(a).getTime()) / 86400000);

/**
 * When a task is next due: every N days after it was last done. A new planting needs its first water check
 * straight away, and its first feed after one full interval.
 */
export function nextDue(pl: Planting, t: CareTask): string {
  const last = pl.done?.[t.kind];
  const due = last ? addDays(last, t.everyDays) : t.kind === "water" ? pl.planted : addDays(pl.planted, t.everyDays);
  const snooze = pl.snooze?.[t.kind];
  return snooze && snooze > due ? snooze : due;
}

export interface DueItem {
  plantId: string;
  name: string;
  hue: number;
  task: CareTask;
  due: string;
  /** Days overdue (0 = due today). */
  late: number;
}

/** Everything due today or earlier, most overdue first. */
export function dueItems(plantings: Planting[], custom: CustomPlant[], today: string): DueItem[] {
  const out: DueItem[] = [];
  for (const pl of plantings) {
    const plant = resolvePlant(pl.plantId, custom);
    if (!plant) continue;
    for (const task of tasksOf(pl, plant)) {
      const due = nextDue(pl, task);
      if (due <= today) out.push({ plantId: pl.plantId, name: plant.name, hue: plant.hue, task, due, late: daysBetween(due, today) });
    }
  }
  return out.sort((a, b) => b.late - a.late || a.name.localeCompare(b.name));
}

/** "In 3 days", "Tomorrow", "Today", "2 days late". */
export function dueWords(due: string, today: string): string {
  const d = daysBetween(today, due);
  if (d < 0) return `${-d} day${d === -1 ? "" : "s"} late`;
  if (d === 0) return "Today";
  if (d === 1) return "Tomorrow";
  return `In ${d} days`;
}

const pad = (n: number) => String(n).padStart(2, "0");

const chosen = (prefs: Pick<GardenPrefs, "water" | "feed">): TaskKind[] => [...(prefs.water ? (["water"] as const) : []), ...(prefs.feed ? (["feed"] as const) : [])];

/** What to nudge about today: each plant on its own rhythm, or every plant if the person wants a daily check. */
export function reminderItems(plantings: Planting[], custom: CustomPlant[], prefs: GardenPrefs, today: string): Array<{ name: string; kinds: TaskKind[] }> {
  const kinds = chosen(prefs);
  if (!kinds.length) return [];
  if (prefs.mode === "daily") {
    return plantings.flatMap((pl) => {
      const plant = resolvePlant(pl.plantId, custom);
      if (!plant) return [];
      const has = tasksOf(pl, plant).map((t) => t.kind).filter((k) => kinds.includes(k));
      return has.length ? [{ name: plant.name, kinds: has }] : [];
    });
  }
  const byPlant = new Map<string, TaskKind[]>();
  for (const d of dueItems(plantings, custom, today)) {
    if (!kinds.includes(d.task.kind)) continue;
    byPlant.set(d.name, [...(byPlant.get(d.name) ?? []), d.task.kind]);
  }
  return [...byPlant].map(([name, k]) => ({ name, kinds: k }));
}

/** "Garden check: Basil and Rose need water." */
export function reminderText(items: Array<{ name: string; kinds: TaskKind[] }>): { title: string; body: string } {
  const water = items.filter((i) => i.kinds.includes("water")).map((i) => i.name);
  const feed = items.filter((i) => i.kinds.includes("feed")).map((i) => i.name);
  const list = (n: string[]) => (n.length > 3 ? `${n.slice(0, 3).join(", ")} and ${n.length - 3} more` : n.join(", ").replace(/, ([^,]*)$/, " and $1"));
  const parts = [water.length ? `check water for ${list(water)}` : "", feed.length ? `feed ${list(feed)}` : ""].filter(Boolean);
  return { title: "Garden check", body: parts.length ? `Time to ${parts.join(", and ")}. Test the soil before you water.` : "Time for your garden check." };
}

/**
 * Repeating calendar alarms for the phone. In "rhythm" mode, one event per plant and task, repeating every N days from
 * the day it is next due. In "daily" mode, one event every day listing the plants. Works even when the app is closed.
 */
export function careIcs(plantings: Planting[], custom: CustomPlant[], prefs: GardenPrefs, url: string, today: string, now = new Date()): string {
  const [h, m] = prefs.time.split(":").map(Number);
  const stamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
  const kinds = chosen(prefs);
  const events: string[] = [];
  const end = h * 60 + m + 10;
  const push = (uid: string, start: string, every: number, title: string, note: string) => {
    const ymd = start.replace(/-/g, "");
    events.push(
      "BEGIN:VEVENT",
      `UID:${uid}@rooted`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${ymd}T${pad(h)}${pad(m)}00`,
      `DTEND:${ymd}T${pad(Math.floor(end / 60) % 24)}${pad(end % 60)}00`,
      `RRULE:FREQ=DAILY;INTERVAL=${Math.max(1, every)}`,
      fold(`SUMMARY:${icsText(title)}`),
      fold(`DESCRIPTION:${icsText(note)}`),
      `URL:${url}`,
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      fold(`DESCRIPTION:${icsText(title)}`),
      "TRIGGER:PT0M",
      "END:VALARM",
      "END:VEVENT",
    );
  };
  if (kinds.length && prefs.mode === "daily") {
    const names = plantings.map((pl) => resolvePlant(pl.plantId, custom)?.name).filter(Boolean) as string[];
    const what = kinds.map((k) => (k === "water" ? "water" : "feed")).join(" and ");
    push("rooted-garden-daily", today, 1, `Garden check: ${what}`, `${names.slice(0, 12).join(", ")}. ${TASK_HELP.water} Open Rooted: ${url}`);
  } else {
    for (const pl of plantings) {
      const plant = resolvePlant(pl.plantId, custom);
      if (!plant) continue;
      for (const task of tasksOf(pl, plant)) {
        if (!kinds.includes(task.kind)) continue;
        const due = nextDue(pl, task);
        push(`rooted-garden-${pl.plantId}-${task.kind}`, due < today ? today : due, task.everyDays, `${plant.name}: ${task.kind === "water" ? "check water" : "feed"}`, `${TASK_HELP[task.kind]} Open Rooted: ${url}`);
      }
    }
  }
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Rooted//Garden care//EN", "CALSCALE:GREGORIAN", ...events, "END:VCALENDAR"].join("\r\n") + "\r\n";
}
