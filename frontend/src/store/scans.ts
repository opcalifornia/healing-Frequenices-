import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUser } from "./user";
import type { Product } from "../rooted/foodLookup";
import type { Verdict } from "../rooted/productVerdict";

/**
 * Recently scanned products, per profile, kept on this device only. The product is
 * stored with the entry so a past scan opens again with no connection.
 */
export interface ScanEntry {
  code: string;
  at: number;
  verdict: Verdict;
  product: Product;
}

const MAX = 30;

interface State {
  byProfile: Record<string, ScanEntry[]>;
  /** Barcodes the person has saved, per profile. */
  saved: Record<string, string[]>;
  toggleSaved(code: string, pid?: string): void;
  add(e: Omit<ScanEntry, "at">, pid?: string): void;
  remove(code: string, pid?: string): void;
  clear(pid?: string): void;
}

const pidNow = () => useUser.getState().activeProfileId ?? "guest";

export const useScans = create<State>()(
  persist(
    (set) => ({
      byProfile: {},
      saved: {},
      toggleSaved: (code, pid = pidNow()) =>
        set((s) => {
          const cur = s.saved?.[pid] ?? [];
          return { saved: { ...(s.saved ?? {}), [pid]: cur.includes(code) ? cur.filter((c) => c !== code) : [code, ...cur] } };
        }),
      add: (e, pid = pidNow()) =>
        set((s) => ({ byProfile: { ...s.byProfile, [pid]: [{ ...e, at: Date.now() }, ...(s.byProfile[pid] ?? []).filter((x) => x.code !== e.code)].slice(0, MAX) } })),
      remove: (code, pid = pidNow()) => set((s) => ({ byProfile: { ...s.byProfile, [pid]: (s.byProfile[pid] ?? []).filter((x) => x.code !== code) } })),
      clear: (pid = pidNow()) => set((s) => ({ byProfile: { ...s.byProfile, [pid]: [] } })),
    }),
    { name: "rooted.scans" },
  ),
);

const NONE: ScanEntry[] = [];

export function useScanHistory(): ScanEntry[] {
  const pid = useUser((s) => s.activeProfileId) ?? "guest";
  return useScans((s) => s.byProfile[pid] ?? NONE);
}

export function useSavedCodes(): string[] {
  const pid = useUser((s) => s.activeProfileId) ?? "guest";
  return useScans((s) => s.saved?.[pid] ?? NONE_CODES);
}
const NONE_CODES: string[] = [];
