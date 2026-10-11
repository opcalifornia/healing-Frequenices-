import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { Strength } from "../learn/brainContent";
import { Icon } from "../components/Icon";
import type { Source } from "./pantryContent";

const LABEL: Record<Strength, string> = { Strong: "Strong evidence", Moderate: "Moderate evidence", Mixed: "Mixed evidence", Weak: "Early evidence", None: "No support" };

export function Evidence({ s, short = false }: { s: Strength; short?: boolean }) {
  return (
    <em className={`ev ev--${s.toLowerCase()}`} title={LABEL[s]}>
      {short ? LABEL[s].replace(" evidence", "") : LABEL[s]}
    </em>
  );
}

export function SourceLink({ s }: { s: Source }) {
  return s.url ? (
    <a href={s.url} target="_blank" rel="noreferrer" className="src-link">
      {s.text} <span aria-hidden="true">↗</span>
    </a>
  ) : (
    <span className="src-link">{s.text}</span>
  );
}

/** Modal panel: slides up on phones, scales in on larger screens. Esc and backdrop close it. */
export function Sheet({ open, onClose, children, label, wide = false }: { open: boolean; onClose(): void; children: ReactNode; label: string; wide?: boolean }) {
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    setTimeout(() => panel.current?.focus(), 30);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus?.();
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div className="sheet" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
          <motion.div
            ref={panel}
            className={`sheet__panel rooted ${wide ? "sheet__panel--wide" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            tabIndex={-1}
            initial={{ y: 60, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
          >
            <button className="sheet__close icon-btn" onClick={onClose} aria-label="Close">
              <Icon name="close" size={20} />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/** Sticky section tabs with a sliding pill and scroll-spy. */
export function SecTabs({ tabs }: { tabs: Array<{ id: string; label: string }> }) {
  const [active, setActive] = useState(tabs[0].id);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    tabs.forEach((t) => {
      const el = document.getElementById(t.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [tabs]);
  return (
    <nav className="sec-tabs" aria-label="On this page">
      {tabs.map((t) => (
        <a
          key={t.id}
          href={`#${t.id}`}
          className={active === t.id ? "is-on" : ""}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(t.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        >
          {active === t.id && <motion.span layoutId="sec-tab-pill" className="sec-tabs__pill" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
          {t.label}
        </a>
      ))}
    </nav>
  );
}

/** Small toast that confirms an action. */
export function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  const t = useRef<ReturnType<typeof setTimeout>>();
  const show = (m: string) => {
    setMsg(m);
    clearTimeout(t.current);
    t.current = setTimeout(() => setMsg(null), 2200);
  };
  const node = createPortal(
    <AnimatePresence>
      {msg && (
        <motion.div className="r-toast" role="status" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
          <Icon name="check" size={18} /> {msg}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
  return { show, node };
}
