import { motion, useReducedMotion } from "framer-motion";
import { POSES, type Joint, type PoseName } from "./poses";

const BONES: Array<[Joint, Joint]> = [
  ["neck", "mid"], ["mid", "hip"],
  ["neck", "le"], ["le", "lh"], ["neck", "re"], ["re", "rh"],
  ["hip", "lk"], ["lk", "lf"], ["hip", "rk"], ["rk", "rf"],
];
// Far-side limbs are drawn dimmer so the figure reads with depth.
const FAR = new Set(["neck-re", "re-rh", "hip-rk", "rk-rf"]);

/** An animated stick figure moving between two poses. */
export function Figure({ a, b, period = 6, mirror = false, className = "" }: { a: PoseName; b?: PoseName; period?: number; mirror?: boolean; className?: string }) {
  const reduce = useReducedMotion();
  const A = POSES[a];
  const B = POSES[b ?? a];
  const loop = !reduce && b && b !== a;
  const tr = loop ? { duration: period, repeat: Infinity, ease: "easeInOut" as const } : { duration: 0.6, ease: "easeInOut" as const };
  const v = (k: Joint, i: 0 | 1) => (loop ? [A[k][i], B[k][i], A[k][i]] : A[k][i]);

  return (
    <svg className={`figure ${className}`} viewBox="0 0 100 100" aria-hidden="true">
      <ellipse cx="50" cy="93.5" rx="34" ry="2.4" className="figure__floor" />
      <g transform={mirror ? "translate(100 0) scale(-1 1)" : undefined}>
        {BONES.map(([p, q]) => (
          <motion.line
            key={`${p}-${q}`}
            className={FAR.has(`${p}-${q}`) ? "figure__far" : "figure__bone"}
            initial={false}
            animate={{ x1: v(p, 0), y1: v(p, 1), x2: v(q, 0), y2: v(q, 1) }}
            transition={tr}
          />
        ))}
        <motion.circle className="figure__head" r="6" initial={false} animate={{ cx: v("head", 0), cy: v("head", 1) }} transition={tr} />
      </g>
    </svg>
  );
}
