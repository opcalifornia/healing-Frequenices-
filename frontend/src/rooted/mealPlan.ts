import { itemsToAdd, type Allergen, type Recipe } from "./recipes";
import { ALL_RECIPES } from "./allRecipes";
import type { GoalId } from "../store/wellness";
import { SLOTS, type DayPlan, type Slot } from "../store/mealPlan";

/** Date keys use local time, like the rest of Nourish. */
export const keyOf = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** The Monday of the week that contains `d`. */
export function weekStart(d: Date): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const back = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - back);
  return x;
}

export function weekDays(start: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
}

const BY_ID = new Map(ALL_RECIPES.map((r) => [r.id, r]));
export const recipeById = (id: string | undefined): Recipe | undefined => (id ? BY_ID.get(id) : undefined);

export interface Diet {
  vegetarian?: boolean;
  vegan?: boolean;
  avoid?: Allergen[];
}

/** Recipes that suit a diet filter and avoid the allergens someone ticked. */
export function suitable(diet: Diet, recipes: Recipe[] = ALL_RECIPES): Recipe[] {
  return recipes.filter((r) => {
    if (diet.vegan && !r.tags.includes("vegan")) return false;
    if (diet.vegetarian && !r.tags.includes("vegetarian") && !r.tags.includes("vegan")) return false;
    if (diet.avoid?.some((a) => r.allergens.includes(a))) return false;
    return true;
  });
}

/** Every recipe planned in these days, in order, with repeats kept (so a double batch counts twice). */
export function plannedRecipes(plan: Record<string, DayPlan>, days: string[]): Recipe[] {
  const out: Recipe[] = [];
  for (const d of days) for (const s of SLOTS) {
    const r = recipeById(plan[d]?.[s]?.recipeId);
    if (r) out.push(r);
  }
  return out;
}

/**
 * The shopping list for a week: each recipe's ingredients once, skipping what is already on the list.
 * A food that appears in several recipes is added a single time.
 */
export function shoppingFor(recipes: Recipe[], existingIds: Iterable<string>) {
  const seen = new Set(existingIds);
  const out: ReturnType<typeof itemsToAdd> = [];
  for (const r of recipes) {
    for (const item of itemsToAdd(r, seen)) {
      seen.add(item.id);
      out.push(item);
    }
  }
  return out;
}

/**
 * Recipes tagged for the goals someone chose. Only energy and sleep narrow the list: nearly every recipe suits "eat better",
 * so that goal alone doesn't filter anything.
 */
export function forGoals(recipes: Recipe[], goals: GoalId[]): Recipe[] {
  const want = goals.filter((g): g is "energy" | "sleep" => g === "energy" || g === "sleep");
  if (!want.length) return recipes;
  return recipes.filter((r) => want.some((g) => r.goals.includes(g)));
}

/** Which meals each recipe suits. A recipe with no entry suits lunch and dinner. */
const FITS: Record<string, Slot[]> = {
  "overnight-oats": ["breakfast"],
  "yogurt-parfait": ["breakfast"],
  "walnut-oatmeal": ["breakfast"],
  "kefir-berry-smoothie": ["breakfast"],
  "spinach-omelet": ["breakfast", "lunch"],
  "chickpea-avocado-toast": ["breakfast", "lunch"],
  "sardine-toast": ["lunch"],
  "mx-huevos-a-la-mexicana": ["breakfast", "lunch"],
  "jp-miso-shiru": ["breakfast", "lunch", "dinner"],
  "miso-salmon-broccoli": ["dinner"],
  "sheet-pan-salmon": ["dinner"],
  "ginger-turmeric-dal": ["dinner", "lunch"],
};
export const fitsSlot = (r: Recipe, slot: Slot) => (FITS[r.id] ?? ["lunch", "dinner"]).includes(slot);

/**
 * Fill the empty slots (lunch and dinner by default) with recipes that suit the meal, never overwriting what is there.
 * Recipes not yet used this week come first, then they cycle in a stable order from `offset`, so asking again gives a new mix.
 */
export function suggestFill(plan: Record<string, DayPlan>, days: string[], pool: Recipe[], offset = 0, slots: Slot[] = ["lunch", "dinner"], prefer?: Set<string>) {
  const used = new Set(plannedRecipes(plan, days).map((r) => r.id));
  const changes: Array<{ day: string; slot: Slot; entry: { recipeId: string } }> = [];
  const next: Record<string, number> = {};
  const orders: Record<string, Recipe[]> = {};
  for (const slot of slots) {
    const fit = pool.filter((r) => fitsSlot(r, slot));
    const first = prefer?.size ? [...fit.filter((r) => prefer.has(r.id)), ...fit.filter((r) => !prefer.has(r.id))] : fit;
    orders[slot] = [...first.filter((r) => !used.has(r.id)), ...first.filter((r) => used.has(r.id))];
    next[slot] = offset;
  }
  for (const day of days) {
    // Never the same recipe twice in one day.
    const today = new Set(SLOTS.map((s) => plan[day]?.[s]?.recipeId).filter((x): x is string => !!x));
    for (const slot of slots) {
      if (plan[day]?.[slot]) continue;
      const order = orders[slot];
      if (!order.length) continue;
      let pick = order[next[slot] % order.length];
      for (let tries = 0; tries < order.length && today.has(pick.id); tries++) {
        next[slot]++;
        pick = order[next[slot] % order.length];
      }
      next[slot]++;
      today.add(pick.id);
      changes.push({ day, slot, entry: { recipeId: pick.id } });
    }
  }
  return changes;
}

/** The average rough plate split across the week's planned recipes, or undefined when there are none. */
export function weekPlate(recipes: Recipe[]) {
  if (!recipes.length) return undefined;
  const sum = recipes.reduce((a, r) => ({ veg: a.veg + r.plate.veg, grain: a.grain + r.plate.grain, protein: a.protein + r.plate.protein }), { veg: 0, grain: 0, protein: 0 });
  const n = recipes.length;
  return { veg: sum.veg / n, grain: sum.grain / n, protein: sum.protein / n };
}
