export type TestimonialTypeMeta = {
  title: string;
  description: string;
};

export const testimonialTypes: Record<string, TestimonialTypeMeta> = {
  beauty: {
    title: "Beauty Kundenerfahrungen",
    description: "Echte Kundenbewertungen & Erfahrungen zu Beauty- und Portrait-Fotoshootings in Linz bei Florian Reisinger. Authentische Stimmen, Ratings und Einblicke."
  },
  akt: {
    title: "Akt & Boudoir Kundenerfahrungen",
    description: "Vertrauensvolle Kundenbewertungen & Erfahrungen zu Akt- und Boudoir-Fotoshootings in Linz bei Florian Reisinger. Diskretion, Wohlfühlatmosphäre und Ergebnisse, die begeistern."
  },
  couples: {
    title: "Pärchen Kundenerfahrungen",
    description: "Kundenbewertungen & Erfahrungen von Paaren zu ihren Fotoshootings mit Florian Reisinger in Linz und Oberösterreich. Authentische Erlebnisse und zufriedene Kunden."
  },
  sport: {
    title: "Sport Kundenerfahrungen",
    description: "Kundenbewertungen & Erfahrungen zur Sportfotografie von Florian Reisinger. Vereine, Agenturen und Sportler loben Bundesliga-Erfahrung, schnelle Lieferung und PR-wirksame Bilder."
  }
};
