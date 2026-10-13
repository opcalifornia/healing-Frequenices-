/**
 * Look a product up by barcode in Open Food Facts (open data, ODbL licence:
 * credit them and share improvements back) and pull out its additives.
 * Only the barcode is sent. Nothing about the person or their profile leaves the device.
 */
import { normalizeCode } from "./additivesContent";
import { findAdditives } from "./ingredientParse";
import { allergenIds, type AllergenId } from "./allergens";

/** Nutrition per 100 g (or 100 ml for drinks). Anything the database doesn't have is left out. */
export interface Nutrition {
  kcal?: number;
  fat?: number;
  sat?: number;
  sugars?: number;
  salt?: number;
  fiber?: number;
}

export interface Product {
  code: string;
  name: string;
  brand?: string;
  image?: string;
  quantity?: string;
  ingredients?: string;
  /** Lowercase E-codes found, for example ["e330", "e415"]. */
  additives: string[];
  /** Loose mentions we can't pin to one additive, for example "Caramel colour (type not stated)". Only for pasted text. */
  notes?: string[];
  /** Allergens the database says the product contains, and may contain as traces. */
  allergens: AllergenId[];
  traces: AllergenId[];
  nutrition?: Nutrition;
  /** Nutri-Score letter, a to e. */
  grade?: "a" | "b" | "c" | "d" | "e";
  /** NOVA processing group, 1 to 4 (4 = ultra-processed). */
  nova?: 1 | 2 | 3 | 4;
  /** Drinks are judged per 100 ml with their own cut-offs. */
  isDrink: boolean;
  /** The most specific category tag, for finding similar products, for example "en:orange-juices". */
  category?: string;
}

export type LookupResult =
  | { ok: true; product: Product }
  | { ok: false; reason: "invalid" | "notfound" | "network" };

/** EAN-8, UPC-A (12), EAN-13 and GTIN-14 numbers, with a valid GS1 check digit. */
export function isValidBarcode(raw: string): boolean {
  const code = raw.replace(/\s/g, "");
  if (!/^\d+$/.test(code) || ![8, 12, 13, 14].includes(code.length)) return false;
  const digits = code.split("").map(Number);
  const check = digits.pop() as number;
  let sum = 0;
  digits.reverse().forEach((d, i) => (sum += d * (i % 2 === 0 ? 3 : 1)));
  return (10 - (sum % 10)) % 10 === check;
}

interface OffProduct {
  code?: string;
  product_name?: string;
  generic_name?: string;
  brands?: string;
  quantity?: string;
  image_front_small_url?: string;
  ingredients_text?: string;
  additives_tags?: unknown;
  categories_tags?: unknown;
  nutriments?: Record<string, unknown>;
  allergens_tags?: unknown;
  traces_tags?: unknown;
  nutriscore_grade?: unknown;
  nutrition_grades?: unknown;
  nova_group?: unknown;
}

const num = (v: unknown): number | undefined => (typeof v === "number" && Number.isFinite(v) && v >= 0 ? v : typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v)) && Number(v) >= 0 ? Number(v) : undefined);
const round = (n: number | undefined) => (n === undefined ? undefined : Math.round(n * 10) / 10);

export function parseNutrition(n: Record<string, unknown> | undefined): Nutrition | undefined {
  if (!n) return undefined;
  const kj = num(n["energy_100g"]);
  const salt = num(n["salt_100g"]) ?? (num(n["sodium_100g"]) !== undefined ? (num(n["sodium_100g"]) as number) * 2.5 : undefined);
  const out: Nutrition = {
    kcal: round(num(n["energy-kcal_100g"]) ?? (kj !== undefined ? kj / 4.184 : undefined)),
    fat: round(num(n["fat_100g"])),
    sat: round(num(n["saturated-fat_100g"])),
    sugars: round(num(n["sugars_100g"])),
    salt: salt === undefined ? undefined : Math.round(salt * 100) / 100,
    fiber: round(num(n["fiber_100g"])),
  };
  return Object.values(out).some((v) => v !== undefined) ? out : undefined;
}

/** Turn Open Food Facts JSON into a Product. Returns null when there is no product. */
export function parseProduct(json: unknown, code: string): Product | null {
  const root = json as { status?: number; product?: OffProduct } | null;
  const p = root?.product;
  if (!p || root?.status === 0) return null;
  const tags = Array.isArray(p.additives_tags) ? (p.additives_tags as unknown[]) : [];
  const fromTags = tags.map((t) => (typeof t === "string" ? normalizeCode(t) : undefined)).filter((c): c is string => !!c);
  // The tags can lag behind the printed list, so read the ingredient text too.
  const text = p.ingredients_text?.trim();
  const fromText = text ? findAdditives(text) : { codes: [], notes: [] };
  const additives = [...new Set([...fromTags, ...fromText.codes])];
  const name = (p.product_name || p.generic_name || "").trim();
  const cats = Array.isArray(p.categories_tags) ? (p.categories_tags as unknown[]).filter((c): c is string => typeof c === "string") : [];
  const g = String(p.nutriscore_grade ?? p.nutrition_grades ?? "").toLowerCase();
  const nova = Number(p.nova_group);
  const image = typeof p.image_front_small_url === "string" && p.image_front_small_url.startsWith("https://") ? p.image_front_small_url : undefined;
  return {
    code,
    name: name || "Unnamed product",
    brand: p.brands?.split(",")[0]?.trim() || undefined,
    image,
    quantity: p.quantity?.trim() || undefined,
    ingredients: p.ingredients_text?.trim() || undefined,
    additives,
    notes: fromText.notes.length ? fromText.notes : undefined,
    allergens: allergenIds(p.allergens_tags),
    traces: allergenIds(p.traces_tags),
    nutrition: parseNutrition(p.nutriments),
    grade: ["a", "b", "c", "d", "e"].includes(g) ? (g as Product["grade"]) : undefined,
    nova: [1, 2, 3, 4].includes(nova) ? (nova as Product["nova"]) : undefined,
    isDrink: cats.some((c) => c === "en:beverages" || c === "en:waters"),
    category: cats[cats.length - 1],
  };
}

const FIELDS = "code,product_name,generic_name,brands,quantity,image_front_small_url,ingredients_text,additives_tags,categories_tags,allergens_tags,traces_tags,nutriments,nutriscore_grade,nutrition_grades,nova_group";

/**
 * Popular products from the same category, for "better choices". The database can't
 * filter by several grades at once, so we fetch a page of popular ones and let the
 * caller judge them. Any failure just means no suggestions.
 */
export async function similarProducts(category: string, fetchImpl: typeof fetch = fetch): Promise<Product[]> {
  if (!/^[a-z]{2}:[a-z0-9-]+$/.test(category)) return [];
  try {
    const res = await fetchImpl(`https://world.openfoodfacts.org/api/v2/search?categories_tags=${encodeURIComponent(category)}&sort_by=unique_scans_n&page_size=30&fields=${FIELDS}`, { headers: { Accept: "application/json" } });
    if (!res.ok) return [];
    const json = (await res.json()) as { products?: Array<OffProduct & { code?: string }> };
    return (json.products ?? []).map((p) => parseProduct({ status: 1, product: p }, String(p.code ?? ""))).filter((p): p is Product => !!p && !!p.code && p.name !== "Unnamed product");
  } catch {
    return [];
  }
}

export async function lookupBarcode(raw: string, fetchImpl: typeof fetch = fetch): Promise<LookupResult> {
  const code = raw.replace(/\s/g, "");
  if (!isValidBarcode(code)) return { ok: false, reason: "invalid" };
  try {
    const fields = FIELDS;
    const res = await fetchImpl(`https://world.openfoodfacts.org/api/v2/product/${code}.json?fields=${fields}`, { headers: { Accept: "application/json" } });
    if (res.status === 404) return { ok: false, reason: "notfound" };
    if (!res.ok) return { ok: false, reason: "network" };
    const product = parseProduct(await res.json(), code);
    return product ? { ok: true, product } : { ok: false, reason: "notfound" };
  } catch {
    return { ok: false, reason: "network" };
  }
}
