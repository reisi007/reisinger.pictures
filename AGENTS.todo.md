# 🚀 Florian Reisinger Fotografie - Monorepo Backlog

## Done ✅
- [x] **Formular-UX & Fokus:** Dauerhaft sichtbare Rahmen für alle Eingabefelder im Kontaktformular von `all-the.rest`. Markanter, doppelter Rahmen bei aktivem Fokus (Kombination aus Border & Outline-Offset).
- [x] **Tarif-Konfigurator V2 (all-the.rest):**
  - Einzelpreise an Knöpfen und Sliders entfernt für ungestörte mathematische Übersicht.
  - Leistungsmerkmale (1,5 - 2h Zeit & Bilderanzahl) permanent live in die Preis-Box gekoppelt.
  - Native, hochkontrastierte DaisyUI-Komponenten (Schieberegler & Checkbox) ohne Behelfs-Workarounds integriert.
  - Bidirektionalen Live-Sync der Einstellungen direkt in die URL-Query-Parameter scharfgeschaltet (Deep-Linking/Sharing bereit).
- [x] **Schutzraum & Kundenpsychologie:** Internes `_gelb`/`_rot` System in verständliche Kundensprache übersetzt (🟢 Online-Portfolio-Modus vs. 🔴 Absolutes Online-Verbot). Strikte Schutzbarriere für unüberlegte Klicks eingeführt (+100 € Grundgebühr und +5 € pro Bild Aufpreis).
- [x] **Startseiten-Reparatur:** Einleitungstext aus der Overview-Collection geladen, gerendert und nahtlos mit den drei Fokus-Karten verknüpft.
- [x] **Dead-Code-Cleanup:** Nicht mehr genutzte Richtlinien-Dropdowns (`BadWeather.astro`, `DiscountPolicy.astro`) physisch gelöscht und Imports bereinigt.
- [x] **Modularer Deployment-Stack:**
  - Deployment-Lebenszyklen komplett entkoppelt. Unabhängige `docker-compose.yml` Dateien direkt dezentral in `apps/all-the.rest/deployment/` und `apps/reisinger.pictures/deployment/` abgelegt. Globalen Root-Ordner keimfrei gelöscht.
  - Skripte in `package.json` um domainbasierte Aufrufe mit automatisiertem Vortask (`pnpm exec astro check`) erweitert.
  - Vier maßgeschneiderte IntelliJ Run Configurations erstellt, um zwischen vollem `Build & Sync` (mit Astro Check Absicherung) und schnellem `Sync Only` (Express-Upload) wählen zu können.

## Open / Next Up ⏳
- [ ] **Tailwind Source-Paths dynamisieren (`all-the.rest`):** In `apps/all-the.rest/src/styles/global.css` relative Pfad-Ketten durch robuste Workspace-Pfad-Zuweisungen oder die `@source`-Direktive ersetzen, um relative Pfad-Instabilitäten zu eliminieren.
- [ ] **B2B Landingpage implementieren (`reisinger.pictures`):** In `apps/reisinger.pictures/src/pages/index.astro` das minimale Platzhalter-Skelett durch die finale, kommerziell ausgerichtete Premium-B2B-Landingpage (Corporate-, Industrie- und Eventfotografie) unter Verwendung des vorbereiteten `theme-b2b` ersetzen.
- [ ] **Deployment-Ports absichern (`127.0.0.1` Isolation):** Die dezentralen Ports `8081` (`all-the.rest`) und `8082` (`reisinger.pictures`) in den jeweiligen `docker-compose.yml`-Dateien explizit an `127.0.0.1` binden, damit sie nicht öffentlich über die Server-IP erreichbar sind. Dokumentation pflegen und sicherstellen, dass der vorgelagerte, zentrale Host-Reverse-Proxy das TLS-Mapping sauber durchreicht.
- [ ] **WKO-Wirtschaftskammer-Profil verlinken:** Sobald das B2B-Portal online ist, den Text- und Backlink-Payload des offiziellen WKO-Firmenprofils überarbeiten, um gezielt Corporate-Entscheider auf `reisinger.pictures` zu lenken und Premium-Positionierung zu spiegeln.
