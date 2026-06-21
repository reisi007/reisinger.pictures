# SEO & Seiten-Architektur (Hub & Spoke)

## URL-Erhaltung (Keine toten Links)
- **Bestehende URLs dürfen nicht verändert werden:** Team-Seiten wie `/sport/lask`, `/sport/bwl`, `/sport/acsl` bleiben auf ihrer flachen Hierarchie-Ebene in `src/content/areas/sport/`.
- **Neue Struktur durch Hub-Pages:** Um Sportarten thematisch zu bündeln, werden neue Hub-Pages erstellt (z.B. `fussball.mdx`, `american-football.mdx`). Diese fungieren als Landing Pages.
- **Routing:** Die Hauptseite `/sport` verlinkt auf die Hub-Pages (Sportarten). Die Hub-Pages verlinken auf die spezifischen Team-Seiten (Speichen).
- **Vorteil:** Maximale Usability und Funnel-Fokus für Kunden, ohne bestehende Google-Rankings zu zerstören.

## Sonderfall Multi-Sport (z.B. ACSL)
- Multi-Sport-Vereine/Ligen behalten ihre allgemeine URL (z.B. `/sport/acsl`). 
- Die Inhalte werden thematisch auf den jeweiligen Sport-Hubs (Football, Basketball) angeteasert und von dort auf die allgemeine Team-Seite verlinkt.
