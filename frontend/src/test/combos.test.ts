import { describe, expect, it } from "vitest";
import { COMBOS, comboMinutes, resolveSteps } from "../rooted/comboContent";
import { TECHNIQUES } from "../rooted/breathContent";
import { ROUTINES } from "../rooted/moveContent";
import { flags } from "../store/wellness";

const byId = (id: string) => COMBOS.find((c) => c.id === id)!;

describe("combos", () => {
  it("only reference real techniques and routines", () => {
    for (const c of COMBOS) for (const s of c.steps) {
      if (s.type === "breath") {
        expect(TECHNIQUES.some((t) => t.id === s.technique)).toBe(true);
        if (s.alt) expect(TECHNIQUES.some((t) => t.id === s.alt!.technique)).toBe(true);
      }
      if (s.type === "move") expect(ROUTINES.some((r) => r.id === s.routine)).toBe(true);
    }
  });

  it("frequency steps only come last", () => {
    for (const c of COMBOS) c.steps.forEach((s, i) => s.type === "frequency" && expect(i).toBe(c.steps.length - 1));
  });

  it("swaps power breathing and breath holds for flagged profiles", () => {
    const steps = resolveSteps(byId("morning"), flags(["pregnant"]));
    expect(steps.some((s) => s.type === "breath" && s.technique === "power")).toBe(false);
    expect(steps.some((s) => s.type === "breath" && s.technique === "calm")).toBe(true);
    const evening = resolveSteps(byId("evening"), flags(["epilepsy"]));
    expect(evening.some((s) => s.type === "breath" && s.technique === "478")).toBe(false);
  });

  it("drops walking and swaps floor routines for limited mobility", () => {
    const mid = resolveSteps(byId("midday"), flags(["mobility"]));
    expect(mid.some((s) => s.type === "move" && s.routine === "walk")).toBe(false);
    const sun = resolveSteps(byId("sunday"), flags(["mobility"]));
    expect(sun.some((s) => s.type === "move" && s.routine === "desk")).toBe(true);
  });

  it("estimates sensible lengths", () => {
    expect(comboMinutes(resolveSteps(byId("sos"), flags([])))).toBeLessThanOrEqual(5);
    expect(comboMinutes(resolveSteps(byId("evening"), flags([])))).toBeGreaterThanOrEqual(6);
  });
});
