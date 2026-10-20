import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUser } from "./user";

/**
 * Per-profile Nourish data: the shopping list and daily water log. Stored on
 * this device only for now.
 */

export interface ListItem {
  /** Pantry id, or "custom-…" for something typed in. */
  id: string;
  name: string;
  /** Where in the store, used to group the list. */
  aisle: string;
  qty?: string;
  checked: boolean;
}

/** Default daily beverage target (ml): roughly 80% of the NASEM adequate total water intake for adult women. */
export const DEFAULT_GOAL = 2200;
export const GLASS = 250;

export function todayKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

interface NourishState {
  lists: Record<string, ListItem[]>;
  water: Record<string, Record<string, number>>;
  goals: Record<string, number>;
  addItem(item: Omit<ListItem, "checked">): void;
  removeItem(id: string): void;
  toggleItem(id: string): void;
  setQty(id: string, qty: string): void;
  clearChecked(): void;
  clearList(): void;
  addWater(ml: number, day?: string): void;
  setGoal(ml: number): void;
}

const pid = () => useUser.getState().activeProfileId ?? "guest";

export const useNourish = create<NourishState>()(
  persist(
    (set, get) => {
      const editList = (fn: (l: ListItem[]) => ListItem[]) => {
        const p = pid();
        set({ lists: { ...get().lists, [p]: fn(get().lists[p] ?? []) } });
      };
      return {
        lists: {},
        water: {},
        goals: {},
        addItem(item) {
          editList((l) => (l.some((i) => i.id === item.id) ? l : [...l, { ...item, checked: false }]));
        },
        removeItem(id) {
          editList((l) => l.filter((i) => i.id !== id));
        },
        toggleItem(id) {
          editList((l) => l.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)));
        },
        setQty(id, qty) {
          editList((l) => l.map((i) => (i.id === id ? { ...i, qty } : i)));
        },
        clearChecked() {
          editList((l) => l.filter((i) => !i.checked));
        },
        clearList() {
          editList(() => []);
        },
        addWater(ml, day = todayKey()) {
          const p = pid();
          const mine = get().water[p] ?? {};
          const next = Math.max(0, (mine[day] ?? 0) + ml);
          // Keep about three months of history.
          const days = Object.keys(mine).sort().slice(-90);
          const trimmed = Object.fromEntries(days.map((k) => [k, mine[k]]));
          set({ water: { ...get().water, [p]: { ...trimmed, [day]: next } } });
        },
        setGoal(ml) {
          set({ goals: { ...get().goals, [pid()]: Math.round(Math.min(5000, Math.max(1000, ml))) } });
        },
      };
    },
    { name: "rooted-nourish", version: 1 },
  ),
);

const EMPTY: ListItem[] = [];
const useP = () => useUser((s) => s.activeProfileId) ?? "guest";

export function useShoppingList(): ListItem[] {
  const p = useP();
  return useNourish((s) => s.lists[p] ?? EMPTY);
}
export function useWater(day = todayKey()): number {
  const p = useP();
  return useNourish((s) => s.water[p]?.[day] ?? 0);
}
export function useWaterGoal(): number {
  const p = useP();
  return useNourish((s) => s.goals[p] ?? DEFAULT_GOAL);
}

/** Group a list by aisle, in a sensible walking order. */
export const AISLE_ORDER = ["Produce", "Garden", "Herbs & spices", "Tea", "Grains & beans", "Nuts & seeds", "Oils & vinegar", "Fridge & ferments", "Seafood", "Specialty & international", "Packaged foods", "Other"];
export function groupByAisle(items: ListItem[]): Array<[string, ListItem[]]> {
  const map = new Map<string, ListItem[]>();
  for (const i of items) map.set(i.aisle, [...(map.get(i.aisle) ?? []), i]);
  return [...map.entries()].sort((a, b) => {
    const ia = AISLE_ORDER.indexOf(a[0]);
    const ib = AISLE_ORDER.indexOf(b[0]);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });
}

/** Plain-text list that pastes cleanly into Notes, Reminders or a text message. */
export function listToText(items: ListItem[], title = "Shopping list"): string {
  const lines = [`${title}`, ""];
  for (const [aisle, group] of groupByAisle(items)) {
    lines.push(aisle.toUpperCase());
    for (const i of group) lines.push(`${i.checked ? "[x]" : "[ ]"} ${i.name}${i.qty ? ` (${i.qty})` : ""}`);
    lines.push("");
  }
  return lines.join("\n").trimEnd() + "\n";
}
