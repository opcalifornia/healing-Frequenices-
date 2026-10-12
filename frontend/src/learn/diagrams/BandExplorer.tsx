import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BANDS, REGIONS, type BandInfo } from "../brainContent";
import { BrainLateral } from "./BrainLateral";
import { BAND_LABEL } from "../../format";
import { hashString, mulberry32 } from "../../art/painter";
import { useCatalog } from "../../store/catalog";
import { PlayButton } from "../../components/TitleActions";
import { Tile } from "../../components/Tile";
import { RailFrame } from "../../components/Rail";
import type { Band } from "../../types";

/** Visual pulse period for each band: a slowed stand-in, never a real flicker rate. */
export const PULSE_SECONDS: Record<Band, number> = { delta: 4, theta: 3, alpha: 2.4, beta: 1.8, gamma: 1.4 };

/** A plausible 2-second EEG snippet for a band: a few nearby sines plus slower background. */
export function EegTrace({ info, width = 640, height = 120, seconds = 2 }: { info: BandInfo; width?: number; height?: number; seconds?: number }) {
  const d = useMemo(() => {
    const rnd = mulberry32(hashString(info.band));
    const comps = [0, 1, 2, 3].map(() => ({
      f: info.hz[0] + rnd() * (Math.min(info.hz[1], info.band === "gamma" ? 48 : info.hz[1]) - info.hz[0]),
      p: rnd() * Math.PI * 2,
      a: 0.4 + rnd() * 0.6,
    }));
    comps.push({ f: info.centre, p: rnd() * 6, a: 1.4 });
    const bg = [0, 1, 2].map(() => ({ f: 0.5 + rnd() * 3, p: rnd() * 6, a: 0.25 }));
    const norm = comps.reduce((s, c) => s + c.a, 0) + bg.reduce((s, c) => s + c.a, 0);
    // Amplitude on screen scales with the band's typical microvolts (log-compressed so gamma is still visible).
    const scale = (height * 0.45 * (0.25 + 0.75 * Math.log10(info.uv) / Math.log10(120))) / norm;
    const steps = Math.ceil(seconds * Math.max(200, info.centre * 24));
    const pts: string[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * seconds;
      let v = 0;
      for (const c of comps) v += c.a * Math.sin(2 * Math.PI * c.f * t + c.p);
      for (const c of bg) v += c.a * Math.sin(2 * Math.PI * c.f * t + c.p);
      // Alpha comes in waxing and waning "spindles".
      if (info.band === "alpha") v *= 0.6 + 0.4 * Math.sin(2 * Math.PI * 0.7 * t);
      pts.push(`${i ? "L" : "M"}${((i / steps) * width).toFixed(1)} ${(height / 2 - v * scale).toFixed(1)}`);
    }
    return pts.join("");
  }, [info, width, height, seconds]);

  const barPx = (height * 0.45 * 50) / 120; // rough 50 µV reference
  return (
    <svg viewBox={`0 0 ${width} ${height + 18}`} className="eeg" role="img" aria-label={`Sample ${BAND_LABEL[info.band]} EEG trace`}>
      {[0.25, 0.5, 0.75].map((f) => <line key={f} x1={width * f} x2={width * f} y1="0" y2={height} className="eeg__grid" />)}
      <path d={d} stroke={info.color} className="eeg__line" />
      <line x1={width - 8} x2={width - 8} y1={height / 2 - barPx / 2} y2={height / 2 + barPx / 2} className="eeg__scale" />
      <text x={width - 14} y={height / 2 + 4} textAnchor="end" className="eeg__label">≈50 µV</text>
      <text x="0" y={height + 14} className="eeg__label">0 s</text>
      <text x={width / 2} y={height + 14} textAnchor="middle" className="eeg__label">1 s</text>
      <text x={width} y={height + 14} textAnchor="end" className="eeg__label">2 s</text>
    </svg>
  );
}

export function BandExplorer() {
  const [band, setBand] = useState<Band>("alpha");
  const info = BANDS.find((b) => b.band === band)!;
  const catalog = useCatalog();
  const session = catalog?.titles[info.sessionId];
  const related = useMemo(
    () => (catalog ? Object.values(catalog.titles).filter((t) => t.band === band && t.kind !== "show").slice(0, 10) : []),
    [catalog, band],
  );

  return (
    <div className="diagram">
      <div className="bandtabs" role="group" aria-label="Brainwave bands">
        {BANDS.map((b) => (
          <button
            key={b.band}
            aria-pressed={band === b.band}
            className={`bandtab ${band === b.band ? "is-on" : ""}`}
            style={{ "--c": b.color } as React.CSSProperties}
            onClick={() => setBand(b.band)}
          >
            <strong>{BAND_LABEL[b.band]}</strong>
            <span>{b.range}</span>
          </button>
        ))}
      </div>

      <div className="band__grid">
        <div className="band__brain">
          <BrainLateral
            highlight={info.regions}
            color={info.color}
            pulse={PULSE_SECONDS[band]}
            label={`${BAND_LABEL[band]} · ${info.range}`}
            title={`${BAND_LABEL[band]} activity is typically strongest over the ${info.regions.map((r) => REGIONS[r].name.toLowerCase()).join(" and ")}`}
          />
          <p className="band__caption">Highlighted: where {BAND_LABEL[band].toLowerCase()} is typically strongest on scalp EEG. The glow is slowed down for illustration.</p>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={band} className="band__info" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
            <h3 style={{ color: info.color }}>{BAND_LABEL[band]} · {info.range}</h3>
            <p><strong>Where:</strong> {info.where}</p>
            <ul>{info.when.map((w) => <li key={w}>{w}</li>)}</ul>
            <p><strong>Size:</strong> {info.amplitude}</p>
            <p className="band__research">{info.research}</p>
            {session && (
              <div className="band__try">
                <PlayButton title={session} small label={`Try ${session.name}`} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="band__trace">
        <span className="band__trace-label">What {BAND_LABEL[band].toLowerCase()} looks like on an EEG (illustrative)</span>
        <EegTrace info={info} />
      </div>

      {related.length > 0 && catalog && (
        <div className="band__rail">
          <RailFrame id={`guide-${band}`} title={`${BAND_LABEL[band]} sessions`} seeAll={`/collection/frequencies/band-${band}`}>
            {related.map((t, i) => <Tile key={t.id} title={t} shape="landscape" index={i} />)}
          </RailFrame>
        </div>
      )}
    </div>
  );
}
