import { describe, expect, it } from "vitest";
import { dayTimes, guessPlace, sunNow, sunPosition } from "../rooted/sun";

describe("sun position", () => {
  it("puts the sun overhead at the equator on the March equinox at solar noon", () => {
    const p = sunPosition(new Date("2025-03-20T12:00:00Z"), 0, 0);
    expect(p.altitude).toBeGreaterThan(85);
    expect(Math.abs(p.subLat)).toBeLessThan(1);
  });
  it("matches London's sunrise on the June solstice to within a few minutes", () => {
    const t = dayTimes(new Date("2025-06-21T12:00:00Z"), 51.5, -0.12);
    const rise = new Date(t.prevRise!);
    // Real sunrise about 03:43 UTC.
    expect(Math.abs(rise.getUTCHours() * 60 + rise.getUTCMinutes() - (3 * 60 + 43))).toBeLessThan(8);
  });
  it("sees midnight sun and polar night", () => {
    expect(sunNow(new Date("2025-06-21T00:00:00Z"), { lat: 78, lon: 15 }).phase).toBe("polar-day");
    expect(sunNow(new Date("2025-12-21T12:00:00Z"), { lat: 78, lon: 15 }).phase).toBe("polar-night");
  });
  it("calls the first hours after sunrise the morning window", () => {
    const rise = dayTimes(new Date("2025-06-21T12:00:00Z"), 51.5, -0.12).prevRise!;
    expect(sunNow(new Date(rise + 3600000), { lat: 51.5, lon: -0.12 }).morningWindow).toBe(true);
    expect(sunNow(new Date(rise + 8 * 3600000), { lat: 51.5, lon: -0.12 }).morningWindow).toBe(false);
  });
  it("doesn't call early afternoon morning", () => {
    const rise = dayTimes(new Date("2025-06-21T12:00:00Z"), 34.05, -118.24).prevRise!;
    expect(sunNow(new Date(rise + 7 * 3600000), { lat: 34.05, lon: -118.24 }).phase).not.toBe("morning");
  });
  it("guesses a place from the time zone", () => {
    const g = guessPlace();
    expect(g.lon).toBeGreaterThanOrEqual(-180);
    expect(g.source).toBe("zone");
  });
});
