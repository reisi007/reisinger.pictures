export type ManifestImage = {
  hash: string;
  width: number;
  height: number;
  variants: number[];
}

export type ImageManifest = {
  version: number;
  generated: string;
  images: Record<string, ManifestImage>;
}
