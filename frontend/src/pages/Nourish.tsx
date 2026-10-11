import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Aurora, Reveal, TiltCard, ZoomPage, useParallax } from "../rooted/motion";
import { Evidence, SecTabs, Sheet, SourceLink } from "../rooted/ui";
import { FASTING, FINDINGS, MYTHS, PLATE_SOURCE, WATER_FACTS, WATER_SOURCES, type Finding } from "../rooted/nourishContent";
import { PlateBuilder, WaterTracker } from "../rooted/NourishTools";
import { Pantry } from "../rooted/Pantry";
import { Footer } from "../components/Footer";
import { flags, useAbout } from "../store/wellness";
import "../rooted/rooted.css";
import "./Nourish.css";

const TABS = [
  { id: "science", label: "The science" },
  { id: "plate", label: "Your plate" },
  { id: "water", label: "Water" },
  { id: "pantry", label: "Pantry & list" },
  { id: "fasting", label: "Fasting" },
  { id: "myths", label: "Myths" },
];

function HeroProduce() {
  const y1 = useParallax(-0.18);
  const y2 = useParallax(-0.08);
  const leaves = [
    { x: "62%", t: "18%", r: -20, s: 1.2, c: "#9ccc65", y: y1 },
    { x: "80%", t: "40%", r: 35, s: 0.9, c: "#e8b04a", y: y2 },
    { x: "70%", t: "62%", r: 120, s: 1.5, c: "#6f9a5a", y: y1 },
    { x: "90%", t: "12%", r: 200, s: 0.7, c: "#e3a57a", y: y2 },
    { x: "55%", t: "48%", r: 60, s: 0.6, c: "#cfe3a0", y: y2 },
  ];
  return (
    <div className="nh-produce" aria-hidden="true">
      {leaves.map((l, i) => (
        <motion.svg key={i} viewBox="0 0 80 50" className="nh-leaf" style={{ left: l.x, top: l.t, y: l.y as never, rotate: l.r, scale: l.s, "--d": `${i * -2.1}s` } as never}>
          <path d="M2 40C14 8 50 0 78 6 70 34 36 52 2 40Z" fill={l.c} opacity="0.75" />
          <path d="M4 39C26 26 50 14 76 7" stroke="rgba(0,0,0,.3)" strokeWidth="1.6" fill="none" />
        </motion.svg>
      ))}
    </div>
  );
}

function FindingCard({ f, onOpen }: { f: Finding; onOpen(): void }) {
  return (
    <TiltCard className="finding" onClick={onOpen} label={`${f.title}: read more`} style={{ "--h": f.hue } as React.CSSProperties}>
      <span className="finding__stat">{f.stat}</span>
      <span className="finding__label">{f.statLabel}</span>
      <h3>{f.title}</h3>
      <div className="finding__foot">
        <Evidence s={f.evidence} short />
        <span className="finding__more">Read the study</span>
      </div>
    </TiltCard>
  );
}

function MythCard({ m }: { m: (typeof MYTHS)[number] }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="myth" style={{ perspective: 1200 }}>
      <motion.button
        className="myth__inner"
        onClick={() => setFlipped((f) => !f)}
        aria-pressed={flipped}
        aria-label={`${m.claim}. ${flipped ? "Showing the answer" : "Tap to reveal the verdict"}`}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 140, damping: 18 }}
      >
        <span className="myth__face myth__front">
          <span className="rooted__eyebrow">Claim</span>
          <strong>"{m.claim}"</strong>
          <span className="myth__tap">Tap to check it</span>
        </span>
        <span className="myth__face myth__back">
          <span className={`myth__verdict myth__verdict--${m.verdict.replace(" ", "-").toLowerCase()}`}>{m.verdict}</span>
          <span className="myth__body">{m.body}</span>
        </span>
      </motion.button>
      {m.source && <div className="myth__src"><SourceLink s={m.source} /></div>}
    </div>
  );
}

export default function Nourish() {
  const location = useLocation();
  const [finding, setFinding] = useState<Finding | null>(null);
  const f = flags(useAbout().considerations);

  useEffect(() => {
    const id = location.hash.replace("#", "");
    if (!id) return;
    const t = setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 650);
    return () => clearTimeout(t);
  }, [location.hash]);

  return (
    <ZoomPage className="rooted nourish">
      <header className="sec-hero nourish__hero">
        <Aurora />
        <HeroProduce />
        <div className="sec-hero__text">
          <motion.span className="rooted__eyebrow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>Rooted · Nourish</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            Food and water,<br />by the evidence.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32, duration: 0.7 }}>
            What the strongest studies say about eating well, tools to put it on your plate, and a shopping list that teaches you what each food and
            herb actually does. Every claim is rated, and every source is linked.
          </motion.p>
        </div>
      </header>

      <SecTabs tabs={TABS} />

      <section id="science" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">The science</span>
          <h2>Five habits with the strongest evidence</h2>
          <p className="rooted__lead">Not trends: large trials and meta-analyses. Tap any card for the study and what to do with it.</p>
        </Reveal>
        <div className="findings">
          {FINDINGS.map((f, i) => (
            <Reveal key={f.id} delay={i * 0.07}>
              <FindingCard f={f} onOpen={() => setFinding(f)} />
            </Reveal>
          ))}
        </div>
      </section>

      <section id="plate" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Your plate</span>
          <h2>Build a balanced plate</h2>
          <p className="rooted__lead">Half vegetables and fruit, a quarter whole grains, a quarter healthy protein, cooked with olive oil, with water to drink. It's a simple model built from decades of nutrition research.</p>
        </Reveal>
        <Reveal><PlateBuilder /></Reveal>
        <p className="nourish__src"><SourceLink s={PLATE_SOURCE} /></p>
      </section>

      <section id="water" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Water</span>
          <h2>Hydration, without the hype</h2>
          <p className="rooted__lead">Log what you drink. Your goal is just for drinks; food covers about a fifth of your water.</p>
        </Reveal>
        <Reveal><WaterTracker /></Reveal>
        <div className="facts">
          {WATER_FACTS.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.06} className="fact r-card">
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </Reveal>
          ))}
        </div>
        <p className="nourish__src">{WATER_SOURCES.map((s) => <SourceLink key={s.text} s={s} />)}</p>
      </section>

      <section id="pantry" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Pantry & shopping list</span>
          <h2>Learn it, then list it</h2>
          <p className="rooted__lead">
            Foods, herbs and teas, each with what the research says, how to use it, who should be careful, and where to find it. Add what you want to your list,
            then download it or send it to your phone for the store.
          </p>
        </Reveal>
        <Pantry />
      </section>

      <section id="fasting" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Fasting & timing</span>
          <h2>When you eat, and how to break a fast</h2>
          {f.noFasting && <p className="for-you"><span><strong>Based on your profile:</strong> fasting isn't a good fit without medical guidance. Focus on the plate and fiber habits above instead.</span></p>}
        </Reveal>
        <div className="fasting">
          <Reveal className="r-card fasting__main">
            <ul>{FASTING.points.map((p) => <li key={p}>{p}</li>)}</ul>
            <p className="nourish__src">{FASTING.sources.map((s) => <SourceLink key={s.text} s={s} />)}</p>
          </Reveal>
          <Reveal delay={0.08} className="r-card fasting__no">
            <h3>Skip fasting, or get medical advice first, if you are:</h3>
            <ul>{FASTING.noGo.map((p) => <li key={p}>{p}</li>)}</ul>
          </Reveal>
        </div>
      </section>

      <section id="myths" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Myths</span>
          <h2>Popular claims, checked</h2>
          <p className="rooted__lead">Tap a card to flip it.</p>
        </Reveal>
        <div className="myths">
          {MYTHS.map((m, i) => (
            <Reveal key={m.claim} delay={(i % 3) * 0.07}><MythCard m={m} /></Reveal>
          ))}
        </div>
      </section>

      <p className="nourish__disclaimer">
        This is general information based on published research, not medical or dietary advice for you. If you're pregnant, have a health condition, take
        medicine, or have a history of disordered eating, talk to a doctor or registered dietitian before changing how you eat.
      </p>

      <Sheet open={!!finding} onClose={() => setFinding(null)} label={finding?.title ?? ""}>
        {finding && (
          <article className="fdetail" style={{ "--h": finding.hue } as React.CSSProperties}>
            <div className="fdetail__top">
              <span className="finding__stat">{finding.stat}</span>
              <span className="finding__label">{finding.statLabel}</span>
            </div>
            <div className="fdetail__body">
              <h2>{finding.title}</h2>
              <Evidence s={finding.evidence} />
              <p>{finding.body}</p>
              <div className="fdetail__do"><strong>Try this</strong><p>{finding.doThis}</p></div>
              <SourceLink s={finding.source} />
            </div>
          </article>
        )}
      </Sheet>
      <Footer />
    </ZoomPage>
  );
}
