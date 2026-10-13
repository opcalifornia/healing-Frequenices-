import { describe, expect, it } from "vitest";
import { PROGRAMS, dayMinutes, safeTechnique } from "../rooted/programs";
import { TECHNIQUES } from "../rooted/breathContent";
import { ROUTINES } from "../rooted/moveContent";
import { pantryById } from "../rooted/pantryContent";
import { safeRoutine } from "../rooted/programs";
import { nextDay } from "../store/programs";
import { flags } from "../store/wellness";

describe("programs", () => {
  it("live programs have days with valid blocks", () => {
    for (const p of PROGRAMS.filter((x) => x.live)) {
      expect(p.days.length).toBeGreaterThan(0);
      for (const d of p.days) for (const b of d.blocks) {
        if (b.type === "breath") expect(TECHNIQUES.some((t) => t.id === b.technique)).toBe(true);
        if (b.type === "quiz") expect(b.answer).toBeLessThan(b.options.length);
        if (b.type === "move") expect(ROUTINES.some((r) => r.id === b.routine)).toBe(true);
        if (b.type === "shop") for (const id of b.items) expect(pantryById(id)).toBeTruthy();
      }
    }
  });
  it("every program references real technique, routine and pantry ids", () => {
    for (const p of PROGRAMS) for (const d of p.days) for (const b of d.blocks) {
      if (b.type === "breath") expect(TECHNIQUES.map((t) => t.id), `${p.id}: ${b.technique}`).toContain(b.technique);
      if (b.type === "move") expect(ROUTINES.map((r) => r.id), `${p.id}: ${b.routine}`).toContain(b.routine);
      if (b.type === "shop") for (const id of b.items) expect(pantryById(id), `${p.id}: ${id}`).toBeTruthy();
      if (b.type === "quiz") {
        expect(Number.isInteger(b.answer) && b.answer >= 0 && b.answer < b.options.length).toBe(true);
        expect(b.explain.length).toBeGreaterThan(0);
      }
    }
  });
  it("has unique program ids", () => {
    expect(new Set(PROGRAMS.map((p) => p.id)).size).toBe(PROGRAMS.length);
  });
  it("includes the sleep, yoga and gratitude programs at 5 to 12 minutes a day", () => {
    const expected = { "sleep-7": 7, "move-10": 10, "gratitude-5": 5 } as const;
    for (const [id, days] of Object.entries(expected)) {
      const p = PROGRAMS.find((x) => x.id === id);
      expect(p, id).toBeTruthy();
      expect(p!.live).toBe(true);
      expect(p!.days.length).toBe(days);
      for (const d of p!.days) {
        expect(dayMinutes(d), `${id}: ${d.title}`).toBeGreaterThanOrEqual(5);
        expect(dayMinutes(d), `${id}: ${d.title}`).toBeLessThanOrEqual(12);
      }
    }
  });
  it("sleep-7 swaps 4-7-8 for relaxed breathing when breath holds need care", () => {
    const sleep = PROGRAMS.find((p) => p.id === "sleep-7")!;
    const holds = sleep.days.flatMap((d) => d.blocks).filter((b) => b.type === "breath" && b.technique === "478");
    expect(holds.length).toBeGreaterThan(0);
    for (const b of holds) if (b.type === "breath") expect(safeTechnique(b.technique, flags(["pregnant"]))).toBe("calm");
  });
  it("move-10 routines all become seated for limited mobility", () => {
    const move = PROGRAMS.find((p) => p.id === "move-10")!;
    for (const b of move.days.flatMap((d) => d.blocks)) if (b.type === "move") expect(safeRoutine(b.routine, flags(["mobility"]))).toBe("desk");
  });
  it("swaps unsafe techniques", () => {
    expect(safeTechnique("478", flags(["pregnant"]))).toBe("calm");
    expect(safeTechnique("power", flags(["heart"]))).toBe("calm");
    expect(safeTechnique("box", flags([]))).toBe("box");
  });
  it("offers seated routines for limited mobility", () => {
    expect(safeRoutine("yoga", flags(["mobility"]))).toBe("desk");
    expect(safeRoutine("yoga", flags([]))).toBe("yoga");
  });
  it("finds the next day", () => {
    expect(nextDay(undefined, 7)).toEqual({ index: 0, doneToday: false, finished: false });
    expect(nextDay({ started: "2026-01-01", done: { 0: "2026-01-01", 1: "2026-01-02" } }, 7).index).toBe(2);
    expect(nextDay({ started: "x", done: Object.fromEntries([0, 1, 2].map((k) => [k, "d"])) }, 3).finished).toBe(true);
  });
});
