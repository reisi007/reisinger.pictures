import { expect } from "@playwright/test";

import { eventsOf, test } from "./helpers";

test("tracks outbound_link when clicking an external testimonial link", async ({ page, context, capture }) => {
  await page.goto("/testimonials/mintha1/");

  const [newPage] = await Promise.all([
    context.waitForEvent("page"),
    page.locator('a[target="_blank"]').first().click()
  ]);
  await newPage.close();

  await expect.poll(() => eventsOf(capture, "outbound_link").length).toBeGreaterThan(0);
  const outbound = eventsOf(capture, "outbound_link")[0];
  expect(outbound.payload?.url).toContain("facebook.com");
  expect(outbound.payload?.url).toContain("martina.kremsmayr");
});
