import type { FeedItem } from "./feed-model";

export type JsonFeedAuthor = {
  name: string;
  url?: string;
};

export type JsonFeedItem = {
  id: string;
  url: string;
  title: string;
  summary?: string;
  date_published: string;
  date_modified?: string;
  tags?: string[];
  image?: string;
};

export type JsonFeed = {
  version: string;
  title: string;
  home_page_url: string;
  feed_url: string;
  description?: string;
  language?: string;
  authors?: JsonFeedAuthor[];
  items: JsonFeedItem[];
};

export function buildJsonFeed(input: {
  title: string;
  description?: string;
  homePageUrl: string;
  feedUrl: string;
  items: FeedItem[];
}): JsonFeed {
  return {
    version: "https://jsonfeed.org/version/1.1",
    title: input.title,
    home_page_url: input.homePageUrl,
    feed_url: input.feedUrl,
    description: input.description,
    language: "de-AT",
    authors: [{ name: "Florian Reisinger", url: "https://reisinger.pictures/ueber-mich" }],
    items: input.items.map((item) => ({
      id: item.link,
      url: item.link,
      title: item.title,
      summary: item.description,
      date_published: item.pubDate.toISOString(),
      date_modified: item.dateModified.toISOString(),
      tags: item.categories,
      image: item.image?.url
    }))
  };
}

export function jsonFeedResponse(feed: JsonFeed): Response {
  return new Response(JSON.stringify(feed, null, 2), {
    headers: { "Content-Type": "application/feed+json; charset=utf-8" }
  });
}
