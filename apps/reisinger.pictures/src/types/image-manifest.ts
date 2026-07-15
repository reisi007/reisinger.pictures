export interface ManifestImage {
  hash: string;
  width: number;
  height: number;
  variants: number[];
}

export interface ImageManifest {
  version: number;
  generated: string;
  images: Record<string, ManifestImage>;
}
