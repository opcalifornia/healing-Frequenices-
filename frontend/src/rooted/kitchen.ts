import { toListItem, type Recipe } from "./recipes";
import { ALL_RECIPES } from "./allRecipes";

export interface KitchenItem {
  id: string;
  name: string;
  aisle: string;
}

/** A short, plain name for an ingredient: "Spinach", not "Spinach (fresh), washed". */
export const plainName = (name: string) => name.replace(/\(.*?\)/g, "").split(",")[0].replace(/\s+/g, " ").trim();

/** Every ingredient the recipes use, once each, so someone can tick what they have at home. */
export function kitchenItems(recipes: Recipe[] = ALL_RECIPES): KitchenItem[] {
  const seen = new Map<string, KitchenItem>();
  for (const r of recipes) for (const i of r.ingredients) {
    const li = toListItem(i);
    if (!seen.has(li.id)) seen.set(li.id, { id: li.id, name: plainName(i.pantryId ? li.name : i.name), aisle: li.aisle });
  }
  return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export interface RecipeStatus {
  recipe: Recipe;
  total: number;
  have: number;
  missing: ReturnType<typeof toListItem>[];
}

export function statusFor(r: Recipe, have: Iterable<string>): RecipeStatus {
  const owned = new Set(have);
  const seen = new Set<string>();
  const items = r.ingredients.map(toListItem).filter((i) => (seen.has(i.id) ? false : (seen.add(i.id), true)));
  const missing = items.filter((i) => !owned.has(i.id));
  return { recipe: r, total: items.length, have: items.length - missing.length, missing };
}

/** Recipes ordered by how close they are to cookable: fewest missing first, then the quicker one. */
export function whatICanCook(have: Iterable<string>, recipes: Recipe[] = ALL_RECIPES): RecipeStatus[] {
  const owned = new Set(have);
  return recipes.map((r) => statusFor(r, owned)).sort((a, b) => a.missing.length - b.missing.length || a.recipe.minutes - b.recipe.minutes || a.recipe.title.localeCompare(b.recipe.title));
}

/** Recipes you could cook now, or with at most `allow` missing items. */
export const nearlyReady = (have: Iterable<string>, allow = 1, recipes: Recipe[] = ALL_RECIPES) => whatICanCook(have, recipes).filter((s) => s.missing.length <= allow);
