import { describe, expect, it, vi } from "vitest";

vi.hoisted(() => {
  const mem = new Map<string, string>();
  (globalThis as unknown as { localStorage: Storage }).localStorage = {
    getItem: (k: string) => mem.get(k) ?? null,
    setItem: (k: string, v: string) => void mem.set(k, String(v)),
    removeItem: (k: string) => void mem.delete(k),
    clear: () => mem.clear(),
    key: (i: number) => [...mem.keys()][i] ?? null,
    get length() { return mem.size; },
  } as Storage;
});
import { areaOf, buildRecap, practiceStreak, weekDays } from "../rooted/recap";
import type { PracticeEntry } from "../store/practice";

const END = "2026-10-18"; // Sunday; week is Mon 12 .. Sun 18
const log = (day: string, kind: string, minutes: number, before?: number, after?: number): PracticeEntry => ({ day, kind, minutes, before, after });

describe("weekly recap", () => {
  it("covers the 7 days ending on the given day", () => {
    expect(weekDays(END)).toEqual(["2026-10-12", "2026-10-13", "2026-10-14", "2026-10-15", "2026-10-16", "2026-10-17", "2026-10-18"]);
  });

  it("totals minutes, active days, areas and check-ins, and compares to last week", () => {
    const logs = [
      log("2026-10-12", "breath:calm", 3, 7, 4),
      log("2026-10-12", "move:walk", 10),
      log("2026-10-14", "breath:box", 2, 6, 4),
      log("2026-10-17", "combo:evening", 8),
      log("2026-10-05", "move:walk", 5), // previous week
      log("2026-10-19", "move:walk", 50), // after the week
    ];
    const r = buildRecap({ endDay: END, logs, moods: {}, water: { "2026-10-12": 2500, "2026-10-13": 900 }, waterGoal: 2200, events: [] });
    expect(r.totalMinutes).toBe(23);
    expect(r.prevMinutes).toBe(5);
    expect(r.activeDays).toBe(3);
    expect(r.sessions).toBe(4);
    expect(r.byArea).toEqual([{ area: "Move", minutes: 10 }, { area: "Combos", minutes: 8 }, { area: "Breathe", minutes: 5 }]);
    expect(r.avgBefore).toBe(6.5);
    expect(r.avgAfter).toBe(4);
    expect(r.waterDaysMet).toBe(1);
    expect(r.insights[0]).toContain("dropped by 2.5 points");
    expect(r.insights.some((t) => t.includes("18 more minutes"))).toBe(true);
  });

  it("only compares mood with and without practice when there's enough data, framed as a pattern", () => {
    const logs = [log("2026-10-12", "breath:calm", 3), log("2026-10-13", "breath:calm", 3)];
    const moods = { "2026-10-12": 5, "2026-10-13": 4, "2026-10-15": 2, "2026-10-16": 3 } as const;
    const r = buildRecap({ endDay: END, logs, moods, water: {}, waterGoal: 0, events: [] });
    expect(r.insights.find((t) => t.includes("mood"))).toMatch(/4.5 out of 5 .* 2.5 .* not proof/);
    const thin = buildRecap({ endDay: END, logs, moods: { "2026-10-12": 5, "2026-10-15": 2 }, water: {}, waterGoal: 0, events: [] });
    expect(thin.insights.some((t) => t.includes("mood"))).toBe(false);
  });

  it("counts calendar items planned and done", () => {
    const ev = { id: "e", title: "Walk", kind: "move" as const, date: "2026-10-12", time: "12:00", minutes: 10, repeat: "daily" as const, done: { "2026-10-12": true as const, "2026-10-13": true as const } };
    const r = buildRecap({ endDay: END, logs: [], moods: {}, water: {}, waterGoal: 0, events: [ev] });
    expect(r.planned).toBe(7);
    expect(r.done).toBe(2);
    expect(r.insights).toContain("You checked off 2 of 7 things on your health calendar.");
  });

  it("maps practice kinds to areas and counts streaks", () => {
    expect(areaOf("breath:478")).toBe("Breathe");
    expect(areaOf("move:yoga")).toBe("Move");
    expect(areaOf("mystery")).toBe("Other");
    const logs = [log("2026-10-16", "x", 1), log("2026-10-17", "x", 1)];
    expect(practiceStreak(logs, "2026-10-18")).toBe(2); // today not done yet still counts yesterday's run
    expect(practiceStreak(logs, "2026-10-19")).toBe(0);
  });
});
