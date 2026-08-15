import { absoluteLink } from "@reisinger/shared/utils";
import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";

import { resolveCdnImage } from "../images/image-manifest";
import { type FeedItem, filterPostsForOverview, isRootOverview, sortByRecency } from "./feed-model";

export type PortfolioOverviewEntry = CollectionEntry<"portfolioOverviews">;

export type PortfolioFeedPath = {
  params: { overview: string };
  props: { entry: PortfolioOverviewEntry };
};

const HERO_IMAGE_WIDTH = 1200;

export async function getPortfolioFeedPaths(): Promise<PortfolioFeedPath[]> {
  const overviewPages = await getCollection("portfolioOverviews");
  const posts = await getCollection("portfolio");
  return overviewPages
    .filter((entry) => filterPostsForOverview(posts, entry.id).length > 0)
    .map((entry) => ({ params: { overview: entry.id }, props: { entry } }));
}

export async function getPortfolioFeedItems(overviewId: string, site: URL): Promise<FeedItem[]> {
  const posts = sortByRecency(filterPostsForOverview(await getCollection("portfolio"), overviewId));
  return posts.map((post) => {
    const { id, data } = post;
    const { title, description = "", date, updated, heroImage } = data;
    const category = isRootOverview(overviewId) ? id.split("/")[0] : overviewId.slice(overviewId.lastIndexOf("/") + 1);
    return {
      id,
      title,
      description,
      link: absoluteLink(site, `/portfolio/${id}/`),
      pubDate: date,
      dateModified: updated ?? date,
      categories: [category],
      image: resolveHeroImage(heroImage)
    };
  });
}

export function portfolioFeedMeta(title: string, description?: string, isRoot = false): { title: string; description: string } {
  const cleanTitle = title.replace(/\s*[–-]\s*Florian Reisinger\s*$/i, "").trim();
  return {
    title: isRoot ? "Portfolio – Florian Reisinger" : `${cleanTitle} – Florian Reisinger`,
    description: description ?? `Portfolio-Beiträge rund um „${title}" von Fotograf Florian Reisinger aus Linz.`
  };
}

function resolveHeroImage(heroImage: string | undefined): FeedItem["image"] | undefined {
  if (!heroImage) return undefined;
  try {
    const resolved = resolveCdnImage(heroImage, HERO_IMAGE_WIDTH);
    return { url: resolved.src, width: resolved.width, height: resolved.height };
  } catch {
    return undefined;
  }
}
