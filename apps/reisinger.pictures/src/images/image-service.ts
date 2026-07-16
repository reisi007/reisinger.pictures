import type { ImageMetadata } from "astro";
import { resolveCdnImage } from "./image-manifest";
import type { CdnImageInfo } from "./image-manifest";
import { getImage as getSlugMapImage } from "./slug-map";

export type ImageInfo = CdnImageInfo;

export async function loadImage(slug: string): Promise<ImageInfo> {
  if (import.meta.env.PROD) {
    return resolveCdnImage(slug);
  }
  const module = await getSlugMapImage(slug);
  const img: ImageMetadata = module.default;
  return {
    src: img.src,
    width: img.width,
    height: img.height,
    format: img.format ?? "jpg",
  };
}
