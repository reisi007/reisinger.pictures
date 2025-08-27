import type { ImageMetadata } from "astro";

export function computeKey(key: string): string {
  // Replace all forward slashes with hyphens to create a slug-like string.
  let slug = key.replaceAll("/", "-");

  // Define a list of prefixes that should be removed from the beginning of the slug.
  const prefixesToRemove: string[] = [
    "images-testimonials-",
    "images-",
    "content-einblicke-",
    "content-simple-"
  ].flatMap(e => [
    `src-${e}`,
    `-src-${e}`
  ]);

  // Iterate over the prefixes and remove the first one that matches.
  for (const prefix of prefixesToRemove) {
    if (slug.startsWith(prefix)) {
      slug = slug.substring(prefix.length);
      // Break the loop after the first match to avoid removing multiple prefixes.
      break;
    }
  }

  // Find the position of the last dot to identify the file extension.
  const lastDotIndex = slug.lastIndexOf(".");

  // If a dot is found and it's not the first character, remove the extension.
  if (lastDotIndex > 0) {
    slug = slug.substring(0, lastDotIndex);
  }

  // Return the final computed key.
  return slug;
}

export const IMAGES: Record<string, () => Promise<{
  default: ImageMetadata;
}>> = Object.fromEntries(
  Object.entries(
    import.meta.glob<{
      default: ImageMetadata
    }>("/src/**/*.{jpeg,jpg,png,gif,svg,webp}")).map(([k, v]) => [computeKey(k), v]));

export function tryGetImageByName(name?: string, root: string[] = []) {
  if (name === undefined)
    return undefined;
  name = tryGetImageNameByName(name, root);
  if (name === undefined)
    return undefined;
  const image = IMAGES[name];
  return image === undefined ? undefined : image();
}

export function getImageByName(name?: string, root: string[] = []) {
  const image = tryGetImageByName(name, root);
  if (image === undefined) {
    throw new Error(`"${name}" does not exist!`);
  }
  return image;
}


export function tryGetImageNameByName(name: string | undefined, roots: string[] = []) {
  if (name === undefined)
    return undefined;
  return roots
    .map(e => `${e}/${name}`) // relative file name
    .concat(name) // absolute file name
    .map(e => e.replaceAll("/", "-"))
    .find(e => IMAGES[e] !== undefined);
}

export function getImageNameByName(name?: string, roots: string[] = []) {
  const image = tryGetImageNameByName(name, roots);
  if (image === undefined) {
    throw new Error(`"${name}" does not exist!`);
  }
  return image;
}

export function getImageNamesByNames(names: string[], roots: string[] = []): string[] {
  return names.map(name => {
      const imageCandidate = tryGetImageNameByName(name, roots);
      if (imageCandidate === undefined)
        throw new Error(`Could not find image "${name}"!`);
      return imageCandidate;
    }
  );
}
