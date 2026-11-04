import { expect, test } from "@playwright/test";

test.describe("landing page", () => {
  test("renders the hero and both equal entry points", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Sales & Service",
    );

    // Doc 01 §2: products and services carry equal weight. Both entry points
    // must be present; a missing services link is a product-direction failure,
    // not a cosmetic one.
    await expect(
      page.getByRole("link", { name: /Shop Products/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Get IT Services/i }),
    ).toBeVisible();
  });

  test("does not scroll horizontally", async ({ page }) => {
    await page.goto("/");

    const overflow = await page.evaluate(() => {
      const el = document.documentElement;
      return el.scrollWidth - el.clientWidth;
    });

    expect(overflow).toBeLessThanOrEqual(0);
  });

  test("serves the Gujarati locale", async ({ page }) => {
    await page.goto("/gu");

    await expect(page.locator("html")).toHaveAttribute("lang", "gu");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "વેચાણ અને સર્વિસ",
    );
  });

  test("shows the unverified-details notice while store facts are unconfirmed", async ({
    page,
  }) => {
    await page.goto("/");

    // Guards doc 03 §3: unverified business details must not read as fact.
    // When the owner confirms the store details, this expectation changes in
    // the same commit that flips the `verified` flags.
    await expect(page.getByText(/awaiting owner confirmation/i)).toBeVisible();
  });
});
