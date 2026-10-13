import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
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

/** Open modal layers (sheets, full-screen players), innermost last, so Escape and the
 *  focus trap only act on the topmost one. */
const layerStack: symbol[] = [];
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"], audio[controls], video[controls], summary';

/**
 * Modal focus management: moves focus into `ref` when `open`, keeps Tab / Shift+Tab inside it,
 * closes on Escape (only when it is the topmost layer), and returns focus to the trigger on close.
 */
export function useModalFocus(ref: RefObject<HTMLElement>, open: boolean, onClose: () => void, { lockScroll = true, autoFocus = true } = {}) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  // Remember the trigger during the render that opens the layer: by the time effects run,
  // an autoFocus field inside the layer may already have taken focus.
  const trigger = useRef<HTMLElement | null>(null);
  const wasOpen = useRef(false);
  if (open && !wasOpen.current && typeof document !== "undefined") trigger.current = document.activeElement as HTMLElement | null;
  wasOpen.current = open;
  useEffect(() => {
    if (!open) return;
    const id = Symbol("layer");
    layerStack.push(id);
    const prev = trigger.current && !ref.current?.contains(trigger.current) ? trigger.current : null;
    const onKey = (e: KeyboardEvent) => {
      if (layerStack[layerStack.length - 1] !== id) return;
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopImmediatePropagation();
        closeRef.current();
        return;
      }
      const el = ref.current;
      if (e.key !== "Tab" || !el) return;
      const items = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((n) => n.getClientRects().length > 0);
      if (!items.length) {
        e.preventDefault();
        el.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (!active || !el.contains(active)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (e.shiftKey && (active === first || active === el)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    // Capture phase so the topmost layer handles Escape before any page-level listeners.
    document.addEventListener("keydown", onKey, true);
    if (lockScroll) document.body.style.overflow = "hidden";
    const t = autoFocus ? setTimeout(() => { if (ref.current && !ref.current.contains(document.activeElement)) ref.current.focus(); }, 30) : undefined;
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey, true);
      const i = layerStack.indexOf(id);
      if (i >= 0) layerStack.splice(i, 1);
      if (lockScroll && !layerStack.length) document.body.style.overflow = "";
      if (prev && document.contains(prev)) prev.focus?.({ preventScroll: true });
    };
  }, [open, ref, lockScroll, autoFocus]);
}

/**
 * Lets the phone's back gesture (or the browser's back button) close the top pop-up page
 * instead of leaving the screen underneath. Each open sheet adds one history entry; closing
 * it by hand (X, backdrop, Escape) removes that entry again. A single listener closes only the
 * topmost sheet, and pops caused by our own clean-up are ignored.
 */
interface SheetEntry {
  id: number;
  close(): void;
}
const sheetStack: SheetEntry[] = [];
let sheetUid = 0;
let ignorePops = 0;
let popBound = false;

function bindPop() {
  if (popBound || typeof window === "undefined") return;
  popBound = true;
  window.addEventListener("popstate", () => {
    if (ignorePops > 0) {
      ignorePops--;
      return;
    }
    const top = sheetStack.pop();
    top?.close();
  });
}

export function useBackToClose(open: boolean, onClose: () => void) {
  const latest = useRef(onClose);
  latest.current = onClose;
  useEffect(() => {
    if (!open || typeof window === "undefined") return;
    bindPop();
    const entry: SheetEntry = { id: ++sheetUid, close: () => latest.current() };
    try {
      window.history.pushState({ ...(window.history.state ?? {}), rootedSheet: entry.id }, "");
    } catch {
      return;
    }
    sheetStack.push(entry);
    return () => {
      const i = sheetStack.indexOf(entry);
      if (i < 0) return; // it was closed by the back gesture, which already removed the entry
      sheetStack.splice(i, 1);
      // Closed by hand: take our entry back off, but only if we are still on it (not after navigating away).
      if ((window.history.state as { rootedSheet?: number } | null)?.rootedSheet === entry.id) {
        ignorePops++;
        window.history.back();
      }
    };
  }, [open]);
}

/** Modal panel: slides up on phones, scales in on larger screens. Esc and backdrop close it.
 *  Focus moves into the panel, Tab cycles within it, and focus returns to the trigger on close. */
export function Sheet({ open, onClose, children, label, wide = false }: { open: boolean; onClose(): void; children: ReactNode; label: string; wide?: boolean }) {
  const panel = useRef<HTMLDivElement>(null);
  useModalFocus(panel, open, onClose);
  useBackToClose(open, onClose);

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
          aria-current={active === t.id ? "location" : undefined}
          onClick={(e) => {
            e.preventDefault();
            const el = document.getElementById(t.id);
            if (!el) return;
            const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
            el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
            // Move keyboard / screen-reader focus to the section too, not just the viewport.
            if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
            el.focus({ preventScroll: true });
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
