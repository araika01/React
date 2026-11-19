import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/React/recipe-book/",

  plugins: [
    react(),

    VitePWA({
      registerType: "prompt",

      includeAssets: ["logo.png"],

      manifest: {
        name: "Recipe Book",
        short_name: "Recipes",
        description: "Find and save your favorite recipes",

        start_url: "/React/recipe-book/",
        scope: "/React/recipe-book/",

        display: "standalone",

        theme_color: "#121317",
        background_color: "#121317",

        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },

      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp}"],

        cleanupOutdatedCaches: true,

        navigateFallback: "/React/recipe-book/index.html",

        runtimeCaching: [
          // Cache-first for images
          {
            urlPattern: ({ request, url }) =>
              request.destination === "image" ||
              (url.origin === self.location.origin &&
                /\.(png|jpg|jpeg|svg|webp|gif|ico)$/i.test(url.pathname)),

            handler: "CacheFirst",

            options: {
              cacheName: "recipe-images-v1",

              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30,
                purgeOnQuotaError: true,
              },

              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },

          // Network-first for public API
          {
            urlPattern: ({ url, request }) =>
              request.method === "GET" &&
              url.origin === "https://www.themealdb.com" &&
              url.pathname.startsWith("/api/json/v1/1/"),

            handler: "NetworkFirst",

            options: {
              cacheName: "public-recipes-api-v2",

              networkTimeoutSeconds: 5,

              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24,
                purgeOnQuotaError: true,
              },

              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },

      devOptions: {
        enabled: false,
      },
    }),
  ],
});
