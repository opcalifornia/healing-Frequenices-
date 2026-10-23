import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BREATH_SCREEN, POWER_SAFETY, type Technique } from "./breathContent";
import { buildPlan, planSeconds, type PlanPhase } from "./breathPlan";
import { breathTone, chime, setSoundscapeVolume, startSoundscape, stopBreathTone, stopSoundscape, unlockChime } from "./chime";
import { usePractice, usePrefs, type BreathPrefs, type SoundMode } from "../store/practice";
import { speakCue, stopVoice } from "./voice";
import { useCatalog } from "../store/catalog";
import { usePlayer } from "../store/player";
import { Icon } from "../components/Icon";
import { haptic } from "./native";
import { useModalFocus } from "./ui";

type Stage = "before" | "gate" | "count" | "run" | "after" | "done";

const SCALE: Record<PlanPhase["kind"], number> = { in: 1, top: 1.1, hold: 1, out: 0.5, rest: 0.5 };
const SOUND_LABEL: Record<SoundMode, string> = { chimes: "Chimes", voice: "Voice", tone: "Breath tone", silent: "Silent" };
const SCAPES: Array<{ id: BreathPrefs["scape"]; name: string }> = [
  { id: "none", name: "No background" },
  { id: "rain", name: "Rain" },
  { id: "stream", name: "Mountain stream" },
  { id: "waterfall", name: "Waterfall" },
  { id: "rainforest", name: "Rainforest" },
];

interface Props {
  technique: Technique;
  minutes: number;
  onClose(): void;
  /** Inside a combo: skip check-ins and the done screen, then move on. */
  onComplete?(): void;
}

/** Stress check-in, 1 (relaxed) to 10 (very stressed). */
function StressScale({ value, onChange }: { value: number; onChange(v: number): void }) {
  return (
    <div className="stress">
      <div className="stress__row" role="radiogroup" aria-label="Stress from 1, relaxed, to 10, very stressed">
        {Array.from({ length: 10 }, (_, k) => k + 1).map((n) => (
          <motion.button key={n} role="radio" aria-checked={value === n} className={`stress__n ${value === n ? "is-on" : ""}`} style={{ "--n": n } as React.CSSProperties} onClick={() => onChange(n)} whileTap={{ scale: 0.88 }}>
            {n}
          </motion.button>
        ))}
      </div>
      <div className="stress__ends"><span>Relaxed</span><span>Very stressed</span></div>
    </div>
  );
}

/** The dot-on-a-path pacer for box and triangle patterns. */
function ShapePacer({ shape, idx, cycleLen, progress, hue }: { shape: "box" | "triangle"; idx: number; cycleLen: number; progress: number; hue: number }) {
  const side = idx % cycleLen;
  const pts = shape === "box" ? [[20, 180], [20, 20], [180, 20], [180, 180]] : [[100, 18], [184, 172], [16, 172]];
  // Box: up the left (in), across the top (hold), down the right (out), back along the bottom (rest).
  // Triangle: up to the top (in), down the right (hold), along the base (out).
  const order = shape === "box" ? [0, 1, 2, 3] : [2, 0, 1];
  const a = pts[order[side % order.length]];
  const b = pts[order[(side + 1) % order.length]];
  const x = a[0] + (b[0] - a[0]) * progress;
  const y = a[1] + (b[1] - a[1]) * progress;
  const d = `M${pts.map((p) => p.join(" ")).join(" L")} Z`;
  return (
    <svg viewBox="0 0 200 200" className="shape-pacer" style={{ "--h": hue } as React.CSSProperties} aria-hidden="true">
      <path d={d} className="shape-pacer__track" />
      <path d={`M${a[0]} ${a[1]} L${x} ${y}`} className="shape-pacer__trail" />
      <circle cx={x} cy={y} r="11" className="shape-pacer__glow" />
      <circle cx={x} cy={y} r="7" className="shape-pacer__dot" />
    </svg>
  );
}

export function BreathPlayer({ technique: t, minutes, onClose, onComplete }: Props) {
  const reduce = useReducedMotion();
  const prefs = usePrefs();
  const setPrefs = usePractice((s) => s.setPrefs);
  const plan = useMemo(() => buildPlan(t, minutes), [t, minutes]);
  const total = planSeconds(plan);
  const checkIns = prefs.checkIn && !onComplete;
  const [stage, setStage] = useState<Stage>(checkIns ? "before" : t.gated ? "gate" : "count");
  const [before, setBefore] = useState(0);
  const [after, setAfter] = useState(0);
  const [count, setCount] = useState(3);
  const [idx, setIdx] = useState(0);
  const [left, setLeft] = useState(plan[0].secs);
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState<number[]>([]);
  const [menu, setMenu] = useState(false);
  const [ack, setAck] = useState<boolean[]>(() => BREATH_SCREEN.map(() => false));
  const [eyes, setEyes] = useState(false);
  const startedAt = useRef(0);
  const elapsedMin = useRef(0);
  const phaseStart = useRef(0);
  const pausedAt = useRef(0);
  const idxRef = useRef(0);
  const log = usePractice((s) => s.log);
  const catalog = useCatalog();
  const playTitle = usePlayer((s) => s.playTitle);
  const phase = plan[Math.min(idx, plan.length - 1)];
  const soundRef = useRef(prefs.sound);
  soundRef.current = prefs.sound;
  const guideRef = useRef(prefs.guideVol);
  guideRef.current = prefs.guideVol;
  const bedRef = useRef(prefs.bedVol);
  bedRef.current = prefs.bedVol;

  const root = useRef<HTMLDivElement>(null);
  useModalFocus(root, true, onClose);
  useEffect(() => {
    return () => {
      stopBreathTone();
      stopSoundscape();
      stopVoice();
    };
  }, []);
  useEffect(() => {
    if (stage !== "run") return;
    let lock: { release(): Promise<void> } | null = null;
    const nav = navigator as Navigator & { wakeLock?: { request(t: "screen"): Promise<{ release(): Promise<void> }> } };
    nav.wakeLock?.request("screen").then((l) => (lock = l)).catch(() => undefined);
    return () => void lock?.release().catch(() => undefined);
  }, [stage]);

  // Background soundscape follows the preference while the session is live.
  useEffect(() => {
    const live = stage === "count" || stage === "run";
    if (live && prefs.scape !== "none") void startSoundscape(prefs.scape, bedRef.current);
    else stopSoundscape();
  }, [stage, prefs.scape]);

  const cue = useCallback((p: PlanPhase) => {
    if (soundRef.current === "chimes") chime(p.kind, 0.07 * (guideRef.current / 0.9));
    if (soundRef.current === "voice") {
      if (p.secs < 2) chime(p.kind, 0.04 * (guideRef.current / 0.9));
      else void speakCue(p.kind, p.secs, guideRef.current);
    }
    if (soundRef.current === "tone") breathTone(p.kind, p.secs);
    else stopBreathTone();
    navigator.vibrate?.(p.kind === "hold" || p.kind === "rest" ? [20, 60, 20] : 25);
    haptic("light");
  }, []);

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
    stopBreathTone();
    elapsedMin.current = (performance.now() - startedAt.current) / 60000;
    if (onComplete) {
      log(`breath:${t.id}`, elapsedMin.current);
      return onComplete();
    }
    if (soundRef.current === "voice") void speakCue("done");
    else if (soundRef.current !== "silent") chime("bell", 0.09);
    if (checkIns) setStage("after");
    else {
      log(`breath:${t.id}`, elapsedMin.current);
      setStage("done");
    }
  }, [log, t.id, onComplete, checkIns]);

  const advance = useCallback(() => {
    const n = idxRef.current + 1;
    if (n >= plan.length) return finish();
    idxRef.current = n;
    phaseStart.current = performance.now();
    cue(plan[n]);
    setLeft(plan[n].secs);
    setIdx(n);
  }, [plan, cue, finish]);

  useEffect(() => {
    if (stage !== "run" || paused) return;
    let raf = 0;
    const tick = () => {
      const remain = phase.secs - (performance.now() - phaseStart.current) / 1000;
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
      cue(phase);
    } else {
      pausedAt.current = performance.now();
      setPaused(true);
      stopBreathTone();
    }
  };
  const endHold = () => {
    setHeld((h) => [...h, (performance.now() - phaseStart.current) / 1000]);
    advance();
  };
  const begin = () => {
    unlockChime();
    setStage(t.gated ? "gate" : "count");
  };
  const saveAfter = (v: number) => {
    setAfter(v);
    log(`breath:${t.id}`, elapsedMin.current, before ? { before, after: v } : undefined);
    setTimeout(() => setStage("done"), 350);
  };
  const cycleSound = () => {
    const order: SoundMode[] = ["chimes", "voice", "tone", "silent"];
    const next = order[(order.indexOf(prefs.sound) + 1) % order.length];
    setPrefs({ sound: next });
    if (next !== "tone") stopBreathTone();
    if (next !== "voice") stopVoice();
    else if (stage === "run") breathTone(phase.kind, Math.max(0.5, left));
  };

  const elapsedTotal = plan.slice(0, idx).reduce((a, p) => a + p.secs, 0) + (phase.secs - Math.max(0, left));
  const progress = Math.min(1, elapsedTotal / total);
  const phaseProgress = Math.min(1, Math.max(0, 1 - left / phase.secs));
  const breathsLeft = t.rounds && phase.kind !== "rest" && phase.round ? plan.slice(idx).filter((p) => p.round === phase.round && p.kind === "in" && !p.open).length - 1 : null;
  const next = catalog ? Object.values(catalog.titles).find((x) => x.kind === "session" && x.goal === t.next) : undefined;
  const useShape = t.shape && t.shape !== "orb" && !t.rounds && !reduce;
  const delta = before && after ? before - after : 0;

  return createPortal(
    <motion.div ref={root} tabIndex={-1} className="bp rooted" role="dialog" aria-modal="true" aria-label={t.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ "--h": t.hue } as React.CSSProperties}>
      <div className="bp__bg" aria-hidden="true" />
      {eyes && (
        <button className="bp__dark" onClick={() => setEyes(false)} aria-label="Eyes closed mode. Tap to show the screen again.">
          <span>Eyes closed. {prefs.sound === "silent" ? "Turn on chimes, voice or tone to follow along. " : "Follow the sound and vibration. "}Tap anywhere to look again.</span>
        </button>
      )}
      <header className="bp__top">
        <button className="icon-btn" onClick={onClose} aria-label="Close"><Icon name="close" /></button>
        <span className="bp__title">{t.name}</span>
        <div className="bp__tools">
          <button className="bp__chip" onClick={cycleSound} aria-label={`Guidance sound: ${SOUND_LABEL[prefs.sound]}. Tap to change.`}>
            <Icon name={prefs.sound === "silent" ? "mute" : "volume"} size={16} /> {SOUND_LABEL[prefs.sound]}
          </button>
          <div className="bp__menu-wrap">
            <button className="bp__chip" onClick={() => setMenu((m) => !m)} aria-expanded={menu} aria-label="Background sound">
              <Icon name="wave" size={16} /> {SCAPES.find((s) => s.id === prefs.scape)?.name.replace("No background", "Background")}
            </button>
            <AnimatePresence>
              {menu && (
                <motion.div className="bp__menu" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                  {SCAPES.map((s) => (
                    <button key={s.id} aria-pressed={prefs.scape === s.id} className={prefs.scape === s.id ? "is-on" : ""} onClick={() => { unlockChime(); setPrefs({ scape: s.id }); setMenu(false); }}>{s.name}</button>
                  ))}
                  <label className="bp__vol">Guide volume<input type="range" min={0.2} max={1} step={0.05} value={prefs.guideVol} onChange={(e) => setPrefs({ guideVol: +e.target.value })} /></label>
                  <label className="bp__vol">Background volume<input type="range" min={0} max={1} step={0.05} value={prefs.bedVol} onChange={(e) => { const v = +e.target.value; setPrefs({ bedVol: v }); setSoundscapeVolume(v); }} /></label>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {stage === "before" && (
          <motion.div key="before" className="bp__check" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <span className="rooted__eyebrow">Quick check-in</span>
            <h2>How stressed do you feel right now?</h2>
            <StressScale value={before} onChange={(v) => { setBefore(v); setTimeout(begin, 300); }} />
            <div className="bp__check-actions">
              <button className="welcome__skip" onClick={begin}>Skip</button>
              <button className="welcome__skip" onClick={() => { setPrefs({ checkIn: false }); begin(); }}>Don't ask again</button>
            </div>
          </motion.div>
        )}

        {stage === "gate" && (
          <motion.div key="gate" className="bp__gate" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <h2>Before you start</h2>
            <ul>{POWER_SAFETY.map((s) => <li key={s}>{s}</li>)}</ul>
            <p className="bp__gate-ask">Tick each one to continue:</p>
            <div className="bp__screen">
              {BREATH_SCREEN.map((q, n) => (
                <label key={q}><input type="checkbox" checked={ack[n]} onChange={(e) => setAck((a) => a.map((v, k) => (k === n ? e.target.checked : v)))} /><span>{q}</span></label>
              ))}
            </div>
            <button className="btn btn--primary" disabled={!ack.every(Boolean)} onClick={() => { unlockChime(); setStage("count"); }}>Start</button>
            <button className="btn btn--secondary btn--small" onClick={onClose}>Not now</button>
          </motion.div>
        )}

        {(stage === "count" || stage === "run") && (
          <motion.div key="run" className="bp__stage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="bp__orb-wrap">
              {useShape ? (
                <ShapePacer shape={t.shape as "box" | "triangle"} idx={stage === "count" ? 0 : idx} cycleLen={t.cycle.length} progress={stage === "count" ? 0 : phaseProgress} hue={t.hue} />
              ) : (
                <motion.div
                  className="bp__orb"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: stage === "count" ? 0.5 : reduce ? 0.8 : SCALE[phase.kind] }}
                  transition={{ duration: stage === "count" || paused ? 0.4 : phase.kind === "hold" || phase.kind === "rest" ? 0.3 : phase.secs, ease: [0.45, 0, 0.55, 1] }}
                />
              )}
              <svg className="bp__ring" viewBox="0 0 100 100" aria-hidden="true">
                <circle cx="50" cy="50" r="48" pathLength="1" />
                <motion.circle cx="50" cy="50" r="48" pathLength="1" className="bp__ring-fill" style={{ pathLength: progress }} />
              </svg>
              <div className={`bp__label ${useShape ? "bp__label--shape" : ""}`} aria-live="assertive">
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
                <div className="bp__side">
                  <button className="btn btn--secondary btn--small" onClick={() => setEyes(true)}>Eyes closed</button>
                  <button className="btn btn--secondary btn--small" onClick={onClose}>Stop and breathe normally</button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {stage === "after" && (
          <motion.div key="after" className="bp__check" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <span className="rooted__eyebrow">And now?</span>
            <h2>How stressed do you feel after that?</h2>
            <StressScale value={after} onChange={saveAfter} />
            <button className="welcome__skip" onClick={() => { log(`breath:${t.id}`, elapsedMin.current); setStage("done"); }}>Skip</button>
          </motion.div>
        )}

        {stage === "done" && (
          <motion.div key="done" className="bp__done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <motion.div className="bp__check-icon" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.1 }}><Icon name="check" size={40} /></motion.div>
            <h2>{delta > 0 ? `Down ${delta} point${delta === 1 ? "" : "s"}.` : "Nicely done."}</h2>
            <p>
              {Math.max(1, Math.round(elapsedTotal / 60))} minute{Math.round(elapsedTotal / 60) === 1 ? "" : "s"} of {t.name.toLowerCase()}.
              {before && after ? ` Stress went from ${before} to ${after}.` : " Notice how you feel right now."}
            </p>
            {before > 0 && after > 0 && (
              <div className="bp__delta" aria-hidden="true">
                <span style={{ "--w": before / 10 } as React.CSSProperties}><b>Before</b><i /><em>{before}</em></span>
                <span style={{ "--w": after / 10 } as React.CSSProperties}><b>After</b><i /><em>{after}</em></span>
              </div>
            )}
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
