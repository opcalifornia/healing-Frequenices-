import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * All CSS ends up in one global bundle, so two files that define the same class name fight over it.
 * A full-screen overlay (fixed, inset 0) sharing its name with an ordinary class once covered the
 * whole Breathe page with a blank card, so overlay class names must be unique across files.
 */
function cssFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? cssFiles(p) : p.endsWith(".css") ? [p] : [];
  });
}

describe("css class collisions", () => {
  it("never reuses the class name of a full-screen overlay in another file", () => {
    const files = cssFiles("src");
    const defs = new Map<string, Set<string>>();
    const overlays = new Map<string, string>();
    for (const f of files) {
      const css = readFileSync(f, "utf8");
      for (const m of css.matchAll(/(?:^|\n)\s*\.([a-zA-Z][\w-]*)\s*\{([^}]*)\}/g)) {
        const [, name, body] = m;
        (defs.get(name) ?? defs.set(name, new Set()).get(name)!).add(f);
        if (/position:\s*fixed/.test(body) && /inset:\s*0(?:\s|;|$)/.test(body)) overlays.set(name, f);
      }
    }
    const clashes = [...overlays].filter(([name]) => (defs.get(name)?.size ?? 0) > 1).map(([name]) => `${name}: ${[...defs.get(name)!].join(", ")}`);
    expect(clashes).toEqual([]);
  });
});
