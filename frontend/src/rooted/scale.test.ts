import { describe, expect, it } from "vitest";
import { clock, scaleAmount, scaledServes, stepTimers } from "./scale";
import { ALL_RECIPES } from "./allRecipes";

describe("scaleAmount", () => {
  it("scales whole numbers, fractions and mixed amounts", () => {
    expect(scaleAmount("2 tbsp", 2)).toBe("4 tbsp");
    expect(scaleAmount("1/2 cup", 2)).toBe("1 cup");
    expect(scaleAmount("1 cup", 0.5)).toBe("½ cup");
    expect(scaleAmount("1 ½ cups", 2)).toBe("3 cups");
    expect(scaleAmount("3 cloves", 1.5)).toBe("4 ½ cloves");
  });
  it("scales ranges and the bracketed part", () => {
    expect(scaleAmount("2-3 tbsp", 2)).toBe("4-6 tbsp");
    expect(scaleAmount("400 g (14 oz)", 2)).toBe("800 g (28 oz)");
  });
  it("leaves unreadable amounts alone", () => {
    expect(scaleAmount("to taste", 2)).toBe("to taste");
    expect(scaleAmount("a pinch", 3)).toBe("a pinch");
    expect(scaleAmount("2 tbsp", 1)).toBe("2 tbsp");
  });
  it("never produces NaN or empty text for any real amount", () => {
    for (const r of ALL_RECIPES) for (const i of r.ingredients) for (const f of [0.5, 1.5, 2, 3]) {
      const s = scaleAmount(i.amount, f);
      expect(s, `${r.id}: ${i.amount}`).not.toMatch(/NaN|undefined/);
      expect(s.length).toBeGreaterThan(0);
    }
  });
});

describe("serves and timers", () => {
  it("scales servings to at least one", () => {
    expect(scaledServes(4, 0.5)).toBe(2);
    expect(scaledServes(1, 0.5)).toBe(1);
  });
  it("finds timers in steps", () => {
    expect(stepTimers("Simmer for 10 minutes, stirring.")[0].seconds).toBe(600);
    expect(stepTimers("Rest 5 to 10 min.")[0].seconds).toBe(300);
    expect(stepTimers("Toast 30 seconds.")[0].seconds).toBe(30);
    expect(stepTimers("Chop the onion.")).toEqual([]);
  });
  it("formats a clock", () => {
    expect(clock(65)).toBe("1:05");
    expect(clock(3700)).toBe("1:01:40");
  });
});
