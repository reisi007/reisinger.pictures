import imageMetaIndex from "virtual:image-meta-index";

import type { ExifData, YamlMetaData } from "../types/image-metadata";

export async function getMetadataForImageSlug(
  imageSlug: string
): Promise<YamlMetaData | undefined> {
  const data = imageMetaIndex[imageSlug] as YamlMetaData | undefined;
  if (!data || data.title === "" || data.title === undefined) {
    const message = `Image "${imageSlug}" has no alt text. Please add a title to the image metadata in the content folder.`;
    if (import.meta.env.MODE === "development") {
      console.warn(message);
    }
    return undefined;
  }

  return data;
}

export function formatEquipment(metadata: ExifData | null | undefined): string | undefined {
  return metadata
    ? [metadata.camera, metadata.lens].filter(Boolean).join(" \u00b7 ")
    : undefined;
}

export function formatExifCompact(metadata: ExifData | null | undefined): string | undefined {
  if (!metadata) return undefined;
  const isoLabel = metadata.iso != null ? `ISO ${metadata.iso}` : undefined;
  return [metadata.focalLength, metadata.aperture, metadata.shutter && `${metadata.shutter}s`, isoLabel]
    .filter(Boolean).join(" \u00b7 ");
}
