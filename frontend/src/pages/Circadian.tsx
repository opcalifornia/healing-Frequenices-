import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Reveal, ZoomPage } from "../rooted/motion";
import { Evidence, SourceLink } from "../rooted/ui";
import { Icon } from "../components/Icon";
import { Footer } from "../components/Footer";
import { arcLength, circadianArcs, niceTime, fromMin, type ClockArc } from "../rooted/ritualLogic";
import { RITUALS } from "../rooted/rituals";
import { useRitualPrefs } from "../store/rituals";
import "../rooted/rooted.css";
import "./Rituals.css";

const C = 160;
const RADII = [118, 92, 66];
const WIDTH = 20;
const DAY = 1440;

const pt = (min: number, r: number) => {
  const a = (min / DAY) * Math.PI * 2 - Math.PI / 2; // midnight at the top
  return [C + Math.cos(a) * r, C + Math.sin(a) * r] as const;
};
function arcPath(a: ClockArc, r: number) {
  const len = arcLength(a);
  const [x1, y1] = pt(a.start, r);
  const [x2, y2] = pt(a.start + len, r);
  return `M${x1.toFixed(2)} ${y1.toFixed(2)} A${r} ${r} 0 ${len > DAY / 2 ? 1 : 0} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

const HABITS = [
  { title: "Get daylight early", body: "A few minutes outside within an hour of waking helps set your body clock. Even a cloudy sky is far brighter than indoor light." },
  { title: "Wake at about the same time", body: "A steady wake time is one of the strongest cues your body clock has, including at weekends." },
  { title: "Time your caffeine", body: "Caffeine can disturb sleep even 6 hours before bed in some studies. Keep it to the morning and early afternoon." },
  { title: "Work with the afternoon dip", body: "Feeling flat in the early afternoon is normal. A short walk, daylight or a quiet break often beats another coffee." },
  { title: "Dim the evening", body: "Lower lights and screens for the last hour or two before bed so melatonin can rise." },
  { title: "Keep the bedroom cool and dark", body: "Your core temperature falls as you drift off. A cool, dark room supports that." },
];

export default function Circadian() {
  const prefs = useRitualPrefs();
  const arcs = useMemo(() => circadianArcs(prefs.wake, prefs.bed), [prefs.wake, prefs.bed]);
  const [sel, setSel] = useState<string>("cortisol");
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(t); }, []);
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const cur = arcs.find((a) => a.id === sel) ?? arcs[0];
  const [hx, hy] = pt(nowMin, 128);

  return (
    <ZoomPage className="rooted rituals circ">
      <div className="circ__wrap">
        <Link to="/rituals" className="rdet__back rdet__back--flat" aria-label="Back to Rituals"><Icon name="back" size={22} /></Link>
        <Reveal>
          <span className="rooted__eyebrow">Learn</span>
          <h1 className="circ__title">The circadian rhythm, explained</h1>
          <p className="rooted__lead">Your body runs on a roughly 24-hour clock. Alertness, body temperature, hormones and sleepiness all rise and fall on a schedule that daylight and routine help keep steady. This clock shows a typical day for your wake time ({niceTime(prefs.wake)}) and bedtime ({niceTime(prefs.bed)}).</p>
        </Reveal>

        <Reveal>
          <div className="r-card circ__card">
            <svg className="circ__clock" viewBox="0 0 320 320" role="img" aria-label="24-hour clock showing cortisol rise, focus peak, afternoon dip, second wind, melatonin and sleep stages">
              <circle cx={C} cy={C} r={136} className="circ__face" />
              {Array.from({ length: 24 }, (_, h) => { const [x1, y1] = pt(h * 60, h % 6 === 0 ? 132 : 136); const [x2, y2] = pt(h * 60, 140); return <line key={h} x1={x1} y1={y1} x2={x2} y2={y2} className="circ__tick" />; })}
              {[0, 6, 12, 18].map((h) => { const [x, y] = pt(h * 60, 150); return <text key={h} x={x} y={y} className="circ__hr" textAnchor="middle" dominantBaseline="middle">{h === 0 ? "12a" : h === 12 ? "12p" : h > 12 ? `${h - 12}p` : `${h}a`}</text>; })}
              {arcs.map((a) => (
                <path key={a.id} d={arcPath(a, RADII[a.ring])} className={`circ__arc ${sel === a.id ? "is-on" : ""}`} stroke={a.color} strokeWidth={WIDTH} fill="none" strokeLinecap="round" tabIndex={0} role="button" aria-label={`${a.label}, ${niceTime(fromMin(a.start))} to ${niceTime(fromMin(a.end))}`} aria-pressed={sel === a.id} onClick={() => setSel(a.id)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSel(a.id)} />
              ))}
              {RITUALS.map((r) => { const [x, y] = pt(((prefs.times[r.id as "revive"].split(":").map(Number).reduce((h, m) => h * 60 + m))), 40); return <g key={r.id}><circle cx={x} cy={y} r={7} fill={r.accentColor} /><text x={x} y={y + 18} className="circ__rl" textAnchor="middle">{r.name}</text></g>; })}
              <line x1={C} y1={C} x2={hx} y2={hy} className="circ__hand" />
              <circle cx={C} cy={C} r={4} className="circ__hub" />
            </svg>
            <div className="circ__read" aria-live="polite" style={{ "--a": cur.color } as React.CSSProperties}>
              <span className="circ__chip" />
              <h3>{cur.label}</h3>
              <p className="circ__when">{niceTime(fromMin(cur.start))} to {niceTime(fromMin(cur.end))}</p>
              <p>{cur.note}</p>
            </div>
          </div>
          <ul className="circ__legend">
            {arcs.map((a) => <li key={a.id}><button className={sel === a.id ? "is-on" : ""} onClick={() => setSel(a.id)}><i style={{ background: a.color }} />{a.label}</button></li>)}
          </ul>
          <p className="circ__fine"><Evidence s="Moderate" /> These are typical patterns from sleep and chronobiology research. Timing varies a lot between people (some are natural early birds, others night owls), so treat the clock as a guide. <SourceLink s={{ text: "NIGMS: Circadian rhythms", url: "https://www.nigms.nih.gov/education/fact-sheets/Pages/circadian-rhythms.aspx" }} /></p>
        </Reveal>

        <Reveal>
          <h2 className="circ__h2">Where the rituals fit</h2>
          <div className="circ__fit">
            {RITUALS.map((r) => (
              <Link key={r.id} to={`/rituals/${r.id}`} className="r-card circ__ritual" style={{ "--a": r.accentColor } as React.CSSProperties}>
                <b>{r.name}</b><span>{niceTime(prefs.times[r.id as "revive"])}</span>
                <p>{{ revive: "Meets the natural morning rise in alertness with light, fluids and a bright sound session.", calm: "Sits in the early afternoon dip, when a short, quiet reset is most welcome.", unwind: "Starts the evening wind-down as melatonin begins to rise." }[r.id]}</p>
              </Link>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <h2 className="circ__h2">Daily habits that keep the clock steady</h2>
          <ul className="circ__habits">{HABITS.map((h) => <li key={h.title} className="r-card"><b>{h.title}</b><p>{h.body}</p></li>)}</ul>
          <p className="circ__fine">General information, not medical advice. If you struggle with sleep or alertness for weeks, talk to a clinician.</p>
          <SourceLink s={{ text: "Drake C et al. Caffeine effects on sleep taken 0, 3, or 6 hours before going to bed. J Clin Sleep Med, 2013", url: "https://doi.org/10.5664/jcsm.3170" }} />
        </Reveal>
      </div>
      <Footer />
    </ZoomPage>
  );
}
