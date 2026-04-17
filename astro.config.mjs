import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import solidJs from "@astrojs/solid-js";

const excludedPages = [
  "privat/preise/ogs/"
];

// https://astro.build/config
export default defineConfig({
  redirects: { "/live": "/portal" },
  site: "https://reisinger.pictures",
  cacheDir: "./.cache",
  devToolbar: {
    enabled: false
  },
  build: {
    concurrency: 4
  },
  vite: {
    cacheDir: ".cache/.vite",
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        "astro/virtual-modules/transitions-router.js",
        "astro/virtual-modules/transitions-types.js",
        "astro/virtual-modules/transitions-events.js",
        "astro/virtual-modules/transitions-swap-functions.js",
        "photoswipe/lightbox",
        "photoswipe"
      ]
    }
  },
  integrations: [mdx(), solidJs(), sitemap({
    filter(page) {
      return !excludedPages.some(pagePath => page.endsWith(pagePath));
    }
  })]
});