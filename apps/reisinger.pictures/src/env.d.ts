/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module "*.jpg" {
  import type { ImageMetadata } from "astro";
  import type { ImageWithExifMeta } from "./types/image-metadata";
  const value: ImageMetadata & ImageWithExifMeta;
  export default value;
}

declare module "*.jpeg" {
  import type { ImageMetadata } from "astro";
  import type { ImageWithExifMeta } from "./types/image-metadata";
  const value: ImageMetadata & ImageWithExifMeta;
  export default value;
}

declare module "*.png" {
  import type { ImageMetadata } from "astro";
  import type { ImageWithExifMeta } from "./types/image-metadata";
  const value: ImageMetadata & ImageWithExifMeta;
  export default value;
}

declare module "*.webp" {
  import type { ImageMetadata } from "astro";
  import type { ImageWithExifMeta } from "./types/image-metadata";
  const value: ImageMetadata & ImageWithExifMeta;
  export default value;
}

declare module "*.gif" {
  import type { ImageMetadata } from "astro";
  import type { ImageWithExifMeta } from "./types/image-metadata";
  const value: ImageMetadata & ImageWithExifMeta;
  export default value;
}

declare module "virtual:image-slug-map" {
  import type { ImageMetadata } from "astro";
  const map: Record<string, () => Promise<{ default: ImageMetadata }>>;
  export default map;
}

declare module "virtual:image-meta-index" {
  interface Exif {
    captureDate?: string;
    aperture?: string;
    focalLength?: string;
    shutter?: string;
    iso?: number;
    camera?: string;
    lens?: string;
    orientation?: "portrait" | "landscape" | "square";
  }
  interface MetaEntry {
    title?: string | null;
    darkInvert?: boolean;
    favorite?: boolean;
    metadata?: Exif | null;
    slug?: string;
    categories?: string[] | null;
  }
  const index: Record<string, MetaEntry>;
  export default index;
}
