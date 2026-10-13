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
import { isUnlocked, nextStage, stageFor, statsFrom, STAGES, UNLOCKS, unlockedSymbols } from "../rooted/growth";
import { SYMBOLS } from "../rooted/symbols";

const log = (day: string, minutes = 2) => ({ day, kind: "breath:calm", minutes });

describe("growth", () => {
  it("counts days practiced, not streaks, so gaps take nothing away", () => {
    const s = statsFrom([log("2026-10-01"), log("2026-10-01", 5), log("2026-10-09")], 0);
    expect(s).toEqual({ days: 2, minutes: 9, sessions: 3, programsFinished: 0 });
  });

  it("moves through the stages by total days", () => {
    expect(stageFor(0).id).toBe("seed");
    expect(stageFor(1).id).toBe("sprout");
    expect(stageFor(6).id).toBe("sprout");
    expect(stageFor(7).id).toBe("sapling");
    expect(stageFor(500).id).toBe("ancient");
    expect(nextStage(0)?.id).toBe("sprout");
    expect(nextStage(120)).toBeNull();
    expect(STAGES.map((s) => s.days)).toEqual([...STAGES.map((s) => s.days)].sort((a, b) => a - b));
  });

  it("unlocks earned symbols as stages and programs are reached", () => {
    expect(unlockedSymbols({ days: 0, minutes: 0, sessions: 0, programsFinished: 0 })).toEqual([]);
    expect(unlockedSymbols({ days: 1, minutes: 1, sessions: 1, programsFinished: 0 })).toEqual(["dewdrop"]);
    expect(unlockedSymbols({ days: 21, minutes: 90, sessions: 30, programsFinished: 1 })).toEqual(["dewdrop", "lantern", "bonsai", "constellation"]);
    expect(unlockedSymbols({ days: 200, minutes: 900, sessions: 300, programsFinished: 2 })).toHaveLength(6);
  });

  it("leaves free symbols open to everyone and every unlock key is defined", () => {
    expect(isUnlocked("tree", { days: 0, minutes: 0, sessions: 0, programsFinished: 0 })).toBe(true);
    expect(isUnlocked("mandala", { days: 5, minutes: 0, sessions: 0, programsFinished: 0 })).toBe(false);
    for (const s of SYMBOLS) if (s.unlock) expect(UNLOCKS[s.unlock], s.id).toBeDefined();
  });
});
