import { describe, expect, it } from "vitest";
import { ROUTINES } from "../rooted/moveContent";
import { routineSteps } from "../rooted/MovePlayer";
import { POSES } from "../rooted/poses";

describe("move routines", () => {
  it("every move points at real poses", () => {
    for (const r of ROUTINES) for (const m of r.moves) {
      expect(POSES[m.a]).toBeTruthy();
      if (m.b) expect(POSES[m.b]).toBeTruthy();
    }
  });
  it("stated minutes match the moves within a minute", () => {
    for (const r of ROUTINES.filter((x) => x.kind !== "walk")) {
      const secs = r.moves.reduce((a, m) => a + m.secs, 0);
      expect(Math.abs(secs / 60 - r.minutes)).toBeLessThanOrEqual(1);
    }
  });
  it("splits two-sided moves and applies the walk length", () => {
    const yoga = ROUTINES.find((r) => r.id === "yoga")!;
    const steps = routineSteps(yoga);
    expect(steps.filter((s) => s.side).length).toBe(2);
    expect(routineSteps(ROUTINES[0], 5)[0].secs).toBe(300);
  });
});
