import { useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Aurora, Reveal, ZoomPage } from "../rooted/motion";
import { buildRecap, practiceStreak, type DayRecap, type WeekRecap } from "../rooted/recap";
import { usePracticeLog } from "../store/practice";
import { useMoods } from "../store/support";
import { todayKey, useNourish, useWaterGoal } from "../store/nourish";
import { addDays, parseDay, useEvents } from "../store/calendar";
import { useActiveProfile, useUser } from "../store/user";
import { Footer } from "../components/Footer";
import { ShareButton } from "../rooted/ShareCard";
import { InviteButton } from "../rooted/InviteButton";
import { Icon } from "../components/Icon";
import "../rooted/rooted.css";
import "./Week.css";

/* Chart colors, validated for color-vision deficiency on the #141813 surface. */
const C_MIN = "#6fa83a";
const C_BEFORE = "#d0703a";
const C_AFTER = "#2f8fd6";

const short = (d: string) => parseDay(d).toLocaleDateString(undefined, { weekday: "short" });
const long = (d: string) => parseDay(d).toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
const MOOD_LABEL = ["", "Rough", "Low", "Okay", "Good", "Great"];

export default function Week() {
  const profile = useActiveProfile();
  const pid = useUser((s) => s.activeProfileId) ?? "guest";
  const logs = usePracticeLog();
  const moods = useMoods();
  const water = useNourish((s) => s.water[pid]);
  const goal = useWaterGoal();
  const events = useEvents();
  const [end, setEnd] = useState(todayKey());
  const recap = useMemo(() => buildRecap({ endDay: end, logs, moods, water: water ?? {}, waterGoal: goal, events }), [end, logs, moods, water, goal, events]);
  const streak = practiceStreak(logs, todayKey());
  const isThisWeek = end === todayKey();
  const empty = recap.sessions === 0 && !recap.days.some((d) => d.mood || d.planned);

  return (
    <ZoomPage className="rooted week">
      <header className="sec-hero week__hero">
        <Aurora />
        <div className="sec-hero__text">
          <motion.span className="rooted__eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Rooted · Your week</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            {empty ? "Your week starts here." : recap.totalMinutes ? `${recap.totalMinutes} minutes for you.` : "A week of noticing."}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            {long(recap.days[0].day)} to {long(recap.days[6].day)}{profile ? `, ${profile.name}` : ""}. Everything here comes from what you logged on this device.
          </motion.p>
          <div className="week__nav">
            <button className="icon-btn icon-btn--small" aria-label="Previous week" onClick={() => setEnd(addDays(end, -7))}><Icon name="chevronLeft" size={18} /></button>
            <span>{isThisWeek ? "Last 7 days" : `Week ending ${parseDay(end).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`}</span>
            <button className="icon-btn icon-btn--small" aria-label="Next week" disabled={isThisWeek} onClick={() => setEnd(addDays(end, 7) > todayKey() ? todayKey() : addDays(end, 7))}><Icon name="chevronRight" size={18} /></button>
          </div>
          {!empty && (
            <div className="week__share">
              <ShareButton
                label="Share my week"
                className="btn btn--primary"
                allowStress
                data={{
                  kind: "week",
                  minutes: recap.totalMinutes,
                  activeDays: recap.activeDays,
                  streak,
                  perDay: recap.days.map((d) => d.minutes),
                  dayLabels: recap.days.map((d) => short(d.day).slice(0, 1)),
                  stressDrop: recap.avgBefore !== undefined && recap.avgAfter !== undefined ? Math.round((recap.avgBefore - recap.avgAfter) * 10) / 10 : undefined,
                  topArea: recap.byArea[0]?.area,
                }}
              />
              <InviteButton className="btn btn--secondary" />
            </div>
          )}
        </div>
      </header>

      {empty ? (
        <section className="sec-block">
          <div className="r-card week__empty">
            <h2>Nothing logged this week yet</h2>
            <p>Do a breathing session, a stretch or a combo, tap a mood on Home, or check off something on your calendar. Your recap fills in as you go.</p>
            <div className="week__empty-links">
              <Link className="btn btn--primary" to="/breathe">Try one-minute settle-in</Link>
              <Link className="btn btn--secondary" to="/calendar">Plan my week</Link>
            </div>
          </div>
        </section>
      ) : (
        <>
          <section className="sec-block week__stats" aria-label="Summary">
            <Stat value={recap.totalMinutes} unit="min" label="practiced" note={recap.prevMinutes ? delta(recap.totalMinutes, recap.prevMinutes) : undefined} />
            <Stat value={recap.activeDays} unit="of 7" label="days active" />
            <Stat value={streak} unit={streak === 1 ? "day" : "days"} label="current streak" />
            {recap.planned > 0 && <Stat value={recap.done} unit={`of ${recap.planned}`} label="calendar items done" />}
            {recap.avgBefore !== undefined && recap.avgAfter !== undefined && <Stat value={Math.max(0, Math.round((recap.avgBefore - recap.avgAfter) * 10) / 10)} unit="pts" label="avg stress drop" />}
            {goal > 0 && <Stat value={recap.waterDaysMet} unit="of 7" label="water goal days" />}
          </section>

          {recap.insights.length > 0 && (
            <section className="sec-block">
              <Reveal className="r-card week__insights">
                <h2><Icon name="sparkle" size={20} /> What we noticed</h2>
                <ul>{recap.insights.map((t) => <li key={t}>{t}</li>)}</ul>
              </Reveal>
            </section>
          )}

          <section className="sec-block week__charts">
            <ChartCard title="Minutes each day" sub="All practices: breathing, movement, combos, meditation and programs.">
              <MinutesBars days={recap.days} />
            </ChartCard>
            {recap.days.some((d) => d.mood) && (
              <ChartCard title="Mood check-ins" sub="From the faces on Home. Days without a check-in are left blank.">
                <MoodLine days={recap.days} />
              </ChartCard>
            )}
            {recap.checkIns.length > 0 && (
              <ChartCard title="Stress before and after" sub="Your check-ins around each practice, out of 10. Lower is more relaxed.">
                <StressDumbbell r={recap} />
              </ChartCard>
            )}
            {recap.byArea.length > 0 && (
              <ChartCard title="Where your minutes went">
                <AreaBars areas={recap.byArea} />
              </ChartCard>
            )}
          </section>

          <section className="sec-block">
            <details className="r-card week__table">
              <summary>See this week as a table</summary>
              <div className="week__table-scroll">
                <table>
                  <thead><tr><th scope="col">Day</th><th scope="col">Minutes</th><th scope="col">Sessions</th><th scope="col">Mood</th><th scope="col">Water (L)</th><th scope="col">Calendar</th></tr></thead>
                  <tbody>
                    {recap.days.map((d) => (
                      <tr key={d.day}>
                        <th scope="row">{long(d.day)}</th>
                        <td>{d.minutes}</td>
                        <td>{d.sessions}</td>
                        <td>{d.mood ? `${d.mood} · ${MOOD_LABEL[d.mood]}` : "–"}</td>
                        <td>{(d.water / 1000).toFixed(1)}</td>
                        <td>{d.planned ? `${d.done} of ${d.planned}` : "–"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
            <p className="week__fine">Patterns here come from a small amount of your own data. They can help you notice what works for you, but they aren't proof and aren't medical advice.</p>
          </section>
        </>
      )}
      <Footer />
    </ZoomPage>
  );
}

function delta(now: number, prev: number) {
  const d = now - prev;
  return d === 0 ? "same as last week" : `${d > 0 ? "+" : "−"}${Math.abs(d)} vs last week`;
}

function Stat({ value, unit, label, note }: { value: number; unit: string; label: string; note?: string }) {
  return (
    <Reveal className="r-card week-stat">
      <span className="week-stat__value">{value}<small>{unit}</small></span>
      <span className="week-stat__label">{label}</span>
      {note && <span className="week-stat__note">{note}</span>}
    </Reveal>
  );
}

function ChartCard({ title, sub, children }: { title: string; sub?: string; children: ReactNode }) {
  return (
    <Reveal className="r-card week-chart">
      <h3>{title}</h3>
      {sub && <p className="week-chart__sub">{sub}</p>}
      {children}
    </Reveal>
  );
}

/* ---------- Charts: inline SVG, one hover tooltip each ---------- */

interface Tip { x: number; y: number; lines: string[] }
function Tooltip({ tip }: { tip: Tip | null }) {
  if (!tip) return null;
  return (
    <div className="wk-tip" style={{ left: `${Math.min(84, Math.max(16, tip.x))}%`, top: tip.y }} role="status">
      {tip.lines.map((l, i) => (i === 0 ? <strong key={i}>{l}</strong> : <span key={i}>{l}</span>))}
    </div>
  );
}

const W = 320;

function MinutesBars({ days }: { days: DayRecap[] }) {
  const [tip, setTip] = useState<Tip | null>(null);
  const H = 150, top = 18, base = H - 24;
  const max = Math.max(10, ...days.map((d) => d.minutes));
  const nice = Math.ceil(max / 10) * 10;
  const slot = W / 7, bw = Math.min(26, slot - 14);
  const peak = days.reduce((a, d) => (d.minutes > a.minutes ? d : a), days[0]);
  const today = todayKey();
  return (
    <div className="wk-viz" onMouseLeave={() => setTip(null)}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Minutes each day: ${days.map((d) => `${short(d.day)} ${d.minutes}`).join(", ")}`}>
        {[0, 0.5, 1].map((f) => <line key={f} x1={0} x2={W} y1={base - f * (base - top)} y2={base - f * (base - top)} className="wk-viz__grid" />)}
        <text x={0} y={top - 6} className="wk-viz__axis">{nice} min</text>
        {days.map((d, i) => {
          const h = (d.minutes / nice) * (base - top);
          const x = i * slot + (slot - bw) / 2;
          const show = () => setTip({ x: ((x + bw / 2) / W) * 100, y: base - h - 8, lines: [long(d.day), `${d.minutes} min`, `${d.sessions} session${d.sessions === 1 ? "" : "s"}`] });
          return (
            <g key={d.day}>
              {h > 0 && (
                <motion.path
                  d={barPath(x, base, bw, h)}
                  fill={C_MIN}
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, type: "spring", stiffness: 160, damping: 20 }}
                  style={{ transformOrigin: `0px ${base}px` }}
                />
              )}
              {d.day === peak.day && d.minutes > 0 && <text x={x + bw / 2} y={base - h - 6} textAnchor="middle" className="wk-viz__val">{d.minutes}</text>}
              <text x={x + bw / 2} y={H - 6} textAnchor="middle" className={`wk-viz__axis ${d.day === today ? "is-today" : ""}`}>{short(d.day)}</text>
              <rect x={i * slot} y={top} width={slot} height={base - top + 20} fill="transparent" onMouseEnter={show} onFocus={show} onBlur={() => setTip(null)} tabIndex={0} aria-label={`${long(d.day)}: ${d.minutes} minutes`} />
            </g>
          );
        })}
        <line x1={0} x2={W} y1={base} y2={base} className="wk-viz__base" />
      </svg>
      <Tooltip tip={tip} />
    </div>
  );
}

/** Bar with 4px rounded top corners, square at the baseline. */
function barPath(x: number, base: number, w: number, h: number) {
  const r = Math.min(4, h, w / 2);
  const y = base - h;
  return `M${x},${base} V${y + r} Q${x},${y} ${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${base} Z`;
}

function MoodLine({ days }: { days: DayRecap[] }) {
  const [tip, setTip] = useState<Tip | null>(null);
  const H = 150, top = 14, base = H - 24, left = 40;
  const slot = (W - left) / 7;
  const px = (i: number) => left + i * slot + slot / 2;
  const py = (m: number) => base - ((m - 1) / 4) * (base - top);
  const segs: string[] = [];
  let cur = "";
  days.forEach((d, i) => {
    if (d.mood) cur += `${cur ? "L" : "M"}${px(i)},${py(d.mood)} `;
    else if (cur) { segs.push(cur); cur = ""; }
  });
  if (cur) segs.push(cur);
  return (
    <div className="wk-viz" onMouseLeave={() => setTip(null)}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Mood: ${days.map((d) => `${short(d.day)} ${d.mood ? MOOD_LABEL[d.mood] : "no check-in"}`).join(", ")}`}>
        {[1, 3, 5].map((m) => (
          <g key={m}>
            <line x1={left} x2={W} y1={py(m)} y2={py(m)} className="wk-viz__grid" />
            <text x={left - 6} y={py(m) + 4} textAnchor="end" className="wk-viz__axis">{MOOD_LABEL[m]}</text>
          </g>
        ))}
        {segs.map((s, i) => (
          <motion.path key={i} d={s} fill="none" stroke={C_AFTER} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.9 }} />
        ))}
        {days.map((d, i) => {
          const show = () => setTip({ x: (px(i) / W) * 100, y: d.mood ? py(d.mood) - 10 : base - 20, lines: [long(d.day), d.mood ? `${MOOD_LABEL[d.mood]} (${d.mood} of 5)` : "No check-in"] });
          return (
            <g key={d.day}>
              {d.mood && <circle cx={px(i)} cy={py(d.mood)} r={4.5} fill={C_AFTER} className="wk-viz__dot" />}
              <text x={px(i)} y={H - 6} textAnchor="middle" className="wk-viz__axis">{short(d.day)}</text>
              <rect x={px(i) - slot / 2} y={top - 6} width={slot} height={base - top + 26} fill="transparent" onMouseEnter={show} onFocus={show} onBlur={() => setTip(null)} tabIndex={0} aria-label={`${long(d.day)}: ${d.mood ? MOOD_LABEL[d.mood] : "no check-in"}`} />
            </g>
          );
        })}
      </svg>
      <Tooltip tip={tip} />
    </div>
  );
}

function StressDumbbell({ r }: { r: WeekRecap }) {
  const [tip, setTip] = useState<Tip | null>(null);
  const rows = r.checkIns.slice(-8);
  const left = 56, right = 14, rowH = 24, top = 8;
  const H = top + rows.length * rowH + 22;
  const px = (v: number) => left + (v / 10) * (W - left - right);
  return (
    <div className="wk-viz" onMouseLeave={() => setTip(null)}>
      <div className="wk-viz__legend" aria-hidden="true">
        <span><i style={{ background: C_BEFORE }} /> Before</span>
        <span><i style={{ background: C_AFTER }} /> After</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Stress before and after ${rows.length} practices. Average ${r.avgBefore} before, ${r.avgAfter} after, out of 10.`}>
        {[0, 5, 10].map((v) => (
          <g key={v}>
            <line x1={px(v)} x2={px(v)} y1={top - 4} y2={H - 18} className="wk-viz__grid" />
            <text x={px(v)} y={H - 4} textAnchor="middle" className="wk-viz__axis">{v}</text>
          </g>
        ))}
        {rows.map((c, i) => {
          const y = top + i * rowH + rowH / 2;
          const show = () => setTip({ x: (px(Math.max(c.before, c.after)) / W) * 100, y: y - 12, lines: [`${short(c.day)} · ${kindLabel(c.kind)}`, `Before ${c.before}, after ${c.after}`] });
          return (
            <g key={i}>
              <text x={left - 8} y={y + 4} textAnchor="end" className="wk-viz__axis">{short(c.day)}</text>
              <line x1={px(c.before)} x2={px(c.after)} y1={y} y2={y} className="wk-viz__link" />
              <circle cx={px(c.before)} cy={y} r={5} fill={C_BEFORE} className="wk-viz__dot" />
              <motion.circle cx={px(c.after)} cy={y} r={5} fill={C_AFTER} className="wk-viz__dot" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.05 }} />
              {i === 0 && c.before !== c.after && (
                <>
                  <text x={px(c.before)} y={y - 9} textAnchor="middle" className="wk-viz__lbl">before</text>
                  <text x={px(c.after)} y={y - 9} textAnchor="middle" className="wk-viz__lbl">after</text>
                </>
              )}
              <rect x={0} y={y - rowH / 2} width={W} height={rowH} fill="transparent" onMouseEnter={show} onFocus={show} onBlur={() => setTip(null)} tabIndex={0} aria-label={`${long(c.day)}, ${kindLabel(c.kind)}: stress ${c.before} before, ${c.after} after`} />
            </g>
          );
        })}
      </svg>
      <Tooltip tip={tip} />
    </div>
  );
}

const kindLabel = (k: string) => {
  const [, rest] = k.split(":");
  return (rest ?? k).replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());
};

function AreaBars({ areas }: { areas: Array<{ area: string; minutes: number }> }) {
  const max = Math.max(...areas.map((a) => a.minutes));
  return (
    <ul className="area-bars">
      {areas.map((a, i) => (
        <li key={a.area}>
          <span className="area-bars__name">{a.area}</span>
          <span className="area-bars__track">
            <motion.i style={{ background: C_MIN }} initial={{ width: 0 }} whileInView={{ width: `${(a.minutes / max) * 100}%` }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.6 }} />
          </span>
          <span className="area-bars__val">{a.minutes} min</span>
        </li>
      ))}
    </ul>
  );
}
