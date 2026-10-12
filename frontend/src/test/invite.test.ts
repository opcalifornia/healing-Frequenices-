import { describe, expect, it, vi } from "vitest";

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
import { cleanInvite, clearPendingInvite, inviteMessage, invitePath, pendingInvite, savePendingInvite } from "../rooted/invite";

describe("invite links", () => {
  it("builds a path with only program, first name and code", () => {
    expect(invitePath({ p: "calmer-7", from: "Sam", ref: "abcd2345" })).toBe("/join?p=calmer-7&from=Sam&ref=abcd2345");
    expect(invitePath({})).toBe("/join");
  });

  it("cleans anything unexpected from a link", () => {
    expect(cleanInvite({ p: "../etc", from: "<b>Sam</b> 😀", ref: "x", extra: "y" })).toEqual({ from: "bSamb" });
    expect(cleanInvite({ p: "sleep-7", from: "  María José  ", ref: "abcd2345" })).toEqual({ p: "sleep-7", from: "María José", ref: "abcd2345" });
    expect(cleanInvite({ from: "A".repeat(60) }).from).toHaveLength(24);
  });

  it("remembers a pending invite for 30 days", () => {
    savePendingInvite({ p: "calmer-7", ref: "abcd2345" });
    expect(pendingInvite()).toEqual({ p: "calmer-7", ref: "abcd2345" });
    localStorage.setItem("rooted-invite", JSON.stringify({ p: "calmer-7", at: Date.now() - 31 * 864e5 }));
    expect(pendingInvite()).toBeNull();
    savePendingInvite({ p: "x" });
    clearPendingInvite();
    expect(pendingInvite()).toBeNull();
  });

  it("writes a friendly message", () => {
    expect(inviteMessage("7 Days to Calmer", "https://rooted.app/join?p=calmer-7")).toBe("Want to do 7 Days to Calmer with me on Rooted? A few minutes a day. https://rooted.app/join?p=calmer-7");
  });
});
