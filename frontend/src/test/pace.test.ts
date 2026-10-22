import { describe, expect, it } from "vitest";
import { bestPace, paceTechnique, PACES } from "../rooted/PaceFinder";
import { BREATH_SAFETY, BREATH_SCREEN, LEARN_MORE, TECHNIQUES } from "../rooted/breathContent";
import { buildPlan, planSeconds } from "../rooted/breathPlan";

describe("pace finder", () => {
  it("builds an equal, hold-free pattern at the chosen rate", () => {
    const t = paceTechnique(5.5);
    expect(t.cycle.map((p) => p.kind)).toEqual(["in", "out"]);
    expect(t.cycle[0].secs).toBeCloseTo(5.5, 1);
    expect(t.cycle[0].secs + t.cycle[1].secs).toBeCloseTo(60 / 5.5, 0);
    expect(planSeconds(buildPlan(t, 1))).toBeGreaterThanOrEqual(50);
  });
  it("picks the best-felt pace, breaking ties toward six a minute", () => {
    expect(bestPace({ 6.5: 1, 6: 2, 5.5: 2, 5: 0, 4.5: 1 })).toBe(6);
    expect(bestPace({ 6.5: 2, 6: 1, 5.5: 1, 5: 1, 4.5: 2 })).toBe(6.5);
    expect(bestPace({ 6.5: 0, 6: 0, 5.5: 0, 5: 0, 4.5: 0 })).toBe(6);
    expect(bestPace({})).toBeNull();
  });
  it("tries paces within the range clinicians use", () => {
    expect(Math.min(...PACES)).toBe(4.5);
    expect(Math.max(...PACES)).toBe(6.5);
  });
});

describe("breathing content", () => {
  it("includes the evidence-backed additions with no breath holds", () => {
    for (const id of ["resonance", "extended", "pursed", "equal"]) {
      const t = TECHNIQUES.find((x) => x.id === id)!;
      expect(t, id).toBeTruthy();
      expect(t.cycle.some((p) => p.kind === "hold" || p.kind === "rest"), id).toBe(false);
      expect(t.sources.length, id).toBeGreaterThan(0);
      expect(t.gated, id).toBeFalsy();
    }
    expect(TECHNIQUES.find((t) => t.id === "power")!.gated).toBe(true);
  });
  it("states the safety basics and only links https sources", () => {
    const text = BREATH_SAFETY.join(" ").toLowerCase();
    for (const w of ["water", "driving", "dizzy", "pregnant", "988"]) expect(text, w).toContain(w);
    expect(BREATH_SCREEN.length).toBeGreaterThanOrEqual(3);
    for (const l of LEARN_MORE) expect(l.url).toMatch(/^https:\/\//);
    for (const t of TECHNIQUES) for (const s of t.sources) expect(s.url).toMatch(/^https:\/\//);
  });
  it("uses careful wording for new content", () => {
    const text = JSON.stringify([TECHNIQUES.filter((t) => ["resonance", "extended", "pursed", "equal"].includes(t.id)), LEARN_MORE, BREATH_SAFETY]).toLowerCase();
    for (const bad of ["cures", "heals", "miracle", "detox", "guarantee", "calm"]) expect(text, bad).not.toMatch(new RegExp(`\\b${bad}\\b`));
  });
});
