import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Aurora, Reveal, ZoomPage } from "../rooted/motion";
import { Evidence, SourceLink } from "../rooted/ui";
import { BarcodeScanner } from "../rooted/BarcodeScanner";
import { ADDITIVES, TIERS, TIER_ORDER, additiveById, searchAdditives, tierInfo, tierOf, type Additive, type Tier } from "../rooted/additivesContent";
import { isValidBarcode, lookupBarcode, similarProducts, type Product } from "../rooted/foodLookup";
import { NOVA_LABEL, VERDICT_LABEL, assess, compare, isBetterChoice, nutrientRows, nutritionReason, overallLabel, type Assessment, type Verdict } from "../rooted/productVerdict";
import { useScanHistory, useScans } from "../store/scans";
import { ALLERGENS, allergenHits, allergenLabel } from "../rooted/allergens";
import { TEXT_PRODUCT_CODE, productFromIngredients } from "../rooted/ingredientParse";
import { eNumber } from "../rooted/eNumbers";
import { useAllergenStore, useWatchedAllergens } from "../store/allergens";
import { Sheet } from "../rooted/ui";
import { CheckIcon, FunctionIcon, RiskIcon, functionInfo } from "../rooted/AdditiveArt";
import { useAbout } from "../store/wellness";
import { Footer } from "../components/Footer";
import { Icon } from "../components/Icon";
import "../rooted/rooted.css";
import "./Scan.css";

const COUNT_WORDS: Record<Tier, string> = { restricted: "restricted by regulators", notable: "with notable concern", some: "with some concern", minor: "with minor concern", clear: "with nothing flagged" };
const EFSA = "https://www.efsa.europa.eu/en/topics/topic/food-additives";

type State =
  | { s: "idle" }
  | { s: "loading" }
  | { s: "result"; product: Product }
  | { s: "error"; reason: "invalid" | "notfound" | "network" };

const ERRORS: Record<"invalid" | "notfound" | "network", string> = {
  invalid: "That doesn't look like a barcode number. Check the digits under the bars and try again.",
  notfound: "We couldn't find this product. Open Food Facts is built by volunteers, so some products are missing. Check the ingredient list on the pack.",
  network: "We couldn't reach the product database. Check your connection and try again.",
};

const SHAPES: Record<(typeof TIERS)[number]["shape"], string> = {
  circle: "M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2Z",
  triangle: "M8 2l6.4 11.2H1.6L8 2Z",
  diamond: "M8 1.2l6.8 6.8L8 14.8 1.2 8 8 1.2Z",
  square: "M3 2.6h10a.4.4 0 0 1 .4.4v10a.4.4 0 0 1-.4.4H3a.4.4 0 0 1-.4-.4V3a.4.4 0 0 1 .4-.4Z",
  octagon: "M5.2 1.6h5.6l3.6 3.6v5.6l-3.6 3.6H5.2l-3.6-3.6V5.2l3.6-3.6Z",
};

/** The shape and colour of a step on the risk scale. The word is always shown next to it. */
function TierShape({ tier }: { tier: Tier }) {
  const t = tierInfo(tier);
  return <svg className="tier__shape" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d={SHAPES[t.shape]} fill={t.color} /></svg>;
}

function TierBadge({ a, short = false }: { a: Additive; short?: boolean }) {
  const tier = tierOf(a);
  const t = tierInfo(tier);
  return (
    <span className={`tier tier--${tier}`} style={{ "--tc": t.color } as React.CSSProperties}>
      <TierShape tier={tier} />
      <span>{short ? t.short : t.label}</span>
    </span>
  );
}

/** The scale, worst to best, for anyone who wants to know what the shapes mean. */
function TierLegend() {
  return (
    <ul className="tlegend" aria-label="What the shapes and colours mean">
      {TIERS.map((t) => (
        <li key={t.id}>
          <TierShape tier={t.id} />
          <span><strong>{t.label}.</strong> {t.means}</span>
        </li>
      ))}
    </ul>
  );
}

const TONE: Record<Verdict, string> = { good: "little", fair: "some", poor: "restricted" };
function Badge({ v, label }: { v: Verdict; label?: string }) {
  return <span className={`lvl lvl--${TONE[v]}`}>{label ?? VERDICT_LABEL[v]}</span>;
}

function split(p: Product) {
  const known: Additive[] = [];
  const unknown: string[] = [];
  for (const id of p.additives) {
    const a = additiveById(id);
    if (a) known.push(a);
    else unknown.push(id.toUpperCase());
  }
  known.sort((x, y) => TIER_ORDER[tierOf(x)] - TIER_ORDER[tierOf(y)] || x.code.localeCompare(y.code, undefined, { numeric: true }));
  return { known, unknown };
}

function Row({ a, forYou, onOpen }: { a: Additive; forYou: boolean; onOpen(): void }) {
  return (
    <li className="addi">
      <button className="addi__head" onClick={onOpen} aria-haspopup="dialog">
        <span className="addi__name"><strong>{a.name}</strong><small>{a.code} · {a.kind}{forYou ? " · for you" : ""}</small></span>
        <TierBadge a={a} short />
        <Icon name="chevronRight" size={18} className="addi__caret" />
      </button>
    </li>
  );
}

/** One additive on its own page: what it does, what the research flags, and where that comes from. */
function AdditiveSheet({ a, list, backLabel, forYou, onClose, onMethod, onGo }: { a: Additive | null; list: Additive[]; backLabel: string; forYou: boolean; onClose(): void; onMethod(): void; onGo(next: Additive): void }) {
  const fn = a ? functionInfo(a.kind) : null;
  const i = a ? list.findIndex((x) => x.id === a.id) : -1;
  const prev = i > 0 ? list[i - 1] : null;
  const next = i >= 0 && i < list.length - 1 ? list[i + 1] : null;
  const root = useRef<HTMLDivElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);

  const go = (to: Additive | null) => {
    if (!to) return;
    onGo(to);
    // Back to the top of the next page.
    window.setTimeout(() => root.current?.closest<HTMLElement>(".sheet__panel")?.scrollTo({ top: 0 }), 0);
  };

  return (
    <Sheet open={!!a} onClose={onClose} label={a ? `${a.name}, additive` : "Additive"} wide>
      {a && fn && (
        <div
          className="apage"
          ref={root}
          onTouchStart={(e) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }}
          onTouchEnd={(e) => {
            const t0 = touch.current;
            touch.current = null;
            if (!t0 || list.length < 2) return;
            const dx = e.changedTouches[0].clientX - t0.x;
            const dy = e.changedTouches[0].clientY - t0.y;
            // A clear sideways swipe, not a scroll. Scrolling the tile row doesn't count.
            if (Math.abs(dx) > 70 && Math.abs(dy) < 40 && !(e.target as HTMLElement).closest(".arisk")) go(dx < 0 ? next : prev);
          }}
        >
          <nav className="apage__nav" aria-label="Additive navigation">
            <button className="apage__back" onClick={onClose}><Icon name="chevronLeft" size={18} /> {backLabel}</button>
            {list.length > 1 && (
              <span className="apage__step">
                <button onClick={() => go(prev)} disabled={!prev} aria-label={prev ? `Previous: ${prev.name}` : "No previous additive"}><Icon name="chevronLeft" size={18} /></button>
                <span>{i + 1} of {list.length}</span>
                <button onClick={() => go(next)} disabled={!next} aria-label={next ? `Next: ${next.name}` : "No next additive"}><Icon name="chevronRight" size={18} /></button>
              </span>
            )}
          </nav>
          <header className="apage__head">
            <span className="apage__code">{a.code}</span>
            <h2>{a.name}</h2>
            {a.also && <p className="apage__also">Also written: {a.also}</p>}
            <p className="apage__tags"><TierBadge a={a} /> {forYou && <span className="addi__flag">For you</span>}</p>
            <p className="apage__means">{tierInfo(tierOf(a)).means}</p>
          </header>

          <div className="afun">
            <span className="afun__icon"><FunctionIcon kind={a.kind} /></span>
            <div>
              <strong>{fn.label}</strong>
              <p>{fn.does}</p>
            </div>
          </div>

          <h3 className="apage__h">Potential associated risks</h3>
          <ul className="arisk" aria-label="Potential associated risks">
            {a.topics.length === 0 && (
              <li className="arisk__tile arisk__tile--ok">
                <span className="arisk__icon"><CheckIcon /></span>
                <span>No safety concern found by regulators</span>
              </li>
            )}
            {a.topics.map((t) => (
              <li key={t} className="arisk__tile">
                <span className="arisk__icon"><RiskIcon topic={t} /></span>
                <span>{t}</span>
              </li>
            ))}
          </ul>

          {a.evidence === "None" ? (
            <p className="apage__ev"><span className="lvl lvl--little">Nothing flagged</span> <span>The reviews and studies we checked found no support for a safety concern at the amounts allowed in food.</span></p>
          ) : (
            <p className="apage__ev"><Evidence s={a.evidence} /> <span>for the concern. This says how well studies support it, not how big the effect is.</span></p>
          )}

          <p className="apage__summary">{a.summary}</p>
          <h3 className="apage__h">What the research found</h3>
          <ul className="apage__list">{a.research.map((r) => <li key={r}>{r}</li>)}</ul>
          {a.careIf && <p className="apage__care"><strong>Who may want to take care:</strong> {a.careIf}{forYou && <em> This is one to look at more closely for you.</em>}</p>}
          <p className="apage__reg"><strong>Rules:</strong> {a.regulation}</p>

          <div className="alinks">
            <details>
              <summary>Where you'll find it</summary>
              <p>{a.found}</p>
            </details>
            <details>
              <summary>Scientific sources <small>({a.sources.length})</small></summary>
              <ul className="addi__src">{a.sources.map((s) => <li key={s.text}><SourceLink s={s} /></li>)}</ul>
            </details>
            <button onClick={() => { onClose(); window.setTimeout(onMethod, 120); }}>Methodology <Icon name="chevronRight" size={16} /></button>
          </div>
          {(prev || next) && (
            <div className="apage__more">
              {prev ? <button onClick={() => go(prev)}><small>Previous</small><strong>{prev.name}</strong></button> : <span />}
              {next ? <button onClick={() => go(next)}><small>Next</small><strong>{next.name}</strong></button> : <span />}
            </div>
          )}
          <p className="apage__fine">Wellness education, not medical advice. A concern is not proof of harm: many people eat these at levels regulators consider acceptable.</p>
        </div>
      )}
    </Sheet>
  );
}

/** The product being looked at survives leaving the page and coming back (this visit only). */
const LAST_KEY = "rooted.scan.last";
function readLast(): Product | null {
  try {
    const raw = sessionStorage.getItem(LAST_KEY);
    const p = raw ? (JSON.parse(raw) as Product) : null;
    return p && typeof p.code === "string" && Array.isArray(p.additives) ? p : null;
  } catch {
    return null;
  }
}
function writeLast(p: Product): void {
  try {
    sessionStorage.setItem(LAST_KEY, JSON.stringify(p));
  } catch {
    /* private mode: the page just won't remember */
  }
}

function histLabel(p: Product): string {
  const { known, unknown } = split(p);
  return overallLabel(assess(p, known, unknown.length));
}

const METHOD_SOURCES = [
  { text: "UK front-of-pack nutrition labelling guidance (2016): the low, medium and high cut-offs", url: "https://www.gov.uk/government/publications/front-of-pack-nutrition-labelling-guidance" },
  { text: "Two dimensions of nutritional value: Nutri-Score and NOVA (Nutrients, 2021)", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8399905/" },
  { text: "Open Food Facts: where product data comes from", url: "https://world.openfoodfacts.org" },
];

function Method({ open, onClose }: { open: boolean; onClose(): void }) {
  return (
    <Sheet open={open} onClose={onClose} label="How we rate products" wide>
      <div className="method">
        <h2>How we rate products</h2>
        <p>Every product gets a short verdict, <strong>few concerns</strong>, <strong>some concerns</strong> or <strong>several concerns</strong>. It is built from two parts, and the product is only as good as its weakest part.</p>
        <h3>The risk scale</h3>
        <p>Every additive sits on a five-step scale. Each step has its own colour and shape, so you can read it at a glance, even without colour.</p>
        <TierLegend />
        <h3>1. Additives</h3>
        <ul>
          <li><strong>Several concerns:</strong> any additive that regulators have restricted, or three or more with some research concern.</li>
          <li><strong>Some concerns:</strong> one or two additives with some research concern.</li>
          <li><strong>Few concerns:</strong> none of those. If some of a product's additives aren't reviewed here yet, or it has no nutrition facts, we say "few concerns so far".</li>
        </ul>
        <p>Each additive's level comes from regulator reviews and published studies, shown in full on its page with the strength of the evidence. We only describe additives we can back with a source. Others show as "not reviewed here yet" and are left out of the verdict.</p>
        <h3>2. Nutrition</h3>
        <p>Sugars, saturated fat, salt and fat are sorted into low, medium or high per 100 g (per 100 ml for drinks) using the UK traffic-light cut-offs:</p>
        <table className="method__table">
          <thead><tr><th></th><th>Low up to</th><th>High above</th><th>Drinks: low up to</th><th>Drinks: high above</th></tr></thead>
          <tbody>
            <tr><th>Sugars</th><td>5 g</td><td>22.5 g</td><td>2.5 g</td><td>11.25 g</td></tr>
            <tr><th>Saturated fat</th><td>1.5 g</td><td>5 g</td><td>0.75 g</td><td>2.5 g</td></tr>
            <tr><th>Salt</th><td>0.3 g</td><td>1.5 g</td><td>0.3 g</td><td>0.75 g</td></tr>
            <tr><th>Fat</th><td>3 g</td><td>17.5 g</td><td>1.5 g</td><td>8.75 g</td></tr>
          </tbody>
        </table>
        <ul>
          <li><strong>Several concerns:</strong> a Nutri-Score of E, or two or more "high" nutrients.</li>
          <li><strong>Some concerns:</strong> a Nutri-Score of D, or one "high" nutrient.</li>
          <li><strong>Few concerns:</strong> otherwise.</li>
        </ul>
        <p>We don't judge calories, as the UK guidance doesn't either. Fibre is shown as a plus when a product is a source of it (3 g or more per 100 g). The NOVA group says how processed a food is. It is shown for information and isn't part of the verdict.</p>
        <h3>What a verdict does not mean</h3>
        <ul>
          <li>It is not medical advice, and it is not a judgement of your whole diet. Most foods are fine in the right amount.</li>
          <li>A concern is not proof of harm. We say how strong the research is, and leave the choice to you.</li>
          <li>Product data comes from volunteers and can be wrong or missing. The pack is the final word.</li>
          <li>Better choices come from popular products in the same category in the database. They are not paid placements.</li>
        </ul>
        <ul className="addi__src">{METHOD_SOURCES.map((x) => <li key={x.text}><SourceLink s={x} /></li>)}</ul>
      </div>
    </Sheet>
  );
}

function NutritionCard({ p }: { p: Product }) {
  const rows = nutrientRows(p.nutrition, p.isDrink);
  const unit = p.isDrink ? "100 ml" : "100 g";
  const groups: Array<[string, typeof rows]> = [
    ["Negatives", rows.filter((r) => r.level === "high")],
    ["In between", rows.filter((r) => r.level === "medium")],
    ["Positives", rows.filter((r) => r.level === "low")],
  ];
  const any = rows.length > 0 || p.grade || p.nova;
  return (
    <div className="r-card scan__nutri">
      <h3>Nutrition <small>per {unit}</small></h3>
      {!any && <p className="scan__muted">The database has no nutrition facts for this product yet. The pack has them.</p>}
      {nutritionReason(p) && <p className="scan__muted">{nutritionReason(p)}</p>}
      {groups.map(([title, list]) => list.length > 0 && (
        <div key={title} className="nutri__group">
          <h4>{title}</h4>
          <ul>
            {list.map((r) => (
              <li key={r.id}>
                <span className={`dot dot--${r.level}`} aria-hidden="true" />
                <span className="nutri__name"><strong>{r.label}</strong><small>{r.note}</small></span>
                <span className="nutri__val">{r.value} {r.unit}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
      {p.nutrition?.kcal !== undefined && <p className="scan__muted">Energy: {p.nutrition.kcal} kcal per {unit} (not rated).</p>}
      <div className="nutri__chips">
        {p.grade && <span className="chip">Nutri-Score {p.grade.toUpperCase()}</span>}
        {p.nova && <span className="chip">NOVA {p.nova}: {NOVA_LABEL[p.nova]}</span>}
      </div>
    </div>
  );
}

export default function Scan() {
  const about = useAbout();
  const history = useScanHistory();
  const addScan = useScans((s) => s.add);
  const clearScans = useScans((s) => s.clear);
  const [state, setState] = useState<State>(() => {
    const last = readLast();
    return last ? { s: "result", product: last } : { s: "idle" };
  });
  const [scanning, setScanning] = useState(false);
  const [method, setMethod] = useState(false);
  const [number, setNumber] = useState("");
  const [active, setActive] = useState<{ a: Additive; list: Additive[]; from: string } | null>(null);
  const [q, setQ] = useState("");
  const [alts, setAlts] = useState<Array<{ p: Product; a: Assessment; n: number }> | null>(null);
  const [textOpen, setTextOpen] = useState(false);
  const [text, setText] = useState("");
  const watched = useWatchedAllergens();
  const toggleAllergen = useAllergenStore((s) => s.toggle);

  const show = useCallback(
    (product: Product, remember = true) => {
      setState({ s: "result", product });
      writeLast(product);
      setNumber(product.code === TEXT_PRODUCT_CODE ? "" : product.code);
      if (remember && product.code !== TEXT_PRODUCT_CODE) {
        const { known, unknown } = split(product);
        addScan({ code: product.code, verdict: assess(product, known, unknown.length).overall, product });
      }
      window.setTimeout(() => document.querySelector(".scan__result")?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
    },
    [addScan],
  );

  const run = useCallback(
    async (code: string) => {
      setScanning(false);
      setNumber(code);
      setState({ s: "loading" });
      const r = await lookupBarcode(code);
      if (r.ok) show(r.product);
      else setState({ s: "error", reason: r.reason });
    },
    [show],
  );

  const forYou = (a: Additive) => !!a.careFlags?.some((f) => about.considerations.includes(f));

  const found = useMemo(() => (state.s === "result" ? split(state.product) : null), [state]);
  const result = useMemo(() => (state.s === "result" && found ? assess(state.product, found.known, found.unknown.length) : null), [state, found]);

  // Better choices: popular products from the same category that rate better than this one.
  const code = state.s === "result" ? state.product.code : null;
  const category = state.s === "result" ? state.product.category : undefined;
  useEffect(() => {
    setAlts(null);
    if (!code || !category || state.s !== "result") return;
    let cancelled = false;
    const mine = result;
    similarProducts(category).then((list) => {
      if (cancelled || !mine) return;
      const scored = list
        .filter((x) => x.code !== code)
        .map((x) => {
          const sp = split(x);
          return { p: x, a: assess(x, sp.known, sp.unknown.length), n: sp.known.filter((a) => a.level !== "little").length };
        })
        // Only suggest products with something to go on, and that really rate better.
        .filter((x) => (x.p.nutrition || x.p.grade) && isBetterChoice(x.a, mine))
        .sort((x, y) => compare(x.a, x.n, y.a, y.n));
      setAlts(scored.slice(0, 3));
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, category]);

  const counts = found
    ? TIERS.map((t) => [t.id, found.known.filter((a) => tierOf(a) === t.id).length] as const).filter(([, n]) => n > 0)
    : [];
  const browse = useMemo(() => searchAdditives(q).slice().sort((a, b) => TIER_ORDER[tierOf(a)] - TIER_ORDER[tierOf(b)] || a.code.localeCompare(b.code, undefined, { numeric: true })), [q]);
  const canLookup = isValidBarcode(number) && state.s !== "loading";
  const total = found ? found.known.length + found.unknown.length : 0;

  return (
    <ZoomPage className="rooted scan">
      <header className="sec-hero scan__hero">
        <Aurora />
        <div className="sec-hero__text">
          <motion.span className="rooted__eyebrow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>Rooted · Nourish</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.7 }}>What's in it?</motion.h1>
          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26, duration: 0.7 }}>
            Scan a product's barcode to see the additives in it, what the research says about each one, how it rates on sugar, salt and fat, and better choices.
          </motion.p>
          <motion.div className="scan__cta" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34, duration: 0.7 }}>
            <button className="btn btn--primary btn--big" onClick={() => setScanning(true)}><Icon name="barcode" size={22} /> Scan a barcode</button>
            <form className="scan__type" onSubmit={(e) => { e.preventDefault(); if (canLookup) void run(number); }}>
              <label htmlFor="barcode" className="visually-hidden">Barcode number</label>
              <input id="barcode" inputMode="numeric" autoComplete="off" placeholder="Or type the number" value={number} onChange={(e) => setNumber(e.target.value.replace(/[^\d\s]/g, ""))} />
              <button className="btn btn--secondary" type="submit" disabled={!canLookup}>Look up</button>
            </form>
            <button className="scan__link" onClick={() => setTextOpen((o) => !o)} aria-expanded={textOpen}>No barcode? Check an ingredient list</button>
            {textOpen && (
              <form className="scan__text" onSubmit={(e) => { e.preventDefault(); if (text.trim()) show(productFromIngredients(text), false); }}>
                <label htmlFor="ingredients" className="visually-hidden">Ingredient list</label>
                <textarea id="ingredients" rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste or type the ingredients, for example: Water, sugar, caramel colour, sodium benzoate, E330" />
                <p className="scan__muted">On an iPhone, tap the box, then the camera button or &quot;Scan Text&quot; above the keyboard, and point it at the ingredient list. Nothing leaves your phone.</p>
                <button className="btn btn--secondary" type="submit" disabled={!text.trim()}>Check these ingredients</button>
              </form>
            )}
          </motion.div>
        </div>
      </header>

      <section className="sec-block scan__watch">
        <details>
          <summary>Allergens to flag: {watched.length ? watched.map(allergenLabel).join(", ") : "none set"}</summary>
          <p className="scan__muted">Pick the ones you avoid. Scans will say when a product contains them, or may contain traces. Saved on this device only.</p>
          <div className="scan__chips" role="group" aria-label="Allergens to flag">
            {ALLERGENS.map((a) => (
              <button key={a.id} className={`chip ${watched.includes(a.id) ? "is-on" : ""}`} aria-pressed={watched.includes(a.id)} onClick={() => toggleAllergen(a.id)}>{a.label}</button>
            ))}
          </div>
        </details>
      </section>

      <section className="sec-block scan__result" aria-live="polite">
        {state.s === "loading" && <p className="scan__status">Looking it up…</p>}
        {state.s === "error" && (
          <>
            <p className="scan__status scan__status--error" role="alert">{ERRORS[state.reason]}</p>
            {state.reason === "notfound" && <button className="scan__link" onClick={() => setTextOpen(true)}>Type in the ingredient list instead</button>}
          </>
        )}
        {state.s === "result" && found && result && (
          <Reveal>
            {(() => {
              const hit = allergenHits(watched, state.product);
              if (!hit.contains.length && !hit.traces.length) return null;
              return (
                <div className="r-card scan__allergy" role="alert">
                  {hit.contains.length > 0 && <p><strong>Contains {hit.contains.map(allergenLabel).join(", ").toLowerCase()}.</strong> That is on your list.</p>}
                  {hit.traces.length > 0 && <p><strong>May contain traces of {hit.traces.map(allergenLabel).join(", ").toLowerCase()}.</strong> That is on your list.</p>}
                  <p className="scan__muted">Always read the pack. The database can be wrong or out of date.</p>
                </div>
              );
            })()}
            <div className="r-card scan__product">
              {state.product.image && <img src={state.product.image} alt="" width={88} height={88} loading="lazy" />}
              <div>
                <h2>{state.product.name}</h2>
                {(state.product.brand || state.product.quantity) && <p className="scan__brand">{[state.product.brand, state.product.quantity].filter(Boolean).join(" · ")}</p>}
                <p className="scan__verdict"><Badge v={result.overall} label={overallLabel(result)} /></p>
                <p className="scan__count">
                  {result.nutrition ? `Additives: ${VERDICT_LABEL[result.additives].toLowerCase()}. Nutrition: ${VERDICT_LABEL[result.nutrition].toLowerCase()}.` : `Additives: ${VERDICT_LABEL[result.additives].toLowerCase()}. ${state.product.code === TEXT_PRODUCT_CODE ? "Nutrition isn't checked for an ingredient list." : "No nutrition facts in the database."}`}
                  {result.partial && " Some additives aren't reviewed here yet, so this covers the ones we know."}{result.overall === "good" && !result.complete && !result.partial && " It has no nutrition facts to check, so this covers the additives only."}
                </p>
                {state.product.allergens.length > 0 && <p className="scan__muted">Allergens listed: {state.product.allergens.map(allergenLabel).join(", ").toLowerCase()}.</p>}
                <button className="scan__link" onClick={() => setMethod(true)}>How we rate</button>
              </div>
            </div>

            <div className="r-card scan__additives">
              <h3>Additives <small>{total === 0 ? "none listed" : `${total} listed`}</small></h3>
              {total === 0 && <p className="scan__muted">No additives are listed for this product. The database can be incomplete, so check the label.</p>}
              {counts.length > 0 && <p className="scan__muted">{counts.map(([l, n]) => `${n} ${COUNT_WORDS[l]}`).join(", ")}.</p>}
              {found.known.length > 0 && <ul className="addi-list">{found.known.map((a) => <Row key={a.id} a={a} forYou={forYou(a)} onOpen={() => setActive({ a, list: found.known, from: state.s === "result" ? state.product.name : "Back" })} />)}</ul>}
              {(state.product.notes?.length ?? 0) > 0 && (
                <p className="scan__muted scan__unknown">
                  Also on the label: <strong>{state.product.notes!.join("; ")}</strong>. The label doesn't say which one, so we can't rate it. Look up the types in the guide below.
                </p>
              )}
              {found.unknown.length > 0 && (
                <p className="scan__muted scan__unknown">
                  Not reviewed here yet:
                  {found.unknown.map((u) => { const e = eNumber(u); return <span key={u} className="scan__enum"><strong>{u}</strong>{e ? ` ${e.name} (${e.does.toLowerCase()}${e.note ? `; ${e.note.toLowerCase()}` : ""})` : ""}</span>; })}
                  We only describe an additive when we can back it with a regulator's review or a published study. <a href={EFSA} target="_blank" rel="noreferrer">EFSA's additive pages ↗</a>
                </p>
              )}
            </div>

            <NutritionCard p={state.product} />

            {alts && alts.length > 0 && (
              <div className="r-card scan__alts">
                <h3>Better choices <small>from the same category</small></h3>
                <ul>
                  {alts.map(({ p, a, n }) => (
                    <li key={p.code}>
                      <button onClick={() => show(p)}>
                        {p.image ? <img src={p.image} alt="" width={56} height={56} loading="lazy" /> : <span className="alts__ph" aria-hidden="true" />}
                        <span className="alts__text"><strong>{p.name}</strong><small>{p.brand ?? ""}{n === 0 ? " · no flagged additives" : ""}</small></span>
                        <Badge v={a.overall} label={overallLabel(a)} />
                      </button>
                    </li>
                  ))}
                </ul>
                <p className="scan__muted">Popular products from the database that rate better by the same rules. Not paid placements.</p>
              </div>
            )}

            {state.product.ingredients && (
              <details className="scan__ingredients">
                <summary>Ingredient list</summary>
                <p>{state.product.ingredients}</p>
              </details>
            )}
            <p className="scan__fine">Product data comes from <a href="https://world.openfoodfacts.org" target="_blank" rel="noreferrer">Open Food Facts</a>, an open database built by volunteers. It can be out of date or incomplete, so the label on the pack is the final word.</p>
          </Reveal>
        )}
      </section>

      {history.length > 0 && (
        <section className="sec-block" id="history">
          <Reveal className="sec-block__head">
            <span className="rooted__eyebrow">History</span>
            <h2>Recent scans</h2>
            <p>Saved on this device only.</p>
          </Reveal>
          <ul className="hist">
            {history.map((h) => (
              <li key={h.code}>
                <button onClick={() => show(h.product, false)}>
                  {h.product.image ? <img src={h.product.image} alt="" width={48} height={48} loading="lazy" /> : <span className="alts__ph" aria-hidden="true" />}
                  <span className="alts__text"><strong>{h.product.name}</strong><small>{h.product.brand ?? ""}</small></span>
                  <Badge v={h.verdict} label={histLabel(h.product)} />
                </button>
              </li>
            ))}
          </ul>
          <button className="scan__link" onClick={() => clearScans()}>Clear history</button>
        </section>
      )}

      <section className="sec-block" id="guide">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Additive guide</span>
          <h2>Look one up</h2>
          <p>{ADDITIVES.length} common additives, each with what regulators and researchers have found. Search by name or E-number.</p>
        </Reveal>
        <details className="scan__legend">
          <summary>What the shapes and colours mean</summary>
          <TierLegend />
        </details>
        <label htmlFor="addi-search" className="visually-hidden">Search additives</label>
        <input id="addi-search" className="scan__search" type="search" placeholder="Try aspartame, E171 or red 40" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
        {browse.length ? (
          <ul className="addi-list">{browse.map((a) => <Row key={a.id} a={a} forYou={forYou(a)} onOpen={() => setActive({ a, list: browse, from: "Additive guide" })} />)}</ul>
        ) : (
          <p className="scan__status">Nothing matches that yet. Try an E-number such as E330.</p>
        )}
      </section>

      <section className="sec-block scan__about">
        <div className="r-card">
          <h2>How to read this</h2>
          <ul>
            <li><strong>A concern is not a verdict.</strong> Many people eat these additives at levels regulators consider acceptable. We show what the research found and how strong it is, and leave the choice to you.</li>
            <li><strong>Evidence labels</strong> say how well studies support a concern. "Early evidence" means limited or preliminary, not proven.</li>
            <li><strong>Rules differ by country.</strong> Something restricted in one place may be allowed in another.</li>
            <li>This is wellness education, not medical advice. If you have a health condition or allergy, <Link to="/disclaimer">talk to your clinician</Link>. <button className="scan__link" onClick={() => setMethod(true)}>How we rate</button></li>
          </ul>
        </div>
      </section>
      <Footer />
      <BarcodeScanner open={scanning} onCode={(c) => void run(c)} onClose={() => setScanning(false)} />
      <Method open={method} onClose={() => setMethod(false)} />
      <AdditiveSheet a={active?.a ?? null} list={active?.list ?? []} backLabel={active?.from ?? "Back"} forYou={active ? forYou(active.a) : false} onClose={() => setActive(null)} onMethod={() => setMethod(true)} onGo={(next) => setActive((cur) => (cur ? { ...cur, a: next } : cur))} />
    </ZoomPage>
  );
}
