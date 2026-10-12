import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { track } from "../rooted/metrics";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Aurora, Reveal, ZoomPage } from "../rooted/motion";
import { AREAS, FEATURES, markVisited, useTried, type Area, type Feature } from "../rooted/features";
import { Footer } from "../components/Footer";
import { Icon } from "../components/Icon";
import "../rooted/rooted.css";
import "./Guide.css";

const AREA_HUE: Record<Area, number> = {
  "Start here": 95,
  "Relax & breathe": 200,
  "Body & movement": 20,
  Food: 80,
  "Sleep & light": 255,
  "Mind & spirit": 285,
  "Plan & track": 165,
  Support: 220,
  Sound: 262,
  "Your account": 40,
};

const AREA_BLURB: Record<Area, string> = {
  "Start here": "Four small things that make everything else work better.",
  "Relax & breathe": "Settle your body in a minute or two, and see what works for you.",
  "Body & movement": "Gentle movement, time outdoors, and the habits of long-lived places.",
  Food: "Eat, drink, shop and grow, guided by the evidence.",
  "Sleep & light": "Work with your body clock for steadier sleep and energy.",
  "Mind & spirit": "Stillness, gratitude, learning and giving back.",
  "Plan & track": "Put it on the calendar, see your week, bring a friend.",
  Support: "Help for hard moments, for you or someone you love.",
  Sound: "Healing Frequencies: listen, mix, build and save.",
  "Your account": "Profiles, sync, and control of your data.",
};

type Status = "all" | "new" | "tried";
const STATUS: Array<{ id: Status; label: string }> = [
  { id: "all", label: "All" },
  { id: "new", label: "Not tried yet" },
  { id: "tried", label: "Tried" },
];

const pathOf = (to: string) => to.split("#")[0] || "/";
const hashOf = (to: string) => to.split("#")[1];

/** Most pages don't scroll to a #section on arrival, so wait for it to render, then scroll there. */
function scrollWhenReady(id: string, reduce: boolean) {
  const started = Date.now();
  const tick = () => {
    const el = document.getElementById(id);
    if (el && !el.closest(".guide")) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
        el.focus({ preventScroll: true });
      }, 150);
      return;
    }
    if (Date.now() - started < 4000) setTimeout(tick, 100);
  };
  setTimeout(tick, 100);
}

function matchesQuery(f: Feature, q: string): boolean {
  if (!q) return true;
  const hay = `${f.title} ${f.what} ${f.why} ${f.area} ${pathOf(f.to).replace(/[/-]/g, " ")}`.toLowerCase();
  return q.split(/\s+/).every((w) => hay.includes(w));
}

function ProgressRing({ done, total }: { done: number; total: number }) {
  const reduce = useReducedMotion();
  const pct = total ? done / total : 0;
  return (
    <div className="guide-ring" role="img" aria-label={`You've tried ${done} of ${total} tools`}>
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <defs>
          <linearGradient id="guide-ring-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#9cc59a" />
            <stop offset="100%" stopColor="#e8d5b0" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="50" className="guide-ring__bg" />
        <motion.circle
          cx="60" cy="60" r="50"
          className="guide-ring__fg"
          stroke="url(#guide-ring-g)"
          initial={{ pathLength: reduce ? pct : 0 }}
          animate={{ pathLength: Math.max(pct, 0.001) }}
          transition={{ duration: reduce ? 0 : 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          style={{ rotate: -90, transformOrigin: "50% 50%" }}
        />
      </svg>
      <div className="guide-ring__text" aria-hidden="true">
        <strong>{done}</strong>
        <span>of {total}</span>
      </div>
    </div>
  );
}

function TryLink({ f, tried, className, children }: { f: Feature; tried: boolean; className: string; children: React.ReactNode }) {
  const reduce = !!useReducedMotion();
  const hash = hashOf(f.to);
  return (
    <Link
      to={f.to}
      className={className}
      aria-label={`${tried ? "Open" : "Try"} ${f.title}`}
      onClick={() => {
        // Tools that leave no data behind count as tried once opened from here.
        if (!f.triedBy) markVisited(f.id);
        if (hash) scrollWhenReady(hash, reduce);
      }}
    >
      {children}
    </Link>
  );
}

function FeatureCard({ f, tried }: { f: Feature; tried: boolean }) {
  return (
    <article className={`guide-card r-card ${tried ? "is-tried" : ""}`} style={{ "--h": AREA_HUE[f.area] } as React.CSSProperties}>
      <div className="guide-card__top">
        <span className="guide-card__emoji" aria-hidden="true">{f.emoji}</span>
        {tried ? (
          <span className="guide-badge guide-badge--tried"><Icon name="check" size={14} /> Tried</span>
        ) : (
          <span className="guide-badge guide-badge--new">New to you</span>
        )}
      </div>
      <h4>{f.title}</h4>
      <p className="guide-card__what">{f.what}</p>
      <details className="guide-card__why">
        <summary>Why it helps</summary>
        <p>{f.why}</p>
      </details>
      <div className="guide-card__foot">
        <span className="guide-card__mins">{f.minutes ? <><Icon name="timer" size={14} /> {f.minutes} min</> : <span className="guide-card__nomins">Any time</span>}</span>
        <TryLink f={f} tried={tried} className="btn btn--secondary btn--small guide-card__go">
          {tried ? "Open" : "Try it"} <Icon name="chevronRight" size={16} />
        </TryLink>
      </div>
    </article>
  );
}

export default function Guide() {
  useEffect(() => track("guide_opened"), []);
  const tried = useTried();
  const [status, setStatus] = useState<Status>("all");
  const [area, setArea] = useState<Area | "all">("all");
  const [query, setQuery] = useState("");
  const q = useDeferredValue(query.trim().toLowerCase());

  const total = FEATURES.length;
  const done = FEATURES.filter((f) => tried.has(f.id)).length;
  const starters = FEATURES.filter((f) => f.area === "Start here");

  const shown = useMemo(
    () =>
      FEATURES.filter(
        (f) =>
          (status === "all" || (status === "new" ? !tried.has(f.id) : tried.has(f.id))) &&
          (area === "all" || f.area === area) &&
          matchesQuery(f, q),
      ),
    [status, area, q, tried],
  );
  const groups = AREAS.map((a) => ({ area: a, items: shown.filter((f) => f.area === a) })).filter((g) => g.items.length);
  const filtered = status !== "all" || area !== "all" || q !== "";
  const reset = () => {
    setStatus("all");
    setArea("all");
    setQuery("");
  };

  return (
    <ZoomPage className="rooted guide">
      <header className="sec-hero guide__hero">
        <Aurora />
        <div className="guide__hero-inner">
          <div className="sec-hero__text">
            <motion.span className="rooted__eyebrow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>Rooted · Guide</motion.span>
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.7 }}>Everything Rooted can do</motion.h1>
            <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32, duration: 0.7 }}>
              A map of every tool in the app, what it's for, and how long it takes. The ones you haven't tried yet are marked, so you can find something new.
            </motion.p>
          </div>
          <motion.div className="guide__progress" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.6 }}>
            <ProgressRing done={done} total={total} />
            <p className="guide__progress-text">
              You've tried <strong>{done}</strong> of <strong>{total}</strong> tools.
              <span>{done === total ? " You've seen it all. Nicely done." : done === 0 ? " Start anywhere below." : ` ${total - done} still to discover.`}</span>
            </p>
            {done < total && (
              <button className="btn btn--secondary btn--small" onClick={() => { setStatus("new"); setArea("all"); document.getElementById("g-all")?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>
                Show what's new to me
              </button>
            )}
          </motion.div>
        </div>
      </header>

      <section className="sec-block guide__start" aria-labelledby="g-start-title">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Start here</span>
          <h2 id="g-start-title">Four essentials</h2>
          <p className="rooted__lead">{AREA_BLURB["Start here"]}</p>
        </Reveal>
        <ol className="guide-start">
          {starters.map((f, i) => {
            const t = tried.has(f.id);
            return (
              <Reveal as="li" key={f.id} delay={i * 0.06}>
                <TryLink f={f} tried={t} className={`guide-start__card ${t ? "is-tried" : ""}`}>
                  <span className="guide-start__num" aria-hidden="true">{t ? <Icon name="check" size={16} /> : i + 1}</span>
                  <span className="guide-start__emoji" aria-hidden="true">{f.emoji}</span>
                  <strong>{f.title}</strong>
                  <span className="guide-start__what">{f.what}</span>
                  <span className="guide-start__meta">{t ? "Tried" : "New to you"}{f.minutes ? ` · ${f.minutes} min` : ""}</span>
                </TryLink>
              </Reveal>
            );
          })}
        </ol>
      </section>

      <section className="sec-block guide__all" id="g-all" aria-labelledby="g-all-title">
        <div className="sec-block__head">
          <span className="rooted__eyebrow">Every tool</span>
          <h2 id="g-all-title">Find your next thing</h2>
        </div>

        <div className="guide-controls r-card">
          <label className="guide-search">
            <span className="guide-search__label">Search tools</span>
            <span className="guide-search__box">
              <Icon name="search" size={18} />
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Try “sleep”, “water” or “calendar”" />
              {query && <button type="button" className="guide-search__clear" onClick={() => setQuery("")} aria-label="Clear search"><Icon name="close" size={16} /></button>}
            </span>
          </label>
          <div className="guide-filter" role="group" aria-label="Show tools">
            {STATUS.map((s) => (
              <button key={s.id} type="button" className={`chip ${status === s.id ? "is-on" : ""}`} aria-pressed={status === s.id} onClick={() => setStatus(s.id)}>
                {s.label}
                {s.id === "new" && <span className="guide-filter__n">{total - done}</span>}
              </button>
            ))}
          </div>
          <div className="guide-filter" role="group" aria-label="Filter by area">
            <button type="button" className={`chip ${area === "all" ? "is-on" : ""}`} aria-pressed={area === "all"} onClick={() => setArea("all")}>All areas</button>
            {AREAS.map((a) => (
              <button key={a} type="button" className={`chip guide-chip ${area === a ? "is-on" : ""}`} aria-pressed={area === a} onClick={() => setArea(a)} style={{ "--h": AREA_HUE[a] } as React.CSSProperties}>
                {a}
              </button>
            ))}
          </div>
          <p className="guide-count" role="status" aria-live="polite">
            {filtered ? `Showing ${shown.length} of ${total} tools` : `${total} tools in ${AREAS.length} areas`}
            {filtered && <button type="button" className="guide-count__reset" onClick={reset}>Clear filters</button>}
          </p>
        </div>

        {groups.length === 0 ? (
          <div className="guide-empty r-card">
            <strong>{status === "new" && !q && area === "all" ? "You've tried every tool. Wonderful." : "Nothing matches that."}</strong>
            <p>Try a different word or area, or clear the filters.</p>
            <button type="button" className="btn btn--secondary btn--small" onClick={reset}>Clear filters</button>
          </div>
        ) : (
          groups.map((g) => {
            const all = FEATURES.filter((f) => f.area === g.area);
            const n = all.filter((f) => tried.has(f.id)).length;
            const slug = g.area.toLowerCase().replace(/[^a-z]+/g, "-");
            return (
              <section key={g.area} className="guide-group" aria-labelledby={`g-${slug}`} style={{ "--h": AREA_HUE[g.area] } as React.CSSProperties}>
                <Reveal className="guide-group__head">
                  <h3 id={`g-${slug}`} className="guide-group__title">{g.area}</h3>
                  <span className="guide-group__count">{n} of {all.length} tried</span>
                  <p>{AREA_BLURB[g.area]}</p>
                </Reveal>
                <ul className="guide-grid">
                  {g.items.map((f, i) => (
                    <Reveal as="li" key={f.id} delay={(i % 3) * 0.05}>
                      <FeatureCard f={f} tried={tried.has(f.id)} />
                    </Reveal>
                  ))}
                </ul>
              </section>
            );
          })
        )}
      </section>
      <Footer />
    </ZoomPage>
  );
}
