import { describe, expect, it } from "vitest";
import { ADDITIVES, TIERS, TIER_ORDER, additiveById, normalizeCode, shownName, searchAdditives, tierOf } from "../rooted/additivesContent";
import { isValidBarcode, lookupBarcode, parseProduct } from "../rooted/foodLookup";

describe("additive research library", () => {
  it("has unique ids that match their codes", () => {
    const ids = ADDITIVES.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const a of ADDITIVES) if (/^E\d/.test(a.code)) expect(a.id).toBe(a.code.toLowerCase());
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

  it("reads sub-type suffixes: roman numerals are dropped, letters are kept", () => {
    for (const [raw, id] of [["en:e322i", "e322"], ["en:e500ii", "e500"], ["en:e160aii", "e160a"], ["en:e150d", "e150d"], ["en:e407a", "e407a"], ["en:e472b", "e472b"], ["en:e450iii", "e450"], ["E1442", "e1442"]] as const) expect(normalizeCode(raw), raw).toBe(id);
  });

  it("shows the name printed on the pack, with the scientific name kept for the detail page", () => {
    expect(shownName(additiveById("e129")!)).toBe("Red 40");
    expect(additiveById("e129")!.name).toBe("Allura red AC");
    expect(shownName(additiveById("e102")!)).toBe("Yellow 5");
    expect(shownName(additiveById("e110")!)).toBe("Yellow 6");
    expect(shownName(additiveById("e330")!)).toBe("Citric acid");
    expect(searchAdditives("red 40").map((a) => a.id)).toContain("e129");
    expect(searchAdditives("allura").map((a) => a.id)).toContain("e129");
  });

  it("finds additives from the ways a label or database writes the code", () => {
    for (const raw of ["E171", "e171", "en:e171", "E-171", " e 171 "]) expect(additiveById(raw)?.name).toBe("Titanium dioxide");
    expect(normalizeCode("en:e150d")).toBe("e150d");
    expect(normalizeCode("en:e160a(ii)")).toBeUndefined();
    expect(normalizeCode("sugar")).toBeUndefined();
    expect(additiveById("e9999")).toBeUndefined();
  });

  it("searches by name, other name and code", () => {
    expect(searchAdditives("aspartame").map((a) => a.id)).toEqual(["e951", "e962"]);
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

describe("risk scale", () => {
  it("gives every step its own colour and its own shape", () => {
    expect(new Set(TIERS.map((t) => t.color)).size).toBe(TIERS.length);
    expect(new Set(TIERS.map((t) => t.shape)).size).toBe(TIERS.length);
    expect(TIERS.map((t) => t.id)).toEqual(Object.keys(TIER_ORDER).sort((a, b) => TIER_ORDER[a as keyof typeof TIER_ORDER] - TIER_ORDER[b as keyof typeof TIER_ORDER]));
  });

  it("places well-known additives where the evidence puts them", () => {
    const t = (id: string) => tierOf(additiveById(id)!);
    expect(t("e171")).toBe("restricted");
    expect(t("e127")).toBe("restricted");
    expect(t("e443")).toBe("restricted");
    expect(t("e250")).toBe("notable"); // processed meat link, moderate evidence
    expect(t("e220")).toBe("notable"); // sulfites
    expect(t("e110")).toBe("notable"); // synthetic dyes: OEHHA review, EU warning, FDA phase-out request
    expect(t("e102")).toBe("notable");
    expect(t("e129")).toBe("notable");
    expect(t("e951")).toBe("some"); // aspartame, limited evidence
    expect(t("e433")).toBe("some"); // mouse studies only
    expect(t("e466")).toBe("some"); // mouse studies plus a small human trial and a cohort link
    expect(t("e621")).toBe("some"); // MSG: EFSA flagged intake above its limit for some groups
    expect(t("e471")).toBe("some"); // same French cohorts as E472b and E472c
    expect(t("e472b")).toBe("some");
    expect(t("e341")).toBe("some"); // phosphates: EFSA 2019, children above the limit
    expect(t("e450")).toBe("some");
    expect(t("e200")).toBe("some"); // sorbates: regulators fine, lab DNA findings unresolved
    expect(t("e202")).toBe("some");
    expect(t("e435")).toBe("some");
    expect(t("e481")).toBe("some");
    expect(t("e330")).toBe("clear");
    expect(t("e1440")).toBe("clear");
  });

  it("uses every step of the scale at least once", () => {
    const used = new Set(ADDITIVES.map(tierOf));
    for (const t of TIERS) expect(used.has(t.id), t.id).toBe(true);
  });
});
