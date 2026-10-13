import { describe, expect, it } from "vitest";
// @ts-expect-error plain JS build script
import { convert, foodsOf, NUTRIENTS } from "../../scripts/build-food-data.mjs";

describe("food data builder", () => {
  it("keeps per-100 g values by FDC nutrient number and skips empty foods", () => {
    const f = convert({ description: "Spinach, raw", foodCategory: { description: "Vegetables" }, foodNutrients: [{ nutrient: { number: "208" }, amount: 23 }, { nutrient: { number: "304" }, amount: 79 }] });
    const keys = NUTRIENTS.map((n: string[]) => n[0]);
    expect(f.vals[keys.indexOf("kcal")]).toBe(23);
    expect(f.vals[keys.indexOf("mg")]).toBe(79);
    expect(f.vals[keys.indexOf("fe")]).toBeNull();
    expect(convert({ description: "Water", foodNutrients: [] })).toBeNull();
  });
  it("finds the foods array under any known key", () => {
    expect(foodsOf({ SRLegacyFoods: [1] })).toEqual([1]);
    expect(foodsOf({ FoundationFoods: [2] })).toEqual([2]);
    expect(foodsOf([3])).toEqual([3]);
  });
});
