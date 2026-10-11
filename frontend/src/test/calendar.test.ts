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
import { busyOn, conflicts, eventsOn, findFreeSlot, occursOn, useCalendar, type BusyBlock, type HealthEvent } from "../store/calendar";
import { eventsIcs, googleLink, parseBusyIcs } from "../rooted/calendarIcs";
import { SLICES } from "../rooted/sync";

const link = (to = "/") => `https://rooted.app${to}`;
const ev = (p: Partial<HealthEvent>): HealthEvent => ({ id: "e1", title: "Walk", kind: "move", date: "2026-10-12", time: "12:45", minutes: 10, repeat: "none", ...p });

// 2026-10-12 is a Monday.
describe("recurrence", () => {
  it("handles once, daily, weekdays and weekly", () => {
    expect(occursOn(ev({}), "2026-10-12")).toBe(true);
    expect(occursOn(ev({}), "2026-10-13")).toBe(false);
    expect(occursOn(ev({ repeat: "daily" }), "2026-10-11")).toBe(false); // before it starts
    expect(occursOn(ev({ repeat: "daily" }), "2026-10-18")).toBe(true);
    expect(occursOn(ev({ repeat: "weekdays" }), "2026-10-16")).toBe(true); // Friday
    expect(occursOn(ev({ repeat: "weekdays" }), "2026-10-17")).toBe(false); // Saturday
    expect(occursOn(ev({ repeat: "weekly" }), "2026-10-19")).toBe(true);
    expect(occursOn(ev({ repeat: "weekly" }), "2026-10-20")).toBe(false);
    expect(occursOn(ev({ repeat: "daily", skip: { "2026-10-14": true } }), "2026-10-14")).toBe(false);
  });

  it("sorts a day's events by time", () => {
    const list = [ev({ id: "b", time: "18:00" }), ev({ id: "a", time: "07:00" })];
    expect(eventsOn(list, "2026-10-12").map((e) => e.id)).toEqual(["a", "b"]);
  });
});

const work: BusyBlock[] = [
  { start: "2026-10-12T09:00", end: "2026-10-12T12:00", title: "Standup + focus", repeat: "weekly", byDay: [1, 2, 3, 4, 5] },
  { start: "2026-10-12T13:00", end: "2026-10-12T17:00", title: "Shift", repeat: "weekly", byDay: [1, 2, 3, 4, 5] },
];

describe("busy time", () => {
  it("expands repeating work blocks", () => {
    expect(busyOn(work, "2026-10-14")).toHaveLength(2);
    expect(busyOn(work, "2026-10-17")).toHaveLength(0);
  });

  it("flags health events that overlap work", () => {
    const list = [ev({ id: "ok", time: "12:15", minutes: 30 }), ev({ id: "clash", time: "12:45", minutes: 30 })];
    expect(conflicts(list, work, "2026-10-12")).toEqual(["clash"]);
  });

  it("finds a free slot near the preferred time", () => {
    expect(findFreeSlot([], work, "2026-10-12", "10:00", 30)).toBe("08:30"); // nearest gap, before work
    expect(findFreeSlot([], work, "2026-10-12", "15:00", 20)).toBe("17:00");
    // Other health events count as taken too.
    expect(findFreeSlot([ev({ time: "12:00", minutes: 30 })], work, "2026-10-12", "12:00", 20)).toBe("12:30");
    // Weekends are wide open.
    expect(findFreeSlot([], work, "2026-10-17", "10:00", 30)).toBe("10:00");
  });
});

describe("export", () => {
  it("builds an .ics with repeats, skipped days and a reminder", () => {
    const text = eventsIcs([ev({ repeat: "weekdays", note: "Easy pace, chat speed", to: "/move", skip: { "2026-10-14": true } })], link, { now: new Date("2026-10-11T00:00:00Z") });
    expect(text).toContain("DTSTART:20261012T124500");
    expect(text).toContain("DTEND:20261012T125500");
    expect(text).toContain("RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR");
    expect(text).toContain("EXDATE:20261014T124500");
    expect(text).toContain("TRIGGER:-PT5M");
    expect(text).toContain("Easy pace\\, chat speed");
    expect(text.split("\r\n").every((l) => l.length <= 75)).toBe(true);
  });

  it("makes a Google Calendar link", () => {
    const url = new URL(googleLink(ev({ repeat: "daily" }), link));
    expect(url.hostname).toBe("calendar.google.com");
    expect(url.searchParams.get("dates")).toBe("20261012T124500/20261012T125500");
    expect(url.searchParams.get("recur")).toBe("RRULE:FREQ=DAILY");
    expect(url.searchParams.get("details")).toContain("https://rooted.app/");
  });
});

describe("import", () => {
  const ics = [
    "BEGIN:VCALENDAR",
    "BEGIN:VEVENT", "DTSTART:20261012T090000", "DTEND:20261012T100000", "SUMMARY:Team sync\\, weekly", "RRULE:FREQ=WEEKLY;BYDAY=MO,WE;UNTIL=20261231T000000Z", "END:VEVENT",
    "BEGIN:VEVENT", "DTSTART;VALUE=DATE:20261013", "SUMMARY:Holiday", "END:VEVENT",
    "BEGIN:VEVENT", "DTSTART:20200101T090000", "DTEND:20200101T100000", "SUMMARY:Old", "END:VEVENT",
    "BEGIN:VEVENT", "DTSTART:20261015T140000", "DURATION:PT1H30M", "SUMMARY:Client call", "END:VEVENT",
    "BEGIN:VEVENT", "DTSTART:20261016T140000", "DTEND:20261016T150000", "STATUS:CANCELLED", "SUMMARY:Gone", "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  it("reads timed, repeating and duration events; skips all-day, past and cancelled", () => {
    const blocks = parseBusyIcs(ics, "2026-10-11");
    expect(blocks.map((b) => b.title)).toEqual(["Team sync, weekly", "Client call"]);
    expect(blocks[0]).toMatchObject({ repeat: "weekly", byDay: [1, 3] });
    expect(blocks[1].end).toBe("2026-10-15T15:30");
    expect(busyOn(blocks, "2026-10-14")).toHaveLength(1); // Wednesday
    expect(busyOn(blocks, "2026-10-13")).toHaveLength(0);
  });
});

describe("store and sync", () => {
  it("adds, completes and skips events; only events sync", () => {
    const c = useCalendar.getState();
    const e = c.add({ title: "Sit quietly", kind: "spirit", date: "2026-10-12", time: "07:15", minutes: 5, repeat: "daily" });
    useCalendar.getState().toggleDone(e.id, "2026-10-12");
    useCalendar.getState().skipDate(e.id, "2026-10-13");
    const saved = useCalendar.getState().events.guest.find((x) => x.id === e.id)!;
    expect(saved.done).toEqual({ "2026-10-12": true });
    expect(occursOn(saved, "2026-10-13")).toBe(false);
    expect(SLICES.find((s) => s.key === "calendar")!.fields).toEqual(["events"]);
  });
});
