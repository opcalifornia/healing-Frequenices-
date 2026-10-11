import type { AboutYou, GoalId } from "../store/wellness";
import { flags } from "../store/wellness";

/**
 * The daily plan: a few small things, picked for someone's goals, time and
 * health considerations, for the current part of the day.
 */

export type Slot = "morning" | "midday" | "evening";
export const slotFor = (h: number): Slot => (h >= 4 && h < 11 ? "morning" : h >= 11 && h < 17 ? "midday" : "evening");
export const SLOT_LABEL: Record<Slot, string> = { morning: "This morning", midday: "This afternoon", evening: "This evening" };

export interface PlanItem {
  id: string;
  title: string;
  body: string;
  to: string;
  minutes: number;
  slots: Slot[];
  /** How much it serves each goal, 0-3. */
  serves: Partial<Record<GoalId, number>>;
  /** Practice-log kind that marks it done today. */
  doneKind?: string;
  icon: "timer" | "headphones" | "plus" | "replay" | "sparkle" | "bookmark" | "book" | "user";
  excludeIf?: (f: ReturnType<typeof flags>) => boolean;
  minTime?: number;
}

export const ITEMS: PlanItem[] = [
  { id: "light", title: "Morning light", body: "Get outside for 5 to 10 minutes within an hour of waking. It sets your body clock.", to: "/learn/sleep", minutes: 10, slots: ["morning"], serves: { sleep: 3, energy: 2, connect: 1 }, icon: "sparkle" },
  { id: "power", title: "Power breathing", body: "Three rounds to wake up your body. Sitting down.", to: "/breathe", minutes: 8, slots: ["morning"], serves: { energy: 3 }, doneKind: "breath:power", icon: "timer", excludeIf: (f) => f.noPowerBreathing, minTime: 10 },
  { id: "wake", title: "Morning wake-up stretch", body: "Five minutes to loosen up after sleep.", to: "/move", minutes: 5, slots: ["morning"], serves: { energy: 2, aches: 2, move: 2 }, doneKind: "move:wake", icon: "replay", excludeIf: (f) => f.seated },
  { id: "brocades", title: "Qigong: Eight Brocades", body: "Slow, energizing movements from a centuries-old practice.", to: "/move", minutes: 6, slots: ["morning"], serves: { energy: 2, aches: 1, stress: 1, move: 1 }, doneKind: "move:brocades", icon: "replay", minTime: 10, excludeIf: (f) => f.seated },
  { id: "focus-session", title: "A focus session", body: "Headphones on, beta-range beats for deep work.", to: "/frequencies", minutes: 20, slots: ["morning", "midday"], serves: { focus: 3 }, icon: "headphones", minTime: 20 },
  { id: "box", title: "Box breathing", body: "Steady yourself before something important.", to: "/breathe", minutes: 2, slots: ["morning", "midday"], serves: { focus: 2, stress: 2 }, doneKind: "breath:box", icon: "timer", excludeIf: (f) => f.breathHoldCare },
  { id: "water", title: "Drink a glass of water", body: "Log it in Nourish. Food covers about a fifth of what you need.", to: "/nourish#water", minutes: 1, slots: ["morning", "midday"], serves: { energy: 1, eat: 2, focus: 1 }, icon: "plus" },
  { id: "walk", title: "Walk after lunch", body: "Ten easy minutes blunts the blood sugar spike.", to: "/move", minutes: 10, slots: ["midday"], serves: { move: 3, eat: 2, energy: 2, stress: 1 }, doneKind: "move:walk", icon: "replay", excludeIf: (f) => f.seated },
  { id: "desk", title: "Desk reset", body: "Three minutes of seated stretches to undo the slump.", to: "/move", minutes: 3, slots: ["midday"], serves: { aches: 3, focus: 1, move: 1 }, doneKind: "move:desk", icon: "replay" },
  { id: "sigh", title: "Physiological sigh", body: "The quickest stress reset there is. One minute.", to: "/breathe", minutes: 1, slots: ["midday", "evening"], serves: { stress: 3 }, doneKind: "breath:sigh", icon: "timer" },
  { id: "calm", title: "One-minute calm", body: "Breathe in for 4, out for 6. Follow the circle.", to: "/breathe", minutes: 1, slots: ["morning", "midday", "evening"], serves: { stress: 2, sleep: 1, focus: 1 }, doneKind: "breath:calm", icon: "timer" },
  { id: "pantry", title: "Add fiber to your list", body: "Beans, oats, berries or seeds. Learn why in the Pantry.", to: "/nourish#pantry", minutes: 2, slots: ["midday"], serves: { eat: 3 }, icon: "bookmark" },
  { id: "plate", title: "Build tonight's plate", body: "Half vegetables, a quarter grains, a quarter protein.", to: "/nourish#plate", minutes: 2, slots: ["midday", "evening"], serves: { eat: 2 }, icon: "sparkle" },
  { id: "taichi", title: "Tai chi basics", body: "Slow, flowing balance practice. Six minutes.", to: "/move", minutes: 6, slots: ["midday", "evening"], serves: { stress: 2, aches: 2, move: 2 }, doneKind: "move:taichi", icon: "replay", minTime: 10, excludeIf: (f) => f.seated },
  { id: "yoga", title: "Gentle yoga flow", body: "Ten beginner-friendly minutes on the floor.", to: "/move", minutes: 10, slots: ["evening"], serves: { aches: 3, stress: 2, move: 2, sleep: 1 }, doneKind: "move:yoga", icon: "replay", minTime: 20, excludeIf: (f) => f.seated },
  { id: "offline", title: "An hour without your phone", body: "Leave it in another room this evening. Talk, read, cook, walk.", to: "/", minutes: 0, slots: ["evening"], serves: { connect: 3, sleep: 1, stress: 1 }, icon: "user" },
  { id: "pmr", title: "Tense and let go", body: "Progressive muscle relaxation, head to toe, in bed.", to: "/breathe#relax", minutes: 3, slots: ["evening"], serves: { sleep: 2, stress: 2, aches: 1 }, doneKind: "pmr", icon: "timer" },
  { id: "bedstretch", title: "Bedtime stretch", body: "Six slow minutes with the lights low.", to: "/move", minutes: 6, slots: ["evening"], serves: { sleep: 3, aches: 2 }, doneKind: "move:bedtime", icon: "replay", minTime: 10 },
  { id: "478", title: "4-7-8 breathing in bed", body: "A long exhale to help you drift off.", to: "/breathe", minutes: 2, slots: ["evening"], serves: { sleep: 3 }, doneKind: "breath:478", icon: "timer", excludeIf: (f) => f.breathHoldCare },
  { id: "winddown", title: "Wind down for sleep", body: "Your bedtime routine of sounds and light cues.", to: "/bedtime", minutes: 30, slots: ["evening"], serves: { sleep: 3, stress: 1 }, icon: "headphones" },
];

export const GOAL_SHORT: Record<GoalId, string> = { sleep: "sleep better", stress: "feel calmer", energy: "have more energy", focus: "focus", eat: "eat better", move: "move more", aches: "ease aches", connect: "spend less time on screens" };

export interface Picked extends PlanItem {
  reason?: GoalId;
}

/** Pick up to `n` items for a slot, best match first, within the daily time budget. */
export function pickFor(about: AboutYou, slot: Slot, n = 3, avoid: Set<string> = new Set()): Picked[] {
  const f = flags(about.considerations);
  const goals = about.goals.length ? about.goals : (["stress", "sleep", "move"] as GoalId[]);
  const budget = about.minutes * 2; // across the day, generous: a few minutes each part of the day
  const scored = ITEMS.filter((i) => i.slots.includes(slot) && !avoid.has(i.id) && !i.excludeIf?.(f) && (i.minTime ?? 0) <= about.minutes)
    .map((i) => {
      let best: GoalId | undefined;
      let score = 0;
      goals.forEach((g, rank) => {
        const v = (i.serves[g] ?? 0) * (rank === 0 ? 1.5 : 1);
        score += v;
        if (v > 0 && (!best || (i.serves[g] ?? 0) > (i.serves[best] ?? 0))) best = g;
      });
      if (about.activity === "low" && i.minutes > 8 && i.icon === "replay") score -= 1;
      return { ...i, reason: best, score };
    })
    .filter((i) => i.score > 0)
    .sort((a, b) => b.score - a.score);

  const out: Picked[] = [];
  let used = 0;
  for (const i of scored) {
    if (out.length >= n) break;
    if (used + i.minutes > budget && out.length > 0 && i.minutes > 2) continue;
    out.push(i);
    used += i.minutes;
  }
  return out;
}

/** Section ids ordered by how much they serve someone's goals. */
const SECTION_GOALS: Record<string, GoalId[]> = {
  healing: ["sleep", "stress", "focus"],
  breathe: ["stress", "sleep", "focus", "energy"],
  nourish: ["eat", "energy"],
  move: ["move", "aches", "energy"],
  learn: ["sleep"],
  combos: ["stress", "sleep", "energy"],
  spirit: ["stress", "connect"],
  support: ["stress"],
  earth: ["connect"],
};
export function sectionRank(id: string, goals: GoalId[]): number {
  return (SECTION_GOALS[id] ?? []).reduce((a, g) => a + (goals.includes(g) ? 3 - Math.min(2, goals.indexOf(g)) : 0), 0);
}

/** A whole day, with no item repeated across parts of the day. */
export function dayPlan(about: AboutYou, n = 2): Record<Slot, Picked[]> {
  const used = new Set<string>();
  const out = {} as Record<Slot, Picked[]>;
  for (const s of ["morning", "midday", "evening"] as Slot[]) {
    out[s] = pickFor(about, s, n, used);
    out[s].forEach((i) => used.add(i.id));
  }
  return out;
}
