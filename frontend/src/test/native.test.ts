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
import type { HealthEvent } from "../store/calendar";
import { haptic, isNative, notificationId, onNotificationTap, scheduleEventNotifications, upcomingOccurrences } from "../rooted/native";

const ev = (p: Partial<HealthEvent>): HealthEvent => ({ id: "e1", title: "Walk", kind: "move", date: "2026-10-12", time: "12:45", minutes: 10, repeat: "none", ...p });

// 2026-10-12 is a Monday.
describe("upcomingOccurrences", () => {
  it("fires 5 minutes before the event, in local time", () => {
    const [o] = upcomingOccurrences([ev({ to: "/move" })], "2026-10-12", 14, 60);
    expect(o.date).toBe("2026-10-12");
    expect(o.at).toEqual(new Date(2026, 9, 12, 12, 40));
    expect(o.event.to).toBe("/move");
  });

  it("rolls back across midnight for early events", () => {
    const [o] = upcomingOccurrences([ev({ date: "2026-10-13", time: "00:02" })], "2026-10-12", 14, 60);
    expect(o.at).toEqual(new Date(2026, 9, 12, 23, 57));
  });

  it("gives stable, distinct, positive 32-bit ids per event and date", () => {
    const a = upcomingOccurrences([ev({ repeat: "daily" })], "2026-10-12", 14, 60);
    const b = upcomingOccurrences([ev({ repeat: "daily" })], "2026-10-12", 14, 60);
    expect(a.map((o) => o.id)).toEqual(b.map((o) => o.id));
    expect(new Set(a.map((o) => o.id)).size).toBe(14);
    for (const o of a) {
      expect(Number.isInteger(o.id)).toBe(true);
      expect(o.id).toBeGreaterThan(0);
      expect(o.id).toBeLessThanOrEqual(0x7fffffff);
      expect(o.id).toBe(notificationId("e1", o.date));
    }
    expect(notificationId("e1", "2026-10-12")).not.toBe(notificationId("e2", "2026-10-12"));
  });

  it("leaves out skipped and done dates", () => {
    const out = upcomingOccurrences([ev({ repeat: "daily", skip: { "2026-10-13": true }, done: { "2026-10-14": true } })], "2026-10-12", 4, 60);
    expect(out.map((o) => o.date)).toEqual(["2026-10-12", "2026-10-15"]);
  });

  it("respects recurrence over the window", () => {
    expect(upcomingOccurrences([ev({ repeat: "weekdays" })], "2026-10-12", 14, 60)).toHaveLength(10);
    expect(upcomingOccurrences([ev({ repeat: "weekly" })], "2026-10-12", 14, 60)).toHaveLength(2);
    expect(upcomingOccurrences([ev({ date: "2026-11-30" })], "2026-10-12", 14, 60)).toHaveLength(0);
  });

  it("sorts across events by time and caps the count", () => {
    const events = [
      ev({ id: "late", time: "20:00", repeat: "daily" }),
      ev({ id: "early", time: "07:00", repeat: "daily" }),
      ev({ id: "mid", time: "12:00", repeat: "daily" }),
      ev({ id: "x1", time: "09:00", repeat: "daily" }),
      ev({ id: "x2", time: "15:00", repeat: "daily" }),
    ];
    const all = upcomingOccurrences(events, "2026-10-12", 14, 1000);
    expect(all).toHaveLength(70);
    for (let i = 1; i < all.length; i++) expect(all[i].at.getTime()).toBeGreaterThanOrEqual(all[i - 1].at.getTime());
    expect(all.slice(0, 5).map((o) => o.event.id)).toEqual(["early", "x1", "mid", "x2", "late"]);
    const capped = upcomingOccurrences(events, "2026-10-12", 14, 60);
    expect(capped).toHaveLength(60);
    expect(capped).toEqual(all.slice(0, 60));
  });

  it("drops times that have already passed", () => {
    const out = upcomingOccurrences([ev({ repeat: "daily" })], "2026-10-12", 2, 60, new Date(2026, 9, 12, 12, 41));
    expect(out.map((o) => o.date)).toEqual(["2026-10-13"]);
  });
});

describe("web fallbacks", () => {
  it("are no-ops off-device", async () => {
    expect(isNative()).toBe(false);
    expect(() => haptic("light")).not.toThrow();
    expect(await scheduleEventNotifications([ev({})])).toBe(0);
    const off = onNotificationTap(() => undefined);
    expect(typeof off).toBe("function");
    off();
  });
});
