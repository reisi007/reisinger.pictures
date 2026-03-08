import fs from "fs/promises";
import path from "path";
import yaml from "js-yaml";
import ExifReader from "exifreader";
import sharp from "sharp";

// The root folder to start searching from
const FOLDER_PATH = "./src";
const CATEGORIES_PATH = path.join(FOLDER_PATH, "content", "categories.json");

/**
 * Recursively gets all file paths from a directory.
 * @param {string} dirPath - The directory to start from.
 * @returns {Promise<string[]>} - A promise that resolves to an array of full file paths.
 */
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

// --- Helper Functions for Formatting ---

/**
 * Formats shutter speed from EXIF data.
 * @param {number | number[]} value - The exposure time value.
 * @returns {string} - The formatted shutter speed.
 */
function formatShutterSpeed(value) {
  if (Array.isArray(value) && value.length === 2) {
    return `${value[0]}/${value[1]}`;
  }
  if (typeof value === "number") {
    if (value >= 1) return `${value}s`;
    return `1/${Math.round(1 / value)}`;
  }
  throw new Error(`Unexpected value type for shutter speed: ${JSON.stringify(value)}`);
}

/**
 * Formats the aperture string from EXIF data.
 * @param {string | undefined} value - The aperture description string.
 * @returns {string | undefined} - The formatted aperture string.
 */
function formatAperture(value) {
  if (typeof value !== "string") return undefined;
  return value.replace(".0", "");
}

/**
 * Formats the capture date into ISO 8601 format.
 * @param {string | undefined} value - The date string from EXIF data.
 * @returns {string | undefined} - The formatted ISO date string.
 */
function formatCaptureDate(value) {
  if (typeof value !== "string" || value.length !== 19) return undefined;
  const datePart = value.substring(0, 10).replace(/:/g, "-");
  const timePart = value.substring(11);
  return `${datePart}T${timePart}`;
}

/**
 * The main function to process all YAML files.
 */
async function processFiles() {
  console.log(` Lese Dateien rekursiv von: ${FOLDER_PATH}`);
  let filesUpdatedCount = 0;

  // Initialize a new Map for categories for this run.
  // Add the static "All Pictures" category.
  let categoriesMap = new Map();
  categoriesMap.set("/", { name: "Alle Bilder" });
  console.log("🗂️ Kategorien werden basierend auf den Bildern neu erstellt.");

  try {
    const allFiles = await getAllFiles(FOLDER_PATH);
    const yamlFiles = allFiles.filter(file => file.endsWith(".yml") || file.endsWith(".yaml"));

    if (yamlFiles.length === 0) {
      console.log("Keine YAML-Dateien gefunden.");
      return;
    }
    console.log(`Gefunden: ${yamlFiles.length} YAML-Dateien zur Verarbeitung.`);

    for (const yamlFilePath of yamlFiles) {
      try {
        const fileContent = await fs.readFile(yamlFilePath, "utf8");
        const data = yaml.load(fileContent) ?? {};

        // --- 1. Generate and Clean Slug ---
        const relativePath = path.relative(FOLDER_PATH, yamlFilePath);
        let slug = relativePath.replace(/\.(yml|yaml)$/, "").replace(/[\\/ ]/g, "-");

        // List of prefixes to remove from the start of the slug
        const prefixesToRemove = [
          "images-testimonials-",
          "images-",
          "content-einblicke-",
          "content-simple-"
        ];
        for (const prefix of prefixesToRemove) {
          if (slug.startsWith(prefix)) {
            slug = slug.substring(prefix.length);
          }
        }
        data.slug = slug;

        // Process only if metadata AND orientation are missing
        const hasMetadata = data.metadata !== undefined && data.metadata !== null;
        const hasOrientation = hasMetadata && data.metadata.orientation !== undefined;

        if (hasMetadata && hasOrientation) {
          console.log(`✅ '${yamlFilePath}' wurde bereits verarbeitet. Überspringe.`);
          // Even if we skip, we need to read the date for categories
          if (data.metadata?.captureDate) {
            const date = new Date(data.metadata.captureDate);
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const day = date.getDate().toString().padStart(2, "0");

            const catYearKey = `${year}`;
            const catMonthKey = `${year}/${month}`;
            const catDayKey = `${year}/${month}/${day}`;

            if (!categoriesMap.has(catYearKey)) categoriesMap.set(catYearKey, { name: new Intl.DateTimeFormat("de-AT", { year: "numeric" }).format(date) });
            if (!categoriesMap.has(catMonthKey)) categoriesMap.set(catMonthKey, { name: new Intl.DateTimeFormat("de-AT", { month: "long", year: "numeric" }).format(date) });
            if (!categoriesMap.has(catDayKey)) categoriesMap.set(catDayKey, { name: new Intl.DateTimeFormat("de-AT", { day: "numeric", month: "long", year: "numeric" }).format(date) });
          }
          continue;
        }

        console.log(`- '${yamlFilePath}' benötigt Metadaten (Update). Suche nach passendem JPG...`);
        const fileBasename = path.basename(yamlFilePath, path.extname(yamlFilePath));
        const imagePath = path.join(path.dirname(yamlFilePath), `${fileBasename}.jpg`);

        try {
          const imageBuffer = await fs.readFile(imagePath);
          const exifData = ExifReader.load(imageBuffer);
          const isoDate = formatCaptureDate(exifData.DateTimeOriginal?.description);

          // Get dimensions using sharp
          const imgInfo = await sharp(imageBuffer).metadata();
          const width = imgInfo.width;
          const height = imgInfo.height;

          let orientation = "square";
          if (width > height) orientation = "landscape";
          else if (height > width) orientation = "portrait";

          // --- 2. Construct Metadata ---
          // Combine existing metadata with new extraction so we don't lose anything
          const newMetadata = {
            ...(data.metadata || {}),
            captureDate: isoDate || data.metadata?.captureDate,
            aperture: formatAperture(exifData.FNumber?.description) || data.metadata?.aperture,
            focalLength: exifData.FocalLength?.description || data.metadata?.focalLength,
            shutter: exifData.ExposureTime?.value ? formatShutterSpeed(exifData.ExposureTime.value) : data.metadata?.shutter,
            iso: exifData.ISOSpeedRatings?.description ? parseInt(exifData.ISOSpeedRatings.description, 10) : data.metadata?.iso,
            camera: exifData.Model?.description || data.metadata?.camera,
            lens: exifData.LensModel?.description || data.metadata?.lens,
            orientation: orientation
          };

          Object.keys(newMetadata).forEach(key => newMetadata[key] === undefined && delete newMetadata[key]);
          data.metadata = newMetadata;

          // --- 3. Generate and Assign Categories ---
          // Do not add categories for files ending with "small"
          if (newMetadata.captureDate && !fileBasename.endsWith("small")) {
            const date = new Date(newMetadata.captureDate);
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const day = date.getDate().toString().padStart(2, "0");

            const catYearKey = `${year}`;
            const catMonthKey = `${year}/${month}`;
            const catDayKey = `${year}/${month}/${day}`;

            data.categories = ["/", catYearKey, catMonthKey, catDayKey];

            // Add new categories to the central map if they don't exist
            if (!categoriesMap.has(catYearKey)) {
              categoriesMap.set(catYearKey, { name: new Intl.DateTimeFormat("de-AT", { year: "numeric" }).format(date) });
            }
            if (!categoriesMap.has(catMonthKey)) {
              categoriesMap.set(catMonthKey, { name: new Intl.DateTimeFormat("de-AT", { month: "long", year: "numeric" }).format(date) });
            }
            if (!categoriesMap.has(catDayKey)) {
              categoriesMap.set(catDayKey, { name: new Intl.DateTimeFormat("de-AT", { day: "numeric", month: "long", year: "numeric" }).format(date) });
            }
          }

          // --- 4. Write back to YAML file ---
          const newYamlContent = yaml.dump(data);
          await fs.writeFile(yamlFilePath, newYamlContent, "utf8");

          console.log(`  -> 💾 '${yamlFilePath}' aktualisiert mit Metadaten & Ausrichtung (${orientation}).`);
          filesUpdatedCount++;

        } catch (imageError) {
          if (imageError.code === "ENOENT") {
            console.log(`  -> ❌ Konnte '${imagePath}' nicht finden. Markiere Datei zum Überspringen.`);
            if (!data.metadata) data.metadata = null;
            await fs.writeFile(yamlFilePath, yaml.dump(data), "utf8");
          } else {
            console.error(`  -> ❌ Fehler beim Lesen von '${imagePath}':`, imageError.message);
          }
        }
      } catch (yamlError) {
        console.error(`Fehler bei der Verarbeitung von ${yamlFilePath}:`, yamlError.message);
      }
    }

    // --- 5. Write back updated categories ---
    if (categoriesMap.size > 0) {
      await fs.mkdir(path.dirname(CATEGORIES_PATH), { recursive: true });

      // Convert map back to a sorted list of objects
      const categoriesList = Array.from(categoriesMap.entries()).map(([slug, data]) => ({
        slug: slug,
        name: data.name
      }));
      categoriesList.sort((a, b) => a.slug.localeCompare(b.slug, undefined, { numeric: true }));


      const categoriesJson = JSON.stringify(categoriesList, null, 2);
      await fs.writeFile(CATEGORIES_PATH, categoriesJson, "utf8");
      console.log(`\n🗂️ ${categoriesMap.size} Kategorien wurden in '${CATEGORIES_PATH}' gespeichert.`);
    }

    if (filesUpdatedCount > 0) {
      console.log(`\n--- ✨ Erfolg! ---`);
      console.log(`${filesUpdatedCount} YAML-Datei(en) wurden aktualisiert.`);
    } else {
      console.log("\nKeine Dateien mussten aktualisiert werden.");
    }

  } catch (err) {
    console.error(`Fehler beim Lesen des Verzeichnisses '${FOLDER_PATH}':`, err.message);
  }
}

processFiles();