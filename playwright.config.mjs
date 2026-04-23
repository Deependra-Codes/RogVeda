import { existsSync } from "node:fs";

import { defineConfig } from "@playwright/test";

const playwrightPort = Number(process.env.PLAYWRIGHT_PORT ?? "3200");
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${playwrightPort}`;
const defaultWebServerCommand = existsSync(".next/BUILD_ID")
  ? `pnpm exec next start --port ${playwrightPort}`
  : `pnpm exec next dev --port ${playwrightPort}`;

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 120_000,
  expect: {
    timeout: 15_000,
  },
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL,
  },
  webServer: {
    command: process.env.PLAYWRIGHT_WEB_SERVER_COMMAND ?? defaultWebServerCommand,
    url: baseURL,
    reuseExistingServer: process.env.PLAYWRIGHT_REUSE_EXISTING_SERVER === "1",
  },
});
