import { create } from "zustand";
import { api, apiEnabled } from "../api/client";
import type { Catalog, Section, Title } from "../types";

interface CatalogState {
  catalog: Catalog | null;
  error: string | null;
  source: "api" | "bundled" | null;
  load(): Promise<void>;
}

const loadBundled = async (): Promise<Catalog> => (await import("../data/catalog.json")).default as unknown as Catalog;

export const useCatalogStore = create<CatalogState>((set, get) => ({
  catalog: null,
  error: null,
  source: null,
  async load() {
    if (get().catalog) return;
    if (apiEnabled) {
      try {
        set({ catalog: await api<Catalog>("/catalog"), source: "api" });
        return;
      } catch (err) {
        console.warn("[catalog] API unavailable, using bundled catalog", err);
      }
    }
    try {
      set({ catalog: await loadBundled(), source: "bundled" });
    } catch (err) {
      set({ error: String(err) });
    }
  },
}));

export const useCatalog = () => useCatalogStore((s) => s.catalog);

export function useSection(id: string): { section: Section | null; titles: Record<string, Title> } {
  const catalog = useCatalog();
  return { section: catalog?.sections[id] ?? null, titles: catalog?.titles ?? {} };
}

export function useTitle(id: string | undefined): Title | null {
  return useCatalogStore((s) => (id && s.catalog?.titles[id]) || null);
}

/** Client-side search used in local mode and for instant results while typing. */
export function searchTitles(catalog: Catalog, query: string): Title[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  const scored: Array<[number, Title]> = [];
  for (const t of Object.values(catalog.titles)) {
    const name = t.name.toLowerCase();
    const hay = [t.name, t.tagline, t.description, t.goal, t.band, t.category, t.host, ...t.tags, t.beat ? `${t.beat}hz` : ""]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    if (!terms.every((term) => hay.includes(term))) continue;
    let score = 1;
    if (name.startsWith(q)) score += 10;
    else if (name.includes(q)) score += 5;
    if (t.tags.some((tag) => tag.toLowerCase() === q)) score += 3;
    scored.push([score, t]);
  }
  return scored.sort((a, b) => b[0] - a[0] || a[1].name.localeCompare(b[1].name)).map(([, t]) => t);
}
