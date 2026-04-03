import { test, expect } from "@playwright/test";
import { TEXT } from "../src/constants/text";

test.describe("Not Found page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/this-route-does-not-exist");
  });

  test("renders the 404 heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: TEXT.notFound.title }),
    ).toBeVisible();
  });

  test("shows the page-not-found subtitle", async ({ page }) => {
    await expect(page.getByText(TEXT.notFound.subtitle)).toBeVisible();
  });

  test("has a link back to the home page", async ({ page }) => {
    const homeLink = page.getByRole("link", { name: TEXT.notFound.link });
    await expect(homeLink).toBeVisible();
    await expect(homeLink).toHaveAttribute("href", "/");
  });

  test("navigates back to the landing page when the link is clicked", async ({
    page,
  }) => {
    await page.getByRole("link", { name: TEXT.notFound.link }).click();
    await expect(page).toHaveURL("/");
  });
});
