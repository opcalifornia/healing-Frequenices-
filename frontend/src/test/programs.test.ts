import { describe, expect, it } from "vitest";
import { PROGRAMS, safeTechnique } from "../rooted/programs";
import { TECHNIQUES } from "../rooted/breathContent";
import { nextDay } from "../store/programs";
import { flags } from "../store/wellness";

describe("programs", () => {
  it("live programs have days with valid blocks", () => {
    for (const p of PROGRAMS.filter((x) => x.live)) {
      expect(p.days.length).toBeGreaterThan(0);
      for (const d of p.days) for (const b of d.blocks) {
        if (b.type === "breath") expect(TECHNIQUES.some((t) => t.id === b.technique)).toBe(true);
        if (b.type === "quiz") expect(b.answer).toBeLessThan(b.options.length);
      }
    }
  });
  it("swaps unsafe techniques", () => {
    expect(safeTechnique("478", flags(["pregnant"]))).toBe("calm");
    expect(safeTechnique("power", flags(["heart"]))).toBe("calm");
    expect(safeTechnique("box", flags([]))).toBe("box");
  });
  it("finds the next day", () => {
    expect(nextDay(undefined, 7)).toEqual({ index: 0, doneToday: false, finished: false });
    expect(nextDay({ started: "2026-01-01", done: { 0: "2026-01-01", 1: "2026-01-02" } }, 7).index).toBe(2);
    expect(nextDay({ started: "x", done: Object.fromEntries([0, 1, 2].map((k) => [k, "d"])) }, 3).finished).toBe(true);
  });
});
