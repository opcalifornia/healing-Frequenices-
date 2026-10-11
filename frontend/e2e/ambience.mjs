// Renders every nature soundscape in Chromium and checks it is audible,
// free of NaNs/clipping, stereo, and loops without a jump at the seam.
import { build } from "esbuild";
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";

const entry = fileURLToPath(new URL("../src/audio/ambience.ts", import.meta.url));
const bundle = await build({ entryPoints: [entry], bundle: true, write: false, format: "iife", globalName: "AMB" });

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage();
await page.setContent("<!doctype html><title>ambience test</title>");
await page.addScriptTag({ content: bundle.outputFiles[0].text });

const results = await page.evaluate(async () => {
  const out = [];
  for (const { id } of AMB.AMBIENCES) {
    const sr = 44100;
    const buf = await AMB.renderAmbience(id, sr);
    const L = buf.getChannelData(0);
    const R = buf.getChannelData(1);
    let sum = 0, peak = 0, bad = 0, diff = 0;
    for (let i = 0; i < L.length; i++) {
      if (!Number.isFinite(L[i]) || !Number.isFinite(R[i])) bad++;
      sum += L[i] * L[i];
      peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
      diff += Math.abs(L[i] - R[i]);
    }
    const loopEnd = L.length - Math.floor(sr * AMB.AMBIENCE_TAIL);
    const seam = Math.abs(L[loopEnd - 1] - L[0]);
    out.push({ id, rms: Math.sqrt(sum / L.length), peak, bad, stereo: diff / L.length, seam });
  }
  return out;
});
await browser.close();

let failed = 0;
for (const r of results) {
  const ok = r.bad === 0 && r.rms > 0.01 && r.peak < 1 && r.stereo > 0.001 && r.seam < 0.2;
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${r.id.padEnd(11)} rms ${r.rms.toFixed(3)}  peak ${r.peak.toFixed(2)}  stereo ${r.stereo.toFixed(3)}  seam ${r.seam.toFixed(3)}`);
}
process.exit(failed ? 1 : 0);
