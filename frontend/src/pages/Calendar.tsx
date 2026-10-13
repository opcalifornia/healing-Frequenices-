import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Aurora, Reveal, ZoomPage } from "../rooted/motion";
import { Sheet, useToast } from "../rooted/ui";
import { KINDS, ScheduleSheet, SendButtons, niceDay, niceTime, type Draft } from "../rooted/CalendarUI";
import { appLink, eventsIcs, parseBusyIcs } from "../rooted/calendarIcs";
import { saveTextFile } from "../rooted/download";
import { dayPlan, type Slot } from "../rooted/plan";
import { PROGRAMS } from "../rooted/programs";
import { api, apiEnabled } from "../api/client";
import { addDays, busyOn, conflicts, eventsOn, findFreeSlot, fromMin, parseDay, toMin, useBusy, useCalendar, useEvents, type EventKind, type HealthEvent } from "../store/calendar";
import { todayKey } from "../store/nourish";
import { useAbout } from "../store/wellness";
import { usePlan } from "../store/bedtime";
import { useEnrollments, nextDay } from "../store/programs";
import { useActiveProfile, useUser } from "../store/user";
import { Footer } from "../components/Footer";
import { Icon } from "../components/Icon";
import "../rooted/rooted.css";
import "./Calendar.css";

const DAY_START = 6 * 60;
const DAY_END = 23 * 60;
const HOUR_PX = 46;

const weekStart = (d: string) => addDays(d, -parseDay(d).getDay());
const kindFor = (to: string): EventKind =>
  to.startsWith("/breathe") ? "breathe" : to.startsWith("/move") ? "move" : to.startsWith("/nourish") ? "nourish" : to.startsWith("/light") ? "light" : to.startsWith("/spirit") ? "spirit" : to.startsWith("/bedtime") ? "sleep" : to.startsWith("/frequencies") ? "healing" : "other";

/** Open gaps in a day (7am to 10pm) between busy time and health events. */
function freeGaps(events: HealthEvent[], day: string, busy: ReturnType<typeof busyOn>) {
  const taken = [...busy, ...eventsOn(events, day).map((e) => ({ start: toMin(e.time), end: toMin(e.time) + e.minutes }))].sort((a, b) => a.start - b.start);
  const gaps: Array<[number, number]> = [];
  let t = 7 * 60;
  for (const b of taken) {
    if (b.start - t >= 20) gaps.push([t, Math.min(b.start, 22 * 60)]);
    t = Math.max(t, b.end);
  }
  if (22 * 60 - t >= 20) gaps.push([t, 22 * 60]);
  return gaps.filter(([a, b]) => b > a);
}

export default function Calendar() {
  const profile = useActiveProfile();
  const events = useEvents();
  const busy = useBusy();
  const cal = useCalendar();
  const about = useAbout();
  const bedtime = usePlan();
  const enrolled = useEnrollments();
  const today = todayKey();
  const [day, setDay] = useState(today);
  const [adding, setAdding] = useState<Draft | null | false>(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [editing, setEditing] = useState<HealthEvent | null>(null);
  const [planning, setPlanning] = useState(false);
  const toast = useToast();

  const week = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart(day), i)), [day]);
  const dayEvents = eventsOn(events, day);
  const dayBusy = busyOn(busy, day);
  const clash = new Set(conflicts(events, busy, day));
  const gaps = freeGaps(events, day, dayBusy);
  const openEv = events.find((e) => e.id === openId) ?? null;

  const weekMinutes = week.reduce((a, d) => a + eventsOn(events, d).reduce((x, e) => x + e.minutes, 0), 0);
  const weekCount = week.reduce((a, d) => a + eventsOn(events, d).length, 0);

  // Suggestions: things the app already knows about that aren't on the calendar yet.
  const hasTo = (prefix: string) => events.some((e) => e.to?.startsWith(prefix));
  const suggestions: Array<{ key: string; title: string; body: string; draft: Draft }> = [];
  if (!hasTo("/bedtime")) {
    const wd = fromMin((toMin(bedtime.bedtime) - bedtime.windDown + 1440) % 1440);
    suggestions.push({ key: "bed", title: `Wind down at ${niceTime(wd)}`, body: `From your bedtime routine: lights out at ${niceTime(bedtime.bedtime)}.`, draft: { title: "Wind down for sleep", kind: "sleep", minutes: bedtime.windDown, repeat: "daily", to: "/bedtime", time: wd } });
  }
  for (const p of PROGRAMS) {
    const e = enrolled[p.id];
    if (!e || nextDay(e, p.days.length).finished || hasTo(`/program/${p.id}`)) continue;
    suggestions.push({ key: p.id, title: `${p.title}: daily lesson`, body: `You're on day ${nextDay(e, p.days.length).index + 1} of ${p.days.length}. A set time makes it stick.`, draft: { title: `${p.title} lesson`, kind: "program", minutes: 10, repeat: "daily", to: `/program/${p.id}`, time: "07:30" } });
  }

  return (
    <ZoomPage className="rooted calendar">
      <header className="sec-hero cal-hero">
        <Aurora />
        <div className="sec-hero__text">
          <motion.span className="rooted__eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Rooted · Health calendar</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>Make time for you.</motion.h1>
          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            Schedule your breathing, walks, yoga, programs and appointments. See them next to your work calendar, and send any of it to Apple, Google or Outlook.
          </motion.p>
          <motion.div className="cal-hero__cta" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <button className="btn btn--primary" onClick={() => setAdding(null)}><Icon name="plus" size={18} /> Add something</button>
            <button className="btn btn--secondary" onClick={() => setPlanning(true)}><Icon name="sparkle" size={18} /> Plan my day for me</button>
          </motion.div>
        </div>
      </header>

      <section className="sec-block cal-main">
        <div className="cal-toolbar">
          <div className="cal-toolbar__nav">
            <button className="icon-btn icon-btn--small" aria-label="Previous week" onClick={() => setDay(addDays(day, -7))}><Icon name="back" size={18} /></button>
            <h2>{parseDay(week[0]).toLocaleDateString(undefined, { month: "long", year: "numeric" })}</h2>
            <button className="icon-btn icon-btn--small cal-next" aria-label="Next week" onClick={() => setDay(addDays(day, 7))}><Icon name="back" size={18} /></button>
            {day !== today && <button className="chip" onClick={() => setDay(today)}>Today</button>}
          </div>
          <p className="cal-toolbar__stats">
            <b>{weekCount}</b> planned this week · <b>{weekMinutes}</b> min for you
            {busy.length > 0 && <span className="cal-legend"><i className="cal-legend__busy" /> work / busy <i className="cal-legend__clash" /> overlaps</span>}
          </p>
        </div>

        <div className="cal-strip" role="group" aria-label="Days this week">
          {week.map((d) => {
            const evs = eventsOn(events, d);
            const b = busyOn(busy, d);
            const busyMin = b.reduce((a, x) => a + x.end - x.start, 0);
            return (
              <button key={d} aria-pressed={d === day} aria-label={`${parseDay(d).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}${d === today ? ", today" : ""}: ${evs.length} planned${busyMin > 0 ? `, ${Math.round(busyMin / 60)}h busy` : ""}`} className={`cal-strip__day ${d === day ? "is-on" : ""} ${d === today ? "is-today" : ""}`} onClick={() => setDay(d)}>
                <small>{parseDay(d).toLocaleDateString(undefined, { weekday: "short" })}</small>
                <b>{parseDay(d).getDate()}</b>
                <span className="cal-strip__dots">
                  {evs.slice(0, 4).map((e) => <i key={e.id} style={{ background: KINDS[e.kind].color }} />)}
                </span>
                {busyMin > 0 && <span className="cal-strip__busy" style={{ width: `${Math.min(100, (busyMin / 600) * 100)}%` }} title={`${Math.round(busyMin / 60)}h busy`} />}
                {d === day && <motion.span layoutId="cal-day-pill" className="cal-strip__pill" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
              </button>
            );
          })}
        </div>

        <div className="cal-split">
          <WeekGrid week={week} events={events} busy={busy} today={today} selected={day} onOpen={setOpenId} onAdd={(d, t) => setAdding({ title: "", kind: "other", minutes: 30, repeat: "none", date: d, time: t })} />

          <div className="cal-agenda">
            <h3>{day === today ? "Today" : niceDay(day)}</h3>
            <AnimatePresence initial={false}>
              {dayEvents.length === 0 && dayBusy.length === 0 && (
                <motion.p key="empty" className="cal-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  Nothing yet. <button onClick={() => setAdding({ title: "", kind: "other", minutes: 15, repeat: "none", date: day })}>Add something</button> or let us <button onClick={() => setPlanning(true)}>plan your day</button>.
                </motion.p>
              )}
            </AnimatePresence>
            <ol className="cal-list">
              {[...dayEvents.map((e) => ({ t: toMin(e.time), e })), ...dayBusy.map((b) => ({ t: b.start, b }))]
                .sort((a, b) => a.t - b.t)
                .map((row, i) =>
                  "e" in row && row.e ? (
                    <motion.li key={row.e.id} layout initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                      <button className={`cal-item ${clash.has(row.e.id) ? "is-clash" : ""} ${row.e.done?.[day] ? "is-done" : ""}`} style={{ ["--k" as string]: KINDS[row.e.kind].color }} onClick={() => setOpenId(row.e.id)}>
                        <time>{niceTime(row.e.time)}</time>
                        <span className="cal-item__body">
                          <b>{row.e.title}</b>
                          <small>
                            {row.e.minutes} min · {KINDS[row.e.kind].label}
                            {row.e.repeat !== "none" && " · repeats"}
                            {clash.has(row.e.id) && " · overlaps busy time"}
                          </small>
                        </span>
                        {row.e.done?.[day] && <Icon name="check" size={18} />}
                      </button>
                    </motion.li>
                  ) : (
                    <li key={`b${i}`} className="cal-busy">
                      <time>{niceTime(fromMin(row.t))}</time>
                      <span><b>{"b" in row && row.b ? row.b.title : "Busy"}</b><small>until {"b" in row && row.b ? niceTime(fromMin(Math.min(row.b.end, 1439))) : ""} · from your calendar</small></span>
                    </li>
                  ),
                )}
            </ol>

            {gaps.length > 0 && (
              <div className="cal-free">
                <h4><Icon name="sparkle" size={16} /> You're free</h4>
                <div className="cal-free__list">
                  {gaps.slice(0, 5).map(([a, b]) => (
                    <button key={a} className="cal-free__gap" onClick={() => setAdding({ title: "", kind: "other", minutes: Math.min(30, b - a), repeat: "none", date: day, time: fromMin(a) })}>
                      {niceTime(fromMin(a))} – {niceTime(fromMin(b))}
                      <small>{b - a >= 60 ? `${Math.floor((b - a) / 60)}h${(b - a) % 60 ? ` ${(b - a) % 60}m` : ""}` : `${b - a} min`}</small>
                    </button>
                  ))}
                </div>
                {busy.length === 0 && <p className="cal-free__hint">Add your work calendar below to see real free time.</p>}
              </div>
            )}
          </div>
        </div>
      </section>

      {suggestions.length > 0 && (
        <section className="sec-block">
          <div className="sec-block__head">
            <span className="rooted__eyebrow">Suggested for you</span>
            <h2>Put your routines on the calendar</h2>
          </div>
          <div className="cal-suggestions">
            {suggestions.map((s, i) => (
              <Reveal key={s.key} delay={i * 0.06} className="r-card cal-sugg" style={{ ["--k" as string]: KINDS[s.draft.kind].color }}>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <button className="btn btn--secondary btn--small" onClick={() => setAdding(s.draft)}><Icon name="plus" size={16} /> Schedule it</button>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="sec-block" id="connect">
        <div className="sec-block__head">
          <span className="rooted__eyebrow">Connect</span>
          <h2>Use it with the calendar you already have</h2>
          <p className="rooted__lead">Your health calendar works on its own. These keep it in step with your work and family calendars.</p>
        </div>
        <div className="cal-connect">
          <SendCard events={events} profileName={profile?.name ?? "you"} onToast={toast.show} />
          <ImportCard onToast={toast.show} />
        </div>
      </section>

      <ScheduleSheet open={adding !== false || !!editing} onClose={() => { setAdding(false); setEditing(null); }} draft={adding || null} editing={editing} />
      <EventSheet ev={openEv} day={day} hasClash={!!openEv && clash.has(openEv.id)} onClose={() => setOpenId(null)} onEdit={(e) => { setOpenId(null); setEditing(e); }} onToast={toast.show} cal={cal} />
      <PlanSheet open={planning} onClose={() => setPlanning(false)} day={day} about={about} onToast={toast.show} />
      {toast.node}
      <Footer />
    </ZoomPage>
  );
}

/* ------------------------------------------------------------------ */

function WeekGrid({ week, events, busy, today, selected, onOpen, onAdd }: { week: string[]; events: HealthEvent[]; busy: ReturnType<typeof useBusy>; today: string; selected: string; onOpen(id: string): void; onAdd(day: string, time: string): void }) {
  const hours = Array.from({ length: (DAY_END - DAY_START) / 60 }, (_, i) => DAY_START / 60 + i);
  const y = (m: number) => ((Math.max(DAY_START, Math.min(DAY_END, m)) - DAY_START) / 60) * HOUR_PX;
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  return (
    <div className="cal-week" role="region" aria-label="Week view">
      <div className="cal-week__head">
        <span aria-hidden="true" />
        {week.map((d) => (
          <span key={d} className={`${d === today ? "is-today" : ""} ${d === selected ? "is-on" : ""}`}>
            {parseDay(d).toLocaleDateString(undefined, { weekday: "short" })} <b>{parseDay(d).getDate()}</b>
          </span>
        ))}
      </div>
      <div className="cal-week__body" style={{ height: hours.length * HOUR_PX }} tabIndex={0} role="group" aria-label="Hour-by-hour schedule">
        <div className="cal-week__hours">
          {hours.map((h) => <span key={h} style={{ top: (h * 60 - DAY_START) / 60 * HOUR_PX }}>{niceTime(`${String(h).padStart(2, "0")}:00`).replace(":00", "")}</span>)}
        </div>
        {week.map((d) => {
          const clash = new Set(conflicts(events, busy, d));
          return (
            <div
              key={d}
              className="cal-week__col"
              onClick={(e) => {
                if (e.target !== e.currentTarget) return;
                const r = e.currentTarget.getBoundingClientRect();
                const m = DAY_START + Math.floor(((e.clientY - r.top) / HOUR_PX) * 4) * 15;
                onAdd(d, fromMin(m));
              }}
            >
              {busyOn(busy, d).map((b, i) => (
                <div key={i} className="cal-week__busy" style={{ top: y(b.start), height: Math.max(12, y(b.end) - y(b.start)) }} title={b.title}><span>{b.title}</span></div>
              ))}
              {eventsOn(events, d).map((e) => {
                const s = toMin(e.time);
                if (s + e.minutes < DAY_START || s > DAY_END) return null;
                const h = Math.max(20, y(s + e.minutes) - y(s));
                return (
                  <button key={e.id} className={`cal-week__ev ${h < 34 ? "is-short" : ""} ${clash.has(e.id) ? "is-clash" : ""} ${e.done?.[d] ? "is-done" : ""}`} style={{ top: y(s), height: h, ["--k" as string]: KINDS[e.kind].color }} onClick={() => onOpen(e.id)} title={`${niceTime(e.time)} ${e.title}`} aria-label={`${e.title}, ${parseDay(d).toLocaleDateString(undefined, { weekday: "long" })} ${niceTime(e.time)}, ${e.minutes} min${clash.has(e.id) ? ", overlaps work" : ""}${e.done?.[d] ? ", done" : ""}`}>
                    <b>{e.title}</b>
                    <small>{niceTime(e.time)}</small>
                  </button>
                );
              })}
              {d === today && nowMin >= DAY_START && nowMin <= DAY_END && <i className="cal-week__now" style={{ top: y(nowMin) }} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EventSheet({ ev, day, hasClash, onClose, onEdit, onToast, cal }: { ev: HealthEvent | null; day: string; hasClash: boolean; onClose(): void; onEdit(e: HealthEvent): void; onToast(m: string): void; cal: ReturnType<typeof useCalendar.getState> }) {
  return (
    <Sheet open={!!ev} onClose={onClose} label={ev?.title ?? "Event"}>
      {ev && (
        <div className="cal-form cal-ev" style={{ ["--k" as string]: KINDS[ev.kind].color }}>
          <span className="cal-ev__kind"><i className="cal-dot" /> {KINDS[ev.kind].label}</span>
          <h2>{ev.title}</h2>
          <p className="cal-ev__when">
            {niceDay(day)} · {niceTime(ev.time)} · {ev.minutes} min
            {ev.repeat !== "none" && <> · repeats {ev.repeat === "weekdays" ? "on weekdays" : ev.repeat === "daily" ? "every day" : "every week"}</>}
          </p>
          {hasClash && <p className="cal-ev__clash"><Icon name="info" size={16} /> This overlaps something on your work calendar. <button onClick={() => onEdit(ev)}>Move it</button></p>}
          {ev.note && <p className="cal-ev__note">{ev.note}</p>}
          <div className="cal-saved__row">
            {ev.to && <Link className="btn btn--primary btn--small" to={ev.to} onClick={onClose}><Icon name="play" size={16} /> Start now</Link>}
            <button className="btn btn--secondary btn--small" onClick={() => cal.toggleDone(ev.id, day)}>
              <Icon name="check" size={16} /> {ev.done?.[day] ? "Mark not done" : "Mark done"}
            </button>
            <button className="btn btn--secondary btn--small" onClick={() => onEdit(ev)}><Icon name="edit" size={16} /> Edit</button>
          </div>
          <h4>Send to your calendar</h4>
          <SendButtons e={ev} onDone={onToast} />
          <div className="cal-ev__danger">
            {ev.repeat !== "none" && <button onClick={() => { cal.skipDate(ev.id, day); onClose(); onToast("Skipped for this day"); }}>Skip just this day</button>}
            <button onClick={() => { if (confirm(ev.repeat !== "none" ? "Delete every repeat of this event?" : "Delete this event?")) { cal.remove(ev.id); onClose(); onToast("Deleted"); } }}>
              <Icon name="trash" size={16} /> Delete{ev.repeat !== "none" ? " all repeats" : ""}
            </button>
          </div>
          <p className="cal-form__hint">Already sent to another calendar? Change or delete it there too; copies don't update on their own unless you use the live link.</p>
        </div>
      )}
    </Sheet>
  );
}

const SLOT_TIME: Record<Slot, string> = { morning: "07:30", midday: "12:30", evening: "20:00" };

function PlanSheet({ open, onClose, day, about, onToast }: { open: boolean; onClose(): void; day: string; about: ReturnType<typeof useAbout>; onToast(m: string): void }) {
  const events = useEvents();
  const busy = useBusy();
  const add = useCalendar((s) => s.add);
  const plan = useMemo(() => {
    const p = dayPlan(about, 2);
    const placed: HealthEvent[] = [];
    const out: Array<{ id: string; title: string; body: string; to: string; minutes: number; time: string; kind: EventKind }> = [];
    for (const slot of ["morning", "midday", "evening"] as Slot[]) {
      let t = SLOT_TIME[slot];
      for (const i of p[slot]) {
        const minutes = Math.max(i.minutes, 2);
        const time = findFreeSlot([...events, ...placed], busy, day, t, minutes);
        placed.push({ id: i.id, title: i.title, kind: "other", date: day, time, minutes, repeat: "none" });
        out.push({ id: i.id, title: i.title, body: i.body, to: i.to, minutes, time, kind: kindFor(i.to) });
        t = fromMin(Math.ceil((toMin(time) + minutes + 10) / 5) * 5);
      }
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, day]);

  const commit = (daily: boolean) => {
    plan.forEach((i) => add({ title: i.title, kind: i.kind, date: day, time: i.time, minutes: i.minutes, repeat: daily ? "daily" : "none", to: i.to, note: i.body }));
    onClose();
    onToast(daily ? "Your daily routine is on the calendar" : "Added to your day");
  };

  return (
    <Sheet open={open} onClose={onClose} label="Plan my day">
      <div className="cal-form">
        <h2>Your day, planned</h2>
        <p className="cal-form__hint">
          Picked for your goals{about.goals.length ? "" : " (set them in About you for a better fit)"} and fitted around anything already on {day === todayKey() ? "today" : niceDay(day)}.
        </p>
        <ol className="cal-plan">
          {plan.map((i) => (
            <li key={i.id} style={{ ["--k" as string]: KINDS[i.kind].color }}>
              <time>{niceTime(i.time)}</time>
              <span><b>{i.title}</b><small>{i.minutes} min · {i.body}</small></span>
            </li>
          ))}
        </ol>
        <div className="cal-saved__row">
          <button className="btn btn--primary" onClick={() => commit(true)}><Icon name="replay" size={18} /> Make it my daily routine</button>
          <button className="btn btn--secondary" onClick={() => commit(false)}>Just this day</button>
        </div>
        {!about.goals.length && <Link to="/about-you" className="cal-form__link" onClick={onClose}>Tell us your goals →</Link>}
      </div>
    </Sheet>
  );
}

/* ------------------------------------------------------------------ */

function SendCard({ events, profileName, onToast }: { events: HealthEvent[]; profileName: string; onToast(m: string): void }) {
  const profile = useActiveProfile();
  const account = useUser((s) => s.account);
  const [feed, setFeed] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const live = apiEnabled && !!account && !!profile;

  const exportAll = () =>
    saveTextFile(`rooted-health-calendar.ics`, eventsIcs(events, appLink, { name: `Rooted · ${profileName}` }), "text/calendar").then(() => onToast("Calendar file saved"));

  const getFeed = async (rotate = false) => {
    if (!profile) return;
    setLoading(true);
    try {
      const r = await api<{ url: string }>(`/profiles/${profile.id}/calendar-feed`, { method: "POST", body: { rotate } });
      setFeed(r.url);
    } catch {
      onToast("Couldn't create the link. Try again.");
    }
    setLoading(false);
  };
  const webcal = feed?.replace(/^https?:/, "webcal:");

  return (
    <Reveal className="r-card cal-card">
      <span className="cal-card__icon"><Icon name="bell" size={22} /></span>
      <h3>Send to Apple, Google or Outlook</h3>
      <p>Every event comes with a 5-minute reminder, so your phone nudges you even when Rooted is closed.</p>

      {live ? (
        <div className="cal-feed">
          <h4>Live link (best)</h4>
          <p>Subscribe once and changes you make here show up in your calendar automatically. Google refreshes subscribed calendars every few hours; Apple lets you choose.</p>
          {feed ? (
            <>
              <div className="cal-feed__row">
                <input readOnly value={feed} onFocus={(e) => e.target.select()} aria-label="Calendar link" />
                <button className="btn btn--secondary btn--small" onClick={() => navigator.clipboard?.writeText(feed).then(() => onToast("Link copied"))}>Copy</button>
              </div>
              <div className="cal-send">
                <a className="btn btn--secondary btn--small" href={webcal}>Subscribe in Apple Calendar</a>
                <a className="btn btn--secondary btn--small" href={`https://calendar.google.com/calendar/r?cid=${encodeURIComponent(webcal!)}`} target="_blank" rel="noreferrer">Subscribe in Google</a>
              </div>
              <p className="cal-form__hint">Anyone with this link can see your health events. <button className="cal-linkbtn" onClick={() => getFeed(true)}>Make a new link</button> to turn the old one off.</p>
            </>
          ) : (
            <button className="btn btn--primary btn--small" onClick={() => getFeed()} disabled={loading}>{loading ? "Creating…" : "Get my live calendar link"}</button>
          )}
        </div>
      ) : (
        <p className="cal-form__hint">{apiEnabled ? <><Link to="/account">Sign in</Link> to get a live link that stays up to date.</> : "A live link that stays up to date comes with accounts."}</p>
      )}

      <div className="cal-feed">
        <h4>{live ? "Or download a copy" : "Download your calendar"}</h4>
        <button className="btn btn--secondary btn--small" onClick={exportAll} disabled={!events.length}><Icon name="plus" size={16} /> Download all ({events.length})</button>
        <ul className="cal-steps">
          <li><b>iPhone / Mac:</b> open the file and tap Add All.</li>
          <li><b>Google:</b> calendar.google.com → Settings → Import &amp; export → Import.</li>
          <li><b>Outlook:</b> Add calendar → Upload from file.</li>
        </ul>
        <p className="cal-form__hint">Single events also have their own Apple, Google and Outlook buttons. Tap any event.</p>
      </div>
    </Reveal>
  );
}

function ImportCard({ onToast }: { onToast(m: string): void }) {
  const busy = useBusy();
  const setBusy = useCalendar((s) => s.setBusy);
  const input = useRef<HTMLInputElement>(null);

  const read = async (f: File) => {
    const text = await f.text();
    const blocks = parseBusyIcs(text, addDays(todayKey(), -1));
    setBusy(blocks);
    onToast(blocks.length ? `Added ${blocks.length} busy times` : "No upcoming events found in that file");
  };

  return (
    <Reveal className="r-card cal-card" delay={0.08}>
      <span className="cal-card__icon"><Icon name="user" size={22} /></span>
      <h3>Bring in your work calendar</h3>
      <p>See meetings and shifts as gray "busy" blocks, so you can spot when you're actually free and we can suggest times that fit.</p>
      <input ref={input} type="file" accept=".ics,text/calendar" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) void read(f); e.target.value = ""; }} />
      <div className="cal-send">
        <button className="btn btn--primary btn--small" onClick={() => input.current?.click()}><Icon name="plus" size={16} /> {busy.length ? "Update from file" : "Choose a calendar file"}</button>
        {busy.length > 0 && <button className="btn btn--secondary btn--small" onClick={() => { setBusy([]); onToast("Work calendar removed"); }}><Icon name="trash" size={16} /> Remove</button>}
      </div>
      {busy.length > 0 && <p className="cal-form__hint"><b>{busy.length}</b> busy times loaded. Re-import now and then to pick up new meetings.</p>}
      <ul className="cal-steps">
        <li><b>Google:</b> Settings → Import &amp; export → Export, then unzip and choose your work calendar's .ics.</li>
        <li><b>Outlook:</b> Settings → Calendar → Shared calendars → Publish, then open the ICS link to download it.</li>
        <li><b>Apple Calendar (Mac):</b> select the calendar, then File → Export.</li>
      </ul>
      <p className="cal-form__hint"><Icon name="info" size={14} /> Only times and titles are read. They stay on this device and are never synced or shared.</p>
    </Reveal>
  );
}
