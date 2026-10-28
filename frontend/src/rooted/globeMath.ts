/**
 * Orthographic globe maths shared by the picture shader and the tests.
 * Matches d3-geo's geoOrthographic().rotate([-lon0, -lat0]): the point (lon0, lat0) sits at the centre of the view.
 * Screen coordinates are in units of the globe's radius, x to the right and y UP.
 */
const TAU = Math.PI * 2;

/** Longitude and latitude (degrees) under a point of the visible disc, or null outside the globe. */
export function orthoInverse(x: number, y: number, lon0Deg: number, lat0Deg: number): [number, number] | null {
  const rho = Math.hypot(x, y);
  if (rho > 1) return null;
  const lon0 = (lon0Deg * Math.PI) / 180;
  const lat0 = (lat0Deg * Math.PI) / 180;
  const c = Math.asin(rho);
  const sinc = Math.sin(c);
  const cosc = Math.cos(c);
  const lat = Math.asin(cosc * Math.sin(lat0) + (rho > 0 ? (y * sinc * Math.cos(lat0)) / rho : 0));
  const lon = lon0 + Math.atan2(x * sinc, rho * Math.cos(lat0) * cosc - y * Math.sin(lat0) * sinc);
  const deg = (r: number) => (r * 180) / Math.PI;
  return [((deg(lon) + 540) % 360) - 180, deg(lat)];
}

/** Texture coordinates for a longitude and latitude in an equirectangular picture whose top row is the north pole. */
export function equirectUV(lonDeg: number, latDeg: number): [number, number] {
  const u = (((lonDeg + 180) / 360) % 1 + 1) % 1;
  return [u, (90 - latDeg) / 180];
}

/** How many texture rows to skip (mip level) so a screen pixel covers about one texel, at distance `cosc` from the limb. */
export function mipLevel(texWidth: number, radiusPx: number, cosc: number, latDeg: number): number {
  const pixelAngle = 1 / (radiusPx * Math.max(0.05, cosc));
  const stretch = Math.min(8, 1 / Math.max(0.12, Math.cos((latDeg * Math.PI) / 180)));
  const texelsPerPixel = ((texWidth * pixelAngle) / TAU) * stretch;
  return Math.max(0, Math.log2(Math.max(1, texelsPerPixel)));
}
