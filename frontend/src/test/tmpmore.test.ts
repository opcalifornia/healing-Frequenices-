import { it, expect } from "vitest";
import { MORE_A } from "../rooted/more/a";
import { PANTRY } from "../rooted/pantryContent";
import { WORLD_RECIPES } from "../rooted/worldRecipes";
import { AISLE_ORDER } from "../store/nourish";
import { toListItem } from "../rooted/recipes";
it("ok", () => {
  expect(MORE_A).toHaveLength(15);
  const ids = new Set(WORLD_RECIPES.map(r=>r.id)); const titles = new Set(WORLD_RECIPES.map(r=>r.title));
  const ids2 = MORE_A.map(r=>r.id); expect(new Set(ids2).size).toBe(15);
  for (const r of MORE_A) {
    expect(ids.has(r.id)).toBe(false); expect(titles.has(r.title)).toBe(false);
    expect(r.minutes).toBeLessThanOrEqual(45); expect(r.ingredients.length, r.id).toBeLessThanOrEqual(12);
    expect(Math.abs(r.plate.veg+r.plate.grain+r.plate.protein-1), r.id).toBeLessThan(0.011);
    for (const i of r.ingredients) { if (i.pantryId) expect(PANTRY.some(p=>p.id===i.pantryId), r.id+i.pantryId).toBe(true); expect(AISLE_ORDER, r.id+i.name).toContain(toListItem(i).aisle); 
      if (i.pantryId && PANTRY.find(p=>p.id===i.pantryId)?.cautions.some(c=>/warfarin/i.test(c))) expect(r.cautions.some(c=>/warfarin/i.test(c)), r.id).toBe(true); }
    if (r.tags.includes("vegan")) { expect(r.tags).toContain("vegetarian"); expect(r.allergens.filter(a=>a==="fish"||a==="dairy")).toEqual([]); }
    expect(r.note).toMatch(/simplified|traditional/i);
    expect(JSON.stringify(r)).not.toMatch(/calorie|weight loss|lose weight|detox|\bcures?\b|guilt|skinny|burn fat|miracle|guarantee|toxic|poison|\bcalm\b|most popular|\b(I|my)\b/i);
  }
});
