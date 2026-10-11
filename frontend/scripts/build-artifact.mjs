// Packs `vite build --mode artifact` output into one self-contained HTML page
// (no <html>/<head>/<body>: the artifact host adds its own skeleton).
//   npm run build:artifact  ->  dist-artifact/healing-frequencies.html
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = new URL("../dist-artifact/", import.meta.url).pathname;
const assets = readdirSync(join(dir, "assets"));
const js = readFileSync(join(dir, "assets", assets.find((f) => f.endsWith(".js"))), "utf8");
const css = readFileSync(join(dir, "assets", assets.find((f) => f.endsWith(".css"))), "utf8");
const favicon = Buffer.from(readFileSync(join(dir, "favicon.svg"))).toString("base64");

// Keep the inline script from closing early.
const safeJs = js.replace(/<\/script/gi, "<\\/script");

const page = `<title>Healing Frequencies</title>
<meta name="theme-color" content="#000000">
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,${favicon}">
<style>${css}</style>
<div id="root"></div>
<script type="module">${safeJs}</script>
`;
writeFileSync(join(dir, "healing-frequencies.html"), page);
console.log(`Wrote dist-artifact/healing-frequencies.html (${(page.length / 1024).toFixed(0)} KB)`);
