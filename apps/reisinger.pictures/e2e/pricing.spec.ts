import { expect } from "@playwright/test";

import { eventsOf, test } from "./helpers";

test("tracks pricing_tab when switching tabs", async ({ page, capture }) => {
  await page.goto("/preise/");

  await page.getByRole("tab", { name: "Flex" }).click();

  await expect.poll(() => eventsOf(capture, "pricing_tab").length).toBeGreaterThan(0);
  const tabs = eventsOf(capture, "pricing_tab");
  expect(tabs[tabs.length - 1].payload).toEqual({ tab: "flex" });
});

test("tracks pricing_inquiry when opening contact from the flex calculator", async ({ page, capture }) => {
  await page.goto("/preise/");
  await page.getByRole("tab", { name: "Flex" }).click();

  await page.locator('a[data-contact-open="pricing"]').first().click();
  await page.locator("#contact_modal").waitFor({ state: "visible" });

  await expect.poll(() => eventsOf(capture, "pricing_inquiry").length).toBeGreaterThan(0);
  const inquiry = eventsOf(capture, "pricing_inquiry")[0];
  expect(inquiry.payload?.tariff).toBe("flex");
  expect(typeof inquiry.payload?.price).toBe("number");
});

test("tracks pricing_inquiry from the profi calculator on the standard tab", async ({ page, capture }) => {
  await page.goto("/preise/");

  await page.locator('a[data-contact-open="pricing"]').first().click();
  await page.locator("#contact_modal").waitFor({ state: "visible" });

  await expect.poll(() => eventsOf(capture, "pricing_inquiry").length).toBeGreaterThan(0);
  expect(eventsOf(capture, "pricing_inquiry")[0].payload?.tariff).toBe("profi");
});
