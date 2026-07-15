import { file, glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection, reference } from "astro:content";

const portfolio = defineCollection({
  // Verwende einen puren String-Glob: **/[^_]*.{md,mdx} schließt alle Dateien aus, die mit _ beginnen
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/portfolio" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    heroImage: z.string()
  })
});

const portfolioOverviews = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/portfolioOverviews" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional()
  })
});
export enum ReviewType {
  Akt = "akt",
  Beauty = "beauty",
  Paare = "couples",
  Sport = "sport",
}

export enum OrientationEnum {
  Horizontal = "horizontal",
  Vertical = "vertical",
}

const testimonials = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/testimonials" }),
  schema: z.object({
    name: z.string(),
    role: z.string().optional(),
    layout: z.enum(["default", "quote"]).default("default"),
    type: z.enum(ReviewType),
    date: z.coerce.date(),
    rating: z.number().optional(),
    source: z.url("Must be a valid URL").optional(),
    large: z.string().optional(),
    small: z.string().optional(),
    imageFit: z.enum(["cover", "contain"]).default("cover")
  })
});

const areas = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/areas" }),
  schema: z.object({
    name: z.string(),
    description: z.string().optional(),
    priority: z.number().optional().default(9999),
    testimonials: z.array(reference("testimonials")).optional(),
    images: z.array(z.string()),
    heroImage: z.string().optional()
  })
});

const simple = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/simple" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    showContact: z.boolean().optional(),
    showToc: z.boolean().default(true),
    index: z.boolean().optional(),
    heroImage: z.string().optional(),
    date: z.coerce.date().optional(),
    updated: z.coerce.date().optional()
  })
});

const agb = defineCollection({
  loader: file("src/content/agb.json"),
  schema: z.object({
    validFrom: z.coerce.date(),
    filename: z.string()
  })
});

const testimonialSummary = defineCollection({
  loader: file("src/content/testimonialSummary.json"),
  schema: z.object({
    summary: z.string(),
    reviewCount: z.number()
  })
});

const dsb = defineCollection({
  loader: file("src/content/dsb.json"),
  schema: z.object({
    validFrom: z.coerce.date(),
    filename: z.string()
  })
});

const categories = defineCollection({
  loader: file("src/content/categories.json"),
  schema: z.object({
    name: z.string()
  })
});

const tfp = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/tfp" }),
  schema: z.object({
    title: z.string(),
    priority: z.number(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    heroImage: z.string().optional()
  })
});

export const collections = {
  agb,
  areas,
  categories,
  dsb,
  portfolio,
  portfolioOverviews,
  simple,
  testimonialSummary,
  testimonials,
  tfp
};