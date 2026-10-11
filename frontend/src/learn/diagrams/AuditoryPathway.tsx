import { useId, useState } from "react";
import { useReducedMotion } from "framer-motion";

/** Schematic of the ascending hearing pathway, with signals travelling from both ears. */

type NodeId = "ear" | "cn" | "soc" | "ic" | "mgn" | "ac";

const STEPS: Array<{ id: NodeId; name: string; text: string }> = [
  { id: "ear", name: "1 · Cochlea (inner ear)", text: "About 3,500 inner hair cells turn vibration into nerve signals. Low tones like our 100–400 Hz carriers are encoded partly by timing: nerve fibres fire locked to each cycle of the wave." },
  { id: "cn", name: "2 · Cochlear nucleus", text: "The first relay in the brainstem. Each side still only knows about its own ear here." },
  { id: "soc", name: "3 · Superior olivary complex", text: "Where the two ears meet for the first time. Its neurons compare arrival times between ears down to a few millionths of a second, which is how you locate sounds. With 200 Hz in one ear and 210 Hz in the other, the timing difference slides through a full cycle 10 times a second. Neurons tracking that difference fire in a 10 Hz rhythm: the binaural beat." },
  { id: "ic", name: "4 · Inferior colliculus (midbrain)", text: "A major hub that combines timing, loudness and pitch cues. Responses at the beat frequency can still be recorded here." },
  { id: "mgn", name: "5 · Thalamus (medial geniculate)", text: "The gateway to the cortex. The thalamus also helps set your overall arousal and sleep state." },
  { id: "ac", name: "6 · Auditory cortex, both hemispheres", text: "On the upper surface of each temporal lobe. EEG picks up a 'frequency-following' response at the beat rate, strongest over these hearing areas. Whether it spreads to change the rest of the brain's rhythm is the open question." },
];

const P = {
  earL: [40, 392], earR: [360, 392],
  cnL: [110, 340], cnR: [290, 340],
  socL: [168, 282], socR: [232, 282],
  icL: [150, 205], icR: [250, 205],
  mgnL: [128, 132], mgnR: [272, 132],
  acL: [78, 54], acR: [322, 54],
} as const;

type Key = keyof typeof P;
const line = (a: Key, b: Key, bend = 0) => {
  const [x1, y1] = P[a];
  const [x2, y2] = P[b];
  const mx = (x1 + x2) / 2 + bend;
  const my = (y1 + y2) / 2;
  return `M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`;
};

const EDGES: Array<{ id: string; d: string; tone: "L" | "R" | "beat"; crossed?: boolean }> = [
  { id: "eL", d: line("earL", "cnL"), tone: "L" },
  { id: "eR", d: line("earR", "cnR"), tone: "R" },
  { id: "cLsL", d: line("cnL", "socL"), tone: "L" },
  { id: "cLsR", d: line("cnL", "socR", 10), tone: "L", crossed: true },
  { id: "cRsR", d: line("cnR", "socR"), tone: "R" },
  { id: "cRsL", d: line("cnR", "socL", -10), tone: "R", crossed: true },
  { id: "sLiL", d: line("socL", "icL"), tone: "beat" },
  { id: "sRiR", d: line("socR", "icR"), tone: "beat" },
  { id: "iLmL", d: line("icL", "mgnL"), tone: "beat" },
  { id: "iRmR", d: line("icR", "mgnR"), tone: "beat" },
  { id: "mLaL", d: line("mgnL", "acL"), tone: "beat" },
  { id: "mRaR", d: line("mgnR", "acR"), tone: "beat" },
];

const NODES: Array<{ key: Key; step: NodeId; label?: string }> = [
  { key: "earL", step: "ear", label: "Left ear" }, { key: "earR", step: "ear", label: "Right ear" },
  { key: "cnL", step: "cn" }, { key: "cnR", step: "cn" },
  { key: "socL", step: "soc" }, { key: "socR", step: "soc" },
  { key: "icL", step: "ic" }, { key: "icR", step: "ic" },
  { key: "mgnL", step: "mgn" }, { key: "mgnR", step: "mgn" },
  { key: "acL", step: "ac", label: "Left auditory cortex" }, { key: "acR", step: "ac", label: "Right auditory cortex" },
];

const COLORS = { L: "#8b6cff", R: "#19e3c4", beat: "#ffc857" };

export function AuditoryPathway() {
  const [active, setActive] = useState<NodeId>("soc");
  const reduce = useReducedMotion();
  const uid = useId().replace(/:/g, "");
  const step = STEPS.find((s) => s.id === active)!;

  return (
    <div className="diagram diagram--split">
      <svg viewBox="0 0 400 420" className="pathway" role="img" aria-label="The hearing pathway from both ears up to the auditory cortex in both hemispheres">
        {EDGES.map((e) => (
          <path key={e.id} id={`${uid}-${e.id}`} d={e.d} className={`pathway__edge ${e.crossed ? "is-crossed" : ""}`} stroke={COLORS[e.tone]} />
        ))}
        {!reduce &&
          EDGES.map((e, i) => (
            <circle key={`dot-${e.id}`} r="4" fill={COLORS[e.tone]} className="pathway__dot">
              <animateMotion dur={e.tone === "beat" ? "2.4s" : "1.6s"} begin={`${(i % 4) * 0.35}s`} repeatCount="indefinite">
                <mpath href={`#${uid}-${e.id}`} />
              </animateMotion>
            </circle>
          ))}
        {/* Brainstem band */}
        <rect x="120" y="250" width="160" height="70" rx="20" className="pathway__zone" />
        <text x="200" y="338" textAnchor="middle" className="diagram__axis">brainstem</text>
        <text x="200" y="20" textAnchor="middle" className="diagram__axis">cortex</text>

        {NODES.map((n) => {
          const [x, y] = P[n.key];
          const on = active === n.step;
          return (
            <g
              key={n.key}
              className={`pathway__node ${on ? "is-on" : ""} ${n.step === "soc" ? "is-soc" : ""}`}
              role="button"
              tabIndex={0}
              aria-label={STEPS.find((s) => s.id === n.step)!.name}
              aria-pressed={on}
              onClick={() => setActive(n.step)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setActive(n.step))}
            >
              <circle cx={x} cy={y} r={n.step === "ear" ? 15 : 11} />
              {n.step === "ear" && <text x={x} y={y + 5} textAnchor="middle" className="pathway__ear">{n.key === "earL" ? "L" : "R"}</text>}
              {n.label && n.step === "ac" && <text x={x} y={y - 18} textAnchor="middle" className="pathway__label">{n.label}</text>}
            </g>
          );
        })}
        <text x={P.earL[0]} y={P.earL[1] + 26} textAnchor="middle" className="diagram__tone" fill={COLORS.L}>200 Hz</text>
        <text x={P.earR[0]} y={P.earR[1] + 26} textAnchor="middle" className="diagram__tone" fill={COLORS.R}>210 Hz</text>
        <text x="200" y="244" textAnchor="middle" className="diagram__tone" fill={COLORS.beat}>10 Hz beat created here</text>
      </svg>
      <div className="steps">
        <ol className="steps__list">
          {STEPS.map((s) => (
            <li key={s.id}>
              <button className={`steps__btn ${active === s.id ? "is-on" : ""}`} onClick={() => setActive(s.id)} aria-pressed={active === s.id}>
                {s.name}
              </button>
            </li>
          ))}
        </ol>
        <p className="diagram__text" aria-live="polite">{step.text}</p>
        <div className="legend">
          <span><i style={{ background: COLORS.L }} /> left-ear tone</span>
          <span><i style={{ background: COLORS.R }} /> right-ear tone</span>
          <span><i style={{ background: COLORS.beat }} /> beat signal</span>
        </div>
      </div>
    </div>
  );
}
