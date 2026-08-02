---
name: content-writing
description: Schreibt und pflegt Astro-Content für reisinger.pictures (portfolio, simple, portfolioOverviews, testimonials). Fragt interaktiv nach Kontext, benennt Bilder um, erzeugt YAML-Sidecars (nur description), generiert Bildbeschreibungen/Captions, reviewt Captions via review.html + Chat und delegiert Galerie-Arrays/heroImage an image-renaming sowie Artikel an journalist. TRIGGER when Content für die Content Collections geschrieben, Bilder umbenannt oder Bildbeschreibungen/Captions erstellt werden sollen.
---

# Content Writing für reisinger.pictures

## Meta-Ablauf (Orchestrierung, Portfolio-Artikel)

Dieser Skill ist der Einstiegspunkt/Orchestrator für alle Portfolio-Artikel. Der Ablauf ist verbindlich in dieser Reihenfolge: **Kontext verstehen → Bilder mit Kontext benennen & kategorisieren → Bilder umbenennen → Artikel schreiben → fertig.**

1. **Kontext verstehen**: Interaktiv abfragen (Abschnitt 6): Content-Typ, Titel, Slug/Ziel-URL, Datum, Kontext (Event/Teams/Ort/Liga/Ergebnis), Bildordner, Gallery-Wunsch.
2. **Bilder mit Kontext benennen & kategorisieren**: Vision-Subagent (Abschnitt 4) beschreibt jedes Bild semantisch (Deutsch) und schlägt SEO-Dateinamen vor; `heroImage` wird nach Relevanz gewählt (Abschnitt `image-renaming`). Verstehen der Bildinhalte ERST hier, nicht raten.
3. **Bilder umbenennen → YAML-Sidecars (nur `description`) anlegen** (Abschnitt 5). `slug`/`metadata`/`categories` übernimmt `add-metadata.mjs` im Build.
4. **Artikel schreiben**: Galerie-Arrays + `heroImage` über `image-renaming`, Text über `journalist`, Einleitung/Description/Überschriften interaktiv abstimmen (Abschnitt 6 Runde 2).
5. **Fertig**: `astro sync`/`astro check` validieren; Review-Modus per `review.html` oder Chat.

## 1. Kontext: Astro Content Collections

Alle Schemas stehen in `apps/reisinger.pictures/src/content.config.ts`. Neue Inhalte MÜSSEN dem jeweiligen Schema entsprechen, sonst bricht der Build.

| Collection | Pfad (`src/content/…`) | Pflichtfelder |
|---|---|---|
| `portfolio` | `portfolio/<kategorie>/<pfad>/<slug-ordner>/` | `title`, `date`, `heroImage` |
| `portfolioOverviews` | `portfolioOverviews/<kategorie>/…` | `title` |
| `simple` | `simple/…` | `title` |
| `testimonials` | `testimonials/…` | `name`, `type` (akt/beauty/couples/sport), `date` |
| `areas` | `areas/…` | `name`, `images[]` |
| `tfp` | `tfp/…` | `title`, `priority` |

Optionale, aber übliche Frontmatter-Felder: `description`, `keywords` (max. 4), `updated`, `showContact`, `showToc`, `index`.

## 2. Ordnerstruktur & Referenz

Korrekter Aufbau eines Portfolio-Beitrags (Referenz):

```
apps/reisinger.pictures/src/content/portfolio/sport/football/afle/2026-week-4-vikings-rams/
├── index.mdx
├── vienna-vikings-touchdown-afle-siege-alpine-rams.jpg
└── vienna-vikings-touchdown-afle-siege-alpine-rams.yaml
```

`index.mdx` – Frontmatter + Galerie-Arrays:

```mdx
---
title: "…"
description: "…"
date: 2026-06-13
heroImage: sport-football-afle-2026-week-4-vikings-rams-vienna-vikings-touchdown-afle-siege-alpine-rams
keywords:
  - …
---
import Gallery from "../../../../../../components/Gallery.astro";

export const IMAGES_ACTION = [
"sport-football-afle-2026-week-4-vikings-rams-vienna-vikings-touchdown-afle-siege-alpine-rams",
"…"
];
```

Einbinden im Text: `<Gallery sorted={IMAGES_ACTION}></Gallery>`. Galerie-Arrays und `heroImage` erzeugt der Skill **image-renaming**.

**Fertiger Import-Pfad (Standard-Tiefe `content/portfolio/sport/football/afl/<slug>/index.mdx`):**

```mdx
import Gallery from "../../../../../../components/Gallery.astro";
```

**Zählregel (robust):** Anzahl der `..` = Anzahl der Pfadsegmente von `src/` bis inkl. Beitragsordner. Beispiel `content/portfolio/sport/football/afl/<slug>` = 6 Segmente → 6 `..`. Kürzere Pfade entsprechend weniger (z.B. `content/portfolio/beauty/<slug>` = 4 Segmente → `../../../../components/Gallery.astro`).

**Slug-Ableitung aus Dateiname (verbindlich, NICHT raten):** Jeder Bild-Slug = Ordnerpfad ab `src/content/portfolio/` (mit `/`→`-`) + `-` + Bilddateiname ohne Endung. Vollständige Formel im Skill **image-renaming** (Abschnitt „Dateiname → Slug").

`*.yaml`-Sidecar (pro Bild) – wird im Schritt 4 erzeugt, enthält NUR die Beschreibung:

```yaml
description: >-
  Der Touchdown der Vienna Vikings gegen die Alpine Rams während eines AFLE-Spiels
```

## 3. Workflow (vereinfacht)

1. **Interaktive Fragen stellen** (siehe Abschnitt 6) – nicht mit der Arbeit beginnen, bevor nicht geantwortet wurde.
2. **Bilder vorbereiten**: Liegen in `apps/reisinger.pictures/src/content/…`. Rohe Dateinamen nach Abschnitt 5 umbenennen.
3. **Captions erzeugen** (Titel + SEO-Dateiname je Bild) über den Harness (Abschnitt 4).
4. **Review (Human-in-the-Loop)**: `packages/tools/caption-review/review.html` in den Bildordner kopieren, im Browser öffnen (zeigt jede Bild-Datei + vorgeschlagenen Dateinamen + deutschen Titel), Änderungen per Chat vorgeben lassen. Erst nach Freigabe weitermachen.
5. **YAML-Sidecars schreiben**: pro Bild `<name>.yaml` mit **nur** `description` anlegen (Abschnitt 5).
6. **Galerie-Arrays + `heroImage`** über den Skill **image-renaming** erzeugen, `index.mdx`-Frontmatter vorbereiten.
7. **Artikel schreiben** über den Skill **journalist** → `index.mdx` (inkl. `<Gallery>`-Platzierungen).
8. **Technische Metadaten**: `slug`, `metadata` (EXIF) und `categories` füllt automatisch `packages/tools/scripts/add-metadata.mjs` (läuft als `prebuild`-Hook). NIE manuell schreiben.

**Datum (verbindlich):** Bei Ereignis-Beiträgen (Sport, Events, Shootings) NIE das aktuelle Datum verwenden. Immer das **Ereignis-Datum** als `date` setzen: das Datum der EXIF-`captureDate` der Bilder (bzw. das bekannte Event-Datum, falls es davon abweicht).

## 4. Captions erzeugen

Deutsche Bildbeschreibungen (Captions) und SEO-Dateinamen je Bild erzeugt ein **vision-fähiger Subagent** (Agent-Typ `vision`, über das Task-Tool). Das Hauptmodell kann Bilder ggf. NICHT direkt ansehen – Bildbeschreibungen daher IMMER über den Vision-Subagenten erzeugen lassen. Pro Bild gilt:

- **Bildbeschreibung:** 1 bis maximal 2 kurze deutsche Sätze, präzise für SEO-Zwecke (Alt-Text).
- **SEO-Dateiname (kebab-case):** alles klein, nur `a-z0-9-`, keine Umlaute/Sonderzeichen, max. 6 Wörter, Wörter aus dem übergeordneten Ordnerpfad nicht wiederholen, keine Dateiendung.
- **Eindeutigkeit (Pflicht):** Alle Dateinamen eines Beitrags MÜSSEN untereinander verschieden sein. Doppelte Namen auflösen (z.B. mit Suffix `-2`, `-3`), damit keine Slug-Kollisionen entstehen.
- **Ergebnis:** Pro Bild `<aktueller-dateiname>` → `{ filename, description }`. Die Ergebnisse werden zu `captions.json` zusammengeführt (Format siehe review.html) und dem Menschen zur Freigabe vorgelegt.

## 5. Benennungs- & Sidecar-Regeln

- **Dateiname (kebab-case)**: alles klein, nur `a-z0-9-`, keine Umlaute/Sonderzeichen, max. ~6 Wörter, Wörter aus dem übergeordneten Ordnerpfad nicht wiederholen.
- **WICHTIG – Dateiname ≠ Slug**: Physische Dateinamen (`.jpg` + `.yaml`) enthalten NUR den beschreibenden Teil, **ohne** Slug-Präfix. Der Präfix (`sport-football-afl-2026-…-`) kommt automatisch aus dem Ordnerpfad (`add-metadata.mjs`); ihn in den Dateinamen zu schreiben würde doppelte Slugs erzeugen. Den Präfix erst im Galerie-Array/Slug anwenden (Skill `image-renaming`).
- **Eindeutigkeit (Pflicht)**: Alle Dateinamen eines Beitrags MÜSSEN untereinander verschieden sein. Doppelte Namen auflösen (z.B. mit Suffix `-2`, `-3`), damit keine Slug-Kollisionen entstehen.
- **YAML-Sidecar**: schreibe ausschließlich `description` (deutscher SEO-Alt-Text, 1–2 Sätze). `slug`, `metadata` und `categories` werden von `add-metadata.mjs` generiert.
- **Sprache**: Texte/Bilderstellung = Deutsch, Code/Technik = Englisch (AGENTS.md §3).
- **Nichts löschen**: `.cache/`, `.astro/`, `dist/` nie anfassen (AGENTS.md §8). Stattdessen `astro sync`.

## 6. Interaktive Fragen (Checkliste vor dem Start)

Ist ein passender Agent vorhanden, befrage ihn **interaktiv** (Question-Tool) und warte auf Antworten, bevor du schreibst. Dies ist PFLICHT – nicht nur ein Vorschlag. In einer Session wurden Titel, Ordner/Slug (URL) sowie Einleitung und Description jeweils getrennt interaktiv abgestimmt.

Stelle diese Fragen (oder passende Äquivalente) und warte auf Antworten:

1. Content-Typ? (portfolio / simple / portfolioOverviews / testimonials / areas / tfp)
2. Titel, Thema und Datum des Beitrags?
3. Slug / Ziel-URL des Beitrags (z.B. `/portfolio/sport/fussball/<jahr>/g3`) – der Ordnerpfad bestimmt die URL!
4. Kontext: Event, Teams, Ort, Liga, Ergebnis (bei Sport); Story/Stimmung (sonst)?
5. In welchem Ordner liegen die Bilder? (relativ zu `src/content/`)
6. Wie viele Galerien und mit welchen Namen? (z.B. `IMAGES_HIGHLIGHTS`, `IMAGES_ACTION`, `IMAGES_IMPRESSIONS`)
7. Sollen Bilder umbenannt und Captions erzeugt werden? (Standard: ja)
8. Review-Modus: `review.html` im Browser oder nur Chat?
9. Tonfall / Zielgruppe?

Nach dem Schreiben folgt die zweite interaktive Runde zu den redaktionellen Texten: **Einleitung (erster Absatz)**, **Description (Meta-Description)** sowie alternative Überschriften – jede einzeln zur Auswahl stellen und die getroffene Wahl erst übernehmen.

## 7. Toolchain-Regeln

- **pnpm** verwenden, nicht npm.
- Bilder in Inhalten NIE mit `<img>`; der Skill `image-renaming` erzeugt die Referenzen (Slugs), gerendert wird über `ResponsiveImage.astro`.
- Nach Content-Änderungen ggf. `astro sync` ausführen, damit der Content-Index stimmt.
