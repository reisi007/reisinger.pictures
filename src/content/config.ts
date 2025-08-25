import { defineCollection, reference, z } from "astro:content";
import { file, glob } from "astro/loaders";


const einblicke = defineCollection({
  type: "content",
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    // Transform string to Date object
    pubDate: z.coerce.date(),
    updated: z.coerce.date().optional(),
    heroImage: z.string()
  })
});

const einblickeOverviews = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string()
  })
});

export enum ReviewType {
  Akt = "akt",
  Beauty = "beauty",
  Paare = "couples",
  Sport = "sport",
  Business = "business",
  Tanz = "tanz"
}

export enum OrientationEnum {
  Horizontal = "horizontal",
  Vertical = "vertical",
}

const testimonials = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    type: z.nativeEnum(ReviewType),
    date: z.coerce.date(),
    rating: z.number().optional(),
    source: z.string().url("Must be a valid URL").optional()
  })
});

const areas = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    priority: z.number().optional().default(9999),
    testimonials: z.array(reference("testimonials")).optional(),
    images: z.array(z.string()),
    heroImage: z.string().optional()
  })
});

const simple = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    showContact: z.boolean().optional(),
    index: z.boolean().optional(),
    heroImage: z.string().optional(),
    pubDate: z.coerce.date().optional(),
    updated: z.coerce.date().optional()
  })
});

const agbs = defineCollection({
  type: "content",
  schema: z.object({
    pubDate: z.coerce.date()
  })
});

const imageMetadata = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "./src" }),
  schema: z.object({
    title: z.string().nullish(),
    darkInvert: z.boolean().default(false),
    metadata: z.object({
      captureDate: z.coerce.date().optional(),
      aperture: z.string().optional(),
      focalLength: z.string().optional(),
      shutter: z.string().optional(),
      iso: z.number().optional(),
      camera: z.string().optional(),
      lens: z.string().optional()
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

export const collections = {
  agbs,
  areas,
  einblicke,
  einblickeOverviews,
  simple,
  testimonials,
  imageMetadata,
  categories
};
