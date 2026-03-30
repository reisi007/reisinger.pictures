import { file, glob } from "astro/loaders";
import { defineCollection, reference } from "astro:content";
import { z } from "astro/zod";

const einblicke = defineCollection({
  // Verwende einen puren String-Glob: **/[^_]*.{md,mdx} schließt alle Dateien aus, die mit _ beginnen
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/einblicke" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    heroImage: z.string()
  })
});

const einblickeOverviews = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/einblickeOverviews" }),
  schema: z.object({
    title: z.string()
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
    type: z.enum(ReviewType),
    date: z.coerce.date(),
    rating: z.number().optional(),
    source: z.url("Must be a valid URL").optional(),
    large: z.string().optional()
  })
});

const areas = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/areas" }),
  schema: z.object({
    name: z.string(),
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

const imageMetadata = defineCollection({
  loader: glob({ pattern: "**/[^_]*.yaml", base: "./src" }),
  schema: z.object({
    title: z.string().nullish(),
    darkInvert: z.boolean().default(false),
    favorite: z.boolean().default(false),
    metadata: z.object({
      captureDate: z.coerce.date().optional(),
      aperture: z.string().optional(),
      focalLength: z.string().optional(),
      shutter: z.string().optional(),
      iso: z.coerce.number().optional(),
      camera: z.string().optional(),
      lens: z.string().optional(),
      orientation: z.enum(["portrait", "landscape", "square"]).optional()
    }).optional().nullable(),
    categories: z.array(z.string()).optional().nullable()
  })
});

const categories = defineCollection({
  loader: file("src/content/categories.json"),
  schema: z.object({
    name: z.string()
  })
});

const courses = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/courses" }),
  schema: z.object({
    title: z.string(),
    short: z.string(),
    description: z.string().optional(),
    order: z.number().default(99),
    price: z.string(),
    duration: z.string(),
    heroImage: z.string()
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
  courses,
  dsb,
  einblicke,
  einblickeOverviews,
  imageMetadata,
  simple,
  testimonialSummary,
  testimonials,
  tfp
};