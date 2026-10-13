// Renders 45 s of every generative music style in Chromium and checks it is
// audible, unclipped, stereo, and never drops out between chords.
import { build } from "esbuild";
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";

const entry = fileURLToPath(new URL("../src/audio/music.ts", import.meta.url));
const bundle = await build({ entryPoints: [entry], bundle: true, write: false, format: "iife", globalName: "MUS" });

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage();
await page.setContent("<!doctype html><title>music test</title>");
await page.addScriptTag({ content: bundle.outputFiles[0].text });

const results = await page.evaluate(async () => {
  const out = [];
  for (const { id } of MUS.MUSIC_STYLES) {
    const sr = 22050;
    const seconds = 45;
    const ctx = new OfflineAudioContext(2, sr * seconds, sr);
    const layer = new MUS.MusicLayer(ctx, ctx.destination, { style: id, carrier: 200, seed: 7, avoid: [200, 210] });
    layer.start(0);
    layer.fill(seconds + 5);
    const buf = await ctx.startRendering();
    const L = buf.getChannelData(0);
    const R = buf.getChannelData(1);
    let peak = 0, sum = 0, diff = 0, minWin = Infinity;
    const win = sr; // 1 s windows, skipping the first 8 s fade-in
    for (let w = 8; w < seconds; w++) {
      let ws = 0;
      for (let i = w * win; i < (w + 1) * win; i++) ws += L[i] * L[i] + R[i] * R[i];
      minWin = Math.min(minWin, Math.sqrt(ws / (2 * win)));
    }
    for (let i = 0; i < L.length; i++) {
      peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
      sum += L[i] * L[i];
      diff += Math.abs(L[i] - R[i]);
    }
    out.push({ id, rms: Math.sqrt(sum / L.length), peak, stereo: diff / L.length, minWin });
  }
  return out;
});
await browser.close();

let failed = 0;
for (const r of results) {
  const ok = r.rms > 0.005 && r.peak < 1 && r.stereo > 0.0005 && r.minWin > 0.002;
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  music ${r.id.padEnd(9)} rms ${r.rms.toFixed(4)}  peak ${r.peak.toFixed(2)}  stereo ${r.stereo.toFixed(4)}  quietest second ${r.minWin.toFixed(4)}`);
}
process.exit(failed ? 1 : 0);
