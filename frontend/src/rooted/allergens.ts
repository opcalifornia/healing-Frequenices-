/**
 * The 14 major allergens regulators require on labels (EU) plus the 9 US ones overlap
 * with these. Open Food Facts names them as tags like "en:milk".
 */
export const ALLERGENS = [
  { id: "milk", label: "Milk", tag: "en:milk" },
  { id: "eggs", label: "Eggs", tag: "en:eggs" },
  { id: "peanuts", label: "Peanuts", tag: "en:peanuts" },
  { id: "nuts", label: "Tree nuts", tag: "en:nuts" },
  { id: "soy", label: "Soy", tag: "en:soybeans" },
  { id: "gluten", label: "Gluten", tag: "en:gluten" },
  { id: "fish", label: "Fish", tag: "en:fish" },
  { id: "crustaceans", label: "Shellfish (crustaceans)", tag: "en:crustaceans" },
  { id: "molluscs", label: "Molluscs", tag: "en:molluscs" },
  { id: "sesame", label: "Sesame", tag: "en:sesame-seeds" },
  { id: "mustard", label: "Mustard", tag: "en:mustard" },
  { id: "celery", label: "Celery", tag: "en:celery" },
  { id: "lupin", label: "Lupin", tag: "en:lupin" },
  { id: "sulphites", label: "Sulfites", tag: "en:sulphur-dioxide-and-sulphites" },
] as const;

export type AllergenId = (typeof ALLERGENS)[number]["id"];

const BY_TAG = new Map<string, AllergenId>(ALLERGENS.map((a) => [a.tag, a.id]));
const LABEL = new Map<AllergenId, string>(ALLERGENS.map((a) => [a.id, a.label]));

export const allergenLabel = (id: AllergenId): string => LABEL.get(id) ?? id;

/** Turn the database's tags into our ids. Tags we don't list are ignored. */
export function allergenIds(tags: unknown): AllergenId[] {
  if (!Array.isArray(tags)) return [];
  const out = new Set<AllergenId>();
  for (const t of tags) {
    const id = typeof t === "string" ? BY_TAG.get(t.trim().toLowerCase()) : undefined;
    if (id) out.add(id);
  }
  return [...out];
}

/** Which of the allergens a person watches for a product contains, and which it may contain as traces. */
export function allergenHits(watch: readonly AllergenId[], product: { allergens: AllergenId[]; traces: AllergenId[] }) {
  return {
    contains: watch.filter((w) => product.allergens.includes(w)),
    traces: watch.filter((w) => !product.allergens.includes(w) && product.traces.includes(w)),
  };
}
