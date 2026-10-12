import { api, apiEnabled, ApiError } from "../api/client";
import { useNourish } from "../store/nourish";
import { usePractice } from "../store/practice";
import { useWellness } from "../store/wellness";
import { usePrograms } from "../store/programs";
import { useGarden } from "../store/garden";
import { useJournal } from "../store/journal";
import { useSupport } from "../store/support";
import { useBedtime } from "../store/bedtime";
import { useCalendar } from "../store/calendar";
import { useEarth } from "../store/earth";

/**
 * Keeps each profile's Rooted data in sync with the account on the server.
 * Every store slice for the active profile is a named document; the newest
 * copy wins. Private notes (journal, safety plan, moods) only sync when the
 * person turns on private backup.
 */

type AnyState = Record<string, Record<string, unknown>>;
interface Slice {
  key: string;
  private?: boolean;
  store: { getState(): unknown; setState(p: unknown): void; subscribe(fn: () => void): () => void };
  fields: string[];
}

export const SLICES: Slice[] = [
  { key: "nourish", store: useNourish as unknown as Slice["store"], fields: ["lists", "water", "goals"] },
  { key: "practice", store: usePractice as unknown as Slice["store"], fields: ["logs", "customs", "bolts", "hearts"] },
  { key: "wellness", store: useWellness as unknown as Slice["store"], fields: ["about"] },
  { key: "programs", store: usePrograms as unknown as Slice["store"], fields: ["enrolled"] },
  { key: "garden", store: useGarden as unknown as Slice["store"], fields: ["beds"] },
  { key: "bedtime", store: useBedtime as unknown as Slice["store"], fields: ["plans", "nights"] },
  // Work-calendar busy blocks stay on the device; only health events sync.
  { key: "calendar", store: useCalendar as unknown as Slice["store"], fields: ["events"] },
  { key: "earth", store: useEarth as unknown as Slice["store"], fields: ["pledges", "deeds"] },
  { key: "journal", private: true, store: useJournal as unknown as Slice["store"], fields: ["entries"] },
  { key: "support", private: true, store: useSupport as unknown as Slice["store"], fields: ["plans", "moods"] },
];

/** The active profile's part of a store. */
export function pick(slice: Slice, pid: string): Record<string, unknown> {
  const s = slice.store.getState() as AnyState;
  return Object.fromEntries(slice.fields.map((f) => [f, s[f]?.[pid] ?? null]).filter(([, v]) => v !== null));
}

function apply(slice: Slice, pid: string, data: Record<string, unknown>) {
  const s = slice.store.getState() as AnyState;
  const patch: Record<string, unknown> = {};
  for (const f of slice.fields) if (f in data) patch[f] = { ...(s[f] ?? {}), [pid]: data[f] };
  slice.store.setState(patch);
}

const META_KEY = "rooted-sync-meta";
interface Meta {
  updated: Record<string, Record<string, string>>;
  privateBackup: boolean;
  lastSync?: string;
}
export function readMeta(): Meta {
  try {
    return { updated: {}, privateBackup: false, ...JSON.parse(localStorage.getItem(META_KEY) ?? "{}") };
  } catch {
    return { updated: {}, privateBackup: false };
  }
}
function writeMeta(m: Meta) {
  try {
    localStorage.setItem(META_KEY, JSON.stringify(m));
  } catch { /* storage full or blocked */ }
  listeners.forEach((l) => l());
}
const listeners = new Set<() => void>();
export function onMetaChange(fn: () => void) {
  listeners.add(fn);
  return () => void listeners.delete(fn);
}
export function setPrivateBackup(on: boolean) {
  writeMeta({ ...readMeta(), privateBackup: on });
}

let applying = false;
const lastSent = new Map<string, string>();

async function push(pid: string, slice: Slice, updatedAt: string) {
  try {
    await api(`/profiles/${pid}/state/${slice.key}`, { method: "PUT", body: { data: pick(slice, pid), updatedAt } });
    writeMeta({ ...readMeta(), lastSync: new Date().toISOString() });
  } catch (e) {
    if (e instanceof ApiError && e.status === 409) await pull(pid);
  }
}

/** Fetch the server copy and reconcile key by key: newest wins. */
export async function pull(pid: string) {
  const res = await api<{ keys: Record<string, { data: Record<string, unknown>; updatedAt: string }> }>(`/profiles/${pid}/state`);
  const meta = readMeta();
  const mine = meta.updated[pid] ?? {};
  for (const slice of SLICES) {
    if (slice.private && !meta.privateBackup) continue;
    const remote = res.keys[slice.key];
    const localAt = mine[slice.key];
    if (remote && (!localAt || remote.updatedAt > localAt)) {
      applying = true;
      apply(slice, pid, remote.data);
      applying = false;
      mine[slice.key] = remote.updatedAt;
      lastSent.set(`${pid}:${slice.key}`, JSON.stringify(pick(slice, pid)));
    } else if (Object.keys(pick(slice, pid)).length && (!remote || (localAt && localAt > remote.updatedAt))) {
      const at = localAt ?? new Date().toISOString();
      mine[slice.key] = at;
      await push(pid, slice, at);
      lastSent.set(`${pid}:${slice.key}`, JSON.stringify(pick(slice, pid)));
    }
  }
  writeMeta({ ...readMeta(), updated: { ...readMeta().updated, [pid]: mine }, lastSync: new Date().toISOString() });
}

/** Start syncing for a signed-in profile. Returns a stop function. */
export function startSync(pid: string): () => void {
  if (!apiEnabled) return () => undefined;
  let timer: ReturnType<typeof setTimeout> | null = null;
  const dirty = new Set<Slice>();
  const flush = () => {
    timer = null;
    const meta = readMeta();
    const now = new Date().toISOString();
    for (const slice of dirty) {
      if (slice.private && !meta.privateBackup) continue;
      meta.updated[pid] = { ...(meta.updated[pid] ?? {}), [slice.key]: now };
      void push(pid, slice, now);
    }
    dirty.clear();
    writeMeta({ ...readMeta(), updated: meta.updated });
  };
  const unsubs = SLICES.map((slice) =>
    slice.store.subscribe(() => {
      if (applying) return;
      const json = JSON.stringify(pick(slice, pid));
      const id = `${pid}:${slice.key}`;
      if (lastSent.get(id) === json) return;
      lastSent.set(id, json);
      dirty.add(slice);
      if (timer) clearTimeout(timer);
      timer = setTimeout(flush, 1500);
    }),
  );
  void pull(pid).catch(() => undefined);
  const onFocus = () => void pull(pid).catch(() => undefined);
  window.addEventListener("focus", onFocus);
  return () => {
    unsubs.forEach((u) => u());
    window.removeEventListener("focus", onFocus);
    if (timer) flush();
  };
}

/** Everything Rooted stores for a profile, for the "download my data" button. */
export function exportProfile(pid: string): string {
  const out: Record<string, unknown> = { exportedAt: new Date().toISOString(), profile: pid };
  for (const slice of SLICES) out[slice.key] = pick(slice, pid);
  return JSON.stringify(out, null, 2);
}

/** Remove this profile's data from this device. */
export function clearLocal(pid: string) {
  for (const slice of SLICES) {
    const s = slice.store.getState() as AnyState;
    const patch: Record<string, unknown> = {};
    for (const f of slice.fields) {
      const copy = { ...(s[f] ?? {}) };
      delete copy[pid];
      patch[f] = copy;
    }
    slice.store.setState(patch);
  }
  // Which Guide entries this profile opened.
  try {
    const raw = JSON.parse(localStorage.getItem("rooted-guide-visited") ?? "null");
    if (raw?.state?.visited) {
      delete raw.state.visited[pid];
      localStorage.setItem("rooted-guide-visited", JSON.stringify(raw));
    }
  } catch {
    /* ignore */
  }
}
