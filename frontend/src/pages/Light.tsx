import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Aurora, Reveal, TiltCard, ZoomPage } from "../rooted/motion";
import { Evidence, SecTabs, Sheet, SourceLink, useModalFocus, useToast } from "../rooted/ui";
import { BANDS, LIGHT_FINDINGS, LIGHT_GEAR, LIGHT_SAFETY, LIGHT_SOURCES, type LightFinding } from "../rooted/lightContent";
import { LightLevels } from "../learn/diagrams/SleepDiagrams";
import { SunTracker } from "../rooted/SunTracker";
import { ClockPathway, SkinDepth } from "../rooted/LightDiagrams";
import { chime, unlockChime } from "../rooted/chime";
import { usePractice } from "../store/practice";
import { useNourish, useShoppingList } from "../store/nourish";
import { usePlan, toMinutes, fromMinutes } from "../store/bedtime";
import { Footer } from "../components/Footer";
import { Icon } from "../components/Icon";
import "../rooted/rooted.css";
import "./BrainGuide.css";
import "./SleepGuide.css";
import "./Breathe.css";
import "./Light.css";

const TABS = [
  { id: "sun", label: "Follow the sun" },
  { id: "spectrum", label: "The spectrum" },
  { id: "clock", label: "Your body clock" },
  { id: "tools", label: "Light tools" },
  { id: "day", label: "Your light day" },
  { id: "healing", label: "Healing light" },
  { id: "harm", label: "Harmful light" },
  { id: "myths", label: "Myths" },
];

const MIN_NM = 280;
const MAX_NM = 1000;
const x = (nm: number) => ((nm - MIN_NM) / (MAX_NM - MIN_NM)) * 100;

function Spectrum() {
  const [on, setOn] = useState("blue");
  const b = BANDS.find((q) => q.id === on)!;
  return (
    <div className="spectrum r-card">
      <div className="spectrum__bar" role="group" aria-label="Light spectrum">
        <div className="spectrum__visible" style={{ left: `${x(380)}%`, width: `${x(750) - x(380)}%` }} aria-hidden="true" />
        {BANDS.map((q) => (
          <button key={q.id} className={`spectrum__band ${on === q.id ? "is-on" : ""}`} style={{ left: `${x(q.nm[0])}%`, width: `${x(q.nm[1]) - x(q.nm[0])}%`, "--c": q.color } as React.CSSProperties} onClick={() => setOn(q.id)} aria-pressed={on === q.id} aria-label={q.name}>
            <span aria-hidden="true">{q.name}</span>
          </button>
        ))}
      </div>
      <div className="spectrum__axis" aria-hidden="true">
        {[300, 400, 500, 600, 700, 800, 900, 1000].map((nm) => <span key={nm} style={{ left: `${x(nm)}%` }}>{nm}</span>)}
        <em style={{ left: `${(x(380) + x(750)) / 2}%` }}>What your eyes can see</em>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={b.id} className="spectrum__info" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} style={{ "--c": b.color } as React.CSSProperties}>
          <h3><i /> {b.name} <small>{b.nm[0]}–{b.nm[1]} nm</small></h3>
          <div className="spectrum__cols">
            <p><strong>What it does for you</strong>{b.good}</p>
            <p><strong>Watch out for</strong>{b.harm}</p>
          </div>
          <Evidence s={b.rating} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

type ScreenMode = { kind: "night" } | { kind: "sunrise"; mins: number };

/** Full-screen warm night light, or a slow sunrise that brightens over a set time. */
function ScreenLight({ mode, onClose }: { mode: ScreenMode; onClose(): void }) {
  const [level, setLevel] = useState(0.35);
  const [t, setT] = useState(0);
  const start = useRef(performance.now());
  const root = useRef<HTMLDivElement>(null);
  useModalFocus(root, true, onClose, { lockScroll: false });
  useEffect(() => {
    let lock: { release(): Promise<void> } | null = null;
    const nav = navigator as Navigator & { wakeLock?: { request(t: "screen"): Promise<{ release(): Promise<void> }> } };
    nav.wakeLock?.request("screen").then((l) => (lock = l)).catch(() => undefined);
    let raf = 0;
    if (mode.kind === "sunrise") {
      const tick = () => {
        setT(Math.min(1, (performance.now() - start.current) / (mode.mins * 60000)));
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }
    return () => {
      cancelAnimationFrame(raf);
      void lock?.release().catch(() => undefined);
    };
  }, [mode]);

  // Sunrise: deep red, through orange and gold, to bright warm white.
  const sun = (p: number) => {
    const stops = [[40, 10, 6], [120, 20, 8], [230, 90, 30], [255, 170, 80], [255, 225, 170], [255, 246, 230]];
    const f = p * (stops.length - 1);
    const i = Math.min(stops.length - 2, Math.floor(f));
    const k = f - i;
    const c = stops[i].map((v, j) => Math.round(v + (stops[i + 1][j] - v) * k));
    return `rgb(${c.join(",")})`;
  };
  const bg = mode.kind === "night" ? `linear-gradient(rgba(255, 110, 20, ${level}), rgba(255, 110, 20, ${level})), #000` : sun(t);

  return createPortal(
    <motion.div ref={root} tabIndex={-1} aria-modal="true" className="screenlight" style={{ background: bg }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} role="dialog" aria-label={mode.kind === "night" ? "Night light" : "Sunrise"}>
      {mode.kind === "sunrise" && <div className="screenlight__sun" style={{ transform: `translate(-50%, ${25 - t * 45}%) scale(${0.7 + t * 0.7})`, opacity: 0.55 + t * 0.45 }} />}
      <div className="screenlight__ui" onClick={(e) => e.stopPropagation()}>
        {mode.kind === "night" ? (
          <label className="screenlight__dim"><span>Brightness</span><input type="range" min={0.06} max={0.9} step={0.02} value={level} onChange={(e) => setLevel(+e.target.value)} aria-label="Night light brightness" /></label>
        ) : (
          <span className="screenlight__progress">{Math.round(t * 100)}% · {Math.max(0, Math.ceil(mode.mins * (1 - t)))} min left</span>
        )}
        <button className="btn btn--secondary btn--small" onClick={onClose}>Done</button>
      </div>
    </motion.div>,
    document.body,
  );
}

/** Timer for a light box session (the box provides the light; this keeps time). */
function LightBoxTimer() {
  const [mins, setMins] = useState(20);
  const [left, setLeft] = useState(0);
  const total = useRef(0);
  const log = usePractice((s) => s.log);
  const running = left > 0;
  useEffect(() => {
    if (!running) return;
    const id = setTimeout(() => {
      if (left <= 1) {
        chime("bell", 0.08);
        log("light", total.current / 60);
      }
      setLeft(left - 1);
    }, 1000);
    return () => clearTimeout(id);
  }, [left, running, log]);
  const pct = total.current ? 1 - left / total.current : 0;
  return (
    <div className="lbox">
      <div className="lbox__sun" style={{ "--p": pct } as React.CSSProperties} aria-hidden="true"><span /></div>
      <div className="lbox__body">
        <h3>Light box session</h3>
        <p>Sit with your 10,000-lux box off to one side, 16 to 24 inches away, within an hour of waking. Read, eat breakfast, or have coffee. Don't stare at it.</p>
        {running ? (
          <div className="lbox__run">
            <span className="lbox__time">{Math.floor(left / 60)}:{String(left % 60).padStart(2, "0")}</span>
            <button className="btn btn--secondary btn--small" onClick={() => setLeft(0)}>Stop</button>
          </div>
        ) : (
          <div className="lbox__run">
            <div className="tdetail__mins">{[20, 30].map((m) => <button key={m} className={`chip ${mins === m ? "is-on" : ""}`} aria-pressed={mins === m} onClick={() => setMins(m)}>{m} min</button>)}</div>
            <button className="btn btn--primary btn--small" onClick={() => { unlockChime(); total.current = mins * 60; setLeft(mins * 60); }}><Icon name="play" size={18} /> Start</button>
          </div>
        )}
      </div>
    </div>
  );
}

function LightDay() {
  const plan = usePlan();
  const wake = toMinutes(plan.wake);
  const bed = toMinutes(plan.bedtime);
  const items = [
    { at: wake, title: "Get outside", body: "5 to 10 minutes of daylight within an hour of waking. 20+ on cloudy days.", c: "#ffd54f" },
    { at: wake + 30, title: "Light box (winter or low mood)", body: "20 to 30 minutes, if your doctor recommends it.", c: "#fff59d" },
    { at: (wake + bed) / 2 - 60, title: "Midday light", body: "Eat lunch outside or by a window, or take a short walk.", c: "#ffffff" },
    { at: bed - 180, title: "Start dimming", body: "Switch to lamps and warm light. Turn on night mode.", c: "#ffb74d" },
    { at: bed - 60, title: "Screens down", body: "Lower brightness, or swap to a book.", c: "#ff8a65" },
    { at: bed, title: "Lights out, room dark", body: "Blackout curtains or a mask. A dim red night light for night-time trips.", c: "#b71c1c" },
  ];
  return (
    <div className="lday r-card">
      <p className="lday__intro">Built from your bedtime routine: up at <strong>{plan.wake}</strong>, lights out at <strong>{plan.bedtime}</strong>. <Link to="/bedtime">Change it</Link></p>
      <ol className="lday__list">
        {items.map((it, i) => (
          <motion.li key={it.title} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} style={{ "--c": it.c } as React.CSSProperties}>
            <span className="lday__time">{fromMinutes(it.at)}</span>
            <span className="lday__dot" />
            <span><strong>{it.title}</strong><small>{it.body}</small></span>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

function FindingCard({ f, onOpen }: { f: LightFinding; onOpen(): void }) {
  return (
    <TiltCard className="finding light-finding" onClick={onOpen} label={`${f.title}: read more`} style={{ "--h": f.hue } as React.CSSProperties}>
      <span className="finding__stat">{f.stat}</span>
      <span className="finding__label">{f.statLabel}</span>
      <h3>{f.title}</h3>
      <div className="finding__foot"><Evidence s={f.rating} short /><span className="finding__more">Read more</span></div>
    </TiltCard>
  );
}

export default function Light() {
  const [screen, setScreen] = useState<ScreenMode | null>(null);
  const [finding, setFinding] = useState<LightFinding | null>(null);
  const addItem = useNourish((s) => s.addItem);
  const list = useShoppingList();
  const toast = useToast();
  const group = (k: LightFinding["kind"]) => LIGHT_FINDINGS.filter((f) => f.kind === k);

  return (
    <ZoomPage className="rooted light">
      <header className="sec-hero light__hero">
        <Aurora />
        <div className="light__prism" aria-hidden="true"><span className="light__beam" /><span className="light__tri" /><span className="light__rainbow" /></div>
        <div className="sec-hero__text">
          <motion.span className="rooted__eyebrow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>Rooted · Healing Light</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.7 }}>Light sets your clock,<br />your mood, your sleep.</motion.h1>
          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32, duration: 0.7 }}>
            Morning sun, light therapy, blue light, red light and UV: what helps, what harms, and what's hype, with tools to get the right light at the right time.
          </motion.p>
          <motion.div className="breathe__cta" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42, duration: 0.7 }}>
            <button className="btn btn--primary btn--big" onClick={() => setScreen({ kind: "night" })}><Icon name="sparkle" size={22} /> Night light</button>
            <button className="btn btn--secondary btn--big" onClick={() => setScreen({ kind: "sunrise", mins: 15 })}>Sunrise, 15 min</button>
          </motion.div>
        </div>
      </header>

      <SecTabs tabs={TABS} />

      <section id="sun" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Follow the sun</span>
          <h2>Where the sun is, right where you are</h2>
          <p className="rooted__lead">Slide through the day to watch the sun cross your sky and light up the Earth. Your body clock follows the same light.</p>
        </Reveal>
        <Reveal><SunTracker /></Reveal>
      </section>

      <section id="spectrum" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">The spectrum</span>
          <h2>Every color of light does something different</h2>
          <p className="rooted__lead">Tap a band. Wavelengths are in nanometers (nm): shorter is more energetic.</p>
        </Reveal>
        <Reveal><Spectrum /></Reveal>
      </section>

      <section id="clock" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Your body clock</span>
          <h2>How light tells your body what time it is</h2>
          <p className="rooted__lead">Your eyes don't just see. A special set of cells measures brightness and wires it straight to your brain's master clock. Switch between day and night to follow the signal.</p>
        </Reveal>
        <div className="lday-wrap">
          <Reveal><ClockPathway /></Reveal>
          <Reveal delay={0.08}>
            <div className="sec-block__head" style={{ marginBottom: 12 }}>
              <h3 className="light-sub">How deep light goes into your skin</h3>
            </div>
            <SkinDepth />
          </Reveal>
        </div>
      </section>

      <section id="tools" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Light tools</span>
          <h2>The right light, on demand</h2>
          <p className="rooted__lead">Your screen can be a gentle light cue. It isn't bright enough to be therapy: for that you need daylight or a proper light box.</p>
        </Reveal>
        <div className="ltools">
          <Reveal className="r-card ltool ltool--night">
            <span className="ltool__glow" aria-hidden="true" />
            <h3>Night light</h3>
            <p>A dim, warm amber screen for reading in bed or night-time trips. Warm, dim light disturbs your body clock the least.</p>
            <button className="btn btn--primary btn--small" onClick={() => setScreen({ kind: "night" })}>Turn on</button>
          </Reveal>
          <Reveal delay={0.06} className="r-card ltool ltool--sunrise">
            <span className="ltool__glow" aria-hidden="true" />
            <h3>Sunrise</h3>
            <p>Your screen glows from deep red to warm white over the time you choose. Prop it up by your bed as a gentle wake-up.</p>
            <div className="tdetail__mins">{[10, 20, 30].map((m) => <button key={m} className="chip" onClick={() => setScreen({ kind: "sunrise", mins: m })}>{m} min</button>)}</div>
          </Reveal>
          <Reveal delay={0.12} className="r-card ltool ltool--box"><LightBoxTimer /></Reveal>
        </div>
      </section>

      <section id="day" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Your light day</span>
          <h2>Bright days, dark nights</h2>
        </Reveal>
        <div className="lday-wrap">
          <Reveal><LightDay /></Reveal>
          <Reveal delay={0.08}><LightLevels /></Reveal>
        </div>
      </section>

      {(["healing", "harm", "myths"] as const).map((k) => (
        <section key={k} id={k} className="sec-block">
          <Reveal className="sec-block__head">
            <span className="rooted__eyebrow">{k === "healing" ? "Healing light" : k === "harm" ? "Harmful light" : "Myths"}</span>
            <h2>{k === "healing" ? "Light that helps" : k === "harm" ? "Light that hurts" : "What the evidence doesn't support"}</h2>
          </Reveal>
          <div className="findings light-findings">
            {group(k === "myths" ? "myth" : k).map((f, i) => (
              <Reveal key={f.id} delay={i * 0.06}><FindingCard f={f} onOpen={() => setFinding(f)} /></Reveal>
            ))}
          </div>
          {k === "harm" && (
            <Reveal className="r-card light-safety">
              <h3><Icon name="info" size={18} /> Before light therapy or bright light devices</h3>
              <ul>{LIGHT_SAFETY.map((s) => <li key={s}>{s}</li>)}</ul>
              <Link to="/learn/safety" className="src-link">Frequencies &amp; Your Health guide ↗</Link>
            </Reveal>
          )}
        </section>
      ))}

      <section className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Light gear</span>
          <h2>What's worth having</h2>
          <p className="rooted__lead">What to look for, if you want it. Tap to add to your shopping list.</p>
        </Reveal>
        <div className="gear">
          {LIGHT_GEAR.map((g, i) => {
            const inList = list.some((l) => l.id === g.id);
            return (
              <Reveal key={g.id} delay={(i % 3) * 0.05} className="r-card gear__item">
                <strong>{g.name}</strong>
                <p>{g.spec}</p>
                <button className={`btn btn--small ${inList ? "btn--secondary" : "btn--primary"}`} onClick={() => { if (!inList) { addItem({ id: g.id, name: g.name, aisle: g.aisle }); toast.show(`Added ${g.name}`); } }}>
                  <Icon name={inList ? "check" : "plus"} size={16} /> {inList ? "On your list" : "Add to list"}
                </button>
              </Reveal>
            );
          })}
        </div>
        <details className="sources light__sources">
          <summary>More sources</summary>
          <ol>{LIGHT_SOURCES.map((s) => <li key={s.text}><SourceLink s={s} /></li>)}</ol>
        </details>
      </section>

      <Sheet open={!!finding} onClose={() => setFinding(null)} label={finding?.title ?? ""}>
        {finding && (
          <article className="fdetail" style={{ "--h": finding.hue } as React.CSSProperties}>
            <div className="fdetail__top">
              <span className="finding__stat">{finding.stat}</span>
              <span className="finding__label">{finding.statLabel}</span>
            </div>
            <div className="fdetail__body">
              <h2>{finding.title}</h2>
              <Evidence s={finding.rating} />
              <p>{finding.body}</p>
              <div className="fdetail__do"><strong>Try this</strong><p>{finding.doThis}</p></div>
              {finding.source && <SourceLink s={finding.source} />}
            </div>
          </article>
        )}
      </Sheet>
      <AnimatePresence>{screen && <ScreenLight mode={screen} onClose={() => setScreen(null)} />}</AnimatePresence>
      {toast.node}
      <Footer />
    </ZoomPage>
  );
}
