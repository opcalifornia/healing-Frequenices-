import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PageTransition } from "../components/PageTransition";
import { Footer } from "../components/Footer";
import { Icon } from "../components/Icon";
import { usePlayer } from "../store/player";
import { useLibrary, useUser } from "../store/user";
import { bandFor, customToTitle } from "../custom";
import { BAND_LABEL, BAND_RANGE, formatHz } from "../format";
import type { CustomSession, NoiseColor } from "../types";
import "../components/Player.css";
import "./Build.css";

const SOLFEGGIO = [174, 285, 396, 417, 528, 639, 741, 852, 963];
const PRESETS: Array<{ name: string; carrier: number; beat: number }> = [
  { name: "Sleep", carrier: 136, beat: 2.5 },
  { name: "Meditate", carrier: 200, beat: 6 },
  { name: "Relax", carrier: 200, beat: 10 },
  { name: "Focus", carrier: 250, beat: 15 },
  { name: "Gamma", carrier: 400, beat: 40 },
];
const PREVIEW_ID = "c-preview";

export default function Build() {
  const [carrier, setCarrier] = useState(200);
  const [beat, setBeat] = useState(10);
  const [noise, setNoise] = useState<NoiseColor | null>("pink");
  const [solfeggio, setSolfeggio] = useState<number | null>(null);
  const [isochronic, setIsochronic] = useState(false);
  const [name, setName] = useState("");
  const [saved, setSaved] = useState<string | null>(null);

  const current = usePlayer((s) => s.current);
  const status = usePlayer((s) => s.status);
  const { playTitle, retune, setNoise: pNoise, setSolfeggio: pSolf, setIsochronic: pIso, stop } = usePlayer.getState();
  const saveCustom = useUser((s) => s.saveCustom);
  const deleteCustom = useUser((s) => s.deleteCustom);
  const custom = useLibrary().custom;

  const previewing = current?.id === PREVIEW_ID && status !== "idle";
  const band = bandFor(beat);
  const draft: CustomSession = useMemo(
    () => ({ id: PREVIEW_ID, name: name.trim() || "Preview", carrier, beat, noise, solfeggio, isochronic, createdAt: new Date().toISOString() }),
    [name, carrier, beat, noise, solfeggio, isochronic],
  );

  const update = (c: number, b: number) => {
    setCarrier(c);
    setBeat(b);
    if (previewing) retune(c, b);
  };

  const togglePreview = () => {
    if (previewing) stop();
    else playTitle({ ...customToTitle(draft), durationMin: 60 });
  };

  const save = () => {
    const s = saveCustom({ name: name.trim() || `${BAND_LABEL[band]} ${formatHz(beat)}`, carrier, beat, noise, solfeggio, isochronic });
    setSaved(s.name);
    setName("");
  };

  return (
    <PageTransition padded>
      <div className="build">
        <div className="build__intro">
          <h1 className="page-title" style={{ padding: 0 }}>Build Your Own</h1>
          <p>Choose a carrier tone and a beat. Your left ear hears the carrier; your right ear hears carrier plus beat. Changes play live while previewing.</p>
        </div>

        <div className="build__card">
          <div className="build__readout">
            <div><span>Left ear</span><strong>{formatHz(carrier)}</strong></div>
            <div className="build__beat"><span>Beat</span><strong>{formatHz(beat)}</strong><em className={`band-pill band-pill--${band}`}>{BAND_LABEL[band]} · {BAND_RANGE[band]}</em></div>
            <div><span>Right ear</span><strong>{formatHz(+(carrier + beat).toFixed(2))}</strong></div>
          </div>

          <div className="build__presets" aria-label="Presets">
            {PRESETS.map((p) => (
              <button key={p.name} className={`chip ${p.carrier === carrier && p.beat === beat ? "is-on" : ""}`} onClick={() => update(p.carrier, p.beat)}>{p.name}</button>
            ))}
          </div>

          <label className="build__slider">
            <span>Carrier <small>100–400 Hz</small></span>
            <input type="range" min={100} max={400} step={1} value={carrier} onChange={(e) => update(+e.target.value, beat)} aria-valuetext={formatHz(carrier)} />
            <output>{formatHz(carrier)}</output>
          </label>
          <label className="build__slider">
            <span>Beat <small>0.5–40 Hz</small></span>
            <input type="range" min={0.5} max={40} step={0.1} value={beat} onChange={(e) => update(carrier, +e.target.value)} aria-valuetext={formatHz(beat)} />
            <output>{formatHz(beat)}</output>
          </label>
          <div className="build__bands" aria-hidden="true" style={{ gridTemplateColumns: "3.5fr 4fr 5fr 17fr 10fr" }}>
            {(["delta", "theta", "alpha", "beta", "gamma"] as const).map((b) => <span key={b} className={b === band ? "is-on" : ""}>{BAND_LABEL[b]}</span>)}
          </div>

          <div className="build__layers">
            <div className="layer__row">
              <span className="slider__label">Noise</span>
              <div className="seg" role="radiogroup" aria-label="Noise color">
                {([null, "pink", "brown", "surf"] as Array<NoiseColor | null>).map((c) => (
                  <button key={String(c)} role="radio" aria-checked={noise === c} className={noise === c ? "is-on" : ""} onClick={() => { setNoise(c); if (previewing) pNoise(c); }}>
                    {c ? c[0].toUpperCase() + c.slice(1) : "Off"}
                  </button>
                ))}
              </div>
            </div>
            <div className="layer__row">
              <label className="slider__label" htmlFor="b-solf">Solfeggio</label>
              <select id="b-solf" className="select" value={solfeggio ?? ""} onChange={(e) => { const v = e.target.value ? +e.target.value : null; setSolfeggio(v); if (previewing) pSolf(v); }}>
                <option value="">Off</option>
                {SOLFEGGIO.map((hz) => <option key={hz} value={hz}>{hz} Hz</option>)}
              </select>
            </div>
            <div className="layer__row">
              <span className="slider__label">Isochronic</span>
              <button className={`switch ${isochronic ? "is-on" : ""}`} role="switch" aria-checked={isochronic} aria-label="Isochronic tones" onClick={() => { setIsochronic(!isochronic); if (previewing) pIso(!isochronic); }}>
                <span />
              </button>
            </div>
          </div>

          <div className="build__actions">
            <button className="btn btn--primary" onClick={togglePreview}>
              <Icon name={previewing ? "stop" : "play"} size={20} /> {previewing ? "Stop preview" : "Preview"}
            </button>
            <div className="field build__name">
              <label htmlFor="b-name" className="visually-hidden">Session name</label>
              <input id="b-name" placeholder="Name your session" maxLength={40} value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <button className="btn btn--accent" onClick={save}><Icon name="bookmark" size={20} /> Save to My Stuff</button>
          </div>
          {saved && (
            <motion.p className="build__saved" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} role="status">
              Saved “{saved}”. Find it in <Link to="/my-stuff">My Stuff</Link>.
            </motion.p>
          )}
          <p className="build__safety">Headphones required. Keep the volume low. Beats above 30 Hz can feel intense, so start quietly.</p>
        </div>

        {custom.length > 0 && (
          <section className="build__saved-list">
            <h2 className="rail__title">Your sessions</h2>
            <ul>
              {custom.map((c) => (
                <li key={c.id}>
                  <button className="icon-btn icon-btn--small" onClick={() => playTitle(customToTitle(c))} aria-label={`Play ${c.name}`}><Icon name="play" size={16} /></button>
                  <span className="build__saved-name">{c.name}</span>
                  <span className="build__saved-meta">{formatHz(c.carrier)} · {formatHz(c.beat)} beat{c.noise ? ` · ${c.noise} noise` : ""}</span>
                  <button className="icon-btn icon-btn--small icon-btn--plain" onClick={() => { setCarrier(c.carrier); setBeat(c.beat); setNoise(c.noise); setSolfeggio(c.solfeggio); setIsochronic(c.isochronic); setName(c.name); }} aria-label={`Edit ${c.name}`}><Icon name="edit" size={16} /></button>
                  <button className="icon-btn icon-btn--small icon-btn--plain" onClick={() => deleteCustom(c.id)} aria-label={`Delete ${c.name}`}><Icon name="trash" size={16} /></button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
      <Footer />
    </PageTransition>
  );
}
