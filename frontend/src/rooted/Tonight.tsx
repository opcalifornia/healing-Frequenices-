import { useMemo, useState } from "react";
import { DishArt } from "./DishArt";
import { dishVars } from "./dishColor";
import { Sheet } from "./ui";
import { RecipeDetail } from "./Recipes";
import { ALL_RECIPES } from "./allRecipes";
import { keyOf, recipeById } from "./mealPlan";
import { pickSurprise } from "./recipeTools";
import { cuisineById, type WorldRecipe } from "./worldRecipes";
import { nearlyReady } from "./kitchen";
import { SLOTS, SLOT_LABEL, useMyPlan, type Slot } from "../store/mealPlan";
import { useKitchen } from "../store/nourish";
import type { Recipe } from "./recipes";

const order: Slot[] = ["dinner", "lunch", "breakfast"];

/** The big colour tile at the top of Plan: what's for tea, or a nudge to pick something. */
export function Tonight({ onPlan }: { onPlan(): void }) {
  const plan = useMyPlan();
  const have = useKitchen();
  const [open, setOpen] = useState<Recipe | null>(null);
  const today = keyOf(new Date());
  const planned = useMemo(() => {
    for (const s of order) {
      const r = recipeById(plan[today]?.[s]?.recipeId);
      if (r) return { r, slot: s };
    }
    return null;
  }, [plan, today]);
  const suggestion = useMemo(() => {
    if (planned) return undefined;
    const ready = nearlyReady(have, 0).map((x) => x.recipe);
    return pickSurprise(ready.length ? ready : ALL_RECIPES);
    // a fresh suggestion only when the plan or the kitchen changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planned, have.length]);
  const shown = planned?.r ?? suggestion;
  if (!shown) return null;
  const cu = (shown as Partial<WorldRecipe>).cuisine ? cuisineById((shown as WorldRecipe).cuisine) : undefined;
  const note = planned?.slot ? SLOT_LABEL[planned.slot] : null;

  return (
    <>
      <div className="ntonight" style={dishVars(shown.id)}>
        <span className="ntonight__tag">{planned ? `${cu ? `${cu.name} · ` : ""}${note === "Dinner" ? "Tonight" : `Today, ${note?.toLowerCase()}`}` : "A thought for tonight"}</span>
        <h2>{shown.title}</h2>
        <p>{shown.blurb}</p>
        <DishArt id={shown.id} className="ntonight__art" />
        <div className="ntonight__actions">
          <button className="ntonight__go" onClick={() => setOpen(shown)}>{planned ? "Let's cook" : "Take a look"} →</button>
          {!planned && <button className="ntonight__alt" onClick={onPlan}>Plan the week</button>}
        </div>
      </div>
      <Sheet open={!!open} onClose={() => setOpen(null)} label={open?.title ?? "Recipe"}>
        {open && <RecipeDetail r={open} />}
      </Sheet>
    </>
  );
}

export { SLOTS };
