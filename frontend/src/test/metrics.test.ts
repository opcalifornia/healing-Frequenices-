import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mem = vi.hoisted(() => {
  const mem = new Map<string, string>();
  (globalThis as unknown as { localStorage: Storage }).localStorage = {
    getItem: (k: string) => mem.get(k) ?? null,
    setItem: (k: string, v: string) => void mem.set(k, String(v)),
    removeItem: (k: string) => void mem.delete(k),
    clear: () => mem.clear(),
    key: (i: number) => [...mem.keys()][i] ?? null,
    get length() { return mem.size; },
  } as Storage;
  return mem;
});

const client = vi.hoisted(() => ({ API_URL: "https://api.example.com", apiEnabled: true }));
vi.mock("../api/client", () => client);

type Mod = typeof import("../rooted/metrics");
async function load(): Promise<Mod> {
  vi.resetModules();
  return import("../rooted/metrics");
}

beforeEach(() => {
  mem.clear();
  client.apiEnabled = true;
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 9, 12, 9, 0));
  vi.stubGlobal("navigator", {});
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("metrics", () => {
  it("only knows a fixed list of events", async () => {
    const m = await load();
    expect([...m.METRIC_EVENTS]).toEqual([
      "app_open", "first_win_started", "first_win_completed", "practice_completed", "program_day_completed",
      "calendar_event_added", "share_card_opened", "invite_sent", "guide_opened", "tour_completed", "tour_skipped",
    ]);
    m.track("mood_logged" as never);
    expect(m.queuedEvents()).toEqual([]);
  });

  it("buckets days since first open", async () => {
    const { dayBucket } = await load();
    expect(dayBucket("2026-10-12", "2026-10-12")).toBe("0");
    expect(dayBucket("2026-10-11", "2026-10-12")).toBe("1");
    expect(dayBucket("2026-10-10", "2026-10-12")).toBe("2-6");
    expect(dayBucket("2026-10-06", "2026-10-12")).toBe("2-6");
    expect(dayBucket("2026-10-05", "2026-10-12")).toBe("7-29");
    expect(dayBucket("2026-09-13", "2026-10-12")).toBe("7-29");
    expect(dayBucket("2026-09-12", "2026-10-12")).toBe("30+");
    expect(dayBucket("2026-03-07", "2026-03-09")).toBe("2-6"); // across a DST change
    expect(dayBucket("2026-10-13", "2026-10-12")).toBe("0");
  });

  it("sends app_open once per day with its bucket, and nothing identifying", async () => {
    const m = await load();
    m.track("app_open");
    m.track("app_open");
    expect(m.queuedEvents()).toEqual([{ event: "app_open", day_bucket: "0" }]);
    expect(mem.get("rooted.metrics.firstSeen")).toBe("2026-10-12");

    vi.setSystemTime(new Date(2026, 9, 13, 8, 0));
    m.track("app_open");
    m.track("first_win_completed");
    expect(m.queuedEvents()).toEqual([
      { event: "app_open", day_bucket: "0" },
      { event: "app_open", day_bucket: "1" },
      { event: "first_win_completed" },
    ]);
    expect(m.localCounts()).toEqual({ app_open: 2, first_win_completed: 1 });
  });

  it("flushes in batches with sendBeacon and clears the queue", async () => {
    const beacon = vi.fn(() => true);
    vi.stubGlobal("navigator", { sendBeacon: beacon });
    const m = await load();
    for (let i = 0; i < 60; i++) m.track("practice_completed");
    m.flushMetrics();
    expect(beacon).toHaveBeenCalledTimes(2);
    const calls = beacon.mock.calls as unknown as [string, Blob][];
    expect(calls[0][0]).toBe("https://api.example.com/api/metrics");
    const body = JSON.parse(await calls[0][1].text());
    expect(Object.keys(body)).toEqual(["events"]);
    expect(body.events).toHaveLength(50);
    expect(m.queuedEvents()).toEqual([]);
    expect(mem.has("rooted.metrics.queue")).toBe(false);
  });

  it("keeps events when the beacon is refused", async () => {
    vi.stubGlobal("navigator", { sendBeacon: () => false });
    const m = await load();
    m.track("guide_opened");
    m.flushMetrics();
    expect(m.queuedEvents()).toEqual([{ event: "guide_opened" }]);
    // ...and survives a reload.
    const again = await load();
    expect(again.queuedEvents()).toEqual([{ event: "guide_opened" }]);
  });

  it("stops queueing when turned off", async () => {
    const m = await load();
    m.track("tour_completed");
    m.setMetricsEnabled(false);
    expect(m.metricsEnabled()).toBe(false);
    expect(m.queuedEvents()).toEqual([]);
    m.track("tour_skipped");
    m.track("app_open");
    expect(m.queuedEvents()).toEqual([]);
    expect(mem.has("rooted.metrics.firstSeen")).toBe(false);
    m.setMetricsEnabled(true);
    m.track("tour_skipped");
    expect(m.queuedEvents()).toEqual([{ event: "tour_skipped" }]);
  });

  it("defaults off with Do Not Track or Global Privacy Control", async () => {
    vi.stubGlobal("navigator", { doNotTrack: "1" });
    let m = await load();
    expect(m.metricsEnabled()).toBe(false);
    m.track("invite_sent");
    expect(m.queuedEvents()).toEqual([]);
    m.setMetricsEnabled(true); // an explicit choice wins
    expect(m.metricsEnabled()).toBe(true);

    mem.clear();
    vi.stubGlobal("navigator", { globalPrivacyControl: true });
    m = await load();
    expect(m.metricsEnabled()).toBe(false);

    mem.clear();
    vi.stubGlobal("navigator", {});
    m = await load();
    expect(m.metricsEnabled()).toBe(true);
  });

  it("only counts locally without an API", async () => {
    client.apiEnabled = false;
    const beacon = vi.fn(() => true);
    vi.stubGlobal("navigator", { sendBeacon: beacon });
    const m = await load();
    m.track("calendar_event_added");
    m.flushMetrics();
    expect(m.queuedEvents()).toEqual([]);
    expect(beacon).not.toHaveBeenCalled();
    expect(m.localCounts()).toEqual({ calendar_event_added: 1 });
  });

  it("survives broken storage", async () => {
    const m = await load();
    const ls = globalThis.localStorage;
    vi.stubGlobal("localStorage", { getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("blocked"); }, removeItem: () => { throw new Error("blocked"); } });
    expect(() => m.track("share_card_opened")).not.toThrow();
    expect(m.localCounts()).toEqual({});
    vi.stubGlobal("localStorage", ls);
  });
});
