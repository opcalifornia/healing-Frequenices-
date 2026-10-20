import { describe, expect, it } from "vitest";
import { CUISINES, WORLD_RECIPES, cuisineByIso } from "../rooted/worldRecipes";
import { RECIPES, RECIPE_TAGS, dishListItems, toListItem } from "../rooted/recipes";
import { PANTRY } from "../rooted/pantryContent";
import { AISLE_ORDER } from "../store/nourish";

const pantryIds = new Set(PANTRY.map((p) => p.id));

describe("world recipes", () => {
  it("has 12 cuisines with four dishes each, unique ids and one country each", () => {
    expect(CUISINES).toHaveLength(12);
    for (const c of CUISINES) expect(c.recipes, c.id).toHaveLength(4);
    const ids = [...RECIPES, ...WORLD_RECIPES].map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(CUISINES.map((c) => c.iso)).size).toBe(12);
    expect(cuisineByIso(484)?.name).toBe("Mexico");
  });
  it("keeps every dish within 45 minutes and 12 ingredients, and links only real pantry items", () => {
    for (const r of WORLD_RECIPES) {
      expect(r.minutes, r.id).toBeLessThanOrEqual(45);
      expect(r.ingredients.length, r.id).toBeLessThanOrEqual(12);
      expect(r.steps.length, r.id).toBeGreaterThan(0);
      for (const i of r.ingredients) if (i.pantryId) expect(pantryIds.has(i.pantryId), `${r.id}: ${i.pantryId}`).toBe(true);
    }
  });
  it("uses known tags, aisles and a plate split that adds up", () => {
    for (const r of WORLD_RECIPES) {
      for (const t of r.tags) expect(RECIPE_TAGS, `${r.id}: ${t}`).toContain(t);
      expect(Math.abs(r.plate.veg + r.plate.grain + r.plate.protein - 1), r.id).toBeLessThan(0.011);
      for (const i of r.ingredients) expect(AISLE_ORDER, `${r.id}: ${i.name}`).toContain(toListItem(i).aisle);
      if (r.tags.includes("vegan")) {
        expect(r.tags, r.id).toContain("vegetarian");
        expect(r.allergens.filter((a) => a === "fish" || a === "dairy"), r.id).toEqual([]);
      }
      expect(r.note, r.id).toMatch(/simplified|traditional/i);
    }
  });
  it("sources every claim over https, with honest evidence labels", () => {
    for (const c of CUISINES) {
      expect(c.sources.length, c.id).toBeGreaterThan(0);
      for (const s of c.sources) expect(s.url, c.id).toMatch(/^https:\/\//);
      for (const r of c.recipes) {
        expect(r.why.sources.length, r.id).toBeGreaterThan(0);
        for (const s of r.why.sources) expect(s.url ?? "", r.id).toMatch(/^https:\/\//);
      }
    }
  });
  it("never uses diet-culture, overclaiming or first-person language", () => {
    const banned = /calorie|weight loss|lose weight|detox|\bcures?\b|\bcured\b|guilt|skinny|burn fat|miracle|guarantee|toxic|poison|\bcalm\b|most popular/i;
    for (const c of CUISINES) {
      expect(JSON.stringify(c), c.id).not.toMatch(banned);
      expect(JSON.stringify(c), c.id).not.toMatch(/\b(I|I'm|I'll|my)\b/);
    }
  });
  it("warns about vitamin K when a dish uses greens the pantry flags for warfarin", () => {
    for (const r of WORLD_RECIPES) {
      const flagged = r.ingredients.some((i) => i.pantryId && PANTRY.find((p) => p.id === i.pantryId)?.cautions.some((c) => /warfarin/i.test(c)));
      if (flagged) expect(r.cautions.some((c) => /warfarin/i.test(c)), r.id).toBe(true);
    }
  });
  it("keeps a dish's ingredients together under its name on the shopping list", () => {
    const r = WORLD_RECIPES[0];
    const items = dishListItems(r);
    expect(items.every((i) => i.dish.id === r.id && i.id.startsWith(`${r.id}~`))).toBe(true);
    expect(new Set(items.map((i) => i.id)).size).toBe(items.length);
    expect(dishListItems(r, items.map((i) => i.id))).toEqual([]);
    const owned = dishListItems(r, [], [items[0].ing]);
    expect(owned[0].checked).toBe(true);
    expect(owned.slice(1).every((i) => !i.checked)).toBe(true);
  });
});
