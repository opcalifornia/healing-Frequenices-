import { describe, expect, it } from "vitest";
import { ADDITIVES, additiveById, normalizeCode, searchAdditives } from "../rooted/additivesContent";
import { isValidBarcode, lookupBarcode, parseProduct } from "../rooted/foodLookup";

describe("additive research library", () => {
  it("has unique ids that match their codes", () => {
    const ids = ADDITIVES.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const a of ADDITIVES) expect(a.id).toBe(a.code.toLowerCase());
  });

  it("cites at least one source with a real https link for every entry", () => {
    for (const a of ADDITIVES) {
      expect(a.sources.length, a.code).toBeGreaterThan(0);
      for (const s of a.sources) expect(s.url, `${a.code}: ${s.text}`).toMatch(/^https:\/\//);
    }
  });

  it("explains every concern with research and rates how strong it is", () => {
    for (const a of ADDITIVES) {
      expect(a.research.length, a.code).toBeGreaterThan(0);
      expect(["Strong", "Moderate", "Mixed", "Weak", "None"]).toContain(a.evidence);
      if (a.level !== "little") expect(a.evidence, `${a.code} flags a concern but rates no evidence`).not.toBe("None");
    }
  });

  it("tags every flagged additive with at least one potential risk, and keeps tags honest", () => {
    for (const a of ADDITIVES) {
      if (a.level === "little" && a.evidence === "None") expect(a.topics, a.code).toEqual([]);
      else expect(a.topics.length, a.code).toBeGreaterThan(0);
    }
  });

  it("never uses alarmist or cure language, or the word calm", () => {
    const text = JSON.stringify(ADDITIVES).toLowerCase();
    // Whole words only: "toxicity studies" is normal science wording, "toxic" as a label is not.
    for (const bad of ["toxic", "poison", "poisonous", "cure", "cures", "detox", "miracle", "guarantee", "carcinogen-free", "calm"]) expect(text, bad).not.toMatch(new RegExp(`\\b${bad}\\b`));
  });

  it("finds additives from the ways a label or database writes the code", () => {
    for (const raw of ["E171", "e171", "en:e171", "E-171", " e 171 "]) expect(additiveById(raw)?.name).toBe("Titanium dioxide");
    expect(normalizeCode("en:e150d")).toBe("e150d");
    expect(normalizeCode("en:e160a(ii)")).toBeUndefined();
    expect(normalizeCode("sugar")).toBeUndefined();
    expect(additiveById("e9999")).toBeUndefined();
  });

  it("searches by name, other name and code", () => {
    expect(searchAdditives("aspartame").map((a) => a.id)).toEqual(["e951"]);
    expect(searchAdditives("red 40").map((a) => a.id)).toEqual(["e129"]);
    expect(searchAdditives("E330")[0].name).toBe("Citric acid");
    expect(searchAdditives("")).toHaveLength(ADDITIVES.length);
  });
});

describe("barcode lookup", () => {
  it("checks the barcode check digit", () => {
    expect(isValidBarcode("5449000000996")).toBe(true); // Coca-Cola, EAN-13
    expect(isValidBarcode("5449000000997")).toBe(false);
    expect(isValidBarcode("036000291452")).toBe(true); // UPC-A
    expect(isValidBarcode("96385074")).toBe(true); // EAN-8
    expect(isValidBarcode("12345")).toBe(false);
    expect(isValidBarcode("abcdefghijklm")).toBe(false);
  });

  it("parses a product and keeps only E-number additives", () => {
    const p = parseProduct(
      { status: 1, product: { product_name: " Fizzy drink ", brands: "Brand A, Brand B", image_front_small_url: "https://images.example/x.jpg", additives_tags: ["en:e330", "en:e330", "en:e150d", "en:odd"], ingredients_text: "Water, sugar" } },
      "5449000000996",
    );
    expect(p).toMatchObject({ name: "Fizzy drink", brand: "Brand A", additives: ["e330", "e150d"], ingredients: "Water, sugar" });
    expect(parseProduct({ status: 0 }, "1")).toBeNull();
    expect(parseProduct({ status: 1, product: { image_front_small_url: "http://insecure/x.jpg" } }, "1")?.image).toBeUndefined();
  });

  it("reports not found, network trouble and invalid numbers", async () => {
    const ok = (body: unknown, status = 200) => (async () => ({ ok: status < 400, status, json: async () => body }) as Response) as typeof fetch;
    expect(await lookupBarcode("123", ok({}))).toEqual({ ok: false, reason: "invalid" });
    expect(await lookupBarcode("5449000000996", ok({ status: 0 }, 404))).toEqual({ ok: false, reason: "notfound" });
    expect(await lookupBarcode("5449000000996", ok({ status: 0, product: null }))).toEqual({ ok: false, reason: "notfound" });
    expect(await lookupBarcode("5449000000996", ok({}, 500))).toEqual({ ok: false, reason: "network" });
    expect(await lookupBarcode("5449000000996", (async () => { throw new Error("offline"); }) as typeof fetch)).toEqual({ ok: false, reason: "network" });
    const hit = await lookupBarcode("5449000000996", ok({ status: 1, product: { product_name: "Cola", additives_tags: ["en:e150d"] } }));
    expect(hit).toMatchObject({ ok: true, product: { name: "Cola", additives: ["e150d"] } });
  });
});
