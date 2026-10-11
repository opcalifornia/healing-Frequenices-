import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SourceLink } from "./ui";

const STATES = {
  stress: {
    name: "Stress response", color: "#ff8a80",
    path: "Brain senses threat → hypothalamus → pituitary → adrenal glands release adrenaline and cortisol",
    effects: [
      ["Heart", "Beats faster and harder"],
      ["Breathing", "Quick and shallow, high in the chest"],
      ["Muscles", "Tense, ready to move"],
      ["Digestion", "Slows down; blood goes to muscles"],
      ["Blood sugar", "Rises for quick energy"],
      ["Mind", "Narrow focus, scanning for danger"],
    ],
    note: "Helpful for a real emergency. Harmful when it stays switched on for weeks: linked to poor sleep, high blood pressure and low mood.",
  },
  calm: {
    name: "Relaxation response", color: "#8fd3ff",
    path: "Slow breathing and meditation → the vagus nerve signals safety → rest-and-digest takes over",
    effects: [
      ["Heart", "Slows, with more variability"],
      ["Breathing", "Slow and deep, from the belly"],
      ["Muscles", "Soften and release"],
      ["Digestion", "Switches back on"],
      ["Blood pressure", "Eases down"],
      ["Mind", "Wider, calmer attention"],
    ],
    note: "Herbert Benson at Harvard named it the 'relaxation response' in the 1970s: the opposite of fight-or-flight, and something you can practice on purpose.",
  },
} as const;

export function StressDiagram() {
  const [mode, setMode] = useState<keyof typeof STATES>("stress");
  const reduce = useReducedMotion();
  const st = STATES[mode];
  const stress = mode === "stress";
  const beat = stress ? 0.45 : 1.1;
  return (
    <div className="diagram stressd">
      <div className="seg seg--wrap" role="group" aria-label="Response">
        <button className={stress ? "is-on" : ""} aria-pressed={stress} onClick={() => setMode("stress")}>Stressed</button>
        <button className={!stress ? "is-on" : ""} aria-pressed={!stress} onClick={() => setMode("calm")}>Calm</button>
      </div>
      <div className="stressd__grid">
        <svg viewBox="0 0 240 300" className="stressd__svg" role="img" aria-label={st.path}>
          <path d="M120 10c18 0 30 13 30 30s-12 32-30 32-30-14-30-32 12-30 30-30Zm-22 70h44c30 0 44 16 46 40l6 120c0 20-14 40-30 50H76c-16-10-30-30-30-50l6-120c2-24 16-40 46-40Z" className="mmap__outline" />
          {/* Hypothalamus / pituitary */}
          <circle cx="120" cy="40" r="6" fill={stress ? "#ff8a80" : "rgba(240,232,214,0.25)"} />
          {/* HPA arrow down to adrenals */}
          <motion.path d="M120 48 C 132 90, 140 150, 140 186" fill="none" stroke="#ff8a80" strokeWidth="2.5" strokeDasharray="5 6" initial={false} animate={{ opacity: stress ? 1 : 0.12, strokeDashoffset: reduce || !stress ? 0 : [0, -22] }} transition={{ strokeDashoffset: { duration: 1, repeat: Infinity, ease: "linear" } }} />
          {/* Adrenal glands */}
          <path d="M132 186l8-8 8 8-8 6Z" fill={stress ? "#ffb74d" : "rgba(240,232,214,0.2)"} />
          <path d="M92 186l8-8 8 8-8 6Z" fill={stress ? "#ffb74d" : "rgba(240,232,214,0.2)"} />
          {/* Vagus nerve */}
          <motion.path d="M112 44 C 100 100, 104 150, 110 230" fill="none" stroke="#8fd3ff" strokeWidth="2.5" strokeDasharray="5 6" initial={false} animate={{ opacity: stress ? 0.12 : 1, strokeDashoffset: reduce || stress ? 0 : [0, 22] }} transition={{ strokeDashoffset: { duration: 1.6, repeat: Infinity, ease: "linear" } }} />
          {/* Lungs */}
          <motion.g initial={false} animate={reduce ? {} : { scale: stress ? [1, 1.04, 1] : [1, 1.1, 1] }} transition={{ duration: stress ? 1.6 : 6, repeat: Infinity }} style={{ transformOrigin: "120px 130px" }}>
            <path d="M104 100c-16 4-28 24-28 50 0 14 6 22 16 22 10 0 16-6 18-14l2-50c0-6-4-9-8-8Z" fill="#f48fb1" opacity="0.55" />
            <path d="M136 100c16 4 28 24 28 50 0 14-6 22-16 22-10 0-16-6-18-14l-2-50c0-6 4-9 8-8Z" fill="#f48fb1" opacity="0.55" />
          </motion.g>
          {/* Heart */}
          <motion.path d="M126 150c-5-8-18-8-18 2 0 9 13 15 18 20 5-5 18-11 18-20 0-10-13-10-18-2Z" fill="#e57373" initial={false} animate={reduce ? {} : { scale: [1, 1.18, 1] }} transition={{ duration: beat, repeat: Infinity }} style={{ transformOrigin: "126px 160px" }} />
          {/* Gut */}
          <motion.path d="M96 210c10-6 38-6 48 0s0 12-24 12-34 6-24 12 38 6 48 0" fill="none" stroke="#7cb342" strokeWidth="6" strokeLinecap="round" initial={false} animate={{ opacity: stress ? 0.25 : 0.9 }} />
          <text x="120" y="292" textAnchor="middle" className="light-dia__label" fill={st.color}>{st.name}</text>
        </svg>
        <div className="stressd__info">
          <motion.p key={mode} className="stressd__path" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} style={{ borderColor: st.color }}>{st.path}</motion.p>
          <ul className="stressd__effects">
            {st.effects.map(([k, v], i) => (
              <motion.li key={`${mode}-${k}`} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <strong style={{ color: st.color }}>{k}</strong><span>{v}</span>
              </motion.li>
            ))}
          </ul>
          <p className="diagram__text">{st.note}</p>
        </div>
      </div>
      <SourceLink s={{ text: "Harvard Health: Understanding the stress response", url: "https://www.health.harvard.edu/staying-healthy/understanding-the-stress-response" }} />
    </div>
  );
}
