import { test, expect } from "@playwright/test";
import { TEXT } from "../src/constants/text";

test.describe("Landing page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("has a single level-one heading", async ({ page }) => {
    const headings = page.getByRole("heading", { level: 1 });
    await expect(headings).toHaveCount(1);
  });

  test("displays the hero title text", async ({ page }) => {
    await expect(page.getByText(TEXT.landing.hero.titleLine)).toBeVisible();
  });

  test("shows the 'How It Works' section", async ({ page }) => {
    await expect(page.getByText(TEXT.landing.howItWorks.title)).toBeVisible();
  });

  test("has a link to the auth page for unauthenticated visitors", async ({
    page,
  }) => {
    const signInLink = page
      .getByRole("link", { name: TEXT.landing.hero.signInButton })
      .first();
    await expect(signInLink).toBeVisible();
  });

  test("renders the page title in the document head", async ({ page }) => {
    await expect(page).toHaveTitle(/LinkBack/i);
  });
});
