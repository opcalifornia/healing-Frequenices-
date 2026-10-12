import { useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SourceLink } from "./ui";

/* ------------------------------------------------------------------ */
/* The digestive journey                                               */
/* ------------------------------------------------------------------ */

const STATIONS = [
  { id: "mouth", name: "Mouth", time: "Seconds to minutes", x: 160, y: 46, color: "#ffb74d",
    body: "Chewing breaks food into small pieces, and an enzyme in saliva (amylase) starts breaking down starch. Chewing slowly gives your fullness signals time to catch up." },
  { id: "esophagus", name: "Esophagus", time: "About 5 to 10 seconds", x: 160, y: 110, color: "#ffcc80",
    body: "Waves of muscle (peristalsis) push each swallow down to the stomach. It works even upside down." },
  { id: "stomach", name: "Stomach", time: "Empties over 2 to 5 hours", x: 186, y: 180, color: "#e57373",
    body: "Strong acid and enzymes start digesting protein, and muscles churn food into a paste. Meals with more fat, protein and fiber leave the stomach more slowly, which is part of why they keep you full longer." },
  { id: "organs", name: "Liver and pancreas", time: "All day", x: 128, y: 176, color: "#a1887f",
    body: "The pancreas sends digestive enzymes into the small intestine and releases insulin to move sugar from your blood into cells. The liver makes bile to digest fat and processes nutrients arriving from the gut." },
  { id: "small", name: "Small intestine", time: "About 2 to 6 hours", x: 160, y: 250, color: "#f06292",
    body: "Most nutrients are absorbed here. About 6 meters (20 feet) long and lined with millions of tiny finger-like villi, it has a huge surface area for absorbing sugars, amino acids, fats, vitamins and minerals." },
  { id: "large", name: "Large intestine", time: "About 10 to 60 hours", x: 160, y: 300, color: "#7cb342",
    body: "Absorbs water and is home to tens of trillions of microbes, roughly as many bacterial cells as human cells in your body. They ferment the fiber you couldn't digest and make short-chain fatty acids that feed your colon cells." },
];

export function DigestiveJourney() {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  const s = STATIONS[i];
  return (
    <div className="diagram gut">
      <div className="gut__grid">
        <svg viewBox="0 0 320 340" className="gut__svg" role="img" aria-label={`Digestive system with the ${s.name.toLowerCase()} highlighted`}>
          {/* Torso outline */}
          <path d="M120 10c0-6 80-6 80 0l4 20c20 6 52 22 60 50l8 110c4 50-6 100-26 130H74C54 290 44 240 48 190l8-110c8-28 40-44 60-50Z" className="gut__body" />
          {/* Esophagus */}
          <path d="M160 60 L160 150" className={`gut__organ ${s.id === "esophagus" ? "is-on" : ""}`} strokeWidth="10" fill="none" stroke="#ffcc80" />
          {/* Liver */}
          <path d="M84 150c20-14 64-18 88-6 2 22-18 40-50 42-24 2-42-12-38-36Z" className={`gut__organ ${s.id === "organs" ? "is-on" : ""}`} fill="#8d6e63" />
          {/* Pancreas */}
          <path d="M150 206c18-6 46-4 62 4-8 8-30 12-62 6Z" className={`gut__organ ${s.id === "organs" ? "is-on" : ""}`} fill="#bcaaa4" />
          {/* Stomach */}
          <path d="M160 150c30-4 56 10 54 38-2 26-28 34-50 26-12-4-14-14-8-24 6-10 10-20 4-40Z" className={`gut__organ ${s.id === "stomach" ? "is-on" : ""}`} fill="#e57373" />
          {/* Large intestine frame */}
          <path d="M108 300 L108 230 Q108 218 120 218 L204 218 Q216 218 216 230 L216 300" className={`gut__organ ${s.id === "large" ? "is-on" : ""}`} strokeWidth="18" fill="none" stroke="#7cb342" strokeLinecap="round" />
          {/* Small intestine coils */}
          <path d="M132 236c10-6 50-6 60 0s0 14-30 14-40 8-30 14 50 6 60 0-10 14-30 14-40 4-30 12" className={`gut__organ ${s.id === "small" ? "is-on" : ""}`} strokeWidth="8" fill="none" stroke="#f06292" strokeLinecap="round" />
          {/* Head */}
          <circle cx="160" cy="34" r="22" className="gut__body" />
          <path d="M150 46q10 6 20 0" stroke="#ffb74d" strokeWidth="3" fill="none" className={`gut__organ ${s.id === "mouth" ? "is-on" : ""}`} />
          {/* Microbes in the colon */}
          {s.id === "large" && !reduce && Array.from({ length: 8 }, (_, k) => (
            <motion.ellipse key={k} rx="4" ry="2" fill="#dcedc8" initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0], cx: [112 + (k % 2) * 96, 112 + (k % 2) * 96], cy: [300 - k * 9, 296 - k * 9] }}
              transition={{ duration: 2, repeat: Infinity, delay: k * 0.25 }} />
          ))}
          {/* Travelling bite */}
          <motion.circle r="7" fill="#fff" stroke={s.color} strokeWidth="3" initial={false} animate={{ cx: s.x, cy: s.y }} transition={{ type: "spring", stiffness: 90, damping: 15 }} />
        </svg>
        <div className="gut__info">
          <ol className="gut__steps" aria-label="Stages of digestion">
            {STATIONS.map((st, k) => (
              <li key={st.id}>
                <button aria-pressed={k === i} className={k === i ? "is-on" : ""} onClick={() => setI(k)} style={{ "--c": st.color } as React.CSSProperties}>
                  <span>{k + 1}</span>{st.name}
                </button>
              </li>
            ))}
          </ol>
          <motion.div key={s.id} className="gut__detail" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} aria-live="polite">
            <h3 style={{ color: s.color }}>{s.name}</h3>
            <span className="gut__time">{s.time}</span>
            <p>{s.body}</p>
          </motion.div>
          <div className="gut__nav">
            <button className="btn btn--secondary btn--small" onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0}>Back</button>
            <button className="btn btn--primary btn--small" onClick={() => setI((i + 1) % STATIONS.length)}>{i === STATIONS.length - 1 ? "Start again" : "Next stop"}</button>
          </div>
        </div>
      </div>
      <p className="diagram__text gut__fine">Times vary a lot from person to person and meal to meal. Whole trip: usually one to three days.</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* How fiber works                                                     */
/* ------------------------------------------------------------------ */

const FIBER = {
  soluble: {
    name: "Soluble fiber", foods: "Oats, barley, beans, lentils, apples, citrus, chia",
    does: [
      "Dissolves into a gel that slows how fast sugar reaches your blood.",
      "Binds bile acids, so your liver pulls cholesterol from your blood to make more. That's how oat beta-glucan lowers LDL.",
      "Feeds gut microbes, which turn it into short-chain fatty acids like butyrate.",
    ],
    color: "#6fa83a",
  },
  insoluble: {
    name: "Insoluble fiber", foods: "Whole grains, wheat bran, nuts, seeds, vegetable skins",
    does: [
      "Doesn't dissolve, so it adds bulk and helps things move along.",
      "Helps prevent constipation and keeps you regular.",
      "Adds chew and volume to meals, which helps you feel full.",
    ],
    color: "#d0703a",
  },
};

export function FiberAtWork() {
  const [kind, setKind] = useState<keyof typeof FIBER>("soluble");
  const reduce = useReducedMotion();
  const f = FIBER[kind];
  return (
    <div className="diagram fiber">
      <div className="seg seg--wrap" role="group" aria-label="Type of fiber">
        {(Object.keys(FIBER) as Array<keyof typeof FIBER>).map((k) => (
          <button key={k} className={kind === k ? "is-on" : ""} aria-pressed={kind === k} onClick={() => setKind(k)}>{FIBER[k].name}</button>
        ))}
      </div>
      <svg viewBox="0 0 600 170" className="fiber__svg" role="img" aria-label={kind === "soluble" ? "Soluble fiber forming a gel and being fermented by microbes into short-chain fatty acids" : "Insoluble fiber adding bulk and moving through the gut"}>
        <rect x="10" y="40" width="580" height="90" rx="45" className="fiber__tube" />
        {kind === "soluble" ? (
          <>
            <motion.rect x="40" y="58" width="200" height="54" rx="27" fill={f.color} opacity="0.35" initial={{ scaleX: 0.3 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2 }} style={{ transformOrigin: "40px 85px" }} />
            <text x="140" y="90" textAnchor="middle" className="fiber__label">Gel slows sugar</text>
            {Array.from({ length: 6 }, (_, k) => (
              <motion.circle key={k} r="5" fill="#fff59d" initial={{ cx: 60 + k * 30, cy: 85 }} animate={reduce ? {} : { cx: [60 + k * 30, 70 + k * 30], cy: [85, 60] }} transition={{ duration: 3 + k * 0.4, repeat: Infinity, repeatType: "mirror" }} />
            ))}
            {Array.from({ length: 5 }, (_, k) => (
              <g key={k} transform={`translate(${330 + k * 46} 85)`}>
                <motion.g animate={reduce ? undefined : { y: [0, -7, 0] }} transition={{ duration: 1.6, repeat: Infinity, delay: k * 0.2 }}>
                  <ellipse rx="12" ry="7" fill="#9ccc65" />
                  <circle cx="5" cy="-2" r="1.6" fill="#1b2a12" />
                </motion.g>
              </g>
            ))}
            {Array.from({ length: 6 }, (_, k) => (
              <g key={k} transform={`translate(${340 + k * 40} 70)`}>
                <motion.circle r="4" fill="#80deea" animate={reduce ? { opacity: 0.8 } : { y: [0, -50], opacity: [0, 1, 0] }} transition={{ duration: 2.4, repeat: Infinity, delay: k * 0.4 }} />
              </g>
            ))}
            <text x="440" y="155" textAnchor="middle" className="fiber__label">Microbes ferment it → short-chain fatty acids</text>
          </>
        ) : (
          <>
            {Array.from({ length: 13 }, (_, k) => (
              <g key={k} transform={`translate(${30 + k * 40} ${62 + (k % 3) * 18}) rotate(${(k * 37) % 60 - 30})`}>
                <motion.rect width="22" height="6" rx="3" fill={f.color} animate={reduce ? undefined : { x: [0, 36] }} transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }} />
              </g>
            ))}
            <text x="300" y="155" textAnchor="middle" className="fiber__label">Adds bulk and keeps things moving</text>
          </>
        )}
      </svg>
      <div className="fiber__cols">
        <ul>{f.does.map((d) => <li key={d}>{d}</li>)}</ul>
        <p><strong>Found in:</strong> {f.foods}. Most whole plant foods have both kinds.</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Blood sugar after a meal                                            */
/* ------------------------------------------------------------------ */

type SeriesId = "sit" | "walk" | "order";
const SERIES: Array<{ id: SeriesId; name: string; color: string; dash?: string }> = [
  { id: "sit", name: "Sat after eating", color: "#d0703a" },
  { id: "walk", name: "10-minute walk after", color: "#2f8fd6" },
  { id: "order", name: "Vegetables and protein first", color: "#6fa83a", dash: "6 5" },
];

/** Smooth illustrative curve: rise to a peak, then decay back to baseline. */
function curve(peak: number, tPeak: number, width: number) {
  return (t: number) => {
    const base = 92;
    if (t <= 0) return base;
    const rise = Math.min(1, t / tPeak);
    const fall = t > tPeak ? Math.exp(-((t - tPeak) ** 2) / (2 * width * width)) : 1;
    return base + (peak - base) * Math.sin((rise * Math.PI) / 2) * fall;
  };
}
const SHAPES: Record<SeriesId, (t: number) => number> = {
  sit: curve(158, 45, 42),
  walk: curve(132, 40, 38),
  order: curve(136, 55, 50),
};

export function GlucoseChart() {
  const [show, setShow] = useState<Record<SeriesId, boolean>>({ sit: true, walk: true, order: false });
  const [hover, setHover] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const W = 640, H = 280, L = 48, R = 16, T = 18, B = 40;
  const xs = (t: number) => L + (t / 180) * (W - L - R);
  const ys = (v: number) => T + (1 - (v - 80) / (170 - 80)) * (H - T - B);
  const times = useMemo(() => Array.from({ length: 61 }, (_, k) => k * 3), []);
  const path = (id: SeriesId) => times.map((t, k) => `${k ? "L" : "M"}${xs(t).toFixed(1)} ${ys(SHAPES[id](t)).toFixed(1)}`).join(" ");

  const onMove = (e: React.PointerEvent) => {
    const r = svgRef.current!.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    const t = Math.round(Math.max(0, Math.min(180, ((px - L) / (W - L - R)) * 180)) / 3) * 3;
    setHover(t);
  };
  const visible = SERIES.filter((s) => show[s.id]);

  return (
    <div className="diagram glucose">
      <div className="glucose__legend" role="group" aria-label="Show or hide lines">
        {SERIES.map((s) => (
          <button key={s.id} className={`glucose__key ${show[s.id] ? "is-on" : ""}`} aria-pressed={show[s.id]} onClick={() => setShow({ ...show, [s.id]: !show[s.id] })}>
            <svg width="22" height="8" aria-hidden="true"><line x1="1" y1="4" x2="21" y2="4" stroke={s.color} strokeWidth="2.5" strokeDasharray={s.dash} strokeLinecap="round" /></svg>
            {s.name}
          </button>
        ))}
      </div>
      <div className="glucose__plot">
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="glucose__svg" role="img" aria-label="Illustrative blood sugar curves after a meal" onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
          {[80, 100, 120, 140, 160].map((v) => (
            <g key={v}>
              <line x1={L} x2={W - R} y1={ys(v)} y2={ys(v)} className="glucose__grid" />
              <text x={L - 8} y={ys(v) + 4} textAnchor="end" className="glucose__tick">{v}</text>
            </g>
          ))}
          {[0, 30, 60, 90, 120, 150, 180].map((t) => (
            <text key={t} x={xs(t)} y={H - B + 18} textAnchor="middle" className="glucose__tick">{t === 0 ? "Meal" : `${t}m`}</text>
          ))}
          <text x={L} y={H - 4} className="glucose__tick">Minutes after eating</text>
          <text x={10} y={T + 4} className="glucose__tick">mg/dL</text>
          {show.walk && (
            <g>
              <rect x={xs(10)} y={T} width={xs(20) - xs(10)} height={H - T - B} className="glucose__band" />
              <text x={xs(15)} y={T + 12} textAnchor="middle" className="glucose__tick">walk</text>
            </g>
          )}
          {visible.map((s) => (
            <motion.path key={s.id} d={path(s.id)} fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeDasharray={s.dash} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, ease: "easeOut" }} />
          ))}
          {visible.map((s) => {
            const t = s.id === "sit" ? 62 : s.id === "walk" ? 92 : 112;
            const dy = s.id === "walk" ? 20 : -10;
            return <text key={`l-${s.id}`} x={xs(t) + 6} y={ys(SHAPES[s.id](t)) + dy} className="glucose__direct">{s.name}</text>;
          })}
          {hover !== null && (
            <g pointerEvents="none">
              <line x1={xs(hover)} x2={xs(hover)} y1={T} y2={H - B} className="glucose__cross" />
              {visible.map((s) => <circle key={s.id} cx={xs(hover)} cy={ys(SHAPES[s.id](hover))} r="5" fill={s.color} stroke="#141813" strokeWidth="2" />)}
            </g>
          )}
          <rect x={L} y={T} width={W - L - R} height={H - T - B} fill="transparent" />
        </svg>
        {hover !== null && visible.length > 0 && (
          <div className="glucose__tip" style={{ left: `${(xs(hover) / W) * 100}%` }} role="status">
            <strong>{hover === 0 ? "At the meal" : `${hover} min after eating`}</strong>
            {visible.map((s) => (
              <span key={s.id}><i style={{ background: s.color }} />{s.name}<b>{Math.round(SHAPES[s.id](hover))}</b></span>
            ))}
          </div>
        )}
      </div>
      <details className="glucose__table">
        <summary>Show as a table</summary>
        <table>
          <thead><tr><th>Minutes</th>{SERIES.map((s) => <th key={s.id}>{s.name}</th>)}</tr></thead>
          <tbody>{[0, 30, 60, 90, 120, 150, 180].map((t) => <tr key={t}><td>{t}</td>{SERIES.map((s) => <td key={s.id}>{Math.round(SHAPES[s.id](t))}</td>)}</tr>)}</tbody>
        </table>
      </details>
      <p className="diagram__text">
        An illustration of the patterns studies find, not real or personal readings. A short, easy walk soon after eating lowers and shortens the
        spike, and eating vegetables and protein before carbohydrates does too. Everyone's response is different, and people with diabetes should follow their care team's targets.
      </p>
      <p className="nourish__src">
        <SourceLink s={{ text: "Buffey AJ et al. Sports Medicine, 2022", url: "https://doi.org/10.1007/s40279-022-01649-4" }} />
        <SourceLink s={{ text: "Shukla AP et al. Food order has a significant impact on postprandial glucose and insulin levels. Diabetes Care, 2015", url: "https://doi.org/10.2337/dc15-0429" }} />
      </p>
    </div>
  );
}
