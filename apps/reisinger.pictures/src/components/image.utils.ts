import { getEntry } from "astro:content";

export async function getMetadataForImageSlug(imageSlug: string) {
  const data = (await getEntry("imageMetadata", imageSlug))?.data;
  if (data?.title === "" || data?.title === undefined) {
    const message = `Image "${imageSlug}" has no alt text. Please add a title to the image metadata in the content folder.`;
    if (import.meta.env.MODE === "development")
      console.warn(message);
    else
      throw new Error(message);
  }

  return data;
}