import fs from "node:fs/promises";
import path from "node:path";
import { load as parseYaml } from "js-yaml";

const ROOT = process.cwd();
const IMAGE_DIST = path.join(ROOT, ".imagedist");
const MANIFEST_PATH = path.join(IMAGE_DIST, "manifest.json");
const IMAGE_SOURCE_DIRS = [
  path.join(ROOT, "src", "images"),
  path.join(ROOT, "src", "content", "portfolio"),
  path.join(ROOT, "src", "content", "simple"),
];
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png"]);

async function getAllFiles(dirPath) {
  let filesArray = [];
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      filesArray = filesArray.concat(await getAllFiles(fullPath));
    } else {
      filesArray.push(fullPath);
    }
  }
  return filesArray;
}

async function getCurrentSlugs() {
  const slugs = new Set();
  for (const dir of IMAGE_SOURCE_DIRS) {
    let files;
    try {
      files = await getAllFiles(dir);
    } catch {
      continue;
    }
    const imageFiles = files.filter(file => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()));
    for (const imagePath of imageFiles) {
      const dirName = path.dirname(imagePath);
      const basename = path.basename(imagePath, path.extname(imagePath));
      for (const ext of [".yaml", ".yml"]) {
        try {
          const yamlContent = await fs.readFile(path.join(dirName, `${basename}${ext}`), "utf8");
          const slug = parseYaml(yamlContent)?.slug;
          if (slug) slugs.add(slug);
          break;
        } catch {
          // sidecar not found, try next extension
        }
      }
    }
  }
  return slugs;
}

async function main() {
  let manifest;
  try {
    manifest = JSON.parse(await fs.readFile(MANIFEST_PATH, "utf-8"));
  } catch {
    console.log("📋 Kein Manifest gefunden. Überspringe.");
    return;
  }

  const currentSlugs = await getCurrentSlugs();

  // Entferne verwaiste Manifest-Einträge (Bild existiert nicht mehr in src/)
  const staleSlugs = Object.keys(manifest.images ?? {}).filter(slug => !currentSlugs.has(slug));
  let staleSlugCount = 0;
  if (staleSlugs.length > 0) {
    for (const slug of staleSlugs) {
      delete manifest.images[slug];
      staleSlugCount++;
    }
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

  if (staleSlugCount > 0 || removed > 0) {
    await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
  }
  if (staleSlugCount > 0) {
    console.log(`🧹 ${staleSlugCount} verwaiste Einträge aus manifest.json entfernt`);
  }
  if (removed > 0) {
    console.log(`🧹 ${removed} verwaiste Datei(en) aus .imagedist/ entfernt`);
  }
}

main().catch(console.error);
