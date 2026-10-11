import { motion } from "framer-motion";

export type Muscle = "neck" | "shoulders" | "chest" | "upperBack" | "arms" | "core" | "lowerBack" | "hips" | "glutes" | "quads" | "hamstrings" | "calves";

export const MUSCLE_LABEL: Record<Muscle, string> = {
  neck: "Neck", shoulders: "Shoulders", chest: "Chest", upperBack: "Upper back", arms: "Arms and wrists", core: "Core",
  lowerBack: "Lower back", hips: "Hips", glutes: "Glutes", quads: "Front of thighs", hamstrings: "Back of thighs", calves: "Calves and ankles",
};

/** Simple regions on a front and back silhouette (each 120 x 250). */
const FRONT: Partial<Record<Muscle, string[]>> = {
  neck: ["M53 38h14v10H53z"],
  shoulders: ["M36 52c4-6 10-7 16-6l-2 10c-6 0-10 1-14-4Z", "M84 52c-4-6-10-7-16-6l2 10c6 0 10 1 14-4Z"],
  chest: ["M46 56h28v16c-9 4-19 4-28 0Z"],
  arms: ["M32 58l-6 34 6 2 8-32Z", "M88 58l6 34-6 2-8-32Z", "M26 94l-4 22 5 1 5-22Z", "M94 94l4 22-5 1-5-22Z"],
  core: ["M47 74c9 3 17 3 26 0v30c-8 4-18 4-26 0Z"],
  hips: ["M44 106c5 4 11 6 16 6s11-2 16-6l2 10H42Z"],
  quads: ["M43 118h15l-2 46h-11Z", "M62 118h15l-2 46H64Z"],
  calves: ["M45 172h10l-1 46h-8Z", "M65 172h10l-1 46h-8Z"],
};
const BACK: Partial<Record<Muscle, string[]>> = {
  neck: ["M53 38h14v12H53z"],
  shoulders: ["M36 52c4-6 10-7 16-6l-2 10c-6 0-10 1-14-4Z", "M84 52c-4-6-10-7-16-6l2 10c6 0 10 1 14-4Z"],
  upperBack: ["M46 54h28l-2 26H48Z"],
  arms: ["M32 58l-6 34 6 2 8-32Z", "M88 58l6 34-6 2-8-32Z"],
  lowerBack: ["M48 82h24l2 22H46Z"],
  glutes: ["M44 106h32l2 16c-6 4-12 4-17 0-5 4-12 4-18 0Z"],
  hamstrings: ["M43 124h15l-2 40h-11Z", "M62 124h15l-2 40H64Z"],
  calves: ["M45 172h10l-1 46h-8Z", "M65 172h10l-1 46h-8Z"],
};
const OUTLINE = "M60 6c9 0 15 7 15 16s-6 16-15 16-15-7-15-16 6-16 15-16Zm-8 34h16v6c10 0 18 2 22 8l6 40 4 24-6 2-6-22-6-28-2 38 4 12 1 54 2 50h-12l-4-50-4-40h-4l-4 40-4 50H40l2-50 1-54 4-12-2-38-6 28-6 22-6-2 4-24 6-40c4-6 12-8 22-8Z";

function Body({ regions, on, label, color }: { regions: Partial<Record<Muscle, string[]>>; on: Set<Muscle>; label: string; color: string }) {
  return (
    <figure className="mmap__fig">
      <svg viewBox="0 0 120 250" aria-hidden="true">
        <path d={OUTLINE} className="mmap__outline" />
        {(Object.entries(regions) as Array<[Muscle, string[]]>).map(([m, ds]) =>
          ds.map((d, i) => (
            <motion.path key={`${m}-${i}`} d={d} initial={false} animate={{ fill: on.has(m) ? color : "rgba(240,232,214,0.08)", opacity: on.has(m) ? 0.95 : 1 }} transition={{ duration: 0.45 }} style={{ filter: on.has(m) ? `drop-shadow(0 0 6px ${color})` : undefined }} />
          )),
        )}
      </svg>
      <figcaption>{label}</figcaption>
    </figure>
  );
}

/** Front and back bodies with the worked muscles lit up. */
export function MuscleMap({ muscles, color = "#ffb38a" }: { muscles: Muscle[]; color?: string }) {
  const on = new Set(muscles);
  return (
    <div className="mmap" role="img" aria-label={`Works: ${muscles.map((m) => MUSCLE_LABEL[m]).join(", ")}`}>
      <Body regions={FRONT} on={on} label="Front" color={color} />
      <Body regions={BACK} on={on} label="Back" color={color} />
    </div>
  );
}

/** What each routine works, and what it's good for. */
export const ROUTINE_MUSCLES: Record<string, { muscles: Muscle[]; goodFor: string[] }> = {
  walk: { muscles: ["quads", "hamstrings", "glutes", "calves", "core"], goodFor: ["Blood sugar after meals", "Heart health", "Mood"] },
  wake: { muscles: ["neck", "shoulders", "core", "hips", "hamstrings", "calves", "lowerBack"], goodFor: ["Morning stiffness", "Mobility", "Feeling awake"] },
  desk: { muscles: ["neck", "shoulders", "chest", "upperBack", "arms", "lowerBack", "hips"], goodFor: ["Sitting all day", "Neck and shoulder tension", "Wrist strain"] },
  yoga: { muscles: ["shoulders", "upperBack", "core", "lowerBack", "hips", "glutes", "hamstrings", "quads", "calves"], goodFor: ["Back pain", "Flexibility", "Stress"] },
  bedtime: { muscles: ["hips", "glutes", "lowerBack", "hamstrings", "upperBack"], goodFor: ["Winding down", "Hip and back tightness", "Sleep"] },
  taichi: { muscles: ["quads", "glutes", "calves", "core", "shoulders"], goodFor: ["Balance and falls", "Calm focus", "Leg strength"] },
  brocades: { muscles: ["shoulders", "arms", "upperBack", "core", "quads", "neck"], goodFor: ["Posture", "Energy", "Gentle strength"] },
};
