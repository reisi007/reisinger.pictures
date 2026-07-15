import fs from "node:fs";
import path from "node:path";

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

let _manifest: ImageManifest | null = null;

export function getManifest(): ImageManifest {
  if (!_manifest) {
    const p = path.resolve(process.cwd(), ".imagedist", "manifest.json");
    _manifest = JSON.parse(fs.readFileSync(p, "utf-8")) as ImageManifest;
  }
  return _manifest;
}

export function getManifestImage(slug: string): ManifestImage | undefined {
  return getManifest().images[slug];
}
