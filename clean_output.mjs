import { promises as fs } from "fs";

async function deleteFilesWithOneUnderscore(folderPath) {
  try {
    const files = (await fs.readdir(folderPath));
    const deletionPromises = files.map(async (fileName) => {
      if (fileName.endsWith("jpg")) {
        await fs.unlink(`${folderPath}/${fileName}`);
      }
    });
    await Promise.all(deletionPromises);
    console.log("Original files deleted successfully!");
  } catch (error) {
    console.error("Error deleting files:", error);
  }
}

/**
 * Checks a folder for empty files (0 bytes), deletes them, and then throws an error if any files were deleted.
 * @param {string} folderPath The path to the folder to check.
 */
async function ensureNoEmptyFiles(folderPath) {
  const emptyFilesFound = [];
  const files = await fs.readdir(folderPath);

  const checkAndDeletePromises = files.map(async (fileName) => {
    const filePath = `${folderPath}/${fileName}`;
    try {
      const stats = await fs.stat(filePath);
      // Check if it's a file and its size is 0
      if (stats.isFile() && stats.size === 0) {
        emptyFilesFound.push(fileName);
        await fs.unlink(filePath);
      }
    } catch (statError) {
      // This could happen if the entry is a directory or symlink, we can ignore it.
      console.error(`Could not stat ${filePath}:`, statError);
    }
  });

  await Promise.all(checkAndDeletePromises);

  if (emptyFilesFound.length > 0) {
    throw new Error(`Error: Empty files were found and deleted: ${emptyFilesFound.join(", ")}`);
  } else {
    console.log("No empty files found to delete.");
  }
}


console.log("Start cleanup out dir");
// Example usage:
await deleteFilesWithOneUnderscore("dist/_astro");
await ensureNoEmptyFiles(".cache/assets");
