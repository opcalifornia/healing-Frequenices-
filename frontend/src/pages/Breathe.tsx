import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Aurora, Reveal, TiltCard, ZoomPage } from "../rooted/motion";
import { Evidence, SecTabs, Sheet, SourceLink } from "../rooted/ui";
import { GROUNDING, PMR, PMR_SOURCE, TECHNIQUES, type Technique } from "../rooted/breathContent";
import { BreathPlayer } from "../rooted/BreathPlayer";
import { chime, unlockChime } from "../rooted/chime";
import { minutesOn, practiceStreak, usePractice, usePracticeLog } from "../store/practice";
import { Footer } from "../components/Footer";
import { Icon } from "../components/Icon";
import "../rooted/rooted.css";
import "./Breathe.css";

const TABS = [
  { id: "breathe", label: "Breathing" },
  { id: "ground", label: "Grounding" },
  { id: "relax", label: "Muscle relaxation" },
];

function MiniPattern({ t }: { t: Technique }) {
  const total = t.cycle.reduce((a, p) => a + p.secs, 0);
  return (
    <span className="mini-pattern" aria-hidden="true">
      {t.cycle.map((p, i) => (
        <i key={i} className={`mp mp--${p.kind}`} style={{ flexGrow: p.secs / total }} />
      ))}
    </span>
  );
}

function Grounding() {
  const [step, setStep] = useState(-1);
  const log = usePractice((s) => s.log);
  const s = GROUNDING[step];
  return (
    <div className="ground r-card">
      <AnimatePresence mode="wait">
        {step < 0 ? (
          <motion.div key="start" className="ground__start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p>When anxiety takes over, your senses bring you back to the room. Go at your own pace.</p>
            <button className="btn btn--primary" onClick={() => setStep(0)}>Start 5-4-3-2-1</button>
          </motion.div>
        ) : step < GROUNDING.length ? (
          <motion.div key={step} className="ground__step" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.35 }}>
            <span className="ground__n">{s.n}</span>
            <div>
              <span className="rooted__eyebrow">Things you can {s.sense}</span>
              <p>{s.prompt}</p>
            </div>
            <div className="ground__dots" aria-hidden="true">{GROUNDING.map((_, i) => <i key={i} className={i <= step ? "on" : ""} />)}</div>
            <button className="btn btn--primary" onClick={() => { setStep(step + 1); if (step + 1 === GROUNDING.length) log("ground", 2); }}>{step === GROUNDING.length - 1 ? "Finish" : "Next"}</button>
          </motion.div>
        ) : (
          <motion.div key="end" className="ground__start" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p><strong>You're here.</strong> Take one more slow breath. If you're still struggling, it's okay to reach out to someone.</p>
            <button className="btn btn--secondary btn--small" onClick={() => setStep(-1)}>Do it again</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MuscleRelax() {
  const [i, setI] = useState(-1);
  const [tense, setTense] = useState(true);
  const [left, setLeft] = useState(5);
  const log = usePractice((s) => s.log);
  useEffect(() => {
    if (i < 0 || i >= PMR.length) return;
    if (left <= 0) {
      chime(tense ? "out" : "in");
      if (tense) {
        setTense(false);
        setLeft(10);
      } else if (i + 1 >= PMR.length) {
        setI(PMR.length);
        log("pmr", 2.5);
      } else {
        setI(i + 1);
        setTense(true);
        setLeft(5);
      }
      return;
    }
    const id = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(id);
  }, [i, left, tense, log]);
  const start = () => {
    unlockChime();
    chime("in");
    setI(0);
    setTense(true);
    setLeft(5);
  };
  return (
    <div className="pmr r-card">
      {i < 0 || i >= PMR.length ? (
        <div className="ground__start">
          <p>{i >= PMR.length ? "Done. Let your whole body stay heavy for a few breaths." : "Tense each muscle group for five seconds, then let it go for ten. About two and a half minutes, head to toe. Great before sleep."}</p>
          <button className="btn btn--primary" onClick={start}>{i >= PMR.length ? "Again" : "Start"}</button>
        </div>
      ) : (
        <div className="pmr__run">
          <motion.div className={`pmr__orb ${tense ? "is-tense" : ""}`} animate={{ scale: tense ? 0.82 : 1.05 }} transition={{ duration: tense ? 0.6 : 2.5, ease: "easeInOut" }} />
          <div className="pmr__text" aria-live="polite">
            <span className="rooted__eyebrow">{i + 1} of {PMR.length} · {tense ? "Tense" : "Release"}</span>
            <strong>{tense ? PMR[i] : "Let it go. Notice the difference."}</strong>
            <span className="pmr__secs">{left}</span>
          </div>
          <button className="btn btn--secondary btn--small" onClick={() => setI(-1)}>Stop</button>
        </div>
      )}
      <p className="nourish__src"><SourceLink s={PMR_SOURCE} /></p>
    </div>
  );
}

export default function Breathe() {
  const [open, setOpen] = useState<Technique | null>(null);
  const [mins, setMins] = useState(1);
  const [run, setRun] = useState<{ t: Technique; m: number } | null>(null);
  const entries = usePracticeLog();
  const today = minutesOn(entries);
  const streak = practiceStreak(entries);

  const start = (t: Technique, m: number) => {
    unlockChime();
    setOpen(null);
    setRun({ t, m });
  };

  return (
    <ZoomPage className="rooted breathe">
      <header className="sec-hero breathe__hero">
        <Aurora />
        <div className="breathe__demo" aria-hidden="true"><span /><span /><span /></div>
        <div className="sec-hero__text">
          <motion.span className="rooted__eyebrow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>Rooted · Breathe</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.7 }}>One minute<br />can change your state.</motion.h1>
          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32, duration: 0.7 }}>
            Follow the circle: breathe in as it grows, out as it shrinks. Soft chimes and vibration guide you, so you can close your eyes.
          </motion.p>
          <motion.div className="breathe__cta" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42, duration: 0.7 }}>
            <button className="btn btn--primary btn--big" onClick={() => start(TECHNIQUES[0], 1)}>
              <Icon name="play" size={22} /> Start a 1-minute calm
            </button>
            {(today > 0 || streak > 0) && (
              <span className="breathe__stat">{Math.round(today)} min today{streak > 1 ? ` · ${streak}-day streak` : ""}</span>
            )}
          </motion.div>
        </div>
      </header>

      <SecTabs tabs={TABS} />

      <section id="breathe" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Breathing</span>
          <h2>Pick what you need</h2>
          <p className="rooted__lead">Each one says when to use it and how strong the evidence is.</p>
        </Reveal>
        <div className="techs">
          {TECHNIQUES.map((t, i) => (
            <Reveal key={t.id} delay={(i % 3) * 0.06}>
              <TiltCard className="tech" onClick={() => { setOpen(t); setMins(t.minutes[0] ?? 0); }} label={`${t.name}: ${t.when}`} style={{ "--h": t.hue } as React.CSSProperties}>
                <span className="tech__orb" aria-hidden="true" />
                <span className="tech__short">{t.short}</span>
                <h3>{t.name}</h3>
                <p>{t.when}</p>
                <MiniPattern t={t} />
                <span className="tech__foot"><Evidence s={t.evidence} short />{t.gated && <span className="tech__warn">Read safety first</span>}</span>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="ground" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Grounding</span>
          <h2>5-4-3-2-1</h2>
        </Reveal>
        <Reveal><Grounding /></Reveal>
      </section>

      <section id="relax" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Muscle relaxation</span>
          <h2>Tense, then let go</h2>
          <p className="rooted__lead">Progressive muscle relaxation has good evidence for easing stress and anxiety, and it's one of the simplest things to do in bed.</p>
        </Reveal>
        <Reveal><MuscleRelax /></Reveal>
      </section>

      <p className="nourish__disclaimer">
        Breathing exercises are generally safe, but stop if you feel dizzy or unwell. If you're having a panic attack for the first time, chest pain, or trouble
        breathing, get medical help. In the US you can call or text <a href="tel:988">988</a> for mental health crisis support.
      </p>

      <Sheet open={!!open} onClose={() => setOpen(null)} label={open?.name ?? ""}>
        {open && (
          <article className="tdetail" style={{ "--h": open.hue } as React.CSSProperties}>
            <div className="tdetail__top">
              <span className="tech__orb tech__orb--big" aria-hidden="true" />
              <span className="rooted__eyebrow">{open.short}</span>
              <h2>{open.name}</h2>
              <p>{open.when}</p>
            </div>
            <div className="tdetail__body">
              {open.minutes.length > 0 && (
                <div className="tdetail__mins" role="radiogroup" aria-label="How long">
                  {open.minutes.map((m) => (
                    <button key={m} role="radio" aria-checked={mins === m} className={`chip ${mins === m ? "is-on" : ""}`} onClick={() => setMins(m)}>{m} min</button>
                  ))}
                </div>
              )}
              {open.rounds && <p className="tdetail__rounds">{open.rounds.count} rounds of {open.rounds.breaths} breaths, each followed by a breath hold. About 8 minutes.</p>}
              <button className="btn btn--primary btn--big" onClick={() => start(open, mins)}><Icon name="play" size={22} /> Start</button>
              <section>
                <h3>Why it works <Evidence s={open.evidence} /></h3>
                <p>{open.why}</p>
              </section>
              <ul className="pdetail__sources">{open.sources.map((s) => <li key={s.text}><SourceLink s={s} /></li>)}</ul>
            </div>
          </article>
        )}
      </Sheet>

      <AnimatePresence>{run && <BreathPlayer key={`${run.t.id}-${run.m}`} technique={run.t} minutes={run.m} onClose={() => setRun(null)} />}</AnimatePresence>
      <Footer />
    </ZoomPage>
  );
}
