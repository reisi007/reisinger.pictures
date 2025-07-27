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

export function tryGetImageImportByName(name?: string) {
  if (!name) {
    return undefined;
  }
  const image = IMAGES[name];
  return image ? image() : undefined;
}

export async function getImageImportByName(name?: string) {
  const image = await tryGetImageImportByName(name);
  if (!image) {
    throw new Error(`"${name}" does not exist`);
  }

  return image;
}


export function getImageImportNameByFolder(root: string, sortedImages: string[]) {
  const folderPicture = Object.keys(IMAGES).filter(i => i.startsWith(root));
  return sortedImages.map(rawName => {
    const name = `${root  }/${  rawName}`;
    return folderPicture.find(i => i === name);
  })
    .filter(e => e !== undefined) as string[];
}
