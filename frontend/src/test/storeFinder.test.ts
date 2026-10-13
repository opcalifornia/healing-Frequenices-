import { describe, expect, it } from "vitest";
import { appleMapsLink, googleMapsLink, groupByStore, storesFor, tripNote } from "../rooted/storeFinder";
import { PANTRY } from "../rooted/pantryContent";
import type { ListItem } from "../store/nourish";

const item = (p: Partial<ListItem> & { id: string; name: string }): ListItem => ({ aisle: "Other", checked: false, ...p });

describe("storesFor", () => {
  it("sends burdock to Asian markets and health food stores", () => {
    const s = storesFor(item({ id: "burdock-root", name: "Burdock root", aisle: "Specialty & international" }));
    expect(s).toContain("asian");
    expect(s).toContain("health");
    expect(s).not.toContain("grocery");
  });

  it("keeps everyday staples at the grocery store", () => {
    expect(storesFor(item({ id: "oats", name: "Oats", aisle: "Grains & beans" }))).toEqual(["grocery"]);
  });

  it("sends garden seeds to a garden center", () => {
    expect(storesFor(item({ id: "garden-basil", name: "Basil: seeds", aisle: "Garden" }))).toEqual(["garden"]);
    expect(storesFor(item({ id: "custom-tomato-seeds", name: "Tomato seeds" }))).toEqual(["garden"]);
    // ...but edible seeds typed in by hand are still groceries
    expect(storesFor(item({ id: "custom-sunflower-seeds", name: "Sunflower seeds" }))).toEqual(["grocery"]);
  });

  it("uses name rules for typed-in items and defaults to grocery", () => {
    expect(storesFor(item({ id: "custom-gobo", name: "Gobo" }))).toEqual(["asian", "health"]);
    expect(storesFor(item({ id: "custom-lemons", name: "Lemons" }))).toEqual(["grocery"]);
  });

  it("finds at least one store for every pantry item", () => {
    for (const p of PANTRY) expect(storesFor(item({ id: p.id, name: p.name, aisle: p.aisle })).length).toBeGreaterThan(0);
  });
});

describe("groupByStore", () => {
  const list = [
    item({ id: "burdock-root", name: "Burdock root" }),
    item({ id: "oats", name: "Oats" }),
    item({ id: "lentils", name: "Lentils" }),
    item({ id: "garden-basil", name: "Basil: seeds", aisle: "Garden" }),
    item({ id: "salmon", name: "Salmon", checked: true }),
  ];

  it("groups unchecked items, biggest trip first", () => {
    const g = groupByStore(list);
    expect(g[0]).toMatchObject({ type: "grocery" });
    expect(g[0].items.map((i) => i.name)).toEqual(["Oats", "Lentils"]);
    expect(g.find((x) => x.type === "asian")?.items.map((i) => i.name)).toEqual(["Burdock root"]);
    expect(g.find((x) => x.type === "garden")?.items.map((i) => i.name)).toEqual(["Basil: seeds"]);
    expect(g.flatMap((x) => x.items).some((i) => i.name === "Salmon")).toBe(false);
  });

  it("writes a calendar note of what's left to buy", () => {
    expect(tripNote(list)).toBe("Pick up: Burdock root, Oats, Lentils, Basil: seeds");
    expect(tripNote([])).toBe("");
  });
});

describe("map links", () => {
  it("searches near me without a location", () => {
    expect(googleMapsLink("health food store")).toBe("https://www.google.com/maps/search/?api=1&query=health%20food%20store%20near%20me");
    expect(appleMapsLink("Asian market")).toBe("https://maps.apple.com/?q=Asian%20market");
  });

  it("encodes the query and rounds coordinates", () => {
    const at = { lat: 37.774929, lng: -122.419416 };
    expect(googleMapsLink("herb shop & co-op", at)).toBe("https://www.google.com/maps/search/?api=1&query=herb%20shop%20%26%20co-op%20near%2037.775%2C-122.419");
    expect(appleMapsLink("farmers market", at)).toBe("https://maps.apple.com/?q=farmers%20market&ll=37.775,-122.419");
  });
});
