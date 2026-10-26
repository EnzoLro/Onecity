/* global document, innerWidth, window, getComputedStyle */
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import process from 'node:process';
import { URL } from 'node:url';
import console from 'node:console';
import { mkdirSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const base = process.argv[2] || 'http://localhost:3103';
const screenshots = process.env.QA_SCREENSHOTS;
const widths = [320, 375, 390, 619, 620, 768, 1023, 1024, 1200, 1512, 1920];
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  // Do not repeatedly load public OSM tiles during automated responsive tests.
  await page.route('https://tile.openstreetmap.org/**', (route) => route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="256" height="256" fill="#eeeae4"/></svg>' }));
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('response', (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  if (screenshots) mkdirSync(screenshots, { recursive: true });
  for (const width of widths) {
    await page.setViewportSize({ width, height: 1000 });
    assert.equal((await page.goto(`${base}/projets/c-premium`)).status(), 200);
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('main article').count(), 2);
    assert.equal(await page.getByRole('navigation', { name: 'Fil d’Ariane' }).getByRole('link', { name: 'Accueil' }).getAttribute('href'), '/');
    for (const img of await page.locator('main img').all()) { await img.scrollIntoViewIfNeeded(); await img.evaluate((image) => image.decode()); }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `overflow ${width}`);
    assert.equal(await page.locator('main img').evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0)), true);
    assert.equal(await page.locator('.project-detail__amenity-group li').count(), 14);
    assert.equal(await page.locator('.project-detail__access > div').count(), 4);
    await page.locator('.project-locality-map').scrollIntoViewIfNeeded();
    const station = page.locator('.project-interactive-map__points').getByRole('button', { name: 'Gare SNCF de Mantes-la-Jolie', exact: true });
    await station.waitFor();
    await page.waitForFunction(() => ![...document.querySelectorAll('button')].find((button) => button.textContent === 'Gare SNCF de Mantes-la-Jolie')?.disabled);
    assert.equal(await page.locator('.project-interactive-map__canvas').evaluate((element) => element.classList.contains('leaflet-container') && getComputedStyle(element).overflow === 'hidden'), true, 'Leaflet classes survive React updates and tiles remain clipped');
    assert.equal(await page.locator('.leaflet-tile').first().evaluate((image) => image.getBoundingClientRect().width), 256, 'Map tiles retain their width despite the shared image reset');
    const projectMarker = page.locator('.leaflet-marker-icon[title="C’Premium"]');
    await projectMarker.focus();
    await page.keyboard.press('Enter');
    await page.locator('.leaflet-popup-content').filter({ hasText: '15 route de Mantes' }).waitFor();
    await page.locator('.project-interactive-map__points').getByRole('button', { name: 'Bus Express 78', exact: true }).click();
    await page.locator('.leaflet-popup-content').filter({ hasText: '3 rue d’Arnouville' }).waitFor();
    await page.locator('.project-interactive-map__points').getByRole('button', { name: 'Bus scolaire', exact: true }).click();
    await page.locator('.leaflet-popup-content').filter({ hasText: '3 place des Alliés' }).waitFor();
    await station.click();
    await page.locator('.leaflet-popup-content').filter({ hasText: 'Place du 8 mai 1945' }).waitFor();
    await page.getByRole('button', { name: 'Les Yvelines · 78', exact: true }).click();
    assert.equal(await page.locator('.leaflet-overlay-pane path').count(), 1);
    await page.getByRole('button', { name: 'Le quartier', exact: true }).click();
    const openGallery = page.locator('.project-gallery__open').first();
    await openGallery.focus();
    await page.keyboard.press('Enter');
    const dialog = page.locator('dialog[open]');
    assert.equal(await dialog.count(), 1);
    await dialog.locator('img').evaluate((image) => image.decode());
    await page.keyboard.press('ArrowRight');
    assert.match(await dialog.locator('img').getAttribute('alt'), /Détail de la maquette/);
    await page.keyboard.press('Home');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('dialog[open]').count(), 0);
    assert.equal(await openGallery.evaluate((button) => button === document.activeElement), true);
    const disclosure = page.locator('.project-condition__trigger').first();
    await disclosure.focus();
    await page.keyboard.press('Enter');
    assert.equal(await disclosure.getAttribute('aria-expanded'), 'true');
    await page.keyboard.press('Escape');
    assert.equal(await disclosure.getAttribute('aria-expanded'), 'false');
    await page.getByRole('link', { name: 'Recevoir les informations', exact: true }).click();
    assert.equal(new URL(page.url()).hash, '#demande-informations');
    assert.equal(await page.locator('#demande-informations').evaluate((element) => element.getBoundingClientRect().top < 250), true);
    assert.equal(await page.getByRole('button', { name: 'Envoyer ma demande' }).isDisabled(), true);
    for (const [area, id] of [[98, 't4-98'], [103, 't4-103']]) {
      await page.getByRole('link', { name: `Me renseigner sur ce T4 · ${area} m²`, exact: true }).click();
      await page.waitForFunction((value) => document.querySelector(`input[name="interest"][value="${value}"]`)?.checked, id);
      assert.equal(new URL(page.url()).hash, '#demande-informations');
    }
    await page.getByLabel('Prénom *', { exact: true }).fill('Recette');
    await page.getByLabel('Nom *', { exact: true }).fill('Locale');
    await page.getByLabel('E-mail *', { exact: true }).fill('qa@example.com');
    await page.getByRole('radio', { name: 'À définir ensemble' }).check();
    assert.equal(await page.getByRole('radio', { name: 'À définir ensemble' }).isChecked(), true);
    await page.getByRole('checkbox').check();
    assert.equal(await page.locator('.project-contact').evaluate((form) => form.checkValidity()), true);
    if (screenshots && [375, 768, 1512].includes(width)) { await page.evaluate(() => window.scrollTo(0, 0)); await page.screenshot({ path: `${screenshots}/${width}.png`, fullPage: true }); }
    console.log(`PASS ${width}px: overflow, images, gallery, disclosures, CTA, form and T4 selection`);
  }
  for (const slug of ['central-avenue', 'breuil']) assert.equal((await page.goto(`${base}/projets/${slug}`)).status(), 200);
  assert.deepEqual(errors, []);
} finally { await browser.close(); }
