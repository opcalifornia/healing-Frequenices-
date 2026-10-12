import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Aurora } from "../rooted/motion";
import { Evidence } from "../rooted/ui";
import { BreathPlayer } from "../rooted/BreathPlayer";
import { TECHNIQUES } from "../rooted/breathContent";
import { pickFor, slotFor } from "../rooted/plan";
import { flags, useAbout, useWellness, type GoalId } from "../store/wellness";
import { usePractice } from "../store/practice";
import { todayKey } from "../store/nourish";
import { useActiveProfile } from "../store/user";
import { Icon } from "../components/Icon";
import { track } from "../rooted/metrics";
import "../rooted/rooted.css";
import "./FirstWin.css";

/**
 * The first 60 seconds: pick what brought you here, rate how you feel, do one
 * guided minute, rate again, see the difference. One small win before anything else.
 */

type Goal = "stress" | "sleep" | "energy" | "focus";
type Step = "goal" | "before" | "ready" | "after" | "result";

const GOALS: Array<{ id: Goal; emoji: string; label: string; blurb: string; hue: number }> = [
  { id: "stress", emoji: "🌊", label: "Stress", blurb: "Feel calmer", hue: 200 },
  { id: "sleep", emoji: "🌙", label: "Sleep", blurb: "Wind down and rest", hue: 240 },
  { id: "energy", emoji: "☀️", label: "Energy", blurb: "Clear the fog", hue: 40 },
  { id: "focus", emoji: "🎯", label: "Focus", blurb: "Steady your mind", hue: 150 },
];

const QUESTION: Record<Goal, { q: string; low: string; high: string }> = {
  stress: { q: "How tense or stressed do you feel right now?", low: "Totally calm", high: "Very stressed" },
  sleep: { q: "How wound up do you feel right now?", low: "Ready to rest", high: "Very wired" },
  energy: { q: "How foggy or drained do you feel right now?", low: "Clear and awake", high: "Very drained" },
  focus: { q: "How scattered does your mind feel right now?", low: "Clear and steady", high: "All over the place" },
};

const WHY: Record<Goal, string> = {
  stress: "Breathing out longer than you breathe in signals your body's calming system. It's one of the best-studied quick ways to settle stress.",
  sleep: "A long, slow exhale slows your heart rate a little and helps your body shift toward rest. Try it again in bed tonight.",
  energy: "Even, steady breathing with good posture can help clear mental fog. Pair it with daylight and water for a bigger lift.",
  focus: "Box breathing gives your attention one simple thing to hold. Many people use it before a big moment.",
};

const PLAN_GOAL: Record<Goal, GoalId> = { stress: "stress", sleep: "sleep", energy: "energy", focus: "focus" };

export default function FirstWin() {
  const navigate = useNavigate();
  const profile = useActiveProfile();
  const about = useAbout();
  const setAbout = useWellness((s) => s.setAbout);
  const annotate = usePractice((s) => s.annotateLast);
  const [step, setStep] = useState<Step>("goal");
  const [goal, setGoal] = useState<Goal>("stress");
  const [before, setBefore] = useState(6);
  const [after, setAfter] = useState(6);
  const [playing, setPlaying] = useState(false);

  const f = flags(about.considerations);
  const technique = useMemo(() => {
    const id = goal === "focus" || goal === "energy" ? (f.breathHoldCare ? "calm" : "box") : "calm";
    return TECHNIQUES.find((t) => t.id === id) ?? TECHNIQUES[0];
  }, [goal, f.breathHoldCare]);

  const plan = useMemo(() => pickFor({ ...about, goals: [PLAN_GOAL[goal]] }, slotFor(new Date().getHours()), 3), [about, goal]);

  const finishPractice = () => {
    setPlaying(false);
    setAfter(before);
    setStep("after");
  };

  const showResult = () => {
    if (goal === "stress" || goal === "sleep") annotate(`breath:${technique.id}`, { before, after });
    const goals = about.goals.includes(PLAN_GOAL[goal]) ? about.goals : [PLAN_GOAL[goal], ...about.goals].slice(0, 3);
    setAbout({ goals, firstWin: { goal: PLAN_GOAL[goal], before, after, day: todayKey() } });
    setStep("result");
    track("first_win_completed");
  };

  const q = QUESTION[goal];
  const drop = before - after;
  const g = GOALS.find((x) => x.id === goal)!;

  return (
    <main id="main" tabIndex={-1} className="rooted fwin" style={{ ["--h" as string]: g.hue }}>
      <Aurora />
      <div className="fwin__top">
        <span className="fwin__dots" aria-label={`Step ${["goal", "before", "ready", "after", "result"].indexOf(step) + 1} of 5`}>
          {(["goal", "before", "ready", "after", "result"] as Step[]).map((s) => <i key={s} className={s === step ? "is-on" : ""} />)}
        </span>
        <Link to="/" className="fwin__skip">Skip for now</Link>
      </div>

      <AnimatePresence mode="wait">
        <motion.section key={step} className="fwin__card" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
          {step === "goal" && (
            <>
              <span className="rooted__eyebrow">Welcome{profile && !["listener", "guest"].includes(profile.name.toLowerCase()) ? `, ${profile.name}` : ""}</span>
              <h1>What brought you here today?</h1>
              <p className="fwin__lede">Pick one. In about a minute you'll feel the difference for yourself.</p>
              <div className="fwin__goals">
                {GOALS.map((x) => (
                  <button key={x.id} className="fwin__goal" style={{ ["--h" as string]: x.hue }} onClick={() => { setGoal(x.id); setStep("before"); track("first_win_started"); }}>
                    <span className="fwin__emoji" aria-hidden="true">{x.emoji}</span>
                    <b>{x.label}</b>
                    <small>{x.blurb}</small>
                  </button>
                ))}
              </div>
            </>
          )}

          {(step === "before" || step === "after") && (
            <>
              <span className="rooted__eyebrow">{step === "before" ? "Quick check-in" : "And now?"}</span>
              <h1>{step === "before" ? q.q : "How do you feel after that minute?"}</h1>
              <Scale value={step === "before" ? before : after} onChange={step === "before" ? setBefore : setAfter} low={q.low} high={q.high} />
              <button className="btn btn--primary btn--big" onClick={() => (step === "before" ? setStep("ready") : showResult())}>
                {step === "before" ? "Next" : "See my result"} <Icon name="chevronRight" size={20} />
              </button>
            </>
          )}

          {step === "ready" && (
            <>
              <span className="rooted__eyebrow">One minute</span>
              <h1>{technique.name}</h1>
              <p className="fwin__lede">{technique.short}. Sit comfortably, let your shoulders soften, and follow the circle. Breathe through your nose if you can.</p>
              <div className="fwin__orb" aria-hidden="true"><span /><span /><span /></div>
              <button className="btn btn--primary btn--big" onClick={() => setPlaying(true)}><Icon name="play" size={22} /> Start my minute</button>
              <p className="fwin__fine">Feel dizzy or uncomfortable? Stop and breathe normally.</p>
            </>
          )}

          {step === "result" && (
            <>
              <span className="rooted__eyebrow">Your first minute</span>
              <h1>{drop >= 2 ? "That's a real shift." : drop >= 1 ? "A little lighter." : "That's a start."}</h1>
              <div className="fwin__compare" role="img" aria-label={`Before ${before} out of 10, after ${after} out of 10`}>
                <Bar label="Before" value={before} tone="before" />
                <Bar label="After" value={after} tone="after" />
              </div>
              <p className="fwin__lede">
                {drop >= 1
                  ? `You went from ${before} to ${after} in one minute. ${WHY[goal]}`
                  : `No change this time, and that's normal. It often takes a few tries, or a different time of day. ${WHY[goal]}`}
              </p>
              <p className="fwin__ev"><Evidence s="Moderate" /> for slow breathing and short-term calm</p>
              <div className="fwin__plan">
                <h2>Your plan for today</h2>
                <ul>
                  {plan.map((p) => (
                    <li key={p.id}><Link to={p.to}><span>{p.minutes ? `${p.minutes} min` : "Habit"}</span><b>{p.title}</b><Icon name="chevronRight" size={18} /></Link></li>
                  ))}
                </ul>
              </div>
              <div className="fwin__actions">
                <button className="btn btn--primary btn--big" onClick={() => navigate("/?tour=1")}>Show me around</button>
                <Link to="/welcome" className="btn btn--secondary">Personalize more (30 sec)</Link>
              </div>
            </>
          )}
        </motion.section>
      </AnimatePresence>

      <AnimatePresence>{playing && <BreathPlayer technique={technique} minutes={1} onClose={() => setPlaying(false)} onComplete={finishPractice} />}</AnimatePresence>
    </main>
  );
}

function Scale({ value, onChange, low, high }: { value: number; onChange(n: number): void; low: string; high: string }) {
  return (
    <div className="fwin__scale">
      <div className="fwin__nums" role="radiogroup" aria-label={`0 is ${low}, 10 is ${high}`}>
        {Array.from({ length: 11 }, (_, n) => (
          <button key={n} role="radio" aria-checked={value === n} className={value === n ? "is-on" : ""} onClick={() => onChange(n)} style={{ ["--n" as string]: n }}>
            {n}
          </button>
        ))}
      </div>
      <div className="fwin__ends"><span>{low}</span><span>{high}</span></div>
    </div>
  );
}

function Bar({ label, value, tone }: { label: string; value: number; tone: "before" | "after" }) {
  return (
    <div className={`fwin__bar fwin__bar--${tone}`}>
      <span className="fwin__barlabel">{label}</span>
      <span className="fwin__track"><motion.i initial={{ width: 0 }} animate={{ width: `${Math.max(4, value * 10)}%` }} transition={{ duration: 0.8, delay: tone === "after" ? 0.4 : 0.1, ease: [0.22, 1, 0.36, 1] }} /></span>
      <b>{value}</b>
    </div>
  );
}
