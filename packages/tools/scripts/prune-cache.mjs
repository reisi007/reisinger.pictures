import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const IMAGE_CACHE = path.join(ROOT, ".imagecache");
const MANIFEST_PATH = path.join(ROOT, ".imagedist", "manifest.json");

async function main() {
  // Load manifest
  let manifest;
  try {
    manifest = JSON.parse(await fs.readFile(MANIFEST_PATH, "utf-8"));
  } catch {
    console.log("📋 Kein Manifest gefunden. Überspringe Cache-Prune.");
    return;
  }

  // Build expected set
  const expected = new Set();
  for (const img of Object.values(manifest.images ?? {})) {
    for (const w of img.variants) {
      expected.add(`${img.hash}_${w}.webp`);
    }
  }

  // Scan cache directory
  let cacheFiles;
  try {
    cacheFiles = await fs.readdir(IMAGE_CACHE);
  } catch {
    console.log("📁 Kein .imagecache/ gefunden. Überspringe.");
    return;
  }

  // Delete stale files
  let removed = 0;
  for (const file of cacheFiles) {
    if (!expected.has(file)) {
      await fs.unlink(path.join(IMAGE_CACHE, file));
      removed++;
    }
  }

  if (removed > 0) {
    console.log(`🧹 ${removed} veraltete Datei(en) aus .imagecache/ entfernt`);
  } else {
    console.log("🧹 Keine veralteten Dateien in .imagecache/");
  }
}

main().catch(console.error);
