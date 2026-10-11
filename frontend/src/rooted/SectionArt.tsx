import type { RootedSection } from "./sections";
import { LiveWaves } from "../components/LiveWaves";

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
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <g key={i} className="sart__leaf" style={{ "--i": i } as React.CSSProperties} transform={`translate(${40 + i * 55} ${120 + (i % 3) * 24}) rotate(${-40 + i * 17})`}>
              <path d="M0 0C14-26 46-30 66-22 58 4 28 18 0 0Z" fill={i % 2 ? "var(--c1)" : "var(--c2)"} opacity={0.55 - (i % 3) * 0.12} />
              <path d="M0 0C20-10 40-16 64-22" stroke="rgba(0,0,0,.35)" fill="none" strokeWidth="1.5" />
            </g>
          ))}
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
