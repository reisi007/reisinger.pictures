import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

// Helper für __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ordner, die komplett ignoriert werden sollen
const IGNORED_DIRS = [".cache", "node_modules", ".astro", ".idea", "."];

/**
 * Durchsucht ein Verzeichnis rekursiv nach Dateien und ignoriert definierte Ordner.
 */
async function getFilesRecursively(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });

  const files = await Promise.all(dirents.map((dirent) => {
    // Falls es ein ignorierter Ordner ist, leeres Array zurückgeben
    if (dirent.isDirectory() && IGNORED_DIRS.includes(dirent.name)) {
      return [];
    }

    const res = join(dir, dirent.name);
    return dirent.isDirectory() ? getFilesRecursively(res) : res;
  }));

  return files.flat();
}

/**
 * Hauptfunktion zum Zusammenfügen von Dateien
 * @param {string} inputdir - Das Startverzeichnis relativ zum Projektstamm
 * @param {string} outputfile - Die Ziel-Datei
 * @param {string[]} extensions - Erlaubte Dateiendungen (z.B. ['.md', '.mdx'])
 * @param {boolean} ignoreDirectSrcContent - Ob Dateien direkt unter src/content ignoriert werden sollen
 */
async function mergeFiles(inputdir, outputfile, extensions = [".md", ".mdx"], ignoreDirectSrcContent = false) {
  try {
    // Pfade auflösen
    const startPath = join(__dirname, inputdir);
    const outputPath = join(__dirname, outputfile);

    console.log(`🔍 Suche nach ${extensions.join(", ")} Dateien in: ${startPath}`);

    // Alle Dateien holen
    const allFiles = await getFilesRecursively(startPath);

    // Filtern nach Erweiterung und speziellen Pfad-Regeln
    const targetFiles = allFiles.filter(file => {
      const ext = extname(file).toLowerCase();

      // Stimmt die Endung überein?
      if (!extensions.includes(ext)) return false;

      // Spezialregel: JSON direkt unter src/content ignorieren
      if (ignoreDirectSrcContent && ext === ".json") {
        const fileDir = dirname(file);
        const srcContentPath = join(__dirname, "src/content");

        if (fileDir === srcContentPath) {
          return false;
        }
      }

      return true;
    });

    if (targetFiles.length === 0) {
      console.log(`⚠️ Keine passenden Dateien für ${outputfile} gefunden.`);
      return;
    }

    console.log(`📄 ${targetFiles.length} Dateien gefunden. Beginne mit dem Zusammenfügen für ${outputfile}...`);

    let combinedContent = "";

    // Dateien durchgehen und Inhalt lesen
    for (const filePath of targetFiles) {
      const content = await readFile(filePath, "utf-8");

      // Relativen Pfad für den Separator berechnen (für saubere Anzeige)
      const relativePath = relative(__dirname, filePath);

      // Separator erstellen
      const separator = `
------------
${relativePath}
------------
`;

      const footer = `\n`;

      combinedContent += separator + content + footer;
    }

    // Ergebnis schreiben
    await writeFile(outputPath, combinedContent, "utf-8");

    console.log(`✅ Erfolgreich! Alle Dateien kombiniert in: ${outputfile}`);

  } catch (error) {
    console.error(`❌ Ein Fehler ist aufgetreten bei ${outputfile}:`, error);
  }
}

// Skript starten (Top-Level Await)
async function run() {
  // 1. Regulärer Content
  await mergeFiles("./src/content", "./out/allContent.txt", [".md", ".mdx"]);

  // 2. Testimonials
  await mergeFiles("./src/content/testimonials", "./out/reviews.txt", [".md", ".mdx"]);

  // 3. Gesamtes Projekt nach JSON durchsuchen (inklusive ImageMetadata)
  // Übergibt das Flag 'true', um JSONs direkt in src/content zu ignorieren
  await mergeFiles(".", "./out/imageMetadata.txt", [".yaml",".yml"], true);
}

run();