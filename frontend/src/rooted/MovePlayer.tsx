import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { Move, Routine } from "./moveContent";
import { Figure } from "./Figure";
import { chime } from "./chime";
import { usePractice } from "../store/practice";
import { useCatalog } from "../store/catalog";
import { usePlayer } from "../store/player";
import { Icon } from "../components/Icon";

interface Step extends Move {
  side?: "left" | "right";
}

/** Expand a routine into steps, splitting two-sided moves and applying a chosen walk length. */
export function routineSteps(r: Routine, minutes?: number): Step[] {
  const out: Step[] = [];
  for (const m of r.moves) {
    if (m.sides) {
      out.push({ ...m, secs: m.secs / 2, side: "left" }, { ...m, secs: m.secs / 2, side: "right" });
    } else out.push(m);
  }
  if (minutes && r.kind === "walk") out[0] = { ...out[0], secs: minutes * 60 };
  return out;
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export function MovePlayer({ routine: r, minutes, onClose, onComplete }: { routine: Routine; minutes?: number; onClose(): void; onComplete?(): void }) {
  const steps = useMemo(() => routineSteps(r, minutes), [r, minutes]);
  const total = steps.reduce((a, s) => a + s.secs, 0);
  const [i, setI] = useState(0);
  const [left, setLeft] = useState(steps[0].secs);
  const [paused, setPaused] = useState(false);
  const [done, setDone] = useState(false);
  const [started] = useState(() => performance.now());
  const log = usePractice((s) => s.log);
  const catalog = useCatalog();
  const playTitle = usePlayer((s) => s.playTitle);
  const iRef = useRef(0);
  const stepStart = useRef(performance.now());
  const pausedAt = useRef(0);
  const step = steps[i];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    let lock: { release(): Promise<void> } | null = null;
    const nav = navigator as Navigator & { wakeLock?: { request(t: "screen"): Promise<{ release(): Promise<void> }> } };
    nav.wakeLock?.request("screen").then((l) => (lock = l)).catch(() => undefined);
    chime("in");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      void lock?.release().catch(() => undefined);
    };
  }, [onClose]);

  const goTo = useCallback(
    (n: number) => {
      if (n >= steps.length) {
        log(`move:${r.id}`, (performance.now() - started) / 60000);
        if (onComplete) return onComplete();
        setDone(true);
        chime("bell", 0.09);
        return;
      }
      iRef.current = Math.max(0, n);
      stepStart.current = performance.now();
      setI(iRef.current);
      setLeft(steps[iRef.current].secs);
      chime("in");
      navigator.vibrate?.(30);
    },
    [steps, log, r.id, started, onComplete],
  );

  useEffect(() => {
    if (paused || done) return;
    let raf = 0;
    let lastWhole = Math.ceil(left);
    const tick = () => {
      const remain = steps[iRef.current].secs - (performance.now() - stepStart.current) / 1000;
      setLeft(remain);
      const whole = Math.ceil(remain);
      // A soft tick for the last three seconds of each move (and once a minute on long walks).
      if (whole !== lastWhole) {
        if (whole <= 3 && whole > 0) chime("hold", 0.03);
        else if (r.kind === "walk" && whole > 0 && whole % 60 === 0) chime("top", 0.03);
        lastWhole = whole;
      }
      if (remain <= 0) goTo(iRef.current + 1);
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, done, i, goTo, steps, r.kind]);

  const togglePause = () => {
    if (paused) {
      stepStart.current += performance.now() - pausedAt.current;
      setPaused(false);
    } else {
      pausedAt.current = performance.now();
      setPaused(true);
    }
  };

  const elapsed = steps.slice(0, i).reduce((a, s) => a + s.secs, 0) + (step.secs - Math.max(0, left));
  const nextStep = steps[i + 1];
  const nextTitle = r.next && catalog ? Object.values(catalog.titles).find((x) => x.kind === "session" && x.goal === r.next) : undefined;

  return createPortal(
    <motion.div className="mp rooted" role="dialog" aria-modal="true" aria-label={r.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ "--h": r.hue } as React.CSSProperties}>
      <div className="mp__bg" aria-hidden="true" />
      <header className="mp__top">
        <button className="icon-btn" onClick={onClose} aria-label="Close"><Icon name="close" /></button>
        <div className="mp__bar" aria-label={`${Math.round((elapsed / total) * 100)}% done`}>
          {steps.map((s, k) => (
            <span key={k} style={{ flexGrow: s.secs }}>
              <i style={{ width: k < i ? "100%" : k === i ? `${Math.min(100, ((s.secs - Math.max(0, left)) / s.secs) * 100)}%` : "0%" }} />
            </span>
          ))}
        </div>
        <span className="mp__total">{fmt(Math.max(0, total - elapsed))}</span>
      </header>

      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div key={i} className="mp__stage" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35 }}>
            <div className="mp__figure">
              <Figure a={step.a} b={step.b} period={step.period} mirror={step.side === "right"} className={paused ? "is-paused" : ""} />
            </div>
            <div className="mp__info" aria-live="polite">
              <span className="rooted__eyebrow">{i + 1} of {steps.length}{step.side ? ` · ${step.side === "left" ? "First side" : "Other side"}` : ""}</span>
              <h2>{step.name}</h2>
              <p>{step.cue}</p>
              {step.easier && <p className="mp__easier"><strong>Easier:</strong> {step.easier}</p>}
              <span className="mp__left">{fmt(Math.max(0, Math.ceil(left)))}</span>
              {nextStep && <span className="mp__next">Up next: {nextStep.name}</span>}
            </div>
          </motion.div>
        ) : (
          <motion.div key="done" className="bp__done mp__done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <motion.div className="bp__check-icon" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.1 }}><Icon name="check" size={40} /></motion.div>
            <h2>You moved.</h2>
            <p>{Math.max(1, Math.round(elapsed / 60))} minutes of {r.name.toLowerCase()}. Your body thanks you.</p>
            <div className="bp__done-actions">
              {nextTitle && <button className="btn btn--primary" onClick={() => { playTitle(nextTitle); onClose(); }}><Icon name="headphones" size={20} /> Keep going with {nextTitle.name}</button>}
              <button className="btn btn--secondary" onClick={onClose}>Done</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!done && (
        <footer className="mp__controls">
          <button className="icon-btn icon-btn--lg" onClick={() => goTo(i - 1)} disabled={i === 0} aria-label="Previous move"><Icon name="chevronLeft" /></button>
          <button className="mp__play" onClick={togglePause} aria-label={paused ? "Resume" : "Pause"}><Icon name={paused ? "play" : "pause"} size={30} /></button>
          <button className="icon-btn icon-btn--lg" onClick={() => goTo(i + 1)} aria-label="Next move"><Icon name="chevronRight" /></button>
        </footer>
      )}
    </motion.div>,
    document.body,
  );
}
