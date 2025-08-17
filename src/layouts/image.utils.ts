import { getEntry } from "astro:content";

export async function getMetadataFromAbsoluteName(absoluteName: string) {
  const data = (await getEntry("imageMetadata", absoluteName.toLowerCase()))?.data;
  if (data?.title === "" || data?.title === undefined) {
    const message = `Image "${absoluteName}" has no alt text. Please add a title to the image metadata in the content folder.`;
    if (import.meta.env.MODE === "development")
      console.warn(message);
    else
      throw new Error(message);
  }

  return data;
}