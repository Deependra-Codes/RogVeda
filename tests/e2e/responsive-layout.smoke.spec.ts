import { expect, test } from "@playwright/test";

const mobileViewport = {
  width: 400,
  height: 860,
  isMobile: true,
} as const;

test("homepage mobile hero stays readable without horizontal overflow", async ({ browser }) => {
  const page = await browser.newPage({
    viewport: mobileViewport,
    isMobile: mobileViewport.isMobile,
  });

  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Find trusted knee replacement care in Delhi." }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Compare Hospitals" })).toBeVisible();

  const metrics = await page.evaluate(() => ({
    innerWidth: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.innerWidth + 1);
});

test("vendor login mobile layout keeps the form readable without horizontal overflow", async ({
  browser,
}) => {
  const page = await browser.newPage({
    viewport: mobileViewport,
    isMobile: mobileViewport.isMobile,
  });

  await page.goto("/vendor/login");

  await expect(
    page.getByRole("heading", { name: "Access the booking operations dashboard." }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign In To Dashboard" })).toBeVisible();

  const metrics = await page.evaluate(() => ({
    innerWidth: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.innerWidth + 1);
});
