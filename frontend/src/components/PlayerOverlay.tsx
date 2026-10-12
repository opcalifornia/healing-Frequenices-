import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePlayer, type TimerChoice } from "../store/player";
import { useArt } from "../art/useArt";
import { specForTitle } from "../art/painter";
import { BAND_LABEL, formatClock, formatHz } from "../format";
import { bandFor } from "../custom";
import { Visualizer } from "./Visualizer";
import { Icon } from "./Icon";
import type { NoiseColor } from "../types";
import { AMBIENCES, type AmbienceId } from "../audio/ambience";
import { MUSIC_STYLES, type MusicStyle } from "../audio/music";
import { useModalFocus } from "../rooted/ui";
import "./Player.css";

const SOLFEGGIO = [174, 285, 396, 417, 528, 639, 741, 852, 963];
const TIMERS: Array<[TimerChoice, string]> = [
  [null, "Session length"],
  [10, "10 min"],
  [20, "20 min"],
  [30, "30 min"],
  [45, "45 min"],
  [60, "1 hr"],
  [90, "90 min"],
];

type Panel = "mixer" | "timer" | "test" | null;

function Slider({ label, value, onChange, disabled }: { label: string; value: number; onChange(v: number): void; disabled?: boolean }) {
  return (
    <label className={`slider ${disabled ? "is-off" : ""}`}>
      <span className="slider__label">{label}</span>
      <input type="range" min={0} max={1} step={0.01} value={value} onChange={(e) => onChange(+e.target.value)} disabled={disabled} />
      <span className="slider__val">{Math.round(value * 100)}</span>
    </label>
  );
}

function Mixer() {
  const { mix, noise, solfeggio, isochronic, ambience, music } = usePlayer();
  const { setMix, setNoise, setSolfeggio, setIsochronic, setAmbience, setMusic } = usePlayer.getState();
  return (
    <div className="panel__grid">
      <Slider label="Binaural" value={mix.binaural} onChange={(v) => setMix({ binaural: v })} />
      <div className="layer">
        <div className="layer__row">
          <span className="slider__label">Noise</span>
          <div className="seg" role="radiogroup" aria-label="Noise color">
            {([null, "pink", "brown", "surf"] as Array<NoiseColor | null>).map((c) => (
              <button key={String(c)} role="radio" aria-checked={noise === c} className={noise === c ? "is-on" : ""} onClick={() => setNoise(c)}>
                {c ? c[0].toUpperCase() + c.slice(1) : "Off"}
              </button>
            ))}
          </div>
        </div>
        <Slider label="Level" value={mix.noise} onChange={(v) => setMix({ noise: v })} disabled={!noise} />
      </div>
      <div className="layer">
        <div className="layer__row">
          <label className="slider__label" htmlFor="music">Music</label>
          <select id="music" className="select" value={music ?? ""} onChange={(e) => setMusic((e.target.value || null) as MusicStyle | null)}>
            <option value="">Off</option>
            {MUSIC_STYLES.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
        <Slider label="Level" value={mix.music} onChange={(v) => setMix({ music: v })} disabled={!music} />
      </div>
      <div className="layer">
        <div className="layer__row">
          <label className="slider__label" htmlFor="nature">Nature</label>
          <select id="nature" className="select" value={ambience ?? ""} onChange={(e) => setAmbience((e.target.value || null) as AmbienceId | null)}>
            <option value="">Off</option>
            {AMBIENCES.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
        <Slider label="Level" value={mix.ambience} onChange={(v) => setMix({ ambience: v })} disabled={!ambience} />
      </div>
      <div className="layer">
        <div className="layer__row">
          <span className="slider__label">Isochronic</span>
          <button className={`switch ${isochronic ? "is-on" : ""}`} role="switch" aria-checked={isochronic} aria-label="Isochronic tones" onClick={() => setIsochronic(!isochronic)}>
            <span />
          </button>
        </div>
        <Slider label="Level" value={mix.isochronic} onChange={(v) => setMix({ isochronic: v })} disabled={!isochronic} />
      </div>
      <div className="layer">
        <div className="layer__row">
          <label className="slider__label" htmlFor="solf">Solfeggio</label>
          <select id="solf" className="select" value={solfeggio ?? ""} onChange={(e) => setSolfeggio(e.target.value ? +e.target.value : null)}>
            <option value="">Off</option>
            {SOLFEGGIO.map((hz) => <option key={hz} value={hz}>{hz} Hz</option>)}
          </select>
        </div>
        <Slider label="Level" value={mix.solfeggio} onChange={(v) => setMix({ solfeggio: v })} disabled={!solfeggio} />
      </div>
    </div>
  );
}

function TimerPanel() {
  const timer = usePlayer((s) => s.timer);
  const setTimer = usePlayer((s) => s.setTimer);
  return (
    <div className="panel__chips" role="radiogroup" aria-label="Sleep timer">
      {TIMERS.map(([v, label]) => (
        <button key={label} role="radio" aria-checked={timer === v} className={`chip ${timer === v ? "is-on" : ""}`} onClick={() => setTimer(v)}>
          {label}
        </button>
      ))}
      <p className="panel__hint">The session fades out gently over its last few seconds.</p>
    </div>
  );
}

function ChannelTest() {
  const testing = usePlayer((s) => s.testing);
  const run = usePlayer((s) => s.channelTest);
  return (
    <div className="ctest">
      <p className="panel__hint">Check your headphones: each button plays a soft tone in one ear only.</p>
      <div className="ctest__ears">
        {(["left", "right"] as const).map((side) => (
          <button key={side} className={`ctest__ear ${testing === side ? "is-on" : ""}`} onClick={() => run(side)} disabled={!!testing} aria-label={`Play test tone in ${side} ear`}>
            <span className="ctest__letter">{side === "left" ? "L" : "R"}</span>
            <span>{side === "left" ? "Left ear" : "Right ear"}</span>
          </button>
        ))}
      </div>
      <p className="ctest__status" aria-live="polite">
        {testing ? `You should hear this in your ${testing.toUpperCase()} ear only.` : " "}
      </p>
    </div>
  );
}

export function PlayerOverlay() {
  const s = usePlayer();
  const { togglePlay, stop, seek, setExpanded, setVolume, setCalmVisuals } = usePlayer.getState();
  const [panel, setPanel] = useState<Panel>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const open = s.expanded && !!s.current;
  const art = useArt(s.current ? specForTitle(s.current) : null, "hero", open);

  // Focus trap, Escape-to-close, scroll lock and focus restore.
  useModalFocus(dialog, open && !!s.current, () => setExpanded(false), { autoFocus: false });
  useEffect(() => {
    if (!open) return;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " && !(e.target as HTMLElement).closest("button, input, select")) {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, togglePlay]);

  const t = s.current;
  const stages = t?.stages;
  const stage = stages?.[s.stageIndex];
  const next = stages?.[s.stageIndex + 1];
  const left = s.carrier;
  const right = +(s.carrier + s.beat).toFixed(3);

  return (
    <AnimatePresence>
      {open && t && (
        <motion.div
          ref={dialog}
          tabIndex={-1}
          className={`player ${panel ? "has-panel" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label={`Now playing: ${t.name}`}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {art && <img className="player__bg" src={art} alt="" />}
          <div className="player__shade" />

          <header className="player__top">
            <button ref={closeBtn} className="icon-btn icon-btn--plain" onClick={() => setExpanded(false)} aria-label="Close player">
              <Icon name="back" size={28} />
            </button>
            <div className="player__heading">
              <span className="player__eyebrow">{t.kind === "program" ? "Deep Sync" : "Now playing"}</span>
              <h2>{t.name}</h2>
            </div>
            <button className={`chip ${s.calmVisuals ? "is-on" : ""}`} onClick={() => setCalmVisuals(!s.calmVisuals)} aria-pressed={s.calmVisuals}>
              Calm visuals
            </button>
          </header>

          <div className="player__stage">
            <Visualizer hue={t.art.hue} />
            <div className="readout" aria-live="off">
              <div className="readout__ear"><span>L</span><strong>{formatHz(left)}</strong></div>
              <div className="readout__beat">
                <strong>{formatHz(s.beat)}</strong>
                <span>{BAND_LABEL[bandFor(s.beat)]} beat</span>
              </div>
              <div className="readout__ear"><span>R</span><strong>{formatHz(right)}</strong></div>
            </div>
            {stage && (
              <p className="player__stageinfo">
                Stage {s.stageIndex + 1}/{stages!.length}: <strong>{stage.label}</strong>
                {next && <> · next: {next.label} at {formatClock(next.at * 60)}</>}
              </p>
            )}
          </div>

          <div className="player__bottom">
            <div className="scrub">
              <span>{formatClock(s.elapsed)}</span>
              <input
                type="range"
                min={0}
                max={Math.max(1, s.endAt)}
                step={1}
                value={Math.min(s.elapsed, s.endAt)}
                onChange={(e) => seek(+e.target.value)}
                aria-label="Session position"
                aria-valuetext={`${formatClock(s.elapsed)} of ${formatClock(s.endAt)}`}
                style={{ "--p": `${(Math.min(s.elapsed, s.endAt) / Math.max(1, s.endAt)) * 100}%` } as React.CSSProperties}
              />
              <span>-{formatClock(Math.max(0, s.endAt - s.elapsed))}</span>
            </div>
            <div className="controls">
              <div className="controls__side">
                <button className={`ctl ${panel === "mixer" ? "is-on" : ""}`} onClick={() => setPanel(panel === "mixer" ? null : "mixer")} aria-expanded={panel === "mixer"}>
                  <Icon name="sliders" size={22} /><span>Mixer</span>
                </button>
                <button className={`ctl ${panel === "timer" ? "is-on" : ""}`} onClick={() => setPanel(panel === "timer" ? null : "timer")} aria-expanded={panel === "timer"}>
                  <Icon name="timer" size={22} /><span>{s.timer ? `${s.timer} min` : "Timer"}</span>
                </button>
                <button className={`ctl ${panel === "test" ? "is-on" : ""}`} onClick={() => setPanel(panel === "test" ? null : "test")} aria-expanded={panel === "test"}>
                  <Icon name="headphones" size={22} /><span>L/R test</span>
                </button>
              </div>
              <div className="controls__main">
                <button className="icon-btn icon-btn--plain" onClick={() => seek(s.elapsed - 30)} aria-label="Back 30 seconds"><Icon name="replay" size={26} /></button>
                <button className="play-big" onClick={togglePlay} aria-label={s.status === "paused" ? "Play" : "Pause"}>
                  <Icon name={s.status === "paused" ? "play" : "pause"} size={34} />
                </button>
                <button className="icon-btn icon-btn--plain" onClick={stop} aria-label="Stop session"><Icon name="stop" size={24} /></button>
              </div>
              <div className="controls__side controls__side--end">
                <label className="vol">
                  <Icon name={s.volume === 0 ? "mute" : "volume"} size={22} />
                  <span className="visually-hidden">Volume</span>
                  <input type="range" min={0} max={1} step={0.01} value={s.volume} onChange={(e) => setVolume(+e.target.value)} />
                </label>
              </div>
            </div>
            <AnimatePresence initial={false}>
              {panel && (
                <motion.div className="panel" key={panel} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.2 }}>
                  {panel === "mixer" && <Mixer />}
                  {panel === "timer" && <TimerPanel />}
                  {panel === "test" && <ChannelTest />}
                </motion.div>
              )}
            </AnimatePresence>
            <p className="player__safety">Headphones required · keep volume low · never while driving</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
