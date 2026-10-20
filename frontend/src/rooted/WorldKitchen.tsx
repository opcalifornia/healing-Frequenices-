import { useMemo, useState } from "react";
import { Globe } from "./Globe";
import { Evidence, Sheet, SourceLink, useToast } from "./ui";
import { RecipeDetail, RecipePlate } from "./Recipes";
import { CUISINES, cuisineById, type Cuisine, type WorldRecipe } from "./worldRecipes";
import { TAG_LABEL, dishListItems } from "./recipes";
import { Icon } from "../components/Icon";
import { useKitchen, useNourish, useShoppingList } from "../store/nourish";

const REGION_ORDER = ["Latin America", "Mediterranean", "Middle East", "Africa", "South Asia", "East Asia", "Southeast Asia"];
const regionOf = (c: Cuisine) => c.region;

/**
 * "Eat around the world": spin the globe or pick a culture from the list, see classic home dishes from there, and put a dish's
 * ingredients on the shopping list under the dish's name, so nothing on the list is a mystery.
 */
export function WorldKitchen() {
  const [selected, setSelected] = useState<string | null>(null);
  const [dish, setDish] = useState<WorldRecipe | null>(null);
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
        <p className="mpl__hint">{CUISINES.length} cuisines so far, four classic home dishes each. Each is a simplified home version, and we say so. More are on the way.</p>
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
