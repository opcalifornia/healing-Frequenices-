import { useMemo, useState } from "react";
import { usePlayer } from "../../store/player";
import { bandFor, customToTitle } from "../../custom";
import { BAND_LABEL, formatHz } from "../../format";
import { Icon } from "../../components/Icon";

/**
 * Shows why two tones make one beat: in every beat period the right ear's
 * tone completes exactly one more cycle than the left's, so the two drift in
 * and out of step at the beat rate.
 */

const W = 640;
const ROW = 70;
const LAB_ID = "c-beatlab";

function wavePath(cyclesPerPeriod: number, periods: number, y0: number, amp: number) {
  const pts: string[] = [];
  const total = cyclesPerPeriod * periods;
  const steps = Math.max(400, Math.ceil(total * 16));
  for (let i = 0; i <= steps; i++) {
    const u = i / steps;
    const x = u * W;
    const y = y0 - Math.sin(u * total * Math.PI * 2) * amp;
    pts.push(`${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return pts.join("");
}

export function BeatLab() {
  const [carrier, setCarrier] = useState(200);
  const [beat, setBeat] = useState(10);
  const current = usePlayer((s) => s.current);
  const status = usePlayer((s) => s.status);
  const { playTitle, retune, stop } = usePlayer.getState();
  const playing = current?.id === LAB_ID && status !== "idle";

  const periods = 2;
  const exact = carrier / beat;
  // Draw real cycle counts when they fit, otherwise an illustrative 16 vs 17.
  const nL = exact <= 24 ? exact : 16;
  const illustrative = exact > 24;

  const paths = useMemo(
    () => ({
      left: wavePath(nL, periods, ROW * 0.5, ROW * 0.32),
      right: wavePath(nL + 1, periods, ROW * 1.5, ROW * 0.32),
    }),
    [nL],
  );

  const envelope = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 300; i++) {
      const u = i / 300;
      // Perceived loudness swell: in step -> strong, out of step -> weak.
      const v = Math.cos(u * periods * Math.PI * 2) * 0.5 + 0.5;
      pts.push(`${i ? "L" : "M"}${(u * W).toFixed(1)} ${(ROW * 3 - 8 - v * ROW * 0.7).toFixed(1)}`);
    }
    return pts.join("");
  }, []);

  const update = (c: number, b: number) => {
    setCarrier(c);
    setBeat(b);
    if (playing) retune(c, b);
  };

  const toggle = () => {
    if (playing) stop();
    else
      playTitle({
        ...customToTitle({ id: LAB_ID, name: "Beat Lab", carrier, beat, noise: null, solfeggio: null, isochronic: false, createdAt: new Date().toISOString() }),
        durationMin: 5,
      });
  };

  const period = 1 / beat;
  const leftCycles = carrier * period;
  const rightCycles = (carrier + beat) * period;
  const fmt = (n: number) => (Number.isInteger(+n.toFixed(2)) ? n.toFixed(0) : n.toFixed(1));

  return (
    <div className="diagram beatlab">
      <div className="beatlab__controls">
        <label className="build__slider">
          <span>Left ear <small>carrier</small></span>
          <input type="range" min={100} max={400} step={1} value={carrier} onChange={(e) => update(+e.target.value, beat)} aria-valuetext={formatHz(carrier)} />
          <output>{formatHz(carrier)}</output>
        </label>
        <label className="build__slider">
          <span>Difference <small>beat</small></span>
          <input type="range" min={0.5} max={40} step={0.5} value={beat} onChange={(e) => update(carrier, +e.target.value)} aria-valuetext={formatHz(beat)} />
          <output>{formatHz(beat)}</output>
        </label>
      </div>

      <svg viewBox={`0 0 ${W} ${ROW * 3}`} className="beatlab__svg" role="img" aria-label={`Left ear ${formatHz(carrier)}, right ear ${formatHz(carrier + beat)}, perceived beat ${formatHz(beat)}`}>
        {/* in-step zones */}
        {[0, 1, 2].map((k) => (
          <rect key={k} x={(k / periods) * W - W / periods / 6} y="0" width={W / periods / 3} height={ROW * 3} className="beatlab__zone" />
        ))}
        <path d={paths.left} className="beatlab__wave" stroke="#8b6cff" />
        <path d={paths.right} className="beatlab__wave" stroke="#19e3c4" />
        <path d={envelope} className="beatlab__env" />
        <text x="6" y="14" className="beatlab__tag" fill="#8b6cff">LEFT · {formatHz(carrier)}</text>
        <text x="6" y={ROW + 14} className="beatlab__tag" fill="#19e3c4">RIGHT · {formatHz(+(carrier + beat).toFixed(2))}</text>
        <text x="6" y={ROW * 2 + 14} className="beatlab__tag" fill="#ffc857">WHAT YOUR BRAINSTEM BUILDS · {formatHz(beat)} pulse</text>
        <text x={W / 4} y={ROW * 3 - 2} textAnchor="middle" className="beatlab__axis">1 beat = {fmt(period * 1000)} ms</text>
      </svg>

      <div className="beatlab__facts">
        <p>
          In every <strong>{fmt(period * 1000)} ms</strong> the left tone vibrates <strong>{fmt(leftCycles)}</strong> times and the right
          tone <strong>{fmt(rightCycles)}</strong> times: exactly <strong>one extra cycle</strong>. So the two waves slide out of step
          and back into step {formatHz(beat).replace(" Hz", "")} times a second. Shaded bands show where they line up.
          {illustrative && " (Waves are drawn with fewer cycles so you can see them; the one-extra-cycle relationship is exact.)"}
        </p>
        <p className="beatlab__band">
          A {formatHz(beat)} beat falls in the <strong>{BAND_LABEL[bandFor(beat)]}</strong> range. Neither ear hears it on its own; it only exists once the
          signals are compared.
        </p>
        <button className="btn btn--primary btn--small" onClick={toggle}>
          <Icon name={playing ? "stop" : "headphones"} size={18} /> {playing ? "Stop" : "Hear it with headphones"}
        </button>
      </div>
    </div>
  );
}
