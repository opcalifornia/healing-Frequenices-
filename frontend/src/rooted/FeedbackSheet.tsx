import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Sheet } from "./ui";
import { FEEDBACK_KINDS, MAX_FEEDBACK, sendFeedback, useFeedback, type FeedbackKind, type FeedbackResult } from "./feedback";
import { apiEnabled } from "../api/client";
import { useCrisis } from "../store/support";
import "./FeedbackSheet.css";

/** "Send feedback" sheet. Opens from the footer or the profile menu, and remembers which screen it was opened on. */
export function FeedbackSheet() {
  const { open, hide } = useFeedback();
  const showHelp = useCrisis((s) => s.show);
  const { pathname } = useLocation();
  const [page, setPage] = useState("/");
  const [kind, setKind] = useState<FeedbackKind>("confusing");
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<FeedbackResult | null>(null);

  // Capture the screen at the moment the sheet opens, and start fresh each time.
  useEffect(() => {
    if (open) {
      setPage(pathname);
      setResult(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const done = result === "sent" || result === "shared" || result === "copied";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || busy) return;
    setBusy(true);
    const r = await sendFeedback({ kind, message, page, contact });
    setBusy(false);
    setResult(r);
    if (r !== "failed") {
      setMessage("");
      setContact("");
    }
  };

  return (
    <Sheet open={open} onClose={hide} label="Send feedback">
      <div className="fb">
        {done ? (
          <div className="fb__done" role="status">
            <h2>Thank you.</h2>
            <p>
              {result === "sent" && "Your note was sent. Every message is read."}
              {result === "shared" && "Thanks for sending that along."}
              {result === "copied" && "Your note is copied. Paste it into a message to whoever shared this with you."}
            </p>
            <button className="btn btn--primary" onClick={hide}>Close</button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <h2>Tell us what you think</h2>
            <p className="fb__lede">Short and honest is perfect. It helps make this better for everyone.</p>
            <div className="fb__kinds" role="radiogroup" aria-label="What kind of note is this?">
              {FEEDBACK_KINDS.map((k) => (
                <button type="button" key={k.id} role="radio" aria-checked={kind === k.id} className={`chip ${kind === k.id ? "is-on" : ""}`} onClick={() => setKind(k.id)}>
                  {k.label}
                </button>
              ))}
            </div>
            <label className="fb__label" htmlFor="fb-message">Your note</label>
            <textarea id="fb-message" rows={5} maxLength={MAX_FEEDBACK} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="What happened, or what would you like to see?" autoFocus />
            {apiEnabled && (
              <>
                <label className="fb__label" htmlFor="fb-contact">Want a reply? (optional)</label>
                <input id="fb-contact" type="text" maxLength={160} value={contact} onChange={(e) => setContact(e.target.value)} placeholder="An email or phone number" autoComplete="off" />
              </>
            )}
            {result === "failed" && <p className="fb__error" role="alert">That didn't go through. Please try again in a moment.</p>}
            <div className="fb__actions">
              <button className="btn btn--primary" type="submit" disabled={!message.trim() || busy}>{busy ? "Sending…" : apiEnabled ? "Send" : "Share my note"}</button>
            </div>
            <p className="fb__fine">
              {apiEnabled
                ? "Only your note, the type, and the screen you were on are sent. Nothing about your account, profile or health."
                : "Your note goes through your phone's share sheet, so you choose who gets it."}{" "}
              Feedback can't get an answer in an emergency. If you need support right now,{" "}
              <button type="button" className="fb__link" onClick={() => { hide(); showHelp(); }}>open help</button>.
            </p>
          </form>
        )}
      </div>
    </Sheet>
  );
}
