import { useEffect, useState } from "react";
import { Icon } from "../components/Icon";
import { Sheet } from "./ui";

export interface GuideFeature { title: string; tab: string; to: string; body: string; tip: string }
export interface GuideContent { key: string; label: string; title: string; lede: string; features: GuideFeature[]; honest: string[] }

/** A "how this section works" tour, opened once for newcomers and any time from a button. */
export function SectionGuide({ guide, open, onClose, onGo }: { guide: GuideContent; open: boolean; onClose(): void; onGo(to: string): void }) {
  return (
    <Sheet open={open} onClose={onClose} label={guide.title}>
      <div className="sguide">
        <span className="rooted__eyebrow">{guide.label}</span>
        <h2>{guide.title}</h2>
        <p className="sguide__lede">{guide.lede}</p>
        <ol className="sguide__list">
          {guide.features.map((f) => (
            <li key={f.title}>
              <div className="sguide__top"><span className="sguide__tab">{f.tab}</span><strong>{f.title}</strong></div>
              <p>{f.body}</p>
              <p className="sguide__tip"><Icon name="info" size={15} /> {f.tip}</p>
              <button className="btn btn--secondary btn--small" onClick={() => { onClose(); onGo(f.to); }}>Open {f.title}</button>
            </li>
          ))}
        </ol>
        <section className="sguide__honest">
          <h3>How we keep it honest</h3>
          <ul>{guide.honest.map((h) => <li key={h}>{h}</li>)}</ul>
        </section>
        <button className="btn btn--primary" onClick={onClose}>Got it</button>
      </div>
    </Sheet>
  );
}

/** Opens the guide once, the first time someone visits the section on this device. */
export function useFirstVisitGuide(key: string): [boolean, (v: boolean) => void] {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    try {
      if (!localStorage.getItem(key)) {
        const t = setTimeout(() => setOpen(true), 900);
        return () => clearTimeout(t);
      }
    } catch { /* storage blocked: skip the auto-open */ }
  }, [key]);
  const set = (v: boolean) => {
    setOpen(v);
    if (!v) try { localStorage.setItem(key, "1"); } catch { /* ignore */ }
  };
  return [open, set];
}

export const BREATHE_GUIDE: GuideContent = {
  key: "rooted-breathe-guide-seen",
  label: "Guide",
  title: "How Breathe works",
  lede: "Short, guided breathing for the moments you need it, with the evidence behind each technique. Here's everything it offers and where to find it.",
  features: [
    { tab: "Start", title: "Quick picks and Again", to: "breathe", body: "Tap what you need (settle in, too much, sleep, focus, energy) and a pattern starts. After your first session, Again repeats your last one in one tap.", tip: "One minute is enough to feel a difference for many people." },
    { tab: "Breathing", title: "Techniques", to: "breathe", body: "Fourteen guided patterns, from resonance and cyclic sighing to box and 4-7-8. Each says when to use it, how strong the evidence is, and has no-hold options.", tip: "The Strong, Moderate, Weak and Mixed labels tell you how much to trust each claim." },
    { tab: "Pace", title: "Find your pace", to: "pace", body: "Five one-minute rounds at slightly different slow paces. You say how each felt, and your easiest one is saved as your resonance pace.", tip: "It's by feel, not a measurement. It gives you a comfortable place to start." },
    { tab: "Breathing", title: "Your own patterns", to: "breathe", body: "Build your own in, hold, out and rest counts and save them for later.", tip: "Set holds to zero for the gentlest version." },
    { tab: "During", title: "Sound, volume and eyes-closed", to: "breathe", body: "Choose chimes, a voice, a breath tone or silence, plus a background like rain. Guide volume and background volume are separate, and Eyes closed blacks out the screen so you follow by sound and vibration.", tip: "Stop and breathe normally is always on screen." },
    { tab: "Progress", title: "Your results", to: "results", body: "Rate your stress before and after to see which techniques help you most, and keep an 8-week history and a gentle streak that never punishes a missed day.", tip: "Add a daily reminder so it becomes a habit." },
    { tab: "Body", title: "Heart check and breath test", to: "heart", body: "Use your phone camera on your fingertip for a heart-rate reading, or time a gentle breath hold. Nothing is recorded or uploaded.", tip: "Treat both as personal trends, not medical measurements." },
    { tab: "Mind", title: "Grounding and muscle relaxation", to: "ground", body: "A 5-4-3-2-1 grounding exercise and a guided muscle-relaxation routine when breathing alone isn't what you need.", tip: "These work well before sleep." },
    { tab: "Learn", title: "Safety and sources", to: "learnmore", body: "A short safety list and free sources from health services and researchers, in plain words.", tip: "Holds and fast breathing have extra screens for a reason." },
  ],
  honest: [
    "Every technique shows how strong its evidence is, with a source you can open.",
    "Fast breathing and breath holds sit behind a safety check, and every session has a stop button.",
    "Never practice in or near water or while driving. Sit or lie down.",
    "General wellness information, not medical advice. If you're in crisis, call or text 988 in the US.",
  ],
};

export const RITUALS_GUIDE: GuideContent = {
  key: "rooted-rituals-guide-seen",
  label: "Guide",
  title: "How Rituals work",
  lede: "Three small daily rituals, each pairing a drink with a sound session in headphones, timed to your day.",
  features: [
    { tab: "Home", title: "The three rituals", to: "", body: "Revive for the morning, Calm for the afternoon and Unwind before bed. The home screen opens on the one that fits the time of day.", tip: "Swipe or use the arrows to browse them." },
    { tab: "Detail", title: "Make the drink", to: "", body: "Tap any ingredient to see what it's for, what to know about it, how strong the evidence is, and what it pairs with.", tip: "Optional ingredients can be left out." },
    { tab: "Detail", title: "The session", to: "", body: "Binaural beats need stereo headphones, because each ear hears its own tone. The player tests each ear first, then glides the beat over the session and fades out at the end.", tip: "Research on binaural beats is mixed, so think of it as a pleasant daily cue." },
    { tab: "Schedule", title: "Reminders", to: "", body: "Set your wake time and bedtime and the three times work themselves out. Edit any time or turn a reminder off. Reminders also show in your Calendar.", tip: "Use Add to phone calendar for alerts from your phone." },
    { tab: "Track", title: "Check-offs and streak", to: "", body: "Tick the drink when you've had it. The session ticks itself when it finishes. A 7-day grid shows your week, and the streak is forgiving about today.", tip: "Any one drink or session keeps a day alive." },
    { tab: "Learn", title: "Your body clock", to: "/rituals/circadian", body: "A 24-hour clock of cortisol, the afternoon dip, melatonin and sleep stages for your wake time and bedtime.", tip: "These are typical patterns. People vary." },
  ],
  honest: [
    "These statements have not been evaluated by the FDA. Not intended to diagnose, treat, cure, or prevent any disease.",
    "Each ritual lists its cautions: medicine interactions, caffeine, diluting vinegar, valerian and driving, pregnancy and allergies.",
    "Check with a healthcare professional first if you're pregnant, nursing, on medication, or managing a condition.",
    "Not while driving or operating machinery. If you've ever had a seizure, ask a doctor before binaural sessions.",
  ],
};
