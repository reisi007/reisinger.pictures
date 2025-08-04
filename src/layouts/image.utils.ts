import { getEntry } from "astro:content";

export async function getAltFromAbsoluteName(absoluteName: string) {
const alt = (await getEntry("imageMetadata", absoluteName))?.data?.title ?? "";
if (alt === "") {
  const message = `Image "${absoluteName}" has no alt text. Please add a title to the image metadata in the content folder.`;
  if (import.meta.env.MODE === "development")
    console.warn(message);
  else
    throw new Error(message);
}

  return alt
}