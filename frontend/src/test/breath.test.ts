import { describe, expect, it } from "vitest";
import { TECHNIQUES } from "../rooted/breathContent";
import { buildPlan, planSeconds } from "../rooted/breathPlan";
import { practiceStreak } from "../store/practice";

const byId = (id: string) => TECHNIQUES.find((t) => t.id === id)!;

describe("breath plans", () => {
  it("fills the chosen time with whole cycles", () => {
    const plan = buildPlan(byId("box"), 4);
    expect(planSeconds(plan)).toBe(240);
    expect(plan.map((p) => p.kind).slice(0, 4)).toEqual(["in", "hold", "out", "rest"]);
  });

  it("4-7-8 for one minute rounds to three cycles", () => {
    expect(buildPlan(byId("478"), 1)).toHaveLength(9);
  });

  it("power breathing runs rounds with one open hold each", () => {
    const t = byId("power");
    const plan = buildPlan(t, 0);
    expect(plan.filter((p) => p.open)).toHaveLength(t.rounds!.count);
    expect(plan.filter((p) => p.kind === "in" && p.round === 1)).toHaveLength(t.rounds!.breaths + 1);
    expect(t.gated).toBe(true);
  });
});

describe("practice streak", () => {
  it("counts consecutive days and tolerates no practice yet today", () => {
    const e = (day: string) => ({ day, kind: "x", minutes: 1 });
    expect(practiceStreak([e("2026-03-09"), e("2026-03-10")], new Date(2026, 2, 11, 9))).toBe(2);
    expect(practiceStreak([e("2026-03-09"), e("2026-03-11")], new Date(2026, 2, 11, 9))).toBe(1);
  });
});
