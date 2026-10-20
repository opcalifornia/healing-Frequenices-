import { useMemo, useState } from "react";
import { Globe } from "./Globe";
import { Evidence, Sheet, SourceLink, useToast } from "./ui";
import { RecipeDetail, RecipePlate } from "./Recipes";
import { CUISINES, WORLD_RECIPES, cuisineById, type Cuisine, type WorldRecipe } from "./worldRecipes";
import { pickSurprise, searchRecipes } from "./recipeTools";
import { suitable, type Diet } from "./mealPlan";
import { ALLERGEN_LABEL, type Allergen } from "./recipes";
import { useSavedRecipes } from "../store/recipeBox";
import { TAG_LABEL, dishListItems } from "./recipes";
import { Icon } from "../components/Icon";
import { useKitchen, useNourish, useShoppingList } from "../store/nourish";

const REGION_ORDER = ["Europe", "Middle East", "Africa", "South Asia", "East Asia", "Southeast Asia", "Latin America", "Caribbean", "North America"];
const regionOf = (c: Cuisine) => c.region;

/**
 * "Eat around the world": spin the globe or pick a culture from the list, see classic home dishes from there, and put a dish's
 * ingredients on the shopping list under the dish's name, so nothing on the list is a mystery.
 */
export function WorldKitchen() {
  const [selected, setSelected] = useState<string | null>(null);
  const [dish, setDish] = useState<WorldRecipe | null>(null);
  const [q, setQ] = useState("");
  const [diet, setDiet] = useState<Diet>({});
  const [onlySaved, setOnlySaved] = useState(false);
  const savedIds = useSavedRecipes();
  const cuisine = selected ? cuisineById(selected) : null;
  const list = useShoppingList();
  const addItems = useNourish((s) => s.addItems);
  const have = useKitchen();
  const toast = useToast();

  const pins = useMemo(() => CUISINES.map((c) => ({ id: c.id, name: c.name, iso: c.iso })), []);
  const regions = useMemo(() => {
    const m = new Map<string, Cuisine[]>();
    for (const c of CUISINES) m.set(regionOf(c), [...(m.get(regionOf(c)) ?? []), c]);
    return [...m.entries()].sort((a, b) => (REGION_ORDER.indexOf(a[0]) < 0 ? 99 : REGION_ORDER.indexOf(a[0])) - (REGION_ORDER.indexOf(b[0]) < 0 ? 99 : REGION_ORDER.indexOf(b[0])));
  }, []);
  const filtering = !!q.trim() || !!diet.vegan || !!diet.vegetarian || !!diet.avoid?.length || onlySaved;
  const results = useMemo(() => {
    let r = suitable(diet, WORLD_RECIPES) as WorldRecipe[];
    r = searchRecipes(q, r) as WorldRecipe[];
    if (onlySaved) r = r.filter((x) => savedIds.includes(x.id));
    return r;
  }, [q, diet, onlySaved, savedIds]);
  const toggleDiet = (k: "vegetarian" | "vegan") => setDiet((d) => ({ ...d, [k]: !d[k], ...(k === "vegan" && !d.vegan ? { vegetarian: false } : {}) }));
  const toggleAvoid = (a: Allergen) => setDiet((d) => ({ ...d, avoid: d.avoid?.includes(a) ? d.avoid.filter((x) => x !== a) : [...(d.avoid ?? []), a] }));
  const surprise = () => {
    const r = pickSurprise(filtering && results.length ? results : WORLD_RECIPES, dish?.id) as WorldRecipe | undefined;
    if (!r) return;
    setSelected(r.cuisine);
    setDish(r);
  };
  const onListIds = useMemo(() => list.map((i) => i.id), [list]);

  const addCuisine = (c: Cuisine) => {
    const items = c.recipes.flatMap((r) => dishListItems(r, onListIds, have));
    addItems(items);
    toast.show(items.length ? `Added ${items.length} items, grouped under ${c.recipes.length} dishes` : "Already on your list");
  };

  return (
    <div className="wk">
      <div className="wk__stage">
        <Globe pins={pins} selected={selected} onPick={setSelected} />
      </div>

      <div className="wk__tools">
        <label htmlFor="wk-search" className="visually-hidden">Search dishes</label>
        <input id="wk-search" className="mpl__search" type="search" placeholder="Search a dish, country or ingredient" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
        <div className="recipes__chips fl__chips" role="group" aria-label="Filter dishes">
          <button className="chip" onClick={surprise}>🎲 Surprise me</button>
          <button className={`chip ${diet.vegetarian ? "is-on" : ""}`} aria-pressed={!!diet.vegetarian} onClick={() => toggleDiet("vegetarian")}>Vegetarian</button>
          <button className={`chip ${diet.vegan ? "is-on" : ""}`} aria-pressed={!!diet.vegan} onClick={() => toggleDiet("vegan")}>Vegan</button>
          {(["gluten", "dairy", "nuts", "soy", "fish", "sesame"] as Allergen[]).map((a) => <button key={a} className={`chip ${diet.avoid?.includes(a) ? "is-on" : ""}`} aria-pressed={!!diet.avoid?.includes(a)} onClick={() => toggleAvoid(a)}>No {ALLERGEN_LABEL[a].toLowerCase()}</button>)}
          <button className={`chip ${onlySaved ? "is-on" : ""}`} aria-pressed={onlySaved} onClick={() => setOnlySaved((v) => !v)}>♥ Saved ({savedIds.filter((id) => WORLD_RECIPES.some((r) => r.id === id)).length})</button>
        </div>
        {filtering && (
          <div className="r-card wk__results">
            <h3>{results.length} dish{results.length === 1 ? "" : "es"}</h3>
            <ul className="wk__dishes">
              {results.slice(0, 40).map((r) => (
                <li key={r.id}>
                  <button className="wk__dish" onClick={() => { setSelected(r.cuisine); setDish(r); }} aria-label={`${r.title}: open recipe`}>
                    <RecipePlate r={r} size={44} />
                    <span><strong>{r.title}</strong><small>{cuisineById(r.cuisine)?.name} · {r.minutes} min</small></span>
                  </button>
                </li>
              ))}
              {results.length === 0 && <li className="mpl__hint">No dishes match. Try fewer filters.</li>}
            </ul>
          </div>
        )}
      </div>

      <div className="wk__list" role="list" aria-label="Cultures">
        <p className="mpl__hint">Or pick a culture from the list.</p>
        {regions.map(([region, cs]) => (
          <div key={region} role="listitem" className="wk__region">
            <h3>{region}</h3>
            <div className="recipes__chips fl__chips">
              {cs.map((c) => <button key={c.id} className={`chip ${selected === c.id ? "is-on" : ""}`} aria-pressed={selected === c.id} onClick={() => setSelected(c.id)}>{c.name}</button>)}
            </div>
          </div>
        ))}
        <p className="mpl__hint">{CUISINES.length} cuisines, {WORLD_RECIPES.length} classic home dishes. Each is a simplified home version, and we say so. More are on the way.</p>
      </div>

      <Sheet open={!!cuisine && !dish} onClose={() => setSelected(null)} label={cuisine?.name ?? "Cuisine"} wide>
        {cuisine && (
          <div className="wk__sheet slist">
            <span className="rooted__eyebrow">{cuisine.region}</span>
            <h2>{cuisine.name}</h2>
            <p>{cuisine.blurb}</p>
            <div className="r-card wk__tradition">
              <h3>Tradition <Evidence s={cuisine.evidence} short /></h3>
              <p>{cuisine.tradition}</p>
              <p className="nourish__src">{cuisine.sources.map((s) => <SourceLink key={s.url} s={s} />)}</p>
            </div>
            <div className="wk__bar">
              <h3>Classic home dishes</h3>
              <button className="btn btn--primary btn--small" onClick={() => addCuisine(cuisine)}><Icon name="plus" size={16} /> Add all four to my list</button>
            </div>
            <ul className="wk__dishes">
              {cuisine.recipes.map((r) => (
                <li key={r.id}>
                  <button className="wk__dish" onClick={() => setDish(r)} aria-label={`${r.title}: open recipe`}>
                    <RecipePlate r={r} size={52} />
                    <span>
                      <strong>{r.title}</strong>
                      <small>{r.minutes} min · serves {r.serves}{r.tags.filter((t) => t !== "vegetarian" || !r.tags.includes("vegan")).slice(0, 2).map((t) => ` · ${TAG_LABEL[t]}`).join("")}</small>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="mpl__hint">Adding puts every ingredient on your list under the dish's name, so you always know what each one is for.</p>
          </div>
        )}
      </Sheet>

      <Sheet open={!!dish} onClose={() => setDish(null)} label={dish?.title ?? "Recipe"}>
        {dish && (
          <>
            <RecipeDetail r={dish} />
            <p className="wk__back"><button className="scan__link" onClick={() => setDish(null)}>Back to {cuisine?.name ?? "the dishes"}</button></p>
          </>
        )}
      </Sheet>
      {toast.node}
    </div>
  );
}
