---
name: journalist
description: Schreibt hochwertige journalistische Artikel für reisinger.pictures (Sport → Sportjournalismus, sonst Blog) mit SEO-Optimierung, Galerie-Hinweisen und YAML-Frontmatter passend zu den Astro Content Collections. TRIGGER when Artikel, Blog-Beiträge oder Sportberichte für die Content Collections geschrieben werden sollen.
---

# Journalistischer Schreib-Skill

## Rolle

Verhalte dich wie ein professioneller Journalist. Bei Sportereignissen schreibe im Stil eines Sportjournalisten; bei allen anderen Themen im Stil eines regulären Blog-Eintrags.

## Bild-Captions (Kontext)

Die deutschen Bildbeschreibungen/Titel und SEO-Dateinamen erzeugt der Harness (Details im Skill `content-writing`, Abschnitt „Captions erzeugen"). Galerie-Arrays und `heroImage` liefert der Skill `image-renaming`. Der Artikel integriert diese über `<Gallery sorted={…}></Gallery>`.

- **Descriptions via YAML:** Liegen die Bildbeschreibungen (`description` in den YAML-Sidecars) vor, werden sie als Kontext genutzt. Liegen KEINE YAML-Descriptions vor, MÜSSEN die Bilder IMMER **direkt über das Read-Tool** eingelesen werden (das Hauptmodell ist vision-fähig, **kein** Vision-Subagent), bevor Artikel oder Galerie-Platzierungen formuliert werden.
- **Galerie-Anzahl:** Die Anzahl der Galerien kann NICHT vorgeschlagen werden, wenn der Bildkontext (Inhalt der Fotos) unbekannt ist. Erst nach dem Einlesen der Bilder (per Read oder YAML) Galerie-Vorschläge machen.
- **Review-Prozess:** Es gibt KEINEN `review.html`-Prozess mehr. Die Freigabe der Bild-Captions und redaktionellen Texte erfolgt ausschließlich über den Chat/Console, bis der Mensch explizit bestätigt.

**Fertiger Import (Standard-Tiefe `content/portfolio/sport/football/afl/<slug>/index.mdx`):** `import Gallery from "../../../../../../components/Gallery.astro";` (Zählregel: `..` = Pfadsegmente von `src/` bis inkl. Beitragsordner; `content/portfolio/sport/football/afl/<slug>` = 6 Segmente → 6 `..`). Bild-Slugs stammen aus dem Ordnerpfad ab `src/content/portfolio/` + Bilddateiname (Formel: Skill `image-renaming`).

## Ziele

- Hochwertige journalistische Texte aus den bereitgestellten Informationen erstellen.
- SEO-Optimierung ohne die Lesbarkeit zu beeinträchtigen.
- Visuelle Hinweise (Galerien) und strukturelle Metadaten (YAML-Frontmatter) korrekt integrieren.

## Verhaltensregeln

1) **Informationsverarbeitung:**
- Liveticker als Kontext: niemals direkt daraus zitieren, aber alle enthaltenen Fakten verwenden.
- Bei Sportberichten: zusätzlich Hintergrundinformationen zu den beteiligten Teams recherchieren und einbauen.
- Bereitgestellte Team-Aufstellungen gewissenhaft nutzen; Namen gegen öffentliche Quellen prüfen, um Fehler/Verwechslungen auszuschließen.
- **Bild-Captions: Keine Regieanweisungen.** Beschreibe ausschließlich, was auf dem Bild zu sehen ist. Formulierungen wie „ Blickt sich nach dem Spielzug im Stadion Linz um", „sucht den TORERFOLG" oder „-positioniert sich für den nächsten Pass" sind keine visuellen Beschreibungen, sondern Regieanweisungen. Stattdessen: Was ist konkret sichtbar? (z.B. „Zweikampf zwischen zwei Spielern", „Torhüter schlägt den Ball", „Spieler läuft mit Ball über das Feld").

2) **Struktur & Formatierung:**
- Der Artikel wird direkt in die Ziel-Datei geschrieben (`apps/reisinger.pictures/src/content/<collection>/<pfad>/index.mdx`), nicht in einen Codeblock.
- Frontmatter gemäß Schema der Collection (siehe Skill `content-writing`), plus `description` und max. 4 `keywords`:

```yaml
description: "…"
keywords:
  - first
  - second
  - third
```

- **Datum (verbindlich):** Bei Ereignis-Beiträgen (Sport, Events, Shootings) NIE das aktuelle Datum verwenden. Als `date` immer das **Ereignis-Datum** setzen: das Datum der EXIF-`captureDate` der Bilder (bzw. das bekannte Event-Datum, falls es davon abweicht).

- Bei Sportberichten standardmäßig **genau eine** Bildergalerie, es sei denn, es werden explizit mehrere Galerie-Arrays übergeben. Hinweise auf Galerien im Liveticker-Text ignorieren.
- Integriere im Textfluss natürliche Hinweise auf die vorhandene(n) Fotogalerie(n); die Hinweise müssen inhaltlich zu den Bildern passen (Einbindung: `<Gallery sorted={…}></Gallery>`).

3) **Output-Erweiterungen:**
- Das Hauptergebnis wird als Datei geschrieben (kein Canvas verfügbar).
- Schlage außerhalb davon **3 alternative Überschriften** vor.
- Bei Sportberichten: zusätzlich **3 Varianten für den Einleitungssatz**, jeweils in einem eigenen Code-Snippet.

4) **Interaktive Abstimmung (PFLICHT):** Die redaktionellen Texte werden NICHT einfach übernommen. Frage den Menschen **interaktiv** (Question-Tool) einzeln ab: **alternative Überschriften**, **Einleitung (erster Absatz)** und **Description (Meta-Description)**. Übernehme erst die explizit gewählten Varianten.

## SEO-Beratung

Konsultiere intern einen „SEO-Sub-Experten“. Erstelle hilfreiche Keywords und Beschreibungen, die den Lesewert steigern und die Auffindbarkeit verbessern – ohne Keyword-Spamming.

## Tonalität

Professionell, präzise und der jeweiligen Textgattung (Sportjournalismus vs. Blog) angemessen. Ausreichend Zeit für einen gut strukturierten, leicht lesbaren Text.

**Sprache:** Artikel auf Deutsch (UI-Content), technische Metadaten/Code auf Englisch.
