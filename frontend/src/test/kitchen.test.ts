import { describe, expect, it } from "vitest";
import { RECIPES, toListItem } from "../rooted/recipes";
import { kitchenItems, nearlyReady, plainName, statusFor, whatICanCook } from "../rooted/kitchen";
import { shoppingFor } from "../rooted/mealPlan";

describe("kitchen", () => {
  it("shortens ingredient names", () => {
    expect(plainName("Spinach (fresh), washed")).toBe("Spinach");
    expect(plainName("Chickpeas, rinsed (canned is fine)")).toBe("Chickpeas");
    expect(plainName("Milk or unsweetened soy milk (or water)")).toBe("Milk or unsweetened soy milk");
  });
  it("lists each ingredient once, with an aisle", () => {
    const items = kitchenItems();
    expect(new Set(items.map((i) => i.id)).size).toBe(items.length);
    expect(items.length).toBeGreaterThan(40);
    expect(items.every((i) => i.name && i.aisle)).toBe(true);
  });
  it("counts what you have and what is missing for a recipe", () => {
    const r = RECIPES[0];
    const ids = r.ingredients.map((i) => toListItem(i).id);
    expect(statusFor(r, []).missing).toHaveLength(new Set(ids).size);
    const s = statusFor(r, ids.slice(0, 2));
    expect(s.have).toBe(2);
    expect(s.have + s.missing.length).toBe(s.total);
    expect(statusFor(r, ids).missing).toEqual([]);
  });
  it("puts the closest recipe first and finds the ready ones", () => {
    const r = RECIPES[3];
    const ids = r.ingredients.map((i) => toListItem(i).id);
    const ranked = whatICanCook(ids);
    expect(ranked[0].missing).toEqual([]);
    expect(ranked.find((x) => x.recipe.id === r.id)?.missing).toEqual([]);
    expect(nearlyReady(ids, 0).map((s) => s.recipe.id)).toContain(r.id);
    expect(nearlyReady([], 0)).toEqual([]);
  });
  it("leaves what you already have out of the week's shopping", () => {
    const r = RECIPES[0];
    const ids = r.ingredients.map((i) => toListItem(i).id);
    expect(shoppingFor([r], ids)).toEqual([]);
    expect(shoppingFor([r], ids.slice(1)).length).toBeLessThanOrEqual(1);
  });
});
