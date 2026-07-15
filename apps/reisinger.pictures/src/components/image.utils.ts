import type { YamlMetaData } from "../types/image-metadata";
import imageMetaIndex from "virtual:image-meta-index";

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
