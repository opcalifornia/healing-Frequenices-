import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { STEP_LABEL, type Combo, type ComboStep } from "./comboContent";
import { TECHNIQUES, GROUNDING } from "./breathContent";
import { ROUTINES } from "./moveContent";
import { BreathPlayer } from "./BreathPlayer";
import { MovePlayer } from "./MovePlayer";
import { chime } from "./chime";
import { usePractice } from "../store/practice";
import { useJournal } from "../store/journal";
import { GLASS, useNourish } from "../store/nourish";
import { useCatalog } from "../store/catalog";
import { usePlayer } from "../store/player";
import { Icon, type IconName } from "../components/Icon";
import { soundsLikeCrisis } from "./supportContent";
import { CrisisNudge } from "./Crisis";

const ICON: Record<ComboStep["type"], IconName> = { breath: "timer", move: "replay", check: "check", timer: "timer", reflect: "edit", ground: "sparkle", frequency: "headphones" };

export function stepName(s: ComboStep): string {
  switch (s.type) {
    case "breath": return TECHNIQUES.find((t) => t.id === s.technique)?.name ?? "Breathing";
    case "move": return ROUTINES.find((r) => r.id === s.routine)?.name ?? "Movement";
    case "check": case "timer": return s.title;
    case "reflect": return s.prompt;
    case "ground": return "5-4-3-2-1 grounding";
    case "frequency": return s.title;
  }
}
export { ICON as STEP_ICON };

export function ComboPlayer({ combo, steps, onClose }: { combo: Combo; steps: ComboStep[]; onClose(): void }) {
  const [i, setI] = useState(0);
  const [phase, setPhase] = useState<"intro" | "run">("intro");
  const [done, setDone] = useState(false);
  const [started] = useState(() => performance.now());
  const log = usePractice((s) => s.log);
  const step = steps[i];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // Breath and move steps get a short "up next" card, then start on their own.
  useEffect(() => {
    if (phase !== "intro" || done) return;
    if (step.type !== "breath" && step.type !== "move") {
      setPhase("run");
      return;
    }
    const id = setTimeout(() => setPhase("run"), 2600);
    return () => clearTimeout(id);
  }, [phase, step, done]);

  const finishCombo = () => log(`combo:${combo.id}`, (performance.now() - started) / 60000);
  const next = () => {
    chime("top", 0.05);
    if (i + 1 >= steps.length) {
      finishCombo();
      setDone(true);
      chime("bell", 0.09);
      return;
    }
    setI(i + 1);
    setPhase("intro");
  };

  const embedded = phase === "run" && !done && (step.type === "breath" || step.type === "move");

  return createPortal(
    <>
      <motion.div className="cp rooted" role="dialog" aria-modal="true" aria-label={combo.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ "--h": combo.hue, "--h2": combo.hue2 } as React.CSSProperties}>
        <div className="cp__bg" aria-hidden="true" />
        <header className="cp__top">
          <button className="icon-btn" onClick={onClose} aria-label="Exit combo"><Icon name="close" /></button>
          <ol className="cp__steps" aria-label={`Step ${i + 1} of ${steps.length}`}>
            {steps.map((s, k) => (
              <li key={k} className={k < i || done ? "is-done" : k === i ? "is-now" : ""} title={stepName(s)}>
                <Icon name={k < i || done ? "check" : ICON[s.type]} size={16} />
              </li>
            ))}
          </ol>
          <span className="cp__name">{combo.name}</span>
        </header>
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div key="done" className="bp__done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <motion.div className="bp__check" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.1 }}><Icon name="check" size={40} /></motion.div>
              <h2>{combo.name}, done.</h2>
              <p>{steps.length} steps in about {(() => { const m = Math.max(1, Math.round((performance.now() - started) / 60000)); return `${m} minute${m === 1 ? "" : "s"}`; })()}. That's how habits get built.</p>
              <div className="bp__done-actions"><button className="btn btn--primary" onClick={onClose}>Finish</button></div>
            </motion.div>
          ) : phase === "intro" ? (
            <motion.div key={`intro-${i}`} className="cp__intro" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}>
              <span className="rooted__eyebrow">Step {i + 1} of {steps.length} · {STEP_LABEL[step.type]}</span>
              <h2>{stepName(step)}</h2>
              <motion.span className="cp__intro-bar" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 2.6, ease: "linear" }} />
              <button className="btn btn--secondary btn--small" onClick={() => setPhase("run")}>Start now</button>
            </motion.div>
          ) : (
            <motion.div key={`run-${i}`} className="cp__stage" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.35 }}>
              <StepView step={step} onNext={next} onEnd={() => { finishCombo(); onClose(); }} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      {embedded && step.type === "breath" && (
        <BreathPlayer key={`b${i}`} technique={TECHNIQUES.find((t) => t.id === step.technique)!} minutes={step.minutes} onClose={onClose} onComplete={next} />
      )}
      {embedded && step.type === "move" && (
        <MovePlayer key={`m${i}`} routine={ROUTINES.find((r) => r.id === step.routine)!} minutes={step.minutes} onClose={onClose} onComplete={next} />
      )}
    </>,
    document.body,
  );
}

function StepView({ step, onNext, onEnd }: { step: ComboStep; onNext(): void; onEnd(): void }) {
  const addWater = useNourish((s) => s.addWater);
  const addJournal = useJournal((s) => s.add);
  const catalog = useCatalog();
  const playTitle = usePlayer((s) => s.playTitle);
  const [lines, setLines] = useState<string[]>([]);
  const [g, setG] = useState(0);
  const [left, setLeft] = useState(step.type === "timer" ? step.secs : 0);
  const session = useMemo(() => (step.type === "frequency" && catalog ? Object.values(catalog.titles).find((x) => x.kind === "session" && x.goal === step.goal) : undefined), [step, catalog]);

  useEffect(() => {
    if (step.type !== "timer") return;
    if (left <= 0) return onNext();
    const id = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(id);
  }, [step.type, left, onNext]);

  switch (step.type) {
    case "check":
      return (
        <div className="cp__card">
          <span className="cp__icon"><Icon name={step.action === "water" ? "plus" : "check"} size={28} /></span>
          <h2>{step.title}</h2>
          <p>{step.body}</p>
          <motion.button whileTap={{ scale: 0.95 }} className="btn btn--primary btn--big" onClick={() => { if (step.action === "water") addWater(GLASS); onNext(); }}>
            {step.action === "water" ? "Done, log it" : "Done"}
          </motion.button>
          <button className="welcome__skip" onClick={onNext}>Skip</button>
        </div>
      );
    case "timer":
      return (
        <div className="cp__card">
          <h2>{step.title}</h2>
          <p>{step.body}</p>
          <span className="mp__left">{left}</span>
          <button className="welcome__skip" onClick={onNext}>Skip</button>
        </div>
      );
    case "reflect":
      return (
        <div className="cp__card cp__card--wide">
          <h2>{step.prompt}</h2>
          <p>{step.hint}</p>
          <div className="cp__lines">
            {Array.from({ length: step.lines }, (_, k) => (
              <motion.input key={k} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: k * 0.08 }} value={lines[k] ?? ""} onChange={(e) => { const n = [...lines]; n[k] = e.target.value; setLines(n); }} placeholder={`${k + 1}.`} aria-label={`${step.prompt}, line ${k + 1}`} autoFocus={k === 0} />
            ))}
          </div>
          {soundsLikeCrisis(lines.join(" ")) && <CrisisNudge />}
          <button className="btn btn--primary btn--big" onClick={() => { addJournal(step.prompt, lines); onNext(); }}>{lines.some((l) => l?.trim()) ? "Save and continue" : "Continue"}</button>
          <span className="cp__private">Saved privately on this device.</span>
        </div>
      );
    case "ground": {
      const s = GROUNDING[g];
      return (
        <div className="cp__card">
          <AnimatePresence mode="wait">
            <motion.div key={g} className="cp__ground" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <span className="ground__n">{s.n}</span>
              <span className="rooted__eyebrow">Things you can {s.sense}</span>
              <p>{s.prompt}</p>
            </motion.div>
          </AnimatePresence>
          <button className="btn btn--primary btn--big" onClick={() => (g + 1 < GROUNDING.length ? setG(g + 1) : onNext())}>{g + 1 < GROUNDING.length ? "Next" : "Done"}</button>
        </div>
      );
    }
    case "frequency":
      return (
        <div className="cp__card">
          <span className="cp__icon"><Icon name="headphones" size={28} /></span>
          <span className="rooted__eyebrow">Last step</span>
          <h2>{step.title}</h2>
          <p>{session ? `${session.name}: ${session.tagline}` : "Pick a session in Healing Frequencies."} Headphones on, volume low.</p>
          {session && <button className="btn btn--primary btn--big" onClick={() => { playTitle(session); onEnd(); }}><Icon name="play" size={22} /> Start listening</button>}
          <button className="welcome__skip" onClick={onEnd}>Finish without it</button>
        </div>
      );
    default:
      return null;
  }
}
