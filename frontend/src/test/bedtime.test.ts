import { describe, expect, it } from "vitest";
import { bedtimeIcs, DEFAULT_PLAN, fromMinutes, nightKey, streak, toMinutes } from "../store/bedtime";

describe("bedtime helpers", () => {
  it("converts clock times", () => {
    expect(toMinutes("22:30")).toBe(1350);
    expect(fromMinutes(1350 - 45)).toBe("21:45");
    expect(fromMinutes(-30)).toBe("23:30");
    expect(fromMinutes(1440 + 15)).toBe("00:15");
  });

  it("counts after-midnight listening toward the previous evening", () => {
    expect(nightKey(new Date(2026, 9, 11, 23, 0))).toBe("2026-10-11");
    expect(nightKey(new Date(2026, 9, 12, 1, 30))).toBe("2026-10-11");
    expect(nightKey(new Date(2026, 9, 12, 13, 0))).toBe("2026-10-12");
  });

  it("counts a streak of consecutive nights", () => {
    const nights = ["2026-10-08", "2026-10-09", "2026-10-10", "2026-10-11"];
    expect(streak(nights, new Date(2026, 9, 11, 23))).toBe(4);
    // Next afternoon, tonight not logged yet: the streak is still alive.
    expect(streak(nights, new Date(2026, 9, 12, 15))).toBe(4);
    // A missed night breaks it.
    expect(streak(nights, new Date(2026, 9, 14, 15))).toBe(0);
    expect(streak(["2026-10-09", "2026-10-11"], new Date(2026, 9, 11, 23))).toBe(1);
  });

  it("builds a daily calendar alarm at wind-down time", () => {
    const ics = bedtimeIcs({ ...DEFAULT_PLAN, bedtime: "22:30", windDown: 45 }, new Date(2026, 9, 11, 12));
    expect(ics).toContain("DTSTART:20261011T214500");
    expect(ics).toContain("RRULE:FREQ=DAILY");
    expect(ics).toContain("BEGIN:VALARM");
    expect(ics.split("\r\n")[0]).toBe("BEGIN:VCALENDAR");
  });
});
