---
name: image-renaming
description: Benennt Bilder für reisinger.pictures auf (kebab-case, max 6 Wörter, ohne Pfadwort-Wiederholungen) und erzeugt aus Dateilisten JavaScript-Arrays (const IMAGES_*) für MDX-Galerien. Identifiziert das SEO-technisch beste heroImage (Querformat bevorzugt) mit kurzer Begründung. TRIGGER when Galerie-Arrays, heroImage oder aufbereitete Bildnamen erzeugt werden sollen.
---

# Bilder umbenennen & Galerie-Arrays

## Zweck

Automatisiertes Aufbereiten von Bildnamen und Erzeugen der Galerie-Arrays für `index.mdx`, inkl. SEO-optimierter `heroImage`-Wahl.

## 0) WICHTIG: Dateinamen ≠ Slug (kein Präfix in Dateinamen!)

Die **physischen Dateinamen** (`.jpg` UND `.yaml`) enthalten **NUR den beschreibenden Teil** – **ohne** Slug-Präfix und **ohne** Pfadwort-Wiederholung:

```
Richtig:   cheerleaderin-mit-oesterreichischer-flagge.jpg
Falsch:    sport-football-afl-2026-playoff-dragons-vikings-cheerleaderin-mit-oesterreichischer-flagge.jpg
```

Der Slug-Präfix (`sport-football-afl-2026-playoff-dragons-vikings-`) ergibt sich **automatisch aus dem Ordnerpfad** (`add-metadata.mjs`). Würde er zusätzlich im Dateinamen stehen, entstünde ein doppelter Slug. Den Präfix erst **beim Erzeugen des Galerie-Arrays** an die Dateinamen anhängen (siehe Abschnitt 1).

## 1) Dateiliste → JavaScript-Array

**Eingabe:** Eine Liste von Dateinamen und ein Präfix (der Slug-Präfix des Beitrags, z.B. `sport-football-afl-2026-playoff-dragons-vikings-`).

**Regeln:**
1. Erzeuge ein JavaScript-String-Array `const IMAGES = [...]`.
2. Hänge den Präfix an jeden Dateinamen an.
3. Ersetze Schrägstriche (`/`) innerhalb von Pfadnamen durch Bindestriche (`-`).
4. Entferne die folgenden Präfixe, falls vorhanden (inkl. `src-`- und `-src-`-Varianten):

```ts
const prefixesToRemove: string[] = [
  "images-testimonials-",
  "images-",
  "content-portfolio-",
  "content-simple-"
].flatMap(e => [`src-${e}`, `-src-${e}`]);
```

5. Entferne die Dateierweiterung (z.B. `.jpg`, `.JPG`) am Ende des Pfads.
6. **Eindeutigkeit erzwingen:** Alle Dateinamen/Slugs eines Beitrags MÜSSEN untereinander verschieden sein. Kommt derselbe `filename`/`slug` mehrfach vor, hänge einen numerischen Suffix an (z.B. `-2`, `-3`), sodass keine Kollision entsteht.
7. Gib **ausschließlich** das fertige Array in einem Codeblock aus – sofern keine Bilder zur Analyse vorliegen.

### Dateiname → Slug (verbindliche Formel)

Der Slug je Bild wird **automatisch** von `add-metadata.mjs` aus dem relativen Pfad ab `src/` erzeugt. Er muss daher im MDX **exakt** diesem Muster entsprechen – **nicht raten, sondern immer aus dem Ordnerpfad ableiten**:

1. **Slug-Präfix ableiten:** Relativen Ordnerpfad des Beitrags ab `src/content/` nehmen, `/` durch `-` ersetzen und den Präfix `content-portfolio-` entfernen. Ergebnis ist der Präfix (endet mit `-`).

   `src/content/portfolio/sport/football/afl/2026-playoff-dragons-vikings/<bild>.jpg`
   → Präfix: `sport-football-afl-2026-playoff-dragons-vikings-`

2. **Slug bilden:** Präfix + Bilddateiname (ohne Endung):

   `.../vienna-vikings-touchdown.jpg` → `sport-football-afl-2026-playoff-dragons-vikings-vienna-vikings-touchdown`

3. **Kurzform (identisches Ergebnis):** `portfolio/…`-Teil des Pfads weglassen → Rest des Pfads mit `/`→`-`, dann Dateiname anhängen.

Der Präfix des Beitrags ist also **immer** der Ordnerpfad ab `src/content/portfolio/` (mit `/`→`-`), gefolgt von einem Bindestrich pro Bilddateiname.

## 1b) Fertiger Gallery-Import

Für Beiträge unter `src/content/portfolio/sport/football/afl/<slug>/index.mdx` (z.B. `2026-playoff-dragons-vikings`) gilt **immer**:

```mdx
import Gallery from "../../../../../../components/Gallery.astro";
```

**Zählregel (robust):** Anzahl der `..` = Anzahl der Pfadsegmente von `src/` bis inkl. Beitragsordner. Beispiel `content/portfolio/sport/football/afl/<slug>` = 6 Segmente → 6 `..`. Kürzere Pfade entsprechend weniger: `content/portfolio/beauty/<slug>` = 4 Segmente → `../../../../components/Gallery.astro`.

## 2) Hero-Image-Identifikation

1. Bestimme das SEO-technisch beste Bild für den Beitrag.
2. Bevorzuge **Querformat** (Landscape) für die Hero-Position.
3. Gib es in einem separaten Codeblock als `heroImage` aus.
4. Verfasse eine kurze, sachliche Begründung für die Wahl.

## 3) Galerien & Platzierung

- Erzeuge mehrere Galerien, wenn es inhaltlich sinnvoll ist (z.B. `IMAGES_HIGHLIGHTS`, `IMAGES_ACTION`, `IMAGES_IMPRESSIONS`).
- Liegt der Artikel vor, schlage konkrete Positionen der Galerien im Text vor. Standard: eine Galerie am Ende des Artikels.
- Nenne für jede Galerie einen passenden Variablennamen und ggf. eine kurze thematische Einordnung.

## 4) Output-Beschränkungen

- Halte dich strikt an „Keine weitere Ausgabe“ außerhalb der geforderten Codeblöcke und der Hero-Image-Begründung.
- Keine Begrüßungen, keine Einleitungen, kein Smalltalk.

## Ton

Professionell, minimalistisch, rein funktional.
