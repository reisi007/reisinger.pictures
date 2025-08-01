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

export function tryGetImageImportNameByPossiblyRelativeName(possiblyRelativeName?: string) {
  if (!possiblyRelativeName) {
    return undefined;
  }
  try {
    const absoluteName = getImageImportNameByFolder([], [possiblyRelativeName])[0];

    const doesImageExist = IMAGES[absoluteName] !== undefined;
    return doesImageExist ? absoluteName : undefined;
  } catch (e) {
    return undefined;
  }
}

export function tryGetImageByAbsoluteName(name?: string) {
  if (name === undefined)
    return undefined;
  const image = IMAGES[name];
  return image === undefined ? undefined : image();
}

export function getImageImportNameByPossiblyRelativeName(name?: string) {
  const image = tryGetImageImportNameByPossiblyRelativeName(name);
  if (image === undefined) {
    throw new Error(`"${name}" does not exist`);
  }
  return image;
}

const DEFAULT_FOLDER_NAMES = ["images/testimonials", "content/einblicke", "content/simple"];

export function getImageImportNameByFolder(root: string[], imageNames: string[]): string[] {
  return imageNames.map(name => {
      const imageCandidate = [
        ...DEFAULT_FOLDER_NAMES, // relative from default fdlder names
        ...root, // absolute root folders
        ...DEFAULT_FOLDER_NAMES.flatMap(dn => root.map(e => `${dn}/${e}`)) // relative root folders
      ]
        .map(e => `${e}/${name}`) // relative file name
        .concat(name) // absolute file name
        .find(e => IMAGES[e] !== undefined);
      if (imageCandidate === undefined)
        throw new Error(`Could not find image "${name}"!`);
      return imageCandidate;
    }
  );
}
