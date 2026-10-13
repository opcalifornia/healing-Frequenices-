import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Aurora, Reveal, TiltCard, ZoomPage } from "../rooted/motion";
import { Evidence, SecTabs, Sheet, SourceLink, useToast } from "../rooted/ui";
import { BASICS, GARDEN_SOURCES, KIND_LABEL, LIGHT_LABEL, MORE_BASICS, PLANTS, RECIPES, SAFETY_RULES, SEASON_LABEL, SOIL_SAFETY, SPACE_LABEL, WHY_GARDEN, fits, nutrientsFor, plantingAdvice, type Light, type Plant, type PlantKind, type Recipe, type Space } from "../rooted/gardenContent";
import { nutrientById } from "../rooted/nutrientsContent";
import { guessPlace, readPlace } from "../rooted/sun";
import { pantryById } from "../rooted/pantryContent";
import { useNourish, useShoppingList } from "../store/nourish";
import { daysSince, useGarden, useMyGarden } from "../store/garden";
import { flags, useAbout } from "../store/wellness";
import { Footer } from "../components/Footer";
import { Icon } from "../components/Icon";
import "../rooted/rooted.css";
import "./Breathe.css";
import "./Move.css";
import "./Combos.css";
import "./Garden.css";

const TABS = [
  { id: "plan", label: "Plan your garden" },
  { id: "why", label: "Why garden" },
  { id: "mine", label: "My garden" },
  { id: "apothecary", label: "Apothecary" },
  { id: "safety", label: "Safety" },
  { id: "basics", label: "Grow basics" },
];

function Sprout({ hue = 120, small = false }: { hue?: number; small?: boolean }) {
  return (
    <svg viewBox="0 0 100 100" className={`sprout ${small ? "sprout--small" : ""}`} style={{ "--h": hue } as React.CSSProperties} aria-hidden="true">
      <ellipse cx="50" cy="88" rx="30" ry="6" className="sprout__soil" />
      <motion.path d="M50 88C50 70 50 58 50 44" className="sprout__stem" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: "easeOut" }} />
      <motion.path d="M50 58C38 56 30 46 28 34c14 0 22 10 22 24Z" className="sprout__leaf" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8, type: "spring", stiffness: 160, damping: 12 }} style={{ transformOrigin: "50px 58px" }} />
      <motion.path d="M50 48c10-2 18-10 20-22-13 0-20 9-20 22Z" className="sprout__leaf sprout__leaf--2" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.1, type: "spring", stiffness: 160, damping: 12 }} style={{ transformOrigin: "50px 48px" }} />
    </svg>
  );
}

export default function Garden() {
  const [space, setSpace] = useState<Space>("windowsill");
  const [light, setLight] = useState<Light>("part");
  const [kind, setKind] = useState<PlantKind | "all">("all");
  const where = useMemo(() => readPlace() ?? guessPlace(), []);
  const month = new Date().getMonth();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const mine = useMyGarden();
  const { plant: addPlanting, remove } = useGarden();
  const addItem = useNourish((s) => s.addItem);
  const list = useShoppingList();
  const toast = useToast();
  const careHerbs = flags(useAbout().considerations).careHerbs;
  const shown = PLANTS.filter((p) => kind === "all" || p.kind === kind);
  const good = shown.filter((p) => fits(p, space, light));
  const rest = shown.filter((p) => !fits(p, space, light));

  const addRecipeToList = (r: Recipe) => {
    let n = 0;
    for (const ing of r.ingredients) {
      if (ing.pantryId) {
        const p = pantryById(ing.pantryId);
        if (p && !list.some((i) => i.id === p.id)) { addItem({ id: p.id, name: p.name, aisle: p.aisle }); n++; }
      } else if (ing.buy) {
        const id = `custom-${ing.buy.toLowerCase().replace(/\W+/g, "-")}`;
        if (!list.some((i) => i.id === id)) { addItem({ id, name: ing.buy, aisle: ing.aisle ?? "Other" }); n++; }
      }
    }
    toast.show(n ? `Added ${n} item${n === 1 ? "" : "s"} to your shopping list` : "Already on your list");
  };

  return (
    <ZoomPage className="rooted garden">
      <header className="sec-hero garden__hero">
        <Aurora />
        <div className="garden__demo"><Sprout /></div>
        <div className="sec-hero__text">
          <motion.span className="rooted__eyebrow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>Rooted · Garden &amp; Apothecary</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.7 }}>Grow it.<br />Brew it. Safely.</motion.h1>
          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32, duration: 0.7 }}>
            Herbs, vegetables and fruit for any space, from a windowsill to a backyard bed, what each one gives your body, simple teas made with them, and the safety rules every home garden needs.
          </motion.p>
          <motion.div className="breathe__cta" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42, duration: 0.7 }}>
            <a className="btn btn--primary btn--big" href="#plan" onClick={(e) => { e.preventDefault(); document.getElementById("plan")?.scrollIntoView({ behavior: "smooth" }); }}><Icon name="leaf" size={22} /> What can I grow?</a>
            {mine.length > 0 && <span className="breathe__stat">{mine.length} plant{mine.length === 1 ? "" : "s"} growing</span>}
          </motion.div>
        </div>
      </header>

      <SecTabs tabs={TABS} />

      <section id="plan" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Plan your garden</span>
          <h2>Tell us your space</h2>
        </Reveal>
        <div className="planner r-card">
          <div className="planner__q">
            <span>Where will it grow?</span>
            <div className="tdetail__mins">{(Object.keys(SPACE_LABEL) as Space[]).map((s) => <button key={s} className={`chip ${space === s ? "is-on" : ""}`} aria-pressed={space === s} onClick={() => setSpace(s)}>{SPACE_LABEL[s]}</button>)}</div>
          </div>
          <div className="planner__q">
            <span>How much light?</span>
            <div className="tdetail__mins">{(Object.keys(LIGHT_LABEL) as Light[]).map((l) => <button key={l} className={`chip ${light === l ? "is-on" : ""}`} aria-pressed={light === l} onClick={() => setLight(l)}>{LIGHT_LABEL[l]}</button>)}</div>
          </div>
          <div className="planner__q">
            <span>What do you want to grow?</span>
            <div className="tdetail__mins">
              <button className={`chip ${kind === "all" ? "is-on" : ""}`} aria-pressed={kind === "all"} onClick={() => setKind("all")}>Everything</button>
              {(Object.keys(KIND_LABEL) as PlantKind[]).map((k) => <button key={k} className={`chip ${kind === k ? "is-on" : ""}`} aria-pressed={kind === k} onClick={() => setKind(k)}>{KIND_LABEL[k]}</button>)}
            </div>
          </div>
          <p className="planner__count"><strong>{good.length}</strong> plants will do well there.</p>
        </div>
        <motion.div className="plants" layout>
          {[...good, ...rest].map((p) => {
            const ok = good.includes(p);
            return (
              <motion.div key={p.id} layout transition={{ type: "spring", stiffness: 260, damping: 28 }}>
                <TiltCard className={`plant ${ok ? "" : "is-dim"}`} onClick={() => setPlant(p)} label={`${p.name}: how to grow`} max={5} style={{ "--h": p.hue } as React.CSSProperties}>
                  <div className="plant__art"><Sprout hue={p.hue} small /></div>
                  <div className="plant__text">
                    <span className="tech__short">{KIND_LABEL[p.kind].replace(/s$/, "")} · {p.level} · first harvest ~{p.harvestDays < 60 ? `${p.harvestDays} days` : `${Math.round(p.harvestDays / 30)} months`}</span>
                    <strong>{p.name}</strong>
                    {ok ? <span className="plant__fit">Great fit{plantingAdvice(p, month, where.lat).now && p.season !== "any" ? " · plant now" : ""}</span> : <span className="plant__nofit">Needs {LIGHT_LABEL[p.needs].toLowerCase()}</span>}
                  </div>
                  {mine.some((m) => m.plantId === p.id) && <span className="pcard__in" title="Growing"><Icon name="leaf" size={15} /></span>}
                </TiltCard>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      <section id="why" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Why garden</span>
          <h2>What the research says</h2>
          <p className="rooted__lead">Growing things is good for more than the plate. Here is what the studies show, and how sure we can be.</p>
        </Reveal>
        <div className="findings">
          {WHY_GARDEN.map((w, i) => (
            <Reveal key={w.id} delay={i * 0.06} className="r-card finding" style={{ "--h": w.hue } as React.CSSProperties}>
              <span className="finding__stat">{w.stat}</span>
              <span className="finding__label">{w.statLabel}</span>
              <h3>{w.title}</h3>
              <Evidence s={w.rating} />
              <p>{w.body}</p>
              {w.source && <SourceLink s={w.source} />}
              {w.link && <Link className="btn btn--secondary btn--small" to={w.link.to}>{w.link.label}</Link>}
            </Reveal>
          ))}
        </div>
      </section>

      <section id="mine" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">My garden</span>
          <h2>{mine.length ? "What's growing" : "Nothing planted yet"}</h2>
          {!mine.length && <p className="rooted__lead">Open any plant above and tap "I planted this" to track it here, with a countdown to your first harvest.</p>}
        </Reveal>
        <div className="mine">
          <AnimatePresence>
            {mine.map((m) => {
              const p = PLANTS.find((x) => x.id === m.plantId);
              if (!p) return null;
              const d = daysSince(m.planted);
              const pct = Math.min(1, d / p.harvestDays);
              return (
                <motion.div key={m.plantId} layout className="r-card mine__item" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} style={{ "--h": p.hue } as React.CSSProperties}>
                  <div className="mine__ring">
                    <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" pathLength="1" className="week-ring__bg" /><motion.circle cx="50" cy="50" r="42" pathLength="1" className="mine__fill" initial={{ pathLength: 0 }} animate={{ pathLength: Math.max(0.01, pct) }} transition={{ duration: 1 }} /></svg>
                    <Sprout hue={p.hue} small />
                  </div>
                  <div>
                    <strong>{p.name}</strong>
                    <span className="mine__status">{pct >= 1 ? "Ready to harvest" : `Day ${d} · about ${p.harvestDays - d} days to first harvest`}</span>
                  </div>
                  <button className="icon-btn slist__rm" onClick={() => remove(p.id)} aria-label={`Remove ${p.name}`}><Icon name="trash" size={16} /></button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>

      <section id="apothecary" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Apothecary</span>
          <h2>Teas and simple remedies</h2>
          <p className="rooted__lead">Food-safe recipes using herbs from your garden or the Pantry, each with its evidence and cautions. One tap adds the ingredients to your shopping list.</p>
          {careHerbs && <p className="for-you"><span><strong>Based on your profile:</strong> check each recipe's cautions and ask your clinician or pharmacist before using herbs as remedies.</span></p>}
        </Reveal>
        <div className="combo-grid">
          {RECIPES.map((r, i) => (
            <Reveal key={r.id} delay={(i % 3) * 0.06}>
              <TiltCard className="combo" onClick={() => setRecipe(r)} label={`${r.name}: recipe`} style={{ "--h": r.hue, "--h2": r.hue + 30 } as React.CSSProperties}>
                <span className="tech__short">{r.time} · {r.ingredients.length} ingredients</span>
                <h3>{r.name}</h3>
                <p>{r.tagline}</p>
                <span className="tech__foot"><Evidence s={r.evidence} short /></span>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="safety" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Safety</span>
          <h2>Rules for a home apothecary</h2>
        </Reveal>
        <div className="rules">
          {[SOIL_SAFETY, ...SAFETY_RULES].map((s, i) => (
            <Reveal key={s.title} delay={(i % 3) * 0.05} className="r-card rule">
              <span className="rule__n">{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              {s.url && <a href={s.url} target="_blank" rel="noreferrer" className="src-link">{s.label} ↗</a>}
            </Reveal>
          ))}
        </div>
      </section>

      <section id="basics" className="sec-block">
        <Reveal className="sec-block__head">
          <span className="rooted__eyebrow">Grow basics</span>
          <h2>Small-space farming, simply</h2>
        </Reveal>
        <div className="rules">
          {[...BASICS, ...MORE_BASICS].map((b, i) => (
            <Reveal key={b.title} delay={(i % 3) * 0.05} className="r-card rule basic" >
              <div style={{ "--h": b.hue } as React.CSSProperties} className="basic__dot" />
              <h3>{b.title}</h3>
              <p>{b.body}</p>
              {b.url && <a href={b.url} target="_blank" rel="noreferrer" className="src-link">{b.label} ↗</a>}
            </Reveal>
          ))}
        </div>
        <p className="nourish__src">{GARDEN_SOURCES.map((s) => <SourceLink key={s.text} s={s} />)}</p>
      </section>

      <Sheet open={!!plant} onClose={() => setPlant(null)} label={plant?.name ?? ""}>
        {plant && (
          <article className="tdetail" style={{ "--h": plant.hue } as React.CSSProperties}>
            <div className="tdetail__top routine-detail__top">
              <div className="routine-detail__fig"><Sprout hue={plant.hue} /></div>
              <span className="rooted__eyebrow">{plant.level} · {LIGHT_LABEL[plant.needs]}</span>
              <h2>{plant.name}</h2>
              <p>First harvest in about {plant.harvestDays < 60 ? `${plant.harvestDays} days` : `${Math.round(plant.harvestDays / 30)} months`}.</p>
            </div>
            <div className="tdetail__body">
              <div className="grow-actions">
                {mine.some((m) => m.plantId === plant.id) ? (
                  <button className="btn btn--secondary" onClick={() => { remove(plant.id); toast.show(`Removed ${plant.name}`); }}><Icon name="check" size={18} /> Growing · remove</button>
                ) : (
                  <button className="btn btn--primary" onClick={() => { addPlanting(plant.id); toast.show(`${plant.name} added to My garden`); }}><Icon name="leaf" size={18} /> I planted this</button>
                )}
                <button className="btn btn--secondary" onClick={() => { const id = `garden-${plant.id}`; if (!list.some((i) => i.id === id)) addItem({ id, name: `${plant.name}: ${plant.start.split(/[,(]/)[0].trim().toLowerCase()}`, aisle: "Garden" }); toast.show("Added to your shopping list"); }}>Add to shopping list</button>
              </div>
              <dl className="grow-facts">
                <div><dt>Start with</dt><dd>{plant.start}</dd></div>
                <div><dt>Where</dt><dd>{plant.spaces.map((s) => SPACE_LABEL[s]).join(", ")}</dd></div>
                <div><dt>Water</dt><dd>{plant.water}</dd></div>
                <div><dt>Use it for</dt><dd>{plant.use}</dd></div>
              </dl>
              <section>
                <h3>When to plant</h3>
                <p><strong>{SEASON_LABEL[plant.season]}.</strong> {plantingAdvice(plant, month, where.lat).text}</p>
              </section>
              {nutrientsFor(plant).length > 0 && (
                <section>
                  <h3>What it gives you</h3>
                  <p>A good source of these vitamins and minerals:</p>
                  <div className="ndetail__chips">{nutrientsFor(plant).map((id) => <Link key={id} className="chip" to={`/nutrients?open=${id}`} onClick={() => setPlant(null)}>{nutrientById(id)?.name}</Link>)}</div>
                </section>
              )}
              <section><h3>Grower's tip</h3><p>{plant.tip}</p></section>
              {plant.caution && <p className="for-you"><span><strong>Heads up:</strong> {plant.caution}</span></p>}
              {plant.pantryId && <Link className="btn btn--secondary btn--small" to="/nourish#pantry" onClick={() => setPlant(null)}>What the research says about {pantryById(plant.pantryId)?.name.toLowerCase()}</Link>}
            </div>
          </article>
        )}
      </Sheet>

      <Sheet open={!!recipe} onClose={() => setRecipe(null)} label={recipe?.name ?? ""}>
        {recipe && (
          <article className="tdetail" style={{ "--h": recipe.hue, "--h2": recipe.hue + 30 } as React.CSSProperties}>
            <div className="tdetail__top combo-detail__top">
              <span className="rooted__eyebrow">{recipe.time}</span>
              <h2>{recipe.name}</h2>
              <p>{recipe.tagline}</p>
            </div>
            <div className="tdetail__body">
              <section className="recipe__ings">
                <h3>You'll need</h3>
                <ul>{recipe.ingredients.map((i) => <li key={i.text}>{i.text}</li>)}</ul>
                <button className="btn btn--primary btn--small" onClick={() => addRecipeToList(recipe)}><Icon name="plus" size={18} /> Add to shopping list</button>
              </section>
              <section>
                <h3>Steps</h3>
                <ol className="recipe__steps">{recipe.steps.map((s) => <li key={s}>{s}</li>)}</ol>
              </section>
              <section className="pdetail__caution">
                <h3><Icon name="info" size={18} /> Safety</h3>
                <ul className="pdetail__list">{recipe.safety.map((s) => <li key={s}>{s}</li>)}</ul>
              </section>
              <section><h3>Why <Evidence s={recipe.evidence} /></h3><p>{recipe.why}</p></section>
            </div>
          </article>
        )}
      </Sheet>
      {toast.node}
      <Footer />
    </ZoomPage>
  );
}
