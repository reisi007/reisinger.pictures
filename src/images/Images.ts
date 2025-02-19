import type {ImageMetadata} from 'astro';
import {IMAGE_BY_CATEGORY} from './ImageSorting';

function computeKey(key: string) {
  let k = key.substring(5);
  if(k.startsWith('images/')) {
    k = k.substring(7);
  }
  k = k.substring(0, k.indexOf('.'));
  return k;
}

const IMAGES: Record<string, () => Promise<{
  default: ImageMetadata;
}>> = Object.fromEntries(
  Object.entries(
    import.meta.glob<{
      default: ImageMetadata
    }>('/src/**/*.{jpeg,jpg,png,gif,svg,webp}')).map(([k, v]) => [computeKey(k), v]));

export function tryGetImageImportByName(name?: string) {
  if(!name) {
    return undefined;
  }
  const image = IMAGES[name];
  return image ? image() : undefined;
}

export async function getImageImportByName(name?: string) {
  const image = await tryGetImageImportByName(name);
  if(!image) {
    throw new Error(`"${name}" does not exist`);
  }

  return image;
}


export function getImageImportNameByFolder(root: string, sortedImages?: string[]) {
  const firstSlash = root.indexOf('/');
  const prefix = firstSlash > 0 ? root.substring(0, firstSlash) : root;
  const folderPicture = Object.keys(IMAGES)
                              .filter(i => i.startsWith(root));

  const presortedImages = sortedImages ?? IMAGE_BY_CATEGORY[prefix];
  return presortedImages.map(name => folderPicture.find(i => i.endsWith(name)))
                        .filter(e => e !== undefined) as string[];
}
