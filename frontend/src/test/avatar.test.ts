import { describe, expect, it } from "vitest";
import { isAcceptableImage, PHOTO_PX, squareCrop } from "../rooted/photo";
import { SYMBOLS, SYMBOL_IDS, symbolById } from "../rooted/symbols";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

describe("profile symbols", () => {
  it("has unique, lowercase ids that the server also accepts", () => {
    expect(new Set(SYMBOL_IDS).size).toBe(SYMBOLS.length);
    expect(SYMBOLS.length).toBeGreaterThanOrEqual(16);
    const here = dirname(fileURLToPath(import.meta.url));
    const server = readFileSync(join(here, "../../../backend/app/models.py"), "utf8");
    const list = server.match(/SYMBOLS = \{([^}]+)\}/)![1].match(/"([a-z]+)"/g)!.map((s) => s.replace(/"/g, ""));
    expect([...list].sort()).toEqual([...SYMBOL_IDS].sort());
    expect(symbolById("tree")?.label).toBe("Tree");
    expect(symbolById("nope")).toBeUndefined();
    expect(symbolById(null)).toBeUndefined();
  });
});

describe("photo processing helpers", () => {
  it("crops a centered square from landscape, portrait and square images", () => {
    expect(squareCrop(4000, 3000)).toEqual({ sx: 500, sy: 0, size: 3000 });
    expect(squareCrop(3000, 4000)).toEqual({ sx: 0, sy: 500, size: 3000 });
    expect(squareCrop(500, 500)).toEqual({ sx: 0, sy: 0, size: 500 });
    expect(PHOTO_PX).toBe(256);
  });

  it("accepts photos and rejects other files and huge ones", () => {
    expect(isAcceptableImage({ type: "image/jpeg", size: 2e6 })).toBeNull();
    expect(isAcceptableImage({ type: "image/png", size: 2e6 })).toBeNull();
    expect(isAcceptableImage({ type: "application/pdf", size: 1e3 })).toMatch(/photo/i);
    expect(isAcceptableImage({ type: "image/svg+xml", size: 1e3 })).toMatch(/photo/i); // SVG can carry scripts
    expect(isAcceptableImage({ type: "image/jpeg", size: 20e6 })).toMatch(/too large/i);
  });
});
