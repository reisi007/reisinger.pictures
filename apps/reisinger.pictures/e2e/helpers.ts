import { test as base, type Page } from "@playwright/test";

export type TrackEvent = {
  name: string;
  payload?: Record<string, string | number | boolean>;
};

export type Capture = () => TrackEvent[];

export const test = base.extend<{ capture: Capture }>({
  capture: async ({ page }, use) => {
    const events: TrackEvent[] = [];

    await page.route("**/form.reisinger.pictures/**", (route) => route.abort());
    await page.exposeFunction("__trackCapture", (name: string, payload?: Record<string, string | number | boolean>) => {
      events.push({ name, payload });
    });
    await page.addInitScript(() => {
      window.trackEvent = (name: string, payload?: Record<string, string | number | boolean>) => {
        (window as unknown as { __trackCapture: (n: string, p?: Record<string, string | number | boolean>) => void })
          .__trackCapture(name, payload);
      };
    });

    await use(() => [...events]);
  }
});

export function eventsOf(capture: Capture, name: string): TrackEvent[] {
  return capture().filter((event) => event.name === name);
}

export async function openModal(page: Page): Promise<void> {
  await page.locator('[data-contact-open="fab"]').click();
  await page.locator("#contact_modal").waitFor({ state: "visible" });
}

export async function fillContactForm(page: Page, name = "E2E Tester", email = "e2e@test.local"): Promise<void> {
  await page.locator("#form__name").fill(name);
  await page.locator("#form_email").fill(email);
  await page.locator("#form_msg").fill("Hallo Florian, das ist eine Testnachricht aus den E2E-Tests.");
}

export async function closeModal(page: Page): Promise<void> {
  await page.locator('#contact_modal form[method="dialog"] button').click();
  await page.locator("#contact_modal").waitFor({ state: "hidden" });
}
