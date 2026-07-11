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
    throw new Error(`Error: Empty files were found and deleted: ${emptyFilesFound.join(", ")}`);
  } else {
    console.log(`✅ No empty files found to delete in ${folderPath}.`);
  }
}

console.log("🧹 Start cleanup out dir...");
await ensureNoEmptyFiles(path.join(process.cwd(), ".cache", "assets"));
