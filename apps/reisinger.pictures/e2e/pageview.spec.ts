import { expect } from "@playwright/test";

import { eventsOf, test } from "./helpers";

test("does not track a pageview on initial load", async ({ page, capture }) => {
  await page.goto("/");
  expect(eventsOf(capture, "pageview")).toHaveLength(0);
});

test("tracks a virtual pageview after client-side navigation", async ({ page, capture }) => {
  await page.goto("/");

  await page.locator('header a[href="/preise/"]').click();

  await expect.poll(() => eventsOf(capture, "pageview").length).toBeGreaterThan(0);
  const pageviews = eventsOf(capture, "pageview");
  const last = pageviews[pageviews.length - 1];
  expect(last.payload?.url).toBe("/preise/");
});
