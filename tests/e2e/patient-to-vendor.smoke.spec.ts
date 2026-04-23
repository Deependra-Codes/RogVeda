import { expect, test } from "@playwright/test";

test("patient booking keeps currency context, shows a negative wallet, and transitions into vendor task completion", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Find trusted knee replacement care in Delhi." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "INR" }).click();

  const firstCard = page.locator("article").first();
  const estimateHeading = firstCard.getByTestId("hospital-price-panel").locator("h3");
  await expect.poll(async () => (await estimateHeading.textContent())?.includes("$")).toBe(false);

  const shortlistedPrice = (await estimateHeading.textContent())?.trim();

  if (!shortlistedPrice) {
    throw new Error("The first search card did not expose an estimate");
  }

  expect(shortlistedPrice.includes("$")).toBe(false);
  await firstCard.getByRole("link", { name: "Book Now" }).click();

  await expect(page).toHaveURL(/\/booking\?/);
  await expect(page.getByText("Selected Treatment", { exact: true })).toBeVisible();
  await expect(page.getByText("Estimated Price (INR)", { exact: true })).toBeVisible();
  await expect(page.getByText(shortlistedPrice, { exact: false }).first()).toBeVisible();
  await expect(page.getByText("Negative wallet balances are allowed in this demo.")).toBeVisible();
  await expect(page.getByText("Wallet after confirmation").locator("..")).toContainText("-");

  await page.getByRole("button", { name: "Confirm Booking" }).click();

  await expect(page).toHaveURL(/\/booking\/confirmation\//);
  await expect(page.getByText("Booking Confirmed")).toBeVisible();
  await expect(page.getByText("Updated Wallet (INR)")).toBeVisible();
  await expect(page.getByText("Updated Wallet (INR)").locator("..")).toContainText("-");

  const confirmationPath = new URL(page.url()).pathname;
  const bookingId = confirmationPath.split("/").at(-1);

  if (!bookingId) {
    throw new Error("Booking ID was not present in confirmation route");
  }

  await page.getByRole("link", { name: "Open Vendor Login" }).click();

  await expect(page).toHaveURL(/\/vendor\/login/);
  await page.getByLabel("Username").fill("apollo");
  await page.getByLabel("Password").fill("apollo123");
  await page.getByRole("button", { name: "Sign In To Dashboard" }).click();

  await expect(page).toHaveURL(/\/vendor\/dashboard\?status=signed_in/);
  await expect(page.getByText("Signed in successfully.")).toBeVisible();

  const bookingCard = page.locator("article").filter({ hasText: bookingId.slice(0, 8) });
  await expect(bookingCard).toBeVisible();
  await expect(bookingCard).toContainText("Confirmed");
  await expect(bookingCard).toContainText("Task: Pending");

  await bookingCard.getByRole("button", { name: "Mark Task Complete" }).click();

  await expect(page).toHaveURL(/\/vendor\/dashboard\?status=task_completed/);
  await expect(page.getByText("Task completed. Booking status is now In Progress.")).toBeVisible();
  await expect(bookingCard).toContainText("In Progress");
  await expect(bookingCard).toContainText("Task Complete");
});

test("vendor login rejects invalid credentials", async ({ page }) => {
  await page.goto("/vendor/login");

  await page.getByLabel("Username").fill("apollo");
  await page.getByLabel("Password").fill("incorrect-password");
  await page.getByRole("button", { name: "Sign In To Dashboard" }).click();

  await expect(page).toHaveURL(/\/vendor\/login\?error=invalid_credentials/);
  await expect(page.getByText("Vendor login failed")).toBeVisible();
  await expect(
    page.getByText("The vendor credentials do not match the demo account. Please try again."),
  ).toBeVisible();
});
