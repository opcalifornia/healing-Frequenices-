/**
 * GAIA, the Rooted AI guide: talking to the server, and the snapshot of what the
 * person has shared that goes with each message. The conversation itself stays on
 * the device (in memory for now) and is sent along with every message.
 * See docs/PHASE_GAIA.md.
 */
import { useEffect } from "react";
import { create } from "zustand";
import { API_URL, apiEnabled, authHeader } from "../api/client";
import { useUser } from "../store/user";
import { useWellness, DEFAULT_ABOUT } from "../store/wellness";
import { useBedtime } from "../store/bedtime";
import { usePractice } from "../store/practice";
import { useAllergenStore } from "../store/allergens";
import { allergenLabel } from "./allergens";

export interface GaiaCard {
  id: string;
  kind: string;
  title: string;
  summary?: string;
  evidence?: string;
  minutes?: number;
  to: string;
}

export type GaiaEvent =
  | { type: "text"; text: string }
  | { type: "cards"; items: GaiaCard[] }
  | { type: "navigate"; to: string; label: string }
  | { type: "crisis" }
  | { type: "error"; message: string }
  | { type: "done" };

export interface GaiaTurn {
  role: "user" | "assistant";
  text: string;
  cards?: GaiaCard[];
  opened?: string[];
  error?: string;
}

/** How many past turns go with each message. Older ones stay on screen but aren't sent. */
export const HISTORY_SENT = 20;

/** Whether this account may use GAIA. Asked once per sign-in; hidden everywhere else. */
export const useGaiaStatus = create<{ enabled: boolean; checkedFor: string | null; open: boolean; setOpen(o: boolean): void }>((set) => ({
  enabled: false,
  checkedFor: null,
  open: false,
  setOpen: (open) => set({ open }),
}));

export function useCheckGaia(): void {
  const token = useUser((s) => s.token);
  useEffect(() => {
    if (!apiEnabled || !token) {
      useGaiaStatus.setState({ enabled: false, checkedFor: null });
      return;
    }
    if (useGaiaStatus.getState().checkedFor === token) return;
    const ctrl = new AbortController();
    fetch(`${API_URL}/api/gaia/status`, { headers: { Accept: "application/json", ...authHeader() }, signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : { enabled: false }))
      .then((d: { enabled?: boolean }) => useGaiaStatus.setState({ enabled: !!d.enabled, checkedFor: token }))
      .catch(() => undefined);
    return () => ctrl.abort();
  }, [token]);
}

/** What GAIA may know, built fresh for each message from what the app already keeps. */
export function profileSnapshot(now = new Date()) {
  const pid = useUser.getState().activeProfileId ?? "guest";
  const profile = useUser.getState().profiles.find((p) => p.id === pid);
  const about = useWellness.getState().about[pid] ?? DEFAULT_ABOUT;
  const plan = useBedtime.getState().plans[pid];
  const logs = usePractice.getState().logs[pid] ?? [];
  const allergens = useAllergenStore.getState().byProfile[pid] ?? [];
  const recent = logs.slice(-12).map((e) => `${e.day}: ${e.kind}${e.minutes ? ` (${e.minutes} min)` : ""}`);
  const name = profile && !["listener", "guest"].includes(profile.name.toLowerCase()) ? profile.name : undefined;
  return {
    name,
    goals: about.goals,
    considerations: about.considerations,
    activity: about.activity,
    minutes_per_day: about.minutes,
    wake: plan?.wake,
    bed: plan?.bedtime,
    allergens: allergens.map(allergenLabel),
    recent,
    local_time: now.toLocaleString(undefined, { weekday: "long", hour: "2-digit", minute: "2-digit" }),
  };
}

/** Parse a text/event-stream body into GAIA events. */
export async function* readEvents(body: ReadableStream<Uint8Array>): AsyncGenerator<GaiaEvent> {
  const reader = body.getReader();
  const dec = new TextDecoder();
  let buf = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (value) buf += dec.decode(value, { stream: true });
    let i: number;
    while ((i = buf.indexOf("\n\n")) >= 0) {
      const chunk = buf.slice(0, i);
      buf = buf.slice(i + 2);
      for (const line of chunk.split("\n")) {
        if (!line.startsWith("data: ")) continue;
        try {
          yield JSON.parse(line.slice(6)) as GaiaEvent;
        } catch {
          /* skip a malformed line */
        }
      }
    }
    if (done) return;
  }
}

export async function* askGaia(turns: GaiaTurn[], signal?: AbortSignal): AsyncGenerator<GaiaEvent> {
  const messages = turns.filter((t) => t.text.trim()).slice(-HISTORY_SENT).map((t) => ({ role: t.role, text: t.text.slice(0, 4000) }));
  while (messages.length && messages[0].role !== "user") messages.shift();
  const res = await fetch(`${API_URL}/api/gaia/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "text/event-stream", ...authHeader() },
    body: JSON.stringify({ messages, profile: profileSnapshot() }),
    signal,
  });
  if (res.status === 429) {
    yield { type: "error", message: "You've reached GAIA's limit for now. Try again a bit later." };
    return;
  }
  if (!res.ok || !res.body) {
    yield { type: "error", message: "GAIA isn't available right now." };
    return;
  }
  yield* readEvents(res.body);
}
