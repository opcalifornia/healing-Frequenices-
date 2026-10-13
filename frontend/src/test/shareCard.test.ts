import { describe, expect, it } from "vitest";
import { cardText, wrapWords } from "../rooted/shareCard";

const week = { kind: "week" as const, minutes: 57, activeDays: 6, streak: 3, perDay: [13, 10, 10, 0, 6, 15, 3], dayLabels: ["T", "W", "T", "F", "S", "S", "M"], topArea: "Move" };

describe("share cards", () => {
  it("leaves out stress unless it's provided", () => {
    const t = cardText(week);
    expect(t.headline.join(" ")).toBe("57 minutes for me this week");
    expect(t.stats.map((s) => s[1])).toEqual(["minutes", "days active", "day streak"]);
    expect(cardText({ ...week, stressDrop: 2.5 }).stats.at(-1)).toEqual(["−2.5", "stress, avg"]);
  });

  it("handles an empty week and short streaks gently", () => {
    const t = cardText({ ...week, minutes: 0, streak: 1 });
    expect(t.headline.join(" ")).toBe("Showing up for myself this week");
    expect(t.stats.some((s) => s[1] === "day streak")).toBe(false);
  });

  it("words a finished program and wraps long titles", () => {
    const t = cardText({ kind: "program", title: "7 Nights of Better Sleep", days: 7, section: "breathe", hue: 220 });
    expect(t.eyebrow).toBe("breathe program · complete");
    expect(t.headline.every((l) => l.length <= 18)).toBe(true);
    expect(wrapWords("one two three four", 9)).toEqual(["one two", "three", "four"]);
  });
});
