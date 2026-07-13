import { promises as fs } from "fs";
import path from "path";

async function ensureNoEmptyFiles(folderPath) {
  const emptyFilesFound = [];
  let files = [];

  try {
    files = await fs.readdir(folderPath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`ℹ️ Skipping empty file check: Folder ${folderPath} does not exist.`);
      return;
    }
    throw error;
  }

  const checkAndDeletePromises = files.map(async (fileName) => {
    const filePath = path.join(folderPath, fileName);
    try {
      const stats = await fs.stat(filePath);
      if (stats.isFile() && stats.size === 0) {
        emptyFilesFound.push(fileName);
        await fs.unlink(filePath);
      }
    } catch (statError) {
      console.error(`❌ Could not stat ${filePath}:`, statError);
    }
  });

  await Promise.all(checkAndDeletePromises);

  if (emptyFilesFound.length > 0) {
    console.warn(`⚠️ Empty files were found and deleted in ${folderPath}: ${emptyFilesFound.join(", ")}`);
  } else {
    console.log(`✅ No empty files found to delete in ${folderPath}.`);
  }
}

async function removeUnusedJpgs(distDir) {
  const astroDir = path.join(distDir, "_astro");
  let removed = 0;

  try {
    const files = await fs.readdir(astroDir);
    const jpgFiles = files.filter(f => f.endsWith(".jpg") || f.endsWith(".jpeg"));
    await Promise.all(jpgFiles.map(async (f) => {
      try {
        await fs.unlink(path.join(astroDir, f));
        removed++;
      } catch (err) {
        console.error(`❌ Could not delete ${f}:`, err.message);
      }
    }));
    if (removed > 0) {
      console.log(`🧹 Removed ${removed} unused .jpg fallback images from dist/_astro/.`);
    }
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.warn(`⚠️ Could not clean jpg fallbacks: ${error.message}`);
    }
  }
}

console.log("🧹 Start cleanup out dir...");
await ensureNoEmptyFiles(path.join(process.cwd(), ".cache", "assets"));
await removeUnusedJpgs(path.join(process.cwd(), "dist"));
