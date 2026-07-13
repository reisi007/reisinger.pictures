import type { BlogPosting, CollectionPage, ImageObject, ListItem, Organization, Person, Product, Rating, Review, ReviewableThing, Service, WebPage } from "./SchemaOrg.ts";

// --- Factory Options Type Definitions ---

type OrganizationFactoryOptions = Omit<Organization, "@context">;
type ProductFactoryOptions = Omit<Product, "@context" | "@type">;
type ServiceFactoryOptions = Omit<Service, "@context" | "@type">;
type ImageObjectFactoryOptions = Omit<ImageObject, "@context" | "@type">;

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

type ListItemType = "Review" | "BlogPosting" | "CollectionPage" | "ImageObject" | "WebPage" | "Product";

type CollectionPageFactoryOptions = Omit<CollectionPage, "@context" | "@type" | "mainEntity"> & {
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


// --- Factory Functions ---

/**
 * Creates a valid Organization schema.
 */
export function createOrganizationSchema(options: OrganizationFactoryOptions): Organization {
  return {
    ...options
  };
}

/**
 * Creates a valid Product schema.
 */
export function createProductSchema(options: ProductFactoryOptions): Product {
  return {
    "@type": "Product",
    ...options
  };
}

/**
 * Creates a valid Service schema, ideal for offerings like photoshoots.
 */
export function createServiceSchema(options: ServiceFactoryOptions): Service {
  return {
    "@type": "Service",
    ...options
  };
}

/**
 * Creates a valid ImageObject schema.
 */
export function createImageObjectSchema(options: ImageObjectFactoryOptions): ImageObject {
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    ...options
  };
}


/**
 * Creates a valid Review schema for any reviewable thing.
 */
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

/**
 * Creates a valid BlogPosting schema.
 */
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

/**
 * Creates a valid CollectionPage schema.
 */
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
 * Creates a valid WebPage schema for generic content pages.
 */
export function createWebPageSchema({
                                      name,
                                      description,
                                      url,
                                      image,
                                      author,
                                      publisher,
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
    publisher,
    datePublished,
    dateModified,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url
    }
  };
}

/**
 * Creates a WebPage that has an ImageObject as its main entity.
 */
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
