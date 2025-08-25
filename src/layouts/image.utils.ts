import { getEntry } from "astro:content";

export function getImageMetadataSlugFromAbsoluteName(absoluteName: string) {
  let slug = absoluteName.replaceAll("/", "-");

  const prefixesToRemove = [
    "images-testimonials-",
    "images-",
    "content-einblicke-",
    "content-simple-"
  ];

  for (const prefix of prefixesToRemove) {
    if (slug.startsWith(prefix)) {
      slug = slug.substring(prefix.length);
    }
  }
  return slug;
}

export async function getMetadataFromAbsoluteName(absoluteName: string) {
  const slug = getImageMetadataSlugFromAbsoluteName(absoluteName);

  const data = (await getEntry("imageMetadata", slug))?.data;
  if (data?.title === "" || data?.title === undefined) {
    const message = `Image "${absoluteName}" has no alt text. Please add a title to the image metadata in the content folder.`;
    if (import.meta.env.MODE === "development")
      console.warn(message);
    else
      throw new Error(message);
  }

  return data;
}