import { describe, expect, it } from "vitest";
import { PLANTS, RECIPES, fits } from "../rooted/gardenContent";
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
});
