import { useState } from "react";
import { Link } from "react-router-dom";
import { PageTransition } from "../components/PageTransition";
import { Footer } from "../components/Footer";
import { Chapter, Toc, useScrollSpy, type ChapterInfo } from "../learn/GuideParts";
import { TipList } from "../learn/diagrams/SleepDiagrams";
import { HEADPHONE_CHECKLIST, SAFETY_SOURCES, SAFETY_TIPS, SOUND_LEVELS, SPECTRUM, safeMinutes } from "../learn/safetyContent";
import "../components/Player.css";
import "./Build.css";
import "./BrainGuide.css";
import "./SleepGuide.css";
import "./SafetyGuide.css";

const CHAPTERS: ChapterInfo[] = [
  { id: "spectrum", n: 1, title: "What 'frequency' means" },
  { id: "loud", n: 2, title: "Loud sound" },
  { id: "flash", n: 3, title: "Flashing light" },
  { id: "low", n: 4, title: "Infrasound and low hums" },
  { id: "light", n: 5, title: "Light at night and UV" },
  { id: "radio", n: 6, title: "Wi-Fi, Bluetooth and 5G" },
  { id: "myths", n: 7, title: "Myths" },
  { id: "headphones", n: 8, title: "Headphones for binaural beats" },
];
const IDS = CHAPTERS.map((c) => c.id);

const MIN_EXP = 0;
const MAX_EXP = 20;
const pos = (hz: number) => ((Math.log10(hz) - MIN_EXP) / (MAX_EXP - MIN_EXP)) * 100;

function Spectrum() {
  const [open, setOpen] = useState<string>("Radio, Wi-Fi, Bluetooth, 5G");
  const ticks: Array<[number, string]> = [[1, "1 Hz"], [1e3, "1 kHz"], [1e6, "1 MHz"], [1e9, "1 GHz"], [1e12, "1 THz"], [1e15, "10¹⁵"], [1e18, "10¹⁸"]];
  const band = SPECTRUM.find((b) => b.name === open)!;
  return (
    <div className="diagram">
      <div className="spec">
        <div className="spec__axis" aria-hidden="true">
          {ticks.map(([hz, l]) => <span key={l} style={{ left: `${pos(hz)}%` }}>{l}</span>)}
        </div>
        <div className="spec__rows">
          {(["sound", "radio", "light", "ionizing"] as const).map((kind) => (
            <div key={kind} className="spec__row">
              <span className="spec__kind">{kind === "sound" ? "Sound (pressure waves)" : kind === "ionizing" ? "Ionizing" : kind === "radio" ? "Radio waves" : "Light"}</span>
              <div className="spec__track">
                {SPECTRUM.filter((b) => b.kind === kind).map((b) => (
                  <button
                    key={b.name}
                    className={`spec__band spec__band--${b.kind} ${open === b.name ? "is-on" : ""}`}
                    style={{ left: `${pos(b.lo)}%`, width: `${Math.max(1.5, pos(b.hi) - pos(b.lo))}%` }}
                    onClick={() => setOpen(b.name)}
                    aria-pressed={open === b.name}
                    title={b.name}
                  >
                    <span>{b.name}</span>
                  </button>
                ))}
                {kind !== "sound" && <i className="spec__ion" style={{ left: `${pos(7.5e14)}%` }} aria-hidden="true" />}
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="diagram__text" aria-live="polite"><strong>{band.name}.</strong> {band.note}</p>
      <p className="diagram__text">
        The dashed line marks where electromagnetic waves become ionizing, energetic enough to damage DNA. Everything your phone, router and
        headphones transmit sits far to its left. Sound is a different thing entirely: a pressure wave in air, not electromagnetic at all.
      </p>
    </div>
  );
}

function ListeningCalculator() {
  const [db, setDb] = useState(85);
  const mins = safeMinutes(db);
  const text = mins >= 60 ? `${(mins / 60).toFixed(mins >= 600 ? 0 : 1).replace(/\.0$/, "")} hours` : mins >= 1 ? `${Math.round(mins)} minutes` : `${Math.max(1, Math.round(mins * 60))} seconds`;
  const nearest = SOUND_LEVELS.reduce((a, b) => (Math.abs(b.db - db) < Math.abs(a.db - db) ? b : a));
  return (
    <div className="diagram">
      <label className="build__slider">
        <span>Sound level <small>decibels</small></span>
        <input type="range" min={70} max={115} step={1} value={db} onChange={(e) => setDb(+e.target.value)} aria-valuetext={`${db} decibels`} />
        <output>{db} dB</output>
      </label>
      <div className="calc__result" aria-live="polite">
        <strong className={mins < 60 ? "is-warn" : ""}>{db <= 80 ? "Comfortable all day" : `About ${text} a day`}</strong>
        <span>before you reach the NIOSH daily limit · roughly "{nearest.label.toLowerCase()}"</span>
      </div>
      <ul className="levels">
        {SOUND_LEVELS.map((l) => (
          <li key={l.label} style={{ "--p": `${((l.db - 20) / 100) * 100}%`, "--c": l.db < 70 ? "#19e3c4" : l.db < 90 ? "#ffc857" : "#ff7a8a" } as React.CSSProperties}>
            <span>{l.label}</span>
            <i aria-hidden="true" />
            <b>{l.db} dB</b>
          </li>
        ))}
      </ul>
      <p className="diagram__text">Every 3 dB louder halves the safe time. Binaural sessions only need to be just audible, far below these levels.</p>
    </div>
  );
}

export default function SafetyGuide() {
  const active = useScrollSpy(IDS);
  return (
    <PageTransition>
      <header className="safety__hero">
        <div className="guide__hero-text">
          <Link to="/learn" className="article__crumb">Learn · Guide</Link>
          <h1>Frequencies & Your Health</h1>
          <p>
            Which frequencies can actually harm your brain and body, which fears aren't backed by evidence, and how to set up your
            headphones so binaural beats work as intended.
          </p>
          <span className="article__meta">8 chapters · about 12 min</span>
        </div>
      </header>

      <div className="guide">
        <Toc chapters={CHAPTERS} active={active} />
        <div className="guide__body">
          <aside className="sleep__credit">
            <strong>The short version.</strong> The frequency risks that are well proven are <em>loud sound</em> (hearing loss),
            <em> flashing light</em> (seizures in people with photosensitive epilepsy), <em>bright light at night</em> (body clock) and
            <em> UV</em> (skin and eyes). Claims that Wi-Fi, Bluetooth or 5G harm the brain at everyday levels aren't supported by the evidence.
          </aside>

          <Chapter id="spectrum" n={1} title="What 'frequency' means" lead="'Frequency' just means how many times something repeats per second. Sound, radio and light all have frequencies, but they are very different things.">
            <Spectrum />
          </Chapter>

          <Chapter id="loud" n={2} title="Loud sound" lead="The most common way a frequency hurts you has nothing to do with which frequency it is. It's how loud, for how long.">
            <ListeningCalculator />
            <TipList tips={SAFETY_TIPS.loud} />
          </Chapter>

          <Chapter id="flash" n={3} title="Flashing light" lead="For people with photosensitive epilepsy, certain flicker rates are a genuine danger.">
            <TipList tips={SAFETY_TIPS.flash} />
          </Chapter>

          <Chapter id="low" n={4} title="Infrasound and low hums" lead="Sound below hearing gets a lot of attention online. Here is what's actually known.">
            <TipList tips={SAFETY_TIPS.low} />
          </Chapter>

          <Chapter id="light" n={5} title="Light at night and UV" lead="Light is a frequency too, and timing and type matter.">
            <TipList tips={SAFETY_TIPS.light} />
            <div className="try-row"><Link to="/learn/sleep" className="btn btn--secondary btn--small">Read the Better Sleep guide</Link></div>
          </Chapter>

          <Chapter id="radio" n={6} title="Wi-Fi, Bluetooth and 5G" lead="The most common worry. Here is what the research shows, with links so you can read it yourself.">
            <TipList tips={SAFETY_TIPS.radio} />
            <p className="diagram__text">All studies cited here are linked in Sources at the end of this guide.</p>
          </Chapter>

          <Chapter id="myths" n={7} title="Myths" lead="Popular claims in the frequency world that don't hold up.">
            <TipList tips={SAFETY_TIPS.myths} />
          </Chapter>

          <Chapter id="headphones" n={8} title="Headphones for binaural beats" lead="What actually matters is clean stereo: each tone in one ear only. A few phone settings quietly break that.">
            <ol className="hp">
              {HEADPHONE_CHECKLIST.map((h, i) => (
                <li key={h.title}>
                  <span className="hp__n">{i + 1}</span>
                  <div><strong>{h.title}</strong><p>{h.body}</p></div>
                </li>
              ))}
            </ol>
            <details className="sources">
              <summary>Sources and further reading</summary>
              <ol>
                {SAFETY_SOURCES.map((s) => (
                  <li key={s.text}>{s.url ? <a href={s.url} target="_blank" rel="noreferrer">{s.text}</a> : s.text}</li>
                ))}
              </ol>
            </details>
          </Chapter>
        </div>
      </div>
      <Footer />
    </PageTransition>
  );
}
