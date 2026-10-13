import { useEffect, useMemo, useState } from "react";
import { Sheet } from "./ui";
import { DAILY_VALUE, GUIDE_ID, isEverydayFood, loadFoods, percentDV, richestIn, searchFoods, type Food, type FoodData } from "./foodDb";
import "./FoodExplorer.css";

type Loaded = { data: FoodData; foods: Food[] } | null | undefined;

/** Broad groups for filtering, mapped to USDA's categories. */
export const FOOD_GROUPS: Array<{ id: string; label: string; cats: string[] }> = [
  { id: "all", label: "All foods", cats: [] },
  { id: "veg", label: "Vegetables", cats: ["Vegetables and Vegetable Products"] },
  { id: "fruit", label: "Fruits", cats: ["Fruits and Fruit Juices"] },
  { id: "legume", label: "Beans & lentils", cats: ["Legumes and Legume Products"] },
  { id: "nuts", label: "Nuts & seeds", cats: ["Nut and Seed Products"] },
  { id: "grain", label: "Grains", cats: ["Cereal Grains and Pasta", "Breakfast Cereals", "Baked Products"] },
  { id: "fish", label: "Fish & seafood", cats: ["Finfish and Shellfish Products"] },
  { id: "meat", label: "Meat & poultry", cats: ["Beef Products", "Pork Products", "Poultry Products", "Lamb, Veal, and Game Products", "Sausages and Luncheon Meats"] },
  { id: "dairy", label: "Dairy & eggs", cats: ["Dairy and Egg Products"] },
];

export const PLANT_CATS = ["Vegetables and Vegetable Products", "Fruits and Fruit Juices", "Legumes and Legume Products", "Nut and Seed Products", "Cereal Grains and Pasta"];

function useFoods(): Loaded {
  const [s, setS] = useState<Loaded>(undefined);
  useEffect(() => { let on = true; loadFoods().then((r) => on && setS(r)); return () => { on = false; }; }, []);
  return s;
}

const fmt = (v: number | undefined, unit: string) => (v === undefined ? "–" : `${v >= 100 ? Math.round(v) : v}${unit === "kcal" ? "" : " "}${unit === "kcal" ? " kcal" : unit}`);

/** Everything the database knows about one food, per 100 g. */
function FoodDetail({ food, data, onGuide }: { food: Food; data: FoodData; onGuide(id: string): void }) {
  const groups: Array<{ title: string; keys: string[] }> = [
    { title: "Energy and macros", keys: ["kcal", "protein", "fat", "sat", "carbs", "fiber", "sugars", "chol"] },
    { title: "Vitamins", keys: ["a", "c", "d", "e", "k", "k2", "b1", "b2", "b3", "b5", "b6", "folate", "b12", "choline"] },
    { title: "Minerals", keys: ["ca", "mg", "k_", "p", "na", "fe", "zn", "cu", "mn", "se"] },
  ];
  const by = new Map(data.nutrients.map((n) => [n.key, n]));
  return (
    <article className="fdb">
      <span className="fdb__cat">{food.cat || "Food"}</span>
      <h2>{food.name}</h2>
      <p className="fdb__sub">Per 100 g (about {food.cat.includes("Beverage") ? "100 ml" : "3.5 oz"}). Bars show the share of the FDA's adult Daily Value, a label reference and not a personal target.</p>
      {groups.map((g) => {
        const rows = g.keys.filter((k) => by.has(k) && food.n[k] !== undefined);
        if (!rows.length) return null;
        return (
          <section key={g.title}>
            <h3>{g.title}</h3>
            <ul className="fdb__rows">
              {rows.map((k) => {
                const n = by.get(k)!;
                const pct = percentDV(k, food.n[k]);
                const guide = GUIDE_ID[k];
                return (
                  <li key={k}>
                    <span className="fdb__name">{guide ? <button className="scan__link" onClick={() => onGuide(guide)}>{n.label}</button> : n.label}</span>
                    <span className="fdb__val">{fmt(food.n[k], n.unit)}</span>
                    {pct !== undefined && DAILY_VALUE[k] ? <span className="fdb__bar" aria-label={`${pct}% of the Daily Value`}><i style={{ width: `${Math.min(100, pct)}%` }} /><b>{pct}%</b></span> : <span />}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
      <p className="fdb__note">Source: USDA FoodData Central ({food.foundation ? "Foundation Foods" : "SR Legacy"}), public domain. Values are averages; real foods vary with variety, soil and ripeness. A dash means it wasn't measured, not that there is none.</p>
    </article>
  );
}

export function FoodExplorer({ onGuide }: { onGuide(id: string): void }) {
  const loaded = useFoods();
  const [q, setQ] = useState("");
  const [group, setGroup] = useState("all");
  const [rank, setRank] = useState("mg");
  const [food, setFood] = useState<Food | null>(null);

  const cats = FOOD_GROUPS.find((g) => g.id === group)?.cats ?? [];
  const foods = loaded?.foods ?? [];
  const results = useMemo(() => {
    if (!q.trim()) return [];
    return searchFoods(foods, q, 80).filter((f) => !cats.length || cats.includes(f.cat)).slice(0, 40);
  }, [foods, q, cats]);
  const top = useMemo(() => {
    const c = group === "all" ? undefined : cats;
    return foods.filter((f) => typeof f.n[rank] === "number" && f.n[rank]! > 0 && isEverydayFood(f) && (!c || c.includes(f.cat)))
      .sort((a, b) => (b.n[rank] as number) - (a.n[rank] as number)).slice(0, 12);
  }, [foods, rank, group, cats]);

  if (loaded === undefined) return <p className="rooted__lead">Loading the food database…</p>;
  if (loaded === null) return <p className="rooted__lead">The food database isn't available right now.</p>;
  const { data } = loaded;
  const rankable = data.nutrients.filter((n) => !["kcal", "sat", "chol", "na", "k2"].includes(n.key));
  const rn = data.nutrients.find((n) => n.key === rank)!;

  return (
    <div className="fexp">
      <div className="nfilter">
        <input type="search" placeholder={`Search ${foods.length.toLocaleString()} foods: spinach, salmon, almonds…`} value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search the food database" />
        <div className="scan__chips" role="group" aria-label="Food group">
          {FOOD_GROUPS.map((g) => <button key={g.id} className={`chip ${group === g.id ? "is-on" : ""}`} aria-pressed={group === g.id} onClick={() => setGroup(g.id)}>{g.label}</button>)}
        </div>
      </div>

      {q.trim() ? (
        <ul className="fexp__list">
          {results.map((f) => (
            <li key={f.name}>
              <button className="r-card" onClick={() => setFood(f)}>
                <strong>{f.name}</strong>
                <small>{f.cat}</small>
                <span>{f.n.kcal !== undefined ? `${Math.round(f.n.kcal)} kcal` : ""}</span>
              </button>
            </li>
          ))}
          {results.length === 0 && <li className="rooted__lead">No match. Try a simpler word, like “almond” or “salmon”.</li>}
        </ul>
      ) : (
        <div className="r-card fexp__rank">
          <h3>Richest in</h3>
          <div className="scan__chips" role="group" aria-label="Nutrient to rank by">
            {rankable.map((n) => <button key={n.key} className={`chip ${rank === n.key ? "is-on" : ""}`} aria-pressed={rank === n.key} onClick={() => setRank(n.key)}>{n.label}</button>)}
          </div>
          <p className="fexp__hint">Top foods for {rn.label.toLowerCase()} per 100 g{group !== "all" ? `, in ${FOOD_GROUPS.find((g) => g.id === group)?.label.toLowerCase()}` : ""}. Powders, dried herbs and spices, bran and similar concentrated foods are left out, since you eat them in small amounts. Search a food by name to see any of them.</p>
          <ol className="fexp__top">
            {top.map((f, i) => {
              const pct = percentDV(rank, f.n[rank]);
              return (
                <li key={f.name}>
                  <button onClick={() => setFood(f)}>
                    <span className="fexp__n">{i + 1}</span>
                    <span className="fexp__t"><strong>{f.name}</strong><small>{f.cat.replace(/ Products| and .*/, "")}</small></span>
                    <span className="fexp__v">{fmt(f.n[rank], rn.unit)}{pct !== undefined ? <small>{pct}% DV</small> : null}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      )}
      <p className="nfilter__note">{data.source} Amounts are per 100 g, so a spoonful of seeds gives far less than a plate of greens. Raw and cooked versions of the same food differ.</p>

      <Sheet open={!!food} onClose={() => setFood(null)} label={food?.name ?? ""}>
        {food && <FoodDetail food={food} data={data} onGuide={(id) => { setFood(null); onGuide(id); }} />}
      </Sheet>
    </div>
  );
}

/** Top foods for one nutrient, shown inside its detail page. */
export function TopFoods({ nutrientId }: { nutrientId: string }) {
  const loaded = useFoods();
  const [plants, setPlants] = useState(true);
  const key = Object.entries(GUIDE_ID).find(([, id]) => id === nutrientId)?.[0];
  const rows = useMemo(() => {
    if (!loaded || !key) return [];
    const foods = plants ? loaded.foods.filter((f) => PLANT_CATS.includes(f.cat)) : loaded.foods;
    return richestIn(foods, key, { limit: 8 });
  }, [loaded, key, plants]);
  if (!key || !loaded || rows.length === 0) return null;
  const n = loaded.data.nutrients.find((x) => x.key === key)!;
  return (
    <section>
      <h3>Richest foods in the database</h3>
      <div className="ndetail__chips">
        <button className={`chip ${plants ? "is-on" : ""}`} aria-pressed={plants} onClick={() => setPlants(true)}>Plant foods</button>
        <button className={`chip ${!plants ? "is-on" : ""}`} aria-pressed={!plants} onClick={() => setPlants(false)}>All foods</button>
      </div>
      <ol className="fexp__mini">
        {rows.map((f) => <li key={f.name}><span>{f.name}</span><b>{fmt(f.n[key], n.unit)}</b></li>)}
      </ol>
      <p className="ndetail__note">Per 100 g, from USDA FoodData Central. Powders, dried herbs and spices, and other concentrated foods are left out of these lists.</p>
    </section>
  );
}
