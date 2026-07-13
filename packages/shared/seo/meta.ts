/**
 * Shared SEO meta-tag helpers for reisinger.pictures.
 * Centralizing this prevents divergence in Open Graph, Twitter Card, and canonical handling.
 */

export interface SeoMetaInput {
  title: string;
  description?: string;
  url: string;
  keywords?: string[];
  author?: string;
  ogImage?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  ogImageType?: string;
  ogSiteName: string;
  ogLocale?: string;
  noIndex?: boolean;
}

export interface MetaTag {
  /** Attribute name: either "name" or "property" */
  attr: "name" | "property";
  key: string;
  value: string;
}

/**
 * Builds the full set of Open Graph + Twitter + core meta tags from a single input.
 * Both apps call this to ensure identical tag structure.
 */
export function buildSeoMetaTags(input: SeoMetaInput): MetaTag[] {
  const tags: MetaTag[] = [];
  const { title, description, url, keywords, author, ogImage, ogImageWidth, ogImageHeight, ogImageType, ogSiteName, ogLocale = "de_AT", noIndex } = input;

  // Core
  tags.push({ attr: "name", key: "title", value: title });
  if (description) tags.push({ attr: "name", key: "description", value: description });
  if (keywords && keywords.length > 0) tags.push({ attr: "name", key: "keywords", value: keywords.join(",") });

  // Open Graph
  tags.push({ attr: "property", key: "og:type", value: "website" });
  tags.push({ attr: "property", key: "og:url", value: url });
  tags.push({ attr: "property", key: "og:title", value: title });
  tags.push({ attr: "property", key: "og:site_name", value: ogSiteName });
  tags.push({ attr: "property", key: "og:locale", value: ogLocale });
  if (description) tags.push({ attr: "property", key: "og:description", value: description });
  if (ogImage) {
    tags.push({ attr: "property", key: "og:image", value: ogImage });
    if (ogImageWidth) tags.push({ attr: "property", key: "og:image:width", value: String(ogImageWidth) });
    if (ogImageHeight) tags.push({ attr: "property", key: "og:image:height", value: String(ogImageHeight) });
    if (ogImageType) tags.push({ attr: "property", key: "og:image:type", value: ogImageType });
  }
  if (author) tags.push({ attr: "property", key: "article:author", value: author });

  // Twitter Card
  tags.push({ attr: "name", key: "twitter:card", value: "summary_large_image" });
  tags.push({ attr: "name", key: "twitter:url", value: url });
  tags.push({ attr: "name", key: "twitter:title", value: title });
  if (description) tags.push({ attr: "name", key: "twitter:description", value: description });
  if (ogImage) tags.push({ attr: "name", key: "twitter:image", value: ogImage });

  // Robots
  if (noIndex) tags.push({ attr: "name", key: "robots", value: "noindex, follow" });

  return tags;
}

/**
 * Computes the canonical URL with consistent trailing-slash handling.
 * Astro's default build format ('directory') produces trailing slashes for subpages.
 */
export function canonicalUrl(href: string, pathname: string): string {
  // Homepage: strip trailing slash for a clean canonical root URL.
  if (pathname === "/") return href.replace(/\/$/, "");
  return href;
}
