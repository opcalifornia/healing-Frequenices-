/**
 * Every dish owns a flat colour that follows it from the plan to the recipe to the shopping list, like a stall's price tag.
 * `fg` is the text colour that reads on it.
 */
export interface DishColor {
  bg: string;
  fg: string;
  soup: string;
  name: string;
}

export const DISH_COLORS: DishColor[] = [
  { name: "turmeric", bg: "#f2b01e", fg: "#1c1410", soup: "#e8472b" },
  { name: "guava", bg: "#ff8fa3", fg: "#1c1410", soup: "#d9742f" },
  { name: "sky", bg: "#6fb6e8", fg: "#1c1410", soup: "#e8a23a" },
  { name: "lilac", bg: "#a98cd8", fg: "#1c1410", soup: "#e8472b" },
  { name: "kale", bg: "#1f6f4a", fg: "#fff1d0", soup: "#e8b83a" },
  { name: "tomato", bg: "#e8472b", fg: "#fff1d0", soup: "#f2b01e" },
  { name: "mint", bg: "#58d6a0", fg: "#1c1410", soup: "#e8472b" },
  { name: "apricot", bg: "#ff9b5e", fg: "#1c1410", soup: "#b8301f" },
];

/** A stable colour for a dish id: the same dish is always the same colour. */
export function dishColor(id: string): DishColor {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return DISH_COLORS[h % DISH_COLORS.length];
}

/** Inline CSS variables for a dish's colour. */
export const dishVars = (id: string) => {
  const c = dishColor(id);
  return { "--dc": c.bg, "--dfg": c.fg } as React.CSSProperties;
};
