import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Aurora, Reveal, TiltCard, ZoomPage } from "../rooted/motion";
import { SECTIONS, OFFLINE_PROMPTS } from "../rooted/sections";
import { SectionArt } from "../rooted/SectionArt";
import { useActiveProfile } from "../store/user";
import { useShoppingList, useWater, useWaterGoal } from "../store/nourish";
import { Footer } from "../components/Footer";
import { Icon } from "../components/Icon";
import "../rooted/rooted.css";
import "./Hub.css";

function greeting(h: number) {
  if (h < 5) return "Still up";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function Hub() {
  const profile = useActiveProfile();
  const now = new Date();
  const h = now.getHours();
  const water = useWater();
  const goal = useWaterGoal();
  const listCount = useShoppingList().filter((i) => !i.checked).length;
  const [prompt, setPrompt] = useState(() => (now.getDate() * 7 + now.getMonth()) % OFFLINE_PROMPTS.length);

  const today = useMemo(() => {
    const evening = h >= 17 || h < 4;
    return [
      evening
        ? { to: "/bedtime", eyebrow: "Tonight", title: "Wind down for sleep", body: "Your routine of sounds and light cues, timed to your bedtime.", icon: "timer" as const }
        : { to: "/healing", eyebrow: h < 12 ? "This morning" : "This afternoon", title: h < 12 ? "Ten minutes of focus" : "A midday reset", body: "Pick a session from Healing Frequencies. Headphones on.", icon: "headphones" as const },
      { to: "/nourish#water", eyebrow: "Water", title: `${(water / 1000).toFixed(1)} of ${(goal / 1000).toFixed(1)} L`, body: water >= goal ? "You've hit today's goal." : "Tap to log a glass. Food counts for about a fifth of it.", icon: "plus" as const, progress: Math.min(1, water / goal) },
      { to: "/nourish#pantry", eyebrow: "Shopping list", title: listCount ? `${listCount} item${listCount === 1 ? "" : "s"} to get` : "Build your list", body: "Learn what each food and herb actually does, then add it to your list.", icon: "bookmark" as const },
    ];
  }, [h, water, goal, listCount]);

  return (
    <ZoomPage className="rooted hub">
      <header className="hub__hero">
        <Aurora />
        <div className="hub__hero-text">
          <motion.p className="rooted__eyebrow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            {now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.6 }}>
            {greeting(h)}{profile ? `, ${profile.name}` : ""}.
          </motion.h1>
          <motion.p className="hub__lede" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, duration: 0.6 }}>
            Small, proven habits for body and mind, with the evidence shown on every one. Start anywhere.
          </motion.p>
        </div>

        <div className="hub__today" role="list" aria-label="Today">
          {today.map((t, i) => (
            <motion.div key={t.to} role="listitem" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
              <Link to={t.to} className="today-card">
                <span className="today-card__icon"><Icon name={t.icon} size={20} /></span>
                <span className="today-card__eyebrow">{t.eyebrow}</span>
                <strong>{t.title}</strong>
                <span className="today-card__body">{t.body}</span>
                {"progress" in t && <span className="today-card__bar"><i style={{ width: `${(t.progress ?? 0) * 100}%` }} /></span>}
              </Link>
            </motion.div>
          ))}
        </div>
      </header>

      <section className="hub__sections" aria-labelledby="hub-sections">
        <Reveal><h2 id="hub-sections" className="rooted__h2">Explore</h2></Reveal>
        <div className="bento">
          {SECTIONS.map((s, i) => (
            <Reveal key={s.id} delay={(i % 4) * 0.06} className={`bento__cell bento__cell--${s.size}`}>
              <TiltCard
                to={s.live ? s.to : undefined}
                label={s.live ? `Open ${s.name}` : undefined}
                className={`bento-card ${s.live ? "" : "is-soon"}`}
                style={{ "--c1": s.c1, "--c2": s.c2 } as React.CSSProperties}
              >
                <SectionArt s={s} />
                <div className="bento-card__text">
                  {!s.live && <span className="bento-card__soon">Coming soon</span>}
                  <h3>{s.name}</h3>
                  <p>{s.tagline}</p>
                </div>
                {s.live && <span className="bento-card__go" aria-hidden="true"><Icon name="chevronRight" size={20} /></span>}
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal as="section" className="hub__offline">
        <div className="offline">
          <span className="rooted__eyebrow">Less tech, more connection</span>
          <AnimatePresence mode="wait">
            <motion.p key={prompt} className="offline__prompt" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
              {OFFLINE_PROMPTS[prompt]}
            </motion.p>
          </AnimatePresence>
          <button className="btn btn--secondary btn--small" onClick={() => setPrompt((p) => (p + 1) % OFFLINE_PROMPTS.length)}>
            Another one
          </button>
        </div>
      </Reveal>

      <p className="hub__crisis">
        Going through something hard? In the US, call or text <a href="tel:988">988</a> any time to reach the Suicide &amp; Crisis Lifeline. Outside the US,
        contact your local emergency number.
      </p>
      <Footer />
    </ZoomPage>
  );
}
