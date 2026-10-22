import type { CSSProperties } from "react";
import type { Ritual } from "./rituals";

/** Hero artwork for a ritual: a rising sun, ripples, or a moon, drawn in the ritual's colours. A path or URL in `heroImage` is used instead when set. */
export function RitualArt({ ritual, className = "" }: { ritual: Ritual; className?: string }) {
  const style = { "--a": ritual.accentColor, "--a2": ritual.accentColor2 } as CSSProperties;
  if (!ritual.heroImage.startsWith("art:")) {
    return <div className={`rart ${className}`} style={style}><img src={ritual.heroImage} alt="" /></div>;
  }
  const kind = ritual.heroImage.slice(4);
  return (
    <div className={`rart rart--${kind} ${className}`} style={style} aria-hidden="true">
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id={`g-${kind}`} cx="50%" cy="60%" r="70%">
            <stop offset="0" stopColor="var(--a2)" stopOpacity="0.95" />
            <stop offset="1" stopColor="var(--a)" stopOpacity="0" />
          </radialGradient>
        </defs>
        {kind === "revive" && (
          <g>
            <circle className="rart__glow" cx="200" cy="210" r="190" fill={`url(#g-${kind})`} />
            {Array.from({ length: 13 }, (_, i) => {
              const a = (Math.PI * (i + 0.5)) / 13;
              return <line key={i} className="rart__ray" style={{ "--i": i } as CSSProperties} x1={200 - Math.cos(a) * 90} y1={210 - Math.sin(a) * 90} x2={200 - Math.cos(a) * 190} y2={210 - Math.sin(a) * 190} stroke="var(--a2)" strokeWidth="5" strokeLinecap="round" />;
            })}
            <circle cx="200" cy="210" r="70" fill="var(--a2)" />
            <rect x="0" y="210" width="400" height="90" fill="rgba(11,13,10,0.55)" />
          </g>
        )}
        {kind === "calm" && (
          <g fill="none" stroke="var(--a2)">
            <circle className="rart__glow" cx="200" cy="150" r="170" fill={`url(#g-${kind})`} stroke="none" />
            {[40, 78, 118, 160, 205].map((r, i) => <circle key={r} className="rart__ring" style={{ "--i": i } as CSSProperties} cx="200" cy="150" r={r} strokeWidth="3" strokeOpacity={0.85 - i * 0.14} />)}
            <circle cx="200" cy="150" r="10" fill="var(--a2)" stroke="none" />
          </g>
        )}
        {kind === "unwind" && (
          <g>
            <circle className="rart__glow" cx="270" cy="105" r="190" fill={`url(#g-${kind})`} />
            {Array.from({ length: 26 }, (_, i) => <circle key={i} className="rart__star" style={{ "--i": i } as CSSProperties} cx={(i * 151) % 400} cy={(i * 67) % 210} r={1 + (i % 3) * 0.7} fill="#fff" />)}
            <circle cx="270" cy="105" r="62" fill="var(--a2)" />
            <circle cx="294" cy="92" r="58" fill="var(--a)" />
          </g>
        )}
      </svg>
    </div>
  );
}
