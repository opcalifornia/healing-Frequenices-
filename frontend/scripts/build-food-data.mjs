/**
 * Build src/data/foods.json from USDA FoodData Central downloads (public domain, CC0 1.0).
 *
 *   node scripts/build-food-data.mjs <dir with the unzipped .json files> [out.json]
 *
 * Reads SR Legacy (the broad list of common foods) and Foundation Foods (fewer foods, newer and
 * more carefully measured). Keeps per-100 g values for the nutrients the app teaches about.
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

/** key, label, unit, FDC nutrient numbers that mean it (first match wins). */
export const NUTRIENTS = [
  ["kcal", "Energy", "kcal", ["208", "957", "958"]],
  ["protein", "Protein", "g", ["203"]],
  ["fat", "Fat", "g", ["204"]],
  ["sat", "Saturated fat", "g", ["606"]],
  ["carbs", "Carbohydrate", "g", ["205"]],
  ["fiber", "Fibre", "g", ["291"]],
  ["sugars", "Sugars", "g", ["269", "269.3"]],
  ["chol", "Cholesterol", "mg", ["601"]],
  ["a", "Vitamin A", "µg RAE", ["320"]],
  ["c", "Vitamin C", "mg", ["401"]],
  ["d", "Vitamin D", "µg", ["328"]],
  ["e", "Vitamin E", "mg", ["323"]],
  ["k", "Vitamin K", "µg", ["430"]],
  ["k2", "Vitamin K2 (MK-4)", "µg", ["428"]],
  ["b1", "Thiamin", "mg", ["404"]],
  ["b2", "Riboflavin", "mg", ["405"]],
  ["b3", "Niacin", "mg", ["406"]],
  ["b5", "Pantothenic acid", "mg", ["410"]],
  ["b6", "Vitamin B6", "mg", ["415"]],
  ["folate", "Folate", "µg", ["417"]],
  ["b12", "Vitamin B12", "µg", ["418"]],
  ["choline", "Choline", "mg", ["421"]],
  ["ca", "Calcium", "mg", ["301"]],
  ["mg", "Magnesium", "mg", ["304"]],
  ["k_", "Potassium", "mg", ["306"]],
  ["p", "Phosphorus", "mg", ["305"]],
  ["na", "Sodium", "mg", ["307"]],
  ["fe", "Iron", "mg", ["303"]],
  ["zn", "Zinc", "mg", ["309"]],
  ["cu", "Copper", "mg", ["312"]],
  ["mn", "Manganese", "mg", ["315"]],
  ["se", "Selenium", "µg", ["317"]],
];

const NUM_TO_INDEX = new Map();
NUTRIENTS.forEach(([, , , nums], i) => nums.forEach((n) => { if (!NUM_TO_INDEX.has(n)) NUM_TO_INDEX.set(n, i); }));

const round = (v) => (v >= 100 ? Math.round(v) : v >= 10 ? Math.round(v * 10) / 10 : Math.round(v * 100) / 100);

/** Pull the foods array out of an FDC file, whatever its top-level key. */
export function foodsOf(json) {
  if (Array.isArray(json)) return json;
  for (const k of ["SRLegacyFoods", "FoundationFoods", "SurveyFoods", "foods"]) if (Array.isArray(json?.[k])) return json[k];
  return [];
}

export function convert(food) {
  const name = String(food?.description ?? "").trim();
  if (!name) return null;
  const vals = new Array(NUTRIENTS.length).fill(null);
  const rank = new Array(NUTRIENTS.length).fill(99);
  for (const fn of food.foodNutrients ?? []) {
    const num = String(fn?.nutrient?.number ?? fn?.nutrientNumber ?? "");
    const i = NUM_TO_INDEX.get(num);
    const amount = typeof fn?.amount === "number" ? fn.amount : typeof fn?.value === "number" ? fn.value : NaN;
    if (i === undefined || !Number.isFinite(amount) || amount < 0) continue;
    const r = NUTRIENTS[i][3].indexOf(num);
    if (r < rank[i]) { vals[i] = round(amount); rank[i] = r; }
  }
  // A food with no energy and no protein, fat or carbohydrate has nothing useful to show.
  if (vals[0] === null && vals[1] === null && vals[2] === null && vals[4] === null) return null;
  const cat = String(food?.foodCategory?.description ?? food?.foodCategory ?? food?.wweiaFoodCategory?.wweiaFoodCategoryDescription ?? "").trim();
  return { name, cat, vals };
}

export function build(dir) {
  const files = readdirSync(dir).filter((f) => f.endsWith(".json")).sort();
  const sets = { foundation: [], sr: [] };
  for (const f of files) {
    const foods = foodsOf(JSON.parse(readFileSync(join(dir, f), "utf8"))).map(convert).filter(Boolean);
    (/foundation/i.test(f) ? sets.foundation : sets.sr).push(...foods);
  }
  const seen = new Set();
  const cats = [];
  const rows = [];
  const add = (list, src) => {
    for (const food of list) {
      const key = food.name.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      let c = cats.indexOf(food.cat);
      if (c < 0) { cats.push(food.cat); c = cats.length - 1; }
      rows.push([food.name, c, src, ...food.vals]);
    }
  };
  add(sets.foundation, 1); // newer, more carefully measured
  add(sets.sr, 0);
  return {
    v: 1,
    source: "USDA FoodData Central: Foundation Foods and SR Legacy. Public domain (CC0 1.0). Values per 100 g.",
    nutrients: NUTRIENTS.map(([key, label, unit]) => ({ key, label, unit })),
    cats,
    // row = [name, category index, 1 for Foundation Foods or 0 for SR Legacy, ...one value per nutrient (null = not measured)]
    foods: rows,
  };
}

if (process.argv[1] && process.argv[1].endsWith("build-food-data.mjs")) {
  const [dir, out = "src/data/foods.json"] = process.argv.slice(2);
  if (!dir) { console.error("usage: node scripts/build-food-data.mjs <dir> [out.json]"); process.exit(1); }
  const data = build(dir);
  if (data.foods.length < 500) { console.error(`Only ${data.foods.length} foods found: refusing to write.`); process.exit(2); }
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(data));
  const withMg = data.foods.filter((r) => r[3 + 23] !== null).length;
  console.log(`${data.foods.length} foods, ${data.cats.length} categories, ${withMg} with magnesium -> ${out}`);
}
