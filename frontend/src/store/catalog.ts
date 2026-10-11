import { create } from "zustand";
import type { Catalog } from "../types";

interface CatalogState {
  catalog: Catalog | null;
  load(): Promise<void>;
}

// Phase 1 placeholder; replaced by the real catalog loader in phase 2.
export const useCatalogStore = create<CatalogState>(() => ({
  catalog: null,
  async load() {},
}));
