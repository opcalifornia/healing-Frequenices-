import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// `vite build --mode artifact` makes a single-file preview build (hash routing,
// everything inlined, no service worker) for hosting as a claude.ai artifact.
// The PWA (manifest, icons, sw.js) is hand-written in public/ and registered
// from src/pwa.ts, which skips registration in the artifact build.
export default defineConfig(({ mode }) => {
  const artifact = mode === "artifact";
  return {
  base: artifact ? "./" : "/",
  define: { "import.meta.env.VITE_HASH_ROUTER": JSON.stringify(artifact ? "1" : "") },
  build: artifact
    ? { outDir: "dist-artifact", assetsInlineLimit: 100_000_000, cssCodeSplit: false, rollupOptions: { output: { inlineDynamicImports: true } } }
    : {},
  plugins: [
    react(),
  ],
  };
});
