import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { create } from "zustand";
import { Icon } from "../components/Icon";
import { reminderItems, reminderText } from "./gardenCare";
import { DEFAULT_PREFS, useGarden } from "../store/garden";
import { useUser } from "../store/user";
import { todayKey } from "../store/nourish";

interface ToastState {
  open: boolean;
  title: string;
  body: string;
  show(title: string, body: string): void;
  dismiss(): void;
}

export const useGardenToast = create<ToastState>((set) => ({
  open: false,
  title: "",
  body: "",
  show: (title, body) => set({ open: true, title, body }),
  dismiss: () => set({ open: false }),
}));

/** Show the in-app banner, and a system notification too where the browser allows it. */
export function showGardenReminder(title: string, body: string) {
  useGardenToast.getState().show(title, body);
  if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
  const opts = { body, icon: "/icons/icon-192.png", tag: "garden" };
  navigator.serviceWorker?.getRegistration().then((reg) => {
    if (reg) void reg.showNotification(title, opts);
    else new Notification(title, opts);
  }).catch(() => {
    try { new Notification(title, opts); } catch { /* not allowed here */ }
  });
}

/** While the app is open, remind at the chosen time, once a day. Opening the app later in the day still shows it. */
export function useGardenReminder(enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const check = () => {
      const user = useUser.getState().activeProfileId;
      if (!user) return;
      const g = useGarden.getState();
      const prefs = { ...DEFAULT_PREFS, ...g.prefs[user] };
      const today = todayKey();
      if (!prefs.app || prefs.lastShown === today) return;
      const now = new Date();
      const [h, m] = prefs.time.split(":").map(Number);
      if (now.getHours() * 60 + now.getMinutes() < h * 60 + m) return;
      const items = reminderItems(g.beds[user] ?? [], g.custom[user] ?? [], prefs, today);
      g.setPrefs({ lastShown: today });
      if (!items.length) return;
      const t = reminderText(items);
      showGardenReminder(t.title, t.body);
    };
    check();
    const id = window.setInterval(check, 30_000);
    // Also look when the person changes their settings or plants something, so turning it on shows it right away if it's time.
    const unsub = useGarden.subscribe(check);
    return () => {
      window.clearInterval(id);
      unsub();
    };
  }, [enabled]);
}

export function GardenToast() {
  const { open, title, body, dismiss } = useGardenToast();
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="bedtime-toast" role="status" initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -80, opacity: 0 }}>
          <Icon name="leaf" size={20} />
          <span><strong>{title}.</strong> {body}</span>
          <Link to="/garden#mine" className="btn btn--primary btn--small" onClick={dismiss}>Open garden</Link>
          <button className="icon-btn icon-btn--small icon-btn--plain" aria-label="Dismiss reminder" onClick={dismiss}>
            <Icon name="close" size={18} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
