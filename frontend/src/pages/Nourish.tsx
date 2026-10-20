import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Icon } from "../components/Icon";
import { motion } from "framer-motion";
import { Reveal, TiltCard, ZoomPage } from "../rooted/motion";
import { Evidence, SecTabs, Sheet, SourceLink } from "../rooted/ui";
import { FASTING, FINDINGS, MYTHS, PLATE_SOURCE, WATER_FACTS, WATER_SOURCES, type Finding } from "../rooted/nourishContent";
import { PlateBuilder, WaterTracker } from "../rooted/NourishTools";
import { Pantry } from "../rooted/Pantry";
import { Recipes } from "../rooted/Recipes";
import { MealPlanner } from "../rooted/MealPlanner";
import { FoodLogToday } from "../rooted/FoodLog";
import { Kitchen } from "../rooted/Kitchen";
import { Tonight } from "../rooted/Tonight";
import { WorldKitchen } from "../rooted/WorldKitchen";
import { DigestiveJourney, FiberAtWork, GlucoseChart } from "../rooted/NourishDiagrams";
import { Footer } from "../components/Footer";
import { ProgramRail } from "../rooted/ProgramRail";
import "./Breathe.css";
import "./Programs.css";
import { flags, useAbout } from "../store/wellness";
import "../rooted/rooted.css";
import "./BrainGuide.css";
import "./Nourish.css";
import "./Stall.css";

type GroupId = "plan" | "cook" | "world" | "shop" | "learn";
const GROUPS: Array<{ id: GroupId; label: string; tabs: Array<{ id: string; label: string }> }> = [
  { id: "plan", label: "Plan", tabs: [{ id: "today", label: "Today" }, { id: "water", label: "Water" }, { id: "planner", label: "Meal planner" }, { id: "kitchen", label: "My kitchen" }] },
  { id: "cook", label: "Cook", tabs: [{ id: "recipes", label: "Recipes" }] },
  { id: "world", label: "World", tabs: [{ id: "world", label: "World kitchen" }] },
  { id: "shop", label: "Shop", tabs: [{ id: "pantry", label: "Pantry & list" }, { id: "scan", label: "Scanner" }] },
  { id: "learn", label: "Learn", tabs: [{ id: "science", label: "The science" }, { id: "gut", label: "Inside your gut" }, { id: "sugar", label: "Blood sugar" }, { id: "plate", label: "Your plate" }, { id: "nutrients", label: "Vitamins & minerals" }, { id: "animals", label: "Animal products" }, { id: "fasting", label: "Fasting" }, { id: "myths", label: "Myths" }] },
];
/** Which group each section lives in, so a link like /nourish#water opens the right tab. */
const GROUP_OF: Record<string, GroupId> = Object.fromEntries(GROUPS.flatMap((g) => g.tabs.map((t) => [t.id, g.id])));

function FindingCard({ f, onOpen }: { f: Finding; onOpen(): void }) {
  return (
    <TiltCard className="finding" onClick={onOpen} label={`${f.title}: read more`} style={{ "--h": f.hue } as React.CSSProperties}>
      <span className="finding__stat">{f.stat}</span>
      <span className="finding__label">{f.statLabel}</span>
      <h3>{f.title}</h3>
      <div className="finding__foot">
        <Evidence s={f.evidence} short />
        <span className="finding__more">Read the study</span>
      </div>
    </TiltCard>
  );
}

function MythCard({ m }: { m: (typeof MYTHS)[number] }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="myth" style={{ perspective: 1200 }}>
      <motion.button
        className="myth__inner"
        onClick={() => setFlipped((f) => !f)}
        aria-pressed={flipped}
        aria-label={`${m.claim}. ${flipped ? "Showing the answer" : "Tap to reveal the verdict"}`}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 140, damping: 18 }}
      >
        <span className="myth__face myth__front">
          <span className="rooted__eyebrow">Claim</span>
          <strong>"{m.claim}"</strong>
          <span className="myth__tap">Tap to check it</span>
        </span>
        <span className="myth__face myth__back">
          <span className={`myth__verdict myth__verdict--${m.verdict.replace(" ", "-").toLowerCase()}`}>{m.verdict}</span>
          <span className="myth__body">{m.body}</span>
        </span>
      </motion.button>
      {m.source && <div className="myth__src"><SourceLink s={m.source} /></div>}
    </div>
  );
}

export default function Nourish() {
  const location = useLocation();
  const [finding, setFinding] = useState<Finding | null>(null);
  const f = flags(useAbout().considerations);

  const [group, setGroup] = useState<GroupId>(() => GROUP_OF[location.hash.replace("#", "")] ?? "plan");

  // The Market Stall look applies to this section and its pop-ups, then is removed when you leave.
  useEffect(() => {
    document.documentElement.dataset.skin = "stall";
    return () => { delete document.documentElement.dataset.skin; };
  }, []);

  useEffect(() => {
    const id = location.hash.replace("#", "");
    if (!id) return;
    if (GROUP_OF[id]) setGroup(GROUP_OF[id]);
    const t = setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }), 650);
    return () => clearTimeout(t);
  }, [location.hash]);

  return (
    <ZoomPage className="rooted nourish stall">
      <header className="stall__mast">
        <div className="stall__mast-text">
          <span className="stall__date">{new Date().toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" }).toUpperCase()}</span>
          <h1>What's <em>cooking?</em></h1>
          <p>Food and water, by the evidence. Every claim is rated and every source is linked.</p>
        </div>
        <div className="stall__ctas">
          <Link className="stall__pill stall__pill--ink" to="/scan?camera=1"><Icon name="barcode" size={20} /> Scan a product</Link>
          <button className="stall__pill" onClick={() => { setGroup("plan"); setTimeout(() => document.getElementById("planner")?.scrollIntoView({ behavior: "smooth", block: "start" }), 100); }}>Plan my week</button>
        </div>
      </header>

      <div className="nourish__groups" role="tablist" aria-label="Nourish sections">
        {GROUPS.map((g) => (
          <button key={g.id} role="tab" aria-selected={group === g.id} className={`nourish__group ${group === g.id ? "is-on" : ""}`} onClick={() => { setGroup(g.id); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
            {g.label}
          </button>
        ))}
      </div>

      <section id="programs" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Programs</span>
          <h2>A few days to a new habit</h2>
        </Reveal>
        <ProgramRail section="nourish" />
      </section>

      <SecTabs key={group} tabs={GROUPS.find((g) => g.id === group)!.tabs} />

      {group === "plan" && (
        <>
          <Tonight onPlan={() => document.getElementById("planner")?.scrollIntoView({ behavior: "smooth", block: "start" })} />
      <section id="today" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Food log</span>
          <h2>What showed up today</h2>
          <p className="rooted__lead">A light log of what you ate, which food groups and plants showed up. No calories, no portions, no targets.</p>
        </Reveal>
        <FoodLogToday />
      </section>
      <section id="water" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Water</span>
          <h2>Hydration, without the hype</h2>
          <p className="rooted__lead">Log what you drink. Your goal is just for drinks; food covers about a fifth of your water.</p>
        </Reveal>
        <Reveal><WaterTracker /></Reveal>
        <div className="facts">
          {WATER_FACTS.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.06} className="fact r-card">
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </Reveal>
          ))}
        </div>
        <p className="nourish__src">{WATER_SOURCES.map((s) => <SourceLink key={s.text} s={s} />)}</p>
      </section>
      <section id="planner" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Meal planner</span>
          <h2>Plan your week, then shop once</h2>
          <p className="rooted__lead">Drop a recipe into any meal, or let us fill your lunches and dinners. Your shopping list builds itself from the week, leaving out what you already have.</p>
        </Reveal>
        <MealPlanner />
      </section>
      <section id="kitchen" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">My kitchen</span>
          <h2>Cook with what you have</h2>
          <p className="rooted__lead">Tick what's already at home. We'll show the recipes you can make now, the ones that are one or two items away, and add what's missing to your list.</p>
        </Reveal>
        <Kitchen />
      </section>
        </>
      )}
      {group === "cook" && (
        <>
      <section id="recipes" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Recipes</span>
          <h2>Simple meals from the pantry</h2>
          <p className="rooted__lead">
            Thirty minutes or less, ten ingredients or fewer, mostly plants. Each one shows its rough plate split and why it's good, with the evidence rated.
            Add the ingredients to your list in one tap.
          </p>
        </Reveal>
        <Recipes />
      </section>
        </>
      )}
      {group === "world" && (
        <>
      <section id="world" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">World kitchen</span>
          <h2>Eat around the world</h2>
          <p className="rooted__lead">Spin the globe and tap a country, or pick a culture from the list. Each has classic home dishes with the evidence behind them, and one tap puts a dish's ingredients on your list under its name.</p>
        </Reveal>
        <WorldKitchen />
      </section>
        </>
      )}
      {group === "shop" && (
        <>
      <section id="pantry" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Pantry & shopping list</span>
          <h2>Learn it, then list it</h2>
          <p className="rooted__lead">
            Foods, herbs and teas, each with what the research says, how to use it, who should be careful, and where to find it. Add what you want to your list,
            then download it or send it to your phone for the store.
          </p>
        </Reveal>
        <Pantry />
      </section>
      <section id="scan" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Product scanner</span>
          <h2>See what's in a product</h2>
          <p className="rooted__lead">Scan a barcode or paste an ingredient list. Every additive is rated red, orange, yellow or green, with the evidence and sources behind it, plus a score out of 100.</p>
        </Reveal>
        <Reveal><Link className="btn btn--primary btn--big" to="/scan?camera=1"><Icon name="barcode" size={22} /> Scan a product</Link></Reveal>
      </section>
        </>
      )}
      {group === "learn" && (
        <>
      <section id="science" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">The science</span>
          <h2>Five habits with the strongest evidence</h2>
          <p className="rooted__lead">Not trends: large trials and meta-analyses. Tap any card for the study and what to do with it.</p>
        </Reveal>
        <div className="findings">
          {FINDINGS.map((f, i) => (
            <Reveal key={f.id} delay={i * 0.07}>
              <FindingCard f={f} onOpen={() => setFinding(f)} />
            </Reveal>
          ))}
        </div>
      </section>
      <section id="gut" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Inside your gut</span>
          <h2>Follow a bite through your body</h2>
          <p className="rooted__lead">Tap each stop to see what happens to your food, and how long it takes.</p>
        </Reveal>
        <Reveal><DigestiveJourney /></Reveal>
        <Reveal className="sec-block__head nourish__subhead">
          <h2>How fiber works</h2>
          <p className="rooted__lead">Fiber is the part of plants your body can't digest, and that's exactly why it matters.</p>
        </Reveal>
        <Reveal><FiberAtWork /></Reveal>
      </section>
      <section id="sugar" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Blood sugar</span>
          <h2>Two easy ways to flatten the spike</h2>
          <p className="rooted__lead">Hover or drag across the chart. Tap the labels to compare.</p>
        </Reveal>
        <Reveal><GlucoseChart /></Reveal>
      </section>
      <section id="plate" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Your plate</span>
          <h2>Build a balanced plate</h2>
          <p className="rooted__lead">Half vegetables and fruit, a quarter whole grains, a quarter healthy protein, cooked with olive oil, with water to drink. It's a simple model built from decades of nutrition research.</p>
        </Reveal>
        <Reveal><PlateBuilder /></Reveal>
        <p className="nourish__src"><SourceLink s={PLATE_SOURCE} /></p>
      </section>
      <section id="nutrients" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Vitamins &amp; minerals</span>
          <h2>What each one does, and where to find it</h2>
          <p className="rooted__lead">Magnesium, vitamin D with K2, iron, B12 and every other vitamin and mineral: what they do for you, the fruit, vegetables and other foods rich in them, and who should take care.</p>
        </Reveal>
        <Reveal><Link to="/nutrients" className="btn btn--primary">Open the guide</Link></Reveal>
      </section>
      <section id="animals" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Animal products</span>
          <h2>Meat, milk and eggs: how they're raised</h2>
          <p className="rooted__lead">Antibiotics, hormones, feed additives, organic versus conventional, and what the labels really mean, with sources and honest ratings for how solid the evidence is.</p>
        </Reveal>
        <Reveal><Link to="/animal-products" className="btn btn--primary">Open the guide</Link></Reveal>
      </section>
      <section id="fasting" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Fasting & timing</span>
          <h2>When you eat, and how to break a fast</h2>
          {f.noFasting && <p className="for-you"><span><strong>Based on your profile:</strong> fasting isn't a good fit without medical guidance. Focus on the plate and fiber habits above instead.</span></p>}
        </Reveal>
        <div className="fasting">
          <Reveal className="r-card fasting__main">
            <ul>{FASTING.points.map((p) => <li key={p}>{p}</li>)}</ul>
            <p className="nourish__src">{FASTING.sources.map((s) => <SourceLink key={s.text} s={s} />)}</p>
          </Reveal>
          <Reveal delay={0.08} className="r-card fasting__no">
            <h3>Skip fasting, or get medical advice first, if you are:</h3>
            <ul>{FASTING.noGo.map((p) => <li key={p}>{p}</li>)}</ul>
          </Reveal>
        </div>
      </section>
      <section id="myths" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Myths</span>
          <h2>Popular claims, checked</h2>
          <p className="rooted__lead">Tap a card to flip it.</p>
        </Reveal>
        <div className="myths">
          {MYTHS.map((m, i) => (
            <Reveal key={m.claim} delay={(i % 3) * 0.07}><MythCard m={m} /></Reveal>
          ))}
        </div>
      </section>
        </>
      )}

      <p className="nourish__disclaimer">
        This is general information based on published research, not medical or dietary advice for you. If you're pregnant, have a health condition, take
        medicine, or have a history of disordered eating, talk to a doctor or registered dietitian before changing how you eat.
      </p>

      <Sheet open={!!finding} onClose={() => setFinding(null)} label={finding?.title ?? ""}>
        {finding && (
          <article className="fdetail" style={{ "--h": finding.hue } as React.CSSProperties}>
            <div className="fdetail__top">
              <span className="finding__stat">{finding.stat}</span>
              <span className="finding__label">{finding.statLabel}</span>
            </div>
            <div className="fdetail__body">
              <h2>{finding.title}</h2>
              <Evidence s={finding.evidence} />
              <p>{finding.body}</p>
              <div className="fdetail__do"><strong>Try this</strong><p>{finding.doThis}</p></div>
              <SourceLink s={finding.source} />
            </div>
          </article>
        )}
      </Sheet>
      <Footer />
    </ZoomPage>
  );
}
