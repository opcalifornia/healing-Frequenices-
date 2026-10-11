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

import { breathsPerMinute, customTechnique } from "../rooted/breathContent";
describe("custom patterns", () => {
  it("turns a saved pattern into a playable technique with the right shape", () => {
    const t = customTechnique({ id: "custom-1", name: "Mine", inhale: 4, hold: 4, exhale: 4, rest: 4 });
    expect(t.cycle.map((p) => p.kind)).toEqual(["in", "hold", "out", "rest"]);
    expect(t.shape).toBe("box");
    expect(t.custom).toBe(true);
    const tri = customTechnique({ id: "custom-2", name: "Tri", inhale: 4, hold: 7, exhale: 8, rest: 0 });
    expect(tri.shape).toBe("triangle");
    const two = customTechnique({ id: "custom-3", name: "Two", inhale: 5, hold: 0, exhale: 5, rest: 0 });
    expect(two.cycle).toHaveLength(2);
    expect(two.shape).toBe("orb");
  });
  it("computes breaths per minute", () => {
    expect(breathsPerMinute({ inhale: 5, hold: 0, exhale: 5, rest: 0 })).toBe(6);
  });
});
