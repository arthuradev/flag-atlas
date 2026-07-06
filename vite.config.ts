/// <reference types="vitest/config" />
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  base: "/flag-atlas/",
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["brand/favicon.svg", "brand/symbol.svg", "brand/globi.svg", "icons/*.png"],
      manifest: {
        name: "Flag Atlas",
        short_name: "Flag Atlas",
        description: "Aprenda as bandeiras do mundo em treinos rápidos e divertidos.",
        lang: "pt-BR",
        display: "standalone",
        background_color: "#EAF6F8",
        theme_color: "#12303B",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "icons/icon-512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        // Pré-cache do shell, bandeiras do MVP, sons e fontes para offline-first.
        globPatterns: ["**/*.{js,css,html,svg,wav,woff2,png}"],
        globIgnores: ["flags/extras/**"],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
    passWithNoTests: true,
  },
});
