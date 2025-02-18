import { defineCollection, reference, z } from "astro:content";

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
    heroImage: z.string().optional()
  })
});

export enum ReviewType {
  Akt = "akt",
  Beauty = "beauty",
  Paare = "couples",
  Sport = "sport",
  Business = "business",
  Tanz = "tanz",
  VideoTanz = "videos/tanz"
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

const sport = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string()
  })
});

const areas = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    testimonials: z.array(reference("testimonials")).optional()
  })
});

const videos = defineCollection({
  type: "content",
  schema: z.object({
    ytid: z.string().length(11, "YouTube video ID should be 11 characters long"),
    date: z.coerce.date(),
    type: z.nativeEnum(ReviewType),
    title: z.string(),
    orientation: z.nativeEnum(OrientationEnum)
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

export const collections = {
  areas,
  einblicke,
  shootingCards,
  simple,
  sport,
  testimonials,
  videos
};
