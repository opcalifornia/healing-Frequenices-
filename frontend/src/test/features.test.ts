import { describe, expect, it, vi } from "vitest";

vi.hoisted(() => {
  const mem = new Map<string, string>();
  (globalThis as unknown as { localStorage: Storage }).localStorage = {
    getItem: (k: string) => mem.get(k) ?? null,
    setItem: (k: string, v: string) => void mem.set(k, String(v)),
    removeItem: (k: string) => void mem.delete(k),
    clear: () => mem.clear(),
    key: (i: number) => [...mem.keys()][i] ?? null,
    get length() { return mem.size; },
  } as Storage;
});
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { AREAS, FEATURES, markVisited, snapshotFor, triedFeatures, untrackedMatches, useVisited, type RawStores } from "../rooted/features";

const here = dirname(fileURLToPath(import.meta.url));
const app = readFileSync(join(here, "..", "App.tsx"), "utf8");
const routes = [...app.matchAll(/<Route\s+path="([^"]+)"/g)].map((m) => m[1]).filter((p) => p !== "*");

/** Does a concrete path match a route pattern like "/program/:id"? */
function routeMatches(pattern: string, path: string): boolean {
  const a = pattern.split("/").filter(Boolean);
  const b = path.split("/").filter(Boolean);
  return a.length === b.length && a.every((seg, i) => seg.startsWith(":") || seg === b[i]);
}
/** Static routes win over :params, the way react-router ranks them. */
const exactRoute = (path: string) => routes.find((r) => r === path) ?? routes.find((r) => routeMatches(r, path));

describe("feature catalog", () => {
  it("has a healthy number of tools", () => {
    expect(FEATURES.length).toBeGreaterThanOrEqual(45);
    expect(FEATURES.length).toBeLessThanOrEqual(75);
  });

  it("has unique ids", () => {
    const ids = FEATURES.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("uses only known areas, and every area has tools", () => {
    for (const f of FEATURES) expect(AREAS).toContain(f.area);
    for (const a of AREAS) expect(FEATURES.some((f) => f.area === a)).toBe(true);
    expect(FEATURES.filter((f) => f.area === "Start here")).toHaveLength(4);
  });

  it("parses the app's routes", () => {
    expect(routes).toContain("/");
    expect(routes).toContain("/breathe");
    expect(routes).toContain("/program/:id");
  });

  it("links every tool to a route that exists", () => {
    for (const f of FEATURES) {
      const path = f.to.split("#")[0] || "/";
      expect(exactRoute(path), `${f.id} -> ${f.to}`).toBeTruthy();
    }
  });

  it("links every #anchor to a section id on the target page", () => {
    const pageFor: Record<string, string> = {
      "/breathe": "Breathe", "/nourish": "Nourish", "/move": "Move", "/places": "Places", "/earth": "Earth",
      "/calendar": "Calendar", "/light": "Light", "/garden": "Garden", "/spirit": "Spirit", "/support": "Support",
      "/program/relax-7": "Program",
    };
    for (const f of FEATURES) {
      const [path, hash] = f.to.split("#");
      if (!hash) continue;
      const page = pageFor[path];
      expect(page, `no page mapped for ${f.to}`).toBeTruthy();
      const src = readFileSync(join(here, "..", "pages", `${page}.tsx`), "utf8");
      // Light renders some sections from a list (id={k}), so also accept a TABS entry.
      const found = src.includes(`id="${hash}"`) || src.includes(`{ id: "${hash}", label:`);
      expect(found, `${f.id}: #${hash} not found in ${page}.tsx`).toBe(true);
    }
  });

  it("writes one plain sentence-ish what and why for each", () => {
    for (const f of FEATURES) {
      expect(f.what.length, f.id).toBeGreaterThan(20);
      expect(f.why.length, f.id).toBeGreaterThan(15);
      expect(`${f.what} ${f.why}`.toLowerCase(), f.id).not.toMatch(/\bcures?\b/);
    }
  });
});

describe("triedFeatures", () => {
  it("is empty for a fresh profile", () => {
    expect(triedFeatures({}).size).toBe(0);
    expect(triedFeatures(snapshotFor({}, "p1")).size).toBe(0);
  });

  it("infers tools from stored data for the right profile only", () => {
    const raw: RawStores = {
      practice: {
        logs: { p1: [{ kind: "breath:calm" }, { kind: "move:walk" }, { kind: "combo:sos", before: 4, after: 2 }, { kind: "meditate" }], p2: [{ kind: "pmr" }] },
        bolts: { p1: [{}] },
        hearts: { p2: [{}] },
        customs: {},
        prefs: { sound: "voice", scape: "none" },
      },
      nourish: { lists: { p1: [{}] }, water: { p1: { "2026-10-12": 500 } } },
      calendar: { events: { p1: [{}] }, busy: { p2: [{}] } },
      garden: { beds: { p1: [{}] } },
      bedtime: { plans: {}, nights: { p1: ["2026-10-11"] } },
      journal: { entries: { p1: [{ prompt: "Three good things" }] } },
      support: { plans: { p1: { signs: ["Not sleeping"] } }, moods: { p1: { "2026-10-12": 3 } } },
      earth: { pledges: { p1: ["bike"] }, deeds: {} },
      wellness: { about: { p1: { onboarded: true } } },
      programs: { enrolled: { p1: { "relax-7": {} } } },
      user: { token: null, profiles: [{ id: "p-main" }, { id: "p-guest" }], libraries: { p1: { favorites: [], continue: [{}], custom: [] } } },
      placesHome: { walk: true },
    };
    const t = triedFeatures(snapshotFor(raw, "p1", ["sleep-guide"]));
    for (const id of [
      "one-minute-calm", "breath-library", "move-routines", "combos", "breath-results", "meditate", "bolt", "breath-sounds",
      // Garden is switched off in rooted/flags.ts, so it is not in the guide.
      "shopping-list", "water", "calendar", "bedtime", "gratitude", "safety-plan", "mood-check", "pledges",
      "about-you", "programs", "healing-sessions", "bring-home", "sleep-guide",
    ]) expect(t.has(id), id).toBe(true);
    for (const id of ["pmr", "heart-check", "work-import", "good-deeds", "pattern-builder", "build-session", "my-stuff", "profiles", "account", "plate-builder", "sound-bath"]) {
      expect(t.has(id), id).toBe(false);
    }

    const t2 = triedFeatures(snapshotFor(raw, "p2"));
    // Breath sound prefs and the Places checklist are kept per device, not per profile.
    expect([...t2].sort()).toEqual(["breath-sounds", "bring-home", "heart-check", "pmr", "work-import"]);
  });

  it("matches log prefixes, not partial words", () => {
    expect(triedFeatures({ logs: [{ kind: "breath:box" }] }).has("breath-library")).toBe(true);
    expect(triedFeatures({ logs: [{ kind: "breath:box" }] }).has("one-minute-calm")).toBe(false);
    expect(triedFeatures({ logs: [{ kind: "lightning" }] }).has("light-box")).toBe(false);
  });

  it("counts a custom profile and signing in", () => {
    const t = triedFeatures(snapshotFor({ user: { token: "x", profiles: [{ id: "p-main" }, { id: "abc" }] } }, "abc"));
    expect(t.has("profiles")).toBe(true);
    expect(t.has("account")).toBe(true);
  });

  it("ignores an empty safety plan", () => {
    const t = triedFeatures(snapshotFor({ support: { plans: { p1: { signs: ["  "] } } } }, "p1"));
    expect(t.has("safety-plan")).toBe(false);
  });

  it("remembers visits per profile in storage", () => {
    markVisited("your-data");
    markVisited("your-data");
    expect(useVisited.getState().visited.guest).toEqual(["your-data"]);
    expect(localStorage.getItem("rooted-guide-visited")).toContain("your-data");
    expect(triedFeatures({ visited: useVisited.getState().visited.guest }).has("your-data")).toBe(true);
  });
});

describe("route-based visits", () => {
  it("counts only tools with no other usage signal, and only the section you opened", () => {
    const ids = untrackedMatches("/nourish", "#recipes");
    expect(ids.length).toBeGreaterThan(0);
    for (const id of ids) expect(FEATURES.find((f) => f.id === id)!.triedBy).toBeUndefined();
    // Opening a page never marks a tool that lives in a different section of it.
    expect(untrackedMatches("/nourish", "#recipes")).not.toEqual(untrackedMatches("/nourish", "#water"));
    expect(untrackedMatches("/nowhere", "")).toEqual([]);
  });
});
