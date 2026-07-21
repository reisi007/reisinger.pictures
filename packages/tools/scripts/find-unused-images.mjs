import fs from "fs/promises";
import path from "path";
import * as yaml from "js-yaml";
import { readFileSync, existsSync } from "fs";

const SRC_PATH = path.join(process.cwd(), "src");

const DRY_RUN = !process.argv.includes("--delete");
if (DRY_RUN) {
  console.log("🔍 Dry-Run-Modus (nur Analyse, kein Löschen).");
  console.log("   Mit --delete zum tatsächlichen Löschen.\n");
} else {
  console.log("⚠️  Lösch-Modus aktiviert!\n");
}

// ---------------------------------------------------------------------------
// 1. Alle YAML-Dateien und deren Slugs sammeln
// ---------------------------------------------------------------------------

async function getAllFiles(dirPath) {
  const files = [];
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue; // skip hidden
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...await getAllFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

function parseYamlSlug(filePath) {
  try {
    const raw = readFileSync(filePath, "utf-8");
    const data = yaml.load(raw);
    return data?.slug || null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// 2. Referenzen aus Content-Dateien extrahieren
// ---------------------------------------------------------------------------

function extractReferences(filePath, content) {
  const refs = new Set();

  // Frontmatter zwischen --- Grenzen
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (fmMatch) {
    const fm = fmMatch[1];

    // heroImage: "foo"
    const heroMatch = fm.match(/heroImage:\s*"?([^"\s]+)"?/);
    if (heroMatch) refs.add(heroMatch[1]);

    // images: ["foo", "bar"]
    const imagesMatch = fm.match(/images:\s*\[([^\]]+)\]/);
    if (imagesMatch) {
      imagesMatch[1].split(",").forEach(s => {
        const cleaned = s.trim().replace(/^["']|["']$/g, "");
        if (cleaned) refs.add(cleaned);
      });
    }

    // images: \n  - foo\n  - bar
    const imagesBlock = fm.match(/images:\s*\n((?:\s+-\s+[^\n]+\n?)*)/);
    if (imagesBlock) {
      imagesBlock[1].split("\n").forEach(line => {
        const m = line.match(/-\s*"?([^"\s]+)"?/);
        if (m) refs.add(m[1].replace(/["']/g, ""));
      });
    }

    // large: "foo"
    const largeMatch = fm.match(/large:\s*"?([^"\s]+)"?/);
    if (largeMatch) refs.add(largeMatch[1]);

    // small: "foo"
    const smallMatch = fm.match(/small:\s*"?([^"\s]+)"?/);
    if (smallMatch) refs.add(smallMatch[1]);
  }

  // SORTING / SORTING_* export const arrays in MDX body
  const sortRegex = /export\s+const\s+SORTING\w*\s*=\s*\[([\s\S]*?)\]/g;
  let sortMatch;
  while ((sortMatch = sortRegex.exec(content)) !== null) {
    sortMatch[1].split(",").forEach(s => {
      const cleaned = s.trim().replace(/^["']|["']$/g, "");
      if (cleaned) refs.add(cleaned);
    });
  }

  return refs;
}

// ---------------------------------------------------------------------------
// 3. Hardcoded Referenzen (in Astro-Komponenten, pages)
// ---------------------------------------------------------------------------

function extractComponentReferences(filePath, content) {
  const refs = new Set();
  // Suche nach getImageByName("..."), tryGetImage("..."), filterInvalidImageName("...")
  const funcRegex = /(?:getImageByName|tryGetImage|filterInvalidImageName)\s*\(\s*["']([^"']+)["']\s*\)/g;
  let m;
  while ((m = funcRegex.exec(content)) !== null) {
    refs.add(m[1]);
  }
  // Auch ResponsiveImage name={"..."} oder name="..."
  const nameRegex = /ResponsiveImage\s[^>]*?name\s*=\s*{?\s*["']([^"']+)["']/g;
  while ((m = nameRegex.exec(content)) !== null) {
    refs.add(m[1]);
  }
  return refs;
}

// ---------------------------------------------------------------------------
// 4. Main
// ---------------------------------------------------------------------------

async function main() {
  // 1. Alle Dateien unter src/ finden
  const allFiles = await getAllFiles(SRC_PATH);

  const yamlFiles = allFiles
    .filter(f => f.endsWith(".yaml") || f.endsWith(".yml"))
    .filter(f => !f.endsWith("categories.json") && !f.includes("node_modules"));

  const contentFiles = allFiles
    .filter(f => f.endsWith(".md") || f.endsWith(".mdx"))
    .filter(f => !f.includes("node_modules"));

  const astroFiles = allFiles
    .filter(f => f.endsWith(".astro"))
    .filter(f => !f.includes("node_modules"));

  // 2. YAML-Slugs sammeln
  const yamlSlugs = new Map(); // slug → { yamlPath, jpgPath }
  let totalYaml = 0;
  for (const yamlPath of yamlFiles) {
    const slug = parseYamlSlug(yamlPath);
    if (slug) {
      totalYaml++;
      const dir = path.dirname(yamlPath);
      const base = path.basename(yamlPath, path.extname(yamlPath));
      const jpgPath = path.join(dir, `${base}.jpg`);
      if (!yamlSlugs.has(slug)) {
        yamlSlugs.set(slug, { yamlPath, jpgPath });
      } else {
        // Conflict: two YAMLs with same slug
        console.warn(`⚠️  Slug-Konflikt: "${slug}" in ${yamlPath} und ${yamlSlugs.get(slug).yamlPath}`);
      }
    }
  }

  // 3. Referenzen aus Content-Dateien extrahieren
  const allRefs = new Set();

  for (const cf of contentFiles) {
    const content = readFileSync(cf, "utf-8");
    const refs = extractReferences(cf, content);
    for (const r of refs) allRefs.add(r);
  }

  for (const af of astroFiles) {
    const content = readFileSync(af, "utf-8");
    const refs = extractComponentReferences(af, content);
    for (const r of refs) allRefs.add(r);
  }

  // 4. Unused = YAML-Slugs die nicht referenziert werden
  const unused = [];
  for (const [slug, info] of yamlSlugs) {
    if (!allRefs.has(slug)) {
      const hasJpg = existsSync(info.jpgPath);
      unused.push({ slug, yamlPath: info.yamlPath, jpgPath: hasJpg ? info.jpgPath : null });
    }
  }

  // 5. Ausgabe
  console.log(`Gefundene YAML-Dateien mit Slug: ${totalYaml}`);
  console.log(`Gefundene Content-Referenzen: ${allRefs.size}`);
  console.log(`Nicht referenzierte YAML-Dateien: ${unused.length}\n`);

  if (unused.length > 0) {
    console.log("Folgende Bilder werden nicht referenziert:\n");
    for (const u of unused) {
      const relYaml = path.relative(SRC_PATH, u.yamlPath);
      const relJpg = u.jpgPath ? path.relative(SRC_PATH, u.jpgPath) : "(kein JPG)";
      console.log(`  [${u.slug}]`);
      console.log(`    YAML: ${relYaml}`);
      console.log(`    JPG:  ${relJpg}`);
      console.log("");
    }

    if (!DRY_RUN) {
      console.log("⚠️  Bist du sicher, dass diese Dateien gelöscht werden sollen? (ja/nein)");
      // Readline for confirmation
      const readline = await import("readline");
      const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
      await new Promise((resolve) => {
        rl.question("> ", async (answer) => {
          rl.close();
          if (answer.toLowerCase() === "ja" || answer.toLowerCase() === "yes") {
            console.log("\nLösche...\n");
            for (const u of unused) {
              try {
                await fs.unlink(u.yamlPath);
                console.log(`  🗑️  ${path.relative(SRC_PATH, u.yamlPath)}`);
              } catch (e) {
                console.error(`  ❌ Fehler beim Löschen von ${u.yamlPath}: ${e.message}`);
              }
              if (u.jpgPath) {
                try {
                  await fs.unlink(u.jpgPath);
                  console.log(`  🗑️  ${path.relative(SRC_PATH, u.jpgPath)}`);
                } catch (e) {
                  console.error(`  ❌ Fehler beim Löschen von ${u.jpgPath}: ${e.message}`);
                }
              }
            }
            console.log("\n✅ Fertig!");
          } else {
            console.log("Abgebrochen.");
          }
          resolve();
        });
      });
    }
  } else {
    console.log("✅ Keine ungenutzten Bilder gefunden!");
  }

  // 6. Wenn --delete aber dry nicht aktiv, und keine ungenutzten
  if (!DRY_RUN && unused.length === 0) {
    console.log("Nichts zu löschen.");
  }
}

main();
