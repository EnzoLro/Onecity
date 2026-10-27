/* global document, innerWidth, getComputedStyle */
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import process from 'node:process';
import { URL } from 'node:url';
import console from 'node:console';
import { mkdirSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const base = process.argv[2] || 'http://localhost:3104';
const screenshots = process.env.QA_SCREENSHOTS;
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('response', (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  if (screenshots) mkdirSync(screenshots, { recursive: true });
  for (const width of [320, 375, 390, 619, 620, 768, 1023, 1024, 1200, 1512, 1920]) {
    await page.setViewportSize({ width, height: width <= 375 ? 667 : 1000 });
    assert.equal((await page.goto(`${base}/contact`)).status(), 200);
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('h1').count(), 1);
    assert.doesNotMatch(await page.locator('main').innerText(), /Contenu à venir|Lorem ipsum|Orimaj/);
    assert.equal(await page.locator('main form').count(), 1);
    assert.deepEqual(await page.locator('main > section').evaluateAll((sections) => sections.map((section) => section.id || section.className)), ['demande-informations', 'home-testimonials', 'faq']);
    assert.equal(await page.locator('.contact-page__channels > div').count(), 2);
    assert.equal(await page.locator('main .project-visual, main .contact-page__project, main .contact-page__invitation').count(), 0);
    assert.equal(await page.locator('main a[href^="/projets/"]').count(), 0);
    assert.equal(await page.locator('.project-contact-shell').evaluate((element) => ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'].every((side) => getComputedStyle(element)[side] === '8px')), true);
    assert.equal(await page.locator('.project-contact').evaluate((element) => getComputedStyle(element).backgroundColor), 'rgb(255, 255, 255)');
    const faq = page.locator('.home-faq button[aria-expanded]');
    assert.equal(await faq.count(), 6);
    await faq.nth(1).focus();
    await page.keyboard.press('Enter');
    assert.equal(await faq.nth(1).getAttribute('aria-expanded'), 'true');
    assert.equal(await faq.first().getAttribute('aria-expanded'), 'false');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const slider = page.locator('.home-testimonials [tabindex="0"]');
    await slider.focus();
    await page.keyboard.press('End');
    await page.waitForFunction(() => document.querySelector('.home-testimonials .slider__dot:last-child')?.getAttribute('aria-current') === 'true');
    await page.keyboard.press('Home');
    await page.waitForFunction(() => document.querySelector('.home-testimonials .slider__dot:first-child')?.getAttribute('aria-current') === 'true');
    assert.equal(await page.locator('[name="project"]').inputValue(), 'c-premium');
    for (const img of await page.locator('main img').all()) { await img.scrollIntoViewIfNeeded(); await img.evaluate((image) => image.decode()); }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `overflow at ${width}`);
    assert.equal(await page.locator('main img').evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0 && image.getBoundingClientRect().width > 0)), true);
    assert.equal(await page.getByRole('button', { name: 'Envoyer ma demande' }).isDisabled(), true);
    assert.match(await page.locator('.project-contact__notice a').getAttribute('href'), /^mailto:projets@onecityimmobilier\.fr\?subject=/);
    assert.equal(await page.getByRole('link', { name: '+33 7 85 01 04 57', exact: true }).first().getAttribute('href'), 'tel:+33785010457');
    assert.equal(await page.locator('.site-footer__navigation a').filter({ hasText: 'Contact' }).getAttribute('href'), '/contact');
    for (const selector of ['[name="firstName"]', '[name="lastName"]', '[name="email"]', '[name="phone"]', '[name="message"]', '[name="consent"]']) {
      const target = page.locator(selector);
      await target.focus();
      await page.keyboard.press('Shift+Tab');
      await page.keyboard.press('Tab');
      assert.equal(await target.evaluate((element) => element === document.activeElement && element.matches(':focus-visible') && getComputedStyle(element).outlineStyle !== 'none'), true, selector);
    }
    await page.getByRole('radio', { name: 'T4 · 98 m²', exact: true }).focus();
    await page.keyboard.press('ArrowRight');
    assert.equal(await page.getByRole('radio', { name: 'T4 · 103 m²', exact: true }).isChecked(), true);
    await page.getByLabel('Prénom *', { exact: true }).fill('   ');
    assert.equal(await page.locator('[name="firstName"]').evaluate((element) => element.checkValidity()), false);
    if (screenshots && [375, 768, 1512].includes(width)) { await page.screenshot({ path: `${screenshots}/contact-${width}.png`, fullPage: true }); }
    console.log(`PASS contact ${width}px: assets, overflow, fields, disabled sending, keyboard and links`);
  }
  for (const id of ['t4-98', 't4-103', 'invented']) {
    await page.goto(`${base}/contact?projet=c-premium&logement=${id}#demande-informations`);
    const expected = id === 'invented' ? 'unsure' : id;
    await page.waitForFunction((value) => document.querySelector(`input[name="interest"][value="${value}"]`)?.checked, expected);
    assert.equal(await page.locator('[name="project"]').inputValue(), 'c-premium');
  }
  for (const path of ['/', '/projets/c-premium', '/projets/central-avenue', '/projets/breuil']) {
    await page.goto(`${base}${path}`);
    assert.equal(await page.locator('.site-header__desktop-contact').getAttribute('href'), '/contact');
    for (const link of await page.getByRole('link', { name: 'Nous contacter', exact: true }).all()) assert.equal(new URL(await link.getAttribute('href'), base).pathname, '/contact');
  }
  assert.deepEqual(errors, []);
} finally { await browser.close(); }
