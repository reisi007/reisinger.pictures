import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:4322",
    trace: "on-first-retry"
  },
  webServer: {
    command: "pnpm preview --port 4322 --strictPort",
    url: "http://localhost:4322",
    reuseExistingServer: false,
    timeout: 120_000
  }
});
