import { useState } from "react";

/** Top-down view of the two hemispheres with switchable overlays. */

type Mode = "overview" | "movement" | "hearing" | "special" | "binaural";

const MODES: Array<{ id: Mode; label: string; text: string }> = [
  {
    id: "overview",
    label: "Overview",
    text: "Your cerebrum is split into a left and a right hemisphere. They are nearly mirror images and constantly talk through the corpus callosum, a bridge of around 200 million nerve fibers.",
  },
  {
    id: "movement",
    label: "Movement & touch",
    text: "Wiring is crossed. The left hemisphere moves and feels the right side of the body; the right hemisphere handles the left side. Vision is crossed too: each hemisphere sees the opposite half of the visual field.",
  },
  {
    id: "hearing",
    label: "Hearing",
    text: "Hearing is different: each ear sends signals to both hemispheres, with the crossed path a little stronger. That is why you can still hear with both sides of the brain, and why the two ears' signals can be compared low down in the brainstem.",
  },
  {
    id: "special",
    label: "Specialties",
    text: "Some skills lean to one side. Language is left-dominant in about 95% of right-handers and most left-handers. The right side is more involved in spatial attention, recognizing faces and reading tone of voice. But 'left-brained' and 'right-brained' personalities are a myth: everyone uses both sides all the time.",
  },
  {
    id: "binaural",
    label: "Binaural beats",
    text: "Each ear gets its own tone. The signals first meet in the brainstem, below both hemispheres, where the beat is created; it is then relayed up to hearing areas on both sides. Programs from the 1970s claimed this 'synchronizes the hemispheres'. That idea is popular, but direct evidence for it is thin and inconsistent.",
  },
];

const LEFT = "M176 36 C120 30 72 62 62 130 C54 196 78 268 140 292 C158 299 172 292 176 280 Z";

export function Hemispheres() {
  const [mode, setMode] = useState<Mode>("overview");
  const current = MODES.find((m) => m.id === mode)!;
  const purple = "#8b6cff";
  const teal = "#19e3c4";

  return (
    <div className="diagram">
      <div className="seg seg--wrap" role="group" aria-label="Hemisphere views">
        {MODES.map((m) => (
          <button key={m.id} aria-pressed={mode === m.id} className={mode === m.id ? "is-on" : ""} onClick={() => setMode(m.id)}>
            {m.label}
          </button>
        ))}
      </div>
      <div className="diagram__body">
        <svg viewBox="0 0 360 330" className="hemis" role="img" aria-label={`Top view of the two hemispheres: ${current.label}`}>
          <defs>
            <marker id="arrow-p" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" fill={purple} />
            </marker>
            <marker id="arrow-t" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" fill={teal} />
            </marker>
          </defs>
          <text x="180" y="18" textAnchor="middle" className="diagram__axis">front (nose)</text>

          <path d={LEFT} className={`hemi ${mode === "special" ? "hemi--left" : ""}`} />
          <path d={LEFT} transform="translate(360 0) scale(-1 1)" className={`hemi ${mode === "special" ? "hemi--right" : ""}`} />
          {/* folds */}
          {[70, 115, 160, 205, 250].map((y) => (
            <g key={y} className="hemi__fold">
              <path d={`M86 ${y} C110 ${y - 12} 130 ${y + 12} 160 ${y - 4}`} />
              <path d={`M274 ${y} C250 ${y - 12} 230 ${y + 12} 200 ${y - 4}`} />
            </g>
          ))}

          {/* corpus callosum */}
          <g className={`callosum ${mode === "overview" ? "is-on" : ""}`}>
            <rect x="170" y="110" width="20" height="110" rx="8" />
            {[122, 140, 158, 176, 194, 208].map((y) => <line key={y} x1="164" x2="196" y1={y} y2={y} />)}
          </g>
          {mode === "overview" && (
            <g className="callout">
              <line x1="196" y1="165" x2="300" y2="315" />
              <text x="300" y="326" textAnchor="middle">Corpus callosum</text>
            </g>
          )}

          <text x="118" y="170" textAnchor="middle" className="hemi__name">LEFT</text>
          <text x="242" y="170" textAnchor="middle" className="hemi__name">RIGHT</text>

          {mode === "movement" && (
            <g>
              <path d="M120 230 C150 280 230 290 300 312" stroke={purple} className="flow" markerEnd="url(#arrow-p)" />
              <path d="M240 230 C210 280 130 290 60 312" stroke={teal} className="flow" markerEnd="url(#arrow-t)" />
              <text x="320" y="326" textAnchor="end" className="diagram__axis">right hand</text>
              <text x="40" y="326" className="diagram__axis">left hand</text>
            </g>
          )}

          {(mode === "hearing" || mode === "binaural") && (
            <g>
              <g className="ear"><circle cx="22" cy="175" r="14" /><text x="22" y="180" textAnchor="middle">L</text></g>
              <g className="ear"><circle cx="338" cy="175" r="14" /><text x="338" y="180" textAnchor="middle">R</text></g>
              {mode === "hearing" ? (
                <>
                  <path d="M36 175 C120 175 200 150 250 140" stroke={purple} className="flow flow--thick" markerEnd="url(#arrow-p)" />
                  <path d="M36 180 C70 182 90 186 110 188" stroke={purple} className="flow" markerEnd="url(#arrow-p)" />
                  <path d="M324 175 C240 175 160 150 110 140" stroke={teal} className="flow flow--thick" markerEnd="url(#arrow-t)" />
                  <path d="M324 180 C290 182 270 186 250 188" stroke={teal} className="flow" markerEnd="url(#arrow-t)" />
                </>
              ) : (
                <>
                  <text x="22" y="205" textAnchor="middle" className="diagram__tone" fill={purple}>200 Hz</text>
                  <text x="338" y="205" textAnchor="middle" className="diagram__tone" fill={teal}>210 Hz</text>
                  <path d="M36 182 C90 230 140 262 172 268" stroke={purple} className="flow" />
                  <path d="M324 182 C270 230 220 262 188 268" stroke={teal} className="flow" />
                  <circle cx="180" cy="270" r="13" className="meet" />
                  <text x="180" y="300" textAnchor="middle" className="diagram__tone">brainstem: 10 Hz beat</text>
                  <path d="M172 258 C150 230 130 210 118 192" stroke="#ffc857" className="flow" />
                  <path d="M188 258 C210 230 230 210 242 192" stroke="#ffc857" className="flow" />
                </>
              )}
            </g>
          )}

          {mode === "special" && (
            <g className="tags">
              <text x="118" y="95" textAnchor="middle">Language</text>
              <text x="118" y="115" textAnchor="middle">Speech</text>
              <text x="118" y="230" textAnchor="middle">Reading</text>
              <text x="242" y="95" textAnchor="middle">Spatial attention</text>
              <text x="242" y="115" textAnchor="middle">Faces</text>
              <text x="242" y="230" textAnchor="middle">Tone of voice</text>
            </g>
          )}
        </svg>
        <p className="diagram__text" aria-live="polite">{current.text}</p>
      </div>
    </div>
  );
}
