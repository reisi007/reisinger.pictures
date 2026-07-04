import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const simple = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/simple" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    heroImage: z.string().optional(),
    noIndex: z.boolean().default(false),
  })
});

export const collections = { simple };
