# Projekt-Roadmap: Professionalisierung reisinger.pictures

## Phase 2: "Human In The Loop" (HIL) Bildauswahl & Kuration (Fokus für Morgen) ⏳
- [ ] **Hero- und Übersichts-Bilder:** Florian wählt für *jede* Übersichtsseite (Sport, Business, Privat, Unterkategorien) manuell die stärksten Highlight-Bilder aus.
- [ ] **Galerien reduzieren ("Kill your Darlings"):** Quantität runter, Qualität hoch. Unterseiten auf max. 10–20 absolute Hero-Shots einkürzen - auch hier wählt Florian die Bilder.

## Phase 4: Long-Term (Fine-Art & Editor) 🖼️
- [ ] **Bildrechte klären:** TFP-Verträge und Model-Releases auf kommerzielle Verwertbarkeit für Print-Verkäufe prüfen.
- [ ] **Übersichtsseite konzipieren:** Eine dedizierte Fine-Art-Print Übersichtsseite entwerfen (vorerst als reiner Showcase, später mit Kauf-Option).
- [ ] **Editor-Integration:** Print-Verkaufs-Option in das Backend/den Editor aufnehmen, um später nahtlos Bilder in den Shop zu pushen.


## Phase 5: UI-Standardisierung & Dialog-Formular 🎨
- [x] **ContactCTA.astro refaktorisieren:** Die Komponente `src/components/ContactCTA.astro` so anpassen, dass sie konsistente Standard-Texte, Icons und Tooltips für die Props `type="b2b"` und `type="b2c"` nutzt. 
- [x] **Modal/Dialog Trigger:** Sicherstellen, dass JEDER Button aus `ContactCTA.astro` ausschließlich den globalen Kontakt-Dialog öffnet (`<dialog>`), anstatt auf eine URL zu verlinken.
- [x] **Form.astro Dropdown bereinigen:** In `src/components/Form.astro` das Auswahlfeld für die Anfrageart auf 3 Optionen beschränken: 1. "B2B: Sport, Event & Corporate", 2. "B2C: Privat, Portrait & Fine-Art", 3. "TFP / Model-Anfrage".
- [x] **Globale CTA-Checks:** Alle `.mdx` Dateien in `src/content/areas/` prüfen und die `<ContactCTA />` Aufrufe an das neue Schema (ohne harte Text-Vorgaben im MDX, sondern via Typ) anpassen.