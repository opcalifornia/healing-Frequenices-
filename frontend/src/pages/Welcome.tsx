import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Aurora } from "../rooted/motion";
import { ACTIVITY, CONSIDERATIONS, GOALS, useAbout, useWellness, type AboutYou, type GoalId } from "../store/wellness";
import { dayPlan, slotFor, SLOT_LABEL, GOAL_SHORT, type Slot } from "../rooted/plan";
import { useActiveProfile } from "../store/user";
import { Icon } from "../components/Icon";
import { APP_NAME } from "../brand";
import "../rooted/rooted.css";
import "./Welcome.css";

const STEPS = ["hello", "goals", "activity", "time", "health", "plan"] as const;
type Step = (typeof STEPS)[number];

/** Onboarding at /welcome, and the same questions for editing at /about-you. */
export default function Welcome() {
  const editing = useLocation().pathname === "/about-you";
  const saved = useAbout();
  const setAbout = useWellness((s) => s.setAbout);
  const profile = useActiveProfile();
  const navigate = useNavigate();
  const [draft, setDraft] = useState<AboutYou>(saved);
  const [step, setStep] = useState<Step>(editing ? "goals" : "hello");
  const [dir, setDir] = useState(1);
  const idx = STEPS.indexOf(step);

  const go = (s: Step) => {
    setDir(STEPS.indexOf(s) > idx ? 1 : -1);
    setStep(s);
  };
  const next = () => go(STEPS[Math.min(STEPS.length - 1, idx + 1)]);
  const back = () => go(STEPS[Math.max(editing ? 1 : 0, idx - 1)]);
  const toggleGoal = (g: GoalId) =>
    setDraft((d) => ({ ...d, goals: d.goals.includes(g) ? d.goals.filter((x) => x !== g) : d.goals.length >= 3 ? d.goals : [...d.goals, g] }));
  const finish = () => {
    setAbout({ ...draft, onboarded: true, skipped: false });
    navigate("/");
  };
  const skip = () => {
    setAbout({ skipped: true });
    navigate("/");
  };

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d * 60 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d * -60 }),
  };

  return (
    <motion.main id="main" tabIndex={-1} className="page rooted welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Aurora />
      <div className="welcome__frame">
        {step !== "hello" && (
          <div className="welcome__top">
            <button className="icon-btn" onClick={back} aria-label="Back" disabled={editing && step === "goals"}><Icon name="back" /></button>
            <div className="welcome__dots" aria-label={`Step ${idx} of ${STEPS.length - 1}`}>
              {STEPS.slice(1).map((s, i) => <motion.i key={s} animate={{ width: i + 1 === idx ? 28 : 8, opacity: i + 1 <= idx ? 1 : 0.3 }} />)}
            </div>
            <button className="welcome__skip" onClick={editing ? () => navigate(-1) : skip}>{editing ? "Cancel" : "Skip"}</button>
          </div>
        )}

        <AnimatePresence mode="wait" custom={dir}>
          <motion.section key={step} className="welcome__step" custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
            {step === "hello" && (
              <div className="welcome__hello">
                <motion.div className="welcome__seed" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 120, damping: 12, delay: 0.1 }} aria-hidden="true">
                  <span /><span /><span />
                </motion.div>
                <h1>Let's make {APP_NAME} yours{profile ? `, ${profile.name}` : ""}.</h1>
                <p>Four quick questions, under a minute. We'll use your answers to plan a few small things each day, and to flag anything that might not be right for you.</p>
                <button className="btn btn--primary btn--big" onClick={next}>Let's go</button>
                <button className="welcome__skip" onClick={skip}>Not now</button>
              </div>
            )}

            {step === "goals" && (
              <>
                <h2>What do you want most right now?</h2>
                <p className="welcome__hint">Pick up to three. Your first pick counts the most.</p>
                <div className="goal-grid">
                  {GOALS.map((g) => {
                    const on = draft.goals.includes(g.id);
                    const rank = draft.goals.indexOf(g.id);
                    return (
                      <motion.button key={g.id} className={`goal ${on ? "is-on" : ""}`} aria-pressed={on} onClick={() => toggleGoal(g.id)} whileTap={{ scale: 0.96 }} style={{ "--h": g.hue } as React.CSSProperties}>
                        <span className="goal__glow" aria-hidden="true" />
                        <strong>{g.label}</strong>
                        <span>{g.blurb}</span>
                        <AnimatePresence>{on && <motion.b className="goal__rank" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>{rank + 1}</motion.b>}</AnimatePresence>
                      </motion.button>
                    );
                  })}
                </div>
                <button className="btn btn--primary btn--big welcome__next" onClick={next} disabled={!draft.goals.length}>Continue</button>
              </>
            )}

            {step === "activity" && (
              <>
                <h2>How active are you these days?</h2>
                <p className="welcome__hint">No wrong answer. We'll start where you are.</p>
                <div className="choice-list">
                  {ACTIVITY.map((a) => (
                    <button key={a.id} className={`choice ${draft.activity === a.id ? "is-on" : ""}`} aria-pressed={draft.activity === a.id} onClick={() => { setDraft({ ...draft, activity: a.id }); setTimeout(next, 220); }}>
                      <strong>{a.label}</strong><span>{a.blurb}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === "time" && (
              <>
                <h2>How much time can you give it a day?</h2>
                <p className="welcome__hint">Small and daily beats big and rare.</p>
                <div className="choice-list choice-list--row">
                  {([5, 10, 20] as const).map((m) => (
                    <button key={m} className={`choice choice--big ${draft.minutes === m ? "is-on" : ""}`} aria-pressed={draft.minutes === m} onClick={() => { setDraft({ ...draft, minutes: m }); setTimeout(next, 220); }}>
                      <strong>{m}</strong><span>minutes</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === "health" && (
              <>
                <h2>Anything we should know?</h2>
                <p className="welcome__hint">Optional, and it stays on this device. We only use it to flag practices and foods that may not be right for you. It isn't medical advice.</p>
                <div className="health-list">
                  {CONSIDERATIONS.map((c) => {
                    const on = draft.considerations.includes(c.id);
                    return (
                      <button key={c.id} className={`health ${on ? "is-on" : ""}`} role="checkbox" aria-checked={on} onClick={() => setDraft({ ...draft, considerations: on ? draft.considerations.filter((x) => x !== c.id) : [...draft.considerations, c.id] })}>
                        <span className="slist__check">{on && <Icon name="check" size={16} />}</span>{c.label}
                      </button>
                    );
                  })}
                </div>
                <button className="btn btn--primary btn--big welcome__next" onClick={next}>{draft.considerations.length ? "Continue" : "None of these"}</button>
              </>
            )}

            {step === "plan" && <PlanReveal about={draft} onDone={finish} editing={editing} />}
          </motion.section>
        </AnimatePresence>
      </div>
    </motion.main>
  );
}

function PlanReveal({ about, onDone, editing }: { about: AboutYou; onDone(): void; editing: boolean }) {
  const slots: Slot[] = ["morning", "midday", "evening"];
  const current = slotFor(new Date().getHours());
  const day = dayPlan(about);
  return (
    <>
      <h2>Here's your daily rhythm.</h2>
      <p className="welcome__hint">Built around wanting to {about.goals.map((g) => GOAL_SHORT[g]).join(", ").replace(/, ([^,]*)$/, " and $1")}. It changes through the day on your Home screen.</p>
      <div className="rhythm">
        {slots.map((s, si) => (
          <motion.div key={s} className={`rhythm__slot ${s === current ? "is-now" : ""}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + si * 0.12 }}>
            <span className="rooted__eyebrow">{SLOT_LABEL[s].replace("This ", "")}</span>
            <ul>
              {day[s].map((i) => (
                <li key={i.id}><Icon name={i.icon} size={18} /> {i.title}{i.minutes ? <em>{i.minutes} min</em> : null}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
      <button className="btn btn--primary btn--big welcome__next" onClick={onDone}>{editing ? "Save" : "Take me home"}</button>
    </>
  );
}
