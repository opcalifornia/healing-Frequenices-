import { describe, expect, it } from "vitest";
import { RECIPES, RECIPE_TAGS, hasVitaminKFlag, itemsToAdd, toListItem } from "../rooted/recipes";
import { PANTRY } from "../rooted/pantryContent";
import { AISLE_ORDER } from "../store/nourish";

const pantryIds = new Set(PANTRY.map((p) => p.id));

describe("recipes", () => {
  it("has 12 recipes with unique ids", () => {
    expect(RECIPES.length).toBe(12);
    expect(new Set(RECIPES.map((r) => r.id)).size).toBe(RECIPES.length);
  });

  it("only links to pantry items that exist", () => {
    for (const r of RECIPES) for (const i of r.ingredients) if (i.pantryId) expect(pantryIds.has(i.pantryId), `${r.id}: ${i.pantryId}`).toBe(true);
  });

  it("keeps every recipe simple: 30 minutes or less, 10 ingredients or fewer", () => {
    for (const r of RECIPES) {
      expect(r.minutes, r.id).toBeLessThanOrEqual(30);
      expect(r.ingredients.length, r.id).toBeLessThanOrEqual(10);
      expect(r.steps.length, r.id).toBeGreaterThan(0);
    }
  });

  it("uses only known tags and aisles, and a plate split that adds up", () => {
    for (const r of RECIPES) {
      for (const t of r.tags) expect(RECIPE_TAGS).toContain(t);
      const sum = r.plate.veg + r.plate.grain + r.plate.protein;
      expect(Math.abs(sum - 1), r.id).toBeLessThan(0.01);
      for (const i of r.ingredients) expect(AISLE_ORDER, `${r.id}: ${i.name}`).toContain(toListItem(i).aisle);
      if (r.tags.includes("vegan")) expect(r.tags, r.id).toContain("vegetarian");
      if (r.tags.includes("vegan")) expect(r.allergens.filter((a) => a === "fish" || a === "dairy"), r.id).toEqual([]);
    }
  });

  it("never uses diet-culture or overclaiming language", () => {
    const banned = /calorie|weight loss|lose weight|detox|\bcures?\b|guilt|skinny|burn fat/i;
    for (const r of RECIPES) expect(JSON.stringify(r), r.id).not.toMatch(banned);
  });

  it("flags vitamin K when a recipe uses greens the pantry flags for warfarin", () => {
    for (const r of RECIPES) if (hasVitaminKFlag(r)) expect(r.cautions.some((c) => /warfarin/i.test(c)), r.id).toBe(true);
  });

  it("adds pantry aisles and skips items already on the list", () => {
    const dal = RECIPES.find((r) => r.id === "ginger-turmeric-dal")!;
    const all = itemsToAdd(dal, []);
    expect(all.find((i) => i.id === "turmeric")?.aisle).toBe("Herbs & spices");
    expect(all.find((i) => i.id === "ginger")?.aisle).toBe("Produce");
    const some = itemsToAdd(dal, ["turmeric", "lentils"]);
    expect(some.length).toBe(all.length - 2);
    expect(new Set(all.map((i) => i.id)).size).toBe(all.length);
  });
});
