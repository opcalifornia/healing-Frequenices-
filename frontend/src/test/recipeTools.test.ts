import { beforeEach, describe, expect, it } from "vitest";
import { pickSurprise, recipeToText, searchRecipes } from "../rooted/recipeTools";
import { ALL_RECIPES } from "../rooted/allRecipes";
import { WORLD_RECIPES } from "../rooted/worldRecipes";
import { useRecipeBox } from "../store/recipeBox";
import { useUser } from "../store/user";

describe("recipe tools", () => {
  it("writes a recipe as plain text with ingredients, steps and cautions", () => {
    const r = WORLD_RECIPES[0];
    const t = recipeToText(r);
    expect(t).toContain(r.title);
    expect(t).toContain("INGREDIENTS");
    expect(t).toContain("STEPS");
    expect(t).toContain("1. ");
    expect(t).toContain("GOOD TO KNOW");
    expect(t).toContain(r.ingredients[0].name);
  });
  it("finds dishes by name, cuisine or ingredient, ignoring accents and case", () => {
    expect(searchRecipes("pasta e fagioli", ALL_RECIPES).map((r) => r.id)).toContain("it-pasta-e-fagioli");
    expect(searchRecipes("MEXICO", ALL_RECIPES).every((r) => /^mx-/.test(r.id))).toBe(true);
    expect(searchRecipes("lentil", ALL_RECIPES).length).toBeGreaterThan(2);
    expect(searchRecipes("zzzz", ALL_RECIPES)).toEqual([]);
    expect(searchRecipes("  ", ALL_RECIPES)).toHaveLength(ALL_RECIPES.length);
    expect(searchRecipes("italy lentil", ALL_RECIPES).length).toBeLessThan(searchRecipes("lentil", ALL_RECIPES).length);
  });
  it("picks a surprise that isn't the one you just had", () => {
    const first = ALL_RECIPES[0].id;
    for (let i = 0; i < 20; i++) expect(pickSurprise(ALL_RECIPES, first)?.id).not.toBe(first);
    expect(pickSurprise([], undefined)).toBeUndefined();
    expect(pickSurprise(ALL_RECIPES, undefined, () => 0)?.id).toBe(ALL_RECIPES[0].id);
  });
});

describe("recipe box", () => {
  beforeEach(() => {
    useUser.setState({ activeProfileId: "r1" } as never);
    useRecipeBox.setState({ saved: {} });
  });
  it("saves and unsaves per profile", () => {
    useRecipeBox.getState().toggle("a");
    useRecipeBox.getState().toggle("b");
    expect(useRecipeBox.getState().saved.r1).toEqual(["b", "a"]);
    useRecipeBox.getState().toggle("a");
    expect(useRecipeBox.getState().saved.r1).toEqual(["b"]);
    useUser.setState({ activeProfileId: "r2" } as never);
    expect(useRecipeBox.getState().saved.r2).toBeUndefined();
  });
});
