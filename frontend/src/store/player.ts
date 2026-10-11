import { create } from "zustand";
export const usePlayer = create<{ current: null | { id: string } }>(() => ({ current: null }));
