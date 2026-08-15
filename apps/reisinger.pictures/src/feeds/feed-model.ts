export type FeedImage = {
  url: string;
  width?: number;
  height?: number;
};

export type FeedItem = {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: Date;
  dateModified: Date;
  categories: string[];
  image?: FeedImage;
};

export type FeedDiscoveryLink = {
  href: string;
  type: "application/rss+xml" | "application/feed+json";
  title: string;
};

export function isRootOverview(overviewId: string): boolean {
  return overviewId === "" || overviewId === "/";
}

export function filterPostsForOverview<T extends { id: string }>(posts: T[], overviewId: string): T[] {
  return posts.filter((post) => isRootOverview(overviewId) || post.id.startsWith(overviewId));
}

export function recencyOf(entry: { data: { date: Date; updated?: Date } }): number {
  return Math.max(entry.data.date.valueOf(), entry.data.updated?.valueOf() ?? Number.MIN_VALUE);
}

export function sortByRecency<T extends { data: { date: Date; updated?: Date } }>(posts: T[]): T[] {
  return [...posts].sort((a, b) => recencyOf(b) - recencyOf(a));
}

export function feedUrls(categoryPath: string): { rss: string; json: string } {
  const base = isRootOverview(categoryPath) ? "/portfolio" : `/portfolio/${categoryPath}`;
  return { rss: `${base}/rss.xml`, json: `${base}/feed.json` };
}

export function portfolioFeedDiscoveryLinks(categoryPath: string, feedTitle: string): FeedDiscoveryLink[] {
  const urls = feedUrls(categoryPath);
  return [
    { href: urls.rss, type: "application/rss+xml", title: `${feedTitle} (RSS)` },
    { href: urls.json, type: "application/feed+json", title: `${feedTitle} (JSON Feed)` }
  ];
}

export function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function mediaContentXml(image: FeedImage): string {
  const attrs = [
    `url="${xmlEscape(image.url)}"`,
    'type="image/webp"',
    'medium="image"'
  ];
  if (image.width != null) attrs.push(`width="${image.width}"`);
  if (image.height != null) attrs.push(`height="${image.height}"`);
  return `<media:content ${attrs.join(" ")}/>`;
}
