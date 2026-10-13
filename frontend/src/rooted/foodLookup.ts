/**
 * Look a product up by barcode in Open Food Facts (open data, ODbL licence:
 * credit them and share improvements back) and pull out its additives.
 * Only the barcode is sent. Nothing about the person or their profile leaves the device.
 */
import { normalizeCode } from "./additivesContent";

export interface Product {
  code: string;
  name: string;
  brand?: string;
  image?: string;
  ingredients?: string;
  /** Lowercase E-codes found, for example ["e330", "e415"]. */
  additives: string[];
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
  image_front_small_url?: string;
  ingredients_text?: string;
  additives_tags?: unknown;
}

/** Turn Open Food Facts JSON into a Product. Returns null when there is no product. */
export function parseProduct(json: unknown, code: string): Product | null {
  const root = json as { status?: number; product?: OffProduct } | null;
  const p = root?.product;
  if (!p || root?.status === 0) return null;
  const tags = Array.isArray(p.additives_tags) ? (p.additives_tags as unknown[]) : [];
  const additives = [...new Set(tags.map((t) => (typeof t === "string" ? normalizeCode(t) : undefined)).filter((c): c is string => !!c))];
  const name = (p.product_name || p.generic_name || "").trim();
  const image = typeof p.image_front_small_url === "string" && p.image_front_small_url.startsWith("https://") ? p.image_front_small_url : undefined;
  return {
    code,
    name: name || "Unnamed product",
    brand: p.brands?.split(",")[0]?.trim() || undefined,
    image,
    ingredients: p.ingredients_text?.trim() || undefined,
    additives,
  };
}

export async function lookupBarcode(raw: string, fetchImpl: typeof fetch = fetch): Promise<LookupResult> {
  const code = raw.replace(/\s/g, "");
  if (!isValidBarcode(code)) return { ok: false, reason: "invalid" };
  try {
    const fields = "code,product_name,generic_name,brands,image_front_small_url,ingredients_text,additives_tags";
    const res = await fetchImpl(`https://world.openfoodfacts.org/api/v2/product/${code}.json?fields=${fields}`, { headers: { Accept: "application/json" } });
    if (res.status === 404) return { ok: false, reason: "notfound" };
    if (!res.ok) return { ok: false, reason: "network" };
    const product = parseProduct(await res.json(), code);
    return product ? { ok: true, product } : { ok: false, reason: "notfound" };
  } catch {
    return { ok: false, reason: "network" };
  }
}
