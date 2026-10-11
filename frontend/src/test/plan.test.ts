import { describe, expect, it } from "vitest";
import { pickFor, sectionRank, slotFor } from "../rooted/plan";
import { DEFAULT_ABOUT, flags } from "../store/wellness";

const about = (o: Partial<typeof DEFAULT_ABOUT>) => ({ ...DEFAULT_ABOUT, onboarded: true, ...o });

describe("daily plan", () => {
  it("maps hours to parts of the day", () => {
    expect(slotFor(7)).toBe("morning");
    expect(slotFor(13)).toBe("midday");
    expect(slotFor(21)).toBe("evening");
    expect(slotFor(2)).toBe("evening");
  });

  it("puts sleep items first in the evening for sleep goals", () => {
    const picks = pickFor(about({ goals: ["sleep"] }), "evening");
    expect(picks.length).toBe(3);
    expect(picks.every((p) => (p.serves.sleep ?? 0) > 0)).toBe(true);
    expect(picks[0].reason).toBe("sleep");
  });

  it("never suggests power breathing or breath holds to someone pregnant", () => {
    const a = about({ goals: ["energy", "sleep", "focus"], minutes: 20, considerations: ["pregnant"] });
    for (const s of ["morning", "midday", "evening"] as const) {
      const ids = pickFor(a, s, 10).map((p) => p.id);
      expect(ids).not.toContain("power");
      expect(ids).not.toContain("478");
      expect(ids).not.toContain("box");
    }
    expect(pickFor(about({ goals: ["energy"], minutes: 20 }), "morning").map((p) => p.id)).toContain("power");
  });

  it("respects limited mobility and short time budgets", () => {
    const ids = pickFor(about({ goals: ["move", "aches"], considerations: ["mobility"] }), "midday", 10).map((p) => p.id);
    expect(ids).not.toContain("walk");
    expect(ids).toContain("desk");
    const quick = pickFor(about({ goals: ["focus"], minutes: 5 }), "morning", 10).map((p) => p.id);
    expect(quick).not.toContain("focus-session");
  });

  it("ranks sections by goals and derives flags", () => {
    expect(sectionRank("nourish", ["eat"])).toBeGreaterThan(sectionRank("move", ["eat"]));
    expect(flags(["diabetes"]).noFasting).toBe(true);
    expect(flags([]).noPowerBreathing).toBe(false);
  });
});

import { dayPlan } from "../rooted/plan";
describe("day plan", () => {
  it("doesn't repeat items across the day", () => {
    const d = dayPlan(about({ goals: ["stress", "sleep", "energy"] }));
    const ids = [...d.morning, ...d.midday, ...d.evening].map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
