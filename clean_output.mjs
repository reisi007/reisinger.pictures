import {promises as fs} from 'fs';

async function deleteFilesWithOneUnderscore(folderPath) {
    try {
        const files = (await fs.readdir(folderPath));
        const deletionPromises = files.map(async (fileName) => {
            if (fileName.endsWith("jpg")) {
                await fs.unlink(`${folderPath}/${fileName}`);
            }
        });
        await Promise.all(deletionPromises);
        // eslint-ignore
        console.log('Original files deleted successfully!');
    } catch (error) {
        console.error('Error deleting files:', error);
    }
}

console.log("Start cleanup out dir")
// Example usage:
await deleteFilesWithOneUnderscore('dist/_astro');
