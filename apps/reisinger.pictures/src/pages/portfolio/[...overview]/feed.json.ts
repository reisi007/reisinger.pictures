import { absoluteLink } from "@reisinger/shared/utils";
import type { APIContext, InferGetStaticPropsType } from "astro";

import { feedUrls, isRootOverview } from "../../../feeds/feed-model";
import { buildJsonFeed, jsonFeedResponse } from "../../../feeds/json-feed";
import { getPortfolioFeedItems, getPortfolioFeedPaths, portfolioFeedMeta } from "../../../feeds/portfolio-feed";

export async function getStaticPaths() {
  return getPortfolioFeedPaths();
}

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export async function GET(context: APIContext) {
  const { entry } = context.props as Props;
  const site = new URL(context.site ?? "https://reisinger.pictures");
  const items = await getPortfolioFeedItems(entry.id, site);
  const { title, description } = portfolioFeedMeta(entry.data.title, entry.data.description, isRootOverview(entry.id));
  const homePath = isRootOverview(entry.id) ? "/portfolio/" : `/portfolio/${entry.id}/`;
  const { json } = feedUrls(entry.id);
  return jsonFeedResponse(buildJsonFeed({
    title,
    description,
    homePageUrl: absoluteLink(site, homePath),
    feedUrl: absoluteLink(site, json),
    items
  }));
}
