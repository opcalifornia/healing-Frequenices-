import type { DayLog } from "../store/foodLog";
import { keyOf } from "./mealPlan";

/** Food groups to tick through the day. A prompt for variety, not a checklist to complete. */
export const FOOD_GROUPS = [
  { id: "veg", label: "Vegetables", emoji: "🥦" },
  { id: "fruit", label: "Fruit", emoji: "🍎" },
  { id: "grains", label: "Whole grains", emoji: "🌾" },
  { id: "beans", label: "Beans & lentils", emoji: "🫘" },
  { id: "nuts", label: "Nuts & seeds", emoji: "🥜" },
  { id: "fish", label: "Fish & seafood", emoji: "🐟" },
  { id: "ferment", label: "Fermented foods", emoji: "🥛" },
  { id: "herbs", label: "Herbs & spices", emoji: "🌿" },
] as const;
export type FoodGroupId = (typeof FOOD_GROUPS)[number]["id"];

export const PLANT_SOURCES = {
  summary: "People who ate more than 30 different plant foods a week had more varied gut bacteria than people who ate 10 or fewer. It is an observational study of self-reported diets, so it shows a link, not a cause, and a greater variety of gut bacteria is not proven to mean better health.",
  evidence: "Weak" as const,
  sources: [
    { text: "UC San Diego. American Gut Project: what makes up the American gut (news release, 2018)", url: "https://jacobsschool.ucsd.edu/news/release/2543" },
    { text: "McDonald D et al. American Gut: an open platform for citizen science microbiome research. mSystems, 2018", url: "https://doi.org/10.1128/mSystems.00031-18" },
  ],
};

/** The last `n` days ending at `end`, oldest first. */
export function lastDays(end: Date, n = 7): string[] {
  return Array.from({ length: n }, (_, i) => keyOf(new Date(end.getFullYear(), end.getMonth(), end.getDate() - (n - 1 - i))));
}

export const groupCount = (d: DayLog | undefined) => new Set((d?.groups ?? []).filter((g) => FOOD_GROUPS.some((x) => x.id === g))).size;

/** Different plants across these days, ignoring case, so "Spinach" and "spinach" count once. */
export function uniquePlants(logs: Record<string, DayLog>, days: string[]): string[] {
  const seen = new Map<string, string>();
  for (const d of days) for (const p of logs[d]?.plants ?? []) if (!seen.has(p.toLowerCase())) seen.set(p.toLowerCase(), p);
  return [...seen.values()];
}

export const mealsLogged = (d: DayLog | undefined) => (d?.eaten?.length ?? 0) + (d?.extras?.length ?? 0);
