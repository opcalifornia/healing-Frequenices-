import { useState } from "react";
import { Icon } from "../components/Icon";
import { Evidence, SourceLink } from "./ui";
import { BreathPlayer } from "./BreathPlayer";
import { TECHNIQUES, type Technique } from "./breathContent";
import { useBreatheTools, useMyPace } from "../store/breatheTools";

/** Breaths per minute to try, slowest to fastest range clinicians use for resonance breathing. */
export const PACES = [6.5, 6, 5.5, 5, 4.5];
export const FEEL = [
  { id: "easy", label: "Easy and smooth", score: 2 },
  { id: "ok", label: "Fine", score: 1 },
  { id: "hard", label: "Hard or strained", score: 0 },
] as const;

const BASE = TECHNIQUES.find((t) => t.id === "resonance")!;

/** Resonance breathing at `rate` breaths a minute: equal in and out, no holds. */
export function paceTechnique(rate: number): Technique {
  const half = Math.round((30 / rate) * 10) / 10;
  return { ...BASE, name: `Resonance breathing at ${rate} a minute`, short: `${half} in · ${half} out`, cycle: [{ kind: "in", secs: half, say: "Breathe in" }, { kind: "out", secs: half, say: "Breathe out" }] };
}

/** The pace that felt best; ties go to the one closest to six a minute, the most studied. */
export function bestPace(scores: Record<number, number>): number | null {
  const entries = Object.entries(scores).map(([r, s]) => [Number(r), s] as const);
  if (!entries.length) return null;
  const top = Math.max(...entries.map(([, s]) => s));
  return entries.filter(([, s]) => s === top).sort((a, b) => Math.abs(a[0] - 6) - Math.abs(b[0] - 6) || b[0] - a[0])[0][0];
}

type Step = { kind: "intro" } | { kind: "run"; i: number } | { kind: "rate"; i: number } | { kind: "result" };

/** Five one-minute rounds at different paces, then a rating of each. It is by feel, not a measurement. */
export function PaceFinder({ onStart }: { onStart(t: Technique, minutes: number): void }) {
  const mine = useMyPace();
  const setPace = useBreatheTools((s) => s.setPace);
  const [step, setStep] = useState<Step>({ kind: "intro" });
  const [scores, setScores] = useState<Record<number, number>>({});
  const best = bestPace(scores);

  const rate = (i: number, score: number) => {
    const next = { ...scores, [PACES[i]]: score };
    setScores(next);
    if (i + 1 < PACES.length) setStep({ kind: "run", i: i + 1 });
    else {
      const b = bestPace(next);
      if (b) setPace(b);
      setStep({ kind: "result" });
    }
  };

  return (
    <div className="r-card pace">
      {step.kind === "intro" && (
        <>
          <h3>Find the pace that feels best</h3>
          <p>Clinicians who use heart rate variability training find each person's easiest slow pace, usually between 4.5 and 6.5 breaths a minute. Try five paces for one minute each and say how each felt. Your pick becomes your own resonance pace.</p>
          <p className="pace__fine"><Evidence s="Moderate" /> This is by feel, not a measurement. A trained practitioner uses heart rate variability readings, so treat your result as a comfortable starting point. Sit down, breathe gently, and stop if you feel dizzy.</p>
          {mine && <p className="pace__mine"><Icon name="check" size={16} /> Your saved pace: <b>{mine} breaths a minute</b>. <button className="btn btn--secondary btn--small" onClick={() => onStart(paceTechnique(mine), 5)}>Start 5 min at my pace</button></p>}
          <button className="btn btn--primary" onClick={() => { setScores({}); setStep({ kind: "run", i: 0 }); }}>{mine ? "Find it again" : "Start the 5 minutes"}</button>
          <p className="pace__src"><SourceLink s={{ text: "Lehrer P et al. Heart rate variability biofeedback: a systematic review and meta-analysis. Appl Psychophysiol Biofeedback, 2020", url: "https://doi.org/10.1007/s10484-020-09466-z" }} /></p>
        </>
      )}
      {step.kind === "run" && (
        <BreathPlayer key={step.i} technique={paceTechnique(PACES[step.i])} minutes={1} onClose={() => setStep({ kind: "intro" })} onComplete={() => setStep({ kind: "rate", i: step.i })} />
      )}
      {step.kind === "rate" && (
        <>
          <span className="rooted__eyebrow">Pace {step.i + 1} of {PACES.length} · {PACES[step.i]} a minute</span>
          <h3>How did that feel?</h3>
          <div className="pace__feel" role="group" aria-label="How that pace felt">
            {FEEL.map((f) => <button key={f.id} className="btn btn--secondary" onClick={() => rate(step.i, f.score)}>{f.label}</button>)}
          </div>
        </>
      )}
      {step.kind === "result" && best && (
        <>
          <span className="rooted__eyebrow">Your pace</span>
          <h3>{best} breaths a minute</h3>
          <p>That's {Math.round((30 / best) * 10) / 10} seconds in and {Math.round((30 / best) * 10) / 10} seconds out. It's saved. You can start a session at your pace any time from here or from the resonance card.</p>
          <div className="pace__feel">
            <button className="btn btn--primary" onClick={() => onStart(paceTechnique(best), 5)}>Start 5 min at {best}</button>
            <button className="btn btn--secondary" onClick={() => setStep({ kind: "intro" })}>Done</button>
          </div>
        </>
      )}
    </div>
  );
}
