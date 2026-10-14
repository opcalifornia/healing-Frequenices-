import { describe, expect, it } from "vitest";
import { additiveById } from "../rooted/additivesContent";
import { parseProduct } from "../rooted/foodLookup";
import { additiveVerdict, assess, isBetterChoice, level, nutrientRows, nutritionReason, nutritionVerdict, overallLabel } from "../rooted/productVerdict";

const A = (...ids: string[]) => ids.map((i) => additiveById(i)!);

describe("additive verdict", () => {
  it("is good with nothing or only low-concern additives", () => {
    expect(additiveVerdict([])).toBe("good");
    expect(additiveVerdict(A("e330", "e300"))).toBe("good");
  });
  it("scores additives by strength: minor ones add up, real concerns count more", () => {
    expect(additiveVerdict(A("e330", "e200"))).toBe("good"); // one minor concern
    expect(additiveVerdict(A("e200", "e202"))).toBe("fair"); // two minor concerns
    expect(additiveVerdict(A("e330", "e211"))).toBe("fair"); // one real concern
    expect(additiveVerdict(A("e211", "e338"))).toBe("fair");
    expect(additiveVerdict(A("e211", "e338", "e220"))).toBe("poor"); // score 6
    expect(additiveVerdict(A("e341", "e450", "e471"))).toBe("poor");
    expect(additiveVerdict(A("e220", "e120"))).toBe("poor"); // two notable concerns
    expect(additiveVerdict(A("e171"))).toBe("poor"); // restricted
    expect(additiveVerdict(A("e129"))).toBe("poor"); // Red 40 is high risk, which caps the product
  });
  it("is never 'good' for a long list of additives, even when each looks gentle", () => {
    const gentle = A("e330", "e300", "e322", "e440", "e412", "e270", "e101", "e414");
    expect(additiveVerdict(gentle)).toBe("fair");
    expect(additiveVerdict(gentle.slice(0, 7))).toBe("good");
  });
});

describe("nutrition levels", () => {
  it("uses the UK traffic-light cut-offs, with their own for drinks", () => {
    expect(level("sugars", 5, false)).toBe("low");
    expect(level("sugars", 5.1, false)).toBe("medium");
    expect(level("sugars", 22.5, false)).toBe("medium");
    expect(level("sugars", 22.6, false)).toBe("high");
    expect(level("sugars", 11.3, true)).toBe("high");
    expect(level("sugars", 11.3, false)).toBe("medium");
    expect(level("salt", 1.6, false)).toBe("high");
    expect(level("sat", 1.5, false)).toBe("low");
  });

  it("sorts rows high first and flags a source of fibre", () => {
    const rows = nutrientRows({ sugars: 30, sat: 1, salt: 0.5, fat: 10, fiber: 4 }, false);
    expect(rows.map((r) => `${r.id}:${r.level}`)).toEqual(["sugars:high", "salt:medium", "fat:medium", "sat:low", "fiber:low"]);
    expect(nutrientRows({ fiber: 2 }, false)).toEqual([]);
    expect(nutrientRows(undefined, false)).toEqual([]);
  });

  it("combines the letter grade and the high levels", () => {
    expect(nutritionVerdict({ nutrition: { sugars: 1, sat: 0.5, salt: 0.1, fat: 1 }, grade: "a", isDrink: false })).toBe("good");
    expect(nutritionVerdict({ nutrition: { sugars: 30 }, grade: "c", isDrink: false })).toBe("fair");
    expect(nutritionVerdict({ nutrition: { sugars: 30, sat: 9 }, isDrink: false })).toBe("poor");
    expect(nutritionVerdict({ grade: "e", isDrink: false })).toBe("poor");
    expect(nutritionVerdict({ grade: "d", isDrink: false })).toBe("fair");
    expect(nutritionVerdict({ isDrink: false })).toBeUndefined();
  });
});

describe("overall assessment", () => {
  const mk = (extra: object) => parseProduct({ status: 1, product: { product_name: "X", ...extra } }, "1")!;

  it("is only as good as the weakest part", () => {
    const p = mk({ nutriscore_grade: "a", nutriments: { "sugars_100g": 1 } });
    expect(assess(p, A("e330"), 0).overall).toBe("good");
    expect(assess(p, A("e171"), 0).overall).toBe("poor");
    const sweet = mk({ nutriments: { "sugars_100g": 30, "saturated-fat_100g": 9 } });
    expect(assess(sweet, [], 0).overall).toBe("poor");
  });

  it("falls back to additives alone when there is no nutrition data, and notes unknown additives", () => {
    const p = mk({});
    const a = assess(p, A("e211"), 2);
    expect(a.nutrition).toBeUndefined();
    expect(a.overall).toBe("fair");
    expect(a.partial).toBe(true);
  });
});

describe("product parsing of nutrition", () => {
  it("reads per-100 values, converts kJ and sodium, and spots drinks and the category", () => {
    const p = parseProduct(
      {
        status: 1,
        product: {
          product_name: "Cola",
          categories_tags: ["en:beverages", "en:carbonated-drinks", "en:sodas"],
          nutrition_grades: "e",
          nova_group: 4,
          nutriments: { "energy_100g": 180, "sugars_100g": "10.6", "sodium_100g": 0.01, "fiber_100g": "bad" },
        },
      },
      "1",
    )!;
    expect(p.isDrink).toBe(true);
    expect(p.category).toBe("en:sodas");
    expect(p.grade).toBe("e");
    expect(p.nova).toBe(4);
    expect(p.nutrition).toEqual({ kcal: 43, fat: undefined, sat: undefined, sugars: 10.6, salt: 0.03, fiber: undefined });
  });
});

describe("better choices", () => {
  const mk = (extra: object) => parseProduct({ status: 1, product: { product_name: "X", ...extra } }, "1")!;
  it("only suggests products whose verdict is strictly better", () => {
    const poor = assess(mk({ nutrition_grades: "e" }), A("e171"), 0);
    const fair = assess(mk({ nutrition_grades: "c" }), A("e211"), 0);
    const good = assess(mk({ nutrition_grades: "a" }), A("e330"), 0);
    expect(isBetterChoice(good, poor)).toBe(true);
    expect(isBetterChoice(fair, poor)).toBe(true);
    expect(isBetterChoice(poor, poor)).toBe(false);
    expect(isBetterChoice(poor, good)).toBe(false);
    expect(isBetterChoice(good, good)).toBe(false);
  });
  it("explains a nutrition verdict in a sentence", () => {
    expect(nutritionReason({ grade: "e", nutrition: { sugars: 30 }, isDrink: false })).toBe("Rated several concerns because its Nutri-Score is E and it is high in sugars.");
    expect(nutritionReason({ grade: "a", isDrink: false })).toBeUndefined();
  });
});

describe("so-far wording", () => {
  const mk = (extra: object) => parseProduct({ status: 1, product: { product_name: "X", ...extra } }, "1")!;
  it("only says a flat 'few concerns' when everything was checked", () => {
    const full = assess(mk({ nutrition_grades: "a" }), A("e330"), 0);
    expect(full.complete).toBe(true);
    expect(overallLabel(full)).toBe("Few concerns");
    const unknownAdditive = assess(mk({ nutrition_grades: "a" }), A("e330"), 2);
    expect(overallLabel(unknownAdditive)).toBe("Few concerns so far");
    const noNutrition = assess(mk({}), A("e330"), 0);
    expect(overallLabel(noNutrition)).toBe("Few concerns so far");
  });
  it("never softens a worse verdict", () => {
    const poor = assess(mk({}), A("e171"), 3);
    expect(overallLabel(poor)).toBe("Several concerns");
    const fair = assess(mk({}), A("e211"), 1);
    expect(overallLabel(fair)).toBe("Some concerns");
  });
});

describe("reasons and ultra-processing", () => {
  const mk = (extra: object) => parseProduct({ status: 1, product: { product_name: "X", ...extra } }, "1")!;
  it("explains the additive verdict", () => {
    const r = assess(mk({ nutrition_grades: "a" }), A("e341", "e450", "e471", "e330"), 1).reasons;
    expect(r.join(" ")).toMatch(/3 of 4 reviewed additives/);
    expect(r.join(" ")).toMatch(/isn't reviewed here yet/);
  });
  it("never calls an ultra-processed food 'few concerns'", () => {
    const p = parseProduct({ status: 1, product: { product_name: "x", nova_group: 4, nutrition_grades: "a" } }, "5449000000996")!;
    const a = assess(p, A("e330"), 0);
    expect(a.overall).toBe("fair");
    expect(a.reasons.join(" ")).toMatch(/Ultra-processed/);
  });
});
