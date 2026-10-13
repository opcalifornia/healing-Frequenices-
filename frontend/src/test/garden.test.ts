import { describe, expect, it } from "vitest";
import { PLANTS, RECIPES, WHY_GARDEN, fits, nutrientsFor, plantingAdvice } from "../rooted/gardenContent";
import { pantryById } from "../rooted/pantryContent";
import { AISLE_ORDER } from "../store/nourish";
import { daysSince } from "../store/garden";

describe("garden", () => {
  it("links only to real pantry items and known aisles", () => {
    for (const p of PLANTS) if (p.pantryId) expect(pantryById(p.pantryId)).toBeTruthy();
    for (const r of RECIPES) for (const i of r.ingredients) {
      if (i.pantryId) expect(pantryById(i.pantryId)).toBeTruthy();
      if (i.aisle) expect(AISLE_ORDER).toContain(i.aisle);
      expect(r.safety.length).toBeGreaterThan(0);
    }
  });
  it("matches plants to space and light", () => {
    const basil = PLANTS.find((p) => p.id === "basil")!;
    expect(fits(basil, "windowsill", "full")).toBe(true);
    expect(fits(basil, "windowsill", "low")).toBe(false);
    expect(PLANTS.filter((p) => fits(p, "windowsill", "low")).length).toBeGreaterThan(1);
  });
  it("counts days since planting", () => {
    expect(daysSince("2026-03-01", new Date(2026, 2, 11, 15))).toBe(10);
  });

  it("grows food as well as herbs, with a kind and a season for every plant", () => {
    const kinds = new Set(PLANTS.map((p) => p.kind));
    for (const k of ["herb", "vegetable", "fruit", "flower"]) expect(kinds.has(k as never), k).toBe(true);
    expect(PLANTS.filter((p) => p.kind === "vegetable").length).toBeGreaterThanOrEqual(15);
    expect(new Set(PLANTS.map((p) => p.id)).size).toBe(PLANTS.length);
  });
  it("shows what a food gives you, from the nutrient guide", () => {
    const spinach = PLANTS.find((p) => p.id === "spinach")!;
    expect(nutrientsFor(spinach)).toEqual(expect.arrayContaining(["vit-k", "folate", "magnesium"]));
    expect(nutrientsFor(PLANTS.find((p) => p.id === "mint")!)).toEqual([]);
  });
  it("gives a rough planting window that follows the hemisphere and the season", () => {
    const lettuce = PLANTS.find((p) => p.id === "lettuce")!;
    const tomato = PLANTS.find((p) => p.id === "tomatoes")!;
    expect(plantingAdvice(lettuce, 3, 45).now).toBe(true); // April, northern
    expect(plantingAdvice(lettuce, 6, 45).now).toBe(false); // July, northern
    expect(plantingAdvice(lettuce, 9, -35).now).toBe(true); // October is spring in the south
    expect(plantingAdvice(tomato, 5, 45).now).toBe(true);
    expect(plantingAdvice(tomato, 1, 45).now).toBe(false);
    expect(plantingAdvice(tomato, 5, 45).text).toMatch(/frost/i);
    expect(plantingAdvice(lettuce, 3, 5).text).toMatch(/tropics/i);
  });
  it("says how solid the research on gardening is, with sources for each claim", () => {
    for (const w of WHY_GARDEN) {
      expect(["Strong", "Moderate", "Mixed", "Weak", "None"]).toContain(w.rating);
      if (w.source) expect(w.source.url).toMatch(/^https:\/\//);
      else expect(w.link, w.id).toBeTruthy();
    }
  });
});
