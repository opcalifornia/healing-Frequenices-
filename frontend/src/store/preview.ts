import { create } from "zustand";
import type { Title } from "../types";

/** The single hover-preview card, rendered in a portal so rails can clip freely. */
interface PreviewState {
  title: Title | null;
  rect: DOMRect | null;
  show(title: Title, rect: DOMRect): void;
  hide(): void;
}

export const usePreview = create<PreviewState>((set) => ({
  title: null,
  rect: null,
  show: (title, rect) => set({ title, rect }),
  hide: () => set({ title: null, rect: null }),
}));
