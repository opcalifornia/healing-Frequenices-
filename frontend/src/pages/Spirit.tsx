import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Aurora, Reveal, TiltCard, ZoomPage } from "../rooted/motion";
import { Evidence, SecTabs, Sheet, SourceLink } from "../rooted/ui";
import { CHAKRAS, SPIRIT_FINDINGS, TRADITIONS, type Tradition } from "../rooted/spiritContent";
import { BOWLS, chimes, gong, setBathVolume, startSoundBath, strikeBowl } from "../rooted/soundbath";
import { soundsLikeCrisis } from "../rooted/supportContent";
import { CrisisNudge } from "../rooted/Crisis";
import { StressDiagram } from "../rooted/StressDiagram";
import { usePractice, usePracticeLog } from "../store/practice";
import { useJournal, useJournalEntries } from "../store/journal";
import { todayKey } from "../store/nourish";
import { Footer } from "../components/Footer";
import { Icon } from "../components/Icon";
import "../rooted/rooted.css";
import "./Breathe.css";
import "./Support.css";
import "./Move.css";
import "./Combos.css";
import "./BrainGuide.css";
import { ProgramRail } from "../rooted/ProgramRail";
import "./Light.css";
import "./Spirit.css";

const TABS = [
  { id: "sound", label: "Sound bath" },
  { id: "sit", label: "Meditate" },
  { id: "gratitude", label: "Gratitude" },
  { id: "traditions", label: "Traditions" },
];

type Ripple = { id: number; x: number; hue: number };

/** Tap the bowls, or let a sound bath play itself. */
function SoundBath() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [mins, setMins] = useState(10);
  const [left, setLeft] = useState(0);
  const [vol, setVol] = useState(0.9);
  const stopRef = useRef<(() => void) | null>(null);
  const log = usePractice((s) => s.log);
  const started = useRef(0);
  const n = useRef(0);
  const running = left > 0;

  const ripple = (x: number, hue: number) => {
    const id = ++n.current;
    setRipples((r) => [...r.slice(-8), { id, x, hue }]);
    setTimeout(() => setRipples((r) => r.filter((q) => q.id !== id)), 6000);
  };
  const playBowl = (i: number) => {
    strikeBowl(BOWLS[i].hz, { pan: (i - 2) * 0.3 });
    ripple((i + 0.5) / BOWLS.length, BOWLS[i].hue);
  };

  const stop = (completed: boolean) => {
    stopRef.current?.();
    stopRef.current = null;
    if (completed) strikeBowl(BOWLS[0].hz, { soft: true, length: 1.4 });
    const m = (performance.now() - started.current) / 60000;
    if (m >= 1) log("soundbath", m);
    setLeft(0);
  };
  const start = () => {
    started.current = performance.now();
    stopRef.current = startSoundBath((kind, id) => {
      if (kind === "gong") ripple(0.5, 30);
      else if (kind === "chimes") ripple(0.85, 50);
      else {
        const i = BOWLS.findIndex((b) => b.id === id);
        ripple((i + 0.5) / BOWLS.length, BOWLS[i].hue);
      }
    });
    setLeft(mins * 60);
  };
  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => (left <= 1 ? stop(true) : setLeft(left - 1)), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left, running]);
  useEffect(() => () => stopRef.current?.(), []);

  return (
    <div className="bath r-card">
      <div className="bath__stage" aria-hidden="true">
        <AnimatePresence>
          {ripples.map((r) => (
            <motion.span key={r.id} className="bath__ripple" style={{ left: `${r.x * 100}%`, "--h": r.hue } as React.CSSProperties} initial={{ scale: 0.2, opacity: 0.9 }} animate={{ scale: 5, opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 6, ease: "easeOut" }} />
          ))}
        </AnimatePresence>
      </div>
      <div className="bath__bowls" role="group" aria-label="Singing bowls">
        {BOWLS.map((b, i) => (
          <motion.button key={b.id} className="bowl" onClick={() => playBowl(i)} whileTap={{ scale: 0.92, rotate: -2 }} style={{ "--h": b.hue } as React.CSSProperties} aria-label={`Strike the ${b.name.toLowerCase()}`}>
            <span className="bowl__body" />
            <span className="bowl__name">{b.name}</span>
          </motion.button>
        ))}
      </div>
      <div className="bath__extras">
        <button className="btn btn--secondary btn--small" onClick={() => { chimes(5); ripple(0.85, 50); }}>Wind chimes</button>
        <button className="btn btn--secondary btn--small" onClick={() => { gong(); ripple(0.5, 30); }}>Gong</button>
        <label className="bath__vol"><Icon name="volume" size={18} /><input type="range" min={0.1} max={1.2} step={0.05} value={vol} onChange={(e) => { setVol(+e.target.value); setBathVolume(+e.target.value); }} aria-label="Sound bath volume" /></label>
      </div>
      <div className="bath__auto">
        {running ? (
          <>
            <span className="bath__time">{Math.floor(left / 60)}:{String(left % 60).padStart(2, "0")}</span>
            <span className="bath__hint">Lie down, close your eyes, and let the sound wash over you.</span>
            <button className="btn btn--secondary btn--small" onClick={() => stop(false)}>End</button>
          </>
        ) : (
          <>
            <div className="tdetail__mins" role="radiogroup" aria-label="Sound bath length">
              {[5, 10, 20, 30].map((m) => <button key={m} role="radio" aria-checked={mins === m} className={`chip ${mins === m ? "is-on" : ""}`} onClick={() => setMins(m)}>{m} min</button>)}
            </div>
            <button className="btn btn--primary" onClick={start}><Icon name="play" size={20} /> Start a sound bath</button>
          </>
        )}
      </div>
    </div>
  );
}

/** Silent meditation with bowl bells at the start, optional intervals, and the end. */
function MeditationTimer() {
  const [mins, setMins] = useState(10);
  const [interval, setIntervalMins] = useState(0);
  const [left, setLeft] = useState(0);
  const [total, setTotal] = useState(0);
  const log = usePractice((s) => s.log);
  const running = left > 0;
  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => {
      const next = left - 1;
      if (next <= 0) {
        [0, 2.2, 4.4].forEach((d) => setTimeout(() => strikeBowl(BOWLS[2].hz, { level: 0.18 }), d * 1000));
        log("meditate", total / 60);
      } else if (interval && (total - next) % (interval * 60) === 0) strikeBowl(BOWLS[4].hz, { level: 0.12, soft: true });
      setLeft(next);
    }, 1000);
    return () => clearTimeout(t);
  }, [left, running, interval, total, log]);
  const start = () => {
    strikeBowl(BOWLS[2].hz, { level: 0.2 });
    setTotal(mins * 60);
    setLeft(mins * 60);
  };
  const pct = total ? 1 - left / total : 0;
  return (
    <div className="sit r-card">
      <div className="sit__ring">
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="44" pathLength="1" className="week-ring__bg" />
          <motion.circle cx="50" cy="50" r="44" pathLength="1" className="sit__fill" animate={{ pathLength: Math.max(0.001, pct) }} transition={{ duration: 1, ease: "linear" }} />
        </svg>
        <motion.span className="sit__glow" animate={running ? { scale: [0.85, 1, 0.85], opacity: [0.4, 0.8, 0.4] } : { scale: 0.85, opacity: 0.4 }} transition={running ? { duration: 10, repeat: Infinity, ease: "easeInOut" } : { duration: 0.5 }} />
        <span className="sit__time" aria-live="off">{running ? `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}` : `${mins}:00`}</span>
      </div>
      <div className="sit__controls">
        {running ? (
          <>
            <p className="sit__cue">Rest your attention on your breath. When your mind wanders, and it will, gently come back. That coming back is the practice.</p>
            <button className="btn btn--secondary" onClick={() => setLeft(0)}>End early</button>
          </>
        ) : (
          <>
            <span className="rooted__eyebrow">Length</span>
            <div className="tdetail__mins">{[3, 5, 10, 20, 30].map((m) => <button key={m} className={`chip ${mins === m ? "is-on" : ""}`} aria-pressed={mins === m} onClick={() => setMins(m)}>{m} min</button>)}</div>
            <span className="rooted__eyebrow">Interval bell</span>
            <div className="tdetail__mins">{[0, 1, 5].map((m) => <button key={m} className={`chip ${interval === m ? "is-on" : ""}`} aria-pressed={interval === m} onClick={() => setIntervalMins(m)}>{m ? `Every ${m} min` : "None"}</button>)}</div>
            <button className="btn btn--primary btn--big" onClick={start}><Icon name="play" size={22} /> Begin</button>
          </>
        )}
      </div>
    </div>
  );
}

function Gratitude() {
  const [lines, setLines] = useState(["", "", ""]);
  const [saved, setSaved] = useState(false);
  const add = useJournal((s) => s.add);
  const entries = useJournalEntries();
  const days = new Set(entries.map((e) => e.day));
  let streak = 0;
  const d = new Date();
  if (!days.has(todayKey(d))) d.setDate(d.getDate() - 1);
  while (days.has(todayKey(d))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  const recent = [...entries].reverse().slice(0, 3);
  return (
    <div className="grat">
      <div className="r-card grat__form">
        <h3>Three good things from today</h3>
        <p>And, if you like, why each one happened.</p>
        <div className="cp__lines">
          {lines.map((l, k) => (
            <input key={k} value={l} onChange={(e) => { const n = [...lines]; n[k] = e.target.value; setLines(n); setSaved(false); }} placeholder={["Something that made you smile", "Someone you're glad for", "A small win"][k]} aria-label={`Good thing ${k + 1}`} />
          ))}
        </div>
        {soundsLikeCrisis(lines.join(" ")) && <CrisisNudge />}
        <div className="grat__actions">
          <button className="btn btn--primary" disabled={!lines.some((l) => l.trim())} onClick={() => { add("Three good things", lines); setLines(["", "", ""]); setSaved(true); }}>Save</button>
          <AnimatePresence>{saved && <motion.span className="slist__note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Saved. See you tomorrow.</motion.span>}</AnimatePresence>
          {streak > 0 && <span className="grat__streak">{streak}-day streak</span>}
        </div>
      </div>
      {recent.length > 0 && (
        <div className="grat__recent">
          {recent.map((j, k) => (
            <motion.div key={`${j.day}-${k}`} className="r-card journal__entry" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: k * 0.05 }}>
              <span className="journal__day">{new Date(`${j.day}T12:00`).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })} · {j.prompt}</span>
              <ul>{j.lines.map((l, x) => <li key={x}>{l}</li>)}</ul>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function ChakraMap() {
  const [on, setOn] = useState(3);
  const c = CHAKRAS[on];
  return (
    <div className="chakra r-card">
      <svg viewBox="0 0 120 200" className="chakra__body" role="img" aria-label="Seated figure with seven chakra points along the spine">
        <circle cx="60" cy="22" r="13" className="chakra__fig" />
        <path d="M60 36c-16 0-24 8-26 22l-6 46c-1 8 4 12 10 12h44c6 0 11-4 10-12l-6-46c-2-14-10-22-26-22Z" className="chakra__fig" />
        <path d="M20 150c10-14 30-20 40-20s30 6 40 20c-12 6-28 8-40 8s-28-2-40-8Z" className="chakra__fig" />
        {CHAKRAS.map((k, i) => (
          <g key={k.name} onClick={() => setOn(i)} style={{ cursor: "pointer" }}>
            {i === on && <motion.circle cx="60" cy={k.y * 200} r="12" fill={k.color} initial={{ opacity: 0.6, scale: 0.5 }} animate={{ opacity: [0.5, 0.15, 0.5], scale: [1, 1.6, 1] }} transition={{ duration: 3, repeat: Infinity }} style={{ transformOrigin: `60px ${k.y * 200}px` }} />}
            <circle cx="60" cy={k.y * 200} r={i === on ? 6 : 4.5} fill={k.color} stroke="#0b0d0a" strokeWidth="1.5" />
          </g>
        ))}
      </svg>
      <div className="chakra__info">
        <div className="chakra__pick" role="radiogroup" aria-label="Chakras">
          {CHAKRAS.map((k, i) => <button key={k.name} role="radio" aria-checked={on === i} className={on === i ? "is-on" : ""} style={{ "--c": k.color } as React.CSSProperties} onClick={() => setOn(i)}>{k.name}</button>)}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={on} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <h3 style={{ color: c.color }}>{c.name} <small>{c.sanskrit}</small></h3>
            <p><strong>Where:</strong> {c.where}. <strong>Theme:</strong> {c.theme}.</p>
            <p className="chakra__scan">Body scan: bring your attention to your {c.where.toLowerCase()}. Breathe slowly into that area for five breaths, and notice whatever is there without trying to change it.</p>
          </motion.div>
        </AnimatePresence>
        <p className="chakra__note">A traditional map for meditation and reflection, not an anatomical system.</p>
      </div>
    </div>
  );
}

export default function Spirit() {
  const [open, setOpen] = useState<Tradition | null>(null);
  const entries = usePracticeLog();
  const mins = entries.filter((e) => ["meditate", "soundbath"].includes(e.kind) && e.day === todayKey()).reduce((a, e) => a + e.minutes, 0);
  return (
    <ZoomPage className="rooted spirit">
      <header className="sec-hero spirit__hero">
        <Aurora />
        <div className="spirit__bowl" aria-hidden="true"><span /><span /><span /><i /></div>
        <div className="sec-hero__text">
          <motion.span className="rooted__eyebrow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>Rooted · Spirit &amp; Ritual</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.7 }}>Stillness,<br />sound and meaning.</motion.h1>
          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32, duration: 0.7 }}>
            Play singing bowls, sit in silence, write down what you're grateful for, and explore traditions from around the world, honestly labeled for what the
            research does and doesn't show.
          </motion.p>
          <motion.div className="breathe__cta" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42, duration: 0.7 }}>
            <button className="btn btn--primary btn--big" onClick={() => { strikeBowl(BOWLS[2].hz); document.getElementById("sound")?.scrollIntoView({ behavior: "smooth" }); }}><Icon name="play" size={22} /> Ring a bowl</button>
            {mins >= 1 && <span className="breathe__stat">{Math.round(mins)} min of stillness today</span>}
          </motion.div>
        </div>
      </header>

      <SecTabs tabs={TABS} />

      <section id="programs" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Programs</span>
          <h2>Build the habit, a day at a time</h2>
        </Reveal>
        <ProgramRail section="spirit" />
      </section>

      <section id="sound" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Sound bath</span>
          <h2>Singing bowls, chimes and gong</h2>
          <p className="rooted__lead">Tap a bowl to strike it, or start a sound bath and let it play itself. Every sound is synthesized live in your browser. Headphones or a good speaker help.</p>
        </Reveal>
        <Reveal><SoundBath /></Reveal>
      </section>

      <section id="sit" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Meditate</span>
          <h2>A quiet timer</h2>
          <p className="rooted__lead">A bowl to begin, an optional soft bell to bring you back, and three bowls to close. Nothing else.</p>
        </Reveal>
        <Reveal><MeditationTimer /></Reveal>
        <Reveal className="sec-block__head nourish__subhead">
          <h2>What stillness changes in your body</h2>
          <p className="rooted__lead">Switch between stressed and calm to see the two systems at work.</p>
        </Reveal>
        <Reveal><StressDiagram /></Reveal>
      </section>

      <section id="gratitude" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Gratitude</span>
          <h2>Write it down</h2>
          <p className="rooted__lead">A minute each evening. It trains your attention toward what's going right. Saved privately on this device.</p>
        </Reveal>
        <Gratitude />
      </section>

      <section className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">The evidence</span>
          <h2>What the research says</h2>
        </Reveal>
        <div className="findings spirit__findings">
          {SPIRIT_FINDINGS.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.06}>
              <div className="finding move-finding" style={{ "--h": f.hue } as React.CSSProperties}>
                <span className="finding__stat">{f.stat}</span>
                <span className="finding__label">{f.statLabel}</span>
                <h3>{f.title}</h3>
                <p className="move-finding__body">{f.body}</p>
                <div className="finding__foot"><Evidence s={f.rating} short /></div>
                <SourceLink s={f.source} />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="traditions" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Traditions</span>
          <h2>Practices from around the world, honestly</h2>
          <p className="rooted__lead">These practices matter to millions of people. We share where they come from, what people believe, what science has found, and a simple way to try each one.</p>
        </Reveal>
        <Reveal><ChakraMap /></Reveal>
        <div className="combo-grid spirit__traditions">
          {TRADITIONS.map((t, i) => (
            <Reveal key={t.id} delay={(i % 3) * 0.06}>
              <TiltCard className="combo" onClick={() => setOpen(t)} label={`${t.name}: learn more`} style={{ "--h": t.hue, "--h2": t.hue + 40 } as React.CSSProperties}>
                <span className="tech__short">{t.origin.split(/[,;]/)[0]}</span>
                <h3>{t.name}</h3>
                <p>{t.what}</p>
                <span className="tech__foot"><Evidence s={t.rating} short /></span>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      <Sheet open={!!open} onClose={() => setOpen(null)} label={open?.name ?? ""}>
        {open && (
          <article className="tdetail" style={{ "--h": open.hue, "--h2": open.hue + 40 } as React.CSSProperties}>
            <div className="tdetail__top combo-detail__top">
              <span className="rooted__eyebrow">{open.origin}</span>
              <h2>{open.name}</h2>
            </div>
            <div className="tdetail__body">
              <section><h3>What it is</h3><p>{open.what}</p></section>
              <section><h3>What science has found <Evidence s={open.rating} /></h3><p>{open.evidence}</p></section>
              {open.respect && <p className="pdetail__trad"><strong>With respect:</strong> {open.respect}</p>}
              <section className="spirit__try"><h3>Try it</h3><p>{open.tryIt}</p></section>
              {open.source && <SourceLink s={open.source} />}
            </div>
          </article>
        )}
      </Sheet>
      <Footer />
    </ZoomPage>
  );
}
