/**
 * The food database: USDA FoodData Central (public domain, CC0 1.0), per 100 g.
 * Loaded on demand because it is large. Built by scripts/build-food-data.mjs.
 */
export interface FoodData {
  v: number;
  source: string;
  nutrients: Array<{ key: string; label: string; unit: string }>;
  cats: string[];
  foods: Array<[string, number, number, ...Array<number | null>]>;
}

export interface Food {
  name: string;
  cat: string;
  /** True for Foundation Foods, the newer and more carefully measured set. */
  foundation: boolean;
  /** Per 100 g, by nutrient key. Missing = not measured. */
  n: Record<string, number | undefined>;
}

/** FDA Daily Values for adults, used on food labels (21 CFR 101.9). Reference points, not personal targets. */
export const DAILY_VALUE: Record<string, number> = {
  protein: 50, fat: 78, sat: 20, fiber: 28, chol: 300,
  a: 900, c: 90, d: 20, e: 15, k: 120, b1: 1.2, b2: 1.3, b3: 16, b5: 5, b6: 1.7, folate: 400, b12: 2.4, choline: 550,
  ca: 1300, mg: 420, k_: 4700, p: 1250, na: 2300, fe: 18, zn: 11, cu: 0.9, mn: 2.3, se: 55,
};

/** Which entry of the nutrient guide each database nutrient belongs to. */
export const GUIDE_ID: Record<string, string> = {
  a: "vit-a", c: "vit-c", d: "vit-d", e: "vit-e", k: "vit-k", k2: "vit-k", b1: "b1", b2: "b2", b3: "b3", b5: "b5", b6: "b6", folate: "folate", b12: "b12", choline: "choline",
  ca: "calcium", mg: "magnesium", k_: "potassium", p: "phosphorus", fe: "iron", zn: "zinc", cu: "copper", mn: "manganese", se: "selenium",
};

let cache: Promise<{ data: FoodData; foods: Food[] } | null> | null = null;

export function toFoods(data: FoodData): Food[] {
  const keys = data.nutrients.map((n) => n.key);
  return data.foods.map((r) => {
    const n: Food["n"] = {};
    keys.forEach((k, i) => { const v = r[3 + i]; if (typeof v === "number") n[k] = v; });
    return { name: r[0], cat: data.cats[r[1]] ?? "", foundation: r[2] === 1, n };
  });
}

export function loadFoods() {
  cache ??= import("../data/foods.json")
    .then((m) => { const data = m.default as unknown as FoodData; return data?.foods?.length ? { data, foods: toFoods(data) } : null; })
    .catch(() => null);
  return cache;
}

const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();

/** Words in any order; names that start with the first word and are shorter come first. */
export function searchFoods(foods: Food[], query: string, limit = 40): Food[] {
  const words = clean(query).split(" ").filter(Boolean);
  if (!words.length) return [];
  const scored: Array<[number, Food]> = [];
  for (const f of foods) {
    const name = clean(f.name);
    if (!words.every((w) => name.includes(w))) continue;
    const padded = ` ${name} `;
    const whole = words.every((w) => padded.includes(` ${w} `) || padded.includes(` ${w}s `)) ? 0 : 1;
    const first = whole * 3 + (name.startsWith(words[0]) ? 0 : name.includes(` ${words[0]}`) ? 1 : 2);
    scored.push([first * 1000 + (f.foundation ? 0 : 50) + name.length, f]);
  }
  return scored.sort((a, b) => a[0] - b[0]).slice(0, limit).map(([, f]) => f);
}

/**
 * Foods people actually eat in meaningful amounts. Rankings per 100 g are otherwise topped by
 * powders, freeze-dried herbs, bran and animal-feed oilseeds, which tell you nothing useful.
 */
export function isEverydayFood(f: Food): boolean {
  if (/^(Spices and Herbs|Baby Foods|Fast Foods|Restaurant Foods|Meals, Entrees, and Side Dishes|Beverages)$/.test(f.cat)) return false;
  if (/freeze-dried|powder|flour|\bmeal\b|\bbran\b|defatted|concentrate|isolate|extract|cottonseed|\bagar\b|tsunomata|ready-to-eat|formula|dehydrated|supplement/i.test(f.name)) return false;
  if (/\b(dried|dry)\b/i.test(f.name) && !/^(Nut and Seed Products|Legumes and Legume Products)$/.test(f.cat)) return false;
  return true;
}

/** Foods richest in one nutrient, per 100 g, among everyday foods. */
export function richestIn(foods: Food[], key: string, opts: { group?: string; limit?: number } = {}): Food[] {
  return foods
    .filter((f) => typeof f.n[key] === "number" && f.n[key]! > 0 && isEverydayFood(f) && (!opts.group || f.cat === opts.group))
    .sort((a, b) => (b.n[key] as number) - (a.n[key] as number))
    .slice(0, opts.limit ?? 15);
}

export const percentDV = (key: string, v: number | undefined) => (v === undefined || !DAILY_VALUE[key] ? undefined : Math.round((v / DAILY_VALUE[key]) * 100));
