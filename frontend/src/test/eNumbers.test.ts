import { describe, expect, it } from "vitest";
import { E_NUMBERS, eNumber } from "../rooted/eNumbers";
import { additiveById } from "../rooted/additivesContent";
import { parseProduct } from "../rooted/foodLookup";

describe("E-number dictionary", () => {
  it("has unique codes, names and purposes", () => {
    const seen = new Set<string>();
    for (const e of E_NUMBERS) {
      expect(e.code).toMatch(/^e\d{3,4}[a-z]?$/);
      expect(seen.has(e.code)).toBe(false);
      seen.add(e.code);
      expect(e.name.length).toBeGreaterThan(2);
      expect(e.does.length).toBeGreaterThan(2);
    }
  });
  it("looks codes up", () => {
    expect(eNumber("E120")?.name.toLowerCase()).toContain("carmine");
    expect(eNumber("e999999")).toBeUndefined();
  });
  it("gives close relatives their own entry", () => {
    expect(additiveById("e407a")?.id).toBe("e407a");
    expect(additiveById("e407")?.id).toBe("e407");
  });
});

describe("parseProduct reads the printed ingredients too", () => {
  it("adds additives the tags missed", () => {
    const p = parseProduct({ status: 1, product: { product_name: "X", additives_tags: ["en:e330"], ingredients_text: "Water, sugar, sodium benzoate, citric acid" } }, "5449000000996");
    expect(p?.additives).toEqual(expect.arrayContaining(["e330", "e211"]));
  });
});
