import { describe, expect, it } from "vitest";

import { buildBreadcrumbs, extractTestimonialId } from "./Breadcrumbs.config";

const noAncestors: { path: string; name: string }[] = [];

describe("buildBreadcrumbs", () => {
  it("liefert keine Vorfahren für die globale /testimonials-Seite", () => {
    expect(buildBreadcrumbs("/testimonials", noAncestors)).toEqual([]);
  });

  it("liefert die globale Seite als Parent für /shootings/beauty/testimonials", () => {
    expect(buildBreadcrumbs("/shootings/beauty/testimonials", noAncestors)).toEqual([
      { path: "/testimonials", name: "Alle Kundenbewertungen" }
    ]);
  });

  it("ersetzt Auto-Vorfahren für explizite Ebenen", () => {
    const areaAncestors = [{ path: "/shootings/akt", name: "Akt" }];
    expect(buildBreadcrumbs("/shootings/akt/testimonials", areaAncestors)).toEqual([
      { path: "/testimonials", name: "Alle Kundenbewertungen" }
    ]);
  });

  it("liefert Kategorie + Global für Testimonial-Detailseiten", () => {
    expect(buildBreadcrumbs("/testimonials/mintha1", noAncestors, "beauty")).toEqual([
      { path: "/testimonials", name: "Alle Kundenbewertungen" },
      { path: "/shootings/beauty/testimonials", name: "Beauty Kundenerfahrungen" }
    ]);
  });

  it("liefert ohne auflösbaren Typ die Auto-Vorfahren", () => {
    expect(buildBreadcrumbs("/testimonials/mintha1", noAncestors, undefined)).toEqual([]);
  });

  it("fällt ohne Treffer auf urlAncestors zurück", () => {
    const ancestors = [{ path: "/shootings/akt", name: "Akt" }];
    expect(buildBreadcrumbs("/shootings/akt", ancestors)).toEqual(ancestors);
  });
});

describe("extractTestimonialId", () => {
  it("extrahiert die id aus /testimonials/{id}", () => {
    expect(extractTestimonialId("/testimonials/mintha1")).toBe("mintha1");
  });

  it("liefert undefined für andere Pfade", () => {
    expect(extractTestimonialId("/testimonials")).toBeUndefined();
    expect(extractTestimonialId("/shootings/akt/testimonials")).toBeUndefined();
  });
});
