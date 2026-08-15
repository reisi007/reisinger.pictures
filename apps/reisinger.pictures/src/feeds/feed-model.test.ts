import { describe, expect, it } from "vitest";

import {
  feedUrls,
  filterPostsForOverview,
  isRootOverview,
  mediaContentXml,
  portfolioFeedDiscoveryLinks,
  recencyOf,
  sortByRecency,
  xmlEscape
} from "./feed-model";

describe("isRootOverview", () => {
  it("identifies the root overview", () => {
    expect(isRootOverview("")).toBe(true);
    expect(isRootOverview("/")).toBe(true);
    expect(isRootOverview("akt")).toBe(false);
    expect(isRootOverview("sport/eishockey")).toBe(false);
  });
});

describe("filterPostsForOverview", () => {
  const posts = [
    { id: "akt/milchbad" },
    { id: "akt/boudoir-fine-art" },
    { id: "sport/eishockey/ice/2024-25/qf5-bwl-g99" },
    { id: "sport/fussball/bundesliga/2024-25/s1" }
  ];

  it("returns all posts for the root overview", () => {
    expect(filterPostsForOverview(posts, "")).toHaveLength(4);
    expect(filterPostsForOverview(posts, "/")).toHaveLength(4);
  });

  it("filters posts by top-level category", () => {
    const result = filterPostsForOverview(posts, "akt");
    expect(result.map((post) => post.id)).toEqual(["akt/milchbad", "akt/boudoir-fine-art"]);
  });

  it("filters posts by nested overview id", () => {
    const result = filterPostsForOverview(posts, "sport/eishockey/ice/2024-25");
    expect(result.map((post) => post.id)).toEqual(["sport/eishockey/ice/2024-25/qf5-bwl-g99"]);
  });
});

describe("sortByRecency", () => {
  const entry = (date: string, updated?: string) => ({
    data: { date: new Date(date), updated: updated ? new Date(updated) : undefined }
  });

  it("sorts by date descending when no updated date is set", () => {
    const posts = [entry("2024-01-01"), entry("2024-03-01"), entry("2024-02-01")];
    expect(sortByRecency(posts).map((post) => post.data.date.toISOString())).toEqual([
      "2024-03-01T00:00:00.000Z",
      "2024-02-01T00:00:00.000Z",
      "2024-01-01T00:00:00.000Z"
    ]);
  });

  it("uses the updated date when it is newer than the publish date", () => {
    const posts = [entry("2024-01-01", "2024-05-01"), entry("2024-03-01")];
    expect(recencyOf(posts[0])).toBeGreaterThan(recencyOf(posts[1]));
    expect(sortByRecency(posts)[0]).toBe(posts[0]);
  });

  it("does not mutate the input array", () => {
    const posts = [entry("2024-01-01"), entry("2024-03-01")];
    const copy = [...posts];
    sortByRecency(posts);
    expect(posts).toEqual(copy);
  });
});

describe("feedUrls", () => {
  it("maps the root overview to /portfolio feed URLs", () => {
    expect(feedUrls("")).toEqual({ rss: "/portfolio/rss.xml", json: "/portfolio/feed.json" });
    expect(feedUrls("/")).toEqual({ rss: "/portfolio/rss.xml", json: "/portfolio/feed.json" });
  });

  it("maps a top-level category to its feed URLs", () => {
    expect(feedUrls("akt")).toEqual({ rss: "/portfolio/akt/rss.xml", json: "/portfolio/akt/feed.json" });
  });

  it("maps a nested category to its feed URLs", () => {
    expect(feedUrls("sport/eishockey/ice/2024-25")).toEqual({
      rss: "/portfolio/sport/eishockey/ice/2024-25/rss.xml",
      json: "/portfolio/sport/eishockey/ice/2024-25/feed.json"
    });
  });
});

describe("portfolioFeedDiscoveryLinks", () => {
  it("generates RSS and JSON discovery links", () => {
    expect(portfolioFeedDiscoveryLinks("akt", "Akt")).toEqual([
      { href: "/portfolio/akt/rss.xml", type: "application/rss+xml", title: "Akt (RSS)" },
      { href: "/portfolio/akt/feed.json", type: "application/feed+json", title: "Akt (JSON Feed)" }
    ]);
  });
});

describe("xmlEscape", () => {
  it("escapes XML special characters", () => {
    expect(xmlEscape(`a&b<c>"d'e`)).toBe("a&amp;b&lt;c&gt;&quot;d&apos;e");
  });
});

describe("mediaContentXml", () => {
  it("renders a media:content element with dimensions", () => {
    const xml = mediaContentXml({ url: "https://images.reisinger.pictures/ab/hash_1200.webp", width: 1200, height: 800 });
    expect(xml).toBe(
      `<media:content url="https://images.reisinger.pictures/ab/hash_1200.webp" type="image/webp" medium="image" width="1200" height="800"/>`
    );
  });

  it("omits dimensions when not available", () => {
    const xml = mediaContentXml({ url: "https://images.reisinger.pictures/ab/hash_1200.webp" });
    expect(xml).not.toContain("width=");
    expect(xml).not.toContain("height=");
  });
});
