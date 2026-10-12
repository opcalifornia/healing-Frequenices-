// Wraps the single-file build into a standalone site for a public preview
// (for example GitHub Pages):  npm run build:preview  ->  dist-preview/
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const root = new URL("../", import.meta.url).pathname;
let body = readFileSync(`${root}dist-artifact/healing-frequencies.html`, "utf8");
// The download helper checks for a host bridge that only exists in the hosted preview; rename it here.
body = body.replace(/window\.claude/g, "window.__appHost").replace(/<meta name="theme-color"[^>]*>/, "").replace(/<link rel="icon"[^>]*>/, "");
const icon = readFileSync(`${root}public/icons/rooted.svg`).toString("base64");
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0b0d0a">
<meta name="description" content="Rooted: small, proven habits for body and mind, with the evidence shown.">
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,${icon}">
<style>html,body{margin:0;background:#0b0d0a}</style>
</head>
<body>
${body}
</body>
</html>
`;
mkdirSync(`${root}dist-preview`, { recursive: true });
writeFileSync(`${root}dist-preview/index.html`, html);
writeFileSync(`${root}dist-preview/.nojekyll`, "");
console.log(`Wrote dist-preview/index.html (${(html.length / 1024).toFixed(0)} KB)`);
