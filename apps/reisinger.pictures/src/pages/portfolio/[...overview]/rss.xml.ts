import rss from "@astrojs/rss";
import type { APIContext, InferGetStaticPropsType } from "astro";

import { isRootOverview } from "../../../feeds/feed-model";
import { getPortfolioFeedItems, getPortfolioFeedPaths, portfolioFeedMeta } from "../../../feeds/portfolio-feed";
import { toRssItems } from "../../../feeds/rss";

export async function getStaticPaths() {
  return getPortfolioFeedPaths();
}

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export async function GET(context: APIContext) {
  const { entry } = context.props as Props;
  const site = new URL(context.site ?? "https://reisinger.pictures");
  const items = await getPortfolioFeedItems(entry.id, site);
  const { title, description } = portfolioFeedMeta(entry.data.title, entry.data.description, isRootOverview(entry.id));
  return rss({
    title,
    description,
    site,
    xmlns: { media: "http://search.yahoo.com/mrss/" },
    customData: "<language>de-at</language>",
    items: toRssItems(items)
  });
}
