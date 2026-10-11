import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// `vite build --mode artifact` makes a single-file preview build (hash routing,
// everything inlined, no service worker) for hosting as a claude.ai artifact.
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
    !artifact && VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "icons/*.png"],
      manifest: {
        name: "Healing Frequencies",
        short_name: "Frequencies",
        description: "Binaural beats and frequency sessions that may support relaxation, focus, or sleep.",
        theme_color: "#000000",
        background_color: "#000000",
        display: "standalone",
        orientation: "any",
        start_url: "/",
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        navigateFallback: "/index.html",
        globPatterns: ["**/*.{js,css,html,svg,png,woff2,json}"],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith("/api/catalog"),
            handler: "StaleWhileRevalidate",
            options: { cacheName: "catalog" },
          },
        ],
      },
    }),
  ],
  };
});
