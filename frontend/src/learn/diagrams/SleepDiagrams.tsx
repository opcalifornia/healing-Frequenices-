import { useMemo, useState } from "react";
import { LIGHT_LEVELS, type Tip } from "../sleepContent";
import { fromMinutes, toMinutes, type BedtimePlan } from "../../store/bedtime";

const STRENGTH_CLASS = { Strong: "s-strong", Moderate: "s-moderate", Mixed: "s-mixed", Weak: "s-weak", None: "s-none" } as const;

export function TipList({ tips }: { tips: Tip[] }) {
  return (
    <ul className="tips-list">
      {tips.map((t) => (
        <li key={t.title}>
          <div className="tips-list__head">
            <h3>{t.title}</h3>
            <em className={`strength ${STRENGTH_CLASS[t.strength]}`}>{t.strength === "Weak" ? "Early evidence" : t.strength === "None" ? "No support" : `${t.strength} evidence`}</em>
          </div>
          <p>{t.body}</p>
          {t.source && <small>Source: {t.source}</small>}
        </li>
      ))}
    </ul>
  );
}

/* ---------- 24-hour body clock ---------- */

/** Illustrative curves over the 24 h after waking. `bedH` is hours from wake to lights out. */
function curves(bedH: number) {
  const cortisol = (h: number) => 0.16 + 0.72 * Math.exp(-(((h - 0.6) / 1.7) ** 2)) + 0.45 * Math.exp(-(((h - 24) / 1.6) ** 2)) + 0.12 * Math.exp(-(h / 9));
  const melatonin = (h: number) => {
    const rise = 1 / (1 + Math.exp(-(h - (bedH - 1.6)) * 2.2));
    const fall = 1 / (1 + Math.exp((h - 23.2) * 2.2));
    return 0.04 + 0.9 * rise * fall * (0.55 + 0.45 * Math.exp(-(((h - (bedH + 3)) / 3.5) ** 2)));
  };
  // Core temperature: lowest about 2 h before waking, highest late afternoon.
  const temp = (h: number) => 0.5 + 0.38 * Math.cos((2 * Math.PI * (h - 11)) / 24);
  return { cortisol, melatonin, temp };
}

export function BodyClock({ plan }: { plan: BedtimePlan }) {
  const W = 680;
  const H = 256;
  const L = 34;
  const R = W - 14;
  const T = 36;
  const B = H - 34;
  const wake = toMinutes(plan.wake);
  const bedH = ((toMinutes(plan.bedtime) - wake + 1440) % 1440) / 60;
  const x = (h: number) => L + (h / 24) * (R - L);
  const y = (v: number) => B - Math.max(0, Math.min(1.05, v)) * (B - T);
  const c = curves(bedH);
  const path = (f: (h: number) => number) => {
    let d = "";
    for (let i = 0; i <= 240; i++) {
      const h = (i / 240) * 24;
      d += `${i ? "L" : "M"}${x(h).toFixed(1)} ${y(f(h)).toFixed(1)}`;
    }
    return d;
  };
  const ticks = [0, 3, 6, 9, 12, 15, 18, 21, 24];

  return (
    <div className="diagram">
      <svg viewBox={`0 0 ${W} ${H}`} className="clock" role="img" aria-label={`Illustrative 24-hour body clock from waking at ${plan.wake} to lights out at ${plan.bedtime}`}>
        <rect x={x(bedH)} y={T - 6} width={x(24) - x(bedH)} height={B - T + 6} className="clock__night" />
        <rect x={x(bedH - 2)} y={T - 6} width={x(bedH) - x(bedH - 2)} height={B - T + 6} className="clock__dim" />
        <rect x={x(0)} y={T - 6} width={x(1) - x(0)} height={B - T + 6} className="clock__sun" />
        {ticks.map((h) => (
          <g key={h}>
            <line x1={x(h)} x2={x(h)} y1={T - 6} y2={B} className="clock__grid" />
            <text x={x(h)} y={B + 16} textAnchor="middle" className="clock__axis">{fromMinutes(wake + h * 60)}</text>
          </g>
        ))}
        <path d={path(c.temp)} className="clock__line" stroke="#ff9f6b" />
        <path d={path(c.cortisol)} className="clock__line" stroke="#ffc857" />
        <path d={path(c.melatonin)} className="clock__line" stroke="#8b6cff" />
        <text x={x(0.15)} y={T - 12} className="clock__tag">Morning light</text>
        <text x={x(bedH - 1.9)} y={T - 12} className="clock__tag">Dim</text>
        <text x={x(bedH + 0.2)} y={T - 12} className="clock__tag">Sleep</text>
        <text x={L - 8} y={T + 4} textAnchor="end" className="clock__axis">high</text>
        <text x={L - 8} y={B} textAnchor="end" className="clock__axis">low</text>
      </svg>
      <div className="legend">
        <span><i style={{ background: "#ffc857" }} /> cortisol: peaks soon after waking</span>
        <span><i style={{ background: "#8b6cff" }} /> melatonin: rises about 2 h before sleep</span>
        <span><i style={{ background: "#ff9f6b" }} /> core temperature: lowest before dawn</span>
      </div>
      <p className="diagram__text">
        Illustrative curves based on your times ({plan.wake} wake, {plan.bedtime} lights out), not measurements. Light hitting your eyes in the
        morning sets this whole schedule; bright light at night pushes it later.
      </p>
    </div>
  );
}

/* ---------- Light levels ---------- */

export function LightLevels() {
  const max = Math.log10(100000);
  return (
    <div className="diagram">
      <ul className="lux" aria-label="Typical light levels in lux">
        {LIGHT_LEVELS.map((l) => (
          <li key={l.label}>
            <span className="lux__label">{l.label}</span>
            <span className="lux__track">
              <span className="lux__bar" style={{ width: `${(Math.log10(l.lux) / max) * 100}%`, opacity: 0.45 + (Math.log10(l.lux) / max) * 0.55 }} />
            </span>
            <span className="lux__value">{l.lux.toLocaleString()} lux</span>
            <span className="lux__note">{l.note}</span>
          </li>
        ))}
      </ul>
      <p className="diagram__text">Bars use a logarithmic scale: each step to the right is ten times brighter. Outdoor light in the morning is tens to hundreds of times brighter than indoor light.</p>
    </div>
  );
}

/* ---------- Caffeine calculator ---------- */

const DRINKS = [
  { label: "Espresso", mg: 65 },
  { label: "Cup of coffee", mg: 95 },
  { label: "Large coffee", mg: 200 },
  { label: "Energy drink", mg: 160 },
  { label: "Black tea", mg: 47 },
];
const HALF_LIFE = 5;

export function CaffeineCalculator({ bedtime }: { bedtime: string }) {
  const [time, setTime] = useState("15:00");
  const [mg, setMg] = useState(95);
  const hours = useMemo(() => ((toMinutes(bedtime) - toMinutes(time) + 1440) % 1440) / 60, [bedtime, time]);
  const left = mg * 0.5 ** (hours / HALF_LIFE);
  const safeBy = fromMinutes(toMinutes(bedtime) - 9 * 60);

  const W = 900;
  const H = 150;
  let d = "";
  for (let i = 0; i <= 100; i++) {
    const h = (i / 100) * Math.max(hours, 1);
    d += `${i ? "L" : "M"}${((i / 100) * W).toFixed(1)} ${(H - 10 - (0.5 ** (h / HALF_LIFE)) * (H - 20)).toFixed(1)}`;
  }

  return (
    <div className="diagram caff">
      <div className="caff__inputs">
        <div className="field">
          <label htmlFor="caff-time">Last caffeine</label>
          <input id="caff-time" type="time" value={time} onChange={(e) => e.target.value && setTime(e.target.value)} />
        </div>
        <div className="field">
          <span className="bt__label">Drink</span>
          <div className="panel__chips" role="radiogroup" aria-label="Drink">
            {DRINKS.map((dr) => (
              <button key={dr.label} role="radio" aria-checked={mg === dr.mg} className={`chip ${mg === dr.mg ? "is-on" : ""}`} onClick={() => setMg(dr.mg)}>
                {dr.label} · {dr.mg} mg
              </button>
            ))}
          </div>
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="caff__svg" role="img" aria-label={`Caffeine falling from ${mg} mg to about ${Math.round(left)} mg by bedtime`}>
        <path d={`${d} L${W} ${H - 10} L0 ${H - 10} Z`} className="caff__area" />
        <path d={d} className="caff__line" />
        <text x="10" y={H - 18} className="caff__label">{time} · {mg} mg</text>
        <text x={W - 10} y={H - 18} textAnchor="end" className="caff__label">{bedtime} · {Math.round(left)} mg</text>
      </svg>
      <p className="caff__result" aria-live="polite">
        At lights out ({bedtime}) about <strong>{Math.round(left)} mg</strong> is still active, roughly {Math.round((left / 95) * 100)}% of a cup of coffee.{" "}
        {hours >= 8 ? "That timing gives your body plenty of room." : `For a ${bedtime} bedtime, try to finish caffeine by about ${safeBy}.`}
      </p>
      <p className="diagram__text">Uses a typical 5-hour half-life. Real half-lives range from about 2 to 10 hours between people.</p>
    </div>
  );
}

/* ---------- Your day, timed ---------- */

export function DayTimeline({ plan }: { plan: BedtimePlan }) {
  const w = toMinutes(plan.wake);
  const b = toMinutes(plan.bedtime);
  const items = [
    { at: w, label: "Wake up", text: "Same time every day, weekends included." },
    { at: w + 15, label: "Get outside", text: "Daylight within 30–60 minutes. Longer on cloudy days." },
    { at: w + 90, label: "First caffeine", text: "Optional: wait 90–120 minutes after waking." },
    { at: w + 120, label: "Move", text: "Exercise any time before the evening; mornings help alertness." },
    { at: b - 9 * 60, label: "Last caffeine", text: "8–10 hours before lights out." },
    { at: b - 240, label: "Late-afternoon light", text: "A few minutes outside around sunset, if you can." },
    { at: b - 120, label: "Warm bath or shower", text: "1–2 hours before bed helps your body cool down after." },
    { at: b - 90, label: "Dim the lights", text: "Overhead lights off. Low, warm lamps; screens dimmed." },
    { at: b - plan.windDown, label: "Wind down", text: "Start your bedtime routine in the app." },
    { at: b, label: "Lights out", text: "Cool, dark, quiet room." },
  ].sort((p, q) => ((p.at - w + 1440) % 1440) - ((q.at - w + 1440) % 1440));

  return (
    <ol className="day">
      {items.map((it) => (
        <li key={it.label}>
          <time>{fromMinutes(it.at)}</time>
          <div>
            <strong>{it.label}</strong>
            <p>{it.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
