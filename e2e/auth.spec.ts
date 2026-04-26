import { test, expect } from "@playwright/test";
import { TEXT } from "../src/constants/text";

test.describe("Auth page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/auth");
  });

  test("renders the sign-in card title", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Pick up where you left off." }),
    ).toBeVisible();
  });

  test("shows the LinkedIn sign-in button in its idle state", async ({
    page,
  }) => {
    await expect(
      page.getByRole("button", { name: TEXT.auth.card.buttonIdle }),
    ).toBeVisible();
  });

  test("shows what data LinkedIn access requires", async ({ page }) => {
    await expect(page.getByText(TEXT.auth.info.title)).toBeVisible();
  });

  test("has a link back to the home page", async ({ page }) => {
    const backLink = page.getByRole("link", {
      name: TEXT.common.ui.close,
    });
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute("href", "/");
  });
});
