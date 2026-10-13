import { describe, expect, it } from "vitest";
import { findAdditives, productFromIngredients } from "../rooted/ingredientParse";
import { allergenHits, allergenIds } from "../rooted/allergens";
import { parseProduct } from "../rooted/foodLookup";

describe("finding additives in an ingredient list", () => {
  it("reads E-numbers written the usual ways", () => {
    const { codes } = findAdditives("Water, E330, e 150d, E-211, E160a(ii), E 951");
    expect(codes.sort()).toEqual(["e150d", "e160a", "e211", "e330", "e951"]);
  });

  it("reads names, US spellings and other names labels use", () => {
    const { codes } = findAdditives("Carbonated water, sugar, Caramel Color IV, phosphoric acid, sodium benzoate (preservative), yellow 6, aspartame, MSG, FD&C Red No. 3");
    expect(codes).toEqual(expect.arrayContaining(["e150d", "e338", "e211", "e110", "e951", "e621", "e127"]));
  });

  it("uses a name up so shorter names inside it don't count twice", () => {
    expect(findAdditives("citric acid esters of mono- and diglycerides").codes).toEqual(["e472c"]);
    expect(findAdditives("Citric acid, mono and diglycerides").codes.sort()).toEqual(["e330", "e471"]);
  });

  it("doesn't mistake a vitamin E amount for an additive", () => {
    expect(findAdditives("Vitamin E 400 IU, vitamin E (tocopherol) 15 mg").codes).not.toContain("e400");
  });

  it("keeps E-numbers we haven't reviewed, so they show as not reviewed", () => {
    expect(findAdditives("E999, E330").codes.sort()).toEqual(["e330", "e999"]);
  });

  it("notes loose mentions it can't pin down, and not when the type is named", () => {
    expect(findAdditives("sugar, caramel colour, salt").notes).toEqual(["Caramel colour (type not stated)"]);
    expect(findAdditives("caramel colour (E150d)").notes).toEqual([]);
    expect(findAdditives("contains sulphites").notes).toEqual(["Sulfites (which one isn't stated)"]);
  });

  it("finds nothing in an ordinary list", () => {
    const r = findAdditives("Oats, water, salt, olive oil");
    expect(r.codes).toEqual([]);
    expect(r.notes).toEqual([]);
  });

  it("makes a product the result page can show", () => {
    const p = productFromIngredients("Water, sodium nitrite, E330");
    expect(p).toMatchObject({ code: "text", name: "Your ingredient list", additives: expect.arrayContaining(["e250", "e330"]), allergens: [], traces: [], isDrink: false });
  });
});

describe("allergens", () => {
  it("turns database tags into our ids and ignores others", () => {
    expect(allergenIds(["en:milk", "en:gluten", "en:something-else", 5])).toEqual(["milk", "gluten"]);
    expect(allergenIds(undefined)).toEqual([]);
  });

  it("reads allergens and traces from a product", () => {
    const p = parseProduct({ status: 1, product: { product_name: "Biscuit", allergens_tags: ["en:gluten", "en:milk"], traces_tags: ["en:nuts", "en:milk"] } }, "1")!;
    expect(p.allergens).toEqual(["gluten", "milk"]);
    expect(p.traces).toEqual(["nuts", "milk"]);
  });

  it("matches what a person watches, and separates 'contains' from 'may contain'", () => {
    const p = { allergens: ["milk", "soy"] as const, traces: ["nuts", "milk"] as const };
    const hit = allergenHits(["milk", "nuts", "eggs"], { allergens: [...p.allergens], traces: [...p.traces] });
    expect(hit).toEqual({ contains: ["milk"], traces: ["nuts"] });
    expect(allergenHits([], { allergens: ["milk"], traces: [] })).toEqual({ contains: [], traces: [] });
  });

  it("doesn't mistake ordinary words for additives", () => {
    expect(findAdditives("Omega-3 fatty acids, oxygen-free packaging, lactic acid bacteria, gold medal flour").codes).toEqual([]);
    expect(findAdditives("E570, E640").codes.sort()).toEqual(["e570", "e640"]);
  });

  it("finds flavourings and other ingredient-level concerns by name", () => {
    expect(findAdditives("Sugar, natural flavours, yeast extract, maltodextrin").codes.sort()).toEqual(["flavouring-natural", "maltodextrin", "yeast-extract"]);
    expect(findAdditives("Artificial flavouring, hydrolysed vegetable protein").codes.sort()).toEqual(["flavouring-artificial", "hydrolysed-protein"]);
  });
  it("only counts partially hydrogenated oil as trans fat, and notes plain 'hydrogenated'", () => {
    expect(findAdditives("Partially hydrogenated soybean oil").codes).toEqual(["hydrogenated-fat"]);
    const r = findAdditives("Fully hydrogenated palm oil");
    expect(r.codes).toEqual([]);
    expect(r.notes[0]).toMatch(/Hydrogenated fat/);
  });
});
