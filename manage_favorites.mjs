import fs from "fs/promises";
import path from "path";
import yaml from "js-yaml";

const command = process.argv[2];
// Optionales Filter-Jahr als drittes Argument (z.B. "2026")
const filterYearArg = process.argv[3];
const minYear = filterYearArg ? parseInt(filterYearArg, 10) : null;

const FOLDER_PATH = "./src";

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

async function exportFavorites() {
  console.log(`Sammle alle Bilddaten (Favoriten immer, Kandidaten${minYear ? ` ab Jahr ${minYear}` : " komplett"})...`);
  const allFiles = await getAllFiles(FOLDER_PATH);
  const yamlFiles = allFiles.filter(file => file.endsWith(".yml") || file.endsWith(".yaml"));

  const currentOptions = [];
  const currentSelections = [];
  const candidateOptions = [];

  for (const yamlPath of yamlFiles) {
    try {
      const dir = path.dirname(yamlPath);
      const baseName = path.basename(yamlPath, path.extname(yamlPath));
      const imagePath = path.join(dir, baseName + ".jpg");

      // Prüfen, ob auch wirklich ein JPG Bild existiert
      try {
        await fs.access(imagePath);
      } catch {
        continue; // Überspringen, wenn es kein zugehöriges Bild gibt
      }

      const content = await fs.readFile(yamlPath, "utf8");
      const data = yaml.load(content) || {};

      // Pfad Web-kompatibel für das HITL-Tool machen
      const imageUrl = "/" + imagePath.split(path.sep).join("/");
      const id = yamlPath;

      const option = {
        id: id,
        label: data.title || baseName,
        text: `Ordner: ${dir.split(path.sep).pop()} | Slug: ${data.slug || baseName}`,
        image_url: imageUrl
      };

      // Favoriten landen immer in der ersten Aufgabe
      if (data.favorite === true) {
        currentOptions.push(option);
        currentSelections.push(id);
      } else {
        // Bei den Kandidaten prüfen wir das Filter-Jahr
        if (minYear) {
          let imgYear = 0;
          if (data.metadata && data.metadata.captureDate) {
            imgYear = new Date(data.metadata.captureDate).getFullYear();
          }

          // Nur hinzufügen, wenn das Jahr >= minYear ist
          if (imgYear >= minYear) {
            candidateOptions.push(option);
          }
        } else {
          // Kein Filter angegeben -> Alle Kandidaten hinzufügen
          candidateOptions.push(option);
        }
      }
    } catch (e) {
      console.error(`Fehler beim Verarbeiten von ${yamlPath}:`, e.message);
    }
  }

  const hitlJson = {
    tasks: [
      {
        id: "review-current-favorites",
        label: "Bestehende Favoriten überprüfen",
        text: "Hier sind deine aktuellen Favoriten (ungefiltert). Alle sind vorausgewählt. Wähle die Bilder AB, die KEINE Favoriten mehr sein sollen.",
        max_selections: 9999,
        selections: currentSelections,
        options: currentOptions,
        sortable: false
      },
      {
        id: "review-new-candidates",
        label: `Neue Favoriten aus dem Rest wählen ${minYear ? `(Ab Jahr ${minYear})` : "(Alle Bilder)"}`,
        text: "Klicke auf die Bilder, die du NEU als Favoriten markieren möchtest.",
        max_selections: 9999,
        selections: [],
        options: candidateOptions,
        sortable: false
      }
    ]
  };

  await fs.writeFile("favorites_hitl.json", JSON.stringify(hitlJson, null, 2), "utf8");
  console.log(`\nErfolgreich ${currentOptions.length} aktuelle Favoriten und ${candidateOptions.length} weitere Kandidaten gefunden!`);
  console.log("Die Datei 'favorites_hitl.json' wurde erstellt.");
}

async function importFavorites() {
  try {
    const hitlOutput = await fs.readFile("favorites_response.json", "utf8");
    const responseData = JSON.parse(hitlOutput);

    const currentResponse = responseData.responses.find(r => r.id === "review-current-favorites");
    const newResponse = responseData.responses.find(r => r.id === "review-new-candidates");

    if (!currentResponse && !newResponse) {
      console.error("Konnte die Aufgaben-Daten in der JSON nicht finden.");
      return;
    }

    const selectedCurrentIds = currentResponse ? currentResponse.selected_ids : [];
    const selectedNewIds = newResponse ? newResponse.selected_ids : [];

    // Input laden, um zu wissen, was in "Aufgabe 1" (Favoriten) zur Debatte stand (was also ggf. abgewählt wurde)
    const hitlInput = await fs.readFile("favorites_hitl.json", "utf8");
    const inputData = JSON.parse(hitlInput);
    const taskCurrentInput = inputData.tasks.find(t => t.id === "review-current-favorites");
    const allCurrentIds = taskCurrentInput ? taskCurrentInput.options.map(o => o.id) : [];

    let verifiedCount = 0;
    let fixedCount = 0;
    let removedCount = 0;
    let addedCount = 0;

    console.log(`Starte Aktualisierung...\n`);

    // 1. Aktuelle Favoriten prüfen (Behalten oder Entfernen)
    for (const yamlPath of allCurrentIds) {
      const isSelected = selectedCurrentIds.includes(yamlPath);
      try {
        const content = await fs.readFile(yamlPath, "utf8");
        const data = yaml.load(content) || {};
        let changed = false;

        if (isSelected) {
          if (data.favorite !== true) {
            data.favorite = true;
            changed = true;
            fixedCount++;
          } else {
            verifiedCount++;
          }
        } else {
          if (data.favorite === true) {
            delete data.favorite;
            changed = true;
            removedCount++;
            console.log(`❌ Favorit entfernt bei: ${yamlPath}`);
          }
        }

        if (changed) {
          const newContent = yaml.dump(data);
          await fs.writeFile(yamlPath, newContent, "utf8");
        }
      } catch (e) {
        console.error(`Fehler beim Aktualisieren von ${yamlPath}:`, e.message);
      }
    }

    // 2. Neue Favoriten aus den Kandidaten hinzufügen
    for (const yamlPath of selectedNewIds) {
      try {
        const content = await fs.readFile(yamlPath, "utf8");
        const data = yaml.load(content) || {};

        if (data.favorite !== true) {
          data.favorite = true;
          const newContent = yaml.dump(data);
          await fs.writeFile(yamlPath, newContent, "utf8");
          addedCount++;
          console.log(`⭐ Neuer Favorit hinzugefügt: ${yamlPath}`);
        }
      } catch (e) {
        console.error(`Fehler beim Hinzufügen von ${yamlPath}:`, e.message);
      }
    }

    console.log("\nAktualisierung erfolgreich abgeschlossen!");
    console.log(`Zusammenfassung: ${addedCount} NEUE hinzugefügt | ${verifiedCount} alte bestätigt | ${fixedCount} fehlende korrigiert | ${removedCount} alte abgewählt & gelöscht.`);

  } catch (e) {
    console.error("Fehler beim Importieren:", e.message);
    console.log("Stelle sicher, dass sowohl 'favorites_hitl.json' als auch 'favorites_response.json' existieren.");
  }
}

if (command === "export") {
  exportFavorites();
} else if (command === "import") {
  importFavorites();
} else {
  console.log("Bitte nutze das Skript mit einem Befehl:");
  console.log("  node manage_favorites.mjs export [JAHR] -> Erstellt favorites_hitl.json (optional: Kandidaten erst ab [JAHR])");
  console.log("  node manage_favorites.mjs import        -> Verarbeitet die Auswahlen und aktualisiert die YAMLs");
}