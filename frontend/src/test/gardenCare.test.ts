import { describe, expect, it } from "vitest";
import { addDays, careIcs, dueItems, dueWords, nextDue, resolvePlant, tasksOf } from "../rooted/gardenCare";
import type { CustomPlant, Planting } from "../store/garden";

const basil: Planting = { plantId: "basil", planted: "2026-05-01" };

describe("garden care", () => {
  it("gives every plant a rhythm, and adds feeding where it helps", () => {
    const basilPlant = resolvePlant("basil", [])!;
    expect(tasksOf(basil, basilPlant).map((t) => `${t.kind}:${t.everyDays}`)).toEqual(["water:3", "feed:21"]);
    expect(tasksOf({ plantId: "thyme", planted: "2026-05-01" }, resolvePlant("thyme", [])!).map((t) => t.kind)).toEqual(["water"]);
  });
  it("uses the person's own rhythm over the typical one", () => {
    const mine: Planting = { ...basil, every: { water: 5 } };
    expect(tasksOf(mine, resolvePlant("basil", [])!)[0].everyDays).toBe(5);
  });
  it("needs a water check straight away, and the first feed after a full interval", () => {
    const [water, feed] = tasksOf(basil, resolvePlant("basil", [])!);
    expect(nextDue(basil, water)).toBe("2026-05-01");
    expect(nextDue(basil, feed)).toBe("2026-05-22");
  });
  it("schedules from the last time it was done, and honours 'not yet'", () => {
    const [water] = tasksOf(basil, resolvePlant("basil", [])!);
    const done: Planting = { ...basil, done: { water: "2026-05-10" } };
    expect(nextDue(done, water)).toBe("2026-05-13");
    expect(nextDue({ ...done, snooze: { water: "2026-05-15" } }, water)).toBe("2026-05-15");
    expect(nextDue({ ...done, snooze: { water: "2026-05-11" } }, water)).toBe("2026-05-13");
  });
  it("lists what is due today, most overdue first", () => {
    const list: Planting[] = [basil, { plantId: "mint", planted: "2026-05-05" }, { plantId: "aloe", planted: "2026-05-09", done: { water: "2026-05-09" } }];
    const due = dueItems(list, [], "2026-05-10");
    expect(due.map((d) => `${d.plantId}:${d.task.kind}:${d.late}`)).toEqual(["basil:water:9", "mint:water:5"]);
  });
  it("works for plants the person added", () => {
    const rose: CustomPlant = { id: "c-rose", name: "Rose", kind: "flower", waterDays: 4, feedDays: 14 };
    const p: Planting = { plantId: "c-rose", planted: "2026-05-01", done: { water: "2026-05-01" } };
    expect(dueItems([p], [rose], "2026-05-05").map((d) => d.task.kind)).toEqual(["water"]);
    expect(resolvePlant("c-rose", [rose])?.name).toBe("Rose");
    expect(resolvePlant("nope", [])).toBeUndefined();
  });
  it("says when things are due in plain words", () => {
    expect(dueWords("2026-05-10", "2026-05-10")).toBe("Today");
    expect(dueWords("2026-05-11", "2026-05-10")).toBe("Tomorrow");
    expect(dueWords("2026-05-13", "2026-05-10")).toBe("In 3 days");
    expect(dueWords("2026-05-09", "2026-05-10")).toBe("1 day late");
    expect(dueWords("2026-05-07", "2026-05-10")).toBe("3 days late");
    expect(addDays("2026-02-27", 3)).toBe("2026-03-02");
  });
  it("builds repeating calendar alarms for every task", () => {
    const ics = careIcs([basil], [], "08:00", "https://example.org/", "2026-05-10", new Date("2026-05-10T07:00:00Z"));
    expect(ics).toContain("RRULE:FREQ=DAILY;INTERVAL=3");
    expect(ics).toContain("RRULE:FREQ=DAILY;INTERVAL=21");
    expect(ics).toContain("DTSTART:20260510T080000");
    expect(ics).toContain("SUMMARY:Basil: check water");
    expect(ics).toContain("BEGIN:VALARM");
    expect(ics.split("BEGIN:VEVENT").length - 1).toBe(2);
  });
});
