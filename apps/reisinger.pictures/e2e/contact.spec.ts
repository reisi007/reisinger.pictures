import { expect } from "@playwright/test";

import { closeModal, eventsOf, fillContactForm, openModal, test, waitForFormHydrated } from "./helpers";

test("tracks contact_open from the floating action button", async ({ page, capture }) => {
  await page.goto("/");
  await openModal(page);

  await expect.poll(() => eventsOf(capture, "contact_open").length).toBeGreaterThan(0);
  const events = eventsOf(capture, "contact_open");
  expect(events[0].payload).toEqual({ source: "fab" });
});

test("tracks contact_open from the header button", async ({ page, capture }) => {
  await page.goto("/");
  await page.locator('[data-contact-open="header"]').click();
  await page.locator("#contact_modal").waitFor({ state: "visible" });

  await expect.poll(() => eventsOf(capture, "contact_open").length).toBeGreaterThan(0);
  expect(eventsOf(capture, "contact_open")[0].payload).toEqual({ source: "header" });
});

test("tracks contact_open from a pricing CTA", async ({ page, capture }) => {
  await page.goto("/preise/");
  await page.locator('a[data-contact-open="pricing"]').first().click();
  await page.locator("#contact_modal").waitFor({ state: "visible" });

  await expect.poll(() => eventsOf(capture, "contact_open").length).toBeGreaterThan(0);
  expect(eventsOf(capture, "contact_open")[0].payload).toEqual({ source: "pricing" });
});

test("tracks contact_open from a TFP apply button with project context", async ({ page, capture }) => {
  await page.goto("/tfp/the-black-mirror/");
  await page.locator('[data-contact-open="tfp"]').click();
  await page.locator("#contact_modal").waitFor({ state: "visible" });

  await expect.poll(() => eventsOf(capture, "contact_open").length).toBeGreaterThan(0);
  expect(eventsOf(capture, "contact_open")[0].payload).toMatchObject({
    source: "tfp",
    project: "The Black Mirror (Fine Art & Wasser)"
  });
});

test("tracks contact_open from an in-page #kontakt link", async ({ page, capture }) => {
  await page.goto("/");
  await page.locator('a[href="#kontakt"]').click();
  await page.locator("#contact_modal").waitFor({ state: "visible" });

  await expect.poll(() => eventsOf(capture, "contact_open").length).toBeGreaterThan(0);
  expect(eventsOf(capture, "contact_open")[0].payload).toEqual({ source: "contact_link" });
});

test("tracks contact_form_submit with subject when the form is sent", async ({ page, capture }) => {
  await page.goto("/");
  await openModal(page);
  await fillContactForm(page);

  await page.locator('#reisinger-contact-form button[type="submit"]').click();

  await expect.poll(() => eventsOf(capture, "contact_form_submit").length).toBeGreaterThan(0);
  expect(eventsOf(capture, "contact_form_submit")[0].payload).toMatchObject({
    subject: "Neue Nachricht von E2E Tester"
  });
});

test("tracks contact_form_submit with subject_prefix when opened via TFP", async ({ page, capture }) => {
  await page.goto("/tfp/the-black-mirror/");
  await page.locator('[data-contact-open="tfp"]').click();
  await page.locator("#contact_modal").waitFor({ state: "visible" });

  await fillContactForm(page);
  await waitForFormHydrated(page);
  await page.locator('#reisinger-contact-form button[type="submit"]').click();

  await expect.poll(() => eventsOf(capture, "contact_form_submit").length).toBeGreaterThan(0);
  expect(eventsOf(capture, "contact_form_submit")[0].payload).toMatchObject({ subject_prefix: "TFP" });
});

test("tracks contact_abort when the dialog is closed", async ({ page, capture }) => {
  await page.goto("/");
  await openModal(page);
  await closeModal(page);

  await expect.poll(() => eventsOf(capture, "contact_abort").length).toBeGreaterThan(0);
});

test("tracks contact_form_success on successful AJAX submit", async ({ page, capture }) => {
  await page.route("**/form.reisinger.pictures/**", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) }));
  await page.goto("/");
  await openModal(page);
  await fillContactForm(page);
  await waitForFormHydrated(page);

  await page.locator('#reisinger-contact-form button[type="submit"]').click();

  await expect.poll(() => eventsOf(capture, "contact_form_success").length).toBeGreaterThan(0);
});
