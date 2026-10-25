import { describe, expect, it } from "vitest";
import { LEARN_DATA } from "../rooted/breatheLessons";
import { TECHNIQUES } from "../rooted/breathContent";

const L = LEARN_DATA.lessons;
const everything = JSON.stringify(LEARN_DATA).toLowerCase();

describe("breathing lessons", () => {
  it("has a large, varied library", () => {
    expect(L.length).toBeGreaterThanOrEqual(25);
    expect(LEARN_DATA.experts.length).toBeGreaterThanOrEqual(12);
    expect(LEARN_DATA.myths.length).toBeGreaterThanOrEqual(14);
    expect(LEARN_DATA.glossary.length).toBeGreaterThanOrEqual(30);
    for (const lvl of ["Start here", "Go deeper", "Expert"]) expect(L.some((l) => l.level === lvl), lvl).toBe(true);
  });
  it("has unique ids and non-trivial content", () => {
    expect(new Set(L.map((l) => l.id)).size).toBe(L.length);
    for (const l of L) {
      expect(l.blocks.length, l.id).toBeGreaterThanOrEqual(6);
      expect(l.minutes, l.id).toBeGreaterThan(0);
      expect(l.sources.length, l.id).toBeGreaterThanOrEqual(3);
      expect(l.blocks.some((b) => b.type === "fact"), `${l.id} fact`).toBe(true);
    }
  });
  it("only cites https sources", () => {
    for (const l of L) for (const s of l.sources) { expect(s.url, l.id).toMatch(/^https:\/\//); expect(s.text.length).toBeGreaterThan(8); }
    for (const e of LEARN_DATA.experts) for (const s of e.free) expect(s.url, e.id).toMatch(/^https:\/\//);
    for (const s of LEARN_DATA.societies) expect(s.url).toMatch(/^https:\/\//);
  });
  it("points at real techniques, tools and people", () => {
    const ids = new Set(TECHNIQUES.map((t) => t.id));
    const people = new Set(LEARN_DATA.experts.map((e) => e.id));
    for (const l of L) {
      if (l.tryIt?.technique) expect(ids.has(l.tryIt.technique), `${l.id}: ${l.tryIt.technique}`).toBe(true);
      for (const p of l.people ?? []) expect(people.has(p), `${l.id}: ${p}`).toBe(true);
    }
  });
  it("uses careful wording: no cure claims, no medical advice, no calm", () => {
    const prose = JSON.stringify([L.map((l) => [l.title, l.tagline, l.blocks]), LEARN_DATA.myths.map((m) => [m.myth, m.truth])]).toLowerCase();
    for (const bad of ["cures", "will cure", "heals you", "miracle", "guaranteed", "detox your", "calorie"]) expect(prose, bad).not.toContain(bad);
    expect(prose).not.toMatch(/\bcalm\b/);
  });
  it("is honest about animal-only research", () => {
    for (const l of L) if (/\bin mice\b/i.test(JSON.stringify(l.blocks))) expect(["Weak", "Mixed", "None"], l.id).toContain(l.evidence);
  });
  it("has no duplicate glossary terms or empty experts", () => {
    const t = LEARN_DATA.glossary.map((g) => g.term.toLowerCase());
    expect(new Set(t).size).toBe(t.length);
    for (const e of LEARN_DATA.experts) { expect(e.known.length, e.id).toBeGreaterThan(20); expect(e.teaches.length, e.id).toBeGreaterThan(20); }
    expect(everything.length).toBeGreaterThan(100000);
  });
});
