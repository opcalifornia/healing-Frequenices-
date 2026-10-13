import { describe, expect, it } from "vitest";
import { NUTRIENTS, PAIRINGS, foodIndex, nutrientById } from "../rooted/nutrientsContent";

const text = (o: unknown) => JSON.stringify(o);

describe("vitamins and minerals library", () => {
  it("covers every vitamin and the main minerals", () => {
    for (const id of ["vit-a", "b1", "b2", "b3", "b5", "b6", "b7", "folate", "b12", "vit-c", "vit-d", "vit-e", "vit-k", "choline", "calcium", "magnesium", "potassium", "phosphorus", "iron", "zinc", "selenium", "iodine", "copper", "manganese", "chromium", "molybdenum"]) {
      expect(nutrientById(id), id).toBeDefined();
    }
  });
  it("has unique ids and complete entries", () => {
    expect(new Set(NUTRIENTS.map((n) => n.id)).size).toBe(NUTRIENTS.length);
    for (const n of NUTRIENTS) {
      expect(n.does.length, n.id).toBeGreaterThan(0);
      expect(n.plants.length, n.id).toBeGreaterThan(1);
      expect(n.care.length, n.id).toBeGreaterThan(0);
      expect(n.lowRisk.length, n.id).toBeGreaterThan(10);
      expect(n.sources.length, n.id).toBeGreaterThan(0);
      for (const s of n.sources) expect(s.url, n.id).toMatch(/^https:\/\//);
    }
  });
  it("labels evidence and avoids cure language, alarm words and the word calm", () => {
    for (const n of NUTRIENTS) expect(["Strong", "Moderate", "Mixed", "Weak", "None"]).toContain(n.evidence);
    for (const bad of ["cure", "cures", "treat", "treats", "detox", "miracle", "toxic", "poison", "calm", "boost your immune"]) expect(text([NUTRIENTS, PAIRINGS]), bad).not.toMatch(new RegExp(`\\b${bad}\\b`, "i"));
  });
  it("gives no supplement doses", () => {
    expect(text(NUTRIENTS)).not.toMatch(/\b\d[\d,]*\s?(mg|mcg|µg|iu|g)\b/i);
  });
  it("keeps the safety lines that matter", () => {
    expect(text(nutrientById("vit-k")?.care)).toMatch(/warfarin/i);
    expect(text(nutrientById("vit-a")?.care)).toMatch(/pregnan/i);
    expect(text(nutrientById("biotin") ?? nutrientById("b7")?.care)).toMatch(/lab tests/i);
    expect(text(nutrientById("potassium")?.care)).toMatch(/kidney/i);
  });
  it("pairings point at real nutrients", () => {
    for (const p of PAIRINGS) for (const id of p.parts) expect(nutrientById(id), `${p.id}:${id}`).toBeDefined();
  });
  it("builds a food index with the most useful foods first", () => {
    const idx = foodIndex();
    expect(idx.length).toBeGreaterThan(80);
    expect(idx.find((f) => f.name === "Spinach")?.nutrients).toEqual(expect.arrayContaining(["vit-a", "folate", "magnesium"]));
    expect(idx[0].nutrients.length).toBeGreaterThanOrEqual(idx[idx.length - 1].nutrients.length);
  });
});
