import { expect } from "@playwright/test";

import { fillContactForm, openModal, test } from "./helpers";

test("submits the contact form via AJAX and shows success feedback", async ({ page }) => {
  await page.route("**/form.reisinger.pictures/**", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) }),
  );
  await page.goto("/");
  await openModal(page);
  await fillContactForm(page);
  await page.locator('#reisinger-contact-form button[type="submit"]').click();

  await expect(page.getByText("Nachricht erfolgreich versandt!")).toBeVisible();
  await expect(page.locator("#contact_modal")).toBeHidden();
});

test("shows loading feedback and blocks duplicate clicks", async ({ page }) => {
  let requestCount = 0;
  let releaseResponse!: () => void;
  const responseReleased = new Promise<void>((resolve) => {
    releaseResponse = resolve;
  });

  await page.route("**/form.reisinger.pictures/**", async (route) => {
    requestCount += 1;
    await responseReleased;
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
  });
  await page.goto("/");
  await openModal(page);
  await fillContactForm(page);

  const submitButton = page.locator('#reisinger-contact-form button[type="submit"]');
  await submitButton.click();
  await expect.poll(() => requestCount).toBe(1);
  await expect(submitButton).toHaveAttribute("aria-busy", "true");
  await expect(submitButton).not.toBeDisabled();

  await submitButton.click();
  expect(requestCount).toBe(1);

  releaseResponse();
  await expect(page.getByText("Nachricht erfolgreich versandt!")).toBeVisible();
});
