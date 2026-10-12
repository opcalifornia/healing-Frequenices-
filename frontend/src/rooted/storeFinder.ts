import type { ListItem } from "../store/nourish";
import { pantryById } from "./pantryContent";

/**
 * Store finder: works out which kinds of shops carry what's on the shopping
 * list, and builds plain map-search links for them. No map API, no key, no
 * network calls: the links open Google or Apple Maps, which do the searching.
 * Coordinates (when the person shares them) only ever go into those links.
 */

export type StoreType = "grocery" | "asian" | "international" | "health" | "farmers" | "herb" | "pharmacy" | "garden";

export const STORE_INFO: Record<StoreType, { label: string; query: string; emoji: string }> = {
  grocery: { label: "Grocery store", query: "grocery store", emoji: "🛒" },
  asian: { label: "Asian market", query: "Asian market", emoji: "🥢" },
  international: { label: "International grocer", query: "international grocery store", emoji: "🌍" },
  health: { label: "Health food store / co-op", query: "health food store", emoji: "🌿" },
  farmers: { label: "Farmers market", query: "farmers market", emoji: "🧺" },
  herb: { label: "Herb shop", query: "herb shop apothecary", emoji: "🫖" },
  pharmacy: { label: "Pharmacy", query: "pharmacy", emoji: "💊" },
  garden: { label: "Garden center", query: "garden center", emoji: "🌱" },
};

/** Order the store groups appear in when counts tie. */
export const STORE_ORDER: StoreType[] = ["grocery", "farmers", "health", "asian", "international", "herb", "pharmacy", "garden"];

export const USDA_LOCAL_FOOD = "https://www.usdalocalfoodportal.com/";

/** Phrases in a pantry item's "where to find it" text, mapped to store types. */
const FIND_RULES: Array<[RegExp, StoreType]> = [
  [/\b(any|every|most) grocery|supermarket|\baisle\b|produce section|bulk bins|refrigerated|seafood counter|freezer|\bdairy\b/i, "grocery"],
  [/\b(asian|japanese|korean|chinese)\b/i, "asian"],
  [/\b(indian|filipino|caribbean|latin|african|italian|mexican|middle eastern)\b/i, "international"],
  [/health food|whole foods|co-?op/i, "health"],
  [/farmers market/i, "farmers"],
  [/herb shop|tea shop|spice shop/i, "herb"],
  [/pharmac/i, "pharmacy"],
  [/garden center/i, "garden"],
];

/** Rules for items typed in by hand (no pantry entry), matched on the name. */
const EDIBLE_SEEDS = /\b(chia|flax|pumpkin|sunflower|sesame|hemp|poppy)\b/i;
const NAME_RULES: Array<[RegExp, StoreType[]]> = [
  [/\b(burdock|gobo|daikon|bok choy|lemongrass|nori|wakame|kombu|tofu|tempeh|shiitake|natto|mochi|lotus root|bitter melon)\b/i, ["asian", "health"]],
  [/\b(plantain|tamarind|masa|jamaica|garam masala|ghee|paneer|curry leaves|okra)\b/i, ["international", "grocery"]],
  [/\b(spirulina|nutritional yeast|kombucha|adaptogen|bee pollen)\b/i, ["health"]],
  [/\b(dried herbs?|loose[- ]leaf|tincture|mullein|calendula|yarrow|marshmallow root|slippery elm)\b/i, ["herb", "health"]],
  [/\b(epsom|bandage|vitamin|ibuprofen|sunscreen|thermometer)\b/i, ["pharmacy"]],
  [/\b(seeds?|seedlings?|potting|soil|compost|planter|mulch|trowel)\b/i, ["garden"]],
];

/** Every store type likely to carry this item, most likely first. Always at least one. */
export function storesFor(item: Pick<ListItem, "id" | "name" | "aisle">): StoreType[] {
  if (item.aisle === "Garden" || item.id.startsWith("garden-")) return ["garden"];
  const out: StoreType[] = [];
  const add = (t: StoreType) => { if (!out.includes(t)) out.push(t); };

  const p = pantryById(item.id);
  if (p) {
    for (const [re, t] of FIND_RULES) if (re.test(p.find)) add(t);
    return out.length ? out : ["grocery"];
  }
  for (const [re, ts] of NAME_RULES) {
    if (ts[0] === "garden" && EDIBLE_SEEDS.test(item.name)) continue;
    if (re.test(item.name)) ts.forEach(add);
  }
  return out.length ? out : ["grocery"];
}

export interface StoreGroup {
  type: StoreType;
  items: ListItem[];
}

/**
 * Group the items still to buy by the stores that carry them. An item can show
 * up under more than one store (burdock is at Asian markets and co-ops). Groups
 * with more items come first, so one trip covers the most.
 */
export function groupByStore(items: ListItem[]): StoreGroup[] {
  const map = new Map<StoreType, ListItem[]>();
  for (const i of items) {
    if (i.checked) continue;
    for (const t of storesFor(i)) map.set(t, [...(map.get(t) ?? []), i]);
  }
  return [...map.entries()]
    .map(([type, its]) => ({ type, items: its }))
    .sort((a, b) => b.items.length - a.items.length || STORE_ORDER.indexOf(a.type) - STORE_ORDER.indexOf(b.type));
}

export interface Coords {
  lat: number;
  lng: number;
}

/** About 100 m of precision is plenty to find a shop, and gives away less. */
const round = (n: number) => Math.round(n * 1000) / 1000;

/** Google Maps search. With coordinates it searches near them, otherwise "near me". */
export function googleMapsLink(query: string, at?: Coords | null): string {
  const q = at ? `${query} near ${round(at.lat)},${round(at.lng)}` : `${query} near me`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

/** Apple Maps search, centred on the coordinates when we have them (Apple Maps uses the device location otherwise). */
export function appleMapsLink(query: string, at?: Coords | null): string {
  const base = `https://maps.apple.com/?q=${encodeURIComponent(query)}`;
  return at ? `${base}&ll=${round(at.lat)},${round(at.lng)}` : base;
}

/** Short note for a calendar event: what to pick up. */
export function tripNote(items: ListItem[]): string {
  const names = items.filter((i) => !i.checked).map((i) => i.name);
  return names.length ? `Pick up: ${names.join(", ")}` : "";
}
