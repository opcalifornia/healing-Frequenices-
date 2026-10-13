import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Aurora, Reveal, ZoomPage } from "../rooted/motion";
import { Evidence, SecTabs, Sheet, SourceLink } from "../rooted/ui";
import { ANIMAL_INTRO_SOURCES, ANIMAL_TOPICS, COMPARE, GROUP_LABEL, type AnimalTopic } from "../rooted/animalContent";
import { Footer } from "../components/Footer";
import "../rooted/rooted.css";
import "./BrainGuide.css";
import "./Nutrients.css";
import "./AnimalProducts.css";

const TABS = [
  { id: "topics", label: "The big questions" },
  { id: "compare", label: "US and EU" },
  { id: "choose", label: "How to choose" },
  { id: "sources", label: "Sources" },
];

const GROUPS = Object.keys(GROUP_LABEL) as AnimalTopic["group"][];

function Detail({ t }: { t: AnimalTopic }) {
  return (
    <article className="ndetail" style={{ "--h": t.hue } as React.CSSProperties}>
      <header>
        <span className="ndetail__group">{GROUP_LABEL[t.group]}</span>
        <h2>{t.title}</h2>
        <Evidence s={t.rating} />
        <p className="ndetail__also">Rating: how well supported the claims about human health are on this page.</p>
      </header>
      <section><h3>What it is</h3><p>{t.what}</p></section>
      <section><h3>What the rules say</h3><p>{t.rules}</p></section>
      <section><h3>What the research says about people</h3><p>{t.research}</p></section>
      <section className="ndetail__care"><h3>What you can do</h3><ul>{t.doThis.map((d) => <li key={d}>{d}</li>)}</ul></section>
      <p className="ndetail__note">Rules described are for the United States unless stated. This is general information, not medical advice.</p>
      <div className="ndetail__src">{t.sources.map((s) => <SourceLink key={s.text} s={s} />)}</div>
    </article>
  );
}

export default function AnimalProducts() {
  const [params, setParams] = useSearchParams();
  const [group, setGroup] = useState<AnimalTopic["group"] | "all">("all");
  const open = params.get("open");
  const active = ANIMAL_TOPICS.find((t) => t.id === open);
  const setOpen = (id: string | null) => setParams(id ? { open: id } : {});
  const shown = ANIMAL_TOPICS.filter((t) => group === "all" || t.group === group);

  return (
    <ZoomPage className="rooted nutrients animals">
      <header className="sec-hero nutrients__hero">
        <Aurora />
        <div className="sec-hero__text">
          <motion.span className="rooted__eyebrow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>Rooted · Nourish</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.7 }}>Meat, milk and eggs:<br />how they're raised.</motion.h1>
          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32, duration: 0.7 }}>
            Antibiotics, hormones, feed additives, organic and what the labels really mean. What farms do, what the rules allow, and what the research says about you.
          </motion.p>
        </div>
      </header>

      <SecTabs tabs={TABS} />

      <section id="topics" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">The big questions</span>
          <h2>What's actually done, and does it matter?</h2>
          <p className="rooted__lead">Each card says what a practice is, why it's used, what the rules are, and what studies show for people, with a rating for how solid that is. Where regulators and scientists disagree, we say so.</p>
        </Reveal>
        <div className="scan__chips" role="group" aria-label="Filter by topic">
          <button className={`chip ${group === "all" ? "is-on" : ""}`} aria-pressed={group === "all"} onClick={() => setGroup("all")}>All</button>
          {GROUPS.map((g) => <button key={g} className={`chip ${group === g ? "is-on" : ""}`} aria-pressed={group === g} onClick={() => setGroup(g)}>{GROUP_LABEL[g]}</button>)}
        </div>
        <div className="ngrid animals__grid">
          {shown.map((t, i) => (
            <Reveal key={t.id} delay={(i % 4) * 0.04}>
              <button className="r-card ncard" style={{ "--h": t.hue } as React.CSSProperties} onClick={() => setOpen(t.id)}>
                <span className="ncard__dot" aria-hidden="true" />
                <strong>{t.title}</strong>
                <small>{GROUP_LABEL[t.group]}</small>
                <p><b className="animals__stat">{t.stat}</b> {t.statLabel}</p>
                <span className="ncard__foot"><Evidence s={t.rating} short /><span>Tap to read</span></span>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="compare" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">US and EU</span>
          <h2>The same practice, treated differently</h2>
          <p className="rooted__lead">Countries weigh the evidence differently. That doesn't mean one is certainly right: it shows how uncertain some of the science is.</p>
        </Reveal>
        <div className="r-card animals__table" role="table" aria-label="United States and European Union rules compared">
          <div role="row" className="animals__row animals__row--head"><span role="columnheader">Practice</span><span role="columnheader">United States</span><span role="columnheader">European Union</span></div>
          {COMPARE.map((c) => (
            <div role="row" className="animals__row" key={c.practice}>
              <span role="cell"><strong>{c.practice}</strong></span><span role="cell">{c.us}</span><span role="cell">{c.eu}</span>
            </div>
          ))}
        </div>
        <div className="ndetail__src animals__src">{COMPARE.map((c) => <SourceLink key={c.source.text} s={c.source} />)}</div>
      </section>

      <section id="choose" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">How to choose</span>
          <h2>What helps most, in order</h2>
        </Reveal>
        <ol className="animals__steps">
          <li className="r-card"><strong>1. Eat more plants and less processed meat.</strong><p>This has the strongest evidence behind it. See <button className="scan__link" onClick={() => setOpen("processed")}>Processed and red meat</button>.</p></li>
          <li className="r-card"><strong>2. Handle and cook animal foods safely.</strong><p>It protects you from germs, including resistant ones. Cook poultry to 165°F (74°C), don't wash raw poultry, and keep raw meat apart from other food.</p></li>
          <li className="r-card"><strong>3. Choose how it's raised if it matters to you.</strong><p>USDA Organic is the one label that covers antibiotics, hormones and feed, and is inspected. Other claims vary: see <button className="scan__link" onClick={() => setOpen("labels")}>Reading the label</button>. The health difference for you is small or unproven, so this is mostly about farming practices and values, and budget.</p></li>
          <li className="r-card"><strong>4. Read the fine print.</strong><p>Look for added solution, retained water and sodium on raw chicken and pork.</p></li>
          <li className="r-card"><strong>5. Ask a clinician or dietitian about your own situation.</strong><p>If you're pregnant, immunocompromised, or managing a condition, your advice may differ.</p></li>
        </ol>
      </section>

      <section id="sources" className="sec-block">
        <Reveal className="sec-block__head"><span className="rooted__eyebrow">Sources</span><h2>Where this comes from</h2></Reveal>
        <div className="r-card npair">
          <p>Each card lists its sources: US regulators (FDA, USDA), the World Health Organization and its cancer agency, the CDC, the European Commission and published studies. Rules change, so check the linked pages for the latest. This is learning material, not medical advice.</p>
          <div className="ndetail__src">{ANIMAL_INTRO_SOURCES.map((s) => <SourceLink key={s.text} s={s} />)}</div>
          <p><Link to="/nutrients" className="src-link">Vitamins and minerals guide ↗</Link></p>
        </div>
      </section>

      <Sheet open={!!active} onClose={() => setOpen(null)} label={active?.title ?? ""}>{active && <Detail t={active} />}</Sheet>
      <Footer />
    </ZoomPage>
  );
}
