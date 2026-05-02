console.log("Loaded Playwright config");

import dotenv from "dotenv";
dotenv.config({ quiet: true });

import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./specs",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html"], ["list"]],
  snapshotPathTemplate:
    "{testDir}/snapshots/{testFileName}/{projectName}/{arg}{ext}",

  use: {
    baseURL: process.env.UI_BASE_URL,
    trace: "on-first-retry",
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
    headless: true,
  },

  projects: [
    {
      name: "API",
      testDir: "specs/API",
    },
    {
      name: "UI - Chromium",
      testDir: "specs/UI",
      use: { browserName: "chromium" },
    },
    {
      name: "UI - Firefox",
      testDir: "specs/UI",
      use: { browserName: "firefox" },
    },
    {
      name: "UI - WebKit",
      testDir: "specs/UI",
      use: { browserName: "webkit" },
    },
  ],
});
