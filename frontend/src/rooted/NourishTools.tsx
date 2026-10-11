import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PLATE, type PlateGroup } from "./nourishContent";
import { GLASS, todayKey, useNourish, useWater, useWaterGoal } from "../store/nourish";
import { useUser } from "../store/user";

/* ------------------------------------------------------------------ */
/* Plate builder                                                       */
/* ------------------------------------------------------------------ */

const R = 70;

function Ring({ shares, r, width, opacity = 1 }: { shares: Array<{ id: string; share: number; color: string }>; r: number; width: number; opacity?: number }) {
  const c = 2 * Math.PI * r;
  let at = 0;
  return (
    <g transform="rotate(-90 100 100)" opacity={opacity}>
      {shares.map((s) => {
        const len = s.share * c;
        const el = (
          <motion.circle
            key={s.id}
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={width}
            initial={false}
            animate={{ strokeDasharray: `${Math.max(0, len - (len > 2 ? 2 : 0))} ${c}`, strokeDashoffset: -at }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        );
        at += len;
        return el;
      })}
    </g>
  );
}

export function PlateBuilder() {
  const [plate, setPlate] = useState<Record<PlateGroup, string[]>>({ veg: [], fruit: [], grain: [], protein: [] });
  const total = Object.values(plate).reduce((a, b) => a + b.length, 0);
  const add = (g: PlateGroup, food: string) => setPlate((p) => (p[g].includes(food) ? { ...p, [g]: p[g].filter((f) => f !== food) } : { ...p, [g]: [...p[g], food] }));
  const mine = PLATE.map((g) => ({ id: g.id, color: g.color, share: total ? plate[g.id].length / total : 0 }));

  let feedback = "Tap foods to build a plate. The inner ring is your plate; the outer ring is the Healthy Eating Plate.";
  if (total >= 3) {
    const off = PLATE.map((g) => ({ g, d: plate[g.id].length / total - g.share })).sort((a, b) => Math.abs(b.d) - Math.abs(a.d))[0];
    if (Math.abs(off.d) < 0.1) feedback = "That's close to the Healthy Eating Plate. Nicely balanced.";
    else if (off.d < 0) feedback = `Add more ${off.g.name.toLowerCase()}. ${off.g.tip}`;
    else feedback = `Heavy on ${off.g.name.toLowerCase()}. Try trading some for vegetables.`;
  }

  return (
    <div className="plate r-card">
      <div className="plate__viz">
        <svg viewBox="0 0 200 200" role="img" aria-label="Your plate compared with the Healthy Eating Plate">
          <circle cx="100" cy="100" r="96" fill="#f3ead8" opacity="0.06" />
          <Ring shares={PLATE.map((g) => ({ id: g.id, color: g.color, share: g.share }))} r={90} width={6} opacity={0.55} />
          {total ? <Ring shares={mine} r={R / 1.35} width={R * 0.75} /> : <circle cx="100" cy="100" r={R / 1.35} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={R * 0.75} strokeDasharray="4 6" />}
          <circle cx="100" cy="100" r="22" fill="#141813" />
          <text x="100" y="104" textAnchor="middle" fontSize="12" fontWeight="800" fill="#e8d5b0">{total || ""}</text>
        </svg>
        <ul className="plate__legend">
          {PLATE.map((g) => (
            <li key={g.id}>
              <i style={{ background: g.color }} />
              <span>{g.name}</span>
              <b>{Math.round(g.share * 100)}%</b>
            </li>
          ))}
          <li><i style={{ background: "#6ec6ff" }} /><span>Water, tea or coffee to drink</span></li>
          <li><i style={{ background: "#c0ca33" }} /><span>Healthy oils, like olive oil</span></li>
        </ul>
      </div>
      <div className="plate__pick">
        {PLATE.map((g) => (
          <div key={g.id} className="plate__group">
            <h4 style={{ color: g.color }}>{g.name}</h4>
            <div className="plate__chips">
              {g.foods.map((f) => (
                <button key={f} className={`chip ${plate[g.id].includes(f) ? "is-on" : ""}`} aria-pressed={plate[g.id].includes(f)} onClick={() => add(g.id, f)}>
                  {f}
                </button>
              ))}
            </div>
          </div>
        ))}
        <AnimatePresence mode="wait">
          <motion.p key={feedback} className="plate__feedback" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} aria-live="polite">
            {feedback}
          </motion.p>
        </AnimatePresence>
        {total > 0 && <button className="btn btn--secondary btn--small" onClick={() => setPlate({ veg: [], fruit: [], grain: [], protein: [] })}>Start over</button>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Water tracker                                                       */
/* ------------------------------------------------------------------ */

function Glass({ fill }: { fill: number }) {
  const reduce = useReducedMotion();
  const top = 30 + (1 - fill) * 150;
  return (
    <svg className="glass" viewBox="0 0 140 200" role="img" aria-label={`${Math.round(fill * 100)}% of today's goal`}>
      <defs>
        <clipPath id="glass-clip"><path d="M18 20h104l-12 168a8 8 0 0 1-8 7H38a8 8 0 0 1-8-7Z" /></clipPath>
        <linearGradient id="water-g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#8fd3ff" /><stop offset="1" stopColor="#2f7fd8" /></linearGradient>
      </defs>
      <g clipPath="url(#glass-clip)">
        <rect x="0" y="0" width="140" height="200" fill="rgba(255,255,255,0.04)" />
        <motion.g initial={false} animate={{ y: top }} transition={{ type: "spring", stiffness: 60, damping: 14 }}>
          <motion.path
            d="M-140 6 Q-105 -4 -70 6 T0 6 T70 6 T140 6 T210 6 V220 H-140Z"
            fill="url(#water-g)"
            animate={reduce ? undefined : { x: [0, 70] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
          />
          <motion.path
            d="M-140 8 Q-105 16 -70 8 T0 8 T70 8 T140 8 T210 8 V220 H-140Z"
            fill="#5fb2f0"
            opacity="0.45"
            animate={reduce ? undefined : { x: [70, 0] }}
            transition={{ duration: 4.4, repeat: Infinity, ease: "linear" }}
          />
        </motion.g>
      </g>
      <path d="M18 20h104l-12 168a8 8 0 0 1-8 7H38a8 8 0 0 1-8-7Z" fill="none" stroke="rgba(240,232,214,0.55)" strokeWidth="3" />
      <path d="M30 34 26 120" stroke="rgba(255,255,255,0.25)" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function WaterTracker() {
  const water = useWater();
  const goal = useWaterGoal();
  const { addWater, setGoal } = useNourish();
  const pid = useUser((s) => s.activeProfileId) ?? "guest";
  const history = useNourish((s) => s.water[pid]) ?? {};
  const fill = Math.min(1, water / goal);
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const k = todayKey(d);
    return { k, ml: history[k] ?? 0, label: d.toLocaleDateString(undefined, { weekday: "narrow" }) };
  });

  return (
    <div className="water r-card">
      <div className="water__glass">
        <Glass fill={fill} />
        <div className="water__count" aria-live="polite">
          <strong>{(water / 1000).toFixed(2).replace(/0$/, "")} L</strong>
          <span>of {(goal / 1000).toFixed(1)} L from drinks today</span>
          {fill >= 1 && <motion.em initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="water__done">Goal reached</motion.em>}
        </div>
      </div>
      <div className="water__controls">
        <div className="water__btns">
          <motion.button whileTap={{ scale: 0.92 }} className="btn btn--primary" onClick={() => addWater(GLASS)}>+ Glass <small>250 ml</small></motion.button>
          <motion.button whileTap={{ scale: 0.92 }} className="btn btn--secondary" onClick={() => addWater(500)}>+ Bottle <small>500 ml</small></motion.button>
          <button className="btn btn--secondary btn--small" onClick={() => addWater(-GLASS)} disabled={water <= 0}>Undo a glass</button>
        </div>
        <label className="water__goal">
          <span>Daily goal from drinks <b>{(goal / 1000).toFixed(1)} L</b></span>
          <input type="range" min={1500} max={4000} step={100} value={goal} onChange={(e) => setGoal(+e.target.value)} aria-valuetext={`${goal / 1000} litres`} />
          <span className="water__presets">
            <button onClick={() => setGoal(2200)}>Women · 2.2 L</button>
            <button onClick={() => setGoal(3000)}>Men · 3.0 L</button>
          </span>
        </label>
        <div className="water__week" aria-label="Last 7 days">
          {week.map((d) => (
            <div key={d.k} className="water__day" title={`${d.k}: ${(d.ml / 1000).toFixed(1)} L`}>
              <span className="water__bar"><motion.i initial={false} animate={{ height: `${Math.min(100, (d.ml / goal) * 100)}%` }} /></span>
              <small>{d.label}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
