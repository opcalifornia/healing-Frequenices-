import { useEffect, useState } from "react";
import { Icon } from "../components/Icon";
import { Sheet, useToast } from "./ui";
import { clock, scaleAmount, stepTimers, type StepTimer } from "./scale";
import { keyOf } from "./mealPlan";
import { recipeToText } from "./recipeTools";
import type { Recipe } from "./recipes";
import { SLOTS, SLOT_LABEL, useMealPlan, useMyPlan, type Slot } from "../store/mealPlan";
import { useRecipeBox, useSavedRecipes } from "../store/recipeBox";

/** Save, put on the plan, share, and cook step by step. Sits under a recipe's title. */
export function RecipeActions({ r, factor = 1 }: { r: Recipe; factor?: number }) {
  const saved = useSavedRecipes().includes(r.id);
  const toggle = useRecipeBox((s) => s.toggle);
  const toast = useToast();
  const [plan, setPlan] = useState(false);
  const [cook, setCook] = useState(false);

  const share = async () => {
    const link = `${location.origin}${location.pathname}#/nourish?recipe=${encodeURIComponent(r.id)}`;
    const text = `${recipeToText(r, factor)}\nOpen it in the app: ${link}\n`;
    try {
      if (navigator.share) await navigator.share({ title: r.title, text });
      else {
        await navigator.clipboard.writeText(text);
        toast.show("Recipe copied. Paste it anywhere");
      }
    } catch {
      /* closed the share sheet */
    }
  };

  return (
    <>
      <div className="rdetail__actions rdetail__tools">
        <button className="btn btn--secondary btn--small" aria-pressed={saved} onClick={() => { toggle(r.id); toast.show(saved ? "Removed from your saved recipes" : "Saved to your recipes"); }}>
          <Icon name="heart" size={16} /> {saved ? "Saved" : "Save"}
        </button>
        <button className="btn btn--secondary btn--small" onClick={() => setPlan(true)}><Icon name="calendar" size={16} /> Put on my plan</button>
        <button className="btn btn--secondary btn--small" onClick={() => setCook(true)}><Icon name="play" size={16} /> Cook mode</button>
        <button className="btn btn--secondary btn--small" onClick={share}><Icon name="message" size={16} /> Share</button>
      </div>
      <PlanSheet r={r} open={plan} onClose={() => setPlan(false)} onDone={(m) => { setPlan(false); toast.show(m); }} />
      <CookMode r={r} factor={factor} open={cook} onClose={() => setCook(false)} />
      {toast.node}
    </>
  );
}

function PlanSheet({ r, open, onClose, onDone }: { r: Recipe; open: boolean; onClose(): void; onDone(msg: string): void }) {
  const plan = useMyPlan();
  const setMeal = useMealPlan((s) => s.setMeal);
  const [slot, setSlot] = useState<Slot>("dinner");
  const days = Array.from({ length: 14 }, (_, i) => new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + i));
  const put = (d: Date) => {
    const k = keyOf(d);
    setMeal(k, slot, { recipeId: r.id });
    onDone(`${r.title} is on ${d.toLocaleDateString(undefined, { weekday: "long" })} ${SLOT_LABEL[slot].toLowerCase()}`);
  };
  return (
    <Sheet open={open} onClose={onClose} label="Put on my plan">
      <div className="slist">
        <h2>Put it on your plan</h2>
        <p className="mpl__hint">Pick a meal, then a day. You can swap it later in the meal planner.</p>
        <div className="recipes__chips" role="group" aria-label="Meal">
          {SLOTS.map((s) => <button key={s} className={`chip ${slot === s ? "is-on" : ""}`} aria-pressed={slot === s} onClick={() => setSlot(s)}>{SLOT_LABEL[s]}</button>)}
        </div>
        <ul className="rplan__days">
          {days.map((d) => {
            const e = plan[keyOf(d)]?.[slot];
            return (
              <li key={keyOf(d)}>
                <button className="rplan__day" onClick={() => put(d)}>
                  <strong>{d.toLocaleDateString(undefined, { weekday: "short" })}</strong>
                  <span>{d.toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                  <small>{e ? "Replace" : "Free"}</small>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </Sheet>
  );
}

/** One step at a time in big type, with the ingredients a tap away, and the screen kept awake while you cook. */
function CookMode({ r, factor, open, onClose }: { r: Recipe; factor: number; open: boolean; onClose(): void }) {
  const [step, setStep] = useState(0);
  const [showIng, setShowIng] = useState(false);
  const [done, setDone] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!open) return;
    setStep(0);
    setShowIng(false);
    setDone(new Set());
    let lock: { release(): Promise<void> } | null = null;
    const nav = navigator as Navigator & { wakeLock?: { request(t: "screen"): Promise<{ release(): Promise<void> }> } };
    nav.wakeLock?.request("screen").then((l) => (lock = l)).catch(() => undefined);
    return () => void lock?.release().catch(() => undefined);
  }, [open]);

  const last = step === r.steps.length - 1;
  return (
    <Sheet open={open} onClose={onClose} label={`Cook mode: ${r.title}`}>
      <div className="cook">
        <span className="rooted__eyebrow">Cook mode · {r.title}</span>
        <div className="cook__tabs" role="tablist">
          <button role="tab" aria-selected={!showIng} className={`chip ${!showIng ? "is-on" : ""}`} onClick={() => setShowIng(false)}>Steps</button>
          <button role="tab" aria-selected={showIng} className={`chip ${showIng ? "is-on" : ""}`} onClick={() => setShowIng(true)}>Ingredients</button>
        </div>
        {showIng ? (
          <ul className="rdetail__ing">
            {r.ingredients.map((ing, i) => (
              <li key={i}>
                <button className={`rdetail__check ${done.has(i) ? "is-done" : ""}`} aria-pressed={done.has(i)} onClick={() => setDone((s) => { const n = new Set(s); if (n.has(i)) n.delete(i); else n.add(i); return n; })}>
                  <span className="slist__check">{done.has(i) && <Icon name="check" size={16} />}</span>
                  <span className="rdetail__name">{ing.name}</span>
                  <span className="rdetail__amt">{scaleAmount(ing.amount, factor)}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <>
            <p className="cook__count">Step {step + 1} of {r.steps.length}</p>
            <p className="cook__step" aria-live="polite">{r.steps[step]}</p>
            <div className="cook__timers">{stepTimers(r.steps[step]).map((t, i) => <StepTimerButton key={`${step}-${i}`} t={t} />)}</div>
            <div className="cook__nav">
              <button className="btn btn--secondary" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>Back</button>
              {last ? <button className="btn btn--primary" onClick={onClose}>Done. Enjoy</button> : <button className="btn btn--primary" onClick={() => setStep((s) => s + 1)}>Next step</button>}
            </div>
            <div className="cook__dots" aria-hidden="true">{r.steps.map((_, i) => <i key={i} className={i <= step ? "on" : ""} />)}</div>
          </>
        )}
      </div>
    </Sheet>
  );
}

function beep() {
  try {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    [0, 0.35, 0.7].forEach((t) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = 880;
      g.gain.setValueAtTime(0.0001, ctx.currentTime + t);
      g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + 0.3);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + t);
      o.stop(ctx.currentTime + t + 0.32);
    });
    window.setTimeout(() => void ctx.close(), 1500);
  } catch { /* no audio on this device */ }
  try { navigator.vibrate?.([200, 100, 200, 100, 200]); } catch { /* not every device can buzz */ }
}

/** A countdown for a time mentioned in a step. Tap to start, tap again to stop. Beeps and buzzes when done. */
function StepTimerButton({ t }: { t: StepTimer }) {
  const [end, setEnd] = useState<number | null>(null);
  const [left, setLeft] = useState(t.seconds);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (end == null) return;
    const id = window.setInterval(() => {
      const rem = Math.round((end - Date.now()) / 1000);
      if (rem <= 0) { window.clearInterval(id); setEnd(null); setLeft(t.seconds); setDone(true); beep(); }
      else setLeft(rem);
    }, 250);
    return () => window.clearInterval(id);
  }, [end, t.seconds]);
  const running = end != null;
  return (
    <button className={`btn ${running ? "btn--primary" : "btn--secondary"} cook__timer`} aria-live="off" onClick={() => { setDone(false); if (running) { setEnd(null); setLeft(t.seconds); } else setEnd(Date.now() + t.seconds * 1000); }}>
      <Icon name="timer" size={18} /> {done ? `Time's up (${t.label})` : running ? `${clock(left)} · tap to stop` : `Start ${clock(t.seconds)} timer`}
    </button>
  );
}
