# 🚀 Florian Reisinger Fotografie - Monorepo Backlog

## Open / Next Up ⏳
- [ ] **SEO-Struktur- & Content-Optimierung:** Vollständiger Audit-basierter Plan. Details siehe Abschnitt **SEO Workstreams** unten.
- [ ] **WKO-Wirtschaftskammer-Profil verlinken:** Text- und Backlink-Payload überarbeiten, um Corporate-Entscheider auf `reisinger.pictures` zu lenken.

---

## 📈 SEO Workstreams
> **Hinweis:** Historische Pfade (`apps/story.reisinger.pictures`, `apps/all-the.rest`) sind veraltet — App wurde zu `apps/reisinger.pictures` konsolidiert. **Sprints 1–5 abgeschlossen und bereinigt** und dienen als Dokumentation. Offen verbleiben nur die Content-Pflege-Tasks (siehe unten).

> Basis: Vollständiger SEO-Audit (Infrastruktur, Content, technisch). Siehe `rules/` für Architektur-Entscheidungen.

### Sprint 3 — Content & Descriptions
- [ ] **E3+E4b — Content-Pflege: 56 Portfolio-Posts ohne authored Description:** Fallback ist aktiv, aber für maximalen SEO-Wert sollten die folgenden Posts eine echte, von Hand verfasste Description (140–160 Zeichen) erhalten. *Datei-Liste siehe Block **„Portfolio-Posts: Description nachbessern"** unten.*

### Sprint 4 — Blog-Umbau Portfolio
- [ ] **E4b — Blog-Content für ~40 thin-content-Beiträge verfassen:** Kategorie-spezifische Texte (Sport=Bundesliga, Beauty=Portrait-Ansatz etc.). HITL-Workflow via `human-loop/` für strukturierte Befüllung.

---

## 🌐 Caddy SEO-Konfiguration *(Erledigt)*
> **Wichtig:** Deployment erfolgt via rclone → Caddy (nicht nginx). Alle Punkte sind im zentralen `caddyfile/Caddyfile` umgesetzt (Snippets: `security_headers`, `www_redirect`, `compress`, `caching_rules`). Betrifft alle Projekte in dieser Caddyfile: `reisinger.pictures`, `all-the.rest`, `alfred-grof.com`, `form/dev/contacts.reisinger.pictures`, `portainer.reisinger.pictures`, `portal/buy.reisinger.pictures`.

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
