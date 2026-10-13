/**
 * How a scanned product is judged. The rules are deliberately simple and written down
 * on the "How we rate" page, so anyone can see why a product got its verdict.
 *
 * - Additives: judged from our research library (see additivesContent.ts).
 * - Nutrition: fat, saturates, sugars and salt are sorted into low / medium / high with the
 *   UK front-of-pack traffic-light cut-offs (2016), plus the Nutri-Score letter when there is one.
 * - Overall: a product is only as good as its weakest part.
 */
import type { Additive } from "./additivesContent";
import type { Nutrition, Product } from "./foodLookup";

export type Verdict = "good" | "fair" | "poor";
export type Level = "low" | "medium" | "high";

export const VERDICT_LABEL: Record<Verdict, string> = { good: "Few concerns", fair: "Some concerns", poor: "Several concerns" };
const ORDER: Record<Verdict, number> = { good: 0, fair: 1, poor: 2 };

/** Per 100 g: [low up to, high above]. */
const FOOD = { fat: [3, 17.5], sat: [1.5, 5], sugars: [5, 22.5], salt: [0.3, 1.5] } as const;
/** Per 100 ml. */
const DRINK = { fat: [1.5, 8.75], sat: [0.75, 2.5], sugars: [2.5, 11.25], salt: [0.3, 0.75] } as const;

export type Nutrient = "fat" | "sat" | "sugars" | "salt";
export const NUTRIENTS: Array<{ id: Nutrient; label: string }> = [
  { id: "sugars", label: "Sugars" },
  { id: "sat", label: "Saturated fat" },
  { id: "salt", label: "Salt" },
  { id: "fat", label: "Fat" },
];

export function level(n: Nutrient, value: number, isDrink: boolean): Level {
  const [lo, hi] = (isDrink ? DRINK : FOOD)[n];
  return value <= lo ? "low" : value > hi ? "high" : "medium";
}

export interface NutrientRow {
  id: Nutrient | "fiber";
  label: string;
  value: number;
  unit: "g";
  level: Level;
  note: string;
}

const NOTE: Record<Nutrient, Record<Level, string>> = {
  sugars: { low: "Low in sugars", medium: "Moderate sugars", high: "High in sugars" },
  sat: { low: "Low in saturated fat", medium: "Moderate saturated fat", high: "High in saturated fat" },
  salt: { low: "Low in salt", medium: "Moderate salt", high: "High in salt" },
  fat: { low: "Low in fat", medium: "Moderate fat", high: "High in fat" },
};

/** The nutrients we have, sorted for display: high first, then medium, then low. */
export function nutrientRows(n: Nutrition | undefined, isDrink: boolean): NutrientRow[] {
  if (!n) return [];
  const rows: NutrientRow[] = [];
  for (const { id, label } of NUTRIENTS) {
    const v = n[id];
    if (v === undefined) continue;
    const l = level(id, v, isDrink);
    rows.push({ id, label, value: v, unit: "g", level: l, note: NOTE[id][l] });
  }
  // "Source of fibre" is an EU claim threshold: at least 3 g per 100 g.
  if (n.fiber !== undefined && n.fiber >= 3 && !isDrink) rows.push({ id: "fiber", label: "Fibre", value: n.fiber, unit: "g", level: "low", note: "A source of fibre" });
  const rank = { high: 0, medium: 1, low: 2 } as const;
  return rows.sort((a, b) => rank[a.level] - rank[b.level]);
}

export function additiveVerdict(known: Additive[]): Verdict {
  const some = known.filter((a) => a.level === "some").length;
  if (known.some((a) => a.level === "restricted") || some >= 3) return "poor";
  return some >= 1 ? "fair" : "good";
}

export function nutritionVerdict(p: Pick<Product, "nutrition" | "grade" | "isDrink">): Verdict | undefined {
  const rows = nutrientRows(p.nutrition, p.isDrink);
  if (!rows.length && !p.grade) return undefined;
  const highs = rows.filter((r) => r.level === "high").length;
  if (p.grade === "e" || highs >= 2) return "poor";
  if (p.grade === "d" || highs === 1) return "fair";
  return "good";
}

export interface Assessment {
  additives: Verdict;
  nutrition?: Verdict;
  overall: Verdict;
  /** True when some additives aren't in our library yet, so the additive verdict covers only what we know. */
  partial: boolean;
  /** True only when both parts were judged and every additive is in our library. A "good" verdict that isn't complete is worded "so far". */
  complete: boolean;
}

/** The verdict as words. A good verdict we couldn't fully check says "so far", so it never reads as an all-clear. */
export function overallLabel(a: Pick<Assessment, "overall" | "complete">): string {
  return a.overall === "good" && !a.complete ? `${VERDICT_LABEL.good} so far` : VERDICT_LABEL[a.overall];
}

export function assess(p: Product, known: Additive[], unknownCount: number): Assessment {
  const additives = additiveVerdict(known);
  const nutrition = nutritionVerdict(p);
  const overall = [additives, nutrition].filter((v): v is Verdict => !!v).sort((a, b) => ORDER[b] - ORDER[a])[0];
  return { additives, nutrition, overall, partial: unknownCount > 0, complete: unknownCount === 0 && nutrition !== undefined };
}

/** How much better `a` is than `b`: negative means `a` is the better product. */
export function compare(a: Assessment, aAdds: number, b: Assessment, bAdds: number): number {
  return ORDER[a.overall] - ORDER[b.overall] || aAdds - bAdds;
}

export const NOVA_LABEL: Record<1 | 2 | 3 | 4, string> = {
  1: "Unprocessed or minimally processed",
  2: "Processed culinary ingredient",
  3: "Processed food",
  4: "Ultra-processed food",
};

/** A suggestion only counts when its overall verdict is strictly better than the current product's. */
export function isBetterChoice(candidate: Assessment, current: Assessment): boolean {
  return ORDER[candidate.overall] < ORDER[current.overall];
}

/** One plain sentence on why the nutrition part got its verdict, or undefined when it is fine. */
export function nutritionReason(p: Pick<Product, "nutrition" | "grade" | "isDrink">): string | undefined {
  const v = nutritionVerdict(p);
  if (!v || v === "good") return undefined;
  const highs = nutrientRows(p.nutrition, p.isDrink).filter((r) => r.level === "high").map((r) => r.label.toLowerCase());
  const parts: string[] = [];
  if (p.grade === "e" || p.grade === "d") parts.push(`its Nutri-Score is ${p.grade.toUpperCase()}`);
  if (highs.length) parts.push(`it is high in ${highs.join(" and ")}`);
  return parts.length ? `Rated ${VERDICT_LABEL[v].toLowerCase()} because ${parts.join(" and ")}.` : undefined;
}
