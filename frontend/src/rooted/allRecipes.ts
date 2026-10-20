import { RECIPES, type Recipe } from "./recipes";
import { WORLD_RECIPES } from "./worldRecipes";

/** The everyday recipes plus the world dishes: what the planner, kitchen mode and shopping list draw on. */
export const ALL_RECIPES: Recipe[] = [...RECIPES, ...WORLD_RECIPES];
