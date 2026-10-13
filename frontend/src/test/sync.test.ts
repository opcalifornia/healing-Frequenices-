import { afterEach, describe, expect, it, vi } from "vitest";

// The tests run in Node, so give the stores a tiny in-memory localStorage.
vi.hoisted(() => {
  const mem = new Map<string, string>();
  (globalThis as unknown as { localStorage: Storage }).localStorage = {
    getItem: (k: string) => mem.get(k) ?? null,
    setItem: (k: string, v: string) => void mem.set(k, String(v)),
    removeItem: (k: string) => void mem.delete(k),
    clear: () => mem.clear(),
    key: (i: number) => [...mem.keys()][i] ?? null,
    get length() { return mem.size; },
  } as Storage;
});
import { exportProfile, pick, pull, readMeta, setPrivateBackup, SLICES } from "../rooted/sync";
import { useNourish } from "../store/nourish";
import { useJournal } from "../store/journal";

const nourish = SLICES.find((s) => s.key === "nourish")!;

function mockServer(keys: Record<string, { data: unknown; updatedAt: string }>) {
  const puts: Array<{ url: string; body: { data: unknown; updatedAt: string } }> = [];
  globalThis.fetch = vi.fn(async (url: RequestInfo | URL, init?: RequestInit) => {
    if (init?.method === "PUT") {
      puts.push({ url: String(url), body: JSON.parse(String(init.body)) });
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify({ keys }), { status: 200, headers: { "Content-Type": "application/json" } });
  }) as typeof fetch;
  return puts;
}

afterEach(() => {
  localStorage.clear();
  useNourish.setState({ lists: {}, water: {}, goals: {} });
  useJournal.setState({ entries: {} });
});

describe("sync", () => {
  it("picks only the active profile's data", () => {
    useNourish.setState({ lists: { a: [{ id: "oats", name: "Oats", aisle: "Grains & beans", checked: false }], b: [] }, goals: { a: 2500 } });
    expect(pick(nourish, "a")).toEqual({ lists: [{ id: "oats", name: "Oats", aisle: "Grains & beans", checked: false }], goals: 2500 });
  });

  it("applies newer server data and pushes newer local data", async () => {
    useNourish.setState({ goals: { p1: 3000 } });
    localStorage.setItem("rooted-sync-meta", JSON.stringify({ updated: { p1: { nourish: "2026-10-11T08:00:00.000Z" } }, privateBackup: false }));
    mockServer({ nourish: { data: { goals: 2000, lists: [] }, updatedAt: "2026-10-11T09:00:00.000Z" } });
    await pull("p1");
    expect(useNourish.getState().goals.p1).toBe(2000);
    expect(readMeta().updated.p1.nourish).toBe("2026-10-11T09:00:00.000Z");

    useNourish.setState({ goals: { p1: 3200 } });
    localStorage.setItem("rooted-sync-meta", JSON.stringify({ updated: { p1: { nourish: "2026-10-11T10:00:00.000Z" } }, privateBackup: false }));
    const puts = mockServer({ nourish: { data: { goals: 2000 }, updatedAt: "2026-10-11T09:00:00.000Z" } });
    await pull("p1");
    expect(puts.some((p) => p.url.endsWith("/profiles/p1/state/nourish") && (p.body.data as { goals: number }).goals === 3200)).toBe(true);
  });

  it("keeps private notes local unless backup is on", async () => {
    useJournal.setState({ entries: { p1: [{ day: "2026-10-11", prompt: "Three good things", lines: ["Sun"] }] } });
    let puts = mockServer({});
    await pull("p1");
    expect(puts.some((p) => p.url.includes("/state/journal"))).toBe(false);
    setPrivateBackup(true);
    puts = mockServer({});
    await pull("p1");
    expect(puts.some((p) => p.url.includes("/state/journal"))).toBe(true);
  });

  it("exports everything for a profile", () => {
    useNourish.setState({ goals: { p1: 2400 } });
    const out = JSON.parse(exportProfile("p1"));
    expect(out.nourish.goals).toBe(2400);
    expect(out.profile).toBe("p1");
  });
});
