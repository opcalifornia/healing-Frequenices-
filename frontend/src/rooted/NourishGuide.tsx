import { useEffect, useState } from "react";
import { Icon } from "../components/Icon";
import { Sheet } from "./ui";

const KEY = "rooted-nourish-guide-seen";

interface Feature { title: string; tab: string; to: string; body: string; tip: string }
const FEATURES: Feature[] = [
  { tab: "Plan", title: "Today", to: "today", body: "A gentle log of what you ate, with no calorie counting, plus a tile that suggests tonight's dinner.", tip: "If food is a stressful topic for you, turn on the eating consideration in your profile and the app softens its wording." },
  { tab: "Plan", title: "Water", to: "water", body: "Tap a glass each time you drink. The goal is a general adult guideline you can change.", tip: "Tea, coffee and food all count toward your fluids." },
  { tab: "Plan", title: "Meal planner", to: "planner", body: "Drop a recipe into any meal of the week, or tap Fill to get a plan that respects your food preferences and allergies. Your shopping list builds itself from the week.", tip: "Copy last week keeps what worked." },
  { tab: "Plan", title: "My kitchen", to: "kitchen", body: "Tick what you have at home. Recipes then show how much you already have, and the list leaves those items ticked.", tip: "The Cook now filter in Recipes sorts by what you can make tonight." },
  { tab: "Cook", title: "Recipes", to: "recipes", body: "Simple meals with the evidence for why they're good. Scale to how many you're cooking for, save favourites, and open Cook mode for big step-by-step text with timers and the screen kept awake.", tip: "Share sends the recipe as text, plus a link that opens it in the app." },
  { tab: "World", title: "World kitchen", to: "world", body: "Spin the globe or pick a cuisine from the list. Every dish is a classic home dish, adapted to be quick, with a note on what was simplified.", tip: "Add a dish to your list and its ingredients are grouped under its name so you know what each is for." },
  { tab: "Shop", title: "Shopping list", to: "pantry", body: "Two views: By dish (a ticket per dish) or By aisle (one walk through the store, shared ingredients merged). Share it as plain text.", tip: "Ticking an ingredient in the aisle view ticks it for every dish." },
  { tab: "Shop", title: "Scan a product", to: "scan", body: "Point the camera at a barcode (or photograph it, or type the number). You get a 0 to 100 score built like Yuka's: nutrition 60%, additives 30%, organic 10%, with every additive explained and sourced.", tip: "Any high-risk additive caps the score at 49." },
  { tab: "Learn", title: "Learn", to: "science", body: "Short, sourced explainers: the science, your gut, sugar, the plate, nutrients, animal products, fasting, and myths. Every claim carries an evidence rating.", tip: "Strong, Moderate, Limited and Mixed tell you how much to trust a claim." },
];

const HONEST = [
  "Every health claim has an evidence rating and a source you can open.",
  "No calorie targets and no body-size framing. Amounts in recipes are for shopping and cooking.",
  "This is general information, not medical or dietary advice. If you take medicine or have a condition, check with your clinician.",
  "Recipes are simplified home versions of traditional dishes, so they're quick. They aren't claims about how a dish is made everywhere.",
];

/** First-visit tour and a "Guide" you can reopen any time. */
export function NourishGuide({ open, onClose, onGo }: { open: boolean; onClose(): void; onGo(tab: string): void }) {
  return (
    <Sheet open={open} onClose={onClose} label="How Nourish works">
      <div className="nguide">
        <span className="rooted__eyebrow">Guide</span>
        <h2>How Nourish works</h2>
        <p className="nguide__lede">Plan the week, shop once, cook with big friendly steps, and learn what's behind it. Here's everything it offers and where to find it.</p>
        <ol className="nguide__list">
          {FEATURES.map((f) => (
            <li key={f.title}>
              <div className="nguide__top"><span className="nguide__tab">{f.tab}</span><strong>{f.title}</strong></div>
              <p>{f.body}</p>
              <p className="nguide__tip"><Icon name="info" size={15} /> {f.tip}</p>
              <button className="btn btn--secondary btn--small" onClick={() => { onClose(); onGo(f.to); }}>Open {f.title}</button>
            </li>
          ))}
        </ol>
        <section className="nguide__honest">
          <h3>How we keep it honest</h3>
          <ul>{HONEST.map((h) => <li key={h}>{h}</li>)}</ul>
        </section>
        <button className="btn btn--primary" onClick={onClose}>Got it</button>
      </div>
    </Sheet>
  );
}

/** Opens the guide once for someone new to the section. */
export function useFirstVisitGuide(): [boolean, (v: boolean) => void] {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) {
        const t = setTimeout(() => setOpen(true), 900);
        return () => clearTimeout(t);
      }
    } catch { /* storage blocked: skip the auto-open */ }
  }, []);
  const set = (v: boolean) => {
    setOpen(v);
    if (!v) try { localStorage.setItem(KEY, "1"); } catch { /* ignore */ }
  };
  return [open, set];
}
