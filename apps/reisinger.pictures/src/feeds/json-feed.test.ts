import { describe, expect, it } from "vitest";

import { buildJsonFeed, jsonFeedResponse } from "./json-feed";

const items = [
  {
    id: "akt/milchbad",
    title: "Milchbad Shooting",
    description: "Einfühlsames Akt-Shooting im Milchbad.",
    link: "https://reisinger.pictures/portfolio/akt/milchbad/",
    pubDate: new Date("2024-02-28T00:00:00Z"),
    dateModified: new Date("2024-03-01T00:00:00Z"),
    categories: ["akt"],
    image: { url: "https://images.reisinger.pictures/ab/hash_1200.webp", width: 1200, height: 800 }
  }
];

describe("buildJsonFeed", () => {
  it("builds a JSON Feed 1.1 payload", () => {
    const feed = buildJsonFeed({
      title: "Florian Reisinger – Akt",
      description: "Portfolio-Beiträge rund um Akt.",
      homePageUrl: "https://reisinger.pictures/portfolio/akt/",
      feedUrl: "https://reisinger.pictures/portfolio/akt/feed.json",
      items
    });

    expect(feed.version).toBe("https://jsonfeed.org/version/1.1");
    expect(feed.title).toBe("Florian Reisinger – Akt");
    expect(feed.home_page_url).toBe("https://reisinger.pictures/portfolio/akt/");
    expect(feed.feed_url).toBe("https://reisinger.pictures/portfolio/akt/feed.json");
    expect(feed.language).toBe("de-AT");
    expect(feed.authors).toEqual([{ name: "Florian Reisinger", url: "https://reisinger.pictures/ueber-mich" }]);
  });

  it("maps feed items to JSON Feed item fields", () => {
    const feed = buildJsonFeed({
      title: "T",
      homePageUrl: "https://reisinger.pictures/portfolio/",
      feedUrl: "https://reisinger.pictures/portfolio/feed.json",
      items
    });
    const item = feed.items[0];
    expect(item.id).toBe(items[0].link);
    expect(item.url).toBe(items[0].link);
    expect(item.title).toBe("Milchbad Shooting");
    expect(item.summary).toBe("Einfühlsames Akt-Shooting im Milchbad.");
    expect(item.date_published).toBe("2024-02-28T00:00:00.000Z");
    expect(item.date_modified).toBe("2024-03-01T00:00:00.000Z");
    expect(item.tags).toEqual(["akt"]);
    expect(item.image).toBe("https://images.reisinger.pictures/ab/hash_1200.webp");
  });

  it("omits the image field when no image is available", () => {
    const feed = buildJsonFeed({
      title: "T",
      homePageUrl: "https://reisinger.pictures/portfolio/",
      feedUrl: "https://reisinger.pictures/portfolio/feed.json",
      items: [{ ...items[0], image: undefined }]
    });
    expect(feed.items[0].image).toBeUndefined();
  });
});

describe("jsonFeedResponse", () => {
  it("serializes the feed with the feed+json content type", async () => {
    const feed = buildJsonFeed({
      title: "T",
      homePageUrl: "https://reisinger.pictures/portfolio/",
      feedUrl: "https://reisinger.pictures/portfolio/feed.json",
      items: []
    });
    const response = jsonFeedResponse(feed);
    expect(response.headers.get("Content-Type")).toBe("application/feed+json; charset=utf-8");
    const text = await response.text();
    expect(() => JSON.parse(text)).not.toThrow();
  });
});
