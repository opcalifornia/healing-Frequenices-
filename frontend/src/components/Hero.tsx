import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { useArt } from "../art/useArt";
import { specForTitle } from "../art/painter";
import { Icon } from "./Icon";
import { LiveWaves } from "./LiveWaves";
import { MetaRow } from "./MetaRow";
import { FavoriteButton, PlayButton } from "./TitleActions";
import type { Title } from "../types";
import "./Hero.css";

export const HERO_INTERVAL = 8000;

function HeroArt({ title }: { title: Title }) {
  const url = useArt(specForTitle(title), "hero");
  if (!url) return <div className="hero__img skeleton" />;
  return (
    <>
      <img className="hero__img art-drift" src={url} alt="" />
      <LiveWaves seed={title.id} hue={title.art.hue} beat={title.beat} />
    </>
  );
}

function badgeFor(t: Title): string {
  if (t.comingSoon) return "Coming soon";
  if (t.kind === "program") return "Deep Sync original";
  if (t.isNew) return "New session";
  return "Featured";
}

/** Full-bleed hero carousel: cross-fades every 8 s, pauses on hover/focus,
 *  hidden tab or when the user presses pause; no auto-advance with reduced motion. */
export function Hero({ titles }: { titles: Title[] }) {
  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [hidden, setHidden] = useState(document.hidden);
  const reduce = useReducedMotion();
  const root = useRef<HTMLElement>(null);
  const count = titles.length;
  const paused = hovering || userPaused || hidden || !!reduce;

  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);

  useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    if (paused || count < 2) return;
    const t = window.setTimeout(() => go(index + 1), HERO_INTERVAL);
    return () => window.clearTimeout(t);
  }, [index, paused, count, go]);

  // Pre-paint neighbouring slides so the cross-fade never waits on canvas work.
  const nextTitle = titles[(index + 1) % count];
  useArt(nextTitle ? specForTitle(nextTitle) : null, "hero");

  if (!count) return <div className="hero hero--skeleton skeleton" />;
  const t = titles[index];

  return (
    <section
      ref={root}
      className="hero"
      aria-roledescription="carousel"
      aria-label="Featured"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={(e) => !root.current?.contains(e.relatedTarget as Node) && setHovering(false)}
      onKeyDown={(e) => {
        if ((e.target as HTMLElement).closest("button, a")) return;
        if (e.key === "ArrowRight") go(index + 1);
        if (e.key === "ArrowLeft") go(index - 1);
      }}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={t.id}
          className="hero__media"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 0.9, ease: "easeInOut" }, scale: { duration: HERO_INTERVAL / 1000 + 1, ease: "linear" } }}
        >
          <HeroArt title={t} />
        </motion.div>
      </AnimatePresence>
      <div className="hero__scrim" />

      <div className="hero__content" aria-live={paused ? "polite" : "off"}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={t.id}
            className="hero__text"
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${count}: ${t.name}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <span className="hero__eyebrow">{badgeFor(t)}</span>
            <h1 className="hero__title">
              <Link to={`/title/${t.id}`}>{t.name}</Link>
            </h1>
            <MetaRow title={t} />
            <p className="hero__desc">{t.description}</p>
            <div className="hero__actions">
              <PlayButton title={t} />
              <FavoriteButton title={t} />
              {!t.comingSoon && (
                <Link to={`/title/${t.id}`} className="icon-btn" aria-label={`More about ${t.name}`}>
                  <Icon name="info" />
                </Link>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {count > 1 && (
          <div className="hero__pager">
            <div className="hero__dots" role="group" aria-label="Choose slide">
              {titles.map((s, i) => (
                <button
                  key={s.id}
                  aria-current={i === index ? "true" : undefined}
                  aria-label={`Slide ${i + 1}: ${s.name}`}
                  className={`hero__dot ${i === index ? "is-active" : ""}`}
                  onClick={() => go(i)}
                >
                  {i === index && (
                    <span
                      key={`${s.id}-${paused}`}
                      className={`hero__dot-fill ${paused ? "is-paused" : ""}`}
                      style={{ animationDuration: `${HERO_INTERVAL}ms` }}
                    />
                  )}
                </button>
              ))}
            </div>
            <button
              className="hero__pause"
              onClick={() => setUserPaused((p) => !p)}
              aria-label={userPaused ? "Resume slideshow" : "Pause slideshow"}
            >
              <Icon name={userPaused ? "play" : "pause"} size={14} />
            </button>
          </div>
        )}
      </div>

      {count > 1 && (
        <>
          <button className="hero__arrow hero__arrow--prev" aria-label="Previous slide" onClick={() => go(index - 1)}>
            <Icon name="chevronLeft" size={40} />
          </button>
          <button className="hero__arrow hero__arrow--next" aria-label="Next slide" onClick={() => go(index + 1)}>
            <Icon name="chevronRight" size={40} />
          </button>
        </>
      )}
    </section>
  );
}
