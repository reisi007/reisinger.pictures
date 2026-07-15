import fs from "fs/promises";
import fsSync from "node:fs";
import path from "path";
import crypto from "crypto";
import { load as parseYaml } from "js-yaml";
import sharp from "sharp";

const ROOT = process.cwd();
const IMAGE_SOURCE_DIRS = [
  path.join(ROOT, "src", "images"),
  path.join(ROOT, "src", "content", "portfolio"),
  path.join(ROOT, "src", "content", "simple"),
];
const IMAGE_DIST = path.join(ROOT, ".imagedist");
const MANIFEST_PATH = path.join(IMAGE_DIST, "manifest.json");
const TARGET_WIDTHS = [256, 640, 828, 1080, 1200, 1920, 2048];
const WEBP_QUALITY = 75;
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png"]);
const CONCURRENCY = 32;

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

function computeHash(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex").substring(0, 16);
}

async function readManifest() {
  try {
    return JSON.parse(await fs.readFile(MANIFEST_PATH, "utf8"));
  } catch {
    return { version: 1, generated: new Date().toISOString(), images: {} };
  }
}

async function writeManifest(manifest) {
  manifest.generated = new Date().toISOString();
  await fs.mkdir(IMAGE_DIST, { recursive: true });
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
}

async function processFiles() {
  let allImageFiles = [];
  for (const dir of IMAGE_SOURCE_DIRS) {
    try {
      allImageFiles = allImageFiles.concat(await getAllFiles(dir));
    } catch {
      // directory doesn't exist, skip
    }
  }

  const imageFiles = allImageFiles.filter(file =>
    IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase())
  );

  console.log(`📷 Verarbeite ${imageFiles.length} Bilder...`);

  const manifest = await readManifest();
  let processedCount = 0;
  let skippedCount = 0;

  async function processOneImage(imagePath) {
    const dir = path.dirname(imagePath);
    const basename = path.basename(imagePath, path.extname(imagePath));

    let yamlContent;
    let yamlPath = path.join(dir, `${basename}.yaml`);
    try {
      yamlContent = await fs.readFile(yamlPath, "utf8");
    } catch {
      yamlPath = path.join(dir, `${basename}.yml`);
      try {
        yamlContent = await fs.readFile(yamlPath, "utf8");
      } catch {
        return;
      }
    }

    const yamlData = parseYaml(yamlContent) ?? {};
    const slug = yamlData.slug;
    if (!slug) return;

    const imageBuffer = await fs.readFile(imagePath);
    const hash = computeHash(imageBuffer);

    let imgInfo;
    try {
      imgInfo = await sharp(imageBuffer).metadata();
    } catch {
      console.error(`  ❌ ${slug}: korrupte Bilddatei, übersprungen (${path.basename(imagePath)})`);
      return;
    }

    const originalWidth = imgInfo.width;
    const originalHeight = imgInfo.height;
    if (!originalWidth || !originalHeight) {
      console.error(`  ❌ ${slug}: konnte Abmessungen nicht lesen, überspringe`);
      return;
    }

    const widths = TARGET_WIDTHS.filter(w => w <= originalWidth);
    const prefix = hash.substring(0, 2);
    const distDir = path.join(IMAGE_DIST, prefix);

    const allVariantsExist = widths.every(w =>
      fsSync.existsSync(path.join(distDir, `${hash}_${w}.webp`))
    );

    if (allVariantsExist) {
      console.log(`  ── ${slug}: bereits konvertiert, überspringe`);
      manifest.images[slug] = { hash, width: originalWidth, height: originalHeight, variants: widths };
      skippedCount++;
      return;
    }

    console.log(`  ▶ ${slug}: verarbeite... (${originalWidth}×${originalHeight})`);

    await fs.mkdir(distDir, { recursive: true });

    const variants = await Promise.all(
      widths.map(async (width) => {
        const resizedBuffer = await sharp(imageBuffer)
          .resize(width)
          .webp({ quality: WEBP_QUALITY })
          .toBuffer();

        const filename = `${hash}_${width}.webp`;
        await fs.writeFile(path.join(distDir, filename), resizedBuffer);
        return width;
      })
    );

    manifest.images[slug] = { hash, width: originalWidth, height: originalHeight, variants };
    await writeManifest(manifest);
    processedCount++;
  }

  const queue = [...imageFiles];
  async function worker() {
    while (queue.length > 0) {
      const imgPath = queue.shift();
      try {
        await processOneImage(imgPath);
      } catch (err) {
        console.error(`  ❌ Fehler bei ${path.basename(imgPath)}: ${err.message}`);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  await writeManifest(manifest);
  console.log(`✅ ${processedCount} verarbeitet, ${skippedCount} übersprungen.`);
}

processFiles();
