import { describe, expect, it } from "vitest";
import { RECIPES } from "../rooted/recipes";
import { keyOf, plannedRecipes, shoppingFor, suggestFill, suitable, weekDays, weekPlate, weekStart } from "../rooted/mealPlan";
import { planToText } from "../rooted/MealPlanner";
import type { DayPlan } from "../store/mealPlan";

describe("weeks", () => {
  it("starts on Monday and has seven days", () => {
    expect(keyOf(weekStart(new Date(2026, 9, 14)))).toBe("2026-10-12"); // a Wednesday
    expect(keyOf(weekStart(new Date(2026, 9, 18)))).toBe("2026-10-12"); // the Sunday belongs to that week
    expect(keyOf(weekStart(new Date(2026, 9, 12)))).toBe("2026-10-12");
    const days = weekDays(weekStart(new Date(2026, 9, 14))).map(keyOf);
    expect(days).toHaveLength(7);
    expect(days[6]).toBe("2026-10-18");
  });
  it("crosses month and year ends", () => {
    expect(weekDays(new Date(2026, 11, 28)).map(keyOf)[6]).toBe("2027-01-03");
  });
});

describe("diet filters", () => {
  it("keeps only vegan recipes when asked, and leaves out chosen allergens", () => {
    expect(suitable({ vegan: true }).every((r) => r.tags.includes("vegan"))).toBe(true);
    expect(suitable({ vegetarian: true }).every((r) => r.tags.includes("vegetarian") || r.tags.includes("vegan"))).toBe(true);
    expect(suitable({ avoid: ["fish"] }).every((r) => !r.allergens.includes("fish"))).toBe(true);
    expect(suitable({}).length).toBe(RECIPES.length);
  });
});

describe("filling the week", () => {
  const keys = weekDays(new Date(2026, 9, 12)).map(keyOf);
  it("fills lunches and dinners, never touches a planned slot, and varies the recipes", () => {
    const plan: Record<string, DayPlan> = { [keys[0]]: { dinner: { text: "Eating out" } } };
    const changes = suggestFill(plan, keys, RECIPES);
    expect(changes).toHaveLength(13); // 14 lunch and dinner slots minus the one already planned
    expect(changes.some((c) => c.day === keys[0] && c.slot === "dinner")).toBe(false);
    expect(changes.every((c) => c.slot !== "breakfast")).toBe(true);
    const lunches = changes.filter((c) => c.slot === "lunch").map((c) => c.entry.recipeId);
    expect(lunches).toHaveLength(7);
    expect(new Set(lunches).size).toBe(7); // seven different lunches from nine that fit
  });
  it("puts breakfast recipes at breakfast and keeps them out of dinner", () => {
    const dinners = suggestFill({}, keys, RECIPES, 0, ["dinner"]).map((c) => c.entry.recipeId);
    expect(dinners).not.toContain("overnight-oats");
    expect(dinners).not.toContain("yogurt-parfait");
    const breakfasts = suggestFill({}, keys, RECIPES, 0, ["breakfast"]).map((c) => c.entry.recipeId);
    expect(breakfasts).toHaveLength(7);
    expect(new Set(breakfasts)).toEqual(new Set(["overnight-oats", "yogurt-parfait"]));
    expect(suggestFill({}, keys, RECIPES.filter((r) => r.id !== "overnight-oats" && r.id !== "yogurt-parfait"), 0, ["breakfast"])).toEqual([]);
  });
  it("never repeats a recipe within one day", () => {
    const changes = suggestFill({}, keys, RECIPES);
    for (const k of keys) {
      const ids = changes.filter((c) => c.day === k).map((c) => c.entry.recipeId);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
  it("returns nothing for an empty pool", () => {
    expect(suggestFill({}, keys, [])).toEqual([]);
  });
  it("prefers recipes not already in the week", () => {
    const first = RECIPES[0].id;
    const plan: Record<string, DayPlan> = { [keys[0]]: { breakfast: { recipeId: first } } };
    expect(suggestFill(plan, keys, RECIPES)[0].entry.recipeId).not.toBe(first);
  });
});

describe("shopping for the week", () => {
  it("adds each ingredient once, even when recipes share it, and skips what is on the list", () => {
    const all = shoppingFor(RECIPES.slice(0, 4), []);
    const ids = all.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    const some = shoppingFor(RECIPES.slice(0, 4), ids.slice(0, 3));
    expect(some).toHaveLength(all.length - 3);
    expect(shoppingFor(RECIPES.slice(0, 4), ids)).toEqual([]);
  });
  it("counts a recipe planned twice only once for shopping but twice for the plate", () => {
    const keys = weekDays(new Date(2026, 9, 12)).map(keyOf);
    const r = RECIPES[0].id;
    const plan: Record<string, DayPlan> = { [keys[0]]: { lunch: { recipeId: r } }, [keys[1]]: { lunch: { recipeId: r } } };
    const planned = plannedRecipes(plan, keys);
    expect(planned).toHaveLength(2);
    expect(shoppingFor(planned, []).length).toBe(shoppingFor([planned[0]], []).length);
  });
});

describe("week summary", () => {
  it("averages the plate split to 100%", () => {
    const p = weekPlate(RECIPES.slice(0, 5))!;
    expect(p.veg + p.grain + p.protein).toBeCloseTo(1, 5);
    expect(weekPlate([])).toBeUndefined();
  });
  it("writes the plan as plain text", () => {
    const keys = weekDays(new Date(2026, 9, 12)).map(keyOf);
    const text = planToText(new Date(2026, 9, 12), { [keys[0]]: { dinner: { recipeId: RECIPES[0].id }, lunch: { text: "Leftovers" } } });
    expect(text).toContain("Meal plan, week of");
    expect(text).toContain(`Dinner: ${RECIPES[0].title}`);
    expect(text).toContain("Lunch: Leftovers");
    expect(text).toContain("Nothing planned");
  });
});
