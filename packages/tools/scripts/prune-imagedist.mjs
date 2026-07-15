import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const IMAGE_DIST = path.join(ROOT, ".imagedist");
const MANIFEST_PATH = path.join(IMAGE_DIST, "manifest.json");

async function main() {
  let manifest;
  try {
    manifest = JSON.parse(await fs.readFile(MANIFEST_PATH, "utf-8"));
  } catch {
    console.log("📋 Kein Manifest gefunden. Überspringe.");
    return;
  }

  const expected = new Set();
  for (const img of Object.values(manifest.images ?? {})) {
    for (const w of img.variants) {
      expected.add(`${img.hash}_${w}.webp`);
    }
  }

  let entries;
  try {
    entries = await fs.readdir(IMAGE_DIST, { withFileTypes: true });
  } catch {
    console.log("📁 Kein .imagedist/ gefunden. Überspringe.");
    return;
  }

  let removed = 0;

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const dirPath = path.join(IMAGE_DIST, entry.name);
    const files = await fs.readdir(dirPath);

    for (const file of files) {
      if (!expected.has(file)) {
        await fs.unlink(path.join(dirPath, file));
        removed++;
      }
    }

    const remaining = await fs.readdir(dirPath);
    if (remaining.length === 0) {
      await fs.rmdir(dirPath);
    }
  }

  if (removed > 0) {
    console.log(`🧹 ${removed} verwaiste Datei(en) aus .imagedist/ entfernt`);
  }
}

main().catch(console.error);
