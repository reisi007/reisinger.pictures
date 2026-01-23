import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

// Helper für __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Durchsucht ein Verzeichnis rekursiv nach Dateien
 */
async function getFilesRecursively(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map((dirent) => {
    const res = join(dir, dirent.name);
    return dirent.isDirectory() ? getFilesRecursively(res) : res;
  }));
  return files.flat();
}

/**
 * Hauptfunktion
 */
async function mergeMarkdownFiles(inputdir , outputfile ) {
  try {
    // Pfade auflösen
    const startPath = join(__dirname, inputdir);
    const outputPath = join(__dirname, outputfile);

    console.log(`🔍 Suche nach .md und .mdx Dateien in: ${startPath}`);

    // Alle Dateien holen
    const allFiles = await getFilesRecursively(startPath);

    // Filtern nach .md und .mdx
    const targetFiles = allFiles.filter(file => {
      const ext = extname(file).toLowerCase();
      return ext === '.md' || ext === '.mdx';
    });

    if (targetFiles.length === 0) {
      console.log('⚠️ Keine Markdown-Dateien gefunden.');
      return;
    }

    console.log(`📄 ${targetFiles.length} Dateien gefunden. Beginne mit dem Zusammenfügen...`);

    let combinedContent = '';

    // Dateien durchgehen und Inhalt lesen
    for (const filePath of targetFiles) {
      const content = await readFile(filePath, 'utf-8');

      // Relativen Pfad für den Separator berechnen
      const relativePath = relative(startPath, filePath);

      // Separator erstellen
      const separator = `
------------
${relativePath}
------------
`;

      const footer = `
\n`;

      combinedContent += separator + content + footer;
    }

    // Ergebnis schreiben
    await writeFile(outputPath, combinedContent, 'utf-8');

    console.log(`✅ Erfolgreich! Alle Dateien wurden kombiniert in: ${outputfile}`);

  } catch (error) {
    console.error('❌ Ein Fehler ist aufgetreten:', error);
  }
}

// Skript starten
mergeMarkdownFiles('./src/content','./out/allContent.txt');
mergeMarkdownFiles('./src/content/testimonials','./out/reviews.txt');