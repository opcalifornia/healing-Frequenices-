import { useMemo } from "react";
import type { PracticeEntry } from "../store/practice";
import { usePracticeLog } from "../store/practice";
import { PROGRAMS } from "./programs";
import { nextDay, useEnrollments } from "../store/programs";
import { SYMBOLS } from "./symbols";

/**
 * Growth: a private, gentle picture of showing up. It counts total days you did
 * something (never streaks), so a missed day takes nothing away. Nothing here
 * is shared with anyone.
 */

export interface Stage {
  id: string;
  name: string;
  /** Days of practice needed. */
  days: number;
  blurb: string;
}

export const STAGES: Stage[] = [
  { id: "seed", name: "Seed", days: 0, blurb: "You're here. That's the first step." },
  { id: "sprout", name: "Sprout", days: 1, blurb: "Something has started to grow." },
  { id: "sapling", name: "Sapling", days: 7, blurb: "Roots are taking hold." },
  { id: "tree", name: "Tree", days: 21, blurb: "Steady and strong. This is becoming yours." },
  { id: "grove", name: "Grove", days: 60, blurb: "A habit that gives back, season after season." },
  { id: "ancient", name: "Ancient grove", days: 120, blurb: "Deep roots. Take a breath and enjoy it." },
];

export interface GrowthStats {
  /** Different days with at least one practice. */
  days: number;
  minutes: number;
  sessions: number;
  programsFinished: number;
}

export function statsFrom(logs: PracticeEntry[], programsFinished: number): GrowthStats {
  return {
    days: new Set(logs.map((l) => l.day)).size,
    minutes: Math.round(logs.reduce((a, l) => a + l.minutes, 0)),
    sessions: logs.length,
    programsFinished,
  };
}

export function stageFor(days: number): Stage {
  return [...STAGES].reverse().find((s) => days >= s.days) ?? STAGES[0];
}

export function nextStage(days: number): Stage | null {
  return STAGES.find((s) => s.days > days) ?? null;
}

/** What unlocks which symbol. A symbol's `unlock` field names one of these. */
export const UNLOCKS: Record<string, { label: string; met(s: GrowthStats): boolean }> = {
  sprout: { label: "Reach Sprout (your first day)", met: (s) => s.days >= 1 },
  sapling: { label: "Reach Sapling (7 days of practice)", met: (s) => s.days >= 7 },
  tree: { label: "Reach Tree (21 days of practice)", met: (s) => s.days >= 21 },
  grove: { label: "Reach Grove (60 days of practice)", met: (s) => s.days >= 60 },
  ancient: { label: "Reach Ancient grove (120 days of practice)", met: (s) => s.days >= 120 },
  program: { label: "Finish a program", met: (s) => s.programsFinished >= 1 },
};

/** Ids of earned symbols this person has unlocked. */
export function unlockedSymbols(stats: GrowthStats): string[] {
  return SYMBOLS.filter((s) => s.unlock && UNLOCKS[s.unlock]?.met(stats)).map((s) => s.id);
}

export function isUnlocked(symbolId: string, stats: GrowthStats): boolean {
  const s = SYMBOLS.find((x) => x.id === symbolId);
  return !s?.unlock || !!UNLOCKS[s.unlock]?.met(stats);
}

export function useGrowth(): GrowthStats {
  const logs = usePracticeLog();
  const enrolled = useEnrollments();
  return useMemo(() => {
    const finished = PROGRAMS.filter((p) => enrolled[p.id] && nextDay(enrolled[p.id], p.days.length).finished).length;
    return statsFrom(logs, finished);
  }, [logs, enrolled]);
}
