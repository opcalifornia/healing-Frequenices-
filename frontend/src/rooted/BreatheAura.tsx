import { useEffect, useState, type CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";
import { Icon } from "../components/Icon";
import { AgainButton, QuickPicks } from "./BreatheExtras";
import { TECHNIQUES, type Technique } from "./breathContent";
import { Evidence } from "./ui";
import { useBolts, useHearts } from "../store/practice";
import { useMyPace } from "../store/breatheTools";
import "./BreatheAura.css";

/** Soft glowing hero that breathes: in for 4.5 seconds, out for 4.5, with the phase word following it. */
export function BreatheHero({ onStart, onGuide, today, streak }: { onStart(t: Technique, m: number): void; onGuide(): void; today: number; streak: number }) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<"in" | "out">("in");
  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setPhase((p) => (p === "in" ? "out" : "in")), 4500);
    return () => window.clearInterval(id);
  }, [reduce]);
  return (
    <header className="bx-hero">
      <div className="bx-aura" aria-hidden="true"><i /><i /><i /></div>
      <div className="bx-orb" aria-hidden="true">
        <b /><b /><b />
        <span className="bx-core" />
        <span className="bx-phase">{reduce ? "Breathe" : phase === "in" ? "Breathe in" : "Breathe out"}</span>
      </div>
      <div className="bx-copy">
        <span className="bx-eyebrow">Rooted · Breathe</span>
        <h1>One minute<br />can change<br />your state.</h1>
        <p>Follow the glow: in as it grows, out as it softens. Sound and vibration guide you, so you can close your eyes.</p>
        <div className="bx-cta">
          <button className="bx-btn bx-btn--p" onClick={() => onStart(TECHNIQUES[0], 1)}><Icon name="play" size={18} /> Start 1 minute</button>
          <a className="bx-btn bx-btn--s" href="#pace" onClick={(e) => { e.preventDefault(); document.getElementById("pace")?.scrollIntoView({ behavior: "smooth" }); }}>Find your pace</a>
          {(today > 0 || streak > 0) && <span className="bx-stat">{Math.round(today)} min today{streak > 1 ? ` · ${streak}-day streak` : ""}</span>}
        </div>
        <QuickPicks onStart={onStart} />
        <div className="bx-more">
          <AgainButton onStart={onStart} />
          <button className="bx-link" onClick={onGuide}><Icon name="info" size={15} /> How Breathe works</button>
        </div>
      </div>
    </header>
  );
}

/** A little line that follows the shape of the breath: up on the in-breath, flat on a hold, down on the out-breath. */
export function wavePath(t: Technique, w = 120, h = 26): string {
  const total = t.cycle.reduce((a, p) => a + p.secs, 0) || 1;
  let x = 0;
  let y = h - 3;
  const pts = [`M0 ${y}`];
  for (const p of t.cycle) {
    const nx = x + (p.secs / total) * w;
    const ny = p.kind === "in" || p.kind === "top" ? 3 : p.kind === "out" ? h - 3 : y;
    if (p.kind === "in" || p.kind === "top" || p.kind === "out") pts.push(`C${(x + (nx - x) / 2).toFixed(1)} ${y} ${(x + (nx - x) / 2).toFixed(1)} ${ny} ${nx.toFixed(1)} ${ny}`);
    else pts.push(`L${nx.toFixed(1)} ${ny}`);
    x = nx;
    y = ny;
  }
  return pts.join(" ");
}

const RAILS: Array<{ title: string; sub: string; ids: string[] }> = [
  { title: "Start here", sub: "Gentle, no holds", ids: ["calm", "sigh", "resonance", "extended", "equal"] },
  { title: "For focus and stress", sub: "Steady and clear", ids: ["box", "triangle", "coherent", "pursed", "alternate"] },
  { title: "For sleep", sub: "Slow down toward bed", ids: ["478", "humming", "belly"] },
  { title: "Energy", sub: "Needs a safety check", ids: ["power"] },
];

const hueTwo = (h: number) => (h + 55) % 360;

/** Rows of large aura cards, one colour per technique. */
export function TechRails({ onOpen, notForYou }: { onOpen(t: Technique): void; notForYou(t: Technique): boolean }) {
  return (
    <div className="bx-rails">
      {RAILS.map((r) => {
        const ts = r.ids.map((id) => TECHNIQUES.find((t) => t.id === id)).filter((t): t is Technique => !!t);
        if (!ts.length) return null;
        return (
          <section key={r.title} aria-label={r.title}>
            <div className="bx-rh"><h3>{r.title}</h3><span>{r.sub}</span></div>
            <ul className="bx-rail">
              {ts.map((t) => (
                <li key={t.id}>
                  <button className="bx-card" style={{ "--c1": `hsl(${t.hue} 85% 58%)`, "--c2": `hsl(${hueTwo(t.hue)} 80% 55%)` } as CSSProperties} onClick={() => onOpen(t)} aria-label={`${t.name}: ${t.when}`}>
                    <span className="bx-card__a" aria-hidden="true"><i /><i /></span>
                    <span className="bx-card__k">{t.short}</span>
                    <strong>{t.name}</strong>
                    <span className="bx-card__w">{t.when}</span>
                    <svg className="bx-wave" viewBox="0 0 120 26" aria-hidden="true"><path d={wavePath(t)} /></svg>
                    <span className="bx-card__foot"><Evidence s={t.evidence} short />{notForYou(t) ? <em>Not advised for you</em> : t.gated ? <em>Read safety first</em> : null}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

/** One card per tool, each with its own picture and your latest number. */
export function ToolCards() {
  const hearts = useHearts();
  const bolts = useBolts();
  const pace = useMyPace();
  const h = hearts[hearts.length - 1];
  const b = bolts[bolts.length - 1];
  return (
    <div className="bx-tools">
      <button className="bx-tool bx-tool--pace" onClick={() => go("pace")}>
        <svg className="bx-viz" viewBox="0 0 150 150" aria-hidden="true"><circle cx="75" cy="75" r="62" /><circle className="bx-spin" cx="75" cy="75" r="62" /><circle cx="75" cy="75" r="40" className="bx-thin" /><circle className="bx-dot" cx="75" cy="13" r="7" /></svg>
        <span className="bx-tool__k">Pace finder</span><strong>Find your slow pace</strong><span className="bx-tool__w">Five one-minute rounds. Your easiest becomes yours.</span>
        <span className="bx-tool__n">{pace ? <><b>{pace}</b> breaths a minute</> : "Not set yet"}</span>
      </button>
      <button className="bx-tool bx-tool--heart" onClick={() => go("heart")}>
        <svg className="bx-viz bx-pulse" viewBox="0 0 150 150" aria-hidden="true"><circle cx="75" cy="75" r="42" className="bx-halo" /><circle cx="75" cy="75" r="28" className="bx-halo2" /><path d="M12 80 H48 L58 52 L72 108 L84 66 L92 80 H138" /></svg>
        <span className="bx-tool__k">Heart check</span><strong>Feel your pulse</strong><span className="bx-tool__w">Fingertip on the camera. Nothing is recorded.</span>
        <span className="bx-tool__n">{h ? <><b>{h.bpm}</b> bpm · <b>{h.rmssd}</b> ms HRV</> : "No reading yet"}</span>
      </button>
      <button className="bx-tool bx-tool--tide" onClick={() => go("bolt")}>
        <svg className="bx-viz" viewBox="0 0 150 150" aria-hidden="true"><defs><clipPath id="bx-clip"><circle cx="75" cy="75" r="60" /></clipPath></defs><circle cx="75" cy="75" r="60" className="bx-ring" /><g clipPath="url(#bx-clip)"><g className="bx-tide"><path d="M0 70 C25 55 50 85 75 70 S125 55 150 70 V160 H0Z" /></g></g></svg>
        <span className="bx-tool__k">Breath test</span><strong>Time a gentle hold</strong><span className="bx-tool__w">A personal trend, never a diagnosis.</span>
        <span className="bx-tool__n">{b ? <><b>{b.secs}s</b> latest</> : "No test yet"}</span>
      </button>
      <button className="bx-tool bx-tool--ground" onClick={() => go("ground")}>
        <svg className="bx-viz" viewBox="0 0 150 150" aria-hidden="true">{[60, 46, 32, 20, 9].map((r, i) => <circle key={r} cx="75" cy="75" r={r} style={{ strokeOpacity: 0.9 - i * 0.16 }} />)}</svg>
        <span className="bx-tool__k">Grounding</span><strong>5 · 4 · 3 · 2 · 1</strong><span className="bx-tool__w">Come back to the room, one sense at a time.</span>
        <span className="bx-tool__n">Muscle relaxation is right beside it</span>
      </button>
    </div>
  );
}
