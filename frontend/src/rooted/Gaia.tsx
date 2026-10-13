import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sheet, Evidence } from "./ui";
import { askGaia, useCheckGaia, useGaiaStatus, type GaiaTurn } from "./gaia";
import { useCrisis } from "../store/support";
import { Icon } from "../components/Icon";
import type { Strength } from "../learn/brainContent";
import "./Gaia.css";

const STARTERS = ["I can't sleep", "I need a little energy", "I'm feeling overwhelmed", "Plan a gentle morning for me"];

/** The floating GAIA button, one tap away on every screen. Only shows for accounts GAIA is switched on for. */
export function GaiaButton() {
  useCheckGaia();
  const { enabled, open, setOpen } = useGaiaStatus();
  if (!enabled) return null;
  return (
    <>
      {!open && (
        <motion.button className="gaia-fab" onClick={() => setOpen(true)} aria-label="Talk to GAIA" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} whileTap={{ scale: 0.92 }}>
          <span className="gaia-fab__orb" aria-hidden="true" />
          <span className="gaia-fab__label">GAIA</span>
        </motion.button>
      )}
      <GaiaSheet open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function GaiaSheet({ open, onClose }: { open: boolean; onClose(): void }) {
  const navigate = useNavigate();
  const showCrisis = useCrisis((s) => s.show);
  const [turns, setTurns] = useState<GaiaTurn[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const abort = useRef<AbortController | null>(null);
  const end = useRef<HTMLDivElement>(null);

  // Keep the chat (and any reply still arriving) when the sheet closes; tapping GAIA brings it back.
  useEffect(() => end.current?.scrollIntoView({ block: "end" }), [turns, open]);

  const update = (fn: (t: GaiaTurn) => GaiaTurn) => setTurns((all) => [...all.slice(0, -1), fn(all[all.length - 1])]);

  const send = async (text: string) => {
    const msg = text.trim();
    if (!msg || busy) return;
    setDraft("");
    const history: GaiaTurn[] = [...turns, { role: "user", text: msg }];
    setTurns([...history, { role: "assistant", text: "" }]);
    setBusy(true);
    const ctrl = new AbortController();
    abort.current = ctrl;
    let navigated = false;
    try {
      for await (const ev of askGaia(history, ctrl.signal)) {
        if (ev.type === "text") update((t) => ({ ...t, text: t.text + ev.text }));
        else if (ev.type === "cards") update((t) => ({ ...t, cards: [...(t.cards ?? []), ...ev.items] }));
        else if (ev.type === "navigate") {
          update((t) => ({ ...t, opened: [...(t.opened ?? []), ev.label] }));
          if (!navigated) {
            navigated = true;
            navigate(ev.to);
            onClose();
          }
        } else if (ev.type === "crisis") showCrisis();
        else if (ev.type === "error") update((t) => ({ ...t, error: ev.message }));
      }
    } catch (e) {
      if ((e as { name?: string })?.name !== "AbortError") update((t) => ({ ...t, error: "GAIA couldn't be reached. Check your connection." }));
    } finally {
      setBusy(false);
      abort.current = null;
    }
  };

  return (
    <Sheet open={open} onClose={onClose} label="GAIA">
      <div className="gaia">
        <header className="gaia__head">
          <span className="gaia__orb" aria-hidden="true" />
          <div>
            <h2>GAIA</h2>
            <p>Your guide in Rooted</p>
          </div>
          {turns.length > 0 && (
            <button className="gaia__clear" onClick={() => { abort.current?.abort(); setTurns([]); }} disabled={busy}>New chat</button>
          )}
        </header>

        <div className="gaia__log" aria-live="polite">
          {turns.length === 0 && (
            <div className="gaia__hello">
              <p>Hi, I'm GAIA. Tell me how you're feeling or what you'd like help with, and I'll find something in Rooted that fits.</p>
              <div className="gaia__starters">
                {STARTERS.map((s) => (
                  <button key={s} className="chip" onClick={() => send(s)}>{s}</button>
                ))}
              </div>
            </div>
          )}
          {turns.map((t, i) => (
            <div key={i} className={`gaia__turn gaia__turn--${t.role}`}>
              {t.text && <p className="gaia__bubble">{t.text}</p>}
              {!t.text && t.role === "assistant" && busy && i === turns.length - 1 && <p className="gaia__bubble gaia__typing" aria-label="GAIA is thinking"><span /><span /><span /></p>}
              {t.cards && t.cards.length > 0 && (
                <ul className="gaia__cards">
                  {t.cards.map((c) => (
                    <li key={c.id}>
                      <Link to={c.to} onClick={onClose}>
                        <strong>{c.title}</strong>
                        {c.summary && <small>{c.summary}</small>}
                        <span className="gaia__meta">
                          {c.evidence && <Evidence s={c.evidence as Strength} short />}
                          {c.minutes ? <span>{c.minutes} min</span> : null}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              {t.opened?.map((o) => <p key={o} className="gaia__opened"><Icon name="check" size={14} /> Opened {o}</p>)}
              {t.error && <p className="gaia__error" role="alert">{t.error}</p>}
            </div>
          ))}
          <div ref={end} />
        </div>

        <form className="gaia__form" onSubmit={(e) => { e.preventDefault(); void send(draft); }}>
          <label htmlFor="gaia-input" className="visually-hidden">Message GAIA</label>
          <input id="gaia-input" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Message GAIA" autoComplete="off" maxLength={2000} />
          <button className="gaia__send" type="submit" disabled={!draft.trim() || busy} aria-label="Send"><Icon name="chevronRight" size={20} /></button>
        </form>
        <p className="gaia__fine">GAIA is an AI and can make mistakes. Wellness education, not medical advice. In a crisis, call or text 988.</p>
      </div>
    </Sheet>
  );
}
