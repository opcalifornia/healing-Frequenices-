import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Aurora, Reveal, TiltCard, ZoomPage } from "../rooted/motion";
import { Sheet, useToast } from "../rooted/ui";
import { Icon } from "../components/Icon";
import { Footer } from "../components/Footer";
import { RITUALS, RITUAL_DISCLAIMER, type Ritual } from "../rooted/rituals";
import { RitualArt } from "../rooted/RitualArt";
import { computeSchedule, countDone, dayKey, lastSeven, niceTime, ritualNow, streak, type RitualTimes } from "../rooted/ritualLogic";
import { syncRitualReminders } from "../rooted/ritualReminders";
import { useRituals, useRitualLog, useRitualPrefs } from "../store/rituals";
import { useEvents } from "../store/calendar";
import { eventsIcs, appLink } from "../rooted/calendarIcs";
import { saveTextFile } from "../rooted/download";
import "../rooted/rooted.css";
import "./Rituals.css";

type Key = keyof RitualTimes;
const timeLabel = (id: string) => ({ revive: "Morning", calm: "Afternoon", unwind: "Night" }[id] ?? "");

export function Disclaimer({ open, onAccept }: { open: boolean; onAccept(): void }) {
  return (
    <Sheet open={open} onClose={() => undefined} label="Before you start">
      <div className="rdisc">
        <Icon name="info" size={34} />
        <h2>Before you start</h2>
        <p>{RITUAL_DISCLAIMER}</p>
        <p className="rdisc__small">Rituals are a wellness routine: a drink and a sound session to go with each part of your day. Each ritual lists its own cautions.</p>
        <button className="btn btn--primary" onClick={onAccept}>I understand</button>
      </div>
    </Sheet>
  );
}

/** Asks for wake and bed time, then works out when each ritual falls. */
function Setup({ open, onClose }: { open: boolean; onClose(): void }) {
  const prefs = useRitualPrefs();
  const setSchedule = useRituals((s) => s.setSchedule);
  const [wake, setWake] = useState(prefs.wake);
  const [bed, setBed] = useState(prefs.bed);
  useEffect(() => { if (open) { setWake(prefs.wake); setBed(prefs.bed); } }, [open, prefs.wake, prefs.bed]);
  const t = computeSchedule(wake, bed);
  return (
    <Sheet open={open} onClose={onClose} label="Your day">
      <div className="rsetup">
        <span className="rooted__eyebrow">Set your day</span>
        <h2>When do you wake and sleep?</h2>
        <p className="rooted__lead">We'll time each ritual around your day. You can change any time afterward.</p>
        <label>Wake time<input type="time" value={wake} onChange={(e) => setWake(e.target.value)} /></label>
        <label>Bedtime<input type="time" value={bed} onChange={(e) => setBed(e.target.value)} /></label>
        <ul className="rsetup__times">
          <li><b>Revive</b><span>{niceTime(t.revive)} · when you wake</span></li>
          <li><b>Calm</b><span>{niceTime(t.calm)} · about 6 to 7 hours after waking</span></li>
          <li><b>Unwind</b><span>{niceTime(t.unwind)} · 75 minutes before bed</span></li>
        </ul>
        <button className="btn btn--primary" onClick={() => { setSchedule(wake, bed); syncRitualReminders(); onClose(); }}>Save my day</button>
      </div>
    </Sheet>
  );
}

function Carousel({ order, nowId, times }: { order: Ritual[]; nowId: string; times: RitualTimes }) {
  const reduce = useReducedMotion();
  const navigate = useNavigate();
  const [i, setI] = useState(() => Math.max(0, order.findIndex((r) => r.id === nowId)));
  const [hover, setHover] = useState(false);
  const [dir, setDir] = useState(1);
  const go = (n: number) => { setDir(n > i || (i === order.length - 1 && n === 0) ? 1 : -1); setI(((n % order.length) + order.length) % order.length); };
  const timer = useRef(0);
  useEffect(() => {
    if (reduce || hover) return;
    timer.current = window.setTimeout(() => go(i + 1), 9000);
    return () => window.clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, hover, reduce]);
  const r = order[i];
  const t = times[r.id as Key];
  return (
    <section className="rhero" style={{ "--a": r.accentColor, "--a2": r.accentColor2 } as React.CSSProperties} aria-roledescription="carousel" aria-label="Your three rituals" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onFocus={() => setHover(true)} onBlur={() => setHover(false)}>
      <AnimatePresence initial={false} custom={dir} mode="popLayout">
        <motion.div
          key={r.id}
          className="rhero__slide"
          custom={dir}
          initial={{ opacity: 0, x: reduce ? 0 : dir * 60, scale: 1.04 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: reduce ? 0 : dir * -60 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => { if (info.offset.x < -70) go(i + 1); else if (info.offset.x > 70) go(i - 1); }}
          role="group"
          aria-roledescription="slide"
          aria-label={`${i + 1} of ${order.length}: ${r.name}`}
        >
          <RitualArt ritual={r} className="rhero__art" />
          <div className="rhero__shade" />
          <div className="rhero__text">
            <div className="rhero__badges">
              {r.id === nowId && <span className="rhero__now">Right now</span>}
              <span className="rhero__time">{timeLabel(r.id)} · {niceTime(t)}</span>
            </div>
            <h1>{r.name}</h1>
            <p className="rhero__tag">{r.tagline}</p>
            <p className="rhero__meta">{r.recipe.ingredients.filter((x) => !x.optional).length} ingredients · {r.session.durationMin} min session · {r.session.brainState}</p>
            <div className="rhero__cta">
              <button className="btn btn--primary" onClick={() => navigate(`/rituals/${r.id}?play=1`)}><Icon name="play" size={18} /> Start session</button>
              <Link className="btn btn--secondary" to={`/rituals/${r.id}`}>Make the drink</Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <button className="rhero__arrow rhero__arrow--l" onClick={() => go(i - 1)} aria-label="Previous ritual"><Icon name="back" size={22} /></button>
      <button className="rhero__arrow rhero__arrow--r" onClick={() => go(i + 1)} aria-label="Next ritual"><Icon name="back" size={22} className="flip" /></button>
      <div className="rhero__dots" role="tablist" aria-label="Choose a ritual">
        {order.map((o, n) => <button key={o.id} role="tab" aria-selected={n === i} aria-label={o.name} className={n === i ? "is-on" : ""} onClick={() => go(n)} />)}
      </div>
    </section>
  );
}

function Today({ times }: { times: RitualTimes }) {
  const log = useRitualLog();
  const toggle = useRituals((s) => s.toggleDrink);
  const today = dayKey();
  return (
    <div className="rtoday">
      {RITUALS.map((r) => {
        const d = log[today]?.[r.id] ?? {};
        return (
          <TiltCard key={r.id} className="rcardx" max={4} to={`/rituals/${r.id}`} label={`${r.name}: open ritual`} style={{ "--a": r.accentColor, "--a2": r.accentColor2 } as React.CSSProperties}>
            <RitualArt ritual={r} className="rcardx__art" />
            <div className="rcardx__body">
              <span className="rcardx__when">{timeLabel(r.id)} · {niceTime(times[r.id as Key])}</span>
              <h3>{r.name}</h3>
              <p>{r.tagline}</p>
            </div>
            <div className="rcardx__checks" onClick={(e) => e.preventDefault()}>
              <button type="button" className={`rcheck ${d.drink ? "is-on" : ""}`} aria-pressed={!!d.drink} onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(r.id); }}>
                <span>{d.drink && <Icon name="check" size={14} />}</span> Drink
              </button>
              <span className={`rcheck rcheck--static ${d.session ? "is-on" : ""}`}><span>{d.session && <Icon name="check" size={14} />}</span> Session</span>
            </div>
          </TiltCard>
        );
      })}
    </div>
  );
}

function Schedule({ onEditDay }: { onEditDay(): void }) {
  const prefs = useRitualPrefs();
  const { setTime, setEnabled, resetTimes } = useRituals();
  const events = useEvents();
  const toast = useToast();
  const change = (fn: () => void) => { fn(); syncRitualReminders(); };
  const exportIcs = () => {
    const mine = events.filter((e) => e.to?.startsWith("/rituals/"));
    if (!mine.length) return toast.show("Turn on at least one reminder first");
    void saveTextFile("rituals.ics", eventsIcs(mine, appLink, { alarmMin: 0, name: "Rituals" }), "text/calendar");
    toast.show("Calendar file saved. Open it to add the reminders to your phone");
  };
  return (
    <div className="r-card rsched">
      <div className="rsched__head">
        <div><h3>Your schedule</h3><p>Wake {niceTime(prefs.wake)} · Bed {niceTime(prefs.bed)}</p></div>
        <button className="btn btn--secondary btn--small" onClick={onEditDay}><Icon name="edit" size={16} /> Change</button>
      </div>
      <ul>
        {RITUALS.map((r) => {
          const k = r.id as Key;
          return (
            <li key={r.id}>
              <span className="rsched__dot" style={{ background: r.accentColor }} aria-hidden="true" />
              <b>{r.name}</b>
              <input type="time" aria-label={`${r.name} time`} value={prefs.times[k]} onChange={(e) => e.target.value && change(() => setTime(k, e.target.value))} />
              <label className="rsched__toggle"><input type="checkbox" checked={prefs.enabled[k]} onChange={(e) => change(() => setEnabled(k, e.target.checked))} /><span>Remind me</span></label>
            </li>
          );
        })}
      </ul>
      <div className="rsched__foot">
        {Object.keys(prefs.custom).length > 0 && <button className="btn btn--secondary btn--small" onClick={() => change(resetTimes)}>Reset to suggested times</button>}
        <button className="btn btn--secondary btn--small" onClick={exportIcs}><Icon name="calendar" size={16} /> Add to phone calendar</button>
      </div>
      <p className="rsched__fine">Reminders show on your Calendar and Home. In the iPhone app they arrive as notifications. In a web browser, use Add to phone calendar to get alerts from your phone's own calendar.</p>
      {toast.node}
    </div>
  );
}

function History() {
  const log = useRitualLog();
  const today = dayKey();
  const days = useMemo(() => lastSeven(log, today, RITUALS.map((r) => r.id)), [log, today]);
  const run = streak(log, today);
  return (
    <div className="r-card rhist">
      <div className="rhist__head">
        <div className="rhist__streak"><b>{run}</b><span>day streak</span></div>
        <p>{countDone(days)} of 42 check-offs this week</p>
      </div>
      <div className="rhist__grid" role="table" aria-label="Last seven days">
        <div className="rhist__row rhist__row--head" role="row"><span /><>{days.map((d) => <span key={d.day} role="columnheader">{new Date(d.day + "T12:00").toLocaleDateString(undefined, { weekday: "narrow" })}</span>)}</></div>
        {RITUALS.map((r) => (
          <div className="rhist__row" role="row" key={r.id}>
            <span className="rhist__name" role="rowheader" style={{ color: r.accentColor }}>{r.name}</span>
            {days.map((d) => {
              const x = d.rituals[r.id];
              return (
                <span key={d.day} role="cell" className="rhist__cell" aria-label={`${r.name} ${d.day}: ${x.drink ? "drink" : "no drink"}, ${x.session ? "session" : "no session"}`}>
                  <i className={x.drink ? "on" : ""} style={{ "--a": r.accentColor } as React.CSSProperties} /><i className={x.session ? "on s" : "s"} style={{ "--a": r.accentColor } as React.CSSProperties} />
                </span>
              );
            })}
          </div>
        ))}
      </div>
      <p className="rhist__key"><i className="on" /> drink <i className="on s" /> session. Streaks count any day with at least one of either, and today never breaks it.</p>
    </div>
  );
}

export default function Rituals() {
  const prefs = useRitualPrefs();
  const accept = useRituals((s) => s.acceptDisclaimer);
  const [setup, setSetup] = useState(false);
  const nowId = ritualNow(new Date().getHours() * 60 + new Date().getMinutes(), prefs.times);
  // Ask for wake and bed time once, right after the disclaimer.
  useEffect(() => { if (prefs.disclaimerSeen && !prefs.onboarded) { const t = setTimeout(() => setSetup(true), 400); return () => clearTimeout(t); } }, [prefs.disclaimerSeen, prefs.onboarded]);

  return (
    <ZoomPage className="rooted rituals">
      <Disclaimer open={!prefs.disclaimerSeen} onAccept={accept} />
      <Setup open={setup} onClose={() => setSetup(false)} />
      <div className="rituals__top"><Aurora /></div>
      <Carousel order={RITUALS} nowId={nowId} times={prefs.times} />

      <section className="sec-block rituals__sec">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Today</span>
          <h2>Three rituals for your day</h2>
          <p className="rooted__lead">Each pairs a drink with a sound session. Tick the drink when you've had it. The session ticks itself when it finishes.</p>
        </Reveal>
        <Today times={prefs.times} />
      </section>

      <section className="sec-block rituals__sec">
        <Reveal className="sec-block__head"><span className="rooted__eyebrow">Your week</span><h2>Streak and history</h2></Reveal>
        <History />
      </section>

      <section className="sec-block rituals__sec">
        <Reveal className="sec-block__head"><span className="rooted__eyebrow">Reminders</span><h2>Timed to your day</h2></Reveal>
        <Schedule onEditDay={() => setSetup(true)} />
      </section>

      <section className="sec-block rituals__sec">
        <Link to="/rituals/circadian" className="rlearn r-card">
          <div><span className="rooted__eyebrow">Learn</span><h3>The circadian rhythm, explained</h3><p>A 24-hour clock of your body's natural highs and dips, and why these three rituals sit where they do.</p></div>
          <Icon name="back" size={26} className="flip" />
        </Link>
        <p className="rituals__fine">{RITUAL_DISCLAIMER}</p>
      </section>
      <Footer />
    </ZoomPage>
  );
}
