import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Aurora, Reveal, TiltCard, ZoomPage } from "../rooted/motion";
import { Evidence, SecTabs, Sheet, SourceLink } from "../rooted/ui";
import { KIND_LABEL, MOVE_FINDINGS, ROUTINES, SAUNA, type Routine } from "../rooted/moveContent";
import { Figure } from "../rooted/Figure";
import { MuscleMap, MUSCLE_LABEL, ROUTINE_MUSCLES } from "../rooted/MuscleMap";
import { MovePlayer } from "../rooted/MovePlayer";
import { unlockChime } from "../rooted/chime";
import { usePracticeLog } from "../store/practice";
import { todayKey } from "../store/nourish";
import { flags, useAbout } from "../store/wellness";
import { Footer } from "../components/Footer";
import { ProgramRail } from "../rooted/ProgramRail";
import "./Programs.css";
import { Icon } from "../components/Icon";
import { ScheduleButton } from "../rooted/CalendarUI";
import "../rooted/rooted.css";
import "./Breathe.css";
import "./BrainGuide.css";
import "./Move.css";

const TABS = [
  { id: "programs", label: "Programs" },
  { id: "routines", label: "Routines" },
  { id: "works", label: "What it works" },
  { id: "why", label: "Why move" },
  { id: "sauna", label: "Sauna" },
];
const WEEK_GOAL = 150;

function WhatItWorks() {
  const [id, setId] = useState("yoga");
  const r = ROUTINES.find((x) => x.id === id)!;
  const m = ROUTINE_MUSCLES[id];
  return (
    <div className="r-card works">
      <MuscleMap muscles={m.muscles} />
      <div className="works__info">
        <div className="seg seg--wrap" role="group" aria-label="Routine">
          {ROUTINES.map((x) => <button key={x.id} className={id === x.id ? "is-on" : ""} aria-pressed={id === x.id} onClick={() => setId(x.id)}>{x.name.replace("Qigong: ", "").replace(", part one", "")}</button>)}
        </div>
        <h3>{r.name}</h3>
        <span className="rooted__eyebrow">Works</span>
        <div className="works__tags works__tags--m">{m.muscles.map((x) => <span key={x}>{MUSCLE_LABEL[x]}</span>)}</div>
        <span className="rooted__eyebrow">Good for</span>
        <div className="works__tags works__tags--g">{m.goodFor.map((x) => <span key={x}>{x}</span>)}</div>
      </div>
    </div>
  );
}

function WeekRing() {
  const entries = usePracticeLog();
  const since = new Date();
  since.setDate(since.getDate() - 6);
  const from = todayKey(since);
  const mins = entries.filter((e) => e.kind.startsWith("move:") && e.day >= from).reduce((a, e) => a + e.minutes, 0);
  const pct = Math.min(1, mins / WEEK_GOAL);
  return (
    <div className="week-ring" aria-label={`${Math.round(mins)} of ${WEEK_GOAL} active minutes in the last 7 days`}>
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" pathLength="1" className="week-ring__bg" />
        <motion.circle cx="50" cy="50" r="42" pathLength="1" className="week-ring__fill" initial={{ pathLength: 0 }} animate={{ pathLength: Math.max(0.001, pct) }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.4 }} />
      </svg>
      <div>
        <strong>{Math.round(mins)}</strong>
        <span>of {WEEK_GOAL} min<br />this week</span>
      </div>
    </div>
  );
}

export default function MovePage() {
  const [open, setOpen] = useState<Routine | null>(null);
  const [walkMins, setWalkMins] = useState(10);
  const [run, setRun] = useState<{ r: Routine; m?: number } | null>(null);
  const [kind, setKind] = useState<Routine["kind"] | "all">("all");
  const start = (r: Routine, m?: number) => {
    unlockChime();
    setOpen(null);
    setRun({ r, m });
  };
  const walk = ROUTINES[0];
  const f = flags(useAbout().considerations);
  const shown = ROUTINES.filter((r) => kind === "all" || r.kind === kind);

  return (
    <ZoomPage className="rooted move">
      <header className="sec-hero move__hero">
        <Aurora />
        <div className="move__demo" aria-hidden="true"><Figure a="cow" b="cat" period={7} /></div>
        <div className="sec-hero__text">
          <motion.span className="rooted__eyebrow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>Rooted · Move</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.7 }}>Gentle movement,<br />every day.</motion.h1>
          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32, duration: 0.7 }}>
            Low-impact routines you can follow along with: walking, stretching, yoga, tai chi and qigong. Every move shows an easier option. No equipment, no gym.
          </motion.p>
          <motion.div className="breathe__cta" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42, duration: 0.7 }}>
            <button className="btn btn--primary btn--big" onClick={() => start(walk, 10)}><Icon name="play" size={22} /> Start a 10-minute walk</button>
            <WeekRing />
          </motion.div>
        </div>
      </header>

      <SecTabs tabs={TABS} />

      <section id="programs" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Programs</span>
          <h2>A few days to a new habit</h2>
        </Reveal>
        <ProgramRail section="move" />
      </section>

      <section id="routines" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Routines</span>
          <h2>Press play and follow along</h2>
          {f.seated && <p className="for-you"><span><strong>Based on your profile:</strong> Desk reset is fully seated. In other routines, use the easier option shown on each move.</span></p>}
          <p className="rooted__lead">The figure shows each move, a chime tells you when to switch, and you can pause or skip any time.</p>
        </Reveal>
        <div className="pantry__cats move__kinds" role="group" aria-label="Filter routines">
          {(["all", ...Object.keys(KIND_LABEL)] as const).map((k) => (
            <button key={k} className={`chip ${kind === k ? "is-on" : ""}`} aria-pressed={kind === k} onClick={() => setKind(k as Routine["kind"] | "all")}>
              {k === "all" ? "All" : KIND_LABEL[k as Routine["kind"]]}
            </button>
          ))}
        </div>
        <motion.div className="routines" layout>
          <AnimatePresence initial={false}>
            {shown.map((r) => (
              <motion.div key={r.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                <TiltCard className="routine" onClick={() => setOpen(r)} label={`${r.name}, ${r.minutes} minutes`} style={{ "--h": r.hue } as React.CSSProperties}>
                  <div className="routine__art"><Figure a={r.moves[0].a} b={r.moves[0].b} period={r.moves[0].period} /></div>
                  <div className="routine__text">
                    <span className="tech__short">{KIND_LABEL[r.kind]} · {r.kind === "walk" ? "2–20" : r.minutes} min</span>
                    <h3>{r.name}</h3>
                    <p>{r.when}</p>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      <section id="works" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">What it works</span>
          <h2>See where each routine reaches</h2>
          <p className="rooted__lead">Pick a routine to light up the muscles it stretches and strengthens.</p>
        </Reveal>
        <Reveal><WhatItWorks /></Reveal>
      </section>

      <section id="why" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Why move</span>
          <h2>What the evidence says</h2>
        </Reveal>
        <div className="findings">
          {MOVE_FINDINGS.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.06}>
              <div className="finding move-finding" style={{ "--h": f.hue } as React.CSSProperties}>
                <span className="finding__stat">{f.stat}</span>
                <span className="finding__label">{f.statLabel}</span>
                <h3>{f.title}</h3>
                <p className="move-finding__body">{f.body}</p>
                <div className="finding__foot"><Evidence s={f.evidence} short /></div>
                <SourceLink s={f.source} />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="sauna" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Heat</span>
          <h2>Using a sauna safely</h2>
          {f.careSauna && <p className="for-you"><span><strong>Based on your profile:</strong> talk to your doctor before using a sauna.</span></p>}
          <p className="rooted__lead">Regular sauna use is linked with heart and relaxation benefits, mostly from observational studies. Heat is a real stress on the body, so go easy.</p>
        </Reveal>
        <div className="fasting">
          <Reveal className="r-card fasting__main">
            <ul>{SAUNA.how.map((h) => <li key={h}>{h}</li>)}</ul>
            <p className="nourish__src"><SourceLink s={SAUNA.source} /></p>
          </Reveal>
          <Reveal delay={0.08} className="r-card fasting__no">
            <h3>Skip it, or ask your doctor first, if you are:</h3>
            <ul>{SAUNA.noGo.map((h) => <li key={h}>{h}</li>)}</ul>
          </Reveal>
        </div>
      </section>

      <p className="nourish__disclaimer">
        Move gently and within what feels okay. Stop if you feel pain, dizziness, chest discomfort or shortness of breath. If you have a heart condition, are
        pregnant, recovering from injury or surgery, or haven't been active in a while, check with your doctor about what's right for you.
      </p>

      <Sheet open={!!open} onClose={() => setOpen(null)} label={open?.name ?? ""}>
        {open && (
          <article className="tdetail" style={{ "--h": open.hue } as React.CSSProperties}>
            <div className="tdetail__top routine-detail__top">
              <div className="routine-detail__fig"><Figure a={open.moves[0].a} b={open.moves[0].b} period={open.moves[0].period} /></div>
              <span className="rooted__eyebrow">{KIND_LABEL[open.kind]}</span>
              <h2>{open.name}</h2>
              <p>{open.when}</p>
            </div>
            <div className="tdetail__body">
              {open.options ? (
                <div className="tdetail__mins" role="radiogroup" aria-label="How long">
                  {open.options.map((m) => <button key={m} role="radio" aria-checked={walkMins === m} className={`chip ${walkMins === m ? "is-on" : ""}`} onClick={() => setWalkMins(m)}>{m} min</button>)}
                </div>
              ) : null}
              <button className="btn btn--primary btn--big" onClick={() => start(open, open.options ? walkMins : undefined)}><Icon name="play" size={22} /> Start{open.options ? "" : ` · ${open.minutes} min`}</button>
              <ScheduleButton draft={{ title: open.name, kind: "move", minutes: open.options ? walkMins : open.minutes, repeat: open.id === "walk" ? "weekdays" : "daily", to: "/move", time: open.id === "walk" ? "12:45" : open.kind === "stretch" && open.id === "wake" ? "07:00" : "18:30" }} label="Add to calendar" />
              {ROUTINE_MUSCLES[open.id] && <div className="routine-detail__map"><MuscleMap muscles={ROUTINE_MUSCLES[open.id].muscles} /></div>}
              {!open.options && (
                <ol className="move-list">
                  {open.moves.map((m) => (
                    <li key={m.name}>
                      <span className="move-list__fig"><Figure a={m.a} b={m.b} period={m.period} /></span>
                      <span><strong>{m.name}</strong>{m.sides && <em> · both sides</em>}<small>{m.cue}</small></span>
                      <b>{Math.round(m.secs)}s</b>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </article>
        )}
      </Sheet>

      <AnimatePresence>{run && <MovePlayer key={run.r.id} routine={run.r} minutes={run.m} onClose={() => setRun(null)} />}</AnimatePresence>
      <Footer />
    </ZoomPage>
  );
}
