import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Aurora, Reveal, TiltCard, ZoomPage } from "../rooted/motion";
import { Evidence, Sheet } from "../rooted/ui";
import { COMBOS, STEP_LABEL, comboMinutes, resolveSteps, type Combo } from "../rooted/comboContent";
import { ComboPlayer, STEP_ICON, stepName } from "../rooted/ComboPlayer";
import { slotFor } from "../rooted/plan";
import { unlockChime } from "../rooted/chime";
import { flags, useAbout } from "../store/wellness";
import { usePracticeLog } from "../store/practice";
import { useJournalEntries } from "../store/journal";
import { Footer } from "../components/Footer";
import { Icon } from "../components/Icon";
import "../rooted/rooted.css";
import "./Breathe.css";
import "./Move.css";
import { SectionArt } from "../rooted/SectionArt";
import { sectionById } from "../rooted/sections";
import "./Combos.css";

const WHEN_SLOT = { morning: "morning", midday: "midday", evening: "evening" } as const;

export default function Combos() {
  const about = useAbout();
  const f = flags(about.considerations);
  const entries = usePracticeLog();
  const journal = useJournalEntries();
  const [open, setOpen] = useState<Combo | null>(null);
  const [run, setRun] = useState<Combo | null>(null);
  const slot = slotFor(new Date().getHours());

  const ranked = useMemo(() => {
    const score = (c: Combo) =>
      c.goals.reduce((a, g) => a + (about.goals.includes(g) ? 3 - Math.min(2, about.goals.indexOf(g)) : 0), 0) +
      (c.when === "any" ? 1 : WHEN_SLOT[c.when] === slot ? 3 : -1);
    return [...COMBOS].sort((a, b) => score(b) - score(a));
  }, [about.goals, slot]);
  const featured = ranked[0];
  const countFor = (id: string) => entries.filter((e) => e.kind === `combo:${id}`).length;
  const start = (c: Combo) => {
    unlockChime();
    setOpen(null);
    setRun(c);
  };

  // "?open=evening" (from GAIA or a link) opens that combo's steps.
  const [params, setParams] = useSearchParams();
  useEffect(() => {
    const id = params.get("open");
    if (!id) return;
    const c = COMBOS.find((x) => x.id === id);
    if (c) setOpen(c);
    params.delete("open");
    setParams(params, { replace: true });
  }, [params, setParams]);

  return (
    <ZoomPage className="rooted combos">
      <header className="sec-hero combos__hero" style={{ "--h": featured.hue, "--h2": featured.hue2 } as React.CSSProperties}>
        <Aurora />
        <SectionArt s={sectionById("combos")} hero />
        <div className="combos__chain" aria-hidden="true">
          {resolveSteps(featured, f).map((s, k) => (
            <motion.span key={k} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + k * 0.12, type: "spring", stiffness: 200, damping: 16 }}>
              <Icon name={STEP_ICON[s.type]} size={26} />
            </motion.span>
          ))}
        </div>
        <div className="sec-hero__text">
          <motion.span className="rooted__eyebrow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>Rooted · Combos · Recommended now</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.7 }}>{featured.name}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32, duration: 0.7 }}>
            {featured.tagline}. {resolveSteps(featured, f).map((s, k) => { const n = stepName(s); return k === 0 ? n : n.charAt(0).toLowerCase() + n.slice(1); }).join(", then ")}.
          </motion.p>
          <motion.div className="breathe__cta" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42, duration: 0.7 }}>
            <button className="btn btn--primary btn--big" onClick={() => start(featured)}><Icon name="play" size={22} /> Start · about {comboMinutes(resolveSteps(featured, f))} min</button>
            <button className="btn btn--secondary" onClick={() => setOpen(featured)}>See the steps</button>
          </motion.div>
        </div>
      </header>

      <section className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">All combos</span>
          <h2>Stack small things into one flow</h2>
          <p className="rooted__lead">Each combo chains breathing, movement, a habit and sound into a single guided session. One tap starts it, and it moves on by itself.{about.considerations.length ? " Steps that aren't right for your profile are swapped automatically." : ""}</p>
        </Reveal>
        <div className="combo-grid">
          {ranked.map((c, i) => {
            const steps = resolveSteps(c, f);
            const n = countFor(c.id);
            return (
              <Reveal key={c.id} delay={(i % 3) * 0.06}>
                <TiltCard className="combo" onClick={() => setOpen(c)} label={`${c.name}: ${c.tagline}`} style={{ "--h": c.hue, "--h2": c.hue2 } as React.CSSProperties}>
                  <div className="combo__chain" aria-hidden="true">
                    {steps.map((s, k) => (
                      <span key={k}><Icon name={STEP_ICON[s.type]} size={16} /></span>
                    ))}
                  </div>
                  <span className="tech__short">{comboMinutes(steps)} min · {steps.length} steps{c.when !== "any" ? ` · ${c.when === "midday" ? "afternoon" : c.when}` : ""}</span>
                  <h3>{c.name}</h3>
                  <p>{c.tagline}</p>
                  <span className="tech__foot">
                    {i < 2 && about.goals.length > 0 && <span className="bento-card__soon bento-card__foryou">For you</span>}
                    {n > 0 && <span className="combo__count">Done {n}×</span>}
                  </span>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </section>

      {journal.length > 0 && (
        <section className="sec-block">
          <Reveal className="sec-block__head">
            <span className="rooted__eyebrow">Your reflections</span>
            <h2>Things you wrote down</h2>
          </Reveal>
          <div className="journal">
            {[...journal].reverse().slice(0, 6).map((j, k) => (
              <Reveal key={k} delay={k * 0.05} className="r-card journal__entry">
                <span className="journal__day">{new Date(`${j.day}T12:00`).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })} · {j.prompt}</span>
                <ul>{j.lines.map((l, x) => <li key={x}>{l}</li>)}</ul>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <Sheet open={!!open} onClose={() => setOpen(null)} label={open?.name ?? ""}>
        {open && (
          <article className="tdetail" style={{ "--h": open.hue, "--h2": open.hue2 } as React.CSSProperties}>
            <div className="tdetail__top combo-detail__top">
              <span className="rooted__eyebrow">{comboMinutes(resolveSteps(open, f))} min · {resolveSteps(open, f).length} steps</span>
              <h2>{open.name}</h2>
              <p>{open.tagline}</p>
            </div>
            <div className="tdetail__body">
              <button className="btn btn--primary btn--big" onClick={() => start(open)}><Icon name="play" size={22} /> Start</button>
              <ol className="combo-steps">
                {resolveSteps(open, f).map((s, k) => (
                  <motion.li key={k} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: k * 0.06 }}>
                    <span className="combo-steps__icon"><Icon name={STEP_ICON[s.type]} size={18} /></span>
                    <span><small>{STEP_LABEL[s.type]}</small><strong>{stepName(s)}</strong></span>
                  </motion.li>
                ))}
              </ol>
              <section>
                <h3>Why this combo <Evidence s={open.evidence} /></h3>
                <p>{open.why}</p>
              </section>
            </div>
          </article>
        )}
      </Sheet>

      <AnimatePresence>{run && <ComboPlayer key={run.id} combo={run} steps={resolveSteps(run, f)} onClose={() => setRun(null)} />}</AnimatePresence>
      <Footer />
    </ZoomPage>
  );
}
