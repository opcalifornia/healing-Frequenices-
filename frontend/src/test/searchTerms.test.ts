import { describe, expect, it } from "vitest";
import { effectiveSearch } from "../rooted/searchTerms";

describe("effectiveSearch", () => {
  it("leaves ordinary searches alone", () => {
    expect(effectiveSearch("  delta waves ")).toEqual({ query: "delta waves", softened: false });
    expect(effectiveSearch("")).toEqual({ query: "", softened: false });
  });
  it("swaps words the app doesn't repeat for relax", () => {
    for (const raw of ["calm down", "Calm", "calming sounds", "calmer", "chill out", "settle down"]) {
      const r = effectiveSearch(raw);
      expect(r.softened, raw).toBe(true);
      expect(r.query.toLowerCase(), raw).toContain("relax");
      expect(r.query.toLowerCase(), raw).not.toMatch(/calm|chill/);
    }
    expect(effectiveSearch("calming sounds").query).toBe("relax sounds");
  });
  it("does not match inside other words", () => {
    expect(effectiveSearch("chilled").softened).toBe(false);
  });
});
