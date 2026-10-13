import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Sheet, SourceLink } from "./ui";
import { CRISIS_LINES, IF_WORRIED, IF_WORRIED_SOURCE, LINE_988, OUTSIDE_US, SAFETY_PLAN_SOURCE, SAFETY_PLAN_STEPS, type Line, type PlanStepId } from "./supportContent";
import { phoneIn, useCrisis, useSafetyPlan, useSupport, useTodayMood, type Mood } from "../store/support";
import { Icon } from "../components/Icon";
import { APP_NAME } from "../brand";

const smsHref = (to: string, body?: string) => `sms:${to}${body ? `?&body=${encodeURIComponent(body)}` : ""}`;

export function LineCard({ l, big = false }: { l: Line; big?: boolean }) {
  return (
    <div className={`line ${big ? "line--big" : ""}`}>
      <strong>{l.name}</strong>
      <span className="line__who">{l.who}</span>
      <div className="line__actions">
        {l.call && <a className={`btn ${big ? "btn--primary" : "btn--secondary"} btn--small`} href={`tel:${l.call}`}><Icon name="phone" size={18} /> {l.callLabel}</a>}
        {l.text && <a className="btn btn--secondary btn--small" href={smsHref(l.text.to, l.text.body)}><Icon name="message" size={18} /> {l.text.label}</a>}
        {l.chat && <a className="btn btn--secondary btn--small" href={l.chat} target="_blank" rel="noreferrer">Chat online</a>}
      </div>
      {l.note && <span className="line__note">{l.note}</span>}
    </div>
  );
}

/** The always-available help sheet. Opened from the heart button in the nav, from anywhere. */
export function CrisisSheet() {
  const { open, hide } = useCrisis();
  const plan = useSafetyPlan();
  const hasPlan = Object.values(plan).some((v) => v && v.length);
  return (
    <Sheet open={open} onClose={hide} label="Get help now">
      <div className="crisis">
        <header className="crisis__head">
          <span className="crisis__heart" aria-hidden="true"><Icon name="heart" size={26} /></span>
          <h2>You don't have to go through this alone.</h2>
          <p>If you're thinking about suicide, or you're worried about someone, real people are ready to listen right now. It's free and confidential.</p>
        </header>
        <LineCard l={LINE_988} big />
        <a className="crisis__emergency" href="tel:911"><Icon name="phone" size={18} /> In immediate danger? Call 911</a>
        {hasPlan && <Link to="/support#plan" className="btn btn--secondary crisis__plan" onClick={hide}>Open my safety plan</Link>}
        <details className="crisis__more">
          <summary>More lines and support outside the US</summary>
          <div className="crisis__lines">{CRISIS_LINES.slice(1).map((l) => <LineCard key={l.name} l={l} />)}</div>
          <ul className="crisis__intl">
            {OUTSIDE_US.map((o) => (
              <li key={o.place}><strong>{o.place}:</strong> {o.url ? <a href={o.url} target="_blank" rel="noreferrer">{o.how}</a> : o.call ? <a href={`tel:${o.call}`}>{o.how}</a> : o.how}</li>
            ))}
          </ul>
        </details>
        <p className="crisis__fine">{APP_NAME} isn't a crisis service and can't respond to messages. These lines are staffed by trained people, 24/7.</p>
      </div>
    </Sheet>
  );
}

/** Small persistent button that opens the help sheet. */
export function HelpButton() {
  const show = useCrisis((s) => s.show);
  return (
    <button className="nav__icon nav__help" onClick={show} aria-label="Get help now: crisis support">
      <Icon name="heart" />
    </button>
  );
}

/** Gentle card shown when something someone writes sounds like they may be in crisis. */
export function CrisisNudge() {
  const show = useCrisis((s) => s.show);
  return (
    <motion.div className="nudge" role="status" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Icon name="heart" size={20} />
      <div>
        <strong>It sounds like things might be really hard right now.</strong>
        <span> You deserve support. You can call or text 988 any time to talk with someone.</span>
        <div className="nudge__actions">
          <a className="btn btn--primary btn--small" href="tel:988">Call 988</a>
          <a className="btn btn--secondary btn--small" href="sms:988">Text 988</a>
          <button className="btn btn--secondary btn--small" onClick={show}>More options</button>
        </div>
      </div>
    </motion.div>
  );
}

const FACES: Array<{ m: Mood; label: string; face: string }> = [
  { m: 1, label: "Really struggling", face: "M8 16c1.2-1.6 2.6-2.3 4-2.3s2.8.7 4 2.3" },
  { m: 2, label: "Low", face: "M8.5 15.5c1-.8 2.2-1.2 3.5-1.2s2.5.4 3.5 1.2" },
  { m: 3, label: "Okay", face: "M8.5 15h7" },
  { m: 4, label: "Good", face: "M8.5 14.5c1 .9 2.2 1.3 3.5 1.3s2.5-.4 3.5-1.3" },
  { m: 5, label: "Great", face: "M8 14c1.2 1.8 2.6 2.6 4 2.6s2.8-.8 4-2.6" },
];

/** "How are you today?" A low answer gently surfaces support. */
export function MoodCheck() {
  const mood = useTodayMood();
  const setMood = useSupport((s) => s.setMood);
  const show = useCrisis((s) => s.show);
  return (
    <div className="mood r-card">
      <div className="mood__row">
        <span className="mood__q">{mood ? "Thanks for checking in." : "How are you today?"}</span>
        <div className="mood__faces" role="radiogroup" aria-label="How are you today?">
          {FACES.map((f) => (
            <motion.button key={f.m} role="radio" aria-checked={mood === f.m} aria-label={f.label} title={f.label} className={`mood__face ${mood === f.m ? "is-on" : ""}`} onClick={() => setMood(f.m)} whileTap={{ scale: 0.9 }} style={{ "--m": f.m } as React.CSSProperties}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.5" /><circle cx="9" cy="10" r="1" className="mood__eye" /><circle cx="15" cy="10" r="1" className="mood__eye" /><path d={f.face} /></svg>
            </motion.button>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {mood && mood <= 2 && (
          <motion.div className="mood__support" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
            <p>{mood === 1 ? "I'm sorry today is so hard. You don't have to carry it alone." : "Low days happen. Be gentle with yourself today."}</p>
            <div className="nudge__actions">
              {mood === 1 && <button className="btn btn--primary btn--small" onClick={show}><Icon name="heart" size={18} /> Talk to someone now</button>}
              <Link className="btn btn--secondary btn--small" to="/combos">Try Gentle Reset</Link>
              <Link className="btn btn--secondary btn--small" to="/support">Find support</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** The Stanley-Brown safety plan, filled in step by step and kept on the device. */
export function SafetyPlanBuilder() {
  const plan = useSafetyPlan();
  const setStep = useSupport((s) => s.setStep);
  const [openStep, setOpenStep] = useState<PlanStepId | null>(null);
  const [draft, setDraft] = useState("");
  const filled = SAFETY_PLAN_STEPS.filter((s) => (plan[s.id] ?? []).length).length;

  const add = (id: PlanStepId) => {
    const v = draft.trim();
    if (!v) return;
    setStep(id, [...(plan[id] ?? []), v]);
    setDraft("");
  };
  const text = () =>
    [`My safety plan (${APP_NAME})`, "", ...SAFETY_PLAN_STEPS.flatMap((s, i) => [`${i + 1}. ${s.title.toUpperCase()}`, ...((plan[s.id] ?? []).map((l) => `   - ${l}`)), s.id === "pros" ? "   - 988 Suicide & Crisis Lifeline: call or text 988" : "", ""]), "In immediate danger, call 911."].filter((l, i, a) => !(l === "" && a[i - 1] === "")).join("\n");

  const save = async () => {
    const t = text();
    const host = (window as unknown as { claude?: { use?(n: string): Promise<{ save(o: { filename: string; data: string }): Promise<unknown> } | null> } }).claude;
    const saver = host?.use ? await host.use("downloads").catch(() => null) : null;
    if (saver) return void saver.save({ filename: "my-safety-plan.txt", data: t }).catch(() => undefined);
    const url = URL.createObjectURL(new Blob([t], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-safety-plan.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="splan">
      <div className="splan__meter"><span>{filled} of {SAFETY_PLAN_STEPS.length} steps filled in</span><i><b style={{ width: `${(filled / SAFETY_PLAN_STEPS.length) * 100}%` }} /></i></div>
      <ol className="splan__steps">
        {SAFETY_PLAN_STEPS.map((s, i) => {
          const lines = plan[s.id] ?? [];
          const isOpen = openStep === s.id;
          return (
            <li key={s.id} className={`splan__step ${isOpen ? "is-open" : ""} ${lines.length ? "is-filled" : ""}`}>
              <button className="splan__head" onClick={() => { setOpenStep(isOpen ? null : s.id); setDraft(""); }} aria-expanded={isOpen}>
                <span className="splan__n">{lines.length ? <Icon name="check" size={16} /> : i + 1}</span>
                <span><strong>{s.title}</strong><small>{s.prompt}</small></span>
                <Icon name="chevronDown" size={18} className="splan__caret" />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div className="splan__body" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                    <ul className="splan__lines">
                      {s.id === "pros" && <li><span>988 Suicide &amp; Crisis Lifeline</span><a className="btn btn--secondary btn--small" href="tel:988">Call</a><a className="btn btn--secondary btn--small" href="sms:988">Text</a></li>}
                      {lines.map((l, k) => {
                        const ph = phoneIn(l);
                        return (
                          <li key={k}>
                            <span>{l}</span>
                            {ph && <a className="btn btn--secondary btn--small" href={`tel:${ph}`}><Icon name="phone" size={16} /> Call</a>}
                            <button className="icon-btn slist__rm" onClick={() => setStep(s.id, lines.filter((_, x) => x !== k))} aria-label={`Remove ${l}`}><Icon name="trash" size={16} /></button>
                          </li>
                        );
                      })}
                    </ul>
                    <form className="slist__add" onSubmit={(e) => { e.preventDefault(); add(s.id); }}>
                      <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={s.placeholder} aria-label={s.title} />
                      <button className="btn btn--secondary btn--small" type="submit">Add</button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ol>
      <div className="slist__actions">
        <button className="btn btn--primary btn--small" onClick={save} disabled={!filled}>Download my plan</button>
        <span className="splan__private">Private: stored only on this device. Consider sharing a copy with someone you trust or your therapist.</span>
      </div>
      <p className="nourish__src"><SourceLink s={SAFETY_PLAN_SOURCE} /></p>
    </div>
  );
}

export function IfWorried() {
  return (
    <div className="r-card worried">
      <ol>{IF_WORRIED.map((w) => <li key={w}>{w}</li>)}</ol>
      <p className="nourish__src"><SourceLink s={IF_WORRIED_SOURCE} /></p>
    </div>
  );
}
