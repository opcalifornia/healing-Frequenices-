import { useMemo } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUser } from "./user";
import { todayKey } from "./nourish";

/** A log of non-audio practices (breathing, grounding, combos) for streaks and the hub. */
export interface PracticeEntry {
  day: string;
  kind: string;
  minutes: number;
  /** Stress 1-10 before and after, when the person checked in. */
  before?: number;
  after?: number;
}

export type SoundMode = "chimes" | "voice" | "tone" | "silent";
export interface BreathPrefs {
  sound: SoundMode;
  scape: "none" | "rain" | "stream" | "waterfall" | "rainforest";
  checkIn: boolean;
}
export const DEFAULT_PREFS: BreathPrefs = { sound: "chimes", scape: "none", checkIn: true };

export interface CustomPattern {
  id: string;
  name: string;
  inhale: number;
  hold: number;
  exhale: number;
  rest: number;
}

/** A camera heart check. */
export interface HeartResult {
  day: string;
  at: number;
  bpm: number;
  rmssd: number;
}

/** A breath-hold (BOLT) test result in seconds. */
export interface BoltResult {
  day: string;
  secs: number;
}

interface PracticeState {
  logs: Record<string, PracticeEntry[]>;
  prefs: BreathPrefs;
  customs: Record<string, CustomPattern[]>;
  bolts: Record<string, BoltResult[]>;
  hearts: Record<string, HeartResult[]>;
  addHeart(r: Omit<HeartResult, "day" | "at">): void;
  log(kind: string, minutes: number, extra?: { before?: number; after?: number }): void;
  setPrefs(p: Partial<BreathPrefs>): void;
  saveCustom(c: CustomPattern): void;
  removeCustom(id: string): void;
  addBolt(secs: number): void;
}

export const usePractice = create<PracticeState>()(
  persist(
    (set, get) => ({
      logs: {},
      prefs: DEFAULT_PREFS,
      customs: {},
      bolts: {},
      hearts: {},
      addHeart(r) {
        const pid = useUser.getState().activeProfileId ?? "guest";
        set({ hearts: { ...get().hearts, [pid]: [...(get().hearts?.[pid] ?? []), { ...r, day: todayKey(), at: Date.now() }].slice(-200) } });
      },
      log(kind, minutes, extra) {
        const pid = useUser.getState().activeProfileId ?? "guest";
        const list = get().logs[pid] ?? [];
        set({ logs: { ...get().logs, [pid]: [...list, { day: todayKey(), kind, minutes: Math.round(minutes * 10) / 10, ...extra }].slice(-1000) } });
      },
      setPrefs(p) {
        set({ prefs: { ...DEFAULT_PREFS, ...get().prefs, ...p } });
      },
      saveCustom(c) {
        const pid = useUser.getState().activeProfileId ?? "guest";
        const mine = (get().customs[pid] ?? []).filter((x) => x.id !== c.id);
        set({ customs: { ...get().customs, [pid]: [...mine, c].slice(-20) } });
      },
      removeCustom(id) {
        const pid = useUser.getState().activeProfileId ?? "guest";
        set({ customs: { ...get().customs, [pid]: (get().customs[pid] ?? []).filter((x) => x.id !== id) } });
      },
      addBolt(secs) {
        const pid = useUser.getState().activeProfileId ?? "guest";
        set({ bolts: { ...get().bolts, [pid]: [...(get().bolts[pid] ?? []), { day: todayKey(), secs: Math.round(secs) }].slice(-200) } });
      },
    }),
    { name: "rooted-practice", version: 1 },
  ),
);

const EMPTY: PracticeEntry[] = [];
const EMPTY_C: CustomPattern[] = [];
const EMPTY_B: BoltResult[] = [];
export function useCustomPatterns(): CustomPattern[] {
  const pid = useUser((s) => s.activeProfileId) ?? "guest";
  return usePractice((s) => s.customs?.[pid] ?? EMPTY_C);
}
const EMPTY_H: HeartResult[] = [];
export function useHearts(): HeartResult[] {
  const pid = useUser((s) => s.activeProfileId) ?? "guest";
  return usePractice((s) => s.hearts?.[pid] ?? EMPTY_H);
}
export function useBolts(): BoltResult[] {
  const pid = useUser((s) => s.activeProfileId) ?? "guest";
  return usePractice((s) => s.bolts?.[pid] ?? EMPTY_B);
}
export function usePrefs(): BreathPrefs {
  const p = usePractice((s) => s.prefs);
  return useMemo(() => ({ ...DEFAULT_PREFS, ...p }), [p]);
}
export function usePracticeLog(): PracticeEntry[] {
  const pid = useUser((s) => s.activeProfileId) ?? "guest";
  return usePractice((s) => s.logs[pid] ?? EMPTY);
}

/** Consecutive days with any practice, ending today (or yesterday if today has none yet). */
export function practiceStreak(entries: PracticeEntry[], now = new Date()): number {
  const days = new Set(entries.map((e) => e.day));
  const d = new Date(now);
  if (!days.has(todayKey(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (days.has(todayKey(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export const minutesOn = (entries: PracticeEntry[], day = todayKey()) => entries.filter((e) => e.day === day).reduce((a, e) => a + e.minutes, 0);
