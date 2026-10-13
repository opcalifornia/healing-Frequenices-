// Builds the content index GAIA searches on the server.
//   npm run build:gaia-index   (writes backend/app/gaia/content_index.json)
// GAIA may only recommend what is in this index, so it can't invent remedies.
// Safety: each item lists the profile flags that rule it out (exclude_if). The server
// applies them in code before the model ever sees a result.
import { build } from "esbuild";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const OUT = join(ROOT, "..", "backend", "app", "gaia", "content_index.json");

async function loadContent() {
  const result = await build({
    stdin: {
      contents: `
        export { FEATURES } from "./src/rooted/features";
        export { TECHNIQUES } from "./src/rooted/breathContent";
        export { ROUTINES, KIND_LABEL } from "./src/rooted/moveContent";
        export { COMBOS } from "./src/rooted/comboContent";
        export { PROGRAMS } from "./src/rooted/programs";
        export { PANTRY } from "./src/rooted/pantryContent";
        export { RECIPES } from "./src/rooted/recipes.ts";
        export { ADDITIVES } from "./src/rooted/additivesContent";
        export { NUTRIENTS } from "./src/rooted/nutrientsContent";
      `,
      resolveDir: ROOT, loader: "ts", sourcefile: "gaia-entry.ts",
    },
    bundle: true, format: "esm", platform: "node", write: false, logLevel: "silent",
    define: { "import.meta.env": "{}" },
    // Features pull in stores; stub what Node can't load.
    external: ["zustand", "zustand/*", "react", "react-dom", "framer-motion"],
  });
  const tmp = join(ROOT, "node_modules", ".cache", "gaia-entry.mjs");
  mkdirSync(dirname(tmp), { recursive: true });
  writeFileSync(tmp, result.outputFiles[0].text);
  return import(pathToFileURL(tmp).href + `?t=${Date.now()}`);
}

const clean = (s) => String(s ?? "").replace(/\s+/g, " ").trim();
const clip = (s, n = 320) => {
  const t = clean(s);
  return t.length <= n ? t : t.slice(0, n - 1).replace(/\s+\S*$/, "") + "…";
};

/** Breathing techniques that need care, mirrored from safeTechnique() in programs.ts. */
const BREATH_EXCLUDE = { power: ["noPowerBreathing"], box: ["breathHoldCare"], "478": ["breathHoldCare"] };

export async function buildIndex() {
  const c = await loadContent();
  const items = [];

  for (const f of c.FEATURES) {
    items.push({ id: `tool:${f.id}`, kind: "tool", title: f.title, summary: clip(f.what), why: clip(f.why), area: f.area, minutes: f.minutes ?? null, to: f.to, exclude_if: [], cautions: [] });
  }
  for (const t of c.TECHNIQUES) {
    items.push({
      id: `breath:${t.id}`, kind: "breathing", title: t.name, summary: clip(`${t.short}. ${t.when}`), why: clip(t.why), evidence: t.evidence,
      minutes: t.minutes?.[0] ?? null, to: `/breathe?open=${t.id}`, exclude_if: BREATH_EXCLUDE[t.id] ?? [],
      cautions: t.gated ? ["Has a safety check before it starts. Sit or lie down."] : [], goals: [t.next],
    });
  }
  for (const r of c.ROUTINES) {
    items.push({
      id: `move:${r.id}`, kind: "movement", title: r.name, summary: clip(`${c.KIND_LABEL[r.kind]}, ${r.minutes} min. ${r.when}`), minutes: r.minutes,
      to: `/move?open=${r.id}`, exclude_if: r.id === "desk" ? [] : ["seated"], cautions: [], goals: r.next ? [r.next] : [],
    });
  }
  for (const k of c.COMBOS) {
    items.push({ id: `combo:${k.id}`, kind: "combo", title: k.name, summary: clip(`${k.tagline}. Best ${k.when === "any" ? "any time" : `in the ${k.when}`}.`), why: clip(k.why), evidence: k.evidence, to: `/combos?open=${k.id}`, exclude_if: [], cautions: [], goals: k.goals });
  }
  for (const p of c.PROGRAMS.filter((x) => x.live)) {
    items.push({ id: `program:${p.id}`, kind: "program", title: p.title, summary: clip(`${p.tagline}. ${p.days.length} days.`), why: clip(p.about), evidence: p.evidence, to: `/program/${p.id}`, exclude_if: [], cautions: [], goals: [] });
  }
  for (const p of c.PANTRY) {
    items.push({
      id: `food:${p.id}`, kind: "food", title: p.name, summary: clip(p.summary), why: clip(p.benefits.join(" ")), evidence: p.evidence, to: "/nourish#pantry",
      exclude_if: [], cautions: p.cautions.map(clean), care_if: p.cautions.some((x) => /clinician/i.test(x)) ? ["careHerbs"] : [],
    });
  }
  for (const r of c.RECIPES) {
    items.push({ id: `recipe:${r.id}`, kind: "recipe", title: r.title, summary: clip(`${r.blurb} ${r.minutes} min.`), why: clip(r.why.text), evidence: r.why.evidence, minutes: r.minutes, to: "/nourish#recipes", exclude_if: [], cautions: r.cautions.map(clean), allergens: r.allergens });
  }
  for (const a of c.ADDITIVES) {
    items.push({ id: `additive:${a.id}`, kind: "additive", title: `${a.code} ${a.name}`, summary: clip(a.summary), level: a.level, evidence: a.evidence, to: "/scan#guide", exclude_if: [], cautions: a.careIf ? [clean(a.careIf)] : [], sources: a.sources.map((s) => s.text) });
  }
  for (const n of c.NUTRIENTS) {
    items.push({ id: `nutrient:${n.id}`, kind: "nutrient", title: n.name, summary: clip(`${n.summary} Found in: ${n.plants.slice(0, 4).join(", ")}.`), why: clip(n.does.join(" ")), evidence: n.evidence, to: `/nutrients?open=${n.id}`, exclude_if: [], cautions: n.care.map(clean) });
  }
  const catalog = JSON.parse(readFileSync(join(ROOT, "src", "data", "catalog.json"), "utf8"));
  for (const t of Object.values(catalog.titles)) {
    if (t.kind !== "session") continue;
    items.push({ id: `session:${t.id}`, kind: "sound", title: t.name, summary: clip(`${t.tagline} ${t.durationMin} min, ${t.band}.`), minutes: t.durationMin, to: `/title/${t.id}`, exclude_if: [], cautions: ["Use headphones at a low volume. Not while driving. Check with a doctor first if you have epilepsy."], goals: t.goal ? [t.goal] : [] });
  }

  // Stable order, so the file only changes when content does.
  items.sort((a, b) => a.id.localeCompare(b.id));
  return { version: 1, count: items.length, items };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const index = await buildIndex();
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(index, null, 1) + "\n");
  console.log(`GAIA index: ${index.count} items -> ${OUT}`);
}
