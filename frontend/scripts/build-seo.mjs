// Prerenders static, crawlable HTML guides from the app's evidence-rated content.
//   npm run build:seo   (runs after `vite build`; writes into dist/)
// Output: <outDir>/guides/**/index.html, sitemap.xml, robots.txt.
// Content is bundled with esbuild so the TypeScript data modules load in plain Node.
import { build } from "esbuild";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const DEFAULT_SITE = "https://rooted.app";
const DISCLAIMER = "Wellness education, not medical advice.";
const BRAND = "Rooted";
const APP_PATHS = ["/", "/breathe", "/nourish", "/move", "/light", "/spirit", "/places", "/earth", "/privacy", "/terms", "/disclaimer"];

// ---------- helpers ----------
export const esc = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/** JSON for an inline <script type="application/ld+json">: never closes the tag early. */
export const ldJson = (obj) =>
  JSON.stringify(obj).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");

const EVIDENCE_LABEL = { Strong: "Strong evidence", Moderate: "Moderate evidence", Mixed: "Mixed evidence", Weak: "Early evidence", None: "No support" };
const evLabel = (s) => EVIDENCE_LABEL[s] ?? "Early evidence";

const clip = (s, n) => {
  const t = String(s).replace(/\s+/g, " ").trim();
  if (t.length <= n) return t;
  const cut = t.slice(0, n - 1);
  return cut.slice(0, Math.max(cut.lastIndexOf(" "), n - 30)).replace(/[\s,;:.\-–]+$/, "") + "…";
};
const firstSentences = (s, n) => clip(s, n);
const mins = (m) => `PT${Math.round(m)}M`;

/** Words we never publish on search pages, even inside a debunking sentence (the app keeps those). */
export const BANNED = /\b(cure|cures|detox|miracle|guaranteed)\b/i;
/** Drop any sentence that uses a banned word; drop list items that end up empty. */
function scrub(v) {
  if (typeof v === "string") {
    if (!BANNED.test(v)) return v;
    return (v.match(/[^.!?]+[.!?]*\s*/g) ?? [v]).filter((x) => !BANNED.test(x)).join("").trim();
  }
  if (Array.isArray(v)) return v.map(scrub).filter((x) => x !== "");
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, scrub(x)]));
  return v;
}

async function loadContent() {
  const result = await build({
    stdin: {
      contents: `
        export { TECHNIQUES, POWER_SAFETY } from "./src/rooted/breathContent";
        export { PANTRY, CAT_LABEL } from "./src/rooted/pantryContent";
        export { RECIPES, TAG_LABEL, ALLERGEN_LABEL } from "./src/rooted/recipes.ts";
        export { FINDINGS } from "./src/rooted/nourishContent";
        export { LIGHT_FINDINGS, LIGHT_SAFETY } from "./src/rooted/lightContent";
      `,
      resolveDir: ROOT, loader: "ts", sourcefile: "seo-entry.ts",
    },
    bundle: true, write: false, format: "esm", platform: "node", target: "node18", logLevel: "silent",
  });
  const code = result.outputFiles[0].text;
  const mod = await import("data:text/javascript;base64," + Buffer.from(code).toString("base64"));
  return Object.fromEntries(Object.entries(mod).map(([k, v]) => [k, scrub(v)]));
}

// ---------- page shell ----------
const CSS = `:root{--bg:#0b0d0a;--fg:#f0e8d6;--mut:#c4bdab;--acc:#9cc59a;--sand:#e8d5b0;--card:#151a14;--line:#2b3328}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--fg);font:17px/1.65 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;overflow-wrap:anywhere}
a{color:var(--acc);text-underline-offset:3px}a:hover{color:var(--sand)}a:focus-visible,.cta:focus-visible{outline:3px solid var(--sand);outline-offset:3px}
header,main,footer{max-width:46rem;margin:0 auto;padding:0 16px}
header{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;padding-top:18px;padding-bottom:18px;border-bottom:1px solid var(--line)}
header a{font-weight:600;text-decoration:none}
h1{font-size:2rem;line-height:1.2;margin:1.4rem 0 .6rem;color:var(--sand)}
h2{font-size:1.3rem;line-height:1.3;margin:2rem 0 .5rem;color:var(--sand)}
h3{font-size:1.05rem;margin:1.2rem 0 .3rem}
p,li{max-width:65ch}li{margin:.3rem 0}ul,ol{padding-left:1.3rem}
.lede{font-size:1.1rem;color:var(--mut)}
.badge{display:inline-block;border:1px solid var(--acc);color:var(--acc);border-radius:999px;padding:2px 12px;font-size:.9rem;font-weight:600;margin:0 8px 8px 0}
.meta{color:var(--mut);font-size:.95rem}
.note{background:var(--card);border:1px solid var(--line);border-left:4px solid var(--sand);border-radius:10px;padding:4px 16px 8px;margin:1.2rem 0}
.note h2{margin-top:.8rem}
.cta-box{background:var(--card);border:1px solid var(--acc);border-radius:14px;padding:18px;margin:2rem 0;text-align:center}
.cta{display:inline-block;background:var(--acc);color:#0b0d0a;font-weight:700;border-radius:999px;padding:12px 26px;text-decoration:none;min-height:44px}
.cta:hover{background:var(--sand);color:#0b0d0a}
.grid{list-style:none;padding:0;display:grid;gap:10px;grid-template-columns:repeat(auto-fill,minmax(220px,1fr))}
.grid li{margin:0;max-width:none}.grid a{display:block;background:var(--card);border:1px solid var(--line);border-radius:10px;padding:10px 14px;text-decoration:none}
footer{padding-top:20px;padding-bottom:40px;margin-top:2rem;border-top:1px solid var(--line);color:var(--mut);font-size:.95rem}
@media (max-width:480px){h1{font-size:1.65rem}body{font-size:16px}}`;

const SECTION_TITLES = { breathing: "Breathing", foods: "Foods and herbs", recipes: "Recipes", nutrition: "Nutrition findings", light: "Light and your body clock" };

function appHref(path, id) {
  const [p, hash] = path.split("#");
  return `${p}?utm_source=guides&utm_medium=seo&utm_content=${encodeURIComponent(id)}${hash ? "#" + hash : ""}`;
}

function sourcesHtml(sources) {
  if (!sources?.length) return "";
  const items = sources.map((s) => (s.url
    ? `<li><a href="${esc(s.url)}" rel="noopener noreferrer" target="_blank">${esc(s.text)}</a></li>`
    : `<li>${esc(s.text)}</li>`)).join("");
  return `<h2>Sources</h2><ul>${items}</ul>`;
}
const listHtml = (items, tag = "ul") => (items?.length ? `<${tag}>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</${tag}>` : "");
const noteHtml = (title, items) => (items?.length ? `<aside class="note"><h2>${esc(title)}</h2>${listHtml(items)}</aside>` : "");

function page(ctx, p) {
  const url = `${ctx.siteUrl}${p.path}`;
  const title = p.title;
  const ld = (p.ld ?? []).map((o) => `<script type="application/ld+json">${ldJson(o)}</script>`).join("\n");
  const crumbs = p.crumbs.map((c) => `<a href="${esc(c.href)}">${esc(c.label)}</a>`).join(" / ");
  const cta = p.cta
    ? `<section class="cta-box" aria-labelledby="try"><h2 id="try" style="margin-top:0">Try it in ${BRAND}</h2><p>${esc(p.cta.text)}</p><a class="cta" href="${esc(appHref(p.cta.path, p.cta.id))}">${esc(p.cta.label)}</a></section>`
    : "";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(p.description)}">
<link rel="canonical" href="${esc(url)}">
<meta name="theme-color" content="#0b0d0a">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<meta property="og:type" content="${p.ogType ?? "article"}">
<meta property="og:site_name" content="${BRAND}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(p.description)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(ctx.siteUrl)}/apple-touch-icon.png">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(p.description)}">
<style>${CSS}</style>
${ld}
</head>
<body>
<header><a href="/guides/">${BRAND} guides</a><a href="${esc(appHref("/", "header"))}">Open ${BRAND}</a></header>
<main>
<nav aria-label="Breadcrumb" class="meta" style="margin-top:14px">${crumbs}</nav>
${p.body}
${cta}
<p class="meta"><strong>${DISCLAIMER}</strong> Talk to a clinician about your own health. See our <a href="/privacy">privacy policy</a> and <a href="/disclaimer">full disclaimer</a>.</p>
</main>
<footer><p>${BRAND}: evidence-rated wellness education. ${DISCLAIMER} <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a> · <a href="/disclaimer">Disclaimer</a></p></footer>
</body>
</html>
`;
}

const articleLd = (ctx, path, headline, description) => ({
  "@context": "https://schema.org", "@type": "Article", headline, description,
  mainEntityOfPage: `${ctx.siteUrl}${path}`, inLanguage: "en",
  author: { "@type": "Organization", name: BRAND }, publisher: { "@type": "Organization", name: BRAND },
  dateModified: ctx.date,
});
const faqLd = (qas) => ({
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: qas.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
});
const titleOf = (name, suffix) => {
  const tail = ` | ${BRAND}`;
  const t = `${name}: ${suffix}${tail}`;
  return t.length <= 70 ? t : clip(`${name}${tail}`, 70);
};
const descOf = (text, extra) => {
  let d = clip(text, 160);
  if (d.length < 60) d = clip(`${d} ${extra}`, 160);
  return d;
};

// ---------- page builders ----------
function breathingPages(ctx, c) {
  return c.TECHNIQUES.filter((t) => !t.custom).map((t) => {
    // The technique's internal id isn't a good public address, so the guide page uses its name.
    const path = `/guides/breathing/${t.id === "calm" ? "settle-in" : t.id}/`;
    const safety = t.gated
      ? c.POWER_SAFETY
      : ["Breathe gently and never force it. If you feel light-headed or uncomfortable, stop and go back to normal breathing.", "Pregnant, or living with a heart or lung condition, panic attacks or fainting? Check with your clinician before trying breath holds or long pauses."];
    const steps = t.cycle.map((p) => `${p.say}: ${p.secs} seconds`);
    const rounds = t.rounds ? `<p>Rounds: ${t.rounds.count} rounds of ${t.rounds.breaths} deep breaths, followed by a breath hold of up to ${t.rounds.maxHold} seconds and a ${t.rounds.recoveryHold}-second recovery hold.</p>` : "";
    const faq = [
      [`What is ${t.name}?`, `${t.short}. ${t.when}`],
      [`How does ${t.name} work?`, t.why],
      [`Is ${t.name} safe?`, safety.join(" ")],
    ];
    const description = descOf(`${t.name} (${t.short}): ${t.when} ${t.why}`, "Evidence rating, steps and safety notes.");
    const body = `<h1>${esc(t.name)} breathing guide</h1>
<p><span class="badge">${esc(evLabel(t.evidence))}</span><span class="badge">${esc(t.short)}</span></p>
<p class="lede">${esc(t.when)}</p>
<h2>How to do it</h2><ol>${steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
<p>Repeat the cycle until time is up.${t.minutes.length ? ` Sessions in the app run ${esc(t.minutes.join(", "))} minutes.` : ""}</p>${rounds}
<h2>What the research says</h2><p>${esc(t.why)}</p>
${noteHtml("Safety first", safety)}
${sourcesHtml(t.sources)}`;
    return {
      type: "breathing", id: t.id, label: t.name, path, title: titleOf(t.name, "how it works & evidence"), description,
      crumbs: [{ href: "/guides/", label: "Guides" }, { href: "/guides/#breathing", label: "Breathing" }],
      body, ld: [articleLd(ctx, path, `${t.name} breathing guide`, description), faqLd(faq)],
      cta: { path: "/breathe", id: t.id === "calm" ? "settle-in" : t.id, label: `Try \u201c${t.name}\u201d in ${BRAND}`, text: "Follow a guided pacer with timing cues, in the app." },
    };
  });
}

function foodPages(ctx, c) {
  const usedBy = new Map();
  for (const r of c.RECIPES) for (const i of r.ingredients) if (i.pantryId) (usedBy.get(i.pantryId) ?? usedBy.set(i.pantryId, []).get(i.pantryId)).push(r);
  return c.PANTRY.map((f) => {
    const path = `/guides/foods/${f.id}/`;
    const description = descOf(`${f.name}${f.also ? ` (${f.also})` : ""}: ${f.summary} Evidence rating, how to use it and who should check first.`, "Evidence and cautions.");
    const recs = usedBy.get(f.id) ?? [];
    const body = `<h1>${esc(f.name)}: what the research says</h1>
<p><span class="badge">${esc(evLabel(f.evidence))}</span><span class="badge">${esc(c.CAT_LABEL[f.cat] ?? f.cat)}</span></p>
<p class="lede">${esc(f.summary)}${f.also ? ` <span class="meta">Also known as ${esc(f.also)}.</span>` : ""}</p>
<h2>What the research says</h2>${listHtml(f.benefits)}
${f.tradition ? `<h2>In tradition</h2><p>${esc(f.tradition)}</p><p class="meta">Traditional use is not the same as proven effect.</p>` : ""}
<h2>How to use it</h2><p>${esc(f.use)}</p>
${noteHtml("Check first", f.cautions)}
<h2>Where to find it</h2><p>${esc(f.find)}</p>
${recs.length ? `<h2>Recipes that use it</h2><ul>${recs.map((r) => `<li><a href="/guides/recipes/${esc(r.id)}/">${esc(r.title)}</a></li>`).join("")}</ul>` : ""}
${sourcesHtml(f.sources)}`;
    const faq = [[`What are the cautions for ${f.name}?`, f.cautions.join(" ")], [`What does the research say about ${f.name}?`, f.benefits.join(" ")]];
    return {
      type: "foods", id: f.id, label: f.name, path, title: titleOf(f.name, "evidence & cautions"), description,
      crumbs: [{ href: "/guides/", label: "Guides" }, { href: "/guides/#foods", label: "Foods" }],
      body, ld: [articleLd(ctx, path, `${f.name}: what the research says`, description), ...(f.cautions.length ? [faqLd(faq)] : [])],
      cta: { path: "/nourish#pantry", id: f.id, label: `See ${f.name} in the ${BRAND} Pantry`, text: "Browse the full evidence-rated Pantry and build a shopping list." },
    };
  });
}

function recipePages(ctx, c) {
  return c.RECIPES.map((r) => {
    const path = `/guides/recipes/${r.id}/`;
    const description = descOf(`${r.title}: ${r.blurb} ${r.minutes} minutes, serves ${r.serves}. Ingredients, steps and the evidence behind it.`, "Simple, plant-forward recipe.");
    const ing = r.ingredients.map((i) => {
      const name = i.pantryId ? `<a href="/guides/foods/${esc(i.pantryId)}/">${esc(i.name)}</a>` : esc(i.name);
      return `<li>${esc(i.amount)} ${name}</li>`;
    }).join("");
    const tags = r.tags.map((t) => `<span class="badge">${esc(c.TAG_LABEL[t] ?? t)}</span>`).join("");
    const body = `<h1>${esc(r.title)}</h1>
<p><span class="badge">${esc(evLabel(r.why.evidence))}</span>${tags}</p>
<p class="lede">${esc(r.blurb)}</p>
<p class="meta">${esc(r.minutes)} minutes${r.wait ? `, ${esc(r.wait)}` : ""} · serves ${esc(r.serves)}${r.allergens.length ? ` · contains: ${esc(r.allergens.map((a) => c.ALLERGEN_LABEL[a] ?? a).join(", "))}` : ""}</p>
<h2>Ingredients</h2><ul>${ing}</ul>
<h2>Steps</h2>${listHtml(r.steps, "ol")}
${r.swaps?.length ? `<h2>Swaps</h2>${listHtml(r.swaps)}` : ""}
<h2>Why it's here</h2><p>${esc(r.why.text)}</p>
${noteHtml("Good to know", r.cautions)}
${sourcesHtml(r.why.sources)}`;
    const ld = {
      "@context": "https://schema.org", "@type": "Recipe", name: r.title, description: r.blurb,
      recipeYield: `${r.serves} serving${r.serves === 1 ? "" : "s"}`, totalTime: mins(r.minutes), cookTime: mins(r.minutes),
      recipeIngredient: r.ingredients.map((i) => `${i.amount} ${i.name}`),
      recipeInstructions: r.steps.map((s) => ({ "@type": "HowToStep", text: s })),
      keywords: r.tags.map((t) => c.TAG_LABEL[t] ?? t).join(", "),
      author: { "@type": "Organization", name: BRAND }, mainEntityOfPage: `${ctx.siteUrl}${path}`,
    };
    return {
      type: "recipes", id: r.id, label: r.title, path, title: titleOf(r.title, "recipe & evidence"), description,
      crumbs: [{ href: "/guides/", label: "Guides" }, { href: "/guides/#recipes", label: "Recipes" }],
      body, ld: [ld], cta: { path: "/nourish#recipes", id: r.id, label: `Save this recipe in ${BRAND}`, text: "Add the ingredients to a shopping list and cook along in the app." },
    };
  });
}

function nutritionPages(ctx, c) {
  return c.FINDINGS.map((f) => {
    const path = `/guides/nutrition/${f.id}/`;
    const description = descOf(`${f.title}: ${f.body}`, "Evidence rating and a simple way to start.");
    const body = `<h1>${esc(f.title)}</h1>
<p><span class="badge">${esc(evLabel(f.evidence))}</span></p>
<p class="lede"><strong>${esc(f.stat)}</strong> ${esc(f.statLabel)}</p>
<h2>What the research says</h2><p>${esc(f.body)}</p>
<h2>A simple way to start</h2><p>${esc(f.doThis)}</p>
${sourcesHtml([f.source])}`;
    return {
      type: "nutrition", id: f.id, label: f.title, path, title: titleOf(f.title, "the evidence"), description,
      crumbs: [{ href: "/guides/", label: "Guides" }, { href: "/guides/#nutrition", label: "Nutrition" }],
      body, ld: [articleLd(ctx, path, f.title, description)],
      cta: { path: "/nourish", id: f.id, label: `Explore Nourish in ${BRAND}`, text: "See the evidence-rated Pantry, recipes and plate guide." },
    };
  });
}

function lightPages(ctx, c) {
  return c.LIGHT_FINDINGS.map((f) => {
    const path = `/guides/light/${f.id}/`;
    const description = descOf(`${f.title}: ${f.body}`, "Evidence rating and safety notes.");
    const body = `<h1>${esc(f.title)}</h1>
<p><span class="badge">${esc(evLabel(f.rating))}</span></p>
<p class="lede"><strong>${esc(f.stat)}</strong> ${esc(f.statLabel)}</p>
<h2>What the research says</h2><p>${esc(f.body)}</p>
<h2>A simple way to start</h2><p>${esc(f.doThis)}</p>
${noteHtml("Safety first", c.LIGHT_SAFETY)}
${sourcesHtml(f.source ? [f.source] : [])}`;
    return {
      type: "light", id: f.id, label: f.title, path, title: titleOf(f.title, "the evidence"), description,
      crumbs: [{ href: "/guides/", label: "Guides" }, { href: "/guides/#light", label: "Light" }],
      body, ld: [articleLd(ctx, path, f.title, description)],
      cta: { path: "/light", id: f.id, label: `Explore Light in ${BRAND}`, text: "Learn how light shapes sleep, mood and energy, in the app." },
    };
  });
}

function indexPage(ctx, pages) {
  const path = "/guides/";
  const description = "Evidence-rated guides to breathing techniques, foods and herbs, recipes and light. Plain-language summaries with sources and safety notes.";
  const sections = Object.keys(SECTION_TITLES).map((k) => {
    const items = pages.filter((p) => p.type === k);
    if (!items.length) return "";
    return `<h2 id="${k}">${esc(SECTION_TITLES[k])}</h2><ul class="grid">${items.map((p) => `<li><a href="${esc(p.path)}">${esc(p.label)}</a></li>`).join("")}</ul>`;
  }).join("\n");
  const body = `<h1>${BRAND} guides: wellness research in plain language</h1>
<p class="lede">Each guide rates the evidence honestly (strong, moderate, mixed or early), links its sources and lists who should check with a clinician first.</p>
${sections}`;
  return {
    type: "index", id: "index", label: "Guides", path, title: `${BRAND} guides: evidence-rated wellness education`, description, ogType: "website",
    crumbs: [{ href: "/", label: BRAND }],
    body, ld: [{ "@context": "https://schema.org", "@type": "CollectionPage", name: `${BRAND} guides`, description, url: `${ctx.siteUrl}${path}` }],
    cta: { path: "/", id: "index", label: `Open ${BRAND}`, text: "Breathe, nourish, move and rest with evidence-rated practices." },
  };
}

// ---------- main ----------
export async function buildSeo({ outDir, siteUrl = process.env.SITE_URL || DEFAULT_SITE, clean = true } = {}) {
  if (!outDir) throw new Error("buildSeo: outDir is required");
  siteUrl = siteUrl.replace(/\/+$/, "");
  const ctx = { siteUrl, date: new Date().toISOString().slice(0, 10) };
  const c = await loadContent();
  const pages = [...breathingPages(ctx, c), ...foodPages(ctx, c), ...recipePages(ctx, c), ...nutritionPages(ctx, c), ...lightPages(ctx, c)];
  const all = [indexPage(ctx, pages), ...pages];
  if (clean) rmSync(join(outDir, "guides"), { recursive: true, force: true });
  for (const p of all) {
    const file = join(outDir, p.path, "index.html");
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, page(ctx, p));
  }
  const urls = [...APP_PATHS, ...all.map((p) => p.path)];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${esc(siteUrl + u)}</loc><lastmod>${ctx.date}</lastmod></url>`).join("\n")}\n</urlset>\n`;
  writeFileSync(join(outDir, "sitemap.xml"), sitemap);
  writeFileSync(join(outDir, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
  const counts = {};
  for (const p of all) counts[p.type] = (counts[p.type] ?? 0) + 1;
  return { pages: all.map((p) => ({ type: p.type, id: p.id, path: p.path })), counts, urls };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const outDir = process.env.SEO_OUT_DIR || join(ROOT, "dist");
  const r = await buildSeo({ outDir });
  console.log(`SEO: wrote ${r.pages.length} guide pages to ${outDir}/guides`, r.counts);
}
