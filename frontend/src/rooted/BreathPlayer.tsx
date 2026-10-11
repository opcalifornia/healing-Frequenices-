import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { POWER_SAFETY, type Technique } from "./breathContent";
import { buildPlan, planSeconds, type PlanPhase } from "./breathPlan";
import { chime, unlockChime } from "./chime";
import { usePractice } from "../store/practice";
import { useCatalog } from "../store/catalog";
import { usePlayer } from "../store/player";
import { Icon } from "../components/Icon";

type Stage = "gate" | "count" | "run" | "done";

const SCALE: Record<PlanPhase["kind"], number> = { in: 1, top: 1.1, hold: 1, out: 0.5, rest: 0.5 };

interface Props {
  technique: Technique;
  minutes: number;
  onClose(): void;
  /** Inside a combo: skip the done screen and move on. */
  onComplete?(): void;
}

export function BreathPlayer({ technique: t, minutes, onClose, onComplete }: Props) {
  const reduce = useReducedMotion();
  const plan = useMemo(() => buildPlan(t, minutes), [t, minutes]);
  const total = planSeconds(plan);
  const [stage, setStage] = useState<Stage>(t.gated ? "gate" : "count");
  const [count, setCount] = useState(3);
  const [idx, setIdx] = useState(0);
  const [left, setLeft] = useState(plan[0].secs);
  const [paused, setPaused] = useState(false);
  const [sound, setSound] = useState(true);
  const [held, setHeld] = useState<number[]>([]);
  const startedAt = useRef(0);
  const phaseStart = useRef(0);
  const pausedAt = useRef(0);
  const log = usePractice((s) => s.log);
  const catalog = useCatalog();
  const playTitle = usePlayer((s) => s.playTitle);
  const phase = plan[Math.min(idx, plan.length - 1)];
  const soundRef = useRef(sound);
  soundRef.current = sound;

  // Escape closes; keep the screen awake while running.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);
  useEffect(() => {
    if (stage !== "run") return;
    let lock: { release(): Promise<void> } | null = null;
    const nav = navigator as Navigator & { wakeLock?: { request(t: "screen"): Promise<{ release(): Promise<void> }> } };
    nav.wakeLock?.request("screen").then((l) => (lock = l)).catch(() => undefined);
    return () => void lock?.release().catch(() => undefined);
  }, [stage]);

  const cue = useCallback((p: PlanPhase) => {
    if (soundRef.current) chime(p.kind);
    navigator.vibrate?.(p.kind === "hold" || p.kind === "rest" ? [20, 60, 20] : 25);
  }, []);

  // Countdown.
  useEffect(() => {
    if (stage !== "count") return;
    if (count === 0) {
      setStage("run");
      startedAt.current = performance.now();
      phaseStart.current = performance.now();
      cue(plan[0]);
      return;
    }
    const id = setTimeout(() => setCount((c) => c - 1), 800);
    return () => clearTimeout(id);
  }, [stage, count, cue, plan]);

  const finish = useCallback(() => {
    log(`breath:${t.id}`, (performance.now() - startedAt.current) / 60000);
    if (onComplete) return onComplete();
    setStage("done");
    if (soundRef.current) chime("bell", 0.09);
  }, [log, t.id, onComplete]);

  const idxRef = useRef(0);
  const advance = useCallback(() => {
    const n = idxRef.current + 1;
    if (n >= plan.length) {
      finish();
      return;
    }
    idxRef.current = n;
    phaseStart.current = performance.now();
    cue(plan[n]);
    setLeft(plan[n].secs);
    setIdx(n);
  }, [plan, cue, finish]);

  // Phase clock.
  useEffect(() => {
    if (stage !== "run" || paused) return;
    let raf = 0;
    const tick = () => {
      const el = (performance.now() - phaseStart.current) / 1000;
      const remain = phase.secs - el;
      setLeft(remain);
      if (remain <= 0) {
        if (phase.open) setHeld((h) => [...h, phase.secs]);
        advance();
      } else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [stage, paused, phase, idx, advance]);

  const togglePause = () => {
    if (paused) {
      phaseStart.current += performance.now() - pausedAt.current;
      setPaused(false);
    } else {
      pausedAt.current = performance.now();
      setPaused(true);
    }
  };
  const endHold = () => {
    setHeld((h) => [...h, (performance.now() - phaseStart.current) / 1000]);
    advance();
  };

  const elapsedTotal = plan.slice(0, idx).reduce((a, p) => a + p.secs, 0) + (phase.secs - Math.max(0, left));
  const progress = Math.min(1, elapsedTotal / total);
  const breathsLeft = t.rounds && phase.kind !== "rest" && phase.round ? plan.slice(idx).filter((p) => p.round === phase.round && p.kind === "in" && !p.open).length - 1 : null;
  const next = catalog ? Object.values(catalog.titles).find((x) => x.kind === "session" && x.goal === t.next) : undefined;

  return createPortal(
    <motion.div className="bp rooted" role="dialog" aria-modal="true" aria-label={t.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ "--h": t.hue } as React.CSSProperties}>
      <div className="bp__bg" aria-hidden="true" />
      <header className="bp__top">
        <button className="icon-btn" onClick={onClose} aria-label="Close"><Icon name="close" /></button>
        <span className="bp__title">{t.name}</span>
        <button className="icon-btn" onClick={() => setSound((s) => !s)} aria-label={sound ? "Mute cues" : "Turn on cues"} aria-pressed={sound}>
          <Icon name={sound ? "volume" : "mute"} />
        </button>
      </header>

      <AnimatePresence mode="wait">
        {stage === "gate" && (
          <motion.div key="gate" className="bp__gate" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <h2>Before you start</h2>
            <ul>{POWER_SAFETY.map((s) => <li key={s}>{s}</li>)}</ul>
            <button className="btn btn--primary" onClick={() => { unlockChime(); setStage("count"); }}>I'm sitting or lying down. Start.</button>
            <button className="btn btn--secondary btn--small" onClick={onClose}>Not now</button>
          </motion.div>
        )}

        {(stage === "count" || stage === "run") && (
          <motion.div key="run" className="bp__stage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="bp__orb-wrap">
              <motion.div
                className="bp__orb"
                initial={{ scale: 0.5 }}
                animate={{ scale: stage === "count" ? 0.5 : reduce ? 0.8 : SCALE[phase.kind] }}
                transition={{ duration: stage === "count" || paused ? 0.4 : phase.kind === "hold" || phase.kind === "rest" ? 0.3 : phase.secs, ease: [0.45, 0, 0.55, 1] }}
              />
              <svg className="bp__ring" viewBox="0 0 100 100" aria-hidden="true">
                <circle cx="50" cy="50" r="48" pathLength="1" />
                <motion.circle cx="50" cy="50" r="48" pathLength="1" className="bp__ring-fill" style={{ pathLength: progress }} />
              </svg>
              <div className="bp__label" aria-live="assertive">
                {stage === "count" ? (
                  <motion.span key={count} className="bp__count" initial={{ scale: 1.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>{count || "Go"}</motion.span>
                ) : (
                  <>
                    <motion.strong key={idx} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>{phase.say}</motion.strong>
                    <span className="bp__secs">{phase.open ? `${Math.floor(phase.secs - left)}s` : Math.ceil(Math.max(0, left))}</span>
                  </>
                )}
              </div>
            </div>
            {stage === "run" && (
              <div className="bp__controls">
                {t.rounds && phase.round && <span className="bp__meta">Round {phase.round} of {t.rounds.count}{breathsLeft !== null && breathsLeft >= 0 ? ` · ${breathsLeft + 1} breaths left` : ""}</span>}
                {phase.open ? (
                  <button className="btn btn--primary" onClick={endHold}>I need to breathe</button>
                ) : (
                  <button className="btn btn--secondary" onClick={togglePause}>{paused ? "Resume" : "Pause"}</button>
                )}
              </div>
            )}
          </motion.div>
        )}

        {stage === "done" && (
          <motion.div key="done" className="bp__done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <motion.div className="bp__check" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.1 }}><Icon name="check" size={40} /></motion.div>
            <h2>Nicely done.</h2>
            <p>{Math.max(1, Math.round(elapsedTotal / 60))} minute{Math.round(elapsedTotal / 60) === 1 ? "" : "s"} of {t.name.toLowerCase()}. Notice how you feel right now.</p>
            {held.length > 0 && <p className="bp__holds">Breath holds: {held.map((h) => `${Math.round(h)}s`).join(" · ")}</p>}
            <div className="bp__done-actions">
              {next && (
                <button className="btn btn--primary" onClick={() => { playTitle(next); onClose(); }}>
                  <Icon name="headphones" size={20} /> Keep going with {next.name}
                </button>
              )}
              <button className="btn btn--secondary" onClick={onClose}>Done</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>,
    document.body,
  );
}
