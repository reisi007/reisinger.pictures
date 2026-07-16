import type { ImageMetadata } from "astro";
import slugMap from "virtual:image-slug-map";

export const IMAGES = slugMap;
const isBuild = import.meta.env.PROD;

export function tryGetImage(name: string | undefined) {
  if (name === undefined) return undefined;
  const entry = slugMap[name];
  if (isBuild) return entry !== undefined ? entry : undefined;
  return entry;
}

export async function getImage(name: string) {
  const image = tryGetImage(name);
  if (image === undefined) {
    throw new Error(`Image "${name}" does not exist!`);
  }
  if (isBuild) {
    throw new Error(
      `slug-map getImage("${name}") called during production build. ` +
      `Use the CDN manifest (getManifestImage) instead.`
    );
  }
  return await image();
}

export function filterInvalidImageName(name?: string) {
  if (name === undefined) return undefined;
  return tryGetImage(name) !== undefined ? name : undefined;
}

export type ImageModule = { default: ImageMetadata };
