import fs from "node:fs/promises";
import path from "node:path";
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import solidJs from "@astrojs/solid-js";
import imageMetaPlugin from "./vite-plugin-image-meta.mjs";

const ORIGINAL_IMAGE_FORMATS = new Set(["jpg", "jpeg", "png"]);
const ORIGINAL_IMAGE_RE = /\.[a-zA-Z0-9_\-]{8}\.(jpg|jpeg|png)$/;

function stripSourceImages() {
  return {
    name: "strip-source-images",
    hooks: {
      "astro:build:done": async ({ dir }) => {
        const assetsDir = path.join(dir.pathname, "_astro");
        let files;
        try {
          files = await fs.readdir(assetsDir);
        } catch {
          return;
        }
        let removed = 0;
        for (const file of files) {
          const ext = path.extname(file).toLowerCase();
          if (!ORIGINAL_IMAGE_FORMATS.has(ext.slice(1))) continue;
          if (!ORIGINAL_IMAGE_RE.test(file)) continue;
          await fs.unlink(path.join(assetsDir, file));
          removed++;
        }
        if (removed > 0) {
          console.log(`🧹 Removed ${removed} original image(s) from dist/_astro/`);
        }
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  image: {
    dangerouslyProcessSVG: true
  },
  redirects: { "/live": "/portal", "/privat/preise": "/preise" },
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
    plugins: [tailwindcss(), imageMetaPlugin()],
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
  integrations: [mdx(), solidJs(), stripSourceImages(), sitemap({
    serialize(item) {
      // Prioritize key pages for crawlers.
      if (!item.url.endsWith("/")) return item;
      const path = new URL(item.url).pathname;
      if (path === "/") item.priority = 1.0;
      else if (path === "/personal-branding/" || path === "/eventfotografie/") item.priority = 0.9;
      else if (path.startsWith("/shootings/")) item.priority = 0.8;
      else if (path.startsWith("/portfolio/")) item.priority = 0.7;
      else if (path.startsWith("/tfp/") || path.startsWith("/testimonials/")) item.priority = 0.7;
      else if (path === "/preise/" || path === "/ueber-mich/") item.priority = 0.8;
      else if (path === "/portal/") item.priority = 0.7;
      else if (path === "/impressum/" || path === "/dsb/" || path === "/agb/") item.priority = 0.3;
      return item;
    }
  })]
});