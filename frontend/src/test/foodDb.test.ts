import { describe, expect, it } from "vitest";
import { percentDV, richestIn, searchFoods, toFoods, type FoodData } from "../rooted/foodDb";

const data: FoodData = {
  v: 1, source: "test",
  nutrients: [{ key: "kcal", label: "Energy", unit: "kcal" }, { key: "mg", label: "Magnesium", unit: "mg" }],
  cats: ["Vegetables and Vegetable Products", "Nut and Seed Products", "Spices and Herbs"],
  foods: [["Spinach, raw", 0, 1, 23, 79], ["Pumpkin seeds, roasted", 1, 0, 559, 592], ["Spinach, cooked", 0, 0, 23, 87], ["Basil, dried", 2, 0, 233, 711], ["Rice bran, crude", 0, 0, 316, 781], ["Mystery", 0, 0, 10, null]],
};
const foods = toFoods(data);

describe("food database helpers", () => {
  it("turns rows into foods with named nutrients", () => {
    expect(foods[0]).toMatchObject({ name: "Spinach, raw", foundation: true, n: { kcal: 23, mg: 79 } });
    expect(foods.find((f) => f.name === "Mystery")?.n.mg).toBeUndefined();
  });
  it("searches in any word order and puts better matches first", () => {
    expect(searchFoods(foods, "raw spinach")[0].name).toBe("Spinach, raw");
    expect(searchFoods(foods, "spinach").map((f) => f.name)).toEqual(["Spinach, raw", "Spinach, cooked"]);
    expect(searchFoods(foods, "zzz")).toEqual([]);
  });
  it("ranks the richest foods and skips ones without a value", () => {
    expect(richestIn(foods, "mg").map((f) => f.name)).toEqual(["Pumpkin seeds, roasted", "Spinach, cooked", "Spinach, raw"]);
  });
  it("works out percent of the Daily Value", () => {
    expect(percentDV("mg", 210)).toBe(50);
    expect(percentDV("kcal", 100)).toBeUndefined();
  });
});
