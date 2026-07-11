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
- [ ] **ResponsiveImage-Komponente generalisieren:** `ResponsiveImage.astro` inkl. `Images.ts` aus `story.reisinger.pictures` in das `shared`-Paket migrieren, um sie auf der B2B-Seite für den Fullscreen-Eyecatcher nutzbar zu machen (Image-Globbing Architektur beachten).
- [ ] **Logos erneuern:** Neues Logo für `story.reisinger.pictures` entwerfen und bestehendes Logo für `reisinger.pictures` aktualisieren.
- [ ] **B2B Theme & Colors:** B2B-Design zwingend auf ein helles, klares Theme (Light Mode) ausrichten. Dunkle Hintergründe kollidieren zu stark mit klinisch-weißen Business/Arzt-Fotos.
- [x] **Skripte generalisieren (Monorepo):** Folgende Skripte müssen allgemein gehalten werden und für beides (B2B/B2C) genutzt werden: `apps/story.reisinger.pictures/add-metadata.mjs`, `apps/story.reisinger.pictures/check_links.mjs`, `apps/story.reisinger.pictures/clean_output.mjs`.
- [ ] **Tailwind Source-Paths dynamisieren (`story.reisinger.pictures`):** In `apps/story.reisinger.pictures/src/styles/global.css` relative Pfad-Ketten durch robuste Workspace-Pfad-Zuweisungen oder die `@source`-Direktive ersetzen, um relative Pfad-Instabilitäten zu eliminieren.
- [x] **B2B Landingpage implementieren (`reisinger.pictures`):** 
  - [x] **BaseLayout.astro erstellen:** Flexibles Basis-Layout (html/body/Footer/FormModal) ohne prose-Container, für volle Breitenkontrolle auf der Landing Page.
  - [x] **`index.astro` erstellen:** Finale B2B-Landingpage mit: Hero (hero.jpg), 2 Service-Cards (Personal Branding, Event/PR → verlinken auf Unterseiten), Preis-Block ("ab 210€" mit Inklusivleistungen), USP-Band (3 Icons: Persönlich/Direkt/Transparent), About-Kurztext, CTA.
  - [x] **`personal-branding.md` erstellen:** Detailseite für Personal-Branding-Service (Ablauf, Leistungsumfang, CTA).
  - [x] **`eventfotografie.md` erstellen:** Detailseite für Event-/PR-Fotografie mit Portal-Verknüpfung.
  - [x] **`index.md` entfernen:** Alten Platzhalter löschen, `[...simple].astro` von `index`-Mapping befreien.
- [ ] **Deployment-Ports absichern (`127.0.0.1` Isolation):** Die dezentralen Ports `8081` (`story.reisinger.pictures`) und `8082` (`reisinger.pictures`) in den jeweiligen `docker-compose.yml`-Dateien explizit an `127.0.0.1` binden, damit sie nicht öffentlich über die Server-IP erreichbar sind. Dokumentation pflegen und sicherstellen, dass der vorgelagerte, zentrale Host-Reverse-Proxy das TLS-Mapping sauber durchreicht.
- [ ] **WKO-Wirtschaftskammer-Profil verlinken:** Sobald das B2B-Portal online ist, den Text- und Backlink-Payload des offiziellen WKO-Firmenprofils überarbeiten, um gezielt Corporate-Entscheider auf `reisinger.pictures` zu lenken und Premium-Positionierung zu spiegeln.
- [x] **Domain-Wechsel von `all-the.rest` zu `story.reisinger.pictures` in Konfigurations- und Quellcode-Dateien vollziehen:**
  - [x] `.gitignore`: Pfade `apps/all-the.rest/...` zu `apps/story.reisinger.pictures/...` anpassen.
  - [x] `.idea/runConfigurations/`: XML-Dateien umbenennen und Inhalte auf `story.reisinger.pictures` und `build:story.reisinger.pictures` anpassen.
  - [x] `apps/reisinger.pictures/public/robots.txt`: Sitemap-URL von `https://all-the.rest/...` zu `https://story.reisinger.pictures/...` aktualisieren.
  - [x] `apps/story.reisinger.pictures/package.json`: Paketname auf `story.reisinger.pictures` korrigieren.
  - [x] `apps/story.reisinger.pictures/public/robots.txt`: Sitemap-URL aktualisieren.
  - [x] `apps/story.reisinger.pictures/public/site.webmanifest`: App-Namen und Short-Name anpassen.
  - [x] `apps/story.reisinger.pictures/sync.bat`: Erfolgsmeldung für Upload anpassen.
  - [x] `package.json` (Root): Skript-Filter und Skript-Namen (`build:all-the.rest` -> `build:story.reisinger.pictures`) anpassen.
  - [x] `packages/shared/components/Form.astro`: Fallback-Hostnames und Formular-Aktions-URL (`form.all-the.rest` -> `form.story.reisinger.pictures`) anpassen.
  - [x] `packages/shared/styles/base.css`: Kommentar zur B2C-Theme-Beschreibung aktualisieren.

