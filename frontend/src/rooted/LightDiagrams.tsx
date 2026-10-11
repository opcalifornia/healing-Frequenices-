import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * How light sets your body clock: eye → retina's melanopsin cells →
 * the suprachiasmatic nucleus (the master clock) → pineal gland → melatonin.
 */
export function ClockPathway() {
  const [night, setNight] = useState(false);
  const reduce = useReducedMotion();
  const steps = night
    ? [
        { n: 1, t: "Little light reaches the eye", d: "In darkness, the special light-sensing cells in your retina go quiet." },
        { n: 2, t: "The master clock signals night", d: "Your suprachiasmatic nucleus (SCN), a tiny cluster of about 20,000 neurons above where the optic nerves cross, stops sending its 'daytime' signal." },
        { n: 3, t: "Melatonin rises", d: "The pineal gland releases melatonin, the hormone that tells every organ it's night and helps you feel sleepy." },
      ]
    : [
        { n: 1, t: "Light hits special cells in the retina", d: "Besides rods and cones, about 1 to 2% of retinal cells contain melanopsin. They respond most to blue light around 480 nm, and their job is telling time, not seeing." },
        { n: 2, t: "The signal goes to your master clock", d: "They send it straight to the suprachiasmatic nucleus (SCN), which keeps the timing for your whole body: sleep, hormones, temperature and digestion." },
        { n: 3, t: "Melatonin is switched off", d: "The SCN tells the pineal gland to stop releasing melatonin, so you feel alert. Bright light at night does this too, which is why it can delay sleep." },
      ];
  const beam = night ? "rgba(120,130,200,0.25)" : "#ffe082";
  return (
    <div className="diagram light-dia">
      <div className="seg seg--wrap" role="group" aria-label="Time of day">
        <button className={!night ? "is-on" : ""} aria-pressed={!night} onClick={() => setNight(false)}>Daytime light</button>
        <button className={night ? "is-on" : ""} aria-pressed={night} onClick={() => setNight(true)}>Dark night</button>
      </div>
      <svg viewBox="0 0 640 260" className="light-dia__svg" role="img" aria-label={night ? "In darkness the clock lets melatonin rise" : "Light travels from the eye to the brain's clock and switches melatonin off"}>
        <defs>
          <radialGradient id="ld-sun"><stop offset="0" stopColor="#fff8e1" /><stop offset="1" stopColor="#ffb300" stopOpacity="0" /></radialGradient>
          <linearGradient id="ld-head" x1="0" x2="1"><stop offset="0" stopColor="#2a2f3a" /><stop offset="1" stopColor="#1a1d24" /></linearGradient>
        </defs>
        {/* Light source */}
        <circle cx="50" cy="110" r={night ? 16 : 40} fill={night ? "#3949ab" : "url(#ld-sun)"} opacity={night ? 0.5 : 1} />
        {night ? <path d="M58 98a16 16 0 1 1-16 22 13 13 0 0 0 16-22Z" fill="#c5cae9" /> : null}
        {/* Head profile */}
        <path d="M200 230c-10-40-18-60-16-96 2-52 44-96 112-96 76 0 132 50 132 120 0 38-14 56-30 70l6 36H292l-6-26c-30 4-56-2-70-10l-16 2Z" fill="url(#ld-head)" stroke="rgba(255,255,255,0.15)" />
        {/* Eye */}
        <ellipse cx="214" cy="118" rx="14" ry="9" fill="#fff" opacity="0.9" />
        <circle cx="210" cy="118" r="5" fill="#263238" />
        {/* Beam into eye and along the optic path */}
        <motion.path d="M90 112 L204 118" stroke={beam} strokeWidth="6" strokeLinecap="round" initial={false} animate={{ opacity: night ? 0.2 : 1 }} />
        <motion.path d="M226 120 C 260 128, 300 132, 330 130" fill="none" stroke={beam} strokeWidth="4" strokeDasharray="6 8" initial={false} animate={reduce ? {} : { strokeDashoffset: [0, -28] }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }} opacity={night ? 0.25 : 1} />
        {/* SCN */}
        <circle cx="336" cy="130" r="11" fill={night ? "#5c6bc0" : "#ffca28"} />
        <text x="336" y="160" textAnchor="middle" className="light-dia__label">SCN (master clock)</text>
        {/* Path to pineal */}
        <path d="M346 126 C 380 110, 400 100, 404 96" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeDasharray="3 5" />
        <circle cx="408" cy="94" r="9" fill="#ab47bc" />
        <text x="408" y="76" textAnchor="middle" className="light-dia__label">Pineal gland</text>
        {/* Melatonin dots */}
        {Array.from({ length: 10 }, (_, i) => (
          <motion.circle key={i} r="3.5" fill="#ce93d8" initial={false}
            animate={night && !reduce ? { cx: [408, 470 + (i % 5) * 26], cy: [94, 60 + Math.floor(i / 5) * 40], opacity: [0, 1, 0] } : { cx: 408, cy: 94, opacity: 0 }}
            transition={{ duration: 3, repeat: night ? Infinity : 0, delay: i * 0.3 }} />
        ))}
        <text x="560" y="190" textAnchor="middle" className="light-dia__label light-dia__label--big" fill={night ? "#ce93d8" : "#9e9e9e"}>Melatonin {night ? "rising" : "switched off"}</text>
        <text x="50" y="180" textAnchor="middle" className="light-dia__label">{night ? "Darkness" : "Daylight"}</text>
      </svg>
      <ol className="light-dia__steps">
        <AnimatePresence mode="wait">
          {steps.map((s) => (
            <motion.li key={`${night}-${s.n}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: s.n * 0.08 }}>
              <span>{s.n}</span><div><strong>{s.t}</strong><p>{s.d}</p></div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>
    </div>
  );
}

const DEPTHS = [
  { id: "uvb", name: "UVB", color: "#8e24aa", depth: 0.12, note: "Mostly stopped in the outer skin (epidermis). Causes sunburn and makes vitamin D." },
  { id: "uva", name: "UVA", color: "#7e57c2", depth: 0.35, note: "Reaches the dermis, where collagen lives. Drives skin aging and contributes to skin cancer." },
  { id: "blue", name: "Blue", color: "#2979ff", depth: 0.42, note: "Reaches the upper dermis. Used medically, with a light-activated cream, for some skin conditions." },
  { id: "red", name: "Red", color: "#e53935", depth: 0.65, note: "Penetrates a few millimeters, into the dermis. This is what red light therapy relies on." },
  { id: "nir", name: "Near-infrared", color: "#b71c1c", depth: 0.92, note: "Goes deepest, potentially reaching tissue under the skin. Studied for pain and healing." },
];

/** Approximate penetration depth of each band into skin. */
export function SkinDepth() {
  const [on, setOn] = useState("red");
  const b = DEPTHS.find((d) => d.id === on)!;
  const W = 640;
  const top = 40;
  const H = 200;
  const layers = [
    { name: "Epidermis", h: 0.18, c: "#e8b896" },
    { name: "Dermis", h: 0.42, c: "#d98b7a" },
    { name: "Fat (subcutis)", h: 0.4, c: "#f3d9a4" },
  ];
  let y = top;
  return (
    <div className="diagram light-dia">
      <div className="seg seg--wrap" role="group" aria-label="Type of light">
        {DEPTHS.map((d) => <button key={d.id} className={on === d.id ? "is-on" : ""} aria-pressed={on === d.id} onClick={() => setOn(d.id)}>{d.name}</button>)}
      </div>
      <svg viewBox={`0 0 ${W} ${top + H + 20}`} className="light-dia__svg" role="img" aria-label={`${b.name} light reaching into the skin`}>
        {layers.map((l) => {
          const h = l.h * H;
          const el = (
            <g key={l.name}>
              <rect x="120" y={y} width={W - 140} height={h} fill={l.c} opacity="0.85" />
              <text x="110" y={y + h / 2 + 4} textAnchor="end" className="light-dia__label">{l.name}</text>
            </g>
          );
          y += h;
          return el;
        })}
        {DEPTHS.map((d, i) => {
          const x0 = 170 + i * 95;
          const active = d.id === on;
          return (
            <g key={d.id} opacity={active ? 1 : 0.25}>
              <motion.rect x={x0} y={top} width="34" rx="6" fill={d.color} initial={false} animate={{ height: d.depth * H }} transition={{ type: "spring", stiffness: 120, damping: 18 }} style={{ filter: active ? `drop-shadow(0 0 8px ${d.color})` : undefined }} />
              <path d={`M${x0 + 17} 4 L${x0 + 17} ${top - 6}`} stroke={d.color} strokeWidth="3" markerEnd="" />
              <path d={`M${x0 + 10} ${top - 14} L${x0 + 17} ${top - 4} L${x0 + 24} ${top - 14}`} fill="none" stroke={d.color} strokeWidth="3" />
              <text x={x0 + 17} y={top + d.depth * H + 16} textAnchor="middle" className="light-dia__label">{d.name}</text>
            </g>
          );
        })}
      </svg>
      <AnimatePresence mode="wait">
        <motion.p key={b.id} className="diagram__text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><strong style={{ color: b.color }}>{b.name}.</strong> {b.note}</motion.p>
      </AnimatePresence>
      <p className="diagram__text light-dia__fine">Depths are approximate and vary with skin type and wavelength. Longer wavelengths generally travel deeper.</p>
    </div>
  );
}
