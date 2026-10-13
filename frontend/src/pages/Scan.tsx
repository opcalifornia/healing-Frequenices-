import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Aurora, Reveal, ZoomPage } from "../rooted/motion";
import { Evidence, SourceLink } from "../rooted/ui";
import { BarcodeScanner } from "../rooted/BarcodeScanner";
import { ADDITIVES, LEVEL_LABEL, LEVEL_ORDER, additiveById, searchAdditives, type Additive, type ConcernLevel } from "../rooted/additivesContent";
import { isValidBarcode, lookupBarcode, type Product } from "../rooted/foodLookup";
import { useAbout } from "../store/wellness";
import { Footer } from "../components/Footer";
import { Icon } from "../components/Icon";
import "../rooted/rooted.css";
import "./Scan.css";

const COUNT_WORDS: Record<ConcernLevel, string> = { restricted: "restricted by regulators", some: "with some research concern", little: "with little concern found" };
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

function Pill({ level }: { level: ConcernLevel | "unknown" }) {
  return <span className={`lvl lvl--${level}`}>{level === "unknown" ? "Not reviewed here yet" : LEVEL_LABEL[level]}</span>;
}

function Detail({ a, forYou }: { a: Additive; forYou: boolean }) {
  return (
    <div className="addi__detail">
      <p className="addi__summary">{a.summary}</p>
      <h4>What the research found</h4>
      <ul>{a.research.map((r) => <li key={r}>{r}</li>)}</ul>
      <p className="addi__ev"><Evidence s={a.evidence} /> <span>for the concern. Evidence labels describe how well studies support it, not how big the effect is.</span></p>
      {a.careIf && <p className="addi__care"><strong>Who may want to take care:</strong> {a.careIf}{forYou && <em className="addi__you"> This is one to look at more closely for you.</em>}</p>}
      <p className="addi__reg"><strong>Rules:</strong> {a.regulation}</p>
      <ul className="addi__src">{a.sources.map((s) => <li key={s.text}><SourceLink s={s} /></li>)}</ul>
    </div>
  );
}

function Row({ a, forYou, open, onToggle }: { a: Additive; forYou: boolean; open: boolean; onToggle(): void }) {
  return (
    <li className={`addi ${open ? "is-open" : ""}`}>
      <button className="addi__head" onClick={onToggle} aria-expanded={open}>
        <span className="addi__code">{a.code}</span>
        <span className="addi__name"><strong>{a.name}</strong><small>{a.kind}</small></span>
        <Pill level={a.level} />
        {forYou && <span className="addi__flag">For you</span>}
        <Icon name="chevronDown" size={18} className="addi__caret" />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="addi__body">
            <Detail a={a} forYou={forYou} />
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export default function Scan() {
  const about = useAbout();
  const [state, setState] = useState<State>({ s: "idle" });
  const [scanning, setScanning] = useState(false);
  const [number, setNumber] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [q, setQ] = useState("");

  const run = useCallback(async (code: string) => {
    setScanning(false);
    setNumber(code);
    setOpen(null);
    setState({ s: "loading" });
    const r = await lookupBarcode(code);
    setState(r.ok ? { s: "result", product: r.product } : { s: "error", reason: r.reason });
  }, []);

  const forYou = (a: Additive) => !!a.careFlags?.some((f) => about.considerations.includes(f));

  const found = useMemo(() => {
    if (state.s !== "result") return null;
    const known: Additive[] = [];
    const unknown: string[] = [];
    for (const id of state.product.additives) {
      const a = additiveById(id);
      if (a) known.push(a);
      else unknown.push(id.toUpperCase());
    }
    known.sort((x, y) => LEVEL_ORDER[x.level] - LEVEL_ORDER[y.level]);
    return { known, unknown };
  }, [state]);

  const counts = found
    ? (["restricted", "some", "little"] as const).map((l) => [l, found.known.filter((a) => a.level === l).length] as const).filter(([, n]) => n > 0)
    : [];
  const browse = useMemo(() => searchAdditives(q).slice().sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level] || a.code.localeCompare(b.code, undefined, { numeric: true })), [q]);
  const canLookup = isValidBarcode(number) && state.s !== "loading";

  return (
    <ZoomPage className="rooted scan">
      <header className="sec-hero scan__hero">
        <Aurora />
        <div className="sec-hero__text">
          <motion.span className="rooted__eyebrow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>Rooted · Nourish</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.7 }}>What's in it?</motion.h1>
          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26, duration: 0.7 }}>
            Scan a product's barcode to see the additives in it, what the research says about each one, and how strong that research is.
          </motion.p>
          <motion.div className="scan__cta" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34, duration: 0.7 }}>
            <button className="btn btn--primary btn--big" onClick={() => setScanning(true)}><Icon name="barcode" size={22} /> Scan a barcode</button>
            <form className="scan__type" onSubmit={(e) => { e.preventDefault(); if (canLookup) void run(number); }}>
              <label htmlFor="barcode" className="visually-hidden">Barcode number</label>
              <input id="barcode" inputMode="numeric" autoComplete="off" placeholder="Or type the number" value={number} onChange={(e) => setNumber(e.target.value.replace(/[^\d\s]/g, ""))} />
              <button className="btn btn--secondary" type="submit" disabled={!canLookup}>Look up</button>
            </form>
          </motion.div>
        </div>
      </header>

      <section className="sec-block scan__result" aria-live="polite">
        {state.s === "loading" && <p className="scan__status">Looking it up…</p>}
        {state.s === "error" && <p className="scan__status scan__status--error" role="alert">{ERRORS[state.reason]}</p>}
        {state.s === "result" && found && (
          <Reveal>
            <div className="r-card scan__product">
              {state.product.image && <img src={state.product.image} alt="" width={88} height={88} loading="lazy" />}
              <div>
                <h2>{state.product.name}</h2>
                {state.product.brand && <p className="scan__brand">{state.product.brand}</p>}
                <p className="scan__count">
                  {found.known.length + found.unknown.length === 0
                    ? "No additives are listed for this product."
                    : `${found.known.length + found.unknown.length} additive${found.known.length + found.unknown.length === 1 ? "" : "s"} listed${counts.length ? ": " : "."}${counts.map(([l, n]) => `${n} ${COUNT_WORDS[l]}`).join(", ")}${counts.length ? "." : ""}`}
                </p>
              </div>
            </div>

            {found.known.length > 0 && <ul className="addi-list">{found.known.map((a) => <Row key={a.id} a={a} forYou={forYou(a)} open={open === a.id} onToggle={() => setOpen(open === a.id ? null : a.id)} />)}</ul>}

            {found.unknown.length > 0 && (
              <div className="r-card scan__unknown">
                <h3>Not reviewed here yet</h3>
                <p>We only describe an additive when we can back it with a regulator's review or a published study. These are listed on the product, and we haven't reviewed them yet: <strong>{found.unknown.join(", ")}</strong>. <a href={EFSA} target="_blank" rel="noreferrer">EFSA's additive pages ↗</a> are a good place to look.</p>
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

      <section className="sec-block" id="guide">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Additive guide</span>
          <h2>Look one up</h2>
          <p>{ADDITIVES.length} common additives, each with what regulators and researchers have found. Search by name or E-number.</p>
        </Reveal>
        <label htmlFor="addi-search" className="visually-hidden">Search additives</label>
        <input id="addi-search" className="scan__search" type="search" placeholder="Try aspartame, E171 or red 40" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
        {browse.length ? (
          <ul className="addi-list">{browse.map((a) => <Row key={a.id} a={a} forYou={forYou(a)} open={open === `g-${a.id}`} onToggle={() => setOpen(open === `g-${a.id}` ? null : `g-${a.id}`)} />)}</ul>
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
            <li>This is wellness education, not medical advice. If you have a health condition or allergy, <Link to="/disclaimer">talk to your clinician</Link>.</li>
          </ul>
        </div>
      </section>
      <Footer />
      <BarcodeScanner open={scanning} onCode={(c) => void run(c)} onClose={() => setScanning(false)} />
    </ZoomPage>
  );
}
