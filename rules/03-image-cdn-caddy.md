# Regel 03 – Bild-CDN (images.reisinger.pictures) & Caddy-Konfiguration

## Kontext
Bilder werden im Astro-Build nach `.imagedist/` geschrieben und via `rclone` auf den
Remote `reisinger.pictures:/images.reisinger.pictures` (Server-Pfad
`/srv/websites/images.reisinger.pictures`) hochgeladen. Ausgeliefert werden sie über
Caddy (Subdomain `images.reisinger.pictures`) – kein nginx-Container mehr.

## Gelungsregeln
- **Caching:** Alle Bildassets (`.webp`, `.avif`, `.jpg`, `.jpeg`, `.png`, `.gif`,
  `.svg`) sowie `/_astro/*` werden mit `public, max-age=31536000, immutable` ausgeliefert.
  Astro benennt Assets hash-basiert, daher ist langes Cache sicher.
- **Kein Cache:** `.html`, Root (`/`) und 404-Antworten erhalten `no-cache`,
  `no-store`, `must-revalidate` (über den `(cdn)`-Snippet in der Caddyfile).
- **404-Verhalten bei direkten Zugriffen:** Reines `404` ohne Redirect. Ein CDN liefert
  keine schöne 404-Seite aus – Bilder werden ohnehin nur per Hash-URL referenziert.
- **Struktur:** Die Caddy-Konfiguration nutzt einen wiederverwendbaren `(cdn)`-Snippet.
  Inline-Duplikate des Caching-Blocks sind verboten.

## Deployment / Validierung
- Validierung der Caddyfile vor jedem Reload mit einem temporären Container:
  ```bash
  docker run --rm -v "$(pwd)/Caddyfile:/etc/caddy/Caddyfile" caddy:latest \
    caddy validate --config /etc/caddy/Caddyfile
  ```
- Nach erfolgreicher Validierung: `docker compose -f deployment/docker-compose.yml up -d`
  (Container `caddy` lädt die Config automatisch neu, sofern Volume gemountet).
