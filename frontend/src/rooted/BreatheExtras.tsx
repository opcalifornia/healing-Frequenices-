import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TECHNIQUES, breathsPerMinute, customTechnique, type Technique } from "./breathContent";
import { usePractice, useBolts, useCustomPatterns, usePracticeLog, type CustomPattern } from "../store/practice";
import { todayKey } from "../store/nourish";
import { flags, useAbout } from "../store/wellness";
import { chime, unlockChime } from "./chime";
import { Icon } from "../components/Icon";
import { SourceLink } from "./ui";

const byId = (id: string) => TECHNIQUES.find((t) => t.id === id)!;

/* ------------------------------------------------------------------ */
/* Quick picks: one tap from a feeling to the right practice            */
/* ------------------------------------------------------------------ */

export function QuickPicks({ onStart }: { onStart(t: Technique, minutes: number): void }) {
  const f = flags(useAbout().considerations);
  const picks = [
    { label: "Settle in now", sub: "1 min · 4 in, 6 out", t: byId("calm"), m: 1, hue: 160 },
    { label: "When it feels like too much", sub: "1 min · physiological sigh", t: byId("sigh"), m: 1, hue: 200 },
    { label: "Fall asleep", sub: f.breathHoldCare ? "3 min · slow exhale" : "2 min · 4-7-8", t: f.breathHoldCare ? byId("calm") : byId("478"), m: f.breathHoldCare ? 3 : 2, hue: 265 },
    { label: "Focus", sub: f.breathHoldCare ? "5 min · coherent" : "2 min · box breathing", t: f.breathHoldCare ? byId("coherent") : byId("box"), m: f.breathHoldCare ? 5 : 2, hue: 225 },
    { label: "Energy", sub: f.noPowerBreathing ? "3 min · relaxed, upright" : "8 min · power breathing", t: f.noPowerBreathing ? byId("calm") : byId("power"), m: 3, hue: 30 },
  ];
  return (
    <div className="quick" role="group" aria-label="I want to">
      {picks.map((p, i) => (
        <motion.button key={p.label} className="quick__btn" style={{ "--h": p.hue } as React.CSSProperties} onClick={() => onStart(p.t, p.m)}
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.06 }} whileTap={{ scale: 0.96 }}>
          <strong>{p.label}</strong>
          <span>{p.sub}</span>
        </motion.button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Custom pattern builder                                              */
/* ------------------------------------------------------------------ */

function Slider({ label, value, min, max, onChange, color }: { label: string; value: number; min: number; max: number; onChange(v: number): void; color: string }) {
  return (
    <label className="pb__slider" style={{ "--c": color } as React.CSSProperties}>
      <span>{label}</span>
      <input type="range" min={min} max={max} step={0.5} value={value} onChange={(e) => onChange(+e.target.value)} aria-valuetext={`${value} seconds`} />
      <output>{value}s</output>
    </label>
  );
}

export function PatternBuilder({ onStart, onDone }: { onStart(t: Technique, minutes: number): void; onDone?(): void }) {
  const f = flags(useAbout().considerations);
  const save = usePractice((s) => s.saveCustom);
  const maxHold = f.breathHoldCare ? 4 : 10;
  const [p, setP] = useState<CustomPattern>({ id: `custom-${Date.now()}`, name: "My pattern", inhale: 4, hold: 2, exhale: 6, rest: 0 });
  const bpm = breathsPerMinute(p);
  const total = p.inhale + p.hold + p.exhale + p.rest;
  const parts = [
    { k: "inhale", c: "#8fd3ff", v: p.inhale },
    { k: "hold", c: "rgba(255,255,255,0.35)", v: p.hold },
    { k: "exhale", c: "#3f7fb8", v: p.exhale },
    { k: "rest", c: "rgba(255,255,255,0.2)", v: p.rest },
  ];
  const tip = p.exhale > p.inhale ? "Longer exhale than inhale: tends to be relaxing." : p.inhale > p.exhale ? "Longer inhale than exhale: more energizing. Try a longer exhale to relax." : "Even breaths: balanced and steady.";
  return (
    <div className="pb">
      <h3>Build your own pattern</h3>
      <div className="pb__preview" aria-hidden="true">
        {parts.map((x) => x.v > 0 && <motion.i key={x.k} layout style={{ flexGrow: x.v / total, background: x.c }} />)}
      </div>
      <p className="pb__stats"><strong>{bpm.toFixed(1)}</strong> breaths a minute · {tip}</p>
      <Slider label="Breathe in" value={p.inhale} min={2} max={10} color="#8fd3ff" onChange={(v) => setP({ ...p, inhale: v })} />
      <Slider label="Hold" value={Math.min(p.hold, maxHold)} min={0} max={maxHold} color="#cfd8dc" onChange={(v) => setP({ ...p, hold: v })} />
      <Slider label="Breathe out" value={p.exhale} min={2} max={14} color="#3f7fb8" onChange={(v) => setP({ ...p, exhale: v })} />
      <Slider label="Hold empty" value={Math.min(p.rest, maxHold)} min={0} max={maxHold} color="#90a4ae" onChange={(v) => setP({ ...p, rest: v })} />
      {f.breathHoldCare && <p className="for-you"><span><strong>Based on your profile:</strong> holds are capped at 4 seconds.</span></p>}
      <label className="pb__name"><span>Name</span><input value={p.name} onChange={(e) => setP({ ...p, name: e.target.value.slice(0, 32) })} /></label>
      <div className="pb__actions">
        <button className="btn btn--primary" onClick={() => { save(p); onDone?.(); onStart(customTechnique(p), 3); }}><Icon name="play" size={18} /> Save and try it</button>
        <button className="btn btn--secondary" onClick={() => { save(p); onDone?.(); }}>Save</button>
      </div>
    </div>
  );
}

export function CustomList({ onStart, onBuild }: { onStart(t: Technique, minutes: number): void; onBuild(): void }) {
  const customs = useCustomPatterns();
  const remove = usePractice((s) => s.removeCustom);
  return (
    <div className="customs">
      {customs.map((c) => {
        const t = customTechnique(c);
        return (
          <motion.div key={c.id} layout className="r-card custom" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div>
              <strong>{c.name}</strong>
              <span>{t.short} · {breathsPerMinute(c).toFixed(1)} per minute</span>
            </div>
            <div className="custom__actions">
              {[1, 3, 5].map((m) => <button key={m} className="chip" onClick={() => onStart(t, m)}>{m} min</button>)}
              <button className="icon-btn slist__rm" onClick={() => remove(c.id)} aria-label={`Delete ${c.name}`}><Icon name="trash" size={16} /></button>
            </div>
          </motion.div>
        );
      })}
      <button className="r-card custom custom--new" onClick={onBuild}><Icon name="plus" size={20} /> Build a pattern</button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Your results                                                        */
/* ------------------------------------------------------------------ */

export function Results() {
  const entries = usePracticeLog();
  const breath = entries.filter((e) => e.kind.startsWith("breath:") || e.kind === "pmr" || e.kind === "ground");
  const checked = breath.filter((e) => e.before && e.after);
  const avgDrop = checked.length ? checked.reduce((a, e) => a + (e.before! - e.after!), 0) / checked.length : 0;
  const minutes = breath.reduce((a, e) => a + e.minutes, 0);
  const byTech = useMemo(() => {
    const m = new Map<string, { before: number; after: number; n: number }>();
    for (const e of checked) {
      const id = e.kind.replace("breath:", "");
      const cur = m.get(id) ?? { before: 0, after: 0, n: 0 };
      m.set(id, { before: cur.before + e.before!, after: cur.after + e.after!, n: cur.n + 1 });
    }
    return [...m.entries()].map(([id, v]) => ({ id, name: TECHNIQUES.find((t) => t.id === id)?.name ?? "Your pattern", before: v.before / v.n, after: v.after / v.n, n: v.n })).sort((a, b) => b.before - b.after - (a.before - a.after));
  }, [checked]);

  // Eight-week calendar of practice days.
  const days = new Map<string, number>();
  for (const e of breath) days.set(e.day, (days.get(e.day) ?? 0) + e.minutes);
  const cells = Array.from({ length: 56 }, (_, k) => {
    const d = new Date();
    d.setDate(d.getDate() - (55 - k));
    const key = todayKey(d);
    return { key, mins: days.get(key) ?? 0, label: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) };
  });

  if (!breath.length) {
    return <p className="rooted__lead">Your results will appear here after your first session. Check in before and after to see what works best for you.</p>;
  }
  return (
    <div className="results">
      <div className="results__tiles">
        <div className="r-card tile"><span>Sessions</span><strong>{breath.length}</strong></div>
        <div className="r-card tile"><span>Minutes breathing</span><strong>{Math.round(minutes)}</strong></div>
        <div className="r-card tile"><span>Average stress drop</span><strong>{checked.length ? `${avgDrop > 0 ? "−" : ""}${Math.abs(avgDrop).toFixed(1)}` : "–"}</strong><small>{checked.length ? `across ${checked.length} check-ins` : "check in to see this"}</small></div>
      </div>
      <div className="results__grid">
        <div className="r-card results__cal">
          <h3>Last 8 weeks</h3>
          <div className="cal" role="img" aria-label={`Practiced on ${cells.filter((c) => c.mins > 0).length} of the last 56 days`}>
            {cells.map((c) => <i key={c.key} title={`${c.label}: ${Math.round(c.mins)} min`} style={{ "--a": c.mins ? Math.min(1, 0.3 + c.mins / 10) : 0 } as React.CSSProperties} className={c.key === todayKey() ? "is-today" : ""} />)}
          </div>
          <div className="cal__key"><span>Less</span><i style={{ "--a": 0 } as React.CSSProperties} /><i style={{ "--a": 0.4 } as React.CSSProperties} /><i style={{ "--a": 0.7 } as React.CSSProperties} /><i style={{ "--a": 1 } as React.CSSProperties} /><span>More</span></div>
        </div>
        <div className="r-card results__what">
          <h3>What works best for you</h3>
          {byTech.length ? (
            <ul className="whatworks">
              {byTech.map((t) => (
                <li key={t.id}>
                  <span className="whatworks__name">{t.name} <small>{t.n}×</small></span>
                  <span className="whatworks__bars" aria-label={`Average stress ${t.before.toFixed(1)} before, ${t.after.toFixed(1)} after`}>
                    <i className="whatworks__b" style={{ width: `${t.before * 10}%` }} />
                    <i className="whatworks__a" style={{ width: `${t.after * 10}%` }} />
                  </span>
                  <b>{(t.before - t.after) > 0 ? "−" : ""}{Math.abs(t.before - t.after).toFixed(1)}</b>
                </li>
              ))}
            </ul>
          ) : <p className="rooted__lead">Check in before and after a session to compare techniques.</p>}
          {byTech.length > 0 && <div className="whatworks__key"><span><i className="whatworks__b" /> Stress before</span><span><i className="whatworks__a" /> After</span></div>}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* BOLT breath-hold test                                               */
/* ------------------------------------------------------------------ */

const LEVELS = [
  { max: 10, name: "Starting out", tip: "Your body is very sensitive to carbon dioxide. Focus on slow nasal breathing and the Settle in pattern daily." },
  { max: 20, name: "Building", tip: "Common for busy, stressed lives. Daily slow breathing with longer exhales tends to raise this over weeks." },
  { max: 30, name: "Steady", tip: "A good, relaxed baseline. Keep up regular slow breathing and nasal breathing during light exercise." },
  { max: 40, name: "Strong", tip: "Relaxed, efficient breathing. Coherent breathing helps you maintain it." },
  { max: 999, name: "Excellent", tip: "Very relaxed breathing. Keep doing what you're doing." },
];

export function BoltTest() {
  const f = flags(useAbout().considerations);
  const bolts = useBolts();
  const add = usePractice((s) => s.addBolt);
  const [stage, setStage] = useState<"idle" | "prep" | "hold" | "result">("idle");
  const [prep, setPrep] = useState(20);
  const [secs, setSecs] = useState(0);
  const start = useRef(0);
  const raf = useRef(0);

  useEffect(() => {
    if (stage !== "prep") return;
    if (prep <= 0) {
      chime("hold", 0.05);
      start.current = performance.now();
      setStage("hold");
      return;
    }
    const id = setTimeout(() => setPrep((p) => p - 1), 1000);
    return () => clearTimeout(id);
  }, [stage, prep]);
  useEffect(() => {
    if (stage !== "hold") return;
    const tick = () => {
      const s = (performance.now() - start.current) / 1000;
      setSecs(s);
      if (s >= 120) stop();
      else raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);
  const stop = () => {
    cancelAnimationFrame(raf.current);
    const s = (performance.now() - start.current) / 1000;
    setSecs(s);
    add(s);
    chime("in", 0.05);
    setStage("result");
  };
  const level = LEVELS.find((l) => secs < l.max)!;

  // History chart
  const W = 560, H = 180, L = 36, R = 12, T = 12, B = 28;
  const pts = bolts.slice(-20);
  const maxV = Math.max(45, ...pts.map((p) => p.secs));
  const xs = (i: number) => L + (pts.length < 2 ? 0.5 : i / (pts.length - 1)) * (W - L - R);
  const ys = (v: number) => T + (1 - v / maxV) * (H - T - B);
  const [hover, setHover] = useState<number | null>(null);

  if (f.breathHoldCare) {
    return <p className="for-you"><span><strong>Based on your profile:</strong> breath-hold tests aren't advised for you. Your before-and-after stress check-ins are a better way to track progress.</span></p>;
  }

  return (
    <div className="bolt">
      <div className="r-card bolt__test">
        <AnimatePresence mode="wait">
          {stage === "idle" && (
            <motion.div key="idle" className="bolt__step" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3>Body Oxygen Level Test (BOLT)</h3>
              <ol>
                <li>Sit down and breathe normally through your nose for 20 seconds.</li>
                <li>After a normal, relaxed breath out, pinch your nose and tap the big button.</li>
                <li>Tap again at the <strong>first definite urge</strong> to breathe, like a swallow or a twitch in your throat. Don't push past it.</li>
                <li>Your first breath afterwards should be relaxed. If you gasp, you held too long.</li>
              </ol>
              <button className="btn btn--primary" onClick={() => { unlockChime(); setPrep(20); setStage("prep"); }}><Icon name="play" size={18} /> Start (20 seconds of normal breathing first)</button>
              <p className="bolt__safe">Sitting down, on dry land. Never in or near water, while driving, or standing. Skip it if you're pregnant or have a heart condition, epilepsy, or panic attacks.</p>
            </motion.div>
          )}
          {stage === "prep" && (
            <motion.div key="prep" className="bolt__step bolt__center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <span className="rooted__eyebrow">Breathe normally through your nose</span>
              <span className="bolt__big">{prep}</span>
              <p>When it reaches zero: breathe out normally, pinch your nose.</p>
              <button className="welcome__skip" onClick={() => setStage("idle")}>Cancel</button>
            </motion.div>
          )}
          {stage === "hold" && (
            <motion.div key="hold" className="bolt__step bolt__center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <span className="rooted__eyebrow">Nose pinched · relax</span>
              <motion.button className="bolt__stop" onClick={stop} whileTap={{ scale: 0.94 }} aria-label="Stop the timer at the first urge to breathe">
                <span>{Math.floor(secs)}</span><small>Tap at the first urge</small>
              </motion.button>
            </motion.div>
          )}
          {stage === "result" && (
            <motion.div key="result" className="bolt__step bolt__center" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <span className="rooted__eyebrow">Your BOLT score</span>
              <span className="bolt__big">{Math.round(secs)}<small>s</small></span>
              <strong className="bolt__level">{level.name}</strong>
              <p>{level.tip}</p>
              <button className="btn btn--secondary btn--small" onClick={() => setStage("idle")}>Done</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="r-card bolt__history">
        <h3>Your BOLT over time</h3>
        {pts.length ? (
          <div className="glucose__plot">
            <svg viewBox={`0 0 ${W} ${H}`} className="glucose__svg" role="img" aria-label={`BOLT scores over your last ${pts.length} tests, latest ${pts[pts.length - 1].secs} seconds`} onPointerLeave={() => setHover(null)}>
              {[10, 20, 30, 40].filter((v) => v <= maxV).map((v) => (
                <g key={v}><line x1={L} x2={W - R} y1={ys(v)} y2={ys(v)} className="glucose__grid" /><text x={L - 6} y={ys(v) + 4} textAnchor="end" className="glucose__tick">{v}s</text></g>
              ))}
              {pts.length > 1 && <path d={pts.map((p, i) => `${i ? "L" : "M"}${xs(i)} ${ys(p.secs)}`).join(" ")} fill="none" stroke="#2f8fd6" strokeWidth="2" strokeLinecap="round" />}
              {pts.map((p, i) => (
                <g key={i} onPointerEnter={() => setHover(i)}>
                  <circle cx={xs(i)} cy={ys(p.secs)} r="12" fill="transparent" />
                  <circle cx={xs(i)} cy={ys(p.secs)} r={hover === i ? 6 : 4.5} fill="#2f8fd6" stroke="#141813" strokeWidth="2" />
                </g>
              ))}
            </svg>
            {hover !== null && (
              <div className="glucose__tip" style={{ left: `${(xs(hover) / W) * 100}%` }} role="status">
                <strong>{new Date(`${pts[hover].day}T12:00`).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</strong>
                <span><i style={{ background: "#2f8fd6" }} />BOLT<b>{pts[hover].secs}s</b></span>
              </div>
            )}
          </div>
        ) : <p className="rooted__lead">Take the test once a week, at the same time of day, to watch it change.</p>}
        <p className="diagram__text">BOLT is a simple measure popular with breathing coaches, reflecting how sensitive your body is to carbon dioxide. Research on it is limited, so treat it as a personal trend, not a diagnosis.</p>
        <SourceLink s={{ text: "Courtney R, Cohen M. Investigating the claims of Konstantin Buteyko: the relationship of breath holding time to end tidal CO2. J Altern Complement Med, 2008", url: "https://doi.org/10.1089/acm.2007.7024" }} />
      </div>
    </div>
  );
}
