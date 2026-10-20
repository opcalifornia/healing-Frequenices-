import { describe, expect, it } from "vitest";
import { productListItem } from "../rooted/scanList";
import { AISLE_ORDER, groupByAisle } from "../store/nourish";

describe("scan to shopping list", () => {
  it("builds a list item from a product, with the brand and size", () => {
    expect(productListItem({ code: "123", name: "Granola", brand: "Oat Co", quantity: "350 g" })).toEqual({ id: "scan-123", name: "Granola (Oat Co)", aisle: "Packaged foods", qty: "350 g" });
  });
  it("doesn't repeat a brand already in the name", () => {
    expect(productListItem({ code: "1", name: "Oat Co Granola", brand: "Oat Co" }).name).toBe("Oat Co Granola");
  });
  it("has its own aisle that sorts before Other", () => {
    expect(AISLE_ORDER.indexOf("Packaged foods")).toBeGreaterThan(-1);
    expect(AISLE_ORDER.indexOf("Packaged foods")).toBeLessThan(AISLE_ORDER.indexOf("Other"));
    const groups = groupByAisle([{ id: "a", name: "x", aisle: "Other", checked: false }, { id: "b", name: "y", aisle: "Packaged foods", checked: false }]);
    expect(groups.map((g) => g[0])).toEqual(["Packaged foods", "Other"]);
  });
});
