import { create } from "zustand";
import type { Title } from "../types";

// Phase 2 placeholder; the real audio-backed store lands in phase 3.
interface PlayerState {
  current: { id: string; title: Title } | null;
  playTitle(t: Title, resume?: number): void;
}
export const usePlayer = create<PlayerState>((set) => ({
  current: null,
  playTitle(t) {
    set({ current: { id: t.id, title: t } });
  },
}));
