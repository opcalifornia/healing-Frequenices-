/**
 * How a scanned product is judged. The rules are deliberately simple and written down
 * on the "How we rate" page, so anyone can see why a product got its verdict.
 *
 * - Additives: judged from our research library (see additivesContent.ts).
 * - Nutrition: fat, saturates, sugars and salt are sorted into low / medium / high with the
 *   UK front-of-pack traffic-light cut-offs (2016), plus the Nutri-Score letter when there is one.
 * - Overall: a product is only as good as its weakest part.
 */
import { TIER_ORDER, shownName, tierOf, type Additive } from "./additivesContent";
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

/** Points per additive by how strong the concern is. A product's additive score is the sum. */
const POINTS = { restricted: 99, notable: 3, some: 2, clear: 0 } as const;
/** Same yellow on screen, but a credible concern still weighs more than a lab-only or early one. */
const pointsOf = (a: Additive) => {
  const t = tierOf(a);
  return t === "some" && (a.level !== "some" || a.labOnly) ? 1 : POINTS[t];
};
/** At this many additives or more, a product can't be "few concerns": nobody has studied them in combination. */
export const MANY_ADDITIVES = 8;

export function additiveScore(known: Additive[]): number {
  return known.reduce((sum, a) => sum + pointsOf(a), 0);
}

/**
 * Additives are judged by their rating, not just counted: a restricted additive or a score of 6 or more is "several
 * concerns", any real concern or two minor ones is "some", and a long list is never "few concerns" on its own.
 */
export function additiveVerdict(known: Additive[], total = known.length): Verdict {
  const score = additiveScore(known);
  const notable = known.filter((a) => TIER_ORDER[tierOf(a)] <= TIER_ORDER.notable).length;
  if (known.some((a) => tierOf(a) === "restricted") || score >= 6 || notable >= 2) return "poor";
  if (score >= 2 || total >= MANY_ADDITIVES) return "fair";
  return "good";
}

/** The reasons behind the additive part of the verdict, in plain words. */
export function additiveReasons(known: Additive[], unknownCount: number): string[] {
  const out: string[] = [];
  const by = (t: ReturnType<typeof tierOf>) => known.filter((a) => tierOf(a) === t).length;
  if (known.some((a) => tierOf(a) === "restricted")) out.push("Contains a high-risk additive, so the product can't rate better than poor.");
  const worst = known.filter((a) => tierOf(a) === "notable" || tierOf(a) === "restricted");
  if (worst.length) out.push(`Highest concern: ${worst.slice(0, 4).map(shownName).join(", ")}${worst.length > 4 ? ` and ${worst.length - 4} more` : ""}.`);
  const euNo = known.filter((a) => /^(Banned|Not authorised)/.test(a.jurisdiction?.eu ?? ""));
  if (euNo.length) out.push(`Not allowed in EU food: ${euNo.map(shownName).join(", ")}.`);
  const flagged = by("notable") + by("some");
  if (flagged > 0) out.push(`${flagged} of ${known.length} reviewed additive${known.length === 1 ? "" : "s"} carr${flagged === 1 ? "ies" : "y"} a concern, from limited to high.`);
  const total = known.length + unknownCount;
  if (total >= MANY_ADDITIVES) out.push(`${total} additives in one product. Their effects in combination haven't been studied.`);
  if (unknownCount > 0) out.push(`${unknownCount} additive${unknownCount === 1 ? " isn't" : "s aren't"} reviewed here yet, so they aren't counted.`);
  return out;
}

export function nutritionVerdict(p: Pick<Product, "nutrition" | "grade" | "isDrink">): Verdict | undefined {
  const rows = nutrientRows(p.nutrition, p.isDrink);
  if (!rows.length && !p.grade) return undefined;
  const highs = rows.filter((r) => r.level === "high").length;
  if (p.grade === "e" || highs >= 2) return "poor";
  if (p.grade === "d" || highs === 1) return "fair";
  return "good";
}

/**
 * Yuka's published table (help.yuka.io, "How is the Nutri-Score used to obtain the Yuka rating?"):
 * original Nutri-Score points to a 0 to 100 nutrition score, one column for solid foods and one for drinks.
 * Solids: 100 at -3 or less, down to 0 at 19 or more. Drinks: 80 below -3, then 77 at -3, down to 0 at 10 or more.
 */
const YUKA_SOLID = [100, 100, 90, 80, 75, 70, 65, 60, 55, 50, 45, 40, 35, 30, 15, 13, 11, 9, 7, 5, 3, 1, 0]; // points -3..19
const YUKA_DRINK = [77, 74, 71, 68, 65, 57, 49, 41, 33, 15, 11, 7, 3, 0]; // points -3..10; below -3 the table says 80
export function yukaNutrition(points: number, isDrink: boolean): number {
  const r = Math.round(points);
  if (isDrink && r < -3) return 80;
  const t = isDrink ? YUKA_DRINK : YUKA_SOLID;
  return t[Math.min(Math.max(0, r + 3), t.length - 1)];
}

/**
 * Our 0 to 100 score, using the weights Yuka publishes: nutrition 60%, additives 30%, organic 10% as a bonus,
 * and a cap of 49 when a high-risk additive is present. Yuka doesn't publish its additive sub-score, so that part is our
 * estimate (100 with none, then lower as the worst additive gets worse). It can differ from Yuka's number by a few points.
 */
export function additivePart(known: Additive[]): number {
  if (known.some((a) => tierOf(a) === "restricted")) return 0;
  const n = known.filter((a) => tierOf(a) !== "clear").length;
  if (known.some((a) => tierOf(a) === "notable")) return Math.max(10, 50 - 10 * (n - 1));
  if (n > 0) return Math.max(40, 85 - 5 * (n - 1));
  return 100;
}

export function yukaStyleScore(p: Pick<Product, "nutriPoints" | "isDrink" | "organic">, known: Additive[]): number | undefined {
  if (p.nutriPoints === undefined) return undefined;
  const nutrition = yukaNutrition(p.nutriPoints, p.isDrink);
  const base = p.organic ? 0.6 * nutrition + 0.3 * additivePart(known) + 10 : (0.6 * nutrition + 0.3 * additivePart(known)) / 0.9;
  let score = Math.round(base);
  if (known.some((a) => tierOf(a) === "restricted")) score = Math.min(score, 49);
  return Math.max(0, Math.min(100, score));
}

export interface Assessment {
  /** 0 to 100, when the database has the Nutri-Score points. */
  score?: number;
  /** Plain-language reasons for the verdict. */
  reasons: string[];
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
  const additives = additiveVerdict(known, known.length + unknownCount);
  const nutrition = nutritionVerdict(p);
  const reasons = additiveReasons(known, unknownCount);
  let overall = [additives, nutrition].filter((v): v is Verdict => !!v).sort((a, b) => ORDER[b] - ORDER[a])[0];
  // Ultra-processed foods are linked to many poorer health outcomes, so they never read as "few concerns".
  if (p.nova === 4) {
    reasons.push("Ultra-processed (NOVA group 4): diets high in these are linked to poorer health in large studies.");
    if (overall === "good") overall = "fair";
  }
  return { score: yukaStyleScore(p, known), reasons, additives, nutrition, overall, partial: unknownCount > 0, complete: unknownCount === 0 && nutrition !== undefined };
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
