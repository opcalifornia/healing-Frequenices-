import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PageTransition } from "../components/PageTransition";
import { Footer } from "../components/Footer";
import { Icon } from "../components/Icon";
import { StartWindDownButton, hoursInBed, windDownStart } from "../components/Bedtime";
import { useCatalog } from "../store/catalog";
import { bedtimeIcs, fromMinutes, nightKey, streak, toMinutes, useBedtime, useNights, usePlan } from "../store/bedtime";
import { formatHz } from "../format";
import type { Title } from "../types";
import "../components/Player.css";
import "./Bedtime.css";

const WIND_DOWN = [15, 30, 45, 60];
const SLEEP_TIMER = [30, 45, 60, 90, 120];

function SessionSelect({ id, label, value, options, onChange }: { id: string; label: string; value: string; options: Title[]; onChange(v: string): void }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}{t.beat !== undefined && t.mix?.binaural !== 0 ? ` · ${formatHz(t.beat)}` : ""}
          </option>
        ))}
      </select>
    </div>
  );
}

function Chips({ label, value, options, unit, onChange }: { label: string; value: number; options: number[]; unit: string; onChange(v: number): void }) {
  return (
    <div className="field">
      <span className="bt__label">{label}</span>
      <div className="panel__chips" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button key={o} role="radio" aria-checked={value === o} className={`chip ${value === o ? "is-on" : ""}`} onClick={() => onChange(o)}>
            {o} {unit}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Bedtime() {
  const plan = usePlan();
  const setPlan = useBedtime((s) => s.setPlan);
  const nights = useNights();
  const catalog = useCatalog();
  const [notice, setNotice] = useState<string | null>(null);

  const windOptions = useMemo(
    () => Object.values(catalog?.titles ?? {}).filter((t) => t.kind !== "show" && (t.goal === "relax" || t.goal === "meditate") && (t.durationMin ?? 0) >= 10),
    [catalog],
  );
  const sleepOptions = useMemo(() => Object.values(catalog?.titles ?? {}).filter((t) => t.kind !== "show" && t.goal === "sleep"), [catalog]);

  const hours = hoursInBed(plan);
  const s = streak(nights);
  const last14 = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setHours(20, 0, 0, 0);
    d.setDate(d.getDate() - (13 - i));
    return { key: nightKey(d), label: d.toLocaleDateString(undefined, { weekday: "narrow" }), date: d };
  });

  const steps = [
    { at: fromMinutes(toMinutes(plan.bedtime) - 90), title: "Dim the lights", text: "Switch off overhead lights. Use low, warm lamps and night mode on screens." },
    { at: windDownStart(plan), title: "Start wind-down", text: `${catalog?.titles[plan.windDownId]?.name ?? "Your wind-down session"} for ${plan.windDown} minutes. Slow your breathing.` },
    { at: plan.bedtime, title: "Lights out", text: `${catalog?.titles[plan.sleepId]?.name ?? "Your sleep session"} plays for ${plan.sleepTimer} minutes, then fades out.` },
    { at: plan.wake, title: "Wake and get light", text: "Get outside within 30–60 minutes of waking for daylight. Keep this time steady, even on weekends." },
  ];

  const enableReminders = async () => {
    if (plan.remind) {
      setPlan({ remind: false });
      setNotice(null);
      return;
    }
    let msg = "Reminders are on while the app is open.";
    if ("Notification" in window) {
      try {
        const p = Notification.permission === "default" ? await Notification.requestPermission() : Notification.permission;
        if (p === "granted") msg = "Reminders are on. You'll get a notification while the app is open or running in the background.";
        else msg = "Notifications are blocked in your browser, so you'll see the reminder inside the app only.";
      } catch {
        /* unsupported */
      }
    }
    setPlan({ remind: true });
    setNotice(msg);
  };

  const downloadIcs = () => {
    const blob = new Blob([bedtimeIcs(plan)], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), { href: url, download: "healing-frequencies-bedtime.ics" });
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    setNotice("Calendar file downloaded. Open it to add a nightly wind-down alarm that works even when the app is closed.");
  };

  return (
    <PageTransition padded>
      <div className="bt">
        <header className="bt__head">
          <h1 className="page-title" style={{ padding: 0 }}>Bedtime</h1>
          <p>A steady routine every night. Set your times once, then start the wind-down with one tap.</p>
        </header>

        <section className="bt__hero" aria-label="Tonight">
          <div className="bt__times">
            <div><span>Wind down</span><strong>{windDownStart(plan)}</strong></div>
            <div><span>Lights out</span><strong>{plan.bedtime}</strong></div>
            <div><span>Wake</span><strong>{plan.wake}</strong></div>
          </div>
          <p className={`bt__hours ${hours < 7 ? "is-short" : ""}`}>
            {hours.toFixed(1).replace(/\.0$/, "")} hours in bed.{" "}
            {hours < 7 ? "Most adults need at least 7 hours of sleep. Try an earlier lights-out." : "That leaves room for the 7+ hours most adults need."}
          </p>
          <StartWindDownButton />
        </section>

        <section className="bt__card" aria-labelledby="bt-settings">
          <h2 id="bt-settings" className="rail__title">Your routine</h2>
          <div className="bt__grid">
            <div className="field">
              <label htmlFor="bt-bed">Lights out</label>
              <input id="bt-bed" type="time" value={plan.bedtime} onChange={(e) => e.target.value && setPlan({ bedtime: e.target.value })} />
            </div>
            <div className="field">
              <label htmlFor="bt-wake">Wake up</label>
              <input id="bt-wake" type="time" value={plan.wake} onChange={(e) => e.target.value && setPlan({ wake: e.target.value })} />
            </div>
            <SessionSelect id="bt-wind" label="Wind-down session" value={plan.windDownId} options={windOptions} onChange={(v) => setPlan({ windDownId: v })} />
            <SessionSelect id="bt-sleep" label="Sleep session" value={plan.sleepId} options={sleepOptions} onChange={(v) => setPlan({ sleepId: v })} />
            <Chips label="Wind-down length" value={plan.windDown} options={WIND_DOWN} unit="min" onChange={(v) => setPlan({ windDown: v })} />
            <Chips label="Sleep sounds play for" value={plan.sleepTimer} options={SLEEP_TIMER} unit="min" onChange={(v) => setPlan({ sleepTimer: v })} />
          </div>
        </section>

        <section className="bt__card" aria-labelledby="bt-steps">
          <h2 id="bt-steps" className="rail__title">Tonight, step by step</h2>
          <ol className="bt__steps">
            {steps.map((st) => (
              <li key={st.title}>
                <time>{st.at}</time>
                <div>
                  <strong>{st.title}</strong>
                  <p>{st.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link to="/learn/sleep" className="bt__link">Why these steps work: read the Better Sleep guide <Icon name="chevronRight" size={16} /></Link>
        </section>

        <section className="bt__card" aria-labelledby="bt-remind">
          <h2 id="bt-remind" className="rail__title">Reminders</h2>
          <div className="bt__remind">
            <button className={`switch ${plan.remind ? "is-on" : ""}`} role="switch" aria-checked={plan.remind} aria-labelledby="bt-remind-label" onClick={enableReminders}>
              <span />
            </button>
            <div>
              <strong id="bt-remind-label">Remind me at {windDownStart(plan)}</strong>
              <p>Works while the app is open or installed and running in the background.</p>
            </div>
          </div>
          <button className="btn btn--secondary btn--small" onClick={downloadIcs}>
            <Icon name="timer" size={18} /> Add a nightly alarm to my calendar
          </button>
          {notice && <p className="bt__notice" role="status">{notice}</p>}
        </section>

        <section className="bt__card" aria-labelledby="bt-streak">
          <h2 id="bt-streak" className="rail__title">Your streak</h2>
          <p className="bt__streak"><strong>{s}</strong> {s === 1 ? "night" : "nights"} in a row</p>
          <ol className="bt__nights" aria-label="Last 14 nights">
            {last14.map((n) => {
              const on = nights.includes(n.key);
              return (
                <li key={n.key} className={on ? "is-on" : ""} title={`${n.date.toLocaleDateString()}: ${on ? "listened" : "no session"}`}>
                  <span aria-hidden="true" />
                  <small>{n.label}</small>
                  <span className="visually-hidden">{n.date.toLocaleDateString()}: {on ? "listened" : "no session"}</span>
                </li>
              );
            })}
          </ol>
          <p className="bt__fine">A night counts when you listen to a sleep or relaxation session for at least 10 minutes in the evening. Saved on this device.</p>
        </section>
      </div>
      <Footer />
    </PageTransition>
  );
}
