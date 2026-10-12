// @vitest-environment node
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { mkdtempSync, readFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
// @ts-expect-error plain .mjs build script
import { buildSeo, esc, ldJson } from "../../scripts/build-seo.mjs";
import { TECHNIQUES } from "../rooted/breathContent";
import { PANTRY } from "../rooted/pantryContent";
import { RECIPES } from "../rooted/recipes";

const SITE = "https://example.test";
let out = "";
let result: { pages: { type: string; id: string; path: string }[]; urls: string[] };
const html = (path: string) => readFileSync(join(out, path, "index.html"), "utf8");
const BANNED = /\b(cure|cures|detox|miracle|guaranteed)\b/i;

beforeAll(async () => {
  out = mkdtempSync(join(tmpdir(), "seo-"));
  result = await buildSeo({ outDir: out, siteUrl: SITE });
}, 60_000);
afterAll(() => rmSync(out, { recursive: true, force: true }));

const expected = [
  ...TECHNIQUES.filter((t) => !t.custom).map((t) => `/guides/breathing/${t.id === "calm" ? "settle-in" : t.id}/`),
  ...PANTRY.map((p) => `/guides/foods/${p.id}/`),
  ...RECIPES.map((r) => `/guides/recipes/${r.id}/`),
];

describe("static SEO pages", () => {
  it("has a page for every breathing technique, pantry item and recipe", () => {
    expect(expected.length).toBeGreaterThan(60);
    for (const path of expected) expect(existsSync(join(out, path, "index.html")), path).toBe(true);
    expect(existsSync(join(out, "guides", "index.html"))).toBe(true);
  });

  it("every page has the required SEO and safety elements", () => {
    const seen = new Set<string>();
    for (const { path } of result.pages) {
      const h = html(path);
      expect(h.match(/<h1[ >]/g)?.length, `${path} h1`).toBe(1);
      const title = /<title>([^<]*)<\/title>/.exec(h)?.[1] ?? "";
      expect(title.length, `${path} title`).toBeGreaterThan(5);
      expect(title.length, `${path} title`).toBeLessThanOrEqual(70);
      expect(seen.has(title), `${path} duplicate title`).toBe(false);
      seen.add(title);
      const desc = /<meta name="description" content="([^"]*)"/.exec(h)?.[1] ?? "";
      expect(desc.length, `${path} description`).toBeGreaterThanOrEqual(50);
      expect(desc.length, `${path} description`).toBeLessThanOrEqual(170);
      expect(h).toContain(`<link rel="canonical" href="${SITE}${path}">`);
      expect(h).toContain('property="og:title"');
      expect(h).toContain('name="twitter:card"');
      expect(h).toContain('<html lang="en">');
      const blocks = [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
      expect(blocks.length, `${path} json-ld`).toBeGreaterThan(0);
      for (const b of blocks) expect(() => JSON.parse(b), `${path} json-ld parse`).not.toThrow();
      expect(h, `${path} cta`).toMatch(/<a class="cta" href="\/[a-z]*(\?|#)[^"]*utm_source=guides/);
      expect(h).toContain("Wellness education, not medical advice");
      expect(h).toContain('href="/privacy"');
      expect(h).toContain('href="/disclaimer"');
      expect(h, `${path} banned words`).not.toMatch(BANNED);
      // Only our own JSON-LD scripts: nothing from content may open a script tag.
      expect((h.match(/<script/gi) ?? []).length, `${path} scripts`).toBe(blocks.length);
      for (const m of h.matchAll(/<a [^>]*href="(https?:[^"]+)"[^>]*>/g)) expect(m[0]).toContain('rel="noopener noreferrer"');
    }
  });

  it("uses the app's evidence labels", () => {
    expect(html("/guides/breathing/settle-in/")).toContain("Moderate evidence");
    expect(html("/guides/breathing/box/")).toContain("Early evidence");
    expect(html("/guides/breathing/power/")).toContain("Mixed evidence");
    expect(html("/guides/foods/oats/")).toMatch(/Strong evidence|Moderate evidence|Mixed evidence|Early evidence/);
  });

  it("keeps the app's safety cautions", () => {
    const power = html("/guides/breathing/power/");
    expect(power).toContain("pregnant");
    expect(power).toContain("heart disease");
    for (const f of PANTRY.filter((p) => p.cautions.length)) {
      const h = html(`/guides/foods/${f.id}/`);
      for (const c of f.cautions) {
        const want = c.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
        expect(h, `${f.id} caution`).toContain(want);
      }
    }
  });

  it("recipes carry Recipe JSON-LD with ingredients and steps", () => {
    for (const r of RECIPES) {
      const h = html(`/guides/recipes/${r.id}/`);
      const ld = JSON.parse(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(h)![1]);
      expect(ld["@type"]).toBe("Recipe");
      expect(ld.recipeIngredient).toHaveLength(r.ingredients.length);
      expect(ld.recipeInstructions).toHaveLength(r.steps.length);
    }
  });

  it("sitemap lists every page and the main app routes; robots points at it", () => {
    const sm = readFileSync(join(out, "sitemap.xml"), "utf8");
    for (const { path } of result.pages) expect(sm).toContain(`<loc>${SITE}${path}</loc>`);
    for (const p of ["/", "/breathe", "/nourish", "/move", "/light", "/spirit", "/places", "/earth", "/privacy", "/terms", "/disclaimer"]) expect(sm).toContain(`<loc>${SITE}${p}</loc>`);
    expect(readFileSync(join(out, "robots.txt"), "utf8")).toContain(`Sitemap: ${SITE}/sitemap.xml`);
  });

  it("escapes hostile content", () => {
    expect(esc(`<script>"x"&'</script>`)).toBe("&lt;script&gt;&quot;x&quot;&amp;&#39;&lt;/script&gt;");
    const j = ldJson({ a: "</script><script>alert(1)</script> " });
    expect(j).not.toContain("<");
    expect(j).not.toContain(" ");
    expect(JSON.parse(j).a).toContain("</script>");
  });
});
