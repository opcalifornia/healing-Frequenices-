import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import { unlockedSymbols, useGrowth } from "./growth";
import { symbolById } from "./symbols";
import { useActiveProfile } from "../store/user";

/**
 * A quiet note when a new symbol is earned. It stays a few seconds, asks for
 * nothing, and never appears for symbols earned before this was added.
 */
export function UnlockNotice() {
  const profile = useActiveProfile();
  const stats = useGrowth();
  const [newOnes, setNewOnes] = useState<string[]>([]);

  useEffect(() => {
    if (!profile) return;
    const key = `rooted-unlocks-seen-${profile.id}`;
    const now = unlockedSymbols(stats);
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) {
        localStorage.setItem(key, JSON.stringify(now)); // first run: remember what's already earned, say nothing
        return;
      }
      const seen: string[] = JSON.parse(raw);
      const fresh = now.filter((id) => !seen.includes(id));
      if (fresh.length) {
        localStorage.setItem(key, JSON.stringify(now));
        setNewOnes(fresh);
      }
    } catch {
      /* storage blocked: skip the notice */
    }
  }, [profile, stats]);

  useEffect(() => {
    if (!newOnes.length) return;
    const t = setTimeout(() => setNewOnes([]), 9000);
    return () => clearTimeout(t);
  }, [newOnes]);

  const labels = newOnes.map((id) => symbolById(id)?.label).filter(Boolean);
  return createPortal(
    <AnimatePresence>
      {labels.length > 0 && (
        <motion.div className="unlock" role="status" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}>
          <span>New symbol earned: <strong>{labels.join(", ")}</strong></span>
          <Link to="/journey" onClick={() => setNewOnes([])}>See it</Link>
          <button onClick={() => setNewOnes([])} aria-label="Dismiss">×</button>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
