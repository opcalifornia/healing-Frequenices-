import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { Program } from "./programs";
import { safeTechnique } from "./programs";
import { GROUNDING, TECHNIQUES } from "./breathContent";
import { ROUTINES } from "./moveContent";
import { BreathPlayer } from "./BreathPlayer";
import { MovePlayer } from "./MovePlayer";
import { BreathingBody, HeartRhythm } from "./BreatheDiagrams";
import { chime, unlockChime } from "./chime";
import { soundsLikeCrisis } from "./supportContent";
import { CrisisNudge } from "./Crisis";
import { flags, useAbout } from "../store/wellness";
import { useJournal } from "../store/journal";
import { usePrograms } from "../store/programs";
import { Icon } from "../components/Icon";

/** Plays one day of a program, block by block. */
export function LessonPlayer({ program, day, onClose }: { program: Program; day: number; onClose(): void }) {
  const d = program.days[day];
  const f = flags(useAbout().considerations);
  const [i, setI] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [pick, setPick] = useState<number | null>(null);
  const [lines, setLines] = useState<string[]>([]);
  const [g, setG] = useState(0);
  const completeDay = usePrograms((s) => s.completeDay);
  const addJournal = useJournal((s) => s.add);
  const b = d.blocks[i];
  const last = day === program.days.length - 1;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !running && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, running]);

  const next = () => {
    setRunning(false);
    setPick(null);
    setLines([]);
    setG(0);
    if (i + 1 >= d.blocks.length) {
      completeDay(program.id, day);
      setDone(true);
      chime("bell", 0.09);
      return;
    }
    setI(i + 1);
  };

  const techId = b?.type === "breath" ? safeTechnique(b.technique, f) : "";
  const tech = TECHNIQUES.find((t) => t.id === techId);

  return createPortal(
    <>
      <motion.div className="lp rooted" role="dialog" aria-modal="true" aria-label={`${program.title}, day ${day + 1}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ "--h": program.hue, "--h2": program.hue2 } as React.CSSProperties}>
        <div className="cp__bg" aria-hidden="true" />
        <header className="lp__top">
          <button className="icon-btn" onClick={onClose} aria-label="Close lesson"><Icon name="close" /></button>
          <div className="lp__bar" aria-label={`Step ${i + 1} of ${d.blocks.length}`}>
            {d.blocks.map((_, k) => <span key={k}><motion.i initial={false} animate={{ width: done || k < i ? "100%" : k === i ? "50%" : "0%" }} /></span>)}
          </div>
          <span className="lp__day">Day {day + 1}</span>
        </header>

        <AnimatePresence mode="wait">
          {done ? (
            <motion.div key="done" className="lp__done" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="lp__burst" aria-hidden="true">{Array.from({ length: 14 }, (_, k) => <motion.i key={k} initial={{ scale: 0, x: 0, y: 0 }} animate={{ scale: [0, 1, 0], x: Math.cos(k * 0.45) * 140, y: Math.sin(k * 0.45) * 140 }} transition={{ duration: 1.4, delay: 0.1 }} style={{ background: k % 2 ? "var(--r-sand)" : `hsl(${program.hue} 70% 70%)` }} />)}</div>
              <motion.div className={`lp__badge ${last ? "lp__badge--final" : ""}`} initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200, damping: 12 }}>
                {last ? <Icon name="sparkle" size={44} /> : <span>{day + 1}</span>}
              </motion.div>
              <h2>{last ? `You finished ${program.title}!` : `Day ${day + 1} complete.`}</h2>
              <p>{last ? "Seven days of practice. That's a habit forming. Keep your favorite technique close: it's on the Breathe page whenever you need it." : `Come back tomorrow for day ${day + 2}: ${program.days[day + 1].title.toLowerCase()}.`}</p>
              <button className="btn btn--primary btn--big" onClick={onClose}>{last ? "Finish" : "Done for today"}</button>
            </motion.div>
          ) : (
            <motion.div key={i} className="lp__stage" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.35 }}>
              {i === 0 && <span className="rooted__eyebrow">{program.title} · Day {day + 1}</span>}
              {b.type === "read" && (
                <div className="lp__read">
                  <h2>{i === 0 ? d.title : b.title}</h2>
                  {i === 0 && <h3>{b.title}</h3>}
                  {b.body.map((p) => <p key={p}>{p}</p>)}
                  {b.diagram === "breathing-body" && <BreathingBody />}
                  {b.diagram === "heart-rhythm" && <HeartRhythm />}
                  <button className="btn btn--primary btn--big" onClick={next}>Continue</button>
                </div>
              )}
              {b.type === "breath" && tech && (
                <div className="lp__card">
                  <span className="cp__icon"><Icon name="timer" size={28} /></span>
                  <h2>Practice: {tech.name}</h2>
                  <p>{b.minutes ? `${b.minutes} minute${b.minutes === 1 ? "" : "s"}.` : ""} {tech.when}{techId !== b.technique ? " (Swapped for a gentler technique based on your profile.)" : ""}</p>
                  <button className="btn btn--primary btn--big" onClick={() => { unlockChime(); setRunning(true); }}><Icon name="play" size={22} /> Start</button>
                  <button className="welcome__skip" onClick={next}>Skip this practice</button>
                </div>
              )}
              {b.type === "move" && (
                <div className="lp__card">
                  <span className="cp__icon"><Icon name="replay" size={28} /></span>
                  <h2>Practice: {ROUTINES.find((r) => r.id === b.routine)?.name}</h2>
                  <button className="btn btn--primary btn--big" onClick={() => { unlockChime(); setRunning(true); }}><Icon name="play" size={22} /> Start</button>
                  <button className="welcome__skip" onClick={next}>Skip this practice</button>
                </div>
              )}
              {b.type === "ground" && (
                <div className="lp__card">
                  <AnimatePresence mode="wait">
                    <motion.div key={g} className="cp__ground" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                      <span className="ground__n">{GROUNDING[g].n}</span>
                      <span className="rooted__eyebrow">Things you can {GROUNDING[g].sense}</span>
                      <p>{GROUNDING[g].prompt}</p>
                    </motion.div>
                  </AnimatePresence>
                  <button className="btn btn--primary btn--big" onClick={() => (g + 1 < GROUNDING.length ? setG(g + 1) : next())}>{g + 1 < GROUNDING.length ? "Next" : "Done"}</button>
                </div>
              )}
              {b.type === "quiz" && (
                <div className="lp__card lp__quiz">
                  <span className="rooted__eyebrow">Quick check</span>
                  <h2>{b.question}</h2>
                  <div className="lp__options">
                    {b.options.map((o, k) => {
                      const state = pick === null ? "" : k === b.answer ? "is-right" : k === pick ? "is-wrong" : "is-dim";
                      return (
                        <motion.button key={o} className={`lp__opt ${state}`} disabled={pick !== null} onClick={() => setPick(k)} whileTap={{ scale: 0.97 }} animate={state === "is-wrong" ? { x: [0, -6, 6, -4, 0] } : {}}>
                          {o}{pick !== null && k === b.answer && <Icon name="check" size={18} />}
                        </motion.button>
                      );
                    })}
                  </div>
                  <AnimatePresence>
                    {pick !== null && (
                      <motion.div className="lp__explain" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                        <strong>{pick === b.answer ? "Exactly right." : "Not quite."}</strong> {b.explain}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {pick !== null && <button className="btn btn--primary btn--big" onClick={next}>Continue</button>}
                </div>
              )}
              {b.type === "reflect" && (
                <div className="lp__card cp__card--wide">
                  <h2>{b.prompt}</h2>
                  <div className="cp__lines">
                    {Array.from({ length: b.lines }, (_, k) => (
                      <input key={k} value={lines[k] ?? ""} onChange={(e) => { const n = [...lines]; n[k] = e.target.value; setLines(n); }} placeholder={`${k + 1}.`} aria-label={`${b.prompt}, line ${k + 1}`} />
                    ))}
                  </div>
                  {soundsLikeCrisis(lines.join(" ")) && <CrisisNudge />}
                  <button className="btn btn--primary btn--big" onClick={() => { addJournal(b.prompt, lines); next(); }}>Continue</button>
                  <span className="cp__private">Saved privately on this device.</span>
                </div>
              )}
              {b.type === "action" && (
                <div className="lp__card">
                  <span className="cp__icon"><Icon name="sparkle" size={28} /></span>
                  <span className="rooted__eyebrow">Your challenge</span>
                  <h2>{b.title}</h2>
                  <p>{b.body}</p>
                  <button className="btn btn--primary btn--big" onClick={next}>I'm in</button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      {running && b.type === "breath" && tech && <BreathPlayer key={`b${i}`} technique={tech} minutes={b.minutes} onClose={() => setRunning(false)} onComplete={next} />}
      {running && b.type === "move" && <MovePlayer key={`m${i}`} routine={ROUTINES.find((r) => r.id === b.routine)!} onClose={() => setRunning(false)} onComplete={next} />}
    </>,
    document.body,
  );
}
