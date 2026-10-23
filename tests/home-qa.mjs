// Browser QA against a running Preview build. Playwright must be available through
// the current Node environment (or NODE_PATH); no browser is downloaded by this file.
/* global document, innerWidth, getComputedStyle */
import { createRequire } from "node:module";
import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import process from "node:process";
import console from "node:console";
import { URL } from "node:url";
const { chromium } = createRequire(import.meta.url)("playwright");

const base = process.argv[2] || "http://localhost:3100";
const screenshots = process.env.QA_SCREENSHOTS;
const widths = [320, 375, 390, 619, 620, 768, 1023, 1024, 1200, 1512, 1920];

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("response", (response) => {
      if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
    });
    if (screenshots) mkdirSync(screenshots, { recursive: true });

    for (const width of widths) {
      await page.setViewportSize({ width, height: 1000 });
      assert.equal((await page.goto(base)).status(), 200);
      await page.evaluate(() => document.fonts.ready);
      // Scroll every section into view to exercise lazy image loading as well.
      for (const section of await page.locator("main > section, footer").all()) {
        await section.scrollIntoViewIfNeeded();
        for (const img of await section.locator("img").all()) {
          if (await img.evaluate((e) => !!e.closest('[inert]'))) continue;
          await img.scrollIntoViewIfNeeded();
          try {
            await page.waitForFunction((image) => image.complete && image.naturalWidth > 0, await img.elementHandle(), { timeout: 15000 });
          } catch (error) {
            console.error(await img.evaluate((image) => ({ src: image.src, currentSrc: image.currentSrc, html: image.outerHTML })));
            throw error;
          }
        }
      }
      const result = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        sections: [...document.querySelectorAll("main > section")].map((section) => section.className),
        h1: document.querySelectorAll("h1").length,
        residual: /orimaj|waitity/i.test(document.body.innerText),
        clipped: [...document.querySelectorAll(".design-approach__copy, .design-approach__statement")]
          .filter((element) => element.scrollHeight > element.clientHeight + 1).map((element) => element.className),
        brokenImages: [...document.images].filter((image) => !image.closest('[inert]') && (!image.complete || !image.naturalWidth)).map((image) => image.src),
      }));
      assert.equal(result.overflow, false, `overflow at ${width}px`);
      assert.equal(result.h1, 1);
      assert.equal(result.residual, false);
      assert.deepEqual(result.clipped, []);
      assert.deepEqual(result.brokenImages, []);
      assert.equal(result.sections.length, 7, "Run against a Preview build, including demonstration reviews");
      for (const [index, name] of ["home-hero", "featured-project", "design-approach", "home-projects", "home-testimonials", "home-faq", "home-cta"].entries()) {
        assert.ok(result.sections[index].split(" ").includes(name), `section order: ${name}`);
      }
      if (width < 1024) {
        const toggle = page.locator(".site-header__toggle");
        await toggle.focus();
        await page.keyboard.press("Enter");
        assert.equal(await page.locator(".site-header__mobile").getAttribute("open"), "");
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
        await page.keyboard.press("Tab");
        assert.equal(await page.locator(".site-header__panel a").first().evaluate((e) => e === document.activeElement), true);
        await page.keyboard.press("Escape");
        assert.equal(await page.locator(".site-header__mobile").getAttribute("open"), null);
        assert.equal(await toggle.evaluate((e) => e === document.activeElement), true);
      }
      if (screenshots && [375, 768, 1512].includes(width)) {
        await page.screenshot({ path: `${screenshots}/home-${width}.png`, fullPage: true });
      }
      console.log(`${width}px: order, images, overflow, text and mobile menu OK`);
    }

    const hrefs = await page.locator("a[href]").evaluateAll((links) => [...new Set(links.map((link) => link.getAttribute("href")))]);
    for (const href of hrefs) {
      if (href.startsWith("#")) assert.equal(await page.locator(href).count(), 1, href);
      else if (href.startsWith("/")) assert.equal((await page.request.get(new URL(href, base).href)).status(), 200, href);
      else assert.ok(/^(https:\/\/|mailto:|tel:)/.test(href), href);
    }
    await page.locator('.home-hero a[href="#nos-projets"]').click();
    await page.waitForURL("**/#nos-projets");
    assert.equal(await page.locator("#nos-projets").evaluate((e) => e === document.activeElement), true);

    const faq = page.locator(".home-faq button");
    await faq.nth(1).focus();
    await page.keyboard.press("Enter");
    assert.equal(await faq.nth(1).getAttribute("aria-expanded"), "true");
    assert.equal(await faq.first().getAttribute("aria-expanded"), "false");
    await page.keyboard.press("Space");
    assert.equal(await faq.nth(1).getAttribute("aria-expanded"), "false");

    for (const trigger of await page.locator(".project-condition__trigger").all()) {
      await trigger.focus();
      await page.keyboard.press("Enter");
      assert.equal(await trigger.getAttribute("aria-expanded"), "true");
      await page.keyboard.press("Escape");
      assert.equal(await trigger.getAttribute("aria-expanded"), "false");
    }
    await page.emulateMedia({ reducedMotion: "reduce" });
    const slider = page.locator('.home-testimonials [tabindex="0"]');
    await slider.focus();
    await page.keyboard.press("End");
    await page.waitForFunction(() => document.querySelector('.slider__dot:last-child')?.getAttribute("aria-current") === "true");
    assert.equal(await page.getByRole("button", { name: "Avis suivant", exact: true }).isDisabled(), true);
    await page.keyboard.press("Home");
    await page.waitForFunction(() => document.querySelector('.slider__dot:first-child')?.getAttribute("aria-current") === "true");
    assert.equal(await page.getByRole("button", { name: "Avis précédent", exact: true }).isDisabled(), true);

    // Check focus visibility via keyboard, including every shared interaction family.
    for (const selector of [".site-header__brand", ".site-header__link", ".home-hero a", ".project-condition__trigger", ".home-faq button", ".slider__dot", ".home-cta a", ".site-footer a"]) {
      const target = page.locator(selector).filter({ visible: true }).first();
      await target.focus();
      await page.keyboard.press("Shift+Tab");
      await page.keyboard.press("Tab");
      assert.equal(await target.evaluate((e) => e === document.activeElement && e.matches(":focus-visible") && getComputedStyle(e).outlineStyle !== "none"), true, selector);
    }
    await page.locator(".home-cta a").press("Enter");
    await page.waitForURL("**/contact");
    assert.deepEqual(errors, []);
    console.log("Routes, anchors, FAQ, conditions, carousel, keyboard focus, contact and browser console OK");
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
