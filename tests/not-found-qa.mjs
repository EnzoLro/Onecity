/* global document, innerWidth, getComputedStyle */
import { createRequire } from "node:module";
import assert from "node:assert/strict";
import process from "node:process";
import console from "node:console";
const { chromium } = createRequire(import.meta.url)("playwright");

const base = process.argv[2] || "http://localhost:3120";
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));

  for (const width of [375, 768, 1512]) {
    await page.setViewportSize({ width, height: 900 });
    const response = await page.goto(`${base}/page-inexistante`);
    assert.equal(response?.status(), 404);
    assert.equal(await page.locator("h1").count(), 1);
    assert.equal((await page.getByRole("heading", { level: 1 }).textContent())?.trim(), "Cette page n’existe pas.");
    const main = page.locator("#main-content");
    assert.equal(await main.getByRole("link", { name: "Retour à l’accueil", exact: true }).getAttribute("href"), "/");
    assert.equal(await main.getByRole("link", { name: "Nous contacter", exact: true }).getAttribute("href"), "/contact");
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);

    for (const name of ["Retour à l’accueil", "Nous contacter"]) {
      const target = main.getByRole("link", { name, exact: true });
      await target.focus();
      await page.keyboard.press("Shift+Tab");
      await page.keyboard.press("Tab");
      assert.equal(await target.evaluate((element) => element === document.activeElement && element.matches(":focus-visible") && getComputedStyle(element).outlineStyle !== "none"), true);
    }
  }

  assert.deepEqual(errors, []);
  console.log("404: branded content, responsive layout, navigation and keyboard focus OK");
} finally {
  await browser.close();
}
