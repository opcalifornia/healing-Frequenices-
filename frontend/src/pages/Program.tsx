import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Aurora, Reveal, ZoomPage } from "../rooted/motion";
import { Evidence } from "../rooted/ui";
import { programById, dayMinutes } from "../rooted/programs";
import { LessonPlayer } from "../rooted/LessonPlayer";
import { nextDay, useEnrollments, usePrograms } from "../store/programs";
import { Footer } from "../components/Footer";
import { Icon } from "../components/Icon";
import NotFound from "./NotFound";
import { ScheduleButton } from "../rooted/CalendarUI";
import { ShareButton } from "../rooted/ShareCard";
import { InviteButton } from "../rooted/InviteButton";
import { CirclePanel } from "../rooted/Circles";
import "../rooted/rooted.css";
import "./Breathe.css";
import "./Combos.css";
import "./Programs.css";

export default function ProgramPage() {
  const { id = "" } = useParams();
  const p = programById(id);
  const enrolled = useEnrollments()[id];
  const { enroll, reset } = usePrograms();
  const [playing, setPlaying] = useState<number | null>(null);
  if (!p || !p.live) return <NotFound />;
  const nd = nextDay(enrolled, p.days.length);
  const doneCount = enrolled ? Object.keys(enrolled.done).length : 0;
  const pct = doneCount / p.days.length;
  const start = (day: number) => {
    enroll(p.id);
    setPlaying(day);
  };

  return (
    <ZoomPage className="rooted program">
      <header className="sec-hero program__hero" style={{ "--h": p.hue, "--h2": p.hue2 } as React.CSSProperties}>
        <Aurora />
        <div className="program__ring" aria-hidden="true">
          <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" pathLength="1" className="week-ring__bg" /><motion.circle cx="50" cy="50" r="44" pathLength="1" className="program__fill" initial={{ pathLength: 0 }} animate={{ pathLength: Math.max(0.001, pct) }} transition={{ duration: 1.2, delay: 0.3 }} /></svg>
          <span><strong>{doneCount}</strong>/{p.days.length}</span>
        </div>
        <div className="sec-hero__text">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Link to={`/${p.section}`} className="rooted__eyebrow">Program · {p.section}</Link>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.7 }}>{p.title}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32, duration: 0.7 }}>{p.about}</motion.p>
          <motion.div className="program__author" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <span className="program__avatar"><Icon name="leaf" size={18} /></span>
            <span><strong>{p.author.name}</strong>{p.author.verified && <em className="program__verified"><Icon name="check" size={12} /> Verified</em>}<small>{p.author.role}</small></span>
            <Evidence s={p.evidence} short />
          </motion.div>
          <motion.div className="breathe__cta" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.7 }}>
            {nd.finished ? (
              <><span className="breathe__stat">Completed. Nicely done.</span><ShareButton label="Share it" className="btn btn--primary" data={{ kind: "program", id: p.id, title: p.title, days: p.days.length, section: p.section, hue: p.hue }} /><button className="btn btn--secondary" onClick={() => reset(p.id)}>Start over</button></>
            ) : (
              <button className="btn btn--primary btn--big" onClick={() => start(nd.index)}>
                <Icon name="play" size={22} /> {enrolled ? (nd.doneToday ? `Day ${nd.index + 1} (tomorrow's)` : `Continue: day ${nd.index + 1}`) : "Start day 1"}
              </button>
            )}
          </motion.div>
          {!nd.finished && (
            <div className="program__schedule">
              <ScheduleButton draft={{ title: `${p.title} lesson`, kind: "program", minutes: Math.max(5, Math.round(p.days.reduce((a, d) => a + dayMinutes(d), 0) / p.days.length)), repeat: "daily", to: `/program/${p.id}`, time: "07:30", note: `${p.days.length}-day program. One lesson a day.` }} label="Schedule a daily lesson time" />
              <InviteButton programId={p.id} programTitle={p.title} label="Do it with a friend" />
            </div>
          )}
          {nd.doneToday && !nd.finished && <p className="program__note">You've done today's lesson. Coming back tomorrow builds the habit, but you can keep going if you like.</p>}
        </div>
      </header>

      <section id="circle" className="sec-block program__circle">
        <CirclePanel program={p} />
      </section>

      <section className="sec-block">
        <Reveal className="sec-block__head"><h2>The days</h2></Reveal>
        <ol className="days">
          {p.days.map((d, k) => {
            const isDone = !!enrolled?.done[k];
            const isNext = !nd.finished && k === nd.index;
            const locked = !isDone && k > nd.index;
            return (
              <Reveal key={d.title} delay={k * 0.04} as="li" className={`day ${isDone ? "is-done" : ""} ${isNext ? "is-next" : ""} ${locked ? "is-locked" : ""}`}>
                <button className="day__btn" onClick={() => !locked && start(k)} disabled={locked} aria-label={`Day ${k + 1}: ${d.title}${isDone ? ", completed" : locked ? ", locked" : ""}`}>
                  <span className="day__n">{isDone ? <Icon name="check" size={18} /> : locked ? <Icon name="bookmark" size={16} /> : k + 1}</span>
                  <span className="day__text"><strong>{d.title}</strong><small>Day {k + 1} · about {dayMinutes(d)} min · {d.blocks.map((b) => b.type === "breath" || b.type === "move" || b.type === "ground" ? "practice" : b.type === "read" ? "learn" : b.type).filter((x, i, a) => a.indexOf(x) === i).join(", ")}</small></span>
                  {!locked && <Icon name={isDone ? "replay" : "play"} size={18} />}
                </button>
              </Reveal>
            );
          })}
        </ol>
      </section>
      <AnimatePresence>{playing !== null && <LessonPlayer key={playing} program={p} day={playing} onClose={() => setPlaying(null)} />}</AnimatePresence>
      <Footer />
    </ZoomPage>
  );
}
