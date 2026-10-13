import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Aurora, Reveal, ZoomPage } from "../rooted/motion";
import { Evidence, SecTabs, Sheet, SourceLink } from "../rooted/ui";
import { GROUP_LABEL, GROUP_NOTE, NUTRIENTS, NUTRIENT_SOURCES, PAIRINGS, foodIndex, nutrientById, type Nutrient, type NutrientGroup } from "../rooted/nutrientsContent";
import { Footer } from "../components/Footer";
import "../rooted/rooted.css";
import "./BrainGuide.css";
import "./Nutrients.css";

const TABS = [
  { id: "all", label: "All nutrients" },
  { id: "pairs", label: "Better together" },
  { id: "foods", label: "Find by food" },
  { id: "sources", label: "Sources" },
];

const GROUPS: NutrientGroup[] = ["fat-vit", "water-vit", "major-min", "trace-min"];

function Detail({ n, onOpen }: { n: Nutrient; onOpen(id: string): void }) {
  const pairs = PAIRINGS.filter((p) => p.parts.includes(n.id));
  return (
    <article className="ndetail" style={{ "--h": n.hue } as React.CSSProperties}>
      <header>
        <span className="ndetail__group">{GROUP_LABEL[n.group]}</span>
        <h2>{n.name}</h2>
        {n.also && <p className="ndetail__also">{n.also}</p>}
        <p className="ndetail__sum">{n.summary}</p>
        <Evidence s={n.evidence} />
      </header>
      <section><h3>What it does</h3><ul>{n.does.map((d) => <li key={d}>{d}</li>)}</ul></section>
      <section>
        <h3>Where to find it</h3>
        <div className="ndetail__foods">
          <div><strong>Plants</strong><ul>{n.plants.map((f) => <li key={f}>{f}</li>)}</ul></div>
          {n.other.length > 0 && <div><strong>Animal and fortified foods</strong><ul>{n.other.map((f) => <li key={f}>{f}</li>)}</ul></div>}
        </div>
      </section>
      <section><h3>Good to know</h3><ul>{n.tips.map((t) => <li key={t}>{t}</li>)}</ul></section>
      <section><h3>Who tends to run low</h3><p>{n.lowRisk}</p></section>
      <section className="ndetail__care"><h3>Check with a clinician or pharmacist first if</h3><ul>{n.care.map((c) => <li key={c}>{c}</li>)}</ul></section>
      {pairs.length > 0 && (
        <section>
          <h3>Works with</h3>
          <div className="ndetail__pairs">
            {pairs.map((p) => (
              <div key={p.id}>
                <strong>{p.title}</strong> <Evidence s={p.evidence} short />
                <p>{p.body}</p>
                <span className="ndetail__chips">{p.parts.filter((x) => x !== n.id).map((x) => <button key={x} className="chip" onClick={() => onOpen(x)}>{nutrientById(x)?.name}</button>)}</span>
              </div>
            ))}
          </div>
        </section>
      )}
      <p className="ndetail__note">Food first. This is general information, not medical advice or a recommended amount: the sources below list those for each age and life stage.</p>
      <div className="ndetail__src">{n.sources.map((s) => <SourceLink key={s.text} s={s} />)}</div>
    </article>
  );
}

export default function Nutrients() {
  const [params, setParams] = useSearchParams();
  const [group, setGroup] = useState<NutrientGroup | "all">("all");
  const [q, setQ] = useState("");
  const [food, setFood] = useState("");
  const open = params.get("open");
  const active = open ? nutrientById(open) : undefined;
  const setOpen = (id: string | null) => setParams(id ? { open: id } : {}, { replace: false });
  const foods = useMemo(foodIndex, []);

  const shown = NUTRIENTS.filter((n) => (group === "all" || n.group === group) && (!q.trim() || `${n.name} ${n.also ?? ""} ${n.summary}`.toLowerCase().includes(q.trim().toLowerCase())));
  const foodHits = foods.filter((f) => !food.trim() || f.name.toLowerCase().includes(food.trim().toLowerCase())).slice(0, food.trim() ? 40 : 30);

  return (
    <ZoomPage className="rooted nutrients">
      <header className="sec-hero nutrients__hero">
        <Aurora />
        <div className="sec-hero__text">
          <motion.span className="rooted__eyebrow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>Rooted · Nourish</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.7 }}>Vitamins and minerals,<br />and where to find them.</motion.h1>
          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32, duration: 0.7 }}>
            What each one does for you, which fruits, vegetables and other foods are rich in it, and who should be careful. Food first, with the research behind every page.
          </motion.p>
        </div>
      </header>

      <SecTabs tabs={TABS} />

      <section id="all" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">All {NUTRIENTS.length} nutrients</span>
          <h2>Tap one to see what it does</h2>
          <p className="rooted__lead">Every vitamin and mineral your body needs, in plain language. The evidence label rates the benefits listed, not whether you need it: you do.</p>
        </Reveal>
        <div className="nfilter">
          <input type="search" placeholder="Search, for example magnesium or iron" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search nutrients" />
          <div className="scan__chips" role="group" aria-label="Filter by group">
            <button className={`chip ${group === "all" ? "is-on" : ""}`} aria-pressed={group === "all"} onClick={() => setGroup("all")}>All</button>
            {GROUPS.map((g) => <button key={g} className={`chip ${group === g ? "is-on" : ""}`} aria-pressed={group === g} onClick={() => setGroup(g)}>{GROUP_LABEL[g]}</button>)}
          </div>
          {group !== "all" && <p className="nfilter__note">{GROUP_NOTE[group]}</p>}
        </div>
        {shown.length === 0 && <p className="rooted__lead">Nothing matches that. Try another name.</p>}
        <div className="ngrid">
          {shown.map((n, i) => (
            <Reveal key={n.id} delay={(i % 4) * 0.04}>
              <button className="r-card ncard" style={{ "--h": n.hue } as React.CSSProperties} onClick={() => setOpen(n.id)}>
                <span className="ncard__dot" aria-hidden="true" />
                <strong>{n.name}</strong>
                <small>{GROUP_LABEL[n.group]}</small>
                <p>{n.summary}</p>
                <span className="ncard__foot"><Evidence s={n.evidence} short /><span>{n.plants[0]?.replace(/ \(.*\)/, "")}</span></span>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="pairs" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Better together</span>
          <h2>Nutrients that work as a team</h2>
          <p className="rooted__lead">Some pairs help each other, and some compete. Each is labelled with how well it is supported.</p>
        </Reveal>
        <div className="npairs">
          {PAIRINGS.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 0.05} className="r-card npair">
              <h3>{p.title}</h3>
              <Evidence s={p.evidence} />
              <p>{p.body}</p>
              <span className="ndetail__chips">{p.parts.map((x) => <button key={x} className="chip" onClick={() => setOpen(x)}>{nutrientById(x)?.name}</button>)}{p.link && <Link className="chip" to={p.link}>Follow the sun</Link>}</span>
              <div className="ndetail__src">{p.sources.map((s) => <SourceLink key={s.text} s={s} />)}</div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="foods" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Find by food</span>
          <h2>What's in my fruit and vegetables?</h2>
          <p className="rooted__lead">Type a food to see which vitamins and minerals it is a good source of. Foods with the most are listed first.</p>
        </Reveal>
        <div className="nfilter"><input type="search" placeholder="Try spinach, banana, lentils…" value={food} onChange={(e) => setFood(e.target.value)} aria-label="Search foods" /></div>
        <ul className="nfoods">
          {foodHits.map((f) => (
            <li key={f.name} className="r-card">
              <strong>{f.name}</strong>
              <span className="ndetail__chips">{f.nutrients.map((id) => <button key={id} className="chip" onClick={() => setOpen(id)}>{nutrientById(id)?.name}</button>)}</span>
            </li>
          ))}
          {foodHits.length === 0 && <li className="rooted__lead">Not in the guide yet. Try a simpler name.</li>}
        </ul>
        <p className="nfilter__note">Lists show foods that are a good source in this guide, not every nutrient a food contains. For exact numbers, see USDA FoodData Central under Sources.</p>
      </section>

      <section id="sources" className="sec-block">
        <Reveal className="sec-block__head"><span className="rooted__eyebrow">Sources</span><h2>Where this comes from</h2></Reveal>
        <div className="r-card npair">
          <p>Each page cites the NIH fact sheet for that nutrient, plus any other study named. These pages are for learning. They are not medical advice and not a substitute for a clinician, pharmacist or dietitian who knows your health, medicines and pregnancy status.</p>
          <div className="ndetail__src">{NUTRIENT_SOURCES.map((s) => <SourceLink key={s.text} s={s} />)}</div>
          <p><Link to="/scan" className="src-link">Scan a product to see its additives ↗</Link></p>
        </div>
      </section>

      <Sheet open={!!active} onClose={() => setOpen(null)} label={active?.name ?? ""}>{active && <Detail n={active} onOpen={setOpen} />}</Sheet>
      <Footer />
    </ZoomPage>
  );
}
