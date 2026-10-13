import { describe, expect, it } from "vitest";
import { remindersIcs } from "../rooted/reminders";

describe("reminder calendar", () => {
  it("creates one repeating event with an alarm per reminder", () => {
    const ics = remindersIcs([{ time: "07:30", title: "Breathe", note: "Ease." }, { time: "21:30", title: "Wind down", note: "4-7-8." }], "https://example.com/breathe", new Date(2026, 9, 11, 12));
    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(2);
    expect(ics).toContain("DTSTART:20261011T073000");
    expect(ics).toContain("RRULE:FREQ=DAILY");
    expect(ics.match(/BEGIN:VALARM/g)).toHaveLength(2);
    expect(ics.endsWith("END:VCALENDAR\r\n")).toBe(true);
  });
});
