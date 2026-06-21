# Namenskonventionen & Fallbacks

## Team-Abkürzungen: BWL vs. SKV
- **Eishockey (Black Wings Linz):** Nutzt das Kürzel `bwl` durchgehend (sowohl in `areas/sport/bwl.md` als auch in den `einblicke`-Ordnern).
- **Fußball (Blau-Weiß Linz):** Nutzt für die Landingpage (Areas) das Kürzel `skv` (`areas/sport/skv.md`), um URL-Konflikte zu vermeiden. In den `einblicke`-Ordnern (z.B. `grunddurchgang-12-bwl-ask`) wird es hingenommen, da die Namen ohnehin hardcoded im Frontmatter der MDX-Dateien stehen.
- **Logos:** Es werden **keine** Vereinslogos mehr verwendet (Markenrecht).
- **KISS-Prinzip:** Keine komplexen Resolver-Funktionen in `utils.ts`. Frontmatter-Titel und klare Area-Pfade (`/sport/bwl` vs `/sport/skv`) reichen aus.
