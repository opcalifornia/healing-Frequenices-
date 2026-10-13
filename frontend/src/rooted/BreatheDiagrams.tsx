import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SourceLink } from "./ui";

/* ------------------------------------------------------------------ */
/* Lungs and diaphragm, breathing along                                */
/* ------------------------------------------------------------------ */

const PARTS = [
  { id: "diaphragm", name: "Diaphragm", color: "#ffb38a", body: "A dome-shaped muscle under your lungs. When it contracts it flattens and pulls down, which draws air in. It does about 80% of the work of a relaxed breath. Belly breathing is just letting it move freely." },
  { id: "lungs", name: "Lungs", color: "#f48fb1", body: "Two spongy organs holding roughly 300 to 500 million tiny air sacs (alveoli), where oxygen passes into your blood and carbon dioxide passes out. Laid flat, their surface would cover about half a tennis court." },
  { id: "vagus", name: "Vagus nerve", color: "#8fd3ff", body: "The main nerve of your rest-and-digest system, running from the brainstem past the heart and lungs down to the gut. Slow breathing, and especially long exhales, increases its relaxing influence on your heart." },
  { id: "heart", name: "Heart", color: "#e57373", body: "Your heart speeds up slightly as you breathe in and slows as you breathe out. That rhythm, called respiratory sinus arrhythmia, is healthy, and slow breathing makes it bigger." },
];

export function BreathingBody() {
  const reduce = useReducedMotion();
  const [on, setOn] = useState("diaphragm");
  const [phase, setPhase] = useState<"in" | "out">("in");
  useEffect(() => {
    if (reduce) return;
    const id = setTimeout(() => setPhase((p) => (p === "in" ? "out" : "in")), phase === "in" ? 4000 : 6000);
    return () => clearTimeout(id);
  }, [phase, reduce]);
  const inhale = phase === "in";
  const dur = inhale ? 4 : 6;
  const part = PARTS.find((p) => p.id === on)!;
  const hl = (id: string) => (on === id ? 1 : 0.35);

  return (
    <div className="diagram bbody">
      <div className="bbody__grid">
        <div className="bbody__fig">
          <svg viewBox="0 0 300 330" role="img" aria-label="Chest with lungs, diaphragm, heart and vagus nerve, breathing in and out">
            <path d="M70 40c30-20 130-20 160 0l20 60 6 150c0 40-30 64-106 64S44 290 44 250l6-150Z" className="bbody__torso" />
            {/* Trachea */}
            <path d="M150 8 L150 70 M150 70 L118 96 M150 70 L182 96" stroke="rgba(240,232,214,0.45)" strokeWidth="7" strokeLinecap="round" fill="none" />
            {/* Lungs */}
            <motion.path d="M118 96c-30 4-52 40-54 96-1 26 6 42 22 44 18 2 34-6 44-20l4-110c0-6-6-10-16-10Z" fill="#f48fb1" initial={false}
              animate={{ scaleX: inhale ? 1.08 : 0.94, scaleY: inhale ? 1.06 : 0.95, opacity: hl("lungs") }} transition={{ duration: dur, ease: "easeInOut" }} style={{ transformOrigin: "130px 100px" }} />
            <motion.path d="M182 96c30 4 52 40 54 96 1 26-6 42-22 44-18 2-34-6-44-20l-4-110c0-6 6-10 16-10Z" fill="#f48fb1" initial={false}
              animate={{ scaleX: inhale ? 1.08 : 0.94, scaleY: inhale ? 1.06 : 0.95, opacity: hl("lungs") }} transition={{ duration: dur, ease: "easeInOut" }} style={{ transformOrigin: "170px 100px" }} />
            {/* Heart */}
            <motion.path d="M150 196c-8-12-28-12-28 4 0 14 20 24 28 32 8-8 28-18 28-32 0-16-20-16-28-4Z" fill="#e57373" initial={false}
              animate={{ scale: reduce ? 1 : [1, 1.08, 1], opacity: hl("heart") }} transition={{ duration: inhale ? 0.75 : 1.05, repeat: Infinity }} style={{ transformOrigin: "150px 210px" }} />
            {/* Vagus nerve */}
            <path d="M138 14 C 130 80, 128 150, 138 200 S 150 290, 140 320" fill="none" stroke="#8fd3ff" strokeWidth="3.5" strokeDasharray="2 5" strokeLinecap="round" opacity={hl("vagus")} />
            {/* Diaphragm */}
            <motion.path fill="none" stroke="#ffb38a" strokeWidth="7" strokeLinecap="round" initial={false}
              animate={{ d: inhale ? "M60 262 C 110 252, 190 252, 240 262" : "M60 262 C 100 214, 200 214, 240 262", opacity: hl("diaphragm") }}
              transition={{ duration: dur, ease: "easeInOut" }} />
            {/* Air arrows */}
            <motion.path d="M150 -10 L150 2" stroke="#fff" strokeWidth="3" initial={false} animate={{ opacity: inhale ? 0.8 : 0.2 }} />
          </svg>
          <motion.span className="bbody__phase" key={phase} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>{reduce ? "Breathe in 4, out 6" : inhale ? "Breathing in · diaphragm pulls down" : "Breathing out · diaphragm relaxes up"}</motion.span>
        </div>
        <div className="bbody__info">
          <div className="seg seg--wrap" role="group" aria-label="Body part">
            {PARTS.map((p) => <button key={p.id} className={on === p.id ? "is-on" : ""} aria-pressed={on === p.id} onClick={() => setOn(p.id)} style={{ "--c": p.color } as React.CSSProperties}>{p.name}</button>)}
          </div>
          <motion.div key={part.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} aria-live="polite">
            <h3 style={{ color: part.color }}>{part.name}</h3>
            <p>{part.body}</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Heart rate rides the breath                                         */
/* ------------------------------------------------------------------ */

/** Illustrative heart rate over 30 seconds at a given breathing rate. */
function hrSeries(breathsPerMin: number) {
  const period = 60 / breathsPerMin;
  // Slow breathing near 6/min gives the biggest swings (resonance).
  const amp = breathsPerMin <= 6.5 ? 11 : breathsPerMin <= 10 ? 7 : 3.5;
  const base = breathsPerMin <= 6.5 ? 64 : 68;
  return Array.from({ length: 151 }, (_, k) => {
    const t = k * 0.2;
    const ph = (t % period) / period;
    // Inhale is the first ~40% of the cycle; heart rate climbs during it and falls on the exhale.
    const v = base + amp * Math.sin(2 * Math.PI * (ph - 0.1));
    return { t, v, inhale: ph < 0.4 };
  });
}

export function HeartRhythm() {
  const [rate, setRate] = useState<15 | 6>(6);
  const [hover, setHover] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const data = useMemo(() => hrSeries(rate), [rate]);
  const W = 640, H = 240, L = 44, R = 14, T = 14, B = 36;
  const xs = (t: number) => L + (t / 30) * (W - L - R);
  const ys = (v: number) => T + (1 - (v - 50) / (80 - 50)) * (H - T - B);
  const d = data.map((p, k) => `${k ? "L" : "M"}${xs(p.t).toFixed(1)} ${ys(p.v).toFixed(1)}`).join(" ");
  // Inhale bands
  const bands: Array<[number, number]> = [];
  data.forEach((p, k) => {
    if (p.inhale && (k === 0 || !data[k - 1].inhale)) bands.push([p.t, p.t]);
    if (p.inhale && bands.length) bands[bands.length - 1][1] = p.t;
  });
  const vals = data.map((p) => p.v);
  const swing = Math.round(Math.max(...vals) - Math.min(...vals));
  const onMove = (e: React.PointerEvent) => {
    const r = svgRef.current!.getBoundingClientRect();
    const t = ((((e.clientX - r.left) / r.width) * W - L) / (W - L - R)) * 30;
    setHover(Math.max(0, Math.min(150, Math.round(t / 0.2))));
  };
  const hp = hover !== null ? data[hover] : null;

  return (
    <div className="diagram hrr">
      <div className="hrr__top">
        <div className="seg seg--wrap" role="group" aria-label="Breathing rate">
          <button className={rate === 15 ? "is-on" : ""} aria-pressed={rate === 15} onClick={() => setRate(15)}>Normal: 15 breaths a minute</button>
          <button className={rate === 6 ? "is-on" : ""} aria-pressed={rate === 6} onClick={() => setRate(6)}>Slow: 6 breaths a minute</button>
        </div>
        <motion.span key={rate} className="hrr__stat" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <strong>±{Math.round(swing / 2)}</strong> beats per minute swing
        </motion.span>
      </div>
      <div className="glucose__plot">
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="glucose__svg" role="img" aria-label={`Illustrative heart rate rising on each inhale and falling on each exhale at ${rate} breaths a minute`} onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
          {bands.map(([a, b], k) => <rect key={k} x={xs(a)} y={T} width={Math.max(1, xs(b) - xs(a))} height={H - T - B} className="hrr__band" />)}
          {[55, 65, 75].map((v) => (
            <g key={v}>
              <line x1={L} x2={W - R} y1={ys(v)} y2={ys(v)} className="glucose__grid" />
              <text x={L - 8} y={ys(v) + 4} textAnchor="end" className="glucose__tick">{v}</text>
            </g>
          ))}
          {[0, 10, 20, 30].map((t) => <text key={t} x={xs(t)} y={H - B + 18} textAnchor="middle" className="glucose__tick">{t}s</text>)}
          <text x={8} y={T + 4} className="glucose__tick">bpm</text>
          <motion.path key={rate} d={d} fill="none" stroke="#d0703a" strokeWidth="2" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, ease: "easeOut" }} />
          {hp && (
            <g pointerEvents="none">
              <line x1={xs(hp.t)} x2={xs(hp.t)} y1={T} y2={H - B} className="glucose__cross" />
              <circle cx={xs(hp.t)} cy={ys(hp.v)} r="5" fill="#d0703a" stroke="#141813" strokeWidth="2" />
            </g>
          )}
          <rect x={L} y={T} width={W - L - R} height={H - T - B} fill="transparent" />
        </svg>
        {hp && (
          <div className="glucose__tip" style={{ left: `${(xs(hp.t) / W) * 100}%` }} role="status">
            <strong>{hp.t.toFixed(1)} seconds</strong>
            <span><i style={{ background: "#d0703a" }} />Heart rate<b>{Math.round(hp.v)} bpm</b></span>
            <span><i style={{ background: "#8fd3ff" }} />{hp.inhale ? "Breathing in" : "Breathing out"}<b /></span>
          </div>
        )}
      </div>
      <p className="hrr__key"><i /> Shaded = breathing in. Heart rate climbs on each inhale and drops on each exhale.</p>
      <p className="diagram__text">
        An illustration, not real data. At around six breaths a minute, heart rate and breathing fall into step (resonance), and the swings get much
        bigger. Larger swings mean higher heart rate variability, a sign your relaxing rest-and-digest system is engaged. That's why the Settle in and
        Coherent breathing patterns use this pace.
      </p>
      <p className="nourish__src">
        <SourceLink s={{ text: "Lehrer P et al. Heart rate variability biofeedback improves emotional and physical health and performance. Appl Psychophysiol Biofeedback, 2020", url: "https://doi.org/10.1007/s10484-020-09466-z" }} />
      </p>
    </div>
  );
}
