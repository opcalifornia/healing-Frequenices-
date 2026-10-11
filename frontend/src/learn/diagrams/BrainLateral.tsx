import { useId } from "react";
import { REGIONS, type Region } from "../brainContent";

/**
 * Stylised left-side view of the brain (front of the head on the left).
 * Lobes are drawn as large polygons clipped by the cerebrum outline, so the
 * borders always line up. Highlighted regions glow and radiate rings.
 */

const CEREBRUM =
  "M70 200 C40 185 30 140 45 110 C60 70 110 40 170 34 C230 28 300 40 340 75 C375 105 385 150 365 180 C350 200 320 205 300 200 C285 215 260 225 230 225 C190 228 150 225 128 212 C112 204 108 192 118 184 C105 192 88 202 70 200 Z";

const LOBES: Record<Exclude<Region, "cerebellum" | "brainstem" | "central">, string> = {
  frontal: "M0 0 L207 0 L205 31 C200 70 190 110 182 166 L150 173 L118 184 L0 230 Z",
  parietal: "M207 0 L322 0 L320 56 C314 100 308 135 304 160 L255 150 C230 156 205 161 182 166 C190 110 200 70 205 31 Z",
  occipital: "M322 0 L420 0 L420 320 L300 320 L300 200 C302 185 303 172 304 160 C308 135 314 100 320 56 Z",
  temporal: "M0 230 L118 184 L150 173 L182 166 C205 161 230 156 255 150 L304 160 C303 172 302 185 300 200 L300 320 L0 320 Z",
};

const CENTRAL_SULCUS = "M205 31 C200 70 190 110 182 166";
const SYLVIAN = "M118 184 C160 170 210 162 255 150";
const CEREBELLUM = "M268 214 C285 205 330 200 352 196 C372 210 368 245 340 256 C310 266 278 255 266 238 C262 228 262 220 268 214 Z";
const BRAINSTEM = "M232 220 C240 240 246 270 250 305 L276 305 C272 270 268 245 262 222 Z";

const FOLDS = [
  "M80 120 C95 105 110 115 125 100", "M70 160 C90 150 105 160 125 145", "M120 70 C135 85 150 70 165 80",
  "M140 120 C150 105 165 118 175 100", "M230 60 C245 75 260 60 275 72", "M240 110 C255 100 270 115 285 102",
  "M330 100 C340 115 352 108 360 125", "M320 160 C335 150 345 165 358 155", "M160 205 C180 195 200 205 220 195",
  "M220 185 C235 178 250 188 268 180",
];
const CEREBELLUM_FOLDS = ["M275 225 C300 215 330 212 360 210", "M272 236 C300 228 330 226 362 225", "M280 248 C305 242 330 240 352 240"];

export const CENTROIDS: Record<Region, [number, number]> = {
  frontal: [105, 120],
  central: [196, 90],
  parietal: [258, 92],
  occipital: [345, 135],
  temporal: [205, 196],
  cerebellum: [318, 232],
  brainstem: [255, 280],
};

interface Props {
  highlight?: Region[];
  color?: string;
  /** Visual pulse period in seconds (slowed-down stand-in for the band rate). */
  pulse?: number;
  label?: string;
  selected?: Region | null;
  onSelect?: (r: Region) => void;
  showLabels?: boolean;
  title: string;
}

export function BrainLateral({ highlight = [], color = "#19e3c4", pulse = 2, label, selected, onSelect, showLabels = false, title }: Props) {
  const uid = useId().replace(/:/g, "");
  const clip = `brain-clip-${uid}`;
  const glow = `brain-glow-${uid}`;
  const interactive = !!onSelect;
  const isOn = (r: Region) => highlight.includes(r) || selected === r;

  const regionProps = (r: Region) =>
    interactive
      ? {
          role: "button",
          tabIndex: 0,
          "aria-label": REGIONS[r].name,
          "aria-pressed": selected === r,
          onClick: () => onSelect!(r),
          onKeyDown: (e: React.KeyboardEvent) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onSelect!(r)),
          className: "brain__region is-interactive",
        }
      : { className: "brain__region" };

  const fill = (r: Region) => (isOn(r) ? color : "var(--brain-base)");
  const first = highlight[0] ?? selected ?? null;

  return (
    <svg className="brain" viewBox="0 0 420 320" role="img" aria-label={title} style={{ "--pulse": `${pulse}s`, "--hl": color } as React.CSSProperties}>
      <defs>
        <clipPath id={clip}>
          <path d={CEREBRUM} />
        </clipPath>
        <filter id={glow} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="8" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Brainstem and cerebellum sit behind the cerebrum. */}
      <g {...regionProps("brainstem")}>
        <path d={BRAINSTEM} fill={fill("brainstem")} className={isOn("brainstem") ? "is-on" : ""} />
      </g>
      <g {...regionProps("cerebellum")}>
        <path d={CEREBELLUM} fill={fill("cerebellum")} className={isOn("cerebellum") ? "is-on" : ""} />
        {CEREBELLUM_FOLDS.map((d) => <path key={d} d={d} className="brain__fold" />)}
      </g>

      <g clipPath={`url(#${clip})`}>
        {(Object.keys(LOBES) as Array<keyof typeof LOBES>).map((r) => (
          <g key={r} {...regionProps(r)}>
            <path d={LOBES[r]} fill={fill(r)} className={isOn(r) ? "is-on" : ""} />
          </g>
        ))}
        <g {...regionProps("central")}>
          <path d={CENTRAL_SULCUS} className={`brain__strip ${isOn("central") ? "is-on" : ""}`} stroke={isOn("central") ? color : "transparent"} />
        </g>
        {FOLDS.map((d) => <path key={d} d={d} className="brain__fold" />)}
        <path d={CENTRAL_SULCUS} className="brain__sulcus" />
        <path d={SYLVIAN} className="brain__sulcus" />
      </g>
      <path d={CEREBRUM} className="brain__outline" />

      {/* Radiating rings from each highlighted region. */}
      {highlight.map((r) => {
        const [x, y] = CENTROIDS[r];
        return (
          <g key={`ring-${r}`} className="brain__rings" style={{ transformOrigin: `${x}px ${y}px` }} aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <circle key={i} cx={x} cy={y} r={18} stroke={color} style={{ animationDelay: `calc(var(--pulse) * ${i / 3})` }} />
            ))}
            <circle cx={x} cy={y} r={6} fill={color} filter={`url(#${glow})`} className="brain__core" />
          </g>
        );
      })}

      {label && first && (
        <g className="brain__badge" transform={`translate(${Math.min(300, CENTROIDS[first][0] - 10)} ${Math.max(18, CENTROIDS[first][1] - 62)})`} aria-hidden="true">
          <rect x="0" y="0" rx="12" width={label.length * 7.2 + 24} height="26" fill="rgba(0,0,0,0.75)" stroke={color} />
          <text x="12" y="17.5" fill="#fff">{label}</text>
        </g>
      )}

      {showLabels &&
        (["frontal", "parietal", "occipital", "temporal", "cerebellum", "brainstem"] as Region[]).map((r) => {
          const [x, y] = CENTROIDS[r];
          const offset: Record<string, [number, number]> = { brainstem: [26, 18], cerebellum: [0, 4], temporal: [0, 2] };
          const [dx, dy] = offset[r] ?? [0, 0];
          return (
            <text key={r} x={x + dx} y={y + dy} className="brain__label" textAnchor="middle" aria-hidden="true">
              {REGIONS[r].name.replace(" lobe", "")}
            </text>
          );
        })}
      <text x="22" y="300" className="brain__axis" aria-hidden="true">← front</text>
    </svg>
  );
}
