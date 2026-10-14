import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Aurora, Reveal, TiltCard, ZoomPage } from "../rooted/motion";
import { SECTIONS, OFFLINE_PROMPTS } from "../rooted/sections";
import { SectionArt } from "../rooted/SectionArt";
import { useActiveProfile } from "../store/user";
import { useWater, useWaterGoal, todayKey } from "../store/nourish";
import { useAbout } from "../store/wellness";
import { usePracticeLog } from "../store/practice";
import { GOAL_SHORT, pickFor, sectionRank, slotFor, SLOT_LABEL, type Picked } from "../rooted/plan";
import { Footer } from "../components/Footer";
import { Icon } from "../components/Icon";
import { MoodCheck } from "../rooted/Crisis";
import { PROGRAMS } from "../rooted/programs";
import { nextDay, useEnrollments } from "../store/programs";
import { useCrisis } from "../store/support";
import { eventsOn, toMin, useEvents } from "../store/calendar";
import { KINDS, niceTime } from "../rooted/CalendarUI";
import { Tour } from "../rooted/Tour";
import { stageFor, useGrowth } from "../rooted/growth";
import "../rooted/rooted.css";
import "./Support.css";
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
  const about = useAbout();
  const showCrisis = useCrisis((s) => s.show);
  const entries = usePracticeLog();
  const [prompt, setPrompt] = useState(() => (now.getDate() * 7 + now.getMonth()) % OFFLINE_PROMPTS.length);
  const slot = slotFor(h);
  const doneToday = new Set(entries.filter((e) => e.day === todayKey()).map((e) => e.kind));
  const enrolled = useEnrollments();
  const active = PROGRAMS.find((p) => p.live && enrolled[p.id] && !nextDay(enrolled[p.id], p.days.length).finished);
  const activeNext = active ? nextDay(enrolled[active.id], active.days.length) : null;
  const programPick = active && activeNext && !activeNext.doneToday
    ? [{ id: `program-${active.id}`, title: `${active.title}: day ${activeNext.index + 1}`, body: active.days[activeNext.index].title, to: `/program/${active.id}`, minutes: 5, icon: "sparkle" as const, slots: [], serves: {}, reason: undefined } as Picked]
    : [];
  const picks = [...programPick, ...pickFor(about, slot, 3)].slice(0, 3);
  const needsSetup = !about.onboarded && !about.skipped && !about.firstWin;
  const brandNew = needsSetup && entries.length === 0;
  const goalText = about.goals.map((g) => GOAL_SHORT[g]);
  const sections = [...SECTIONS].sort((a, b) => Number(b.live) - Number(a.live) || sectionRank(b.id, about.goals) - sectionRank(a.id, about.goals));
  const topPick = about.goals.length ? sections.filter((s) => s.live && sectionRank(s.id, about.goals) > 0).slice(0, 2).map((s) => s.id) : [];

  const navigate = useNavigate();
  const pid = profile?.id ?? "guest";
  useEffect(() => {
    if (!brandNew) return;
    const key = `rooted-fw-offered-${pid}`;
    try {
      if (localStorage.getItem(key)) return;
      localStorage.setItem(key, "1");
    } catch {
      return;
    }
    navigate("/start", { replace: true });
  }, [brandNew, pid, navigate]);

  return (
    <ZoomPage className="rooted hub">
      <Tour />
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
            {goalText.length
              ? `Your focus: ${goalText.join(", ").replace(/, ([^,]*)$/, " and $1")}. Here's what's next.`
              : "Small, proven habits for body and mind, with the evidence shown on every one. Start anywhere."}
          </motion.p>
        </div>

        {needsSetup ? (
          <motion.div className="hub__setup" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.55 }}>
            <div>
              <span className="rooted__eyebrow">{brandNew ? "Start here · 60 seconds" : "Under a minute"}</span>
              <h2>{brandNew ? "Feel better in one minute" : "Make Rooted yours"}</h2>
              <p>{brandNew ? "Tell us what brought you here, try one guided minute, and see the difference for yourself." : "Tell us your goals and we'll plan a few small things for you each day."}</p>
            </div>
            <div className="hub__setup-cta">
              <Link to={brandNew ? "/start" : "/welcome"} className="btn btn--primary btn--big">{brandNew ? "Start my minute" : "Get started"}</Link>
              {brandNew && <Link to="/welcome" className="hub__edit">Or set up my goals</Link>}
            </div>
          </motion.div>
        ) : (
          <div className="hub__today-wrap">
            <div className="hub__today-head">
              <span className="rooted__eyebrow">{SLOT_LABEL[slot]}, for you</span>
              <span className="hub__head-links">
                <Link to="/calendar" className="hub__edit">Schedule</Link>
                <Link to="/about-you" className="hub__edit">Edit goals</Link>
              </span>
            </div>
            <div className="hub__today" role="list" aria-label="Your plan">
              {picks.map((t, i) => {
                const done = (t.doneKind && doneToday.has(t.doneKind)) || (t.id === "water" && water >= goal);
                return (
                  <motion.div key={t.id} role="listitem" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
                    <Link to={t.to} className={`today-card ${done ? "is-done" : ""}`}>
                      <span className="today-card__icon">{done ? <Icon name="check" size={20} /> : <Icon name={t.icon} size={20} />}</span>
                      <span className="today-card__eyebrow">{t.minutes ? `${t.minutes} min` : "No timer"}{t.reason ? ` · ${GOAL_SHORT[t.reason]}` : ""}</span>
                      <strong>{t.title}</strong>
                      <span className="today-card__body">{t.id === "water" ? `${(water / 1000).toFixed(1)} of ${(goal / 1000).toFixed(1)} L so far. ` : ""}{t.body}</span>
                      {t.id === "water" && <span className="today-card__bar"><i style={{ width: `${Math.min(1, water / goal) * 100}%` }} /></span>}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {!needsSetup && <div className="hub__mood"><MoodCheck /></div>}
      <section className="hub__cal hub__scan" aria-label="Scan a product">
      <Link to="/scan?camera=1" className="hub-cal hub-cal--scan">
        <span className="hub-cal__icon"><Icon name="barcode" size={22} /></span>
        <span className="hub-cal__text">
          <b>Scan a product</b>
          <small>Point your camera at a barcode and see what's in it.</small>
        </span>
        <Icon name="chevronRight" size={20} />
      </Link>
      </section>
      {!needsSetup && <HubCalendar />}

      <section className="hub__sections" aria-labelledby="hub-sections">
        <Reveal><h2 id="hub-sections" className="rooted__h2">Explore</h2></Reveal>
        <div className="bento">
          {sections.map((s, i) => (
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
                  {topPick.includes(s.id) && <span className="bento-card__soon bento-card__foryou">For you</span>}
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
        Going through something hard? You don't have to face it alone. <button onClick={showCrisis}>Get help now</button>, or call or text <a href="tel:988">988</a> any time.
      </p>
      <Footer />
    </ZoomPage>
  );
}

/** Today's health calendar at a glance, so the plan and the schedule live in one place. */
function HubCalendar() {
  const events = useEvents();
  const growth = useGrowth();
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const today = eventsOn(events, todayKey());
  const upcoming = today.filter((e) => toMin(e.time) + e.minutes >= nowMin && !e.done?.[todayKey()]);
  const allDone = today.length > 0 && today.every((e) => e.done?.[todayKey()]);
  return (
    <section className="hub__cal" aria-label="Today on your calendar">
      <Link to="/calendar" className="hub-cal">
        <span className="hub-cal__icon"><Icon name="calendar" size={22} /></span>
        <span className="hub-cal__text">
          <b>{upcoming.length ? "Next on your health calendar" : allDone ? "All done for today" : today.length ? "That's today wrapped up" : "Your health calendar"}</b>
          {upcoming.length ? (
            <span className="hub-cal__items">
              {upcoming.slice(0, 3).map((e) => (
                <span key={e.id} style={{ ["--k" as string]: KINDS[e.kind].color }}><i />{niceTime(e.time)} {e.title}</span>
              ))}
            </span>
          ) : (
            <small>{allDone ? "Nice work. See what's coming up this week." : today.length ? "See what's coming up this week." : "Schedule your routines, see them beside work, send them to Apple or Google."}</small>
          )}
        </span>
        <Icon name="chevronRight" size={20} />
      </Link>
      <Link to="/guide" className="hub-cal hub-cal--guide hub__guide">
        <span className="hub-cal__icon"><Icon name="book" size={22} /></span>
        <span className="hub-cal__text">
          <b>Everything Rooted can do</b>
          <small>A map of every tool, and the ones you haven't tried yet.</small>
        </span>
        <Icon name="chevronRight" size={20} />
      </Link>
      {growth.days >= 1 && (
        <Link to="/journey" className="hub-cal hub-cal--journey">
          <span className="hub-cal__icon"><Icon name="leaf" size={22} /></span>
          <span className="hub-cal__text">
            <b>My journey · {stageFor(growth.days).name}</b>
            <small>A private look at how you've grown. Only you can see it.</small>
          </span>
          <Icon name="chevronRight" size={20} />
        </Link>
      )}
      <Link to="/week" className="hub-cal hub-cal--week">
        <span className="hub-cal__icon"><Icon name="sparkle" size={22} /></span>
        <span className="hub-cal__text">
          <b>Your week</b>
          <small>Minutes, mood and what's helping, in a few simple charts.</small>
        </span>
        <Icon name="chevronRight" size={20} />
      </Link>
    </section>
  );
}
