import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Aurora, Reveal, ZoomPage } from "../rooted/motion";
import { Evidence, SecTabs, SourceLink } from "../rooted/ui";
import { CRISIS_LINES, ASK_THERAPIST, FIND_THERAPY, OUTSIDE_US, PRACTICES, THERAPIES } from "../rooted/supportContent";
import { IfWorried, LineCard, MoodCheck, SafetyPlanBuilder } from "../rooted/Crisis";
import { useCrisis } from "../store/support";
import { Footer } from "../components/Footer";
import { Icon } from "../components/Icon";
import "../rooted/rooted.css";
import "./Breathe.css";
import "./Support.css";

const TABS = [
  { id: "now", label: "Help now" },
  { id: "plan", label: "Safety plan" },
  { id: "worried", label: "Worried about someone" },
  { id: "therapy", label: "Therapy" },
  { id: "care", label: "Bodywork & care" },
];

export default function Support() {
  const location = useLocation();
  const show = useCrisis((s) => s.show);
  useEffect(() => {
    const id = location.hash.replace("#", "");
    if (!id) return;
    const t = setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 650);
    return () => clearTimeout(t);
  }, [location.hash]);

  return (
    <ZoomPage className="rooted support">
      <header className="sec-hero support__hero">
        <Aurora />
        <div className="sec-hero__text">
          <motion.span className="rooted__eyebrow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>Rooted · Support</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.7 }}>Reaching out is<br />a strong thing to do.</motion.h1>
          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32, duration: 0.7 }}>
            Crisis lines staffed by real people, a personal safety plan, how to help someone you're worried about, and how to find a therapist or practitioner
            who's right for you.
          </motion.p>
          <motion.div className="breathe__cta" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42, duration: 0.7 }}>
            <a className="btn btn--primary btn--big" href="tel:988"><Icon name="phone" size={22} /> Call 988</a>
            <a className="btn btn--secondary btn--big" href="sms:988"><Icon name="message" size={22} /> Text 988</a>
          </motion.div>
        </div>
      </header>

      <SecTabs tabs={TABS} />

      <section id="now" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Help now</span>
          <h2>Talk to someone, any time</h2>
          <p className="rooted__lead">If you're thinking about suicide, feel unsafe, or just can't cope right now, these free, confidential lines are answered 24/7 by trained people. If you're in immediate danger, call 911.</p>
        </Reveal>
        <div className="lines">
          {CRISIS_LINES.map((l, i) => (
            <Reveal key={l.name} delay={(i % 3) * 0.05} className={i === 0 ? "lines__lead" : ""}><LineCard l={l} big={i === 0} /></Reveal>
          ))}
        </div>
        <ul className="crisis__intl support__intl">
          {OUTSIDE_US.map((o) => (
            <li key={o.place}><strong>{o.place}:</strong> {o.url ? <a href={o.url} target="_blank" rel="noreferrer">{o.how}</a> : <a href={`tel:${o.call}`}>{o.how}</a>}</li>
          ))}
        </ul>
        <Reveal className="support__mood"><MoodCheck /></Reveal>
      </section>

      <section id="plan" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Safety plan</span>
          <h2>A plan for hard moments</h2>
          <p className="rooted__lead">
            A safety plan is a short list you make while you're feeling steady, so you know exactly what to do if things get dark. It's one of the most
            studied suicide prevention tools: in a large study, people who made one with follow-up had about half as many suicidal behaviors over the next
            six months. You can make it alone or with a therapist.
          </p>
        </Reveal>
        <Reveal><SafetyPlanBuilder /></Reveal>
      </section>

      <section id="worried" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Worried about someone</span>
          <h2>How to help</h2>
          <p className="rooted__lead">You don't need to be an expert. Showing up and asking directly can save a life.</p>
        </Reveal>
        <Reveal><IfWorried /></Reveal>
      </section>

      <section id="therapy" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Therapy</span>
          <h2>Therapies that work</h2>
          <p className="rooted__lead">Therapy is for anyone, not only people in crisis. These approaches have the strongest research behind them.</p>
        </Reveal>
        <div className="therapies">
          {THERAPIES.map((t, i) => (
            <Reveal key={t.name} delay={(i % 3) * 0.05} className="r-card therapy">
              <span className="tech__short">{t.forWhat}</span>
              <h3>{t.name}</h3>
              <p>{t.body}</p>
              <span className="tech__foot"><Evidence s={t.evidence} short /></span>
              {t.source && <SourceLink s={t.source} />}
            </Reveal>
          ))}
        </div>
        <div className="find">
          <Reveal className="r-card find__how">
            <h3>Finding a therapist</h3>
            <ul>
              {FIND_THERAPY.map((f) => (
                <li key={f.title}><strong>{f.title}.</strong> {f.body} {f.url && <a href={f.url} target="_blank" rel="noreferrer">{f.label} ↗</a>}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.08} className="r-card find__ask">
            <h3>Questions to ask on a first call</h3>
            <ul>{ASK_THERAPIST.map((q) => <li key={q}>{q}</li>)}</ul>
            <p className="find__tip">It's normal to try a couple of therapists before one clicks. The relationship matters.</p>
          </Reveal>
        </div>
      </section>

      <section id="care" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Bodywork &amp; care</span>
          <h2>Practitioners, and what the evidence says</h2>
          <p className="rooted__lead">How to find someone qualified, and an honest take on what each can help with.</p>
        </Reveal>
        <div className="therapies">
          {PRACTICES.map((p, i) => (
            <Reveal key={p.name} delay={(i % 3) * 0.05} className="r-card therapy">
              <span className="tech__short">{p.what}</span>
              <h3>{p.name}</h3>
              <p>{p.body}</p>
              {p.caution && <p className="therapy__caution"><Icon name="info" size={16} /> {p.caution}</p>}
              <p className="therapy__find"><strong>Finding one:</strong> {p.find} {p.findUrl && <a href={p.findUrl} target="_blank" rel="noreferrer">Directory ↗</a>}</p>
              <span className="tech__foot"><Evidence s={p.evidence} short /></span>
              {p.source && <SourceLink s={p.source} />}
            </Reveal>
          ))}
        </div>
      </section>

      <div className="support__sticky">
        <button className="btn btn--primary" onClick={show}><Icon name="heart" size={18} /> Get help now</button>
      </div>
      <Footer />
    </ZoomPage>
  );
}
