import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import matomo from "astro-matomo";

// https://astro.build/config
export default defineConfig({
  site: "https://reisinger.pictures",
  cacheDir: "./.cache",
  vite: { plugins: [tailwindcss()] },
  integrations: [mdx(), sitemap(), matomo({
    enabled: import.meta.env.PROD,
    host: "https://analytics.reisinger.pictures/",
    siteId: 1,
    viewTransition: true
  })]
});
