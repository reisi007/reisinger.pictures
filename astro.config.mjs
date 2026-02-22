import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

const excludedPages = [
  "preise/ogs/"
];

// https://astro.build/config
export default defineConfig({
  site: "https://reisinger.pictures",
  cacheDir: "./.cache",
  vite: { plugins: [tailwindcss()] },
  integrations: [mdx(), sitemap({
    filter(page) {
      return !excludedPages.some(pagePath => page.endsWith(pagePath));
    }
  })]
});
