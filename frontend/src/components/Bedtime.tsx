import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { create } from "zustand";
import { Icon } from "./Icon";
import { usePlayer } from "../store/player";
import { useCatalog } from "../store/catalog";
import { fromMinutes, nightKey, streak, toMinutes, useNights, usePlan, type BedtimePlan } from "../store/bedtime";
import type { Catalog, Title } from "../types";
import "./Bedtime.css";

/** Builds the two-part routine: wind-down session, then the sleep session with its timer. */
export function routineTitles(plan: BedtimePlan, catalog: Catalog): Title[] {
  const wind = catalog.titles[plan.windDownId];
  const sleep = catalog.titles[plan.sleepId];
  const out: Title[] = [];
  if (wind) out.push({ ...wind, durationMin: plan.windDown });
  if (sleep) out.push({ ...sleep, durationMin: plan.sleepTimer });
  return out;
}

export function windDownStart(plan: BedtimePlan): string {
  return fromMinutes(toMinutes(plan.bedtime) - plan.windDown);
}

export function hoursInBed(plan: BedtimePlan): number {
  const diff = (toMinutes(plan.wake) - toMinutes(plan.bedtime) + 1440) % 1440;
  return diff / 60;
}

export function StartWindDownButton({ small }: { small?: boolean }) {
  const plan = usePlan();
  const catalog = useCatalog();
  const playSequence = usePlayer((s) => s.playSequence);
  return (
    <button
      className={`btn btn--primary ${small ? "btn--small" : ""}`}
      disabled={!catalog}
      onClick={() => {
        if (!catalog) return;
        useReminder.getState().dismiss();
        playSequence(routineTitles(plan, catalog));
      }}
    >
      <Icon name="play" size={small ? 18 : 20} /> Start wind-down
    </button>
  );
}

/** Home-page card: tonight's plan, streak, and one tap to begin. */
export function TonightCard() {
  const plan = usePlan();
  const nights = useNights();
  const s = streak(nights);
  const tonight = nights.includes(nightKey(new Date()));
  return (
    <section className="tonight" aria-labelledby="tonight-title">
      <div className="tonight__moon" aria-hidden="true" />
      <div className="tonight__text">
        <span className="tonight__eyebrow">Tonight</span>
        <h2 id="tonight-title">Wind down at {windDownStart(plan)}, lights out at {plan.bedtime}</h2>
        <p>
          {s > 0 ? `${s}-night streak${tonight ? ", tonight counted" : ""}.` : "Start a streak tonight."} {plan.windDown} minutes of wind-down, then sleep
          sounds for {plan.sleepTimer} minutes.
        </p>
      </div>
      <div className="tonight__actions">
        <StartWindDownButton small />
        <Link to="/bedtime" className="btn btn--secondary btn--small">Edit routine</Link>
      </div>
    </section>
  );
}

/* ---------- In-app reminder ---------- */

interface ReminderState {
  open: boolean;
  firedFor: string | null;
  show(key: string): void;
  dismiss(): void;
}

export const useReminder = create<ReminderState>((set) => ({
  open: false,
  firedFor: null,
  show: (key) => set({ open: true, firedFor: key }),
  dismiss: () => set({ open: false }),
}));

/** Checks the clock while the app is open and nudges at wind-down time. */
export function useBedtimeReminder() {
  const plan = usePlan();
  useEffect(() => {
    if (!plan.remind) return;
    const check = () => {
      const now = new Date();
      const start = toMinutes(windDownStart(plan));
      const mins = now.getHours() * 60 + now.getMinutes();
      const key = nightKey(now);
      const { firedFor, show } = useReminder.getState();
      // Fire within the first 10 minutes of the wind-down window, once per night.
      const delta = (mins - start + 1440) % 1440;
      if (delta > 10 || firedFor === key) return;
      if (usePlayer.getState().status === "playing") return;
      show(key);
      if ("Notification" in window && Notification.permission === "granted") {
        const body = `Dim the lights. Lights out at ${plan.bedtime}.`;
        navigator.serviceWorker?.getRegistration().then((reg) => {
          if (reg) reg.showNotification("Time to wind down", { body, icon: "/icons/icon-192.png", tag: "bedtime" });
          else new Notification("Time to wind down", { body, icon: "/icons/icon-192.png", tag: "bedtime" });
        }).catch(() => {});
      }
    };
    check();
    const id = window.setInterval(check, 30_000);
    return () => window.clearInterval(id);
  }, [plan]);
}

export function BedtimeToast() {
  const open = useReminder((s) => s.open);
  const dismiss = useReminder((s) => s.dismiss);
  const plan = usePlan();
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="bedtime-toast"
          role="status"
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
        >
          <Icon name="bell" size={20} />
          <span><strong>Time to wind down.</strong> Lights out at {plan.bedtime}.</span>
          <StartWindDownButton small />
          <button className="icon-btn icon-btn--small icon-btn--plain" aria-label="Dismiss reminder" onClick={dismiss}>
            <Icon name="close" size={18} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
