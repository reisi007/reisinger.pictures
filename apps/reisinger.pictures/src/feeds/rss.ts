import type { RSSFeedItem } from "@astrojs/rss";

import { type FeedItem, mediaContentXml } from "./feed-model";

export function toRssItems(items: FeedItem[]): RSSFeedItem[] {
  return items.map((item) => ({
    title: item.title,
    link: item.link,
    description: item.description,
    pubDate: item.dateModified,
    categories: item.categories,
    customData: item.image ? mediaContentXml(item.image) : undefined
  }));
}
