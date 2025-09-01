import type { BlogPosting, CollectionPage, ImageObject, ListItem, Organization, Person, Rating, Review, ReviewableThing, WebPage } from "./SchemaOrg.ts";

// --- Typen für die Factory-Optionen ---

type ReviewFactoryOptions = Omit<Review, "@context" | "@type" | "author" | "reviewRating" | "name" | "itemReviewed" | "publisher"> & {
  reviewName: string;
  authorName: string;
  rating?: { ratingValue: string; bestRating: string };
  publisher: Organization;
  itemReviewed: ReviewableThing;
};

type BlogPostingFactoryOptions = Omit<BlogPosting, "@context" | "@type" | "author" | "publisher" | "mainEntityOfPage"> & {
  url: string;
  author: Person;
  publisher: Organization;
};

// A union type for the possible types of items in a list.
type ListItemType = "Review" | "BlogPosting" | "CollectionPage" | "ImageObject" | "WebPage" | "Product";

type CollectionPageFactoryOptions = Omit<CollectionPage, "@context" | "@type" | "mainEntity"> & {
  // The 'type' property now uses the strict ListItemType.
  items: { url: string; name: string; type: ListItemType }[];
};

type WebPageFactoryOptions = Omit<WebPage, "@context" | "@type" | "mainEntityOfPage"> & {
  url: string;
};

type ImagePageFactoryOptions = {
  pageName: string;
  pageDescription?: string;
  pageUrl: string;
  imageName: string;
  imageDescription?: string;
  contentUrl: string;
  width: number;
  height: number;
  author: Person;
  publisher: Organization;
  datePublished?: string;
};


// --- Factory-Funktionen ---

export function createReviewSchema(
  {
    reviewBody,
    reviewName,
    authorName,
    datePublished,
    rating,
    publisher,
    itemReviewed
  }: ReviewFactoryOptions
): Review {
  let reviewRating: Rating | undefined = undefined;
  if (rating) {
    reviewRating = {
      "@type": "Rating",
      ratingValue: rating.ratingValue,
      bestRating: rating.bestRating
    };
  }
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed,
    reviewBody,
    name: reviewName,
    author: { "@type": "Person", name: authorName },
    publisher,
    datePublished,
    reviewRating
  };
}

export function createBlogPostingSchema(
  {
    url,
    headline,
    description,
    image,
    datePublished,
    dateModified,
    author,
    publisher
  }: BlogPostingFactoryOptions
): BlogPosting {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline,
    description,
    image,
    author,
    publisher,
    datePublished,
    dateModified
  };
}

export function createCollectionPageSchema({
                                             name,
                                             description,
                                             items,
                                             dateModified
                                           }: CollectionPageFactoryOptions): CollectionPage {
  const listItems: ListItem[] = items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: { "@type": item.type, url: item.url, name: item.name }
  }));
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    dateModified,
    mainEntity: { "@type": "ItemList", itemListElement: listItems }
  };
}

/**
 * Erstellt ein valides WebPage-Schema für generische Inhaltsseiten.
 * ✅ NEU: Verarbeitet jetzt 'publisher'.
 */
export function createWebPageSchema({
                                      name,
                                      description,
                                      url,
                                      image,
                                      author,
                                      publisher, // ✅ Destrukturieren
                                      datePublished,
                                      dateModified
                                    }: WebPageFactoryOptions): WebPage {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    image,
    author,
    publisher, // ✅ Hinzufügen zum Ergebnis
    datePublished,
    dateModified,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url
    }
  };
}

export function createImagePageSchema({
                                        pageName,
                                        pageDescription,
                                        pageUrl,
                                        imageName,
                                        imageDescription,
                                        contentUrl,
                                        width,
                                        height,
                                        author,
                                        publisher,
                                        datePublished
                                      }: ImagePageFactoryOptions): WebPage {
  const imageObject: ImageObject = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    name: imageName,
    description: imageDescription,
    contentUrl: contentUrl,
    url: pageUrl,
    width,
    height,
    author,
    copyrightHolder: author,
    publisher,
    datePublished
  };
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pageName,
    description: pageDescription,
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
    mainEntity: imageObject,
    image: imageObject,
    datePublished
  };
}