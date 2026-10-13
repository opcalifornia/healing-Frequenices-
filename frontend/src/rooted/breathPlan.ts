import type { Phase, Technique } from "./breathContent";

export interface PlanPhase extends Phase {
  /** Open-ended breath hold: lasts until the person taps, up to `secs`. */
  open?: boolean;
  round?: number;
}

/** Expand a technique into the full list of phases for a session. */
export function buildPlan(t: Technique, minutes: number): PlanPhase[] {
  if (t.rounds) {
    const out: PlanPhase[] = [];
    for (let r = 1; r <= t.rounds.count; r++) {
      for (let b = 0; b < t.rounds.breaths; b++) out.push(...t.cycle.map((p) => ({ ...p, round: r })));
      out.push({ kind: "rest", secs: t.rounds.maxHold, say: "Let it all out and hold", open: true, round: r });
      out.push({ kind: "in", secs: 2.5, say: "Big breath in", round: r });
      out.push({ kind: "hold", secs: t.rounds.recoveryHold, say: "Hold it", round: r });
      out.push({ kind: "out", secs: 3, say: "Let go", round: r });
    }
    return out;
  }
  const cycleLen = t.cycle.reduce((a, p) => a + p.secs, 0);
  const cycles = Math.max(1, Math.round((minutes * 60) / cycleLen));
  return Array.from({ length: cycles }, () => t.cycle).flat();
}

export const planSeconds = (plan: PlanPhase[]) => plan.reduce((a, p) => a + p.secs, 0);
