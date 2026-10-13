import { describe, expect, it } from "vitest";
import { ADDITIVES } from "../rooted/additivesContent";
import { functionInfo, riskKey } from "../rooted/AdditiveArt";

describe("additive page icons and wording", () => {
  it("gives every risk tag a specific icon, not the generic one", () => {
    for (const a of ADDITIVES) for (const t of a.topics) expect(riskKey(t), `${a.code}: ${t}`).not.toBe("info");
  });

  it("explains what every kind of additive is for", () => {
    for (const a of ADDITIVES) {
      const f = functionInfo(a.kind);
      expect(f.key, `${a.code}: ${a.kind}`).not.toBe("default");
      expect(f.does.length).toBeGreaterThan(20);
    }
  });

  it("keeps the plain function sentences free of alarm words", () => {
    for (const a of ADDITIVES) expect(functionInfo(a.kind).does).not.toMatch(/\b(toxic|poison|cure|calm)\b/i);
  });
});
