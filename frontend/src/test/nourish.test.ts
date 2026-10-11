import { describe, expect, it } from "vitest";
import { groupByAisle, listToText, todayKey, AISLE_ORDER } from "../store/nourish";
import { PANTRY } from "../rooted/pantryContent";

describe("shopping list", () => {
  const items = [
    { id: "custom-lemons", name: "Lemons", aisle: "Other", checked: false },
    { id: "oats", name: "Oats", aisle: "Grains & beans", checked: true, qty: "1 bag" },
    { id: "ginger", name: "Ginger", aisle: "Produce", checked: false },
  ];

  it("groups by aisle in walking order", () => {
    expect(groupByAisle(items).map(([a]) => a)).toEqual(["Produce", "Grains & beans", "Other"]);
  });

  it("exports a plain-text checklist", () => {
    const t = listToText(items, "List");
    expect(t).toContain("PRODUCE\n[ ] Ginger");
    expect(t).toContain("[x] Oats (1 bag)");
    expect(t.endsWith("\n")).toBe(true);
  });

  it("formats day keys locally", () => {
    expect(todayKey(new Date(2026, 0, 5))).toBe("2026-01-05");
  });
});

describe("pantry content", () => {
  it("has unique ids, known aisles, cautions and sources for every item", () => {
    const ids = new Set<string>();
    for (const p of PANTRY) {
      expect(ids.has(p.id)).toBe(false);
      ids.add(p.id);
      expect(AISLE_ORDER).toContain(p.aisle);
      expect(p.cautions.length).toBeGreaterThan(0);
      expect(p.sources.length).toBeGreaterThan(0);
      expect(p.benefits.length).toBeGreaterThan(0);
    }
    expect(PANTRY.find((p) => p.id === "burdock-root")).toBeTruthy();
  });
});
