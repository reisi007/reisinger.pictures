import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";

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
    video: reference("videos").optional(),
    source: z.string().url("Must be a valid URL").optional()
  })
});

const areas = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    priority: z.number().optional().default(9999),
    testimonials: z.array(reference("testimonials")).optional(),
    images: z.array(z.string())
  })
});

const simple = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    showContact: z.boolean().optional(),
    index: z.boolean().optional()
  })
});

const shootingCards = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    shutterSpeed: z.string(),
    fStop: z.string(),
    iso: z.string().default("AUTO"),
    expComp: z.string().optional()
  })
});

const imageMetadata = defineCollection({
  loader: glob({pattern: "**/*.yaml", base: "./src"}),
  schema: z.object({
    title: z.string().nullish(),
  })
})

export const collections = {
  areas,
  einblicke,
  einblickeOverviews,
  shootingCards,
  simple,
  testimonials,
  imageMetadata
};
