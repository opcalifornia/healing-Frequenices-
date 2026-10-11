import type { Stage } from "../types";

/** Seconds over which a Deep Sync program glides from one stage to the next. */
export const STAGE_GLIDE = 20;

/** Index of the stage active at `elapsed` seconds (stages are in minutes). */
export function stageIndexAt(stages: Stage[], elapsed: number): number {
  let idx = 0;
  for (let i = 0; i < stages.length; i++) {
    if (elapsed >= stages[i].at * 60) idx = i;
    else break;
  }
  return idx;
}

/** Fade-out length for a session timer: 10% of the session, between 8 and 45 s. */
export function fadeOutSeconds(durationSec: number): number {
  return Math.min(45, Math.max(8, durationSec * 0.1));
}
