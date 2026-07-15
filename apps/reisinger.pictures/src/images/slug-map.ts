import type { ImageMetadata } from "astro";
import slugMap from "virtual:image-slug-map";

export const IMAGES = slugMap;

export function tryGetImage(name: string | undefined) {
  if (name === undefined) return undefined;
  return slugMap[name];
}

export async function getImage(name: string) {
  const image = tryGetImage(name);
  if (image === undefined) {
    throw new Error(`Image "${name}" does not exist!`);
  }
  return await image();
}

export function filterInvalidImageName(name?: string) {
  if (name === undefined) return undefined;
  return tryGetImage(name) !== undefined ? name : undefined;
}

export type ImageModule = { default: ImageMetadata };
