import { useMemo, useState } from "react";
import { Icon } from "../components/Icon";
import { Sheet, useToast } from "./ui";
import { RecipeDetail, RecipePlate } from "./Recipes";
import { kitchenItems, whatICanCook, type RecipeStatus } from "./kitchen";
import { AISLE_ORDER, useKitchen, useNourish, useShoppingList } from "../store/nourish";
import type { Recipe } from "./recipes";

/**
 * "What's in my kitchen": tick what you have at home, then see which recipes you can cook now, which are one or two
 * items away, and add whatever is missing to the shopping list in one tap. Everything stays on this device and account.
 */
export function Kitchen() {
  const have = useKitchen();
  const list = useShoppingList();
  const toggle = useNourish((s) => s.toggleKitchen);
  const setKitchen = useNourish((s) => s.setKitchen);
  const addItem = useNourish((s) => s.addItem);
  const toast = useToast();
  const [q, setQ] = useState("");
  const [view, setView] = useState<Recipe | null>(null);
  const [all, setAll] = useState(false);

  const items = useMemo(() => kitchenItems(), []);
  const owned = useMemo(() => new Set(have), [have]);
  const shown = items.filter((i) => !q.trim() || i.name.toLowerCase().includes(q.trim().toLowerCase()));
  const groups = useMemo(() => {
    const m = new Map<string, typeof items>();
    for (const i of shown) m.set(i.aisle, [...(m.get(i.aisle) ?? []), i]);
    return [...m.entries()].sort((a, b) => (AISLE_ORDER.indexOf(a[0]) < 0 ? 99 : AISLE_ORDER.indexOf(a[0])) - (AISLE_ORDER.indexOf(b[0]) < 0 ? 99 : AISLE_ORDER.indexOf(b[0])));
  }, [shown]);
  const ranked = useMemo(() => (have.length ? whatICanCook(have) : []), [have]);
  const ready = ranked.filter((s) => s.missing.length === 0);
  const close = ranked.filter((s) => s.missing.length > 0 && s.missing.length <= 2);
  const rest = ranked.filter((s) => s.missing.length > 2);
  const onList = new Set(list.map((i) => i.id));

  const addMissing = (s: RecipeStatus) => {
    const add = s.missing.filter((m) => !onList.has(m.id));
    add.forEach((m) => addItem(m));
    toast.show(add.length ? `Added ${add.length} item${add.length === 1 ? "" : "s"} to your list` : "Already on your list");
  };

  const row = (s: RecipeStatus) => (
    <li key={s.recipe.id} className="kt__row">
      <button className="kt__recipe" onClick={() => setView(s.recipe)} aria-label={`${s.recipe.title}: open recipe`}>
        <RecipePlate r={s.recipe} size={40} />
        <span>
          <strong>{s.recipe.title}</strong>
          <small>{s.missing.length === 0 ? `You have everything · ${s.recipe.minutes} min` : `Have ${s.have} of ${s.total} · missing ${s.missing.slice(0, 3).map((m) => m.name.split(",")[0]).join(", ")}${s.missing.length > 3 ? ` and ${s.missing.length - 3} more` : ""}`}</small>
        </span>
      </button>
      {s.missing.length > 0 && <button className="scan__link" onClick={() => addMissing(s)}>Add missing to list</button>}
    </li>
  );

  return (
    <div className="kt">
      <p className="mp__hint">Tick what's already in your kitchen. Salt, pepper and water are assumed.</p>
      <label htmlFor="kt-search" className="visually-hidden">Search ingredients</label>
      <input id="kt-search" className="mp__search" type="search" placeholder="Search ingredients" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
      <div className="kt__bar">
        <span>{have.length} item{have.length === 1 ? "" : "s"} ticked</span>
        {have.length > 0 && <button className="scan__link" onClick={() => { setKitchen([]); toast.show("Cleared"); }}>Clear all</button>}
      </div>

      <div className="kt__groups">
        {groups.map(([aisle, group]) => (
          <details key={aisle} open={!!q.trim() || group.some((g) => owned.has(g.id)) || aisle === "Produce"}>
            <summary>{aisle} <small>{group.filter((g) => owned.has(g.id)).length}/{group.length}</small></summary>
            <div className="recipes__chips fl__chips">
              {group.map((g) => <button key={g.id} className={`chip ${owned.has(g.id) ? "is-on" : ""}`} aria-pressed={owned.has(g.id)} onClick={() => toggle(g.id)}>{g.name}</button>)}
            </div>
          </details>
        ))}
        {groups.length === 0 && <p className="mp__hint">No ingredients match.</p>}
      </div>

      {have.length === 0 ? (
        <p className="mp__hint">Tick a few things and we'll show what you can cook.</p>
      ) : (
        <div className="kt__result r-card">
          <h3>What you can cook</h3>
          {ready.length === 0 && close.length === 0 && <p className="mp__hint">Nothing is within two items yet. Here are the closest recipes.</p>}
          {ready.length > 0 && <><h4><Icon name="check" size={16} /> Ready now ({ready.length})</h4><ul>{ready.map(row)}</ul></>}
          {close.length > 0 && <><h4>One or two items away ({close.length})</h4><ul>{close.map(row)}</ul></>}
          {(ready.length === 0 && close.length === 0 || all) && rest.length > 0 && <ul>{rest.slice(0, all ? rest.length : 3).map(row)}</ul>}
          {rest.length > 0 && ready.length + close.length > 0 && <button className="scan__link" onClick={() => setAll((a) => !a)}>{all ? "Hide the rest" : `Show the other ${rest.length}`}</button>}
        </div>
      )}

      <Sheet open={!!view} onClose={() => setView(null)} label={view?.title ?? "Recipe"}>
        {view && <RecipeDetail r={view} />}
      </Sheet>
      {toast.node}
    </div>
  );
}
