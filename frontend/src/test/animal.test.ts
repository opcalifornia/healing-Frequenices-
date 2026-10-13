import { describe, expect, it } from "vitest";
import { ANIMAL_TOPICS, COMPARE } from "../rooted/animalContent";

const text = JSON.stringify([ANIMAL_TOPICS, COMPARE]);

describe("animal products guide", () => {
  it("has unique topics with ratings, plain actions and https sources", () => {
    expect(new Set(ANIMAL_TOPICS.map((t) => t.id)).size).toBe(ANIMAL_TOPICS.length);
    for (const t of ANIMAL_TOPICS) {
      expect(["Strong", "Moderate", "Mixed", "Weak", "None"]).toContain(t.rating);
      expect(t.doThis.length, t.id).toBeGreaterThan(0);
      expect(t.sources.length, t.id).toBeGreaterThan(0);
      for (const s of t.sources) expect(s.url, t.id).toMatch(/^https:\/\//);
    }
    for (const c of COMPARE) expect(c.source.url).toMatch(/^https:\/\//);
  });
  it("covers antibiotics, hormones and organic", () => {
    for (const id of ["antibiotics", "hormones", "organic", "labels"]) expect(ANIMAL_TOPICS.some((t) => t.id === id), id).toBe(true);
  });
  it("avoids alarm and cure language and the word calm", () => {
    for (const bad of ["cure", "cures", "toxic", "poison", "poisonous", "detox", "miracle", "dangerous", "calm"]) expect(text, bad).not.toMatch(new RegExp(`\\b${bad}\\b`, "i"));
  });
  it("is honest about disagreement and unknowns", () => {
    expect(text).toMatch(/disagree/i);
    expect(text).toMatch(/not proven harmful|isn't conclusive|unknown/i);
  });
});
