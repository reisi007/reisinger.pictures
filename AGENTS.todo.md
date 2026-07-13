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
- [ ] **SEO-Struktur- & Content-Optimierung:** Vollständiger Audit-basierter Plan. Details siehe Abschnitt **SEO Workstreams** unten.
- [x] **ResponsiveImage-Komponente generalisieren:** `ResponsiveImage.astro` nutzt jetzt `getImage()` statt `<Image>` — keine JPG-Fallbacks mehr, nur WebP. Migration ins `shared`-Paket nicht nötig da nur noch eine App existiert.
- [x] **Logos erneuern:** Nur noch eine Domain (`reisinger.pictures`). Logo-Update bei Bedarf separat.
- [x] **B2B Theme & Colors:** Hinfällig durch App-Konsolidierung. Ein Theme für alle.
- [x] **Skripte generalisieren (Monorepo):** `add-metadata.mjs`, `check_links.mjs`, `clean_output.mjs` liegen in `packages/tools/scripts/` und werden von `apps/reisinger.pictures` verwendet.
- [x] **Tailwind Source-Paths dynamisieren:** Hinfällig — nur noch eine App.
- [x] **Business-Seiten zu reisinger.pictures hinzugefügt (Phase 2):**
  - [x] `personal-branding.mdx` — Business-Portraits, ab 210€, CTA
  - [x] `eventfotografie.mdx` — Event/PR-Fotografie mit Portal-Verweis, ab 156€
  - [x] Homepage-Grid auf 2x2 erweitert (4. Karte: Personal Branding)
  - [x] SchemaOrg um `hasOfferCatalog` mit 4 `Service`-Nodes erweitert
  - [x] Sitemap-Priorities für Business-Seiten (0.9) und Portal (0.7)
- [x] **App-Konsolidierung (Phase 1):** `apps/reisinger.pictures` (alt) gelöscht, `apps/story.reisinger.pictures` → `apps/reisinger.pictures`. Eine App, eine Domain.
- [x] **Pricing-Restrukturierung (Phase 1):** Standard-Tarif (50€ + 80€/h), Profi-Kalkulator, Flex-Tarif versteckt, Studenten-/Freunde-Rabatte.
- [ ] **Deployment-Ports absichern (`127.0.0.1` Isolation):** Port `8081` in `apps/reisinger.pictures/deployment/docker-compose.yml` an `127.0.0.1` binden.
- [ ] **WKO-Wirtschaftskammer-Profil verlinken:** Text- und Backlink-Payload überarbeiten, um Corporate-Entscheider auf `reisinger.pictures` zu lenken.
- [x] **Domain-Wechsel von `all-the.rest` zu `story.reisinger.pictures`** — erledigt, dann weiter zu **reisinger.pictures** konsolidiert.

---

## 📈 SEO Workstreams
> **Hinweis:** Historische Pfade (`apps/story.reisinger.pictures`, `apps/all-the.rest`) sind veraltet — App wurde zu `apps/reisinger.pictures` konsolidiert. Alle Tasks sind abgeschlossen (`[x]`) und dienen als Dokumentation.

> Basis: Vollständiger SEO-Audit (Infrastruktur, Content, technisch). Siehe `rules/` für Architektur-Entscheidungen.

### Sprint 1 — Quick Wins (kritische Bugs + Alt-Texte + Sitemap-Fix)
- [x] **A1 — B2B robots.txt: falsche Sitemap-Domain korrigieren:** `apps/reisinger.pictures/public/robots.txt:4` verweist auf `https://story.reisinger.pictures/sitemap-index.xml`. **Soll:** `https://reisinger.pictures/sitemap-index.xml` (jede App auf die eigene Sitemap). *Hinweis: Beim Domainwechsel `all-the.rest→story` (Zeile 35 oben) pauschal umgestellt — war damals korrekt, ist jetzt falsch, da B2B eigene Sitemap hat.* **(Ready for Review)**
- [x] **A+1 — Story-Sitemap-Erzeugung verifizieren & fixen:** Im `apps/story.reisinger.pictures/dist/` wurde keine `sitemap-index.xml` gefunden. (1) Clean rebuild `rm -rf dist && pnpm build:b2c`. (2) Prüfen, ob `dist/sitemap-index.xml` + `sitemap-0.xml` entstehen. (3) Falls nicht: Sitemap-Integration in `astro.config.mjs:39` debuggen. (4) Sicherstellen, dass nur Story-URLs enthalten sind. **(Ready for Review)**
- [x] **A+2 — B2B-Sitemap verifizieren:** Nach A1 verweist B2B `robots.txt` auf `https://reisinger.pictures/sitemap-index.xml`. Prüfen, dass nur B2B-URLs enthalten (keine `/portal/`, `/thankyou/` falls ungewünscht → ggf. via `filter` ausschließen). **(Ready for Review)**
- [x] **A2 — Twitter-Meta-Tags: `property=` statt `name=` fixen:** `apps/story.reisinger.pictures/src/components/BaseHead.astro:45-48` (`twitter:url`, `twitter:title`, `twitter:description`) und `SocialImage.astro:35-36` (`twitter:image`, `twitter:image:alt`) verwenden `property=`. **Soll:** `name=` (Twitter ignoriert `property=`). `twitter:card` (SocialImage:37) ist bereits korrekt. **(Ready for Review)**
- [x] **A3 — Nicht-Standard `<meta name="og:description">` entfernen:** `apps/story.reisinger.pictures/src/components/BaseHead.astro:30` verwendet `name=` für OG-Tag (ungültig; redundant mit korrekter `property=og:description` in L43). Zeile entfernen. **(Ready for Review)**
- [x] **A5 — Duplikat `<meta charset>` in Story:** `MinimalPage.astro:21` und `BaseHead.astro:22` emitieren beide `<meta charset="utf-8">`. Aus `BaseHead.astro:22` entfernen. **(Ready for Review)**
- [x] **A6 — `noindex`-Direktive vereinheitlichen:** Story `BaseHead.astro:51` = `noindex, follow`; B2B `BaseHead.astro:29` = `noindex, nofollow`. **Soll:** Beide `noindex, follow` (Link-Equity-Weitergabe erlaubt). **(Ready for Review)**
- [x] **B1 — Alt-Texte für Galerie-Bilder auto-populieren (höchste Priorität):** `ImageGallery.astro:17` ruft `<ResponsiveImage name={image}/>` ohne `alt` → `ResponsiveImage.astro:28` defaultet auf `alt=""`. YAML-`title` ist via `getMetadataForImageSlug()` bereits geladen, wird aber verworfen. **Änderung:** `ResponsiveImage.astro`: `alt = data?.title ?? alt` (Fallback auf explizites prop, sonst YAML-title). Betrifft alle `/shootings/*`, `/portfolio/*`, Testimonials. **(Ready for Review)**
- [x] **E6 — Chinesische Zeichen in Testimonial-Summary korrigieren:** `apps/story.reisinger.pictures/src/content/testimonialSummary.json` (Sport-Eintrag): „…die公关-wirksamen Aufnahmen…" → „…die PR-wirksamen Aufnahmen…". Sichtbarer SEO-Text. **(Ready for Review)**
- [x] **E7 — Heading-Hierarchie `/preise/`:** `apps/story.reisinger.pictures/src/content/simple/preise.mdx:10` nutzt `<h3>` direkt unter H1 (H1→H3-Sprung). **Soll:** `<h2>`. **(Ready for Review)**
- [x] **H2 — Dead Config entfernen:** `apps/story.reisinger.pictures/astro.config.mjs:7-9` (`excludedPages = ["ogs/"]`) filtert nicht-existierenden Pfad. Entfernen (Teil von A+1). **(Ready for Review)**

### Sprint 2 — B2B-SEO-Grundausstattung
- [x] **A4 — B2B `site.webmanifest` fehlt (404):** `apps/reisinger.pictures/src/components/BaseHead.astro:21` referenziert `/site.webmanifest`, Datei fehlt in `apps/reisinger.pictures/public/`. Analog zu story anlegen (theme_color `#1E5631`, standalone). **(Ready for Review)**
- [x] **C1 — B2B `BaseHead.astro` um OG/Twitter erweitern:** OG-Tags (`og:type`, `og:url`, `og:title`, `og:site_name`, `og:locale=de_AT`, `og:description`) und Twitter-Tags (`twitter:card=summary_large_image`, `twitter:title`, `twitter:description`) hinzufügen — korrekt mit `name=` für Twitter. **(Ready for Review)**
- [x] **C2 — Default/Fallback OG-Image einführen:** Beide Apps: statisches `public/og-default.jpg` (1200×630) ablegen, in `BaseHead` als Fallback, wenn kein seiten-spezifisches Bild (Story `SocialImage.astro:14` rendert sonst nichts). **(Ready for Review)**
- [x] **C3 — Sitemap-Link im B2B-Head:** `apps/reisinger.pictures/src/components/BaseHead.astro` um `<link rel="sitemap" href="/sitemap-index.xml" />` ergänzen. **(Ready for Review)**
- [x] **C4 — `keywords`-Support im B2B-BaseHead:** Analog zu Story ergänzen (optional, Konsistenz). **(Ready for Review)**
- [x] **F2 — Custom `404.astro` für B2B:** Neu: `apps/reisinger.pictures/src/pages/404.astro`. Branding-konform (deutsch), H1 „Seite nicht gefunden", CTAs (Personal Branding, Eventfotografie, Anfrage). `noindex`. **(Ready for Review)**
- [x] **D1 — B2B: SchemaOrg-Infrastruktur übernehmen:** `SchemaOrg.astro` + `SchemaOrg.factory.ts` nach B2B adaptieren. Mindest: `LocalBusiness`/`ProfessionalService`, `Service` für Personal Branding & Eventfotografie. **(Ready for Review)**
- [x] **D2 — `LocalBusiness`/`ProfessionalService` als Top-Level-Node (beide Apps):** Story erzeugt `Organization` nur als `publisher`/`author`. Top-Level-`LocalBusiness`-Node ausrollen (`address`, `geo`, `telephone`, `openingHoursSpecification`, `priceRange`, `image`). **(Ready for Review)**
- [x] **G1 — Caddy-Anleitung als offenen TODO dokumentieren (User-Aufgabe):** Siehe separaten Block **„Caddy SEO-Konfiguration"** unten. *(Erledigt — aktualisiert)*.

### Sprint 3 — Content & Descriptions
- [x] **E1 — Schema: `description` verpflichtend:** `apps/story.reisinger.pictures/src/content.config.ts`: portfolioOverviews + areas `description` ins Zod-Schema aufgenommen (optional, da Bestand leer). Portfolio bleibt optional bis Sprint 4 (Blog-Umbau). **(Ready for Review)**
- [x] **E2 — `areas`-Description an BaseHead durchreichen:** `apps/story.reisinger.pictures/src/pages/shootings/[...area]/index.astro`, `portfolio/[...overview]/[...page].astro` — description jetzt an BaseHead + SchemaOrg durchgereicht. Overview hat Fallback-Beschreibung. **(Ready for Review)**
- [x] **E3 — Meta Descriptions: Fallback-Logik implementiert:** `BlogPost.astro` generiert automatisch eine unique Description aus dem Titel, falls keine im Frontmatter steht. *Technische Lücke geschlossen — keine Seite mehr ohne meta description.* **(Ready for Review)**
- [ ] **E3+E4b — Content-Pflege: 56 Portfolio-Posts ohne authored Description:** Fallback ist aktiv, aber für maximalen SEO-Wert sollten die folgenden Posts eine echte, von Hand verfasste Description (140–160 Zeichen) erhalten. *Datei-Liste siehe Block **„Portfolio-Posts: Description nachbessern"** unten.*
- [x] **E5 — Generische Titel optimieren:** `[...page].astro` („Portfolio & Fotografie Blog – Seite {N}"); alle portfolioOverviews (Sport, Akt, Beauty, Natur, Turnen, Shootingtage); `shootings/[...area]/testimonials.astro` (keywordreiche Titel + descriptions für alle 4 Kategorien). **(Ready for Review)**
- [x] **D3 — `BreadcrumbList` JSON-LD:** `apps/story.reisinger.pictures/src/components/Breadcrumbs.astro` emitiert jetzt BreadcrumbList-JSON-LD auf allen Unterseiten. Für B2B noch offen (nach H1). **(Ready for Review)**
- [x] **D4 — `Review`/`Rating` für Testimonials aktivieren:** `/testimonials/{slug}` emitiert jetzt `Review`-JSON-LD mit reviewBody, Rating (0–100 → 5-Sterne-Skala), datePublished. Auf `/shootings/{area}/testimonials` noch offen (Collection). **(Ready for Review)**
- [x] **F1 — Custom `404.astro` für Story:** `apps/story.reisinger.pictures/src/pages/404.astro` erstellt. Branding-konform, CTAs, `noindex`. **(Ready for Review)**

### Sprint 4 — Blog-Umbau Portfolio
- [x] **EXIF-Overlay + PhotoSwipe Toggle:** `ResponsiveImage.astro` mit `showInfo`-Prop (Icon-Overlay mit Alt-Text + kompakter EXIF-Zeile, sichtbar bei Hover/Tap); `data-exif-*`-Attribute für PhotoSwipe; PhotoSwipe-Lightbox mit Toggle-Button (Caption standardmäßig AUS). Betrifft alle Galerie-Bilder (`ImageGallery.astro` → `showInfo`). **(Ready for Review)**
- [x] **E4a — BlogPost.astro Template ausbauen:** `apps/story.reisinger.pictures/src/components/pages/BlogPost.astro`: `article:published_time`/`modified_time` OG-Tags + description als Lead-Absatz. `BlogPosting`-JSON-LD bereits vorhanden. (Der „Über das Shooting"-EXIF-Abschnitt ist durch das Overlay+Lightbox-Feature obsolet — EXIF wird jetzt direkt am Bild gezeigt.) **(Ready for Review)**
- [ ] **E4b — Blog-Content für ~40 thin-content-Beiträge verfassen:** Kategorie-spezifische Texte (Sport=Bundesliga, Beauty=Portrait-Ansatz etc.). HITL-Workflow via `human-loop/` für strukturierte Befüllung.

### Sprint 5 — Konsolidierung
- [x] **H1 — SEO-Head-Logik ins `packages/shared` auslagern:** `packages/shared/seo/meta.ts` erstellt (`buildSeoMetaTags`, `canonicalUrl`). **(Ready for Review)**
- [x] **H3 — Business-Links auf Homepage:** 2x2 Grid mit Personal-Branding-Karte auf der Startseite. **(Ready for Review)**
- [x] **H4 — Cross-Linking:** Footer-Links intern vereinheitlicht (keine externen Domain-Verweise mehr). **(Ready for Review)**
- [x] **H5 — Interne Links Trailing-Slash konsistent:** Alle manuellen internen Links auf Trailing-Slash vereinheitlicht. **(Ready for Review)**
- [x] **D5 — `WebSite`-Schema:** `WebSite`-Schema auf Root. **(Ready for Review)**
- [x] **A+3 — Sitemap-Qualität:** `serialize`-Hook für `priority` (Home 1.0, Business 0.9, Shootings 0.8, Portfolio/TFP 0.7, Portal 0.7, Legal 0.3). **(Ready for Review)**
- [x] **App-Konsolidierung:** `apps/reisinger.pictures` (alt) gelöscht, `apps/story.reisinger.pictures` → `apps/reisinger.pictures`. Eine App, eine Domain.
- [x] **Pricing-Restrukturierung:** Standard-Tarif (50€ + 80€/h), Profi-Kalkulator, Flex-Tarif in Details versteckt. Studenten-/Freunde-Rabatte.
- [x] **Caddy-Konsolidierung:** `story.reisinger.pictures` 301→`reisinger.pictures`, alle Redirects entfernt, Container-Name vereinheitlicht.
- [x] **ResponsiveImage auf `getImage()` umgestellt:** Keine JPG-Fallbacks mehr, nur WebP.

---

## 🌐 Caddy SEO-Konfiguration *(Offen — User)*
> **Wichtig:** Dieser Block wird vom User manuell umgesetzt. Der Agent dokumentiert nur die Snippets und Erklärungen. Deployment erfolgt via rclone → Caddy (nicht nginx). Task-Status bleibt offen.

- [x] **(Offen — User) Permanente 301-Redirects** (statt Astro meta-refresh):
  ```caddy
  story.reisinger.pictures {
    redir * https://reisinger.pictures{uri} 301
  }
  ```
  > ✅ story.reisinger.pictures leitet jetzt per Wildcard auf reisinger.pictures um.

- [ ] **(Offen — User) www → non-www Redirect:**
  ```caddy
  reisinger.pictures {
    redir www.reisinger.pictures https://reisinger.pictures{uri} 301
  }
  ```

- [ ] **(Offen — User) Trailing-Slash-Normalisierung** (Duplikat-Content vermeiden):
  ```caddy
  @noslash path_regexp noslash ^/[^.]*[^/]$
  redir @noslash {http.matchers.noslash} 301
  ```

- [x] **(Offen — User) Cache-Control für `_astro/*` Assets** (Content-Hashed → immutable):
  ```caddy
  (caching_rules) {
    handle /_astro/* {
      header Cache-Control "public, max-age=31536000, immutable"
      reverse_proxy {args[0]}
    }
  }
  ```
  > ✅ Im `caching_rules` Snippet umgesetzt.

- [ ] **(Offen — User) Sicherheits-Header:**
  ```caddy
  header {
    X-Content-Type-Options nosniff
    Referrer-Policy strict-origin-when-cross-origin
    Permissions-Policy interest-cohort=()
  }
  ```

- [ ] **(Offen — User) Custom 404 via `handle_errors`** (damit `404.astro` ausgespielt wird):
  ```caddy
  handle_errors {
    @404 { expression {http.error.status_code} == 404 }
    rewrite @404 /404.html
    file_server
  }
  ```

- [ ] **(Offen — User) Kompression prüfen:** Caddy aktiviert Brotli/Gzip automatisch (`encode` default). Nur verifizieren, nicht zwingend konfigurieren.

- [x] **(Offen — User) Sync Astro-Redirects ↔ Caddy:** Redirects `/live → /portal` und `/privat/preise → /preise` liegen jetzt in `apps/reisinger.pictures/astro.config.mjs:12`. Da story.reisinger.pictures per Wildcard auf reisinger.pictures umleitet, werden sie korrekt aufgelöst.
  > ✅ Erledigt durch Konsolidierung.

---

## 📝 Portfolio-Posts: Description nachbessern (E3+E4b)
> **Status:** Fallback-Logik ist aktiv — keine Seite bleibt ohne meta description. Für maximalen SEO-Wert sollten folgende 56 Posts eine echte, von Hand verfasste Description (140–160 Zeichen, unique, keyword-reich) erhalten. Je nach Kategorie mit Fokus auf Location (Linz), Technik oder Event.
> Format-Vorschlag: `description: "Eindrücke vom [Event/Shooting] in [Location]. [Technik/Besonderheit]. Fotograf Florian Reisinger, Linz."`

### Akt (3)
- [ ] `akt/boudoir-fine-art/index.mdx` — „Boudoir / Fine-Art Shooting"
- [ ] `akt/milchbad-2/index.mdx` — „Milchbad Shooting"
- [ ] `akt/milchbad/index.mdx` — „Milchbad Shooting"

### Beauty (7)
- [ ] `beauty/anna-gras2025/index.mdx` — „Hohes Gras Shooting Anna"
- [ ] `beauty/clara-fruehling2025/index.mdx` — „Frühlingsshooting - Clara"
- [ ] `beauty/herbst2024/index.mdx` — „Herbst Shooting"
- [ ] `beauty/iris-studio2024/index.mdx` — „Tanz Shooting"
- [ ] `beauty/johanna-fruehling2025/index.mdx` — „Frühlingsshooting - Johanna"
- [ ] `beauty/laura-fruehling2025/index.mdx` — „Frühlingsshooting - Laura"
- [ ] `beauty/nicole-nacht2025/index.mdx` — „Linz bei Nacht mit Nicole"

### Events (3)
- [ ] `events/2024/klangwolke/index.mdx` — „Klangwolke 2024"
- [ ] `events/2024/pflasterspektakel/index.mdx` — „The Pole Jungle @ Pflasterspektakel Linz 2024"
- [ ] `events/2024/schneider-motorsport/index.mdx` — „Motorsport Event Bad Fischau"

### Natur (2)
- [ ] `natur/jku-fruehling2025/index.mdx` — „Enten & Teichrallen an der JKU"
- [ ] `natur/rf-200-800-entdeckungstour/index.mdx` — „Naturfotografie in Linz: Mit dem neuen RF 200-800mm auf Entdeckungstour"

### Reviews (1)
- [ ] `reviews/r1/index.mdx` — „Erfahrungen mir der Canon R1"

### Shootingtage (2)
- [ ] `shootingtage/linz-03-2024/index.mdx` — „Shootingtag Linz - Schlossmuseum"
- [ ] `shootingtage/wien-04-2024/index.mdx` — „Shootingtag Wien - Oper & Albertina"

### Sport (32)
- [ ] `sport/acsl/basketball-halbfinale-2024/index.mdx` — „ACSL Basketball Halbfinale 2024"
- [ ] `sport/acsl/bees-astros-2025/index.mdx` — „Boku Bees vs. JKU Astros Gameday"
- [ ] `sport/eishockey/ice/2023-24/qf2-bwl-rbs/index.mdx` — „Playoff Viertelfinale 2: Black Wings vs Red Bull Salzburg"
- [ ] `sport/eishockey/ice/2024-25/qf3-bwl-g99/index.mdx` — „Playoff Viertelfinale 3: Black Wings vs Grazer 99er"
- [ ] `sport/eishockey/ice/2024-25/qf5-bwl-g99/index.mdx` — „Playoff Viertelfinale 5: Black Wings vs Grazer 99er"
- [ ] `sport/eishockey/ice/2025-26/s8-bwl-rbs/index.mdx` — „Sieg in der Overtime: Linz zwingt den Meister in die Knie"
- [ ] `sport/fussball/bundesliga/2025-26/grunddurchgang-01-ask-sgr/index.mdx` — „Meisterlicher Auftakt: Sturm Graz setzt in Linz ein klares Statement"
- [ ] `sport/fussball/bundesliga/2025-26/grunddurchgang-03-ask-fak/index.mdx` — „Herzschlagfinale in Linz: LASK erkämpft sich nach Fehlstart die ersten Saisonpunkte"
- [ ] `sport/fussball/bundesliga/2025-26/grunddurchgang-04-bwl-svr/index.mdx` — „Ried triumphiert im OÖ-Derby: Pomer schießt Blau-Weiß tiefer in die Krise"
- [ ] `sport/fussball/bundesliga/2025-26/grunddurchgang-05-ask-svr/index.mdx` — „Effiziente Wikinger schocken den LASK: Ried feiert verdienten 3:1-Derbysieg in Linz"
- [ ] `sport/fussball/bundesliga/2025-26/grunddurchgang-20-ask-rbs/index.mdx` — „Traumdebüt für Beicher: Red Bull Salzburg deklassiert LASK im Spitzenspiel mit 5:1"
- [ ] `sport/fussball/cup/2025-26/runde-2-wels-st-poelten/index.mdx` — „Pokal-Krimi in Wels: St. Pölten zittert sich im Elfmeterschießen weiter"
- [ ] `sport/fussball/nero2024/index.mdx` — „Nero Summer Series Upper Austria 2024"
- [ ] `sport/fussball/nero2025/index.mdx` — „Nero Summer Series Upper Austria 2025"
- [ ] `sport/fussball/oefb/aut-cyp-2025/index.mdx` — „Österreich zittert sich zum 1:0-Sieg gegen Zypern"

### Trips (3)
- [ ] `trips/2024/budapest/index.mdx` — „Budapest 2024"
- [ ] `trips/2025/amsterdam/index.mdx` — „Amsterdam 2025"
- [ ] `trips/2025/prag/index.mdx` — „Grüner Zoo Prag - August 2025"

### Turnen (4)
- [ ] `turnen/pbs/2024/hauptplatz/index.mdx` — „Power Bros - Auftritt Hauptplatz Linz 2024"
- [ ] `turnen/pbs/2025/astros/index.mdx` — „Power Bros - Auftritt JKU Astros 2025"
- [ ] `turnen/studio2024/index.mdx` — „Turn Shooting"
- [ ] `turnen/tulz2025/index.mdx` — „Turnsportleistungszentrum TULZ- Portfolio ins Training"

