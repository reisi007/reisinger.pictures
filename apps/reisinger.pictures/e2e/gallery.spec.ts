import { expect } from "@playwright/test";

import { eventsOf, test } from "./helpers";

test("tracks gallery_open, gallery_slide and gallery_info_toggle", async ({ page, capture }) => {
  await page.goto("/portfolio/beauty/sarah-home2025/");

  const firstImage = page.locator("section[data-gallery] img").first();
  await firstImage.click();

  await expect.poll(() => eventsOf(capture, "gallery_open").length).toBeGreaterThan(0);

  await page.locator(".pswp__button--arrow--next").click();
  await expect.poll(() => eventsOf(capture, "gallery_slide").length).toBeGreaterThan(0);
  const slide = eventsOf(capture, "gallery_slide")[eventsOf(capture, "gallery_slide").length - 1];
  expect(slide.payload?.index).toBe(1);
  expect(slide.payload?.total).toBeGreaterThanOrEqual(2);

  await page.locator(".pswp__button--custom-caption-toggle").click();
  await expect.poll(() => eventsOf(capture, "gallery_info_toggle").length).toBeGreaterThan(0);
  expect(eventsOf(capture, "gallery_info_toggle")[0].payload).toEqual({ visible: true });
});
