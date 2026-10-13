import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Aurora, Reveal, ZoomPage } from "../rooted/motion";
import { Avatar } from "../components/Avatar";
import { Footer } from "../components/Footer";
import { Icon } from "../components/Icon";
import { STAGES, UNLOCKS, isUnlocked, nextStage, stageFor, useGrowth } from "../rooted/growth";
import { SYMBOLS } from "../rooted/symbols";
import { useActiveProfile, useUser } from "../store/user";
import "../rooted/rooted.css";
import "./Journey.css";

/** A private page about your own growth. Reached only from the menu; never part of sign-up. */
export default function Journey() {
  const profile = useActiveProfile();
  const stats = useGrowth();
  const updateProfile = useUser((s) => s.updateProfile);
  if (!profile) return null;
  const stage = stageFor(stats.days);
  const next = nextStage(stats.days);
  const stageIndex = STAGES.findIndex((s) => s.id === stage.id);
  const progress = next ? (stats.days - stage.days) / (next.days - stage.days) : 1;
  const earned = SYMBOLS.filter((s) => s.unlock);

  return (
    <ZoomPage className="rooted journey">
      <header className="sec-hero journey__hero">
        <Aurora />
        <div className="sec-hero__text journey__text">
          <motion.div className="journey__avatar" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <Avatar profile={profile} size={120} live />
          </motion.div>
          <motion.span className="rooted__eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Your journey · private</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>{stage.name}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>{stage.blurb}</motion.p>
          <motion.p className="journey__private" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
            <Icon name="check" size={16} /> Only you can see this. Nothing here is shared with friends, circles or anyone else.
          </motion.p>
        </div>
        <GrowthArt stage={stageIndex} />
      </header>

      <section className="sec-block">
        <Reveal className="r-card journey__progress">
          <div className="journey__bar" role="img" aria-label={next ? `${Math.round(progress * 100)} percent of the way to ${next.name}` : "You've reached the last stage"}>
            <motion.i initial={{ width: 0 }} animate={{ width: `${Math.max(3, progress * 100)}%` }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} />
          </div>
          <p>
            {next
              ? <>{next.days - stats.days} more {next.days - stats.days === 1 ? "day" : "days"} of practice to reach <strong>{next.name}</strong>. Any day counts, in any order, and it never goes backward.</>
              : <>You've reached the ancient grove. Take a breath and enjoy it.</>}
          </p>
        </Reveal>
      </section>

      <section className="sec-block journey__stats" aria-label="Your numbers">
        <Reveal className="r-card journey__stat"><b>{stats.days}</b><span>days you showed up</span></Reveal>
        <Reveal delay={0.05} className="r-card journey__stat"><b>{stats.minutes}</b><span>minutes for you</span></Reveal>
        <Reveal delay={0.1} className="r-card journey__stat"><b>{stats.programsFinished}</b><span>{stats.programsFinished === 1 ? "program finished" : "programs finished"}</span></Reveal>
      </section>

      <section className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Symbols you can earn</span>
          <h2>Little rewards for showing up</h2>
          <p className="rooted__lead">Special symbols for your profile picture. They're only for you, there's no rush, and nobody sees what you've earned unless you pick one.</p>
        </Reveal>
        <ul className="journey__symbols">
          {earned.map((s) => {
            const open = isUnlocked(s.id, stats);
            const on = profile.symbol === s.id;
            return (
              <Reveal as="li" key={s.id} className={`r-card journey__sym ${open ? "" : "is-locked"}`}>
                <span className="journey__symart"><Avatar profile={{ ...profile, symbol: s.id }} size={72} live={open} photo={null} /></span>
                <strong>{open ? s.label : "A surprise"}</strong>
                <small>{open ? (on ? "In use" : "Unlocked") : UNLOCKS[s.unlock!].label}</small>
                {open && !on && <button className="btn btn--secondary btn--small" onClick={() => void updateProfile(profile.id, { symbol: s.id })}>Use it</button>}
              </Reveal>
            );
          })}
        </ul>
        <p className="journey__fine">The free symbols are always open. Change yours any time in <Link to="/profiles">Manage Profiles</Link>.</p>
      </section>
      <Footer />
    </ZoomPage>
  );
}

/** A small tree that grows with the stage: seed, sprout, sapling, tree, grove, ancient grove. */
function GrowthArt({ stage }: { stage: number }) {
  const tree = (x: number, scale: number, delay = 0) => (
    <motion.g key={x} style={{ transformOrigin: `${x}px 150px` }} initial={{ scale: 0 }} animate={{ scale }} transition={{ delay, type: "spring", stiffness: 70, damping: 14 }}>
      <path d={`M${x} 150V104`} stroke="#8d6e4a" strokeWidth="5" strokeLinecap="round" />
      <path d={`M${x} 112c-18 0-28-12-28-26 0-12 9-22 20-22 4-8 16-8 20 0 11 0 18 10 18 22 0 14-10 26-30 26Z`} fill="#6fa83a" opacity="0.9" />
      <path d={`M${x} 124l-12-10M${x} 120l11-9`} stroke="#8d6e4a" strokeWidth="3" strokeLinecap="round" />
    </motion.g>
  );
  return (
    <svg className="journey__art" viewBox="0 0 300 170" aria-hidden="true">
      <path d="M10 152h280" stroke="rgba(232,213,176,0.45)" strokeWidth="2" strokeLinecap="round" />
      {stage === 0 && <motion.circle cx="150" cy="148" r="5" fill="#e3a57a" initial={{ scale: 0 }} animate={{ scale: 1 }} />}
      {stage === 1 && (
        <motion.g initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} style={{ transformOrigin: "150px 150px" }} transition={{ type: "spring", stiffness: 80, damping: 12 }}>
          <path d="M150 150v-22" stroke="#9cc59a" strokeWidth="4" strokeLinecap="round" />
          <path d="M150 130c-2-8-10-12-18-11 1 8 8 13 18 11ZM150 126c2-8 10-12 18-11-1 8-8 13-18 11Z" fill="#9cdb8f" />
        </motion.g>
      )}
      {stage === 2 && tree(150, 0.5)}
      {stage === 3 && tree(150, 0.85)}
      {stage === 4 && <>{tree(100, 0.8)}{tree(150, 1)}{tree(205, 0.75, 0.1)}</>}
      {stage >= 5 && <>{tree(70, 0.75)}{tree(115, 0.95, 0.05)}{tree(170, 1.2, 0.1)}{tree(228, 0.85, 0.15)}</>}
    </svg>
  );
}
