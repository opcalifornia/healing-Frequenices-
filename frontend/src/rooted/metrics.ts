/**
 * Anonymous, aggregate usage counts.
 *
 * `track("first_win_completed")` adds one to a daily counter on the server.
 * Only a name from METRIC_EVENTS is sent, plus, for "app_open", a coarse
 * bucket of days since this device first opened the app. Never a user,
 * profile or device id, auth token, health value or time finer than the day.
 * Requests carry no auth header, so counts can't be tied to an account.
 *
 * Events are batched (memory + localStorage), "app_open" is sent at most once
 * per day per device, and the queue is flushed every 30 s and on pagehide via
 * navigator.sendBeacon. In local mode (no API) nothing is sent; only on-device
 * counts are kept for the "what we count" display. Users can turn it off on
 * the Your data page; Do Not Track / Global Privacy Control default it to off.
 */
import { API_URL, apiEnabled } from "../api/client";

export const METRIC_EVENTS = [
  "app_open",
  "first_win_started",
  "first_win_completed",
  "practice_completed",
  "program_day_completed",
  "calendar_event_added",
  "share_card_opened",
  "invite_sent",
  "guide_opened",
  "tour_completed",
  "tour_skipped",
] as const;
export type MetricEvent = (typeof METRIC_EVENTS)[number];

export const DAY_BUCKETS = ["0", "1", "2-6", "7-29", "30+"] as const;
export type DayBucket = (typeof DAY_BUCKETS)[number];

export interface MetricPayload {
  event: MetricEvent;
  day_bucket?: DayBucket;
}

const K = {
  enabled: "rooted.metrics.enabled",
  queue: "rooted.metrics.queue",
  counts: "rooted.metrics.counts",
  firstSeen: "rooted.metrics.firstSeen",
  lastOpen: "rooted.metrics.lastOpen",
};
const MAX_QUEUE = 200;
const BATCH = 50; // server limit per request
const FLUSH_MS = 30_000;
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

function get(key: string): string | null {
  try {
    return globalThis.localStorage?.getItem(key) ?? null;
  } catch {
    return null;
  }
}
function set(key: string, value: string): void {
  try {
    globalThis.localStorage?.setItem(key, value);
  } catch {
    /* storage full or blocked: carry on in memory */
  }
}
function remove(key: string): void {
  try {
    globalThis.localStorage?.removeItem(key);
  } catch {
    /* ignore */
  }
}
function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = get(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

/** Local calendar date as YYYY-MM-DD. */
export function localDay(d: Date = new Date()): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** Days between two YYYY-MM-DD dates, bucketed as 0, 1, 2-6, 7-29 or 30+. */
export function dayBucket(firstSeen: string, today: string): DayBucket {
  const ms = (s: string) => {
    const [y, m, d] = s.split("-").map(Number);
    return Date.UTC(y, m - 1, d);
  };
  const days = Math.round((ms(today) - ms(firstSeen)) / 86_400_000);
  if (!Number.isFinite(days) || days <= 0) return "0";
  if (days === 1) return "1";
  if (days < 7) return "2-6";
  if (days < 30) return "7-29";
  return "30+";
}

function privacySignal(): boolean {
  const nav = (globalThis as { navigator?: Navigator & { globalPrivacyControl?: boolean; msDoNotTrack?: string } }).navigator;
  const win = (globalThis as { doNotTrack?: string }).doNotTrack;
  return nav?.doNotTrack === "1" || nav?.msDoNotTrack === "1" || nav?.globalPrivacyControl === true || win === "1";
}

/** Whether anonymous counts are on. Defaults to on, or off when the browser sends Do Not Track / GPC. */
export function metricsEnabled(): boolean {
  const v = get(K.enabled);
  if (v === "1") return true;
  if (v === "0") return false;
  return !privacySignal();
}

export function setMetricsEnabled(on: boolean): void {
  set(K.enabled, on ? "1" : "0");
  if (!on) {
    queue = [];
    remove(K.queue);
  }
}

let queue: MetricPayload[] | null = null;
let started = false;

function loadQueue(): MetricPayload[] {
  if (queue === null) {
    const saved = readJson<unknown>(K.queue, []);
    // Drop anything that isn't a well-formed event (old versions, tampering).
    queue = Array.isArray(saved)
      ? saved.filter((e): e is MetricPayload =>
          !!e && typeof e === "object" && METRIC_EVENTS.includes((e as MetricPayload).event) &&
          ((e as MetricPayload).day_bucket === undefined || DAY_BUCKETS.includes((e as MetricPayload).day_bucket!)))
          .map((e) => (e.day_bucket ? { event: e.event, day_bucket: e.day_bucket } : { event: e.event }))
      : [];
  }
  return queue;
}
function saveQueue(): void {
  if (queue && queue.length) set(K.queue, JSON.stringify(queue));
  else remove(K.queue);
}

/** Events waiting to be sent (for tests and debugging). */
export function queuedEvents(): MetricPayload[] {
  return [...loadQueue()];
}

/** How many times each event has been counted on this device. Never leaves the device. */
export function localCounts(): Partial<Record<MetricEvent, number>> {
  return readJson<Partial<Record<MetricEvent, number>>>(K.counts, {});
}

function bumpLocal(event: MetricEvent): void {
  const c = localCounts();
  c[event] = (c[event] ?? 0) + 1;
  set(K.counts, JSON.stringify(c));
}

/** Count one use of a feature. Safe to call anywhere; never throws. */
export function track(event: MetricEvent): void {
  try {
    if (!METRIC_EVENTS.includes(event) || !metricsEnabled()) return;
    const payload: MetricPayload = { event };
    if (event === "app_open") {
      const today = localDay();
      if (get(K.lastOpen) === today) return; // once per day per device
      set(K.lastOpen, today);
      let first = get(K.firstSeen);
      if (!first || !DAY_RE.test(first) || first > today) {
        first = today;
        set(K.firstSeen, today);
      }
      payload.day_bucket = dayBucket(first, today);
    }
    bumpLocal(event);
    if (!apiEnabled) return;
    const q = loadQueue();
    q.push(payload);
    if (q.length > MAX_QUEUE) q.splice(0, q.length - MAX_QUEUE);
    saveQueue();
    start();
  } catch {
    /* metrics must never break the app */
  }
}

function send(batch: MetricPayload[]): boolean {
  const url = `${API_URL}/api/metrics`;
  // text/plain keeps this a CORS "simple" request (no preflight); the API parses it as JSON.
  const body = JSON.stringify({ events: batch });
  const nav = globalThis.navigator as Navigator | undefined;
  if (nav && typeof nav.sendBeacon === "function") {
    return nav.sendBeacon(url, new Blob([body], { type: "text/plain;charset=UTF-8" }));
  }
  if (typeof fetch === "function") {
    void fetch(url, { method: "POST", body, keepalive: true, headers: { "Content-Type": "text/plain;charset=UTF-8" }, credentials: "omit" }).catch(() => undefined);
    return true;
  }
  return false;
}

/** Send queued events now. Called on a timer and when the page is hidden. */
export function flushMetrics(): void {
  try {
    if (!apiEnabled || !metricsEnabled()) return;
    const q = loadQueue();
    while (q.length) {
      const batch = q.slice(0, BATCH);
      if (!send(batch)) break; // keep them for the next try
      q.splice(0, batch.length);
    }
    saveQueue();
  } catch {
    /* try again later */
  }
}

function start(): void {
  if (started || typeof window === "undefined") return;
  started = true;
  setInterval(flushMetrics, FLUSH_MS);
  window.addEventListener("pagehide", flushMetrics);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushMetrics();
  });
}
