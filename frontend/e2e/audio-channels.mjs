// Renders the real engine with OfflineAudioContext in Chromium, then measures
// each channel's frequency from the samples and checks right - left === beat.
//   npm run test:audio   (needs a Playwright Chromium: `npx playwright install chromium`)
import { build } from "esbuild";
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";

const entry = fileURLToPath(new URL("../src/audio/engine.ts", import.meta.url));
const bundle = await build({ entryPoints: [entry], bundle: true, write: false, format: "iife", globalName: "HF" });
const code = bundle.outputFiles[0].text;

const CASES = [
  [200, 10],
  [136.1, 2.5],
  [100, 0.5],
  [400, 40],
  [200, 7.83],
];
const TOLERANCE_HZ = 0.01;

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage();
await page.setContent("<!doctype html><title>audio test</title>");
await page.addScriptTag({ content: code });

const results = await page.evaluate(async (cases) => {
  // Frequency from linearly interpolated upward zero crossings: sub-sample accurate for pure tones.
  const measure = (data, sr, from) => {
    const xs = [];
    for (let i = from + 1; i < data.length; i++) {
      if (data[i - 1] < 0 && data[i] >= 0) xs.push(i - 1 + data[i - 1] / (data[i - 1] - data[i]));
    }
    return ((xs.length - 1) * sr) / (xs[xs.length - 1] - xs[0]);
  };
  const out = [];
  for (const [carrier, beat] of cases) {
    const sr = 48000;
    const ctx = new OfflineAudioContext(2, sr * 3, sr);
    const engine = new HF.BinauralEngine(() => ctx);
    engine.start({ carrier, beat, noise: null, solfeggio: null, isochronic: false, mix: HF.DEFAULT_MIX, volume: 1 }, 0.05);
    const buf = await ctx.startRendering();
    const left = measure(buf.getChannelData(0), sr, sr / 2);
    const right = measure(buf.getChannelData(1), sr, sr / 2);
    out.push({ carrier, beat, left, right, diff: right - left });
  }
  return out;
}, CASES);
await browser.close();

let failed = 0;
for (const r of results) {
  const ok = Math.abs(r.diff - r.beat) < TOLERANCE_HZ && Math.abs(r.left - r.carrier) < TOLERANCE_HZ;
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  carrier ${r.carrier} Hz, beat ${r.beat} Hz -> L ${r.left.toFixed(4)} Hz, R ${r.right.toFixed(4)} Hz, R-L ${r.diff.toFixed(4)} Hz`);
}
process.exit(failed ? 1 : 0);
