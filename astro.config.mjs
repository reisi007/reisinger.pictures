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
  redirects: { "/live": "/portal", "/preise": { status: 302, destination: "/privat/preise" } },
  site: "https://reisinger.pictures",
  cacheDir: "./.cache",
  vite: { plugins: [tailwindcss()] },
  integrations: [mdx(), solidJs(), sitemap({
    filter(page) {
      return !excludedPages.some(pagePath => page.endsWith(pagePath));
    }
  })]
});