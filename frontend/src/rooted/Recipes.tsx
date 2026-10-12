import { useId, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ALLERGEN_LABEL, RECIPES, TAG_LABEL, hasVitaminKFlag, itemsToAdd, type Recipe, type RecipeTag } from "./recipes";
import { Evidence, Sheet, SourceLink, useToast } from "./ui";
import { TiltCard } from "./motion";
import { ScheduleButton } from "./CalendarUI";
import { useNourish, useShoppingList } from "../store/nourish";
import { flags, useAbout } from "../store/wellness";
import { Icon } from "../components/Icon";

type Filter = "all" | Extract<RecipeTag, "quick" | "fiber" | "protein" | "omega-3" | "gut">;
const FILTERS: Array<{ id: Filter; label: string }> = [
  { id: "all", label: "All" },
  { id: "quick", label: "Quick" },
  { id: "fiber", label: "High fiber" },
  { id: "protein", label: "Plant protein" },
  { id: "omega-3", label: "Omega-3" },
  { id: "gut", label: "Gut-friendly" },
];

/** Colors match the Build-a-plate tool. */
const PLATE_COLORS = { veg: "#7cb342", grain: "#f9a825", protein: "#a1887f" } as const;
const PLATE_LABEL = { veg: "Veg & fruit", grain: "Grains", protein: "Protein" } as const;

/** A tiny plate whose segments sweep in to show the recipe's rough split. */
function RecipePlate({ r, size = 72 }: { r: Recipe; size?: number }) {
  const reduce = useReducedMotion();
  const maskId = `rplate-${useId().replace(/:/g, "")}`;
  const R = 15.9155; // circumference of 100
  let offset = 0;
  const segs = (Object.keys(PLATE_COLORS) as Array<keyof typeof PLATE_COLORS>)
    .map((k) => ({ k, share: r.plate[k] }))
    .filter((s) => s.share > 0)
    .map((s) => {
      const seg = { ...s, start: offset };
      offset += s.share * 100;
      return seg;
    });
  const label = segs.map((s) => `${PLATE_LABEL[s.k]} ${Math.round(s.share * 100)}%`).join(", ");
  return (
    <svg viewBox="0 0 42 42" width={size} height={size} className="rplate" role="img" aria-label={`Rough plate split: ${label}`}>
      <circle cx="21" cy="21" r="20" fill="rgba(243,234,216,0.07)" stroke="rgba(243,234,216,0.18)" strokeWidth="0.6" />
      <defs>
        <mask id={maskId}>
          <motion.circle
            cx="21"
            cy="21"
            r={R}
            fill="none"
            stroke="#fff"
            strokeWidth="8"
            transform="rotate(-90 21 21)"
            initial={reduce ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          />
        </mask>
      </defs>
      <g transform="rotate(-90 21 21)" mask={`url(#${maskId})`}>
        {segs.map((s) => (
          <circle
            key={s.k}
            cx="21"
            cy="21"
            r={R}
            fill="none"
            stroke={PLATE_COLORS[s.k]}
            strokeWidth="7"
            strokeDasharray={`${Math.max(0, s.share * 100 - 1.2)} ${100 - s.share * 100 + 1.2}`}
            strokeDashoffset={-s.start}
          />
        ))}
      </g>
      <circle cx="21" cy="21" r="9" fill="#141813" />
    </svg>
  );
}

function PlateLegend({ r }: { r: Recipe }) {
  return (
    <ul className="rplate__legend">
      {(Object.keys(PLATE_COLORS) as Array<keyof typeof PLATE_COLORS>).filter((k) => r.plate[k] > 0).map((k) => (
        <li key={k}><i style={{ background: PLATE_COLORS[k] }} />{PLATE_LABEL[k]}<b>~{Math.round(r.plate[k] * 100)}%</b></li>
      ))}
    </ul>
  );
}

export function Recipes() {
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<Recipe | null>(null);
  const shown = useMemo(() => (filter === "all" ? RECIPES : RECIPES.filter((r) => r.tags.includes(filter))), [filter]);

  return (
    <>
      <div className="recipes__chips" role="group" aria-label="Filter recipes">
        {FILTERS.map((f) => (
          <button key={f.id} className={`chip ${filter === f.id ? "is-on" : ""}`} aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
            {f.label}
          </button>
        ))}
      </div>

      <motion.ul className="recipes__grid" layout>
        <AnimatePresence initial={false}>
          {shown.map((r) => (
            <motion.li key={r.id} layout initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.25 }}>
              <TiltCard className="rcard" max={5} onClick={() => setOpen(r)} label={`${r.title}: open recipe`} style={{ "--h": r.hue } as React.CSSProperties}>
                <div className="rcard__top">
                  <RecipePlate r={r} />
                  <span className="rcard__time"><Icon name="timer" size={14} /> {r.minutes} min</span>
                </div>
                <strong>{r.title}</strong>
                <span className="rcard__blurb">{r.blurb}</span>
                <span className="rcard__tags">
                  {r.tags.filter((t) => t !== "vegetarian" || !r.tags.includes("vegan")).slice(0, 3).map((t) => <em key={t}>{TAG_LABEL[t]}</em>)}
                </span>
              </TiltCard>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <Sheet open={!!open} onClose={() => setOpen(null)} label={open?.title ?? "Recipe"}>
        {open && <RecipeDetail r={open} />}
      </Sheet>
    </>
  );
}

function RecipeDetail({ r }: { r: Recipe }) {
  const list = useShoppingList();
  const addItem = useNourish((s) => s.addItem);
  const toast = useToast();
  const about = useAbout();
  const f = flags(about.considerations);
  const onThinners = about.considerations.includes("thinners");
  const [have, setHave] = useState<Set<number>>(new Set());
  const onList = useMemo(() => new Set(list.map((i) => i.id)), [list]);
  const pending = itemsToAdd(r, onList);

  const addAll = () => {
    const items = itemsToAdd(r, onList);
    items.forEach((i) => addItem(i));
    toast.show(items.length ? `Added ${items.length} item${items.length === 1 ? "" : "s"}` : "Everything's already on your list");
  };
  const toggleHave = (i: number) =>
    setHave((s) => {
      const n = new Set(s);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });

  return (
    <article className="rdetail" style={{ "--h": r.hue } as React.CSSProperties}>
      <div className="rdetail__top">
        <RecipePlate r={r} size={112} />
        <div className="rdetail__head">
          <span className="rooted__eyebrow">Recipe · serves {r.serves}</span>
          <h2>{r.title}</h2>
          <span className="rdetail__meta"><Icon name="timer" size={15} /> {r.minutes} min{r.wait ? `, ${r.wait}` : ""}</span>
          <PlateLegend r={r} />
        </div>
      </div>

      <div className="rdetail__body">
        <div className="rdetail__actions">
          <button className="btn btn--primary btn--small" onClick={addAll} disabled={pending.length === 0}>
            <Icon name={pending.length ? "plus" : "check"} size={18} /> {pending.length ? "Add ingredients to my list" : "All on your list"}
          </button>
          <ScheduleButton
            draft={{ title: `Cook: ${r.title}`, kind: "nourish", minutes: r.minutes, repeat: "none", to: "/nourish#recipes", time: "18:00" }}
            label="Plan to cook it"
          />
        </div>

        {about.considerations.includes("eating") && (
          <p className="for-you"><span><strong>Based on your profile:</strong> amounts here are just for shopping. Eat what feels right for you, and a dietitian can help if meals feel stressful.</span></p>
        )}
        {onThinners && hasVitaminKFlag(r) && (
          <p className="for-you"><span><strong>Based on your profile:</strong> this recipe has leafy greens. With warfarin, steady amounts week to week matter more than avoiding them.</span></p>
        )}
        {f.careHerbs && r.ingredients.some((i) => i.pantryId === "burdock-root") && (
          <p className="for-you"><span><strong>Based on your profile:</strong> burdock as a vegetable side is usually fine, but check with your clinician if you take diabetes or blood-pressure medicine.</span></p>
        )}

        <section>
          <h3>Ingredients</h3>
          <ul className="rdetail__ing">
            {r.ingredients.map((ing, i) => (
              <li key={i}>
                <button className={`rdetail__check ${have.has(i) ? "is-done" : ""}`} onClick={() => toggleHave(i)} aria-pressed={have.has(i)} aria-label={`${ing.name}: ${have.has(i) ? "have it" : "mark as have it"}`}>
                  <span className="slist__check">{have.has(i) && <Icon name="check" size={16} />}</span>
                  <span className="rdetail__name">{ing.name}</span>
                  <span className="rdetail__amt">{ing.amount}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="rdetail__hint">Tick what you already have. The list button adds anything not already on your shopping list.</p>
        </section>

        <section>
          <h3>Steps</h3>
          <ol className="rdetail__steps">{r.steps.map((s) => <li key={s}>{s}</li>)}</ol>
        </section>

        <section className="rdetail__why">
          <h3>Why it's good <Evidence s={r.why.evidence} /></h3>
          <p>{r.why.text}</p>
          <ul className="pdetail__sources">{r.why.sources.map((s) => <li key={s.text}><SourceLink s={s} /></li>)}</ul>
        </section>

        {(r.allergens.length > 0 || r.cautions.length > 0) && (
          <section className="pdetail__caution">
            <h3><Icon name="info" size={18} /> Good to know</h3>
            {r.allergens.length > 0 && (
              <p className="rdetail__allergens">Contains: {r.allergens.map((a) => <em key={a}>{ALLERGEN_LABEL[a]}</em>)}</p>
            )}
            <ul className="pdetail__list">{r.cautions.map((c) => <li key={c}>{c}</li>)}</ul>
          </section>
        )}
        {r.swaps && (
          <section>
            <h3>Swaps</h3>
            <ul className="pdetail__list">{r.swaps.map((s) => <li key={s}>{s}</li>)}</ul>
          </section>
        )}
        <p className="pdetail__fine">General information, not medical or dietary advice.</p>
      </div>
      {toast.node}
    </article>
  );
}
