import type { Recipe } from "./recipes";
import { scaleAmount, scaledServes } from "./scale";
import { cuisineById, type WorldRecipe } from "./worldRecipes";

/** A recipe as plain text that pastes cleanly into Notes, a message or an email. */
export function recipeToText(r: Recipe, factor = 1): string {
  const c = (r as Partial<WorldRecipe>).cuisine ? cuisineById((r as WorldRecipe).cuisine) : undefined;
  const lines = [r.title, c ? `${c.name} · classic home dish` : "", `${r.minutes} min${r.wait ? `, ${r.wait}` : ""} · serves ${scaledServes(r.serves, factor)}`, ""].filter((l, i) => l || i > 2);
  lines.push("INGREDIENTS");
  for (const i of r.ingredients) lines.push(`- ${i.name} (${scaleAmount(i.amount, factor)})`);
  lines.push("", "STEPS");
  r.steps.forEach((s, n) => lines.push(`${n + 1}. ${s}`));
  if (r.cautions.length) lines.push("", "GOOD TO KNOW", ...r.cautions.map((c2) => `- ${c2}`));
  if (r.note) lines.push("", r.note);
  return lines.join("\n") + "\n";
}

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/** Find dishes by name, cuisine, an ingredient or a tag. Every word must match something. */
export function searchRecipes(query: string, recipes: Recipe[]): Recipe[] {
  const words = norm(query).split(/\s+/).filter(Boolean);
  if (!words.length) return recipes;
  return recipes.filter((r) => {
    const cu = (r as Partial<WorldRecipe>).cuisine ? cuisineById((r as WorldRecipe).cuisine) : undefined;
    const hay = norm([r.title, r.blurb, cu?.name ?? "", cu?.region ?? "", r.tags.join(" "), r.ingredients.map((i) => i.name).join(" ")].join(" "));
    return words.every((w) => hay.includes(w));
  });
}

/** A different dish each time you ask, never the one you just had. */
export function pickSurprise(recipes: Recipe[], not?: string, rand: () => number = Math.random): Recipe | undefined {
  const pool = recipes.filter((r) => r.id !== not);
  return pool.length ? pool[Math.floor(rand() * pool.length)] : undefined;
}
