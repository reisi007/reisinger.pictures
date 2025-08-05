import type { ImageMetadata } from "astro";

function computeKey(key: string) {
  let k = key.substring(5);
  k = k.substring(0, k.indexOf("."));
  return k;
}

const IMAGES: Record<string, () => Promise<{
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

const DEFAULT_FOLDER_NAMES = ["images/testimonials", "content/einblicke", "content/simple", "images"];

export function tryGetImageNameByName(name: string | undefined, roots: string[] = []) {
  if (name === undefined)
    return undefined;
  return [
    ...DEFAULT_FOLDER_NAMES, // relative from default fdlder names
    ...roots, // absolute root folders
    ...DEFAULT_FOLDER_NAMES.flatMap(dn => roots.map(e => `${dn}/${e}`)) // relative root folders
  ]
    .map(e => `${e}/${name}`) // relative file name
    .concat(name) // absolute file name
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
