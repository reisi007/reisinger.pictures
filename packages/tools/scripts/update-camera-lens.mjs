import fs from "fs/promises";
import path from "path";
import * as yaml from "js-yaml";

import { applyCameraMap, applyLensMap } from "./apply-camera-lens-map.mjs";

const FOLDER_PATH = path.join(process.cwd(), "src");

async function getAllFiles(dirPath) {
  const files = [];
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...await getAllFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

async function main() {
  console.log("📷 Scanne YAML-Dateien nach Kamera-/Objektiv-Metadaten...\n");
  const allFiles = await getAllFiles(FOLDER_PATH);
  const yamlFiles = allFiles.filter(f => f.endsWith(".yml") || f.endsWith(".yaml"));

  let updatedCount = 0;

  for (const yamlPath of yamlFiles) {
    try {
      const raw = await fs.readFile(yamlPath, "utf-8");
      const data = yaml.load(raw);

      if (!data?.metadata) continue;

      const oldCamera = data.metadata.camera;
      const oldLens = data.metadata.lens;
      const newCamera = applyCameraMap(oldCamera);
      const newLens = applyLensMap(oldLens);

      if (newCamera !== oldCamera || newLens !== oldLens) {
        data.metadata.camera = newCamera;
        data.metadata.lens = newLens;
        await fs.writeFile(yamlPath, yaml.dump(data), "utf-8");
        const relPath = path.relative(FOLDER_PATH, yamlPath);
        console.log(`  ✅ ${relPath}`);
        if (newCamera !== oldCamera) console.log(`     Kamera: "${oldCamera}" → "${newCamera}"`);
        if (newLens !== oldLens) console.log(`     Objektiv: "${oldLens}" → "${newLens}"`);
        updatedCount++;
      }
    } catch (err) {
      console.error(`  ❌ Fehler bei ${yamlPath}: ${err.message}`);
    }
  }

  console.log(`\n--- Fertig! ${updatedCount} YAML-Datei(en) aktualisiert. ---`);
}

main();
