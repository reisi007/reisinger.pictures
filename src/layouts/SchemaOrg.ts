/**
 * Definiert den Kontext und den Typ für alle Schema.org-Objekte.
 * Dies ist die Basis für alle anderen Schema-Typen.
 */
export type BaseSchema = {
  /**
   * Der Kontext, der immer auf "https://schema.org" gesetzt sein muss.
   */
  "@context": "https://schema.org";
  /**
   * Der spezifische Typ des Objekts, z.B. "BlogPosting" oder "Review".
   */
  "@type": string;
}

/**
 * Repräsentiert ein Bildobjekt. Detaillierter als eine einfache URL.
 * Kann für Logos, Artikelbilder oder in Galerien verwendet werden.
 */
export type ImageObject = {
  "@type": "ImageObject";
  url: string;
  contentUrl: string;
  name?: string;
  description?: string;
  width?: number;
  height?: number;
  author?: Person | Organization;
  publisher?: Organization;
  copyrightHolder?: Person | Organization;
  datePublished?: string;
} & BaseSchema

/**
 * Repräsentiert eine Organisation, wie z.B. ein Unternehmen, eine Institution oder einen Verein.
 */
export type Organization = {
  "@type": "Organization" | "LocalBusiness";
  name: string;
  logo: string | ImageObject;
  url?: string;
  telephone?: string;
  address?: PostalAddress;
}

/**
 * Repräsentiert eine Person.
 */
export type Person = {
  "@type": "Person";
  name: string;
}

/**
 * Repräsentiert eine Postanschrift.
 */
export type PostalAddress = {
  "@type": "PostalAddress";
  streetAddress: string;
  addressLocality: string;
  postalCode: string;
  addressCountry: string;
}

/**
 * Repräsentiert ein Produkt, das verkauft oder angeboten wird.
 */
export type Product = {
  "@type": "Product";
  name: string;
  description?: string;
  image?: string | ImageObject;
  sku?: string; // Stock Keeping Unit
  brand?: Organization;
}

/**
 * Repräsentiert eine numerische Bewertung, z.B. Sterne.
 */
export type Rating = {
  "@type": "Rating";
  ratingValue: string;
  bestRating: string;
  worstRating?: string;
}

/**
 * Repräsentiert ein einzelnes Element in einer Liste (ItemList).
 */
export type ListItem = {
  "@type": "ListItem";
  position: number;
  item: {
    "@type": string;
    url: string;
    headline?: string;
    name?: string;
  };
}

/**
 * Ein Union-Typ, der alle Schema-Typen zusammenfasst, die bewertet werden können.
 */
export type ReviewableThing = Organization | WebPage | ImageObject | Product;

/**
 * Schema für eine einzelne Kundenbewertung oder ein Testimonial.
 */
export type Review = {
  "@type": "Review";
  itemReviewed: ReviewableThing;
  reviewRating?: Rating;
  name: string;
  author: Person;
  publisher: Organization;
  datePublished?: string;
  reviewBody: string;
} & BaseSchema

/**
 * Schema für einen Blog-Artikel.
 */
export type BlogPosting = {
  "@type": "BlogPosting";
  mainEntityOfPage: {
    "@type": "WebPage";
    "@id": string;
  };
  headline: string;
  description?: string;
  image: string | ImageObject;
  author: Person;
  publisher: Organization;
  datePublished?: string;
  dateModified?: string;
} & BaseSchema

/**
 * Schema für eine Übersichts- oder Kategorieseite, die eine Liste von Elementen anzeigt.
 */
export type CollectionPage = {
  "@type": "CollectionPage";
  name: string;
  description?: string;
  dateModified?: string;
  mainEntity: {
    "@type": "ItemList";
    itemListElement: ListItem[];
  };
} & BaseSchema

/**
 * Schema für eine generische, statische Inhaltsseite.
 */
export type WebPage = {
  "@type": "WebPage";
  name: string;
  description?: string;
  image?: string | ImageObject;
  author?: Person | Organization;
  publisher?: Organization; // ✅ HINZUGEFÜGT
  datePublished?: string;
  dateModified?: string;
  mainEntityOfPage: {
    "@type": "WebPage";
    "@id": string;
  };
  mainEntity?: SchemaObject;
} & BaseSchema

/**
 * Ein Union-Typ, der alle möglichen Schema-Objekte für die Verwendung
 * in der Astro-Komponente zusammenfasst.
 */
export type SchemaObject = Review | BlogPosting | CollectionPage | ImageObject | WebPage | Product;

/**
 * Definiert die Signatur für eine Funktion, die ein Schema-Objekt generiert.
 */
export type SchemaCreationFunction = (o: Organization, me: Person, df: (date?: Date) => string | undefined, url: string) => SchemaObject;

