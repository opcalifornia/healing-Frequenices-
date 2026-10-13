import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Aurora, Reveal, TiltCard, ZoomPage } from "../rooted/motion";
import { Evidence, SecTabs, Sheet, SourceLink, useToast } from "../rooted/ui";
import { ScheduleButton } from "../rooted/CalendarUI";
import { CAUSE_HUE, CAUSE_LABEL, DEED_IDEAS, EARTH_SOURCES, GIVE_TIPS, HABITS, IMPACT_NOTE, LOCAL, ORGS, RATERS, WHY, type Cause, type Habit, type WhyFinding } from "../rooted/earthContent";
import { useEarth, useMyDeeds, useMyPledges } from "../store/earth";
import { todayKey } from "../store/nourish";
import { Footer } from "../components/Footer";
import { Icon } from "../components/Icon";
import "../rooted/rooted.css";
import "./Breathe.css";
import "./Combos.css";
import "./Garden.css";
import "./Earth.css";

const TABS = [
  { id: "why", label: "Why it helps you" },
  { id: "ripple", label: "The ripple" },
  { id: "habits", label: "Footprint habits" },
  { id: "deeds", label: "Good deeds" },
  { id: "give", label: "Where to give" },
  { id: "local", label: "Act locally" },
];

const LAYERS = [
  { id: "you", label: "You", r: 16, hue: 120, body: "Giving time, money or care is linked with better mood and a sense of purpose. Time outdoors and feeling connected to nature are linked with wellbeing, too." },
  { id: "community", label: "Community", r: 30, hue: 165, body: "A meal delivered, a park cleaned, a neighbor checked on. Kindness also tends to be noticed and copied, so one act can prompt others." },
  { id: "planet", label: "Planet", r: 44, hue: 190, body: "Small habits add up across millions of people, and they help shift what feels normal. The biggest changes come from systems, so supporting good organizations and policies matters too." },
] as const;
type LayerId = (typeof LAYERS)[number]["id"];

/** One act spreading outward: you, then your community, then the planet. */
function Ripple({ active, onPick, hero = false }: { active?: LayerId; onPick?(id: LayerId): void; hero?: boolean }) {
  const still = useReducedMotion();
  return (
    <svg viewBox="0 0 100 100" className={`ripple ${hero ? "ripple--hero" : ""}`} role={onPick ? "group" : undefined} aria-label={onPick ? "How one act spreads" : undefined} aria-hidden={onPick ? undefined : true}>
      <defs>
        <radialGradient id={hero ? "rg-h" : "rg"} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#66bb6a" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#26c6da" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill={`url(#${hero ? "rg-h" : "rg"})`} />
      {!still && [0, 1, 2].map((i) => (
        <motion.circle key={i} cx="50" cy="50" className="ripple__wave" initial={{ r: 6, opacity: 0.7 }} animate={{ r: 48, opacity: 0 }} transition={{ duration: 4.5, repeat: Infinity, delay: i * 1.5, ease: "easeOut" }} />
      ))}
      {[...LAYERS].reverse().map((l, i) => (
        <motion.g key={l.id} className={`ripple__layer ${active === l.id ? "is-on" : ""}`} style={{ "--h": l.hue } as React.CSSProperties}
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 + (2 - i) * 0.25, type: "spring", stiffness: 120, damping: 14 }}
          onClick={onPick ? () => onPick(l.id) : undefined}
          role={onPick ? "button" : undefined} tabIndex={onPick ? 0 : undefined} aria-pressed={onPick ? active === l.id : undefined} aria-label={onPick ? l.label : undefined}
          onKeyDown={onPick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(l.id); } } : undefined}>
          <circle cx="50" cy="50" r={l.r} className="ripple__ring" />
          {!hero && <text x="50" y={l.id === "you" ? 51.5 : 50 - l.r + 6} textAnchor="middle" className="ripple__label">{l.label}</text>}
        </motion.g>
      ))}
      {[0, 72, 144, 216, 288].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        return <motion.circle key={deg} r="1.4" className="ripple__dot" cx={50 + Math.cos(rad) * 30} cy={50 + Math.sin(rad) * 30} animate={still ? undefined : { opacity: [0.3, 1, 0.3] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.6 }} />;
      })}
      <circle cx="50" cy="50" r="3" className="ripple__core" />
    </svg>
  );
}

function Toggle({ on }: { on: boolean }) {
  return <span className={`pledge__toggle ${on ? "is-on" : ""}`} aria-hidden="true"><motion.span layout transition={{ type: "spring", stiffness: 500, damping: 32 }} /></span>;
}

const niceDate = (d: string) => {
  const [y, m, day] = d.split("-").map(Number);
  return new Date(y, m - 1, day).toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

export default function Earth() {
  const [layer, setLayer] = useState<LayerId>("you");
  const [why, setWhy] = useState<WhyFinding | null>(null);
  const [habit, setHabit] = useState<Habit | null>(null);
  const [cause, setCause] = useState<Cause | "all">("all");
  const [draft, setDraft] = useState("");
  const pledges = useMyPledges();
  const deeds = useMyDeeds();
  const { togglePledge, addDeed, removeDeed } = useEarth();
  const toast = useToast();
  const L = LAYERS.find((l) => l.id === layer)!;
  const orgs = cause === "all" ? ORGS : ORGS.filter((o) => o.cause === cause);
  const causes = Object.keys(CAUSE_LABEL) as Cause[];
  const thisWeek = (() => {
    const cut = new Date();
    cut.setDate(cut.getDate() - 6);
    const key = todayKey(cut);
    return deeds.filter((d) => d.date >= key).length;
  })();

  const toggle = (h: Habit) => {
    const was = pledges.includes(h.id);
    togglePledge(h.id);
    toast.show(was ? `Removed "${h.name}" from your pledges` : `Pledged: ${h.name}`);
  };
  const submit = (text = draft) => {
    if (!text.trim()) return;
    addDeed(text);
    setDraft("");
    toast.show("Logged. Nice work.");
  };

  return (
    <ZoomPage className="rooted earth">
      <header className="sec-hero earth__hero">
        <Aurora />
        <div className="earth__demo"><Ripple hero /></div>
        <div className="sec-hero__text">
          <motion.span className="rooted__eyebrow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>Rooted · Earth &amp; Give Back</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.7 }}>Care for it.<br />It cares back.</motion.h1>
          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32, duration: 0.7 }}>
            Giving, volunteering and time in nature are linked with better wellbeing. Here's what the research says, small habits that lighten your footprint, and trusted places to give your time or money.
          </motion.p>
          <motion.div className="breathe__cta" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42, duration: 0.7 }}>
            <a className="btn btn--primary btn--big" href="#habits" onClick={(e) => { e.preventDefault(); document.getElementById("habits")?.scrollIntoView({ behavior: "smooth" }); }}><Icon name="leaf" size={22} /> Pick a habit</a>
            {(pledges.length > 0 || deeds.length > 0) && <span className="breathe__stat">{pledges.length} pledge{pledges.length === 1 ? "" : "s"} · {deeds.length} good deed{deeds.length === 1 ? "" : "s"} logged</span>}
          </motion.div>
        </div>
      </header>

      <SecTabs tabs={TABS} />

      <section id="why" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Why it helps you</span>
          <h2>Giving and nature, by the evidence</h2>
          <p className="rooted__lead">Most of this research is observational: it shows links, not proof. We say so where it matters.</p>
        </Reveal>
        <div className="combo-grid">
          {WHY.map((w, i) => (
            <Reveal key={w.id} delay={(i % 3) * 0.06}>
              <TiltCard className="combo" onClick={() => setWhy(w)} label={`${w.title}: what the research says`} style={{ "--h": w.hue, "--h2": w.hue + 40 } as React.CSSProperties}>
                <span className="tech__short">Research</span>
                <h3>{w.title}</h3>
                <p>{w.doThis}</p>
                <span className="tech__foot"><Evidence s={w.rating} short /></span>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="ripple" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">The ripple</span>
          <h2>How one act spreads</h2>
          <p className="rooted__lead">Tap a ring.</p>
        </Reveal>
        <div className="ripple-wrap r-card">
          <div className="ripple-wrap__fig"><Ripple active={layer} onPick={setLayer} /></div>
          <AnimatePresence mode="wait">
            <motion.div key={L.id} className="ripple-wrap__info" style={{ "--h": L.hue } as React.CSSProperties} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
              <span className="tech__short">Ring {LAYERS.indexOf(L) + 1} of 3</span>
              <h3>{L.label}</h3>
              <p>{L.body}</p>
              <div className="ripple-wrap__steps">
                {LAYERS.map((l) => <button key={l.id} className={`chip ${layer === l.id ? "is-on" : ""}`} aria-pressed={layer === l.id} onClick={() => setLayer(l.id)}>{l.label}</button>)}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <section id="habits" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Footprint habits</span>
          <h2>{pledges.length ? `${pledges.length} habit${pledges.length === 1 ? "" : "s"} pledged` : "Pledge a small habit"}</h2>
          <p className="rooted__lead">Toggle the ones you'll try. Tap a name for why it matters and how to start.</p>
        </Reveal>
        <div className="pledges">
          {HABITS.map((h, i) => {
            const on = pledges.includes(h.id);
            return (
              <Reveal key={h.id} delay={(i % 3) * 0.05}>
                <div className={`r-card pledge ${on ? "is-on" : ""}`} style={{ "--h": h.hue } as React.CSSProperties}>
                  <button className="pledge__info" onClick={() => setHabit(h)} aria-label={`${h.name}: details`}>
                    <span className={`pledge__impact pledge__impact--${h.impact.toLowerCase()}`}>{h.impact} impact</span>
                    <strong>{h.name}</strong>
                    <span className="pledge__short">{h.short}</span>
                  </button>
                  <button className="pledge__btn" role="switch" aria-checked={on} aria-label={`Pledge: ${h.name}`} onClick={() => toggle(h)}>
                    <Toggle on={on} />
                  </button>
                </div>
              </Reveal>
            );
          })}
        </div>
        <p className="for-you earth__note"><Icon name="info" size={18} /><span><strong>About impact:</strong> {IMPACT_NOTE}</span></p>
      </section>

      <section id="deeds" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Good deeds</span>
          <h2>{deeds.length ? `${thisWeek} this week` : "Your good deeds journal"}</h2>
          <p className="rooted__lead">Noting kind acts is a small reflection practice. It's private to this profile.</p>
        </Reveal>
        <div className="deeds r-card">
          <form className="deeds__form" onSubmit={(e) => { e.preventDefault(); submit(); }}>
            <label className="sr-only" htmlFor="deed-text">What did you do?</label>
            <input id="deed-text" className="deeds__input" value={draft} maxLength={280} onChange={(e) => setDraft(e.target.value)} placeholder="Something kind I did today…" />
            <button className="btn btn--primary" type="submit" disabled={!draft.trim()}><Icon name="plus" size={18} /> Log it</button>
          </form>
          <div className="deeds__ideas">
            {DEED_IDEAS.map((d) => <button key={d} className="chip" onClick={() => submit(d)}>{d}</button>)}
          </div>
          <ul className="deeds__list">
            <AnimatePresence initial={false}>
              {deeds.slice(0, 30).map((d) => (
                <motion.li key={d.id} layout initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <span className="deeds__date">{niceDate(d.date)}</span>
                  <span className="deeds__text">{d.text}</span>
                  <button className="icon-btn slist__rm" onClick={() => removeDeed(d.id)} aria-label={`Remove: ${d.text}`}><Icon name="trash" size={16} /></button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
          {!deeds.length && <p className="deeds__empty">Nothing logged yet. Tap an idea above to start.</p>}
        </div>
      </section>

      <section id="give" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Where to give</span>
          <h2>Well-known nonprofits</h2>
          <p className="rooted__lead">Long-standing organizations across the causes people ask about most. We don't quote ratings because they change. Check the raters below before you give.</p>
        </Reveal>
        <div className="tdetail__mins earth__causes">
          <button className={`chip ${cause === "all" ? "is-on" : ""}`} aria-pressed={cause === "all"} onClick={() => setCause("all")}>All</button>
          {causes.map((c) => <button key={c} className={`chip ${cause === c ? "is-on" : ""}`} aria-pressed={cause === c} onClick={() => setCause(c)}>{CAUSE_LABEL[c]}</button>)}
        </div>
        <motion.div className="orgs" layout>
          <AnimatePresence>
            {orgs.map((o) => (
              <motion.a key={o.id} layout href={o.url} target="_blank" rel="noreferrer" className="org r-card" style={{ "--h": CAUSE_HUE[o.cause] } as React.CSSProperties}
                initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} whileHover={{ y: -3 }}>
                <span className="tech__short">{CAUSE_LABEL[o.cause]}</span>
                <strong>{o.name}</strong>
                <p>{o.what}</p>
                <span className="org__go">Visit site ↗</span>
              </motion.a>
            ))}
          </AnimatePresence>
        </motion.div>
        <div className="raters r-card">
          <h3><Icon name="info" size={18} /> Check ratings first</h3>
          <ul>{GIVE_TIPS.map((t) => <li key={t}>{t}</li>)}</ul>
          <div className="raters__links">{RATERS.map((r) => <a key={r.text} className="btn btn--secondary btn--small" href={r.url} target="_blank" rel="noreferrer">{r.text.split(":")[0]} ↗</a>)}</div>
        </div>
      </section>

      <section id="local" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Act locally</span>
          <h2>Get outside and help</h2>
          <p className="rooted__lead">Many of these combine three things linked with wellbeing at once: time outdoors, other people, and doing some good.</p>
        </Reveal>
        <div className="rules">
          {LOCAL.map((a, i) => (
            <Reveal key={a.id} delay={(i % 3) * 0.05} className="r-card rule basic">
              <div style={{ "--h": a.hue } as React.CSSProperties} className="basic__dot" />
              <h3>{a.title}</h3>
              <p>{a.body}</p>
              <div className="local__links">{a.links.map((l) => <a key={l.text} href={l.url} target="_blank" rel="noreferrer" className="src-link">{l.text} ↗</a>)}</div>
            </Reveal>
          ))}
        </div>
        <div className="earth__schedule r-card">
          <div>
            <h3>Make it a regular thing</h3>
            <p>A standing slot makes it far more likely to happen. Pick a morning and put it on the calendar.</p>
          </div>
          <ScheduleButton draft={{ title: "Volunteer morning", kind: "other", minutes: 120, repeat: "weekly", to: "/earth", time: "09:00", note: "Food bank, cleanup, community garden, or a nature walk with iNaturalist." }} label="Schedule a volunteer morning" className="btn btn--primary" />
        </div>
        <p className="nourish__src">{EARTH_SOURCES.map((s) => <SourceLink key={s.text} s={s} />)}</p>
      </section>

      <Sheet open={!!why} onClose={() => setWhy(null)} label={why?.title ?? ""}>
        {why && (
          <article className="tdetail" style={{ "--h": why.hue, "--h2": why.hue + 40 } as React.CSSProperties}>
            <div className="tdetail__top combo-detail__top">
              <span className="rooted__eyebrow">What the research says</span>
              <h2>{why.title}</h2>
              <Evidence s={why.rating} />
            </div>
            <div className="tdetail__body">
              <section><h3>The findings</h3><p>{why.body}</p></section>
              <section><h3>Try this</h3><p>{why.doThis}</p></section>
              {why.source && <p className="nourish__src"><SourceLink s={why.source} /></p>}
            </div>
          </article>
        )}
      </Sheet>

      <Sheet open={!!habit} onClose={() => setHabit(null)} label={habit?.name ?? ""}>
        {habit && (
          <article className="tdetail" style={{ "--h": habit.hue, "--h2": habit.hue + 40 } as React.CSSProperties}>
            <div className="tdetail__top combo-detail__top">
              <span className="rooted__eyebrow">{habit.impact} impact</span>
              <h2>{habit.name}</h2>
              <p>{habit.short}</p>
            </div>
            <div className="tdetail__body">
              <div className="grow-actions">
                {pledges.includes(habit.id)
                  ? <button className="btn btn--secondary" onClick={() => toggle(habit)}><Icon name="check" size={18} /> Pledged · remove</button>
                  : <button className="btn btn--primary" onClick={() => toggle(habit)}><Icon name="leaf" size={18} /> I'll try this</button>}
              </div>
              <section><h3>Why it matters</h3><p>{habit.why}</p></section>
              <section><h3>Start small</h3><p>{habit.start}</p></section>
              {habit.bonus && <p className="for-you"><span><strong>Bonus for you:</strong> {habit.bonus}</span></p>}
              {habit.source && <p className="nourish__src"><SourceLink s={habit.source} /></p>}
            </div>
          </article>
        )}
      </Sheet>
      {toast.node}
      <Footer />
    </ZoomPage>
  );
}
