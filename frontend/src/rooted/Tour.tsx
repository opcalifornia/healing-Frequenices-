import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "../components/Icon";
import { track } from "./metrics";

/**
 * A short guided tour of Home: spotlights one part of the screen at a time.
 * Starts after the first minute (/?tour=1), or any time from the menu.
 * Steps whose target isn't on screen (desktop vs phone layout) are skipped.
 */

interface Step {
  title: string;
  body: string;
  /** CSS selectors tried in order; the first visible match is highlighted. None = centered card. */
  targets?: string[];
}

const nav = (path: string) => [`.tabbar a[href$="${path}"]`, `.nav__links a[href$="${path}"]`];

export const TOUR: Step[] = [
  { title: "Welcome to Rooted", body: "A 30-second tour so you know where everything lives. You can skip any time." },
  { title: "Your plan for today", body: "A few small things picked for your goals and the time of day. Tap one to start it.", targets: [".hub__today-wrap", ".hub__setup"] },
  { title: "Breathe", body: "Guided breathing for relaxation, sleep and focus, plus a camera heart check and reminders.", targets: nav("/breathe") },
  { title: "Nourish", body: "Food science, a smart shopping list, recipes, water and a store finder.", targets: nav("/nourish") },
  { title: "Your health calendar", body: "Schedule routines, see them next to work, and send them to Apple or Google Calendar.", targets: nav("/calendar") },
  { title: "Healing Frequencies", body: "Sound sessions for sleep, focus and relaxation, plus a bedtime routine.", targets: nav("/healing") },
  { title: "Help, any time", body: "The heart opens crisis lines and support from every screen. You're never alone.", targets: [".nav__help"] },
  { title: "Your menu", body: "Profiles, goals, your data, support, and this tour again if you ever need it.", targets: [".nav__avatar"] },
  { title: "Everything in one place", body: "The Guide lists every tool in Rooted and shows the ones you haven't tried yet.", targets: [".hub__guide"] },
  { title: "You're all set", body: "Start small: one thing from your plan today. Come back tomorrow and it starts to stick." },
];

const DONE_KEY = "rooted-tour-done";

export function tourDone(): boolean {
  try {
    return localStorage.getItem(DONE_KEY) === "1";
  } catch {
    return true;
  }
}

function findTarget(step: Step): HTMLElement | null {
  for (const sel of step.targets ?? []) {
    for (const el of Array.from(document.querySelectorAll<HTMLElement>(sel))) {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== "hidden") return el;
    }
  }
  return null;
}

/** Mount on Home. Opens when the URL has ?tour=1. */
export function Tour() {
  const location = useLocation();
  const navigate = useNavigate();
  const open = new URLSearchParams(location.search).get("tour") === "1";
  const [i, setI] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);

  // Only keep steps that make sense on this layout, checked after the page has drawn.
  const [steps, setSteps] = useState<Step[]>([]);
  useEffect(() => {
    if (!open) {
      setSteps([]);
      return;
    }
    const t = setTimeout(() => setSteps(TOUR.filter((s) => !s.targets || findTarget(s))), 400);
    return () => clearTimeout(t);
  }, [open]);
  const step = steps[i];

  const close = useCallback(
    (completed: boolean) => {
      try {
        localStorage.setItem(DONE_KEY, "1");
      } catch {
        /* ignore */
      }
      setI(0);
      navigate(location.pathname, { replace: true });
      track(completed ? "tour_completed" : "tour_skipped");
    },
    [navigate, location.pathname],
  );

  useLayoutEffect(() => {
    if (!step) return;
    const el = findTarget(step);
    if (!el) {
      setRect(null);
      return;
    }
    el.scrollIntoView({ block: "center", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    const update = () => setRect(el.getBoundingClientRect());
    const t = setTimeout(update, 350);
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update);
    };
  }, [step]);

  useEffect(() => {
    if (!step) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(false);
      if (e.key === "ArrowRight") setI((n) => Math.min(n + 1, steps.length - 1));
      if (e.key === "ArrowLeft") setI((n) => Math.max(0, n - 1));
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [step, steps.length, close]);

  if (!open || !step) return null;
  const last = i === steps.length - 1;
  const pad = 8;
  const hole = rect ? { top: rect.top - pad, left: rect.left - pad, width: rect.width + pad * 2, height: rect.height + pad * 2 } : null;
  // Put the card below the target, or above it when the target sits low on screen.
  const below = hole ? hole.top + hole.height + 220 < window.innerHeight : true;
  // Position with top/bottom only: framer-motion owns the transform.
  const cardStyle = hole
    ? below
      ? { top: Math.min(hole.top + hole.height + 14, window.innerHeight - 230) }
      : { bottom: Math.max(14, window.innerHeight - hole.top + 14) }
    : { top: "28%" };

  return createPortal(
    <div className="tour" role="dialog" aria-modal="true" aria-label={`Tour, step ${i + 1} of ${steps.length}: ${step.title}`}>
      <div className="tour__shade" onClick={() => close(false)} />
      <AnimatePresence>
        {hole && (
          <motion.div
            className="tour__hole"
            initial={false}
            animate={{ top: hole.top, left: hole.left, width: hole.width, height: hole.height }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
          />
        )}
      </AnimatePresence>
      <motion.div key={i} className="tour__card" style={cardStyle} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <span className="tour__count">{i + 1} of {steps.length}</span>
        <h2>{step.title}</h2>
        <p>{step.body}</p>
        <div className="tour__actions">
          <button className="tour__skip" onClick={() => close(false)}>{last ? "Close" : "Skip tour"}</button>
          <span className="tour__nav">
            {i > 0 && <button className="btn btn--secondary btn--small" onClick={() => setI(i - 1)} aria-label="Previous step"><Icon name="chevronLeft" size={16} /></button>}
            <button className="btn btn--primary btn--small" onClick={() => (last ? close(true) : setI(i + 1))} autoFocus>
              {last ? "Let's go" : "Next"} {!last && <Icon name="chevronRight" size={16} />}
            </button>
          </span>
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}
