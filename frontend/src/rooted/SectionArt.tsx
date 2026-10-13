import type { RootedSection } from "./sections";
import { LiveWaves } from "../components/LiveWaves";

const PRODUCE = [
  { id: "grapes", x: 30, y: 56, s: 1 },
  { id: "carrot", x: 78, y: 66, s: 1 },
  { id: "broccoli", x: 128, y: 58, s: 1.05 },
  { id: "apple", x: 180, y: 64, s: 1 },
  { id: "pear", x: 228, y: 58, s: 1 },
  { id: "beet", x: 278, y: 64, s: 1 },
  { id: "tomato", x: 326, y: 70, s: 0.95 },
  { id: "lemon", x: 368, y: 72, s: 0.9 },
] as const;

/** Each piece is drawn around (0,0), about 40 units tall, with its base near y=30. */
const PRODUCE_ART: Record<(typeof PRODUCE)[number]["id"], React.ReactNode> = {
  carrot: (
    <>
      <path d="M-9 -2L9 -2L0 36Z" fill="#f08a24" />
      <path d="M-4 8H4M-3 18H3" stroke="#c96a12" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M0 -2C-8 -14 -10 -20 -6 -26M0 -2C0 -14 0 -22 1 -28M0 -2C8 -14 10 -20 7 -26" stroke="#5aa832" strokeWidth="3" strokeLinecap="round" fill="none" />
    </>
  ),
  broccoli: (
    <>
      <path d="M-5 14H5L7 34H-7Z" fill="#8fc36a" />
      <circle cx="-11" cy="6" r="10" fill="#3f8f3a" />
      <circle cx="11" cy="6" r="10" fill="#3f8f3a" />
      <circle cx="0" cy="-3" r="12" fill="#4da545" />
      <circle cx="-5" cy="-6" r="2" fill="#6cc062" />
      <circle cx="6" cy="0" r="2" fill="#6cc062" />
    </>
  ),
  apple: (
    <>
      <path d="M0 -6C-8 -14 -22 -8 -20 8 -18 24 -8 34 0 30 8 34 18 24 20 8 22 -8 8 -14 0 -6Z" fill="#d6372f" />
      <path d="M-10 4C-12 10 -10 16 -6 20" stroke="#ff8a7a" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M0 -6C0 -12 2 -16 4 -18" stroke="#5b3a1e" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M4 -14C10 -20 18 -18 20 -16 16 -10 8 -10 4 -14Z" fill="#5aa832" />
    </>
  ),
  pear: (
    <>
      <path d="M0 -14C-8 -14 -8 -2 -13 8 -22 24 -12 36 0 36S22 24 13 8C8 -2 8 -14 0 -14Z" fill="#b5c93a" />
      <path d="M-8 16C-9 22 -6 27 -2 29" stroke="#e1ee8a" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.8" />
      <path d="M0 -14C0 -20 2 -24 5 -26" stroke="#5b3a1e" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </>
  ),
  tomato: (
    <>
      <circle cx="0" cy="14" r="19" fill="#e0452e" />
      <path d="M-8 6C-11 12 -10 18 -6 22" stroke="#ff9a85" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M0 -4L5 2 12 0 8 6 12 10 5 10 0 15-5 10-12 10-8 6-12 0-5 2Z" fill="#4da545" />
    </>
  ),
  lemon: (
    <>
      <path d="M-22 16C-22 6 -10 0 0 0S22 6 22 16 10 32 0 32 -22 26 -22 16Z" fill="#f4d340" />
      <path d="M-20 16L-26 16M22 16L26 16" stroke="#f4d340" strokeWidth="4" strokeLinecap="round" />
      <path d="M-12 10C-8 6 -2 5 4 6" stroke="#fff3a6" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.8" />
    </>
  ),
  beet: (
    <>
      <path d="M0 36C-4 36 -16 28 -16 14S-6 -2 0 -2 16 0 16 14 4 36 0 36Z" fill="#8e2a63" />
      <path d="M0 36V44" stroke="#8e2a63" strokeWidth="2" strokeLinecap="round" />
      <path d="M-3 -2C-10 -14 -12 -20 -8 -28M3 -2C8 -14 14 -18 14 -26" stroke="#4d9a3a" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M-8 -28C-4 -30 -2 -26 -4 -22 -8 -22 -10 -24 -8 -28Z" fill="#c2406f" />
    </>
  ),
  grapes: (
    <>
      <path d="M0 -8C0 -14 3 -18 6 -20" stroke="#5b3a1e" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {[[-9, 0], [3, 0], [-3, 9], [9, 9], [-9, 14], [3, 19], [-3, 28]].map(([x, y], i) => (
        <circle key={i} cx={x + 3} cy={y + 2} r="6.5" fill={i % 2 ? "#6a3fa0" : "#7d4fb8"} />
      ))}
    </>
  ),
};

/** Slow, procedural art per section. Pure SVG/CSS so it costs nothing to load. */
export function SectionArt({ s }: { s: RootedSection }) {
  const style = { "--c1": s.c1, "--c2": s.c2 } as React.CSSProperties;
  switch (s.id) {
    case "healing":
      return (
        <div className="sart sart--healing" style={style}>
          <LiveWaves seed="rooted-hub" hue={262} beat={6} baseline={0.62} className="sart__waves" />
        </div>
      );
    case "nourish":
      return (
        <svg className="sart sart--nourish" style={style} viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="sart-table" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#8a5a34" />
              <stop offset="1" stopColor="#4b2f1b" />
            </linearGradient>
          </defs>
          <rect x="0" y="96" width="400" height="104" fill="url(#sart-table)" opacity="0.9" />
          <rect x="0" y="96" width="400" height="2" fill="#c89a62" opacity="0.5" />
          {PRODUCE.map((p, i) => (
            <g key={p.id} transform={`translate(${p.x} ${p.y})`}>
              <g className="sart__fruit" style={{ "--i": i } as React.CSSProperties} transform={`scale(${p.s})`}>{PRODUCE_ART[p.id]}</g>
            </g>
          ))}
        </svg>
      );
    case "move":
      return (
        <svg className="sart sart--move" style={style} viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <g transform="translate(-95 0)">
          <circle className="sart__sun" cx="300" cy="78" r="46" fill="var(--c2)" opacity="0.28" />
          <path className="sart__trail" d="M20 160C90 140 140 170 210 150S330 120 390 140" fill="none" stroke="var(--c2)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 9" opacity="0.5" />
          <g className="sart__figure" fill="none" stroke="var(--c1)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="300" cy="46" r="9" fill="var(--c1)" stroke="none" />
            <path d="M300 60V108" />
            <path d="M300 74C282 68 272 54 270 38" />
            <path d="M300 74C318 68 328 54 330 38" />
            <path d="M300 108V150" />
            <path d="M300 118C312 124 322 126 330 118" />
          </g>
          <path d="M240 156H360" stroke="var(--c1)" strokeWidth="3" strokeLinecap="round" opacity="0.35" />
          </g>
        </svg>
      );
    case "combos":
      return (
        <svg className="sart sart--combos" style={style} viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <g transform="translate(-42 -8)">
          <path className="sart__link" d="M190 70C225 70 235 100 270 100M190 130C225 130 235 100 270 100" fill="none" stroke="var(--c2)" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 8" opacity="0.6" />
          <g transform="translate(165 70)">
            <circle className="sart__pulse" r="22" fill="none" stroke="var(--c1)" strokeWidth="3" />
            <circle r="9" fill="var(--c1)" opacity="0.55" />
          </g>
          <g transform="translate(140 130)">
            <path className="sart__wave" d="M0 0C8-16 16-16 24 0S40 16 48 0" fill="none" stroke="var(--c2)" strokeWidth="4" strokeLinecap="round" />
          </g>
          <g transform="translate(270 100)">
            <rect x="0" y="-26" width="52" height="52" rx="14" fill="var(--c1)" opacity="0.22" stroke="var(--c1)" strokeWidth="2.5" />
            <path d="M14 0l9 9 17-19" fill="none" stroke="var(--c2)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          </g>
        </svg>
      );
    case "spirit":
      return (
        <svg className="sart sart--spirit" style={style} viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <g transform="translate(-85 0)">
          {[0, 1, 2].map((i) => (
            <ellipse key={i} className="sart__ripple" style={{ "--i": i } as React.CSSProperties} cx="290" cy="120" rx="70" ry="16" fill="none" stroke="var(--c2)" strokeWidth="2" />
          ))}
          {[[225, 30], [350, 70], [335, 28], [236, 78]].map(([x, y], i) => (
            <circle key={i} className="sart__star" style={{ "--i": i } as React.CSSProperties} cx={x} cy={y} r={2 + (i % 2)} fill="var(--c2)" />
          ))}
          <g className="sart__lotus" fill="var(--c2)" opacity="0.75">
            <path d="M290 98C280 84 280 72 290 60 300 72 300 84 290 98Z" />
            <path d="M290 98C272 92 266 80 268 70 282 72 292 84 290 98Z" opacity="0.8" />
            <path d="M290 98C308 92 314 80 312 70 298 72 288 84 290 98Z" opacity="0.8" />
          </g>
          <path d="M238 116H342C340 148 318 166 290 166S240 148 238 116Z" fill="var(--c1)" opacity="0.85" />
          <ellipse cx="290" cy="116" rx="52" ry="9" fill="var(--c2)" opacity="0.5" />
          <rect x="256" y="168" width="68" height="8" rx="4" fill="var(--c1)" opacity="0.45" />
          </g>
        </svg>
      );
    case "light":
      return (
        <div className="sart sart--light" style={style} aria-hidden="true">
          <span /><span /><span />
        </div>
      );
    case "breathe":
      return (
        <div className="sart sart--breathe" style={style} aria-hidden="true">
          <span /><span /><span />
        </div>
      );
    case "learn":
      return (
        <svg className="sart sart--learn" style={style} viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          {Array.from({ length: 14 }, (_, i) => (
            <circle key={i} className="sart__node" style={{ "--i": i } as React.CSSProperties} cx={30 + ((i * 97) % 360)} cy={30 + ((i * 53) % 150)} r={3 + (i % 4)} fill={i % 2 ? "var(--c1)" : "var(--c2)"} />
          ))}
          {Array.from({ length: 13 }, (_, i) => (
            <line key={i} x1={30 + ((i * 97) % 360)} y1={30 + ((i * 53) % 150)} x2={30 + (((i + 1) * 97) % 360)} y2={30 + (((i + 1) * 53) % 150)} stroke="var(--c1)" strokeOpacity="0.25" />
          ))}
        </svg>
      );
    default:
      return (
        <div className="sart sart--orbs" style={style} aria-hidden="true">
          <span /><span />
        </div>
      );
  }
}
