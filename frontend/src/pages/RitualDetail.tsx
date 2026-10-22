import { useEffect, useState } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal, ZoomPage } from "../rooted/motion";
import { Evidence, SourceLink, useToast } from "../rooted/ui";
import { Icon } from "../components/Icon";
import { Footer } from "../components/Footer";
import { RITUAL_DISCLAIMER, SESSION_EVIDENCE, ritualById, type Ingredient } from "../rooted/rituals";
import { RitualArt } from "../rooted/RitualArt";
import { RitualPlayer } from "../rooted/RitualPlayer";
import { Disclaimer } from "./Rituals";
import { dayKey, niceTime } from "../rooted/ritualLogic";
import { useRituals, useRitualLog, useRitualPrefs } from "../store/rituals";
import "../rooted/rooted.css";
import "./Rituals.css";

function IngredientRow({ ing, open, onToggle, siblings }: { ing: Ingredient; open: boolean; onToggle(): void; siblings: string[] }) {
  return (
    <li className={`ring ${open ? "is-open" : ""}`}>
      <button className="ring__head" onClick={onToggle} aria-expanded={open}>
        <span className="ring__name">{ing.name}{ing.optional && <em>optional</em>}</span>
        <span className="ring__dose">{ing.dose}</span>
        <Icon name="plus" size={18} className="ring__plus" />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div className="ring__body" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28 }}>
            <div className="ring__inner">
              <p><b>What it's for</b> {ing.purpose}</p>
              <p><b>What to know</b> {ing.benefit} <Evidence s={ing.evidence} /></p>
              <p className="ring__pairs"><b>Pairs with</b></p>
              <ul>{ing.pairsWith.filter((p) => siblings.includes(p.name)).map((p) => <li key={p.name}><strong>{p.name}.</strong> {p.why}</li>)}</ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export default function RitualDetail() {
  const { id = "" } = useParams();
  const [params, setParams] = useSearchParams();
  const ritual = ritualById(id);
  const prefs = useRitualPrefs();
  const accept = useRituals((s) => s.acceptDisclaimer);
  const toggleDrink = useRituals((s) => s.toggleDrink);
  const log = useRitualLog();
  const toast = useToast();
  const [open, setOpen] = useState<string | null>(null);
  const [minutes, setMinutes] = useState(ritual?.session.durationMin ?? 15);
  const [playing, setPlaying] = useState(false);

  useEffect(() => { if (params.get("play") === "1" && prefs.disclaimerSeen) { setPlaying(true); setParams({}, { replace: true }); } }, [params, prefs.disclaimerSeen, setParams]);
  useEffect(() => { window.scrollTo(0, 0); }, [id]);
  if (!ritual) return <Navigate to="/rituals" replace />;

  const d = log[dayKey()]?.[ritual.id] ?? {};
  const names = ritual.recipe.ingredients.map((i) => i.name);
  const s = ritual.session;
  const style = { "--a": ritual.accentColor, "--a2": ritual.accentColor2 } as React.CSSProperties;

  return (
    <ZoomPage className="rooted rituals rdetail" >
      <div style={style}>
        <Disclaimer open={!prefs.disclaimerSeen} onAccept={accept} />
        <header className="rdet__hero">
          <RitualArt ritual={ritual} className="rdet__art" />
          <div className="rhero__shade" />
          <Link to="/rituals" className="rdet__back" aria-label="Back to Rituals"><Icon name="back" size={22} /></Link>
          <div className="rdet__text">
            <span className="rhero__time">{ritual.window} · {niceTime(prefs.times[ritual.id as "revive"])}</span>
            <h1>{ritual.name}</h1>
            <p className="rhero__tag">{ritual.tagline}</p>
            <button className="btn btn--primary" onClick={() => setPlaying(true)}><Icon name="play" size={18} /> Start session · {minutes} min</button>
          </div>
        </header>

        <div className="rdet__body">
          <Reveal>
            <section className="r-card rdet__card">
              <h2>Make the drink</h2>
              <p className="rdet__sub">{ritual.recipe.serves}. Tap an ingredient to see what it's for and what it pairs with.</p>
              <ul className="ring__list">
                {ritual.recipe.ingredients.map((ing) => <IngredientRow key={ing.name} ing={ing} open={open === ing.name} onToggle={() => setOpen(open === ing.name ? null : ing.name)} siblings={names} />)}
              </ul>
              <p className="rdet__method"><b>How to make it.</b> {ritual.recipe.method}</p>
              <button className={`btn ${d.drink ? "btn--primary" : "btn--secondary"}`} aria-pressed={!!d.drink} onClick={() => { toggleDrink(ritual.id); toast.show(d.drink ? "Unchecked" : "Drink checked off for today"); }}>
                <Icon name="check" size={18} /> {d.drink ? "Drink taken today" : "I've had my drink"}
              </button>
            </section>
          </Reveal>

          <Reveal>
            <section className="r-card rdet__card">
              <h2>The session</h2>
              <dl className="rdet__facts">
                <div><dt>Brain state</dt><dd>{s.brainState}</dd></div>
                <div><dt>Beat</dt><dd>{s.beatHz.start === s.beatHz.end ? `${s.beatHz.start} Hz` : `${s.beatHz.start} Hz easing to ${s.beatHz.end} Hz`}</dd></div>
                <div><dt>Left ear</dt><dd>{s.leftHz} Hz</dd></div>
                <div><dt>Right ear</dt><dd>{s.rightHz.start === s.rightHz.end ? `${s.rightHz.start} Hz` : `${s.rightHz.start} to ${s.rightHz.end} Hz`}</dd></div>
                <div><dt>Closing fade</dt><dd>{s.fadeOutMin} min</dd></div>
              </dl>
              {s.durationOptions.length > 1 && (
                <div className="rdet__len" role="group" aria-label="Session length">
                  {s.durationOptions.map((m) => <button key={m} className={`chip ${minutes === m ? "is-on" : ""}`} aria-pressed={minutes === m} onClick={() => setMinutes(m)}>{m} min</button>)}
                </div>
              )}
              <p className="rdet__evidence"><Evidence s={SESSION_EVIDENCE.level} /> {SESSION_EVIDENCE.text} <SourceLink s={SESSION_EVIDENCE.source} /></p>
              <p className="rdet__fine"><Icon name="headphones" size={16} /> Headphones required. Sit or lie down, and don't use it while driving.</p>
            </section>
          </Reveal>

          <Reveal>
            <section className="r-card rdet__card rdet__cautions">
              <h2><Icon name="info" size={20} /> Cautions</h2>
              <ul>{ritual.cautions.map((c) => <li key={c}>{c}</li>)}</ul>
              <p className="rdet__fine">{RITUAL_DISCLAIMER}</p>
            </section>
          </Reveal>

          <Reveal>
            <section className="r-card rdet__card">
              <h2>Tips</h2>
              <ul>{ritual.tips.map((t) => <li key={t}>{t}</li>)}</ul>
              <h3 className="rdet__src">Sources</h3>
              <ul className="rdet__sources">{ritual.sources.map((x) => <li key={x.url}><SourceLink s={x} /></li>)}</ul>
            </section>
          </Reveal>
        </div>
        <Footer />
        {toast.node}
        {playing && <RitualPlayer ritual={ritual} minutes={minutes} onClose={() => setPlaying(false)} />}
      </div>
    </ZoomPage>
  );
}
