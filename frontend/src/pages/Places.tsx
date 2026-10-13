import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Aurora, Reveal, TiltCard, ZoomPage } from "../rooted/motion";
import { Evidence, SecTabs, Sheet, SourceLink, useToast } from "../rooted/ui";
import { ScheduleButton } from "../rooted/CalendarUI";
import {
  BLUE_ZONES, BLUE_ZONE_CAVEAT, BRING_HOME, HEALING_PLACES, PLACES_SOURCES, POWER_9,
  RETREAT_GREEN_FLAGS, RETREAT_QUESTIONS, RETREAT_RED_FLAGS, type BlueZone, type HealingPlace,
} from "../rooted/placesContent";
import { Footer } from "../components/Footer";
import { Icon } from "../components/Icon";
import "../rooted/rooted.css";
import "./BrainGuide.css";
import "./Breathe.css";
import "./Combos.css";
import "./Garden.css";
import "./Places.css";

const TABS = [
  { id: "zones", label: "Blue Zones" },
  { id: "power9", label: "Power 9" },
  { id: "places", label: "Healing places" },
  { id: "dose", label: "Your nature dose" },
  { id: "retreats", label: "Retreats" },
  { id: "home", label: "Bring it home" },
];

/* ---------- World map (equirectangular projection, no map library) ---------- */

const W = 1000;
const H = 500;
const px = (lon: number) => ((lon + 180) / 360) * W;
const py = (lat: number) => ((90 - lat) / 180) * H;
const shape = (pts: Array<[number, number]>) => `M${pts.map(([lon, lat]) => `${px(lon).toFixed(1)} ${py(lat).toFixed(1)}`).join("L")}Z`;

/** Very rough, stylized continent outlines as [lon, lat] points. */
const LAND: Array<Array<[number, number]>> = [
  // North and Central America
  [[-168, 65], [-160, 71], [-140, 70], [-120, 74], [-95, 72], [-80, 73], [-65, 62], [-56, 52], [-66, 45], [-70, 42], [-76, 35], [-81, 31], [-80, 25], [-83, 29], [-90, 29], [-97, 26], [-97, 21], [-92, 18], [-87, 21], [-88, 15], [-83, 9], [-78, 8], [-80, 7], [-86, 11], [-92, 14], [-105, 20], [-110, 23], [-112, 29], [-117, 32], [-122, 37], [-124, 42], [-124, 48], [-130, 55], [-140, 60], [-150, 60], [-158, 57], [-165, 60]],
  // Greenland
  [[-55, 60], [-44, 60], [-20, 70], [-20, 82], [-60, 82], [-70, 77], [-56, 70]],
  // South America
  [[-78, 8], [-72, 12], [-62, 11], [-50, 2], [-35, -5], [-38, -13], [-41, -22], [-48, -26], [-58, -35], [-65, -41], [-68, -50], [-70, -55], [-74, -50], [-73, -40], [-71, -30], [-70, -18], [-76, -14], [-81, -5], [-80, 0]],
  // Eurasia
  [[-10, 36], [-9, 43], [-2, 44], [-5, 48], [2, 51], [8, 54], [5, 58], [10, 63], [20, 70], [30, 71], [42, 67], [60, 70], [80, 73], [100, 77], [115, 73], [140, 72], [160, 70], [180, 68], [180, 65], [165, 60], [160, 55], [142, 52], [140, 46], [135, 43], [128, 35], [126, 38], [122, 40], [122, 31], [120, 25], [110, 20], [108, 12], [105, 9], [100, 13], [100, 4], [104, 1], [98, 8], [97, 17], [92, 22], [88, 22], [80, 15], [77, 8], [73, 17], [67, 24], [58, 25], [56, 27], [50, 30], [48, 29], [56, 22], [52, 16], [44, 12], [40, 16], [34, 28], [32, 31], [35, 36], [28, 36], [26, 40], [23, 37], [20, 40], [13, 45], [18, 40], [16, 38], [12, 42], [8, 44], [3, 43], [0, 39], [-5, 36]],
  // Africa
  [[-17, 21], [-17, 15], [-12, 8], [-8, 4], [5, 5], [9, 4], [10, -2], [13, -10], [12, -18], [15, -27], [18, -34], [25, -34], [32, -28], [35, -23], [40, -15], [40, -5], [43, 0], [51, 11], [43, 12], [38, 18], [33, 28], [32, 31], [20, 32], [10, 37], [0, 36], [-6, 36], [-10, 30], [-15, 27]],
  // Australia
  [[114, -22], [114, -34], [118, -35], [130, -32], [138, -35], [141, -38], [147, -38], [150, -36], [153, -28], [153, -25], [146, -19], [142, -11], [136, -12], [132, -11], [126, -14], [122, -18]],
  // Japan
  [[130, 31], [135, 34], [140, 35], [141, 38], [142, 43], [145, 44], [141, 41], [140, 38], [136, 36], [131, 34]],
  // Great Britain
  [[-5, 50], [1, 51], [2, 53], [-2, 56], [-3, 58.5], [-6, 58], [-5, 54], [-3, 54], [-5, 52]],
  // Borneo, Sumatra, New Guinea, Madagascar, New Zealand
  [[109, 1], [117, 7], [119, 1], [116, -4], [110, -3]],
  [[95, 5], [106, -6], [104, -6], [98, 0]],
  [[131, -1], [141, -3], [150, -10], [141, -9], [137, -5]],
  [[44, -25], [47, -25], [50, -15], [49, -12], [44, -17]],
  [[172, -35], [178, -38], [175, -41], [168, -46], [167, -45], [173, -41]],
];

function WorldMap({ onOpen }: { onOpen(z: BlueZone): void }) {
  const [hover, setHover] = useState<string | null>(null);
  return (
    <div className="wmap r-card">
      <svg viewBox={`0 ${py(78)} ${W} ${py(-58) - py(78)}`} className="wmap__svg" role="group" aria-label="World map of the five Blue Zones">
        <defs>
          <radialGradient id="wmap-glow">
            <stop offset="0%" stopColor="var(--sec-1)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--sec-1)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g className="wmap__grid" aria-hidden="true">
          {[-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150].map((l) => <line key={`lo${l}`} x1={px(l)} x2={px(l)} y1={0} y2={H} />)}
          {[-45, -30, -15, 15, 30, 45, 60].map((l) => <line key={`la${l}`} x1={0} x2={W} y1={py(l)} y2={py(l)} />)}
          <line className="wmap__eq" x1={0} x2={W} y1={py(0)} y2={py(0)} />
        </g>
        <g className="wmap__land" aria-hidden="true">
          {LAND.map((p, i) => (
            <motion.path key={i} d={shape(p)} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05, duration: 0.6 }} />
          ))}
        </g>
        {BLUE_ZONES.map((z, i) => {
          const x = px(z.lon);
          const y = py(z.lat);
          const on = hover === z.id;
          const left = z.id === "sardinia";
          return (
            <g
              key={z.id}
              className={`wmap__pin ${on ? "is-on" : ""}`}
              style={{ "--h": z.hue, "--d": `${i * 0.5}s` } as React.CSSProperties}
              role="button"
              tabIndex={0}
              aria-label={`${z.name}, ${z.country}: read more`}
              onClick={() => onOpen(z)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(z); } }}
              onMouseEnter={() => setHover(z.id)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(z.id)}
              onBlur={() => setHover(null)}
            >
              <circle cx={x} cy={y} r={34} fill="url(#wmap-glow)" className="wmap__halo" />
              <circle cx={x} cy={y} r={7} className="wmap__ring" />
              <circle cx={x} cy={y} r={7} className="wmap__ring wmap__ring--2" />
              <motion.circle cx={x} cy={y} r={6} className="wmap__dot" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.6 + i * 0.12, type: "spring", stiffness: 260, damping: 14 }} style={{ transformOrigin: `${x}px ${y}px` }} />
              <circle cx={x} cy={y} r={18} className="wmap__hit" />
              <text x={left ? x - 12 : x + 12} y={y + (z.id === "ikaria" ? 16 : -8)} textAnchor={left ? "end" : "start"} className="wmap__label">{z.name}</text>
            </g>
          );
        })}
      </svg>
      <p className="wmap__hint"><Icon name="info" size={16} /> Tap a glowing marker to see what researchers found there. The map is stylized, not to scale.</p>
    </div>
  );
}

/* ---------- Nature dose ring (White et al. 2019: ~120 min/week) ---------- */

function NatureDose() {
  const [mins, setMins] = useState(60);
  const goal = 120;
  const max = 300;
  const pct = Math.min(1, mins / max);
  const goalAt = goal / max;
  const ang = goalAt * 2 * Math.PI - Math.PI / 2;
  const met = mins >= goal;
  return (
    <div className="dose r-card">
      <div className="dose__ring">
        <svg viewBox="0 0 200 200" aria-hidden="true">
          <circle cx="100" cy="100" r="84" pathLength="1" className="dose__bg" />
          <motion.circle cx="100" cy="100" r="84" pathLength="1" className={`dose__fill ${met ? "is-met" : ""}`} initial={false} animate={{ pathLength: Math.max(0.005, pct) }} transition={{ type: "spring", stiffness: 90, damping: 18 }} style={{ rotate: -90, transformOrigin: "100px 100px" }} />
          <line x1={100 + Math.cos(ang) * 72} y1={100 + Math.sin(ang) * 72} x2={100 + Math.cos(ang) * 96} y2={100 + Math.sin(ang) * 96} className="dose__mark" />
          <text x={100 + Math.cos(ang) * 104} y={100 + Math.sin(ang) * 104 + 4} className="dose__marklabel" textAnchor="start">120</text>
        </svg>
        <div className="dose__center">
          <strong>{mins}</strong>
          <span>min / week</span>
        </div>
      </div>
      <div className="dose__body">
        <h3>How much time in nature do you get in a typical week?</h3>
        <input type="range" min={0} max={max} step={10} value={mins} onChange={(e) => setMins(+e.target.value)} aria-label="Minutes in nature per week" className="dose__slider" />
        <p className={`dose__msg ${met ? "is-met" : ""}`}>
          {met
            ? "You're at or above the level where benefits showed up in the research. Keep it going, in whatever chunks suit you."
            : mins === 0
              ? "Start small: even a 10-minute walk in a park counts."
              : `About ${goal - mins} more minutes a week would reach the 120-minute mark. That's roughly ${Math.ceil((goal - mins) / 20)} extra 20-minute walk${Math.ceil((goal - mins) / 20) === 1 ? "" : "s"}.`}
        </p>
        <p className="dose__note">In a study of about 20,000 people in England, those who spent at least 120 minutes a week in nature were more likely to report good health and wellbeing, whether in one visit or several shorter ones. Benefits leveled off around 200 to 300 minutes. It's an association, not a prescription. <Evidence s="Moderate" short /></p>
        <ScheduleButton draft={{ title: "Nature walk", kind: "move", minutes: 20, repeat: "weekly", to: "/places", time: "09:00" }} label="Schedule a nature walk" />
      </div>
    </div>
  );
}

/* ---------- Hero art: ripples on water under a soft sun ---------- */

function Ripples() {
  return (
    <svg viewBox="0 0 200 200" className="places__ripples" aria-hidden="true">
      <circle cx="100" cy="64" r="22" className="places__sun" />
      {[0, 1, 2, 3].map((i) => (
        <ellipse key={i} cx="100" cy="136" rx="20" ry="6" className="places__ripple" style={{ animationDelay: `${i * 1.5}s` }} />
      ))}
      <path d="M20 140c20-6 40 6 60 0s40-6 60 0 40 6 60 0" className="places__wave" />
      <path d="M10 156c22-6 44 6 66 0s44-6 66 0 44 6 66 0" className="places__wave places__wave--2" />
    </svg>
  );
}

/* ---------- Bring it home checklist (remembered on this device) ---------- */

const HOME_KEY = "rooted.places.home";

function loadDone(): Record<string, true> {
  try {
    const raw = localStorage.getItem(HOME_KEY);
    return raw ? (JSON.parse(raw) as Record<string, true>) : {};
  } catch {
    return {};
  }
}

function BringHome() {
  const [done, setDone] = useState<Record<string, true>>(loadDone);
  useEffect(() => {
    try { localStorage.setItem(HOME_KEY, JSON.stringify(done)); } catch { /* storage unavailable */ }
  }, [done]);
  const n = BRING_HOME.filter((a) => done[a.id]).length;
  const toggle = (id: string) => setDone((d) => {
    const next = { ...d };
    if (next[id]) delete next[id]; else next[id] = true;
    return next;
  });
  return (
    <div className="home r-card">
      <div className="home__head">
        <div className="home__meter" aria-hidden="true">
          <motion.span animate={{ scaleX: n / BRING_HOME.length }} transition={{ type: "spring", stiffness: 120, damping: 20 }} />
        </div>
        <span className="home__count"><strong>{n}</strong> of {BRING_HOME.length} this week</span>
        {n > 0 && <button className="btn btn--secondary btn--small" onClick={() => setDone({})}>Start a new week</button>}
      </div>
      <ul className="home__list">
        {BRING_HOME.map((a) => {
          const on = !!done[a.id];
          return (
            <li key={a.id} style={{ "--h": a.hue } as React.CSSProperties}>
              <button className={`home__item ${on ? "is-on" : ""}`} aria-pressed={on} onClick={() => toggle(a.id)}>
                <span className="home__box">{on && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}><Icon name="check" size={16} /></motion.span>}</span>
                <span className="home__text">{a.text}<small>{a.place}</small></span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ---------- Page ---------- */

export default function Places() {
  const [zone, setZone] = useState<BlueZone | null>(null);
  const [place, setPlace] = useState<HealingPlace | null>(null);
  const toast = useToast();

  return (
    <ZoomPage className="rooted places">
      <header className="sec-hero places__hero">
        <Aurora />
        <div className="places__art"><Ripples /></div>
        <div className="sec-hero__text">
          <motion.span className="rooted__eyebrow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>Rooted · Healing Places</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.7 }}>Where we live<br />shapes how we live.</motion.h1>
          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32, duration: 0.7 }}>
            Blue Zones, forests, hot springs, coastlines and dark skies: what the research says, where it's debated, and how to bring a little of each place home.
          </motion.p>
          <motion.div className="breathe__cta" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42, duration: 0.7 }}>
            <a className="btn btn--primary btn--big" href="#zones" onClick={(e) => { e.preventDefault(); document.getElementById("zones")?.scrollIntoView({ behavior: "smooth" }); }}><Icon name="sparkle" size={22} /> Explore the map</a>
            <ScheduleButton draft={{ title: "Nature walk", kind: "move", minutes: 20, repeat: "weekly", to: "/places", time: "09:00" }} label="Schedule a nature walk" className="btn btn--secondary btn--big" />
          </motion.div>
        </div>
      </header>

      <SecTabs tabs={TABS} />

      <section id="zones" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Blue Zones</span>
          <h2>Five places known for long lives</h2>
          <p className="rooted__lead">Researchers reported unusually many people living into their 90s and 100s in these regions. Here's what they found, and what's still debated.</p>
        </Reveal>
        <Reveal><WorldMap onOpen={setZone} /></Reveal>
        <div className="zones">
          {BLUE_ZONES.map((z, i) => (
            <Reveal key={z.id} delay={i * 0.05}>
              <TiltCard className="zone" onClick={() => setZone(z)} label={`${z.name}: read more`} max={5} style={{ "--h": z.hue } as React.CSSProperties}>
                <span className="tech__short">{z.country}</span>
                <h3>{z.name}</h3>
                <p>{z.tagline}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
        <Reveal className="r-card zcaveat">
          <h3><Icon name="info" size={18} /> {BLUE_ZONE_CAVEAT.title}</h3>
          <p>{BLUE_ZONE_CAVEAT.body}</p>
          <Evidence s="Mixed" />
        </Reveal>
      </section>

      <section id="power9" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">The Power 9</span>
          <h2>Nine habits the zones share</h2>
          <p className="rooted__lead">Dan Buettner's team distilled these common threads. The rating shows how well each habit is supported by research on its own, outside the Blue Zones.</p>
        </Reveal>
        <div className="power9">
          {POWER_9.map((h, i) => (
            <Reveal key={h.id} delay={(i % 3) * 0.05} className="r-card p9" style={{ "--h": h.hue } as React.CSSProperties}>
              <div className="p9__top">
                <span className="p9__n">{i + 1}</span>
                <span className="p9__group">{h.group}</span>
              </div>
              <h3>{h.title}</h3>
              <p>{h.body}</p>
              <Evidence s={h.rating} short />
            </Reveal>
          ))}
        </div>
      </section>

      <section id="places" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Healing places</span>
          <h2>Nature that may help you feel better</h2>
          <p className="rooted__lead">Tap a place for what the research says, how to stay safe, and how to get a taste of it close to home.</p>
        </Reveal>
        <div className="findings places-findings">
          {HEALING_PLACES.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06}>
              <TiltCard className="finding place-card" onClick={() => setPlace(p)} label={`${p.title}: read more`} style={{ "--h": p.hue } as React.CSSProperties}>
                <span className="finding__stat">{p.stat}</span>
                <span className="finding__label">{p.statLabel}</span>
                <h3>{p.title}<small>{p.kicker}</small></h3>
                <div className="finding__foot"><Evidence s={p.evidence} short /><span className="finding__more">Read more</span></div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="dose" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Your nature dose</span>
          <h2>About two hours a week</h2>
        </Reveal>
        <Reveal><NatureDose /></Reveal>
      </section>

      <section id="retreats" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Retreats</span>
          <h2>How to vet a wellness retreat</h2>
          <p className="rooted__lead">A good retreat can offer rest, skills and community. A bad one can be expensive or dangerous. Look for these before you book.</p>
        </Reveal>
        <div className="rules">
          {RETREAT_GREEN_FLAGS.map((g, i) => (
            <Reveal key={g.title} delay={(i % 3) * 0.05} className="r-card rule">
              <span className="rule__n retreat__ok"><Icon name="check" size={16} /></span>
              <h3>{g.title}</h3>
              <p>{g.body}</p>
            </Reveal>
          ))}
        </div>
        <div className="retreat__cols">
          <Reveal className="r-card pdetail__caution retreat__red">
            <h3><Icon name="info" size={18} /> Red flags: walk away</h3>
            <ul className="pdetail__list">{RETREAT_RED_FLAGS.map((r) => <li key={r}>{r}</li>)}</ul>
          </Reveal>
          <Reveal delay={0.08} className="r-card retreat__ask">
            <h3>Questions to ask before you pay</h3>
            <ol>{RETREAT_QUESTIONS.map((q) => <li key={q}>{q}</li>)}</ol>
            <p className="for-you"><span><strong>Tip:</strong> share the retreat's schedule with your doctor if you have a health condition, take regular medicines, or are pregnant.</span></p>
          </Reveal>
        </div>
      </section>

      <section id="home" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Bring it home</span>
          <h2>A healing place, a little every week</h2>
          <p className="rooted__lead">You don't need a plane ticket. Tick these off as you go; they're saved on this device.</p>
        </Reveal>
        <Reveal><BringHome /></Reveal>
        <div className="home__sched">
          <ScheduleButton draft={{ title: "Nature walk", kind: "move", minutes: 20, repeat: "weekly", to: "/places", time: "09:00" }} label="Schedule a nature walk" />
          <ScheduleButton draft={{ title: "Unplugged rest, Blue Zone style", kind: "spirit", minutes: 120, repeat: "weekly", to: "/places", time: "14:00" }} label="Schedule unplugged rest" />
          <ScheduleButton draft={{ title: "Look up at the night sky", kind: "spirit", minutes: 15, repeat: "weekly", to: "/places", time: "21:30" }} label="Schedule stargazing" />
        </div>
        <details className="sources places__sources">
          <summary>Sources</summary>
          <ol>{PLACES_SOURCES.map((s) => <li key={s.text}><SourceLink s={s} /></li>)}</ol>
        </details>
      </section>

      <Sheet open={!!zone} onClose={() => setZone(null)} label={zone?.name ?? ""}>
        {zone && (
          <article className="tdetail" style={{ "--h": zone.hue, "--h2": zone.hue + 30 } as React.CSSProperties}>
            <div className="tdetail__top combo-detail__top">
              <span className="rooted__eyebrow">Blue Zone · {zone.country}</span>
              <h2>{zone.name}</h2>
              <p>{zone.tagline}</p>
            </div>
            <div className="tdetail__body">
              <section>
                <h3>How people lived</h3>
                <ul className="pdetail__list">{zone.life.map((l) => <li key={l}>{l}</li>)}</ul>
              </section>
              <section><h3>What the research says</h3><p>{zone.research}</p></section>
              <section className="pdetail__caution">
                <h3><Icon name="info" size={18} /> Honest caveats</h3>
                <p>{zone.caveat}</p>
              </section>
              <div className="fdetail__do"><strong>Bring it home</strong><p>{zone.bringHome}</p></div>
            </div>
          </article>
        )}
      </Sheet>

      <Sheet open={!!place} onClose={() => setPlace(null)} label={place?.title ?? ""}>
        {place && (
          <article className="fdetail" style={{ "--h": place.hue } as React.CSSProperties}>
            <div className="fdetail__top">
              <span className="finding__stat">{place.stat}</span>
              <span className="finding__label">{place.statLabel}</span>
            </div>
            <div className="fdetail__body">
              <span className="rooted__eyebrow">{place.kicker}</span>
              <h2>{place.title}</h2>
              <Evidence s={place.evidence} />
              <p className="place__note">{place.evidenceNote}</p>
              <p>{place.body}</p>
              <section className="pdetail__caution">
                <h3><Icon name="info" size={18} /> Stay safe</h3>
                <ul className="pdetail__list">{place.cautions.map((c) => <li key={c}>{c}</li>)}</ul>
              </section>
              <div className="fdetail__do">
                <strong>Bring it home</strong>
                <ul className="pdetail__list">{place.bringHome.map((b) => <li key={b}>{b}</li>)}</ul>
              </div>
              <div className="grow-actions">
                <ScheduleButton
                  draft={{ title: place.id === "springs" ? "Warm bath wind-down" : place.id === "dark" ? "Look up at the night sky" : `${place.title} time`, kind: place.id === "springs" || place.id === "dark" ? "spirit" : "move", minutes: place.id === "dark" ? 15 : 20, repeat: "weekly", to: "/places", time: place.id === "springs" ? "20:30" : place.id === "dark" ? "21:30" : "09:00" }}
                  label="Add to my calendar"
                />
                <button className="btn btn--secondary btn--small" onClick={() => { setPlace(null); toast.show("Scroll to Bring it home to track it"); document.getElementById("home")?.scrollIntoView({ behavior: "smooth" }); }}>Go to my checklist</button>
              </div>
              {place.source && <SourceLink s={place.source} />}
            </div>
          </article>
        )}
      </Sheet>
      {toast.node}
      <Footer />
    </ZoomPage>
  );
}
