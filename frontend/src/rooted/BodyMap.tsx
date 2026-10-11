import { motion } from "framer-motion";
import type { Strength } from "../learn/brainContent";
import { Evidence } from "./ui";

export type Area = "brain" | "immune" | "heart" | "gut" | "sugar" | "joints";

const AREAS: Record<Area, { label: string; x: number; y: number }> = {
  brain: { label: "Mood, calm and sleep", x: 60, y: 22 },
  immune: { label: "Colds, coughs and allergies", x: 60, y: 46 },
  heart: { label: "Heart, blood pressure and cholesterol", x: 68, y: 72 },
  gut: { label: "Digestion and gut health", x: 60, y: 102 },
  sugar: { label: "Blood sugar", x: 46, y: 92 },
  joints: { label: "Joints and pain", x: 50, y: 170 },
};

/** Where each Pantry item has human evidence, and how strong it is. Only areas backed by the item's research notes. */
export const PANTRY_AREAS: Record<string, Partial<Record<Area, Strength>>> = {
  "burdock-root": { gut: "Weak" }, ginger: { gut: "Moderate", joints: "Weak" }, turmeric: { joints: "Mixed" }, garlic: { heart: "Mixed" },
  cinnamon: { sugar: "Mixed" }, nettle: { immune: "Weak" }, tulsi: { brain: "Weak" }, moringa: { sugar: "Weak" }, ashwagandha: { brain: "Mixed" },
  elderberry: { immune: "Weak" }, chamomile: { brain: "Weak" }, peppermint: { gut: "Moderate" }, "green-tea": { brain: "Mixed", heart: "Mixed" },
  hibiscus: { heart: "Mixed" }, "lemon-balm": { brain: "Weak" }, valerian: { brain: "Mixed" }, "leafy-greens": { heart: "Moderate" },
  spinach: { heart: "Moderate" }, beets: { heart: "Moderate" }, "sweet-potato": { gut: "Moderate" }, blueberries: { heart: "Moderate", sugar: "Moderate" },
  avocado: { heart: "Moderate" }, shiitake: { immune: "Weak" }, oats: { heart: "Strong", sugar: "Moderate", gut: "Moderate" }, barley: { heart: "Strong" },
  quinoa: { gut: "Moderate" }, lentils: { heart: "Strong", gut: "Moderate", sugar: "Moderate" }, chickpeas: { heart: "Strong", gut: "Moderate" },
  "black-beans": { heart: "Strong", gut: "Moderate" }, walnuts: { heart: "Moderate" }, almonds: { heart: "Moderate" }, chia: { gut: "Moderate" },
  flaxseed: { heart: "Moderate" }, evoo: { heart: "Strong" }, acv: { sugar: "Weak" }, yogurt: { gut: "Moderate", sugar: "Weak" },
  kefir: { gut: "Weak" }, kimchi: { gut: "Weak" }, sauerkraut: { gut: "Weak" }, miso: { gut: "Weak" }, kombucha: { gut: "Weak" },
  salmon: { heart: "Moderate" }, sardines: { heart: "Moderate" }, "raw-honey": { immune: "Moderate" }, "dark-chocolate": { heart: "Mixed" },
};

const COLOR: Record<Strength, string> = { Strong: "#9cdb8f", Moderate: "#cfe3a0", Mixed: "#ffc857", Weak: "#b0bec5", None: "#ff8a80" };
const OUTLINE = "M60 6c9 0 15 7 15 16s-6 16-15 16-15-7-15-16 6-16 15-16Zm-8 34h16v6c10 0 18 2 22 8l6 40 4 24-6 2-6-22-6-28-2 38 4 12 1 54 2 50h-12l-4-50-4-40h-4l-4 40-4 50H40l2-50 1-54 4-12-2-38-6 28-6 22-6-2 4-24 6-40c4-6 12-8 22-8Z";

/** A body with the areas this food or herb may help lit up by evidence strength. */
export function BodyMap({ id }: { id: string }) {
  const areas = PANTRY_AREAS[id];
  if (!areas || !Object.keys(areas).length) return null;
  const list = Object.entries(areas) as Array<[Area, Strength]>;
  return (
    <div className="bmap">
      <svg viewBox="0 0 120 250" className="bmap__fig" role="img" aria-label={`Where the research points: ${list.map(([a]) => AREAS[a].label).join(", ")}`}>
        <path d={OUTLINE} className="mmap__outline" />
        {(Object.keys(AREAS) as Area[]).map((a) => {
          const s = areas[a];
          const { x, y } = AREAS[a];
          return (
            <g key={a}>
              {s && <motion.circle cx={x} cy={y} r="10" fill={COLOR[s]} initial={{ opacity: 0.5, scale: 0.6 }} animate={{ opacity: [0.5, 0.12, 0.5], scale: [1, 1.6, 1] }} transition={{ duration: 2.6, repeat: Infinity }} style={{ transformOrigin: `${x}px ${y}px` }} />}
              <circle cx={x} cy={y} r={s ? 5.5 : 3} fill={s ? COLOR[s] : "rgba(240,232,214,0.18)"} stroke="#141813" strokeWidth="1.5" />
            </g>
          );
        })}
      </svg>
      <ul className="bmap__list">
        {list.map(([a, s]) => (
          <li key={a}><i style={{ background: COLOR[s] }} /><span>{AREAS[a].label}</span><Evidence s={s} short /></li>
        ))}
      </ul>
    </div>
  );
}
