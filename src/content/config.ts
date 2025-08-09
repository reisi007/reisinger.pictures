import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";

const einblicke = defineCollection({
  //loader: glob({pattern: "**/*.mdx", base: "./src/content/einblicke"}),
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
    heroImage: z.string().optional(),
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
    updated: z.coerce.date().optional(),
  })
});

const imageMetadata = defineCollection({
  loader: glob({pattern: "**/*.yaml", base: "./src"}),
  schema: z.object({
    title: z.string().nullish(),
    darkInvert: z.boolean().default(false)
  })
})

export const collections = {
  areas,
  einblicke,
  einblickeOverviews,
  simple,
  testimonials,
  imageMetadata
};
