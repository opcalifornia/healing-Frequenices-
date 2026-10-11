import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { HYPNOGRAM, RHYTHMS, SLEEP_STAGES, EVIDENCE, type StageId, type Strength } from "../brainContent";

/* ---------- Hypnogram ---------- */

const LEVEL: Record<StageId, number> = { W: 0, REM: 1, N1: 2, N2: 3, N3: 4 };

export function Hypnogram() {
  const [stage, setStage] = useState<StageId>("N3");
  const W = 640;
  const H = 200;
  const total = 480;
  const x = (m: number) => 50 + (m / total) * (W - 60);
  const y = (s: StageId) => 18 + LEVEL[s] * 38;
  const segs = HYPNOGRAM.map(([start, s], i) => ({ start, end: HYPNOGRAM[i + 1]?.[0] ?? total, s }));
  const info = SLEEP_STAGES.find((s) => s.id === stage)!;

  let d = "";
  segs.forEach((g, i) => {
    d += `${i ? "L" : "M"}${x(g.start)} ${y(g.s)} L${x(g.end)} ${y(g.s)}`;
  });

  return (
    <div className="diagram">
      <svg viewBox={`0 0 ${W} ${H + 24}`} className="hypno" role="img" aria-label="A typical night of sleep: about five 90-minute cycles, with deep sleep early and more REM toward morning">
        {SLEEP_STAGES.map((s) => (
          <text key={s.id} x="44" y={y(s.id) + 4} textAnchor="end" className="hypno__axis">{s.id}</text>
        ))}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((h) => (
          <g key={h}>
            <line x1={x(h * 60)} x2={x(h * 60)} y1="8" y2={H - 10} className="hypno__grid" />
            <text x={x(h * 60)} y={H + 10} textAnchor="middle" className="hypno__axis">{h}h</text>
          </g>
        ))}
        {segs.map((g, i) => {
          const c = SLEEP_STAGES.find((s) => s.id === g.s)!.color;
          return (
            <rect
              key={i}
              x={x(g.start)}
              y={y(g.s) - 7}
              width={Math.max(1, x(g.end) - x(g.start))}
              height="14"
              rx="3"
              fill={c}
              opacity={g.s === stage ? 1 : 0.35}
              className="hypno__seg"
              onClick={() => setStage(g.s)}
            />
          );
        })}
        <path d={d} className="hypno__line" />
      </svg>
      <div className="seg seg--wrap" role="tablist" aria-label="Sleep stages">
        {SLEEP_STAGES.map((s) => (
          <button key={s.id} role="tab" aria-selected={stage === s.id} className={stage === s.id ? "is-on" : ""} onClick={() => setStage(s.id)}>
            <i className="dot-swatch" style={{ background: s.color }} /> {s.name}
          </button>
        ))}
      </div>
      <p className="diagram__text" aria-live="polite">
        <strong>{info.name}</strong> · typical share of the night: {info.share}. {info.rhythm}
      </p>
    </div>
  );
}

/* ---------- Frequency ladder ---------- */

const MIN = 1e-5;
const MAX = 2.5e4;
const pos = (hz: number) => ((Math.log10(hz) - Math.log10(MIN)) / (Math.log10(MAX) - Math.log10(MIN))) * 100;
const TICKS: Array<[number, string]> = [
  [1 / 86400, "1/day"], [1 / 3600, "1/hour"], [1 / 60, "1/min"], [1, "1 Hz"], [10, "10 Hz"], [100, "100 Hz"], [1000, "1 kHz"], [10000, "10 kHz"],
];

export function FrequencyLadder() {
  const [open, setOpen] = useState<string | null>("App binaural beats");
  return (
    <div className="diagram ladder">
      <div className="ladder__axis" aria-hidden="true">
        {TICKS.map(([hz, l]) => (
          <span key={l} style={{ left: `${pos(hz)}%` }}>{l}</span>
        ))}
      </div>
      <ul className="ladder__list">
        {RHYTHMS.map((r) => {
          const left = pos(r.lo);
          const width = r.hi ? Math.max(0.8, pos(r.hi) - left) : 0.8;
          return (
            <li key={r.name} className={`ladder__row ladder__row--${r.kind} ${open === r.name ? "is-open" : ""}`}>
              <button className="ladder__name" onClick={() => setOpen(open === r.name ? null : r.name)} aria-expanded={open === r.name}>
                {r.name}
              </button>
              <div className="ladder__track">
                {TICKS.map(([hz]) => <i key={hz} style={{ left: `${pos(hz)}%` }} />)}
                <span className="ladder__bar" style={{ left: `${left}%`, width: `${width}%` }} />
              </div>
              {open === r.name && <p className="ladder__note">{r.note}</p>}
            </li>
          );
        })}
      </ul>
      <div className="legend">
        <span><i className="k-body" /> body</span>
        <span><i className="k-brain" /> brain</span>
        <span><i className="k-app" /> this app</span>
        <span><i className="k-sound" /> sound</span>
      </div>
    </div>
  );
}

/* ---------- Breathing pacer (0.1 Hz) ---------- */

export function BreathPacer() {
  const [on, setOn] = useState(false);
  const [phase, setPhase] = useState<"in" | "out">("in");
  const [count, setCount] = useState(5);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!on) return;
    setPhase("in");
    setCount(5);
    let t = 0;
    const id = window.setInterval(() => {
      t += 1;
      const inCycle = t % 10;
      setPhase(inCycle < 5 ? "in" : "out");
      setCount(5 - (inCycle % 5));
    }, 1000);
    return () => window.clearInterval(id);
  }, [on]);

  return (
    <div className="pacer">
      <div className={`pacer__circle ${on && !reduce ? `is-${phase}` : ""}`} aria-hidden="true">
        <span>{on ? (phase === "in" ? "Breathe in" : "Breathe out") : "6 / min"}</span>
        {on && <small>{count}</small>}
      </div>
      <div className="pacer__text">
        <p>
          Try it: five seconds in, five seconds out. That is 6 breaths a minute, or 0.1 Hz, close to most people's
          "resonance" rate, where heart rhythm and breathing swing together.
        </p>
        <button className="btn btn--secondary btn--small" onClick={() => setOn(!on)} aria-pressed={on}>
          {on ? "Stop" : "Start breathing guide"}
        </button>
        <p className="visually-hidden" aria-live="polite">{on ? (phase === "in" ? "Breathe in" : "Breathe out") : ""}</p>
      </div>
    </div>
  );
}

/* ---------- Evidence ---------- */

const STRENGTH_CLASS: Record<Strength, string> = { Strong: "s-strong", Moderate: "s-moderate", Mixed: "s-mixed", Weak: "s-weak", None: "s-none" };

export function EvidenceTable() {
  return (
    <div className="evidence" role="table" aria-label="What the research says">
      <div className="evidence__row evidence__row--head" role="row">
        <span role="columnheader">Claim</span>
        <span role="columnheader">What studies found</span>
        <span role="columnheader">Evidence</span>
      </div>
      {EVIDENCE.map((e) => (
        <div key={e.claim} className="evidence__row" role="row">
          <strong role="cell">{e.claim}</strong>
          <span role="cell">{e.finding}</span>
          <span role="cell"><em className={`strength ${STRENGTH_CLASS[e.strength]}`}>{e.strength === "None" ? "No support" : e.strength}</em></span>
        </div>
      ))}
    </div>
  );
}
