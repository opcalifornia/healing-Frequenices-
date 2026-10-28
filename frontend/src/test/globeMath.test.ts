import { describe, expect, it } from "vitest";
import { geoOrthographic } from "d3-geo";
import { equirectUV, mipLevel, orthoInverse } from "../rooted/globeMath";

describe("globe maths", () => {
  it("matches d3's orthographic projection for points all over the disc and any view", () => {
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < 300; i++) {
      const lon0 = rnd() * 360 - 180;
      const lat0 = rnd() * 150 - 75;
      const R = 200;
      const proj = geoOrthographic().translate([0, 0]).scale(R).rotate([-lon0, -lat0]).clipAngle(90);
      const x = rnd() * 1.9 - 0.95;
      const y = rnd() * 1.9 - 0.95;
      if (Math.hypot(x, y) > 0.99) continue;
      const ours = orthoInverse(x, y, lon0, lat0)!;
      // d3 has y pointing down on screen
      const theirs = proj.invert!([x * R, -y * R])!;
      const dLon = Math.abs(((ours[0] - theirs[0] + 540) % 360) - 180);
      expect(dLon, `lon at ${x.toFixed(2)},${y.toFixed(2)} from ${lon0.toFixed(0)},${lat0.toFixed(0)}`).toBeLessThan(1e-6);
      expect(Math.abs(ours[1] - theirs[1])).toBeLessThan(1e-6);
    }
  });
  it("puts the view centre at the centre and returns nothing outside the globe", () => {
    expect(orthoInverse(0, 0, 40, 25)).toEqual([40, 25]);
    expect(orthoInverse(1.2, 0, 0, 0)).toBeNull();
  });
  it("maps longitude and latitude to picture coordinates, wrapping at the date line", () => {
    expect(equirectUV(-180, 90)).toEqual([0, 0]);
    expect(equirectUV(0, 0)).toEqual([0.5, 0.5]);
    expect(equirectUV(180, -90)[1]).toBe(1);
    expect(equirectUV(190, 0)[0]).toBeCloseTo(equirectUV(-170, 0)[0], 10);
  });
  it("uses a smoother, smaller picture level when zoomed out or near the limb", () => {
    const near = mipLevel(4096, 260, 1, 0);
    const out = mipLevel(4096, 120, 1, 0);
    const limb = mipLevel(4096, 260, 0.1, 0);
    expect(out).toBeGreaterThan(near);
    expect(limb).toBeGreaterThan(near);
    expect(mipLevel(4096, 5000, 1, 0)).toBe(0);
  });
});
