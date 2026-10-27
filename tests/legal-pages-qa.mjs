/* global document, window, URL */
import process from 'node:process';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const base = process.argv[2] ?? 'http://localhost:3117';
const shots = process.env.QA_SCREENSHOTS;
const browser = await chromium.launch({ headless: true });
const errors = [];
const analyticsRequests = [];
try {
  const context = await browser.newContext();
  await context.route(/https:\/\/[^/]*(google-analytics\.com|googletagmanager\.com)\//, async route => {
    analyticsRequests.push(route.request().url());
    await route.abort();
  });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  for (const path of ['/mentions-legales', '/politique-de-confidentialite']) {
    for (const width of [320, 375, 768, 1512]) {
      await page.setViewportSize({ width, height: 1000 });
      assert.equal((await page.goto(base + path)).status(), 200);
      await page.locator('.legal-page__article').waitFor();
      if (await page.getByRole('button', { name: 'Refuser', exact: true }).isVisible()) await page.getByRole('button', { name: 'Refuser', exact: true }).click();
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator('h1').count(), 1);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true, `${path} ${width}`);
      assert.match(await page.locator('meta[name="robots"]').getAttribute('content'), /noindex/);
      assert.match(await page.locator('.legal-page__draft').innerText(), /faire valider/);
      const anchors = await page.locator('.legal-page__contents a').evaluateAll(links => links.map(link => ({ href: link.getAttribute('href'), exists: Boolean(document.getElementById(link.hash.slice(1))) })));
      assert.ok(anchors.length >= 5);
      assert.ok(anchors.every(link => link.exists), JSON.stringify(anchors));
      await page.locator('.legal-page__contents a').last().click();
      assert.equal(new URL(page.url()).hash, anchors.at(-1).href);
      await page.getByRole('link', { name: 'Retour au sommaire ↑', exact: true }).click();
      assert.equal(new URL(page.url()).hash, '#sommaire');
      for (const href of ['/mentions-legales', '/politique-de-confidentialite', '/parametres-cookies']) {
        assert.equal(await page.locator(`footer a[href="${href}"]`).count(), 1);
      }
      if (shots && [375,1512].includes(width)) {
        mkdirSync(shots, { recursive: true });
        await page.goto(base + path);
        await page.screenshot({ path: `${shots}/${path.slice(1)}-${width}.png`, fullPage: true });
      }
    }
  }
  await page.goto(base + '/politique-de-confidentialite#cookies');
  await page.locator('.legal-page__article a[href="/parametres-cookies"]').click();
  await page.locator('.analytics-consent--settings').waitFor();
  await page.getByRole('button', { name: 'Accepter', exact: true }).click();
  await page.locator('[role="status"]').filter({ hasText: /acceptée/ }).waitFor();
  await page.getByRole('link', { name: 'politique de confidentialité', exact: true }).click();
  await page.locator('#cookies').waitFor();
  assert.equal(new URL(page.url()).pathname, '/politique-de-confidentialite');
  assert.equal(analyticsRequests.length, 0);
  assert.deepEqual(errors, []);
  process.stdout.write('Legal pages: responsive, draft disclosure, contents, footer, preferences and Preview network isolation passed.\n');
} finally { await browser.close(); }
