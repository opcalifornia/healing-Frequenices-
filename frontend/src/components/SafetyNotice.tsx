import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePlayer } from "../store/player";
import { SafetyList } from "./Footer";
import { Icon } from "./Icon";
import "../pages/Profiles.css";

/** Shown once, before the very first session plays. The confirm button is the
 *  user gesture that starts audio. */
export function SafetyNotice() {
  const pending = usePlayer((s) => s.pending);
  const confirm = usePlayer((s) => s.confirmSafety);
  const cancel = usePlayer((s) => s.cancelSafety);
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (pending) btn.current?.focus();
  }, [pending]);

  return (
    <AnimatePresence>
      {pending && (
        <motion.div className="dialog-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={cancel}>
          <motion.div
            className="dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="safety-title"
            aria-describedby="safety-body"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.key === "Escape" && cancel()}
          >
            <span style={{ color: "var(--accent-2)" }}><Icon name="headphones" size={40} /></span>
            <h2 id="safety-title">Before you listen</h2>
            <div id="safety-body" style={{ display: "grid", gap: 14 }}>
              <SafetyList />
              <p style={{ color: "var(--text-3)", fontSize: "var(--fs-small)" }}>
                Sessions may support relaxation, focus, or sleep. They are not a medical treatment.
              </p>
            </div>
            <div className="dialog__actions">
              <button ref={btn} className="btn btn--primary" onClick={confirm}>
                <Icon name="play" size={20} /> I understand, start listening
              </button>
              <button className="btn btn--secondary" onClick={cancel}>Not now</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
