import { useMemo, useState } from "react";
import { Icon } from "../components/Icon";
import { Sheet, useToast } from "./ui";
import { ScheduleButton } from "./CalendarUI";
import { ALLERGEN_LABEL, TAG_LABEL, dishListItems, hasVitaminKFlag, type Allergen, type Recipe, type RecipeTag } from "./recipes";
import { RecipeDetail, RecipePlate } from "./Recipes";
import { ALL_RECIPES } from "./allRecipes";
import { fitsSlot, forGoals, keyOf, plannedRecipes, recipeById, suggestFill, suitable, weekDays, weekPlate, weekStart, type Diet } from "./mealPlan";
import { SLOTS, SLOT_LABEL, useMealPlan, useMyPlan, type MealEntry, type Slot } from "../store/mealPlan";
import { useKitchen, useNourish, useShoppingList } from "../store/nourish";
import { nearlyReady } from "./kitchen";
import { useAbout } from "../store/wellness";

const QUICK_NOTES = ["Leftovers", "Eating out", "Cook extra", "Fruit and yogurt", "Oats", "Eggs and toast"];
type Filter = "all" | "mine" | Extract<RecipeTag, "quick" | "fiber" | "protein" | "omega-3" | "gut">;
const FILTERS: Array<{ id: Filter; label: string }> = [
  { id: "all", label: "All" },
  { id: "quick", label: "Quick" },
  { id: "fiber", label: "High fiber" },
  { id: "protein", label: "Plant protein" },
  { id: "omega-3", label: "Omega-3" },
  { id: "gut", label: "Gut-friendly" },
];
const ALLERGENS = Object.keys(ALLERGEN_LABEL) as Allergen[];
const PLATE = { veg: ["Veg & fruit", "#7cb342"], grain: ["Grains", "#f9a825"], protein: ["Protein", "#a1887f"] } as const;

const dayLabel = (d: Date) => d.toLocaleDateString(undefined, { weekday: "short" });
const dateLabel = (d: Date) => d.toLocaleDateString(undefined, { month: "short", day: "numeric" });

/** The plan as plain text that pastes into Notes, a message or an email. */
export function planToText(start: Date, plan: ReturnType<typeof useMyPlan>): string {
  const lines = [`Meal plan, week of ${dateLabel(start)}`, ""];
  for (const d of weekDays(start)) {
    const day = plan[keyOf(d)] ?? {};
    const meals = SLOTS.filter((s) => day[s]).map((s) => `  ${SLOT_LABEL[s]}: ${day[s]?.recipeId ? recipeById(day[s]?.recipeId)?.title ?? "A recipe" : day[s]?.text}`);
    lines.push(`${dayLabel(d)} ${dateLabel(d)}`, ...(meals.length ? meals : ["  Nothing planned"]), "");
  }
  return lines.join("\n").trimEnd() + "\n";
}

export function MealPlanner() {
  const plan = useMyPlan();
  const { setMeal, setMany, clearDays } = useMealPlan.getState();
  const list = useShoppingList();
  const addItems = useNourish((s) => s.addItems);
  const about = useAbout();
  const toast = useToast();

  const [start, setStart] = useState(() => weekStart(new Date()));
  const [diet, setDiet] = useState<Diet>({});
  const [picker, setPicker] = useState<{ day: string; slot: Slot } | null>(null);
  const [view, setView] = useState<Recipe | null>(null);
  const [shop, setShop] = useState(false);
  const [skip, setSkip] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [note, setNote] = useState("");
  const [offset, setOffset] = useState(0);
  const goalRecipes = useMemo(() => new Set(forGoals(ALL_RECIPES, about.goals).map((r) => r.id)), [about.goals]);
  const hasGoalFilter = goalRecipes.size > 0 && goalRecipes.size < ALL_RECIPES.length;
  const [mine, setMine] = useState(true);
  const have = useKitchen();
  const readySet = useMemo(() => new Set(nearlyReady(have, 1).map((s) => s.recipe.id)), [have]);
  const [useHave, setUseHave] = useState(true);

  const days = useMemo(() => weekDays(start), [start]);
  const keys = useMemo(() => days.map(keyOf), [days]);
  const today = keyOf(new Date());
  const thisWeek = keyOf(weekStart(new Date())) === keyOf(start);
  const pool = useMemo(() => suitable(diet), [diet]);
  const planned = useMemo(() => plannedRecipes(plan, keys), [plan, keys]);
  const mealCount = useMemo(() => keys.reduce((n, k) => n + SLOTS.filter((s) => plan[k]?.[s]).length, 0), [plan, keys]);
  const plate = weekPlate(planned);
  const tagCount = (t: RecipeTag) => planned.filter((r) => r.tags.includes(t)).length;
  const onList = useMemo(() => list.map((i) => i.id), [list]);
  // One group per planned dish, in the order planned. A food two dishes need appears under each, so every item says what it is for.
  const byDish = useMemo(() => {
    const seen = new Set<string>();
    return planned.filter((r) => (seen.has(r.id) ? false : (seen.add(r.id), true))).map((r) => ({ recipe: r, items: dishListItems(r, onList, have) })).filter((d) => d.items.length > 0);
  }, [planned, onList, have]);
  const needed = useMemo(() => byDish.flatMap((d) => d.items), [byDish]);
  const shown = needed.filter((i) => !skip.has(i.id));
  const onThinners = about.considerations.includes("thinners");

  const move = (weeks: number) => setStart((s) => new Date(s.getFullYear(), s.getMonth(), s.getDate() + weeks * 7));
  const toggleDiet = (k: "vegetarian" | "vegan") => setDiet((d) => ({ ...d, [k]: !d[k], ...(k === "vegan" && !d.vegan ? { vegetarian: false } : {}) }));
  const toggleAvoid = (a: Allergen) => setDiet((d) => ({ ...d, avoid: d.avoid?.includes(a) ? d.avoid.filter((x) => x !== a) : [...(d.avoid ?? []), a] }));

  const choose = (entry: MealEntry | null) => {
    if (!picker) return;
    setMeal(picker.day, picker.slot, entry);
    setPicker(null);
    setNote("");
  };

  const fill = (slots: Slot[] = ["lunch", "dinner"]) => {
    if (!pool.length) return toast.show("No recipes match your filters");
    const prefer = new Set<string>([...(useHave ? readySet : []), ...(hasGoalFilter && mine && !(useHave && readySet.size) ? goalRecipes : [])]);
    const changes = suggestFill(plan, keys, pool, offset, slots, prefer.size ? prefer : undefined);
    if (!changes.length) return toast.show(slots.includes("breakfast") ? "Your breakfasts are already planned, or none fit your filters" : "Your lunches and dinners are already planned");
    setMany(changes);
    setOffset((o) => o + changes.length);
    toast.show(`Planned ${changes.length} meal${changes.length === 1 ? "" : "s"}. Tap any to swap it`);
  };

  const copyLastWeek = () => {
    const prev = weekDays(new Date(start.getFullYear(), start.getMonth(), start.getDate() - 7)).map(keyOf);
    const changes: Array<{ day: string; slot: Slot; entry: MealEntry }> = [];
    prev.forEach((pk, i) => SLOTS.forEach((s) => {
      const e = plan[pk]?.[s];
      if (e && !plan[keys[i]]?.[s]) changes.push({ day: keys[i], slot: s, entry: e });
    }));
    if (!changes.length) return toast.show("Nothing to copy from last week");
    setMany(changes);
    toast.show(`Copied ${changes.length} meal${changes.length === 1 ? "" : "s"} from last week`);
  };

  const addToList = () => {
    addItems(shown);
    setShop(false);
    setSkip(new Set());
    toast.show(shown.length ? `Added ${shown.length} item${shown.length === 1 ? "" : "s"} for ${new Set(shown.map((i) => i.dish.id)).size} dish${new Set(shown.map((i) => i.dish.id)).size === 1 ? "" : "es"}` : "Nothing new to add");
  };

  const share = async () => {
    const text = planToText(start, plan);
    try {
      if (navigator.share) await navigator.share({ title: "Meal plan", text });
      else {
        await navigator.clipboard.writeText(text);
        toast.show("Plan copied. Paste it anywhere");
      }
    } catch {
      /* the person closed the share sheet */
    }
  };

  const slotNow = picker?.slot;
  const choices = pool.filter((r) => (filter === "all" || (filter === "mine" ? goalRecipes.has(r.id) : r.tags.includes(filter))) && (!query.trim() || r.title.toLowerCase().includes(query.trim().toLowerCase()) || r.blurb.toLowerCase().includes(query.trim().toLowerCase()))).sort((a, b) => (slotNow ? Number(fitsSlot(b, slotNow)) - Number(fitsSlot(a, slotNow)) : 0));
  const hidden = ALL_RECIPES.length - pool.length;
  const current = picker ? plan[picker.day]?.[picker.slot] : undefined;

  return (
    <div className="mpl">
      <div className="mpl__bar">
        <button className="mpl__nav" onClick={() => move(-1)} aria-label="Previous week"><Icon name="chevronLeft" size={20} /></button>
        <div className="mpl__week">
          <strong>{dateLabel(days[0])} to {dateLabel(days[6])}</strong>
          <small>{thisWeek ? "This week" : "Tap This week to come back"}</small>
        </div>
        <button className="mpl__nav" onClick={() => move(1)} aria-label="Next week"><Icon name="chevronRight" size={20} /></button>
        {!thisWeek && <button className="btn btn--secondary btn--small" onClick={() => setStart(weekStart(new Date()))}>This week</button>}
      </div>

      <details className="mpl__diet">
        <summary>Food preferences{diet.vegan || diet.vegetarian || diet.avoid?.length ? " (on)" : ""}</summary>
        <p className="mpl__hint">Suggestions and the recipe picker follow these. Nothing is saved to your account.</p>
        <div className="recipes__chips" role="group" aria-label="Diet">
          <button className={`chip ${diet.vegetarian ? "is-on" : ""}`} aria-pressed={!!diet.vegetarian} onClick={() => toggleDiet("vegetarian")}>Vegetarian</button>
          <button className={`chip ${diet.vegan ? "is-on" : ""}`} aria-pressed={!!diet.vegan} onClick={() => toggleDiet("vegan")}>Vegan</button>
        </div>
        <p className="mpl__hint">Leave out recipes with:</p>
        <div className="recipes__chips" role="group" aria-label="Avoid allergens">
          {ALLERGENS.map((a) => <button key={a} className={`chip ${diet.avoid?.includes(a) ? "is-on" : ""}`} aria-pressed={!!diet.avoid?.includes(a)} onClick={() => toggleAvoid(a)}>{ALLERGEN_LABEL[a]}</button>)}
        </div>
        {hidden > 0 && <p className="mpl__hint">{hidden} of {ALL_RECIPES.length} recipes are hidden by these choices.</p>}
        {readySet.size > 0 && (
          <div className="recipes__chips" role="group" aria-label="Your kitchen">
            <button className={`chip ${useHave ? "is-on" : ""}`} aria-pressed={useHave} onClick={() => setUseHave((u) => !u)}>Use what I have first ({readySet.size} recipe{readySet.size === 1 ? "" : "s"} nearly ready)</button>
          </div>
        )}
        {hasGoalFilter && (
          <div className="recipes__chips" role="group" aria-label="Your goals">
            <button className={`chip ${mine ? "is-on" : ""}`} aria-pressed={mine} onClick={() => setMine((m) => !m)}>Lean toward my goals ({about.goals.filter((g) => g === "energy" || g === "sleep").join(" and ")})</button>
          </div>
        )}
      </details>

      <div className="mpl__actions">
        <button className="btn btn--primary btn--small" onClick={() => fill()}><Icon name="sparkle" size={18} /> Fill my lunches and dinners</button>
        <button className="btn btn--secondary btn--small" onClick={() => fill(["breakfast"])}>Fill breakfasts</button>
        <button className="btn btn--secondary btn--small" onClick={copyLastWeek}>Copy last week</button>
        <button className="btn btn--secondary btn--small" onClick={share} disabled={mealCount === 0}>Share plan</button>
        <button className="btn btn--secondary btn--small" onClick={() => { clearDays(keys); toast.show("Week cleared"); }} disabled={mealCount === 0}>Clear week</button>
      </div>

      <div className="mpl__actions mpl__remind">
        <ScheduleButton draft={{ title: "Plan next week's meals", kind: "nourish", minutes: 10, repeat: "weekly", to: "/nourish#planner", time: "17:00" }} label="Remind me to plan each week" />
        <ScheduleButton draft={{ title: "Grocery run", kind: "nourish", minutes: 45, repeat: "weekly", to: "/nourish#pantry", time: "10:00" }} label="Remind me to shop" />
      </div>

      <ol className="mpl__days">
        {days.map((d, i) => {
          const k = keys[i];
          return (
            <li key={k} className={`mpl__day ${k === today ? "is-today" : ""} ${k < today ? "is-past" : ""}`}>
              <header><strong>{dayLabel(d)}</strong><span>{dateLabel(d)}{k === today ? " · today" : ""}</span></header>
              <ul>
                {SLOTS.map((s) => {
                  const e = plan[k]?.[s];
                  const r = recipeById(e?.recipeId);
                  return (
                    <li key={s}>
                      <button className={`mpl__slot ${e ? "is-set" : ""}`} onClick={() => { setPicker({ day: k, slot: s }); setFilter("all"); setQuery(""); }} aria-label={`${dayLabel(d)} ${SLOT_LABEL[s]}: ${e ? r?.title ?? e.text : "empty. Tap to add a meal"}`}>
                        <em>{SLOT_LABEL[s]}</em>
                        {r ? <span className="mpl__meal"><RecipePlate r={r} size={28} /><b>{r.title}</b><small>{r.minutes} min</small></span> : e?.text ? <span className="mpl__meal mpl__meal--note"><b>{e.text}</b></span> : <span className="mpl__add"><Icon name="plus" size={16} /> Add</span>}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ol>

      <div className="mpl__summary r-card">
        <h3>Your week at a glance</h3>
        {mealCount === 0 ? <p className="mpl__hint">Plan a few meals and the summary appears here: how balanced the plates look, and what to buy.</p> : (
          <>
            <p>{mealCount} meal{mealCount === 1 ? "" : "s"} planned, {planned.length} from recipes.</p>
            {plate && (
              <div className="mpl__plate" aria-label="Average rough plate split across your planned recipes">
                <div className="mpl__platebar">{(Object.keys(PLATE) as Array<keyof typeof PLATE>).map((k) => <i key={k} style={{ width: `${plate[k] * 100}%`, background: PLATE[k][1] }} />)}</div>
                <ul className="rplate__legend">{(Object.keys(PLATE) as Array<keyof typeof PLATE>).map((k) => <li key={k}><i style={{ background: PLATE[k][1] }} />{PLATE[k][0]}<b>~{Math.round(plate[k] * 100)}%</b></li>)}</ul>
                <p className="mpl__hint">An average of the recipes' rough splits, next to the half-veg plate model on this page. It's a guide, not a score.</p>
              </div>
            )}
            <ul className="mpl__tags">
              {(["fiber", "omega-3", "gut", "protein"] as RecipeTag[]).map((t) => <li key={t}><b>{tagCount(t)}</b> {TAG_LABEL[t].toLowerCase()}</li>)}
            </ul>
          </>
        )}
        {onThinners && planned.some(hasVitaminKFlag) && (
          <p className="for-you"><span><strong>Based on your profile:</strong> some planned meals have leafy greens. With warfarin, steady amounts week to week matter more than avoiding them.</span></p>
        )}
        {about.considerations.includes("eating") && (
          <p className="for-you"><span><strong>Based on your profile:</strong> use this as a loose guide, not a rulebook. Skipping or swapping a meal is fine, and a dietitian can help if planning feels stressful.</span></p>
        )}
      </div>

      <div className="mpl__shop r-card">
        <h3>Shopping for the week</h3>
        <p>{planned.length === 0 ? "Plan some recipes and the ingredients you need appear here." : needed.length === 0 ? "Everything for this week's recipes is already on your list or in your kitchen." : `${needed.length} item${needed.length === 1 ? "" : "s"} to add for ${new Set(planned.map((r) => r.id)).size} recipe${new Set(planned.map((r) => r.id)).size === 1 ? "" : "s"}. Anything on your list or in your kitchen is left out.`}</p>
        <button className="btn btn--primary" onClick={() => { setSkip(new Set()); setShop(true); }} disabled={needed.length === 0}>Review and add to my list</button>
      </div>

      <Sheet open={shop} onClose={() => setShop(false)} label="This week's shopping">
        <div className="slist">
          <h2>This week's shopping</h2>
          <p className="mpl__hint">Each dish keeps its own ingredients, so you always know what an item is for. Untick anything you don't want to add.</p>
          {byDish.map(({ recipe, items }) => (
            <section key={recipe.id}>
              <h3 className="mpl__aisle">For: {recipe.title}</h3>
              <ul className="mpl__shoplist">
                {items.map((i) => {
                  const on = !skip.has(i.id);
                  return (
                    <li key={i.id}>
                      <button className={`rdetail__check ${on ? "" : "is-done"}`} aria-pressed={on} onClick={() => setSkip((s) => { const n = new Set(s); if (n.has(i.id)) n.delete(i.id); else n.add(i.id); return n; })}>
                        <span className="slist__check">{on && <Icon name="check" size={16} />}</span>
                        <span className="rdetail__name">{i.name}{i.checked ? " (you have it)" : ""}</span>
                        <span className="rdetail__amt">{i.qty}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
          <button className="btn btn--primary" onClick={addToList} disabled={shown.length === 0}>Add {shown.length} item{shown.length === 1 ? "" : "s"} to my list</button>
        </div>
      </Sheet>

      <Sheet open={!!picker} onClose={() => setPicker(null)} label="Pick a meal">
        {picker && (
          <div className="slist mpl__picker">
            <h2>{SLOT_LABEL[picker.slot]}, {dayLabel(new Date(`${picker.day}T12:00:00`))} {dateLabel(new Date(`${picker.day}T12:00:00`))}</h2>
            {current && <button className="btn btn--secondary btn--small" onClick={() => choose(null)}><Icon name="trash" size={16} /> Remove this meal</button>}
            <form className="mpl__note" onSubmit={(e) => { e.preventDefault(); if (note.trim()) choose({ text: note.trim().slice(0, 60) }); }}>
              <label htmlFor="mp-note" className="mpl__hint">Or write a note</label>
              <div>
                <input id="mp-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Leftovers, eating out…" maxLength={60} autoComplete="off" />
                <button className="btn btn--secondary btn--small" type="submit" disabled={!note.trim()}>Add</button>
              </div>
              <div className="recipes__chips">{QUICK_NOTES.map((n) => <button type="button" key={n} className="chip" onClick={() => choose({ text: n })}>{n}</button>)}</div>
            </form>
            <label htmlFor="mp-search" className="visually-hidden">Search recipes</label>
            <input id="mp-search" className="mpl__search" type="search" placeholder="Search recipes" value={query} onChange={(e) => setQuery(e.target.value)} autoComplete="off" />
            <div className="recipes__chips" role="group" aria-label="Filter recipes">
              {hasGoalFilter && <button className={`chip ${filter === "mine" ? "is-on" : ""}`} aria-pressed={filter === "mine"} onClick={() => setFilter("mine")}>For my goals</button>}
              {FILTERS.map((f) => <button key={f.id} className={`chip ${filter === f.id ? "is-on" : ""}`} aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>{f.label}</button>)}
            </div>
            {hidden > 0 && <p className="mpl__hint">{hidden} recipe{hidden === 1 ? " is" : "s are"} hidden by your food preferences.</p>}
            <ul className="mpl__choices">
              {choices.map((r) => (
                <li key={r.id}>
                  <button className="mpl__choice" onClick={() => choose({ recipeId: r.id })}>
                    <RecipePlate r={r} size={44} />
                    <span><strong>{r.title}</strong><small>{r.minutes} min · serves {r.serves}{picker && !fitsSlot(r, picker.slot) ? " · not usually for this meal" : ""}</small></span>
                  </button>
                  <button className="scan__link" onClick={() => setView(r)}>View recipe</button>
                </li>
              ))}
              {choices.length === 0 && <li className="mpl__hint">No recipes match. Try clearing the search or a filter.</li>}
            </ul>
          </div>
        )}
      </Sheet>

      <Sheet open={!!view} onClose={() => setView(null)} label={view?.title ?? "Recipe"}>
        {view && <RecipeDetail r={view} />}
      </Sheet>
      {toast.node}
    </div>
  );
}
