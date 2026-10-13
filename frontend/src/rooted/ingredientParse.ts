/**
 * Find additives in free text, for products with no barcode in the database: a pasted
 * ingredient list, or one read off the label with the phone's own "Scan Text".
 * Everything happens in the page, nothing is sent anywhere.
 *
 * Matches E-numbers ("E330", "e 330", "E-330", "E160a(ii)") and the names we have in the
 * additive library. Longer names win and are used up, so "citric acid esters of mono- and
 * diglycerides" counts as E472c and not also as citric acid and mono-glycerides.
 * Labels that name an additive only loosely ("caramel color", "sulfites") are reported as
 * notes, because we can't tell which one it is.
 */
import { ADDITIVES, normalizeCode } from "./additivesContent";
import type { Product } from "./foodLookup";

/** Other ways labels write an additive's name. Keys are library ids. */
const EXTRA: Record<string, string[]> = {
  e127: ["red 3", "red no 3", "fd c red no 3", "fd c red 3", "erythrosine"],
  e129: ["red 40", "red no 40", "fd c red no 40", "fd c red 40"],
  e102: ["yellow 5", "yellow no 5", "fd c yellow no 5", "fd c yellow 5"],
  e110: ["yellow 6", "yellow no 6", "fd c yellow no 6", "fd c yellow 6"],
  e122: ["azorubine"],
  e150d: ["caramel color class iv", "caramel color iv", "class iv caramel"],
  e150c: ["class iii caramel", "caramel color class iii"],
  e150a: ["caramel color class i", "class i caramel"],
  e300: ["vitamin c"],
  e306: ["vitamin e", "mixed tocopherols"],
  e101: ["vitamin b2"],
  e160a: ["beta carotene", "beta-carotene"],
  e322: ["soy lecithin", "sunflower lecithin", "soya lecithin"],
  e471: ["mono and diglycerides", "mono diglycerides", "monoglycerides", "diglycerides"],
  e500: ["baking soda", "sodium bicarbonate"],
  e621: ["msg", "monosodium glutamate", "sodium glutamate"],
  e951: ["nutrasweet", "equal"],
  e955: ["splenda"],
  e414: ["acacia gum"],
  e410: ["carob gum", "carob bean gum"],
  e466: ["cellulose gum", "cmc"],
  e320: ["bha"],
  e321: ["bht"],
  e171: ["titanium dioxide"],
  e250: ["nitrite"],
  e251: ["nitrate"],
  e338: ["orthophosphoric acid"],
  e968: ["meso erythritol"],
  e441: ["gelatin", "beef gelatin", "pork gelatin", "bovine gelatin"],
  "flavouring-natural": ["natural flavor", "natural flavors", "natural flavoring", "natural flavourings", "natural flavour", "natural aroma"],
  "flavouring-artificial": ["artificial flavor", "artificial flavors", "artificial flavoring", "artificial flavour", "artificial flavourings"],
  vanillin: ["ethyl vanillin"],
  "yeast-extract": ["autolyzed yeast extract", "autolysed yeast extract"],
  "hydrolysed-protein": ["hydrolyzed protein", "hydrolyzed vegetable protein", "hydrolysed vegetable protein", "hydrolyzed soy protein", "hydrolysed soy protein", "hydrolyzed wheat protein"],
  "hydrogenated-fat": ["partially hydrogenated oil", "partially hydrogenated vegetable oil", "partially hydrogenated fat", "partially hydrogenated palm oil", "partially hydrogenated soybean oil", "partially hydrogenated"],
};

/** Names too common in ordinary text to match by name: only their E-number counts. */
const NAME_OFF = new Set(["e570", "e948", "e949", "e173", "e174", "e175", "e640", "e941"]);

/** Names that point to a group of additives and don't say which one. */
const LOOSE: Array<{ words: string[]; label: string; ids: string[] }> = [
  { words: ["caramel color"], label: "Caramel colour (type not stated)", ids: ["e150a", "e150b", "e150c", "e150d"] },
  { words: ["sulfites", "sulphites", "sulfite"], label: "Sulfites (which one isn't stated)", ids: ["e220", "e223", "e224"] },
  { words: ["hydrogenated"], label: "Hydrogenated fat (fully hydrogenated has almost no trans fat; partially does)", ids: ["hydrogenated-fat"] },
  { words: ["phosphates", "phosphate"], label: "Phosphates (which one isn't stated)", ids: ["e338", "e339", "e450"] },
];

/** Lowercase, American spellings, no punctuation, single spaces. */
function clean(text: string): string {
  return ` ${text
    .toLowerCase()
    .replace(/colour/g, "color")
    .replace(/flavour/g, "flavor")
    .replace(/hydrolysed/g, "hydrolyzed")
    .replace(/autolysed/g, "autolyzed")
    .replace(/sulphur/g, "sulfur")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()} `;
}

interface Alias {
  id: string;
  text: string;
}

function buildAliases(): Alias[] {
  const out: Alias[] = [];
  for (const a of ADDITIVES) {
    if (NAME_OFF.has(a.id)) continue;
    const names = new Set<string>([a.name, ...(EXTRA[a.id] ?? [])]);
    for (const n of names) {
      const c = clean(n).trim();
      if (c.length < 3) continue;
      out.push({ id: a.id, text: c });
      if (c.endsWith("s")) out.push({ id: a.id, text: c.slice(0, -1) });
    }
  }
  // Longest first, so more specific names are taken before the shorter ones inside them.
  return out.sort((x, y) => y.text.length - x.text.length);
}

let ALIASES: Alias[] | null = null;

export interface IngredientMatch {
  /** Lowercase additive codes found, in the order of the library, including E-numbers we haven't reviewed. */
  codes: string[];
  /** Loose mentions we can't pin to one additive. */
  notes: string[];
}

export function findAdditives(text: string): IngredientMatch {
  ALIASES ??= buildAliases();
  const codes = new Set<string>();
  const notes: string[] = [];

  // 1. E-numbers. Skip "vitamin E 400" style amounts.
  let work = ` ${text.toLowerCase().replace(/colour/g, "color")} `;
  work = work.replace(/(\bvitamin\s+)e[\s-]?\d{2,4}\b/g, " $1 ");
  work = work.replace(/\be[\s-]?(\d{3,4}[a-f]?)(?:\s?\((?:[ivx]+)\)|[ivx]{1,3}(?![a-z0-9]))?(?![a-z0-9])/g, (_m, digits: string) => {
    const code = normalizeCode(`e${digits}`);
    if (code) codes.add(code);
    return " ";
  });

  // 2. Names, longest first, each used up once matched.
  let t = clean(work).replace(/ lactic acid (bacteria|cultures?|starter)/g, " ");
  for (const a of ALIASES) {
    const needle = ` ${a.text} `;
    if (t.includes(needle)) {
      codes.add(a.id);
      t = t.split(needle).join(" ");
    }
  }

  // 3. Loose mentions left over.
  for (const l of LOOSE) {
    if (l.words.some((w) => t.includes(` ${w} `)) && !l.ids.some((id) => codes.has(id))) notes.push(l.label);
  }

  const order = new Map(ADDITIVES.map((a, i) => [a.id, i]));
  return { codes: [...codes].sort((x, y) => (order.get(x) ?? 9999) - (order.get(y) ?? 9999) || x.localeCompare(y)), notes };
}

export const TEXT_PRODUCT_CODE = "text";

/** A pretend product made from pasted text, so it can use the same result page as a scan. */
export function productFromIngredients(text: string): Product {
  const { codes, notes } = findAdditives(text);
  return {
    code: TEXT_PRODUCT_CODE,
    name: "Your ingredient list",
    ingredients: text.trim().slice(0, 4000),
    additives: codes,
    notes,
    allergens: [],
    traces: [],
    isDrink: false,
  };
}
