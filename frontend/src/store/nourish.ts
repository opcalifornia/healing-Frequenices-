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
  /** The dish this ingredient is for, so a big list stays organized and you know why each item is there. */
  dish?: { id: string; title: string };
  /** The ingredient's own id, shared by every dish that uses it. */
  ing?: string;
}

export type NewItem = Omit<ListItem, "checked"> & { checked?: boolean };

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
  /** Ingredient ids (same ids as the shopping list) the person has at home, per profile. */
  kitchen: Record<string, string[]>;
  toggleKitchen(id: string): void;
  setKitchen(ids: string[]): void;
  addItem(item: NewItem): void;
  addItems(items: NewItem[]): void;
  removeDish(dishId: string): void;
  toggleMany(ids: string[]): void;
  removeMany(ids: string[]): void;
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
        kitchen: {},
        toggleKitchen(id) {
          const p = pid();
          const mine = get().kitchen?.[p] ?? [];
          set({ kitchen: { ...(get().kitchen ?? {}), [p]: mine.includes(id) ? mine.filter((x) => x !== id) : [...mine, id] } });
        },
        setKitchen(ids) {
          set({ kitchen: { ...(get().kitchen ?? {}), [pid()]: [...new Set(ids)] } });
        },
        addItem(item) {
          editList((l) => (l.some((i) => i.id === item.id) ? l : [...l, { ...item, checked: !!item.checked }]));
        },
        addItems(items) {
          editList((l) => {
            const have = new Set(l.map((i) => i.id));
            const add = items.filter((i) => (have.has(i.id) ? false : (have.add(i.id), true))).map((i) => ({ ...i, checked: !!i.checked }));
            return [...l, ...add];
          });
        },
        removeDish(dishId) {
          editList((l) => l.filter((i) => i.dish?.id !== dishId));
        },
        toggleMany(ids) {
          const on = new Set(ids);
          editList((l) => {
            const targets = l.filter((i) => on.has(i.id));
            const allDone = targets.length > 0 && targets.every((i) => i.checked);
            return l.map((i) => (on.has(i.id) ? { ...i, checked: !allDone } : i));
          });
        },
        removeMany(ids) {
          const on = new Set(ids);
          editList((l) => l.filter((i) => !on.has(i.id)));
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
const NO_IDS: string[] = [];
export function useKitchen(): string[] {
  const p = useP();
  return useNourish((s) => s.kitchen?.[p] ?? NO_IDS);
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

export interface DishGroup {
  id: string;
  title: string;
  items: ListItem[];
}

/** Items grouped by the dish they are for (in the order dishes were added), plus anything added on its own. */
export function groupByDish(items: ListItem[]): { dishes: DishGroup[]; loose: ListItem[] } {
  const dishes = new Map<string, DishGroup>();
  const loose: ListItem[] = [];
  for (const i of items) {
    if (!i.dish) {
      loose.push(i);
      continue;
    }
    const g = dishes.get(i.dish.id) ?? { id: i.dish.id, title: i.dish.title, items: [] };
    g.items.push(i);
    dishes.set(i.dish.id, g);
  }
  return { dishes: [...dishes.values()], loose };
}

export interface MergedItem {
  key: string;
  name: string;
  qty: string;
  checked: boolean;
  ids: string[];
  forDishes: string[];
}

/**
 * The same list by aisle, with an ingredient that several dishes need shown once, listing what it is for
 * ("Onion: for Dal, Minestrone"). Ticking it ticks it for every dish.
 */
export function mergedByAisle(items: ListItem[]): Array<[string, MergedItem[]]> {
  const byKey = new Map<string, { aisle: string; m: MergedItem; qtys: string[] }>();
  for (const i of items) {
    const key = i.ing ?? i.id;
    const cur = byKey.get(key) ?? { aisle: i.aisle, m: { key, name: i.name, qty: "", checked: true, ids: [], forDishes: [] }, qtys: [] };
    cur.m.ids.push(i.id);
    cur.m.checked = cur.m.checked && i.checked;
    if (i.dish && !cur.m.forDishes.includes(i.dish.title)) cur.m.forDishes.push(i.dish.title);
    if (i.qty) cur.qtys.push(i.qty);
    byKey.set(key, cur);
  }
  const byAisle = new Map<string, MergedItem[]>();
  for (const { aisle, m, qtys } of byKey.values()) {
    m.qty = qtys.join(" + ");
    byAisle.set(aisle, [...(byAisle.get(aisle) ?? []), m]);
  }
  return [...byAisle.entries()].sort((a, b) => {
    const ia = AISLE_ORDER.indexOf(a[0]);
    const ib = AISLE_ORDER.indexOf(b[0]);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });
}

/** Plain-text list that pastes cleanly into Notes, Reminders or a text message. Dishes first, each with its own ingredients. */
export function listToText(items: ListItem[], title = "Shopping list"): string {
  const lines = [`${title}`, ""];
  const { dishes, loose } = groupByDish(items);
  const row = (i: ListItem) => `${i.checked ? "[x]" : "[ ]"} ${i.name}${i.qty ? ` (${i.qty})` : ""}`;
  for (const d of dishes) {
    lines.push(`FOR: ${d.title.toUpperCase()}`);
    d.items.forEach((i) => lines.push(row(i)));
    lines.push("");
  }
  if (loose.length) {
    if (dishes.length) lines.push("OTHER ITEMS", "");
    for (const [aisle, group] of groupByAisle(loose)) {
      lines.push(aisle.toUpperCase());
      group.forEach((i) => lines.push(row(i)));
      lines.push("");
    }
  }
  return lines.join("\n").trimEnd() + "\n";
}
