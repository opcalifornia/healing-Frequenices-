import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { safeTechnique } from "../rooted/programs";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal, ZoomPage } from "../rooted/motion";
import { Evidence, SecTabs, Sheet, SourceLink } from "../rooted/ui";
import { GROUNDING, PMR, PMR_SOURCE, TECHNIQUES, type Technique } from "../rooted/breathContent";
import { BreathPlayer } from "../rooted/BreathPlayer";
import { BreathingBody, HeartRhythm } from "../rooted/BreatheDiagrams";
import { ProgramRail } from "../rooted/ProgramRail";
import { HeartCheck } from "../rooted/HeartCheck";
import { ReminderCard } from "../rooted/ReminderCard";
import { BoltTest, CustomList, PatternBuilder, Results } from "../rooted/BreatheExtras";
import { PaceFinder } from "../rooted/PaceFinder";
import { BreatheHero, TechRails, ToolCards } from "../rooted/BreatheAura";
import { HeartConnect } from "../rooted/HeartLive";
import { BREATHE_GUIDE, SectionGuide, useFirstVisitGuide } from "../rooted/SectionGuide";
import { BreatheLearn } from "../rooted/BreatheLearn";
import { LearnHub } from "../rooted/BreatheLearnHub";
import { LEARN_DATA } from "../rooted/breatheLessons";
import { chime, unlockChime } from "../rooted/chime";
import { minutesOn, practiceStreak, usePractice, usePracticeLog } from "../store/practice";
import { flags, useAbout } from "../store/wellness";
import { Footer } from "../components/Footer";
import { Icon } from "../components/Icon";
import { ScheduleButton } from "../rooted/CalendarUI";
import "../rooted/rooted.css";
import "./BrainGuide.css";
import "./Nourish.css";
import "./Breathe.css";
import "./Combos.css";
import "./Programs.css";

const TABS = [
  { id: "programs", label: "Programs" },
  { id: "breathe", label: "Breathing" },
  { id: "pace", label: "Find your pace" },
  { id: "results", label: "Your results" },
  { id: "body", label: "Inside your body" },
  { id: "heart", label: "Heart check" },
  { id: "bolt", label: "Breath test" },
  { id: "ground", label: "Grounding" },
  { id: "relax", label: "Muscle relaxation" },
  { id: "learnmore", label: "Learn" },
];

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
  const [building, setBuilding] = useState(false);
  const [guide, setGuide] = useFirstVisitGuide(BREATHE_GUIDE.key);
  const entries = usePracticeLog();
  const f = flags(useAbout().considerations);
  const notForYou = (t: Technique) => (t.id === "power" && f.noPowerBreathing) || ((t.id === "box" || t.id === "478") && f.breathHoldCare);
  const today = minutesOn(entries);
  const streak = practiceStreak(entries);

  const start = (t: Technique, m: number) => {
    unlockChime();
    setOpen(null);
    setRun({ t, m });
  };

  // "?open=box" (from GAIA or a link) opens that technique, swapped for a safe one if needed.
  const [params, setParams] = useSearchParams();
  useEffect(() => {
    const id = params.get("open");
    if (!id) return;
    const t = TECHNIQUES.find((x) => x.id === safeTechnique(id, f));
    if (t) setOpen(t);
    params.delete("open");
    setParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return (
    <ZoomPage className="rooted breathe">
      <SectionGuide guide={BREATHE_GUIDE} open={guide} onClose={() => setGuide(false)} onGo={(to) => setTimeout(() => document.getElementById(to)?.scrollIntoView({ behavior: "smooth", block: "start" }), 400)} />
      <BreatheHero onStart={start} onGuide={() => setGuide(true)} today={today} streak={streak} />

      <SecTabs tabs={TABS} />

      <section id="programs" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Programs</span>
          <h2>Build the habit, a day at a time</h2>
          <p className="rooted__lead">Short daily lessons that teach you why, guide you through it, and check in on what's working.</p>
        </Reveal>
        <ProgramRail section="breathe" />
      </section>

      <section id="breathe" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Breathing</span>
          <h2>Pick what you need</h2>
          <p className="rooted__lead">Each one says when to use it and how strong the evidence is.</p>
        </Reveal>
        <TechRails onOpen={(t) => { setOpen(t); setMins(t.minutes[0] ?? 0); }} notForYou={notForYou} />
        <Reveal className="sec-block__head nourish__subhead">
          <h2>Your patterns</h2>
          <p className="rooted__lead">Set your own counts for breathing in, holding and breathing out.</p>
        </Reveal>
        <CustomList onStart={start} onBuild={() => setBuilding(true)} />
      </section>

      <section id="tools" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Tools</span>
          <h2>Know your body</h2>
          <p className="rooted__lead">Find your pace, check your pulse, time a gentle hold, or come back to the room.</p>
        </Reveal>
        <ToolCards />
        <HeartConnect />
      </section>

      <section id="pace" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Resonance pace</span>
          <h2>Find the slow pace that suits you</h2>
          <p className="rooted__lead">Slow breathing at about six breaths a minute is the most studied pace for heart rhythm. Everyone's easiest pace is a little different.</p>
        </Reveal>
        <Reveal><PaceFinder onStart={start} /></Reveal>
      </section>

      <section id="results" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Your results</span>
          <h2>See what works for you</h2>
          <p className="rooted__lead">Rate your stress before and after a session. Over time, you'll see which techniques actually help you most.</p>
        </Reveal>
        <Reveal><Results /></Reveal>
        <Reveal className="remind-wrap"><ReminderCard /></Reveal>
      </section>

      <section id="body" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Inside your body</span>
          <h2>What happens when you breathe</h2>
          <p className="rooted__lead">The diagram breathes with a relaxed 4-in, 6-out rhythm. Breathe along, and tap each part to learn what it does.</p>
        </Reveal>
        <Reveal><BreathingBody /></Reveal>
        <Reveal className="sec-block__head nourish__subhead">
          <h2>Why a long exhale slows your heart</h2>
          <p className="rooted__lead">Switch between normal and slow breathing, and drag across the chart.</p>
        </Reveal>
        <Reveal><HeartRhythm /></Reveal>
      </section>

      <section id="heart" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Heart check</span>
          <h2>Watch your heart respond</h2>
          <p className="rooted__lead">Measure your heart rate and heart rate variability with your phone's camera, before and after you breathe.</p>
        </Reveal>
        <Reveal><HeartCheck /></Reveal>
      </section>

      <section id="bolt" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Breath test</span>
          <h2>Measure your breathing, track it weekly</h2>
          <p className="rooted__lead">A 1-minute self-test that breathing coaches use to gauge how relaxed your breathing is.</p>
        </Reveal>
        <Reveal><BoltTest /></Reveal>
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
              {notForYou(open) && (
                <p className="for-you"><span><strong>Based on your profile:</strong> {open.id === "power" ? "power breathing isn't advised with what you told us. Try Settle in or the physiological sigh instead." : "this one includes breath holds. Keep them short and gentle, or try Settle in instead, and check with your doctor."}</span></p>
              )}
              {open.rounds && <p className="tdetail__rounds">{open.rounds.count} rounds of {open.rounds.breaths} breaths, each followed by a breath hold. About 8 minutes.</p>}
              {open.id === "power" && f.noPowerBreathing ? (
                <button className="btn btn--primary btn--big" onClick={() => start(TECHNIQUES[0], 3)}><Icon name="play" size={22} /> Try Settle in instead</button>
              ) : (
                <button className="btn btn--primary btn--big" onClick={() => start(open, mins)}><Icon name="play" size={22} /> Start</button>
              )}
              <ScheduleButton draft={{ title: `Breathe: ${open.name}`, kind: "breathe", minutes: Math.max(2, mins), repeat: "daily", to: "/breathe", time: "15:00" }} label="Make it a habit: add to calendar" />
              <section>
                <h3>Why it works <Evidence s={open.evidence} /></h3>
                <p>{open.why}</p>
              </section>
              <ul className="pdetail__sources">{open.sources.map((s) => <li key={s.text}><SourceLink s={s} /></li>)}</ul>
            </div>
          </article>
        )}
      </Sheet>

      <Sheet open={building} onClose={() => setBuilding(false)} label="Build a breathing pattern">
        <PatternBuilder onStart={start} onDone={() => setBuilding(false)} />
      </Sheet>

      <AnimatePresence>{run && <BreathPlayer key={`${run.t.id}-${run.m}`} technique={run.t} minutes={run.m} onClose={() => setRun(null)} />}</AnimatePresence>
      <section id="learnmore" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Learn more</span>
          <h2>Understand your breath</h2>
          <p className="rooted__lead">Lessons on your lungs, your brain and your heart, the researchers behind them, the myths to drop, and a glossary. Every claim has an evidence rating and sources you can open.</p>
        </Reveal>
        <Reveal><LearnHub data={LEARN_DATA} onTry={(l) => {
          const id = l.tryIt?.technique;
          const t = id ? TECHNIQUES.find((x) => x.id === id) : undefined;
          if (t) { setOpen(t); setMins(t.minutes[0] ?? 0); return; }
          const to = l.tryIt?.to?.replace(/^.*#/, "");
          if (to) setTimeout(() => document.getElementById(to)?.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
        }} /></Reveal>
        <Reveal className="sec-block__head nourish__subhead"><h2>Safety and free reading</h2></Reveal>
        <Reveal><BreatheLearn /></Reveal>
      </section>
      <Footer />
    </ZoomPage>
  );
}
