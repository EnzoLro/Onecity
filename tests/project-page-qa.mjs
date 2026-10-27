/* global document, innerWidth, window, getComputedStyle */
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import process from 'node:process';
import { URL } from 'node:url';
import console from 'node:console';
import { mkdirSync } from 'node:fs';
import { getProgram } from '../data/programs.ts';
const { chromium } = createRequire(import.meta.url)('playwright');
const base = process.argv[2] || 'http://localhost:3103';
const screenshots = process.env.QA_SCREENSHOTS;
const widths = [320, 375, 390, 619, 620, 768, 1023, 1024, 1200, 1512, 1920];
const project = getProgram('c-premium');
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
  // Compare the rendered home and detail, not only their shared source objects.
  await page.goto(base);
  const homeContent = await page.locator('main').innerText();
  for (const fact of project.commercial.facts.filter(({ id }) => ['homes', 'energy', 'price', 'location'].includes(id))) {
    assert.ok(homeContent.includes(fact.label), `home is missing ${fact.label}`);
  }
  for (const width of widths) {
    await page.setViewportSize({ width, height: width <= 375 ? 667 : width === 390 ? 844 : 1000 });
    assert.equal((await page.goto(`${base}/projets/c-premium`)).status(), 200);
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('h1').count(), 1);
    const content = await page.locator('main').innerText();
    assert.doesNotMatch(content, /Orimaj|Lorem ipsum|TODO|contenu à venir/i);
    for (const { value } of project.editorial.detail.highlights) assert.ok(content.includes(value), `detail is missing ${value}`);
    const headings = await page.locator('main :is(h1,h2,h3,h4,h5,h6)').evaluateAll((items) => items.map((item) => ({ level: Number(item.tagName.slice(1)), text: item.textContent.trim() })));
    assert.equal(headings[0].level, 1);
    headings.forEach((heading, index) => {
      assert.ok(heading.text, 'headings have a name');
      if (index) assert.ok(heading.level <= headings[index - 1].level + 1, `skipped heading level: ${heading.text}`);
    });
    assert.equal(await page.getByRole('navigation', { name: 'Fil d’Ariane' }).locator('[aria-current="page"]').innerText(), project.label);
    assert.equal(await page.locator('main article').count(), 2);
    assert.equal(await page.getByRole('navigation', { name: 'Fil d’Ariane' }).getByRole('link', { name: 'Accueil' }).getAttribute('href'), '/');
    for (const img of await page.locator('main img').all()) { await img.scrollIntoViewIfNeeded(); await img.evaluate((image) => image.decode()); }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `overflow ${width}`);
    assert.equal(await page.locator('main img').evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0)), true);
    assert.equal(await page.locator('.project-detail__amenities').count(), 0);
    for (const home of await page.locator('.project-detail__home').all()) assert.equal(await home.locator('.project-detail__home-features li').count(), 5);
    assert.equal(await page.locator('.project-detail__principle-features li').count(), 8);
    assert.equal(await page.locator('.project-detail__access > div').count(), 4);
    assert.equal(await page.locator('.project-interactive-map__points, .project-locality-map__caption').count(), 0);
    assert.equal(await page.getByRole('link', { name: /Explorer les alentours/ }).count(), 0);
    await page.locator('.project-locality-map').scrollIntoViewIfNeeded();
    const neighborhood = page.getByRole('tab', { name: 'Le quartier', exact: true });
    await neighborhood.waitFor();
    await page.waitForFunction(() => !document.querySelector('[role="tab"]')?.disabled);
    assert.equal(await neighborhood.getAttribute('aria-selected'), 'true');
    assert.equal(await page.locator('.project-interactive-map__canvas').evaluate((element) => element.classList.contains('leaflet-container') && getComputedStyle(element).overflow === 'hidden'), true, 'Leaflet classes survive React updates and tiles remain clipped');
    assert.equal(await page.locator('.leaflet-tile').first().evaluate((image) => image.getBoundingClientRect().width), 256);
    const projectMarker = page.locator('.leaflet-marker-icon[title="C’Premium"]');
    await projectMarker.focus();
    await page.keyboard.press('Enter');
    await page.locator('.leaflet-popup-content').filter({ hasText: '15 route de Mantes' }).waitFor();
    assert.equal(await page.locator('.leaflet-control-zoom').isVisible(), false, 'Zoom controls do not overlap the open popup');
    await page.locator('.leaflet-popup-close-button').click();
    await page.waitForFunction(() => document.querySelectorAll('.leaflet-popup').length === 0);
    assert.equal(await page.locator('.leaflet-control-zoom').isVisible(), true);
    await page.locator('.leaflet-marker-icon[title="Bus Express 78"]').click();
    await page.locator('.leaflet-popup-content').filter({ hasText: '3 rue d’Arnouville' }).waitFor();
    assert.match(await page.locator('.leaflet-popup-content').innerText(), /Saint-Quentin-en-Yvelines/);
    assert.match(await page.locator('.leaflet-popup-content').innerText(), /Montigny-le-Bretonneux/);
    await page.locator('.leaflet-popup-close-button').click();
    await page.waitForFunction(() => document.querySelectorAll('.leaflet-popup').length === 0);
    await page.locator('.leaflet-marker-icon[title="Bus scolaire"]').click();
    await page.locator('.leaflet-popup-content').filter({ hasText: '3 place des Alliés' }).waitFor();
    assert.match(await page.locator('.leaflet-popup-content').innerText(), /Collège La Vaucouleurs/);
    assert.match(await page.locator('.leaflet-popup-content').innerText(), /Lycée Camille Claudel/);
    await page.getByRole('tab', { name: 'Les accès', exact: true }).click();
    await page.locator('.leaflet-marker-icon[title="Gare SNCF de Mantes-la-Jolie"]').click();
    await page.locator('.leaflet-popup-content').filter({ hasText: 'Place du 8 mai 1945' }).waitFor();
    assert.match(await page.locator('.leaflet-popup-content').innerText(), /Paris Saint-Lazare.*40 min/);
    assert.match(await page.locator('.leaflet-popup-content').innerText(), /7820.*ancien A14/);
    assert.match(await page.locator('.leaflet-popup-content').innerText(), /RER E.*prévu en 2027/);
    // Leaflet pans the map after opening a popup; wait for that movement to finish.
    await page.waitForFunction(() => {
      const popup = document.querySelector('.leaflet-popup');
      if (!popup) return false;
      const box = popup.getBoundingClientRect();
      const frame = document.querySelector('.project-interactive-map__canvas').getBoundingClientRect();
      return box.left >= frame.left - 2 && box.right <= frame.right + 2;
    });
    await page.locator('.leaflet-popup-close-button').click();
    await page.waitForFunction(() => document.querySelectorAll('.leaflet-popup').length === 0);
    // Opening the station pans the map; restore the access overview for the next point.
    await page.getByRole('tab', { name: 'Les accès', exact: true }).click();
    await page.locator('.leaflet-marker-icon[title="Accès A13 · Mantes Est"]').click();
    await page.locator('.leaflet-popup-content').filter({ hasText: 'rond-point Clé des Champs' }).waitFor();
    assert.match(await page.locator('.leaflet-popup-content').innerText(), /Paris.*56 km.*50 min/);
    assert.match(await page.locator('.leaflet-popup-content').innerText(), /Rouen.*85 km.*50 min/);
    await neighborhood.focus();
    await page.keyboard.press('ArrowRight');
    assert.equal(await page.getByRole('tab', { name: 'Les accès', exact: true }).getAttribute('aria-selected'), 'true');
    await page.keyboard.press('End');
    assert.equal(await page.getByRole('tab', { name: 'Les Yvelines', exact: true }).getAttribute('aria-selected'), 'true');
    assert.equal(await page.locator('.leaflet-overlay-pane path').count(), 1);
    await page.keyboard.press('Home');
    assert.equal(await neighborhood.getAttribute('aria-selected'), 'true');
    assert.equal(await neighborhood.evaluate((element) => element === document.activeElement), true);
    const openGallery = page.locator('.project-gallery__open').first();
    await openGallery.focus();
    await page.keyboard.press('Enter');
    const dialog = page.locator('dialog[open]');
    assert.equal(await dialog.count(), 1);
    await dialog.locator('img').evaluate((image) => image.decode());
    assert.equal(await dialog.getByRole('button', { name: 'Précédent', exact: true }).isDisabled(), true);
    for (let step = 0; step < 5; step++) {
      await page.keyboard.press('Tab');
      // A native modal may hand focus to browser chrome (activeElement is body).
      // No underlying page control must receive focus while it remains open.
      assert.equal(await dialog.evaluate((element) => document.activeElement === document.body || element.contains(document.activeElement)), true, 'background page controls stay outside the tab sequence');
    }
    await dialog.getByRole('button', { name: 'Fermer', exact: true }).focus();
    await page.keyboard.press('ArrowRight');
    assert.match(await dialog.locator('img').getAttribute('alt'), /Détail de la maquette/);
    assert.equal(await dialog.getByRole('button', { name: 'Suivant', exact: true }).isDisabled(), true);
    await dialog.locator('img').evaluate((image) => image.decode());
    assert.equal(await dialog.locator('img').evaluate((image) => getComputedStyle(image).objectFit), 'contain', 'gallery shows the full image without cropping');
    await page.keyboard.press('ArrowLeft');
    await dialog.getByRole('button', { name: 'Suivant', exact: true }).click();
    await dialog.getByRole('button', { name: 'Précédent', exact: true }).click();
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('dialog[open]').count(), 0);
    assert.equal(await openGallery.evaluate((button) => button === document.activeElement), true);
    const secondGallery = page.locator('.project-gallery__open').nth(1);
    await secondGallery.click();
    await page.locator('dialog[open]').getByRole('button', { name: 'Fermer', exact: true }).click();
    assert.equal(await secondGallery.evaluate((button) => button === document.activeElement), true);
    const disclosure = page.locator('.project-condition__trigger').first();
    await disclosure.focus();
    await page.keyboard.press('Enter');
    assert.equal(await disclosure.getAttribute('aria-expanded'), 'true');
    await page.keyboard.press('Escape');
    assert.equal(await disclosure.getAttribute('aria-expanded'), 'false');
    for (const link of await page.locator('main a[href^="/contact"]').all()) {
      const destination = new URL(await link.getAttribute('href'), base);
      assert.equal(destination.pathname, '/contact');
      assert.equal(destination.searchParams.get('projet'), 'c-premium');
    }
    if (screenshots && [375, 768, 1512].includes(width)) { await page.evaluate(() => window.scrollTo(0, 0)); await page.screenshot({ path: `${screenshots}/${width}.png`, fullPage: true }); }
    for (const [area, id] of [[98, 't4-98'], [103, 't4-103']]) {
      await page.getByRole('link', { name: `Me renseigner sur ce T4 · ${area} m²`, exact: true }).click();
      await page.waitForURL('**/contact?**');
      await page.waitForFunction((value) => document.querySelector(`input[name="interest"][value="${value}"]`)?.checked, id);
      assert.equal(new URL(page.url()).hash, '#demande-informations');
      await page.goto(`${base}/projets/c-premium`);
    }
    console.log(`PASS ${width}px: overflow, images, gallery, disclosures, CTA, form and T4 selection`);
  }
  for (const slug of ['central-avenue', 'breuil']) assert.equal((await page.goto(`${base}/projets/${slug}`)).status(), 200);
  assert.deepEqual(errors, []);
} finally { await browser.close(); }
