/* global window, document, localStorage, MouseEvent */
import process from "node:process";
import console from "node:console";
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import { consentKey, serializeConsent } from '../lib/analytics.ts';
const { chromium } = createRequire(import.meta.url)('playwright');
const base = process.argv[2] ?? 'http://localhost:3116';
const mode = process.argv[3] ?? 'preview';
const publicOrigin = 'https://www.onecityimmobilier.fr';
const origin = mode === 'production' ? publicOrigin : base;
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const requests = [];
const errors = [];
try {
  // All Google traffic is intercepted; these tests never send analytics to the property.
  await context.route(/https:\/\/[^/]*(google-analytics\.com|googletagmanager\.com)\//, async route => {
    requests.push(route.request().url());
    await route.fulfill({ status: 200, contentType: 'application/javascript', body: '' });
  });
  if (mode === 'production') await context.route(`${publicOrigin}/**`, async route => {
    const url = route.request().url().replace(publicOrigin, base);
    const response = await context.request.fetch(url, { method: route.request().method(), headers: route.request().headers(), data: route.request().postData() ?? undefined });
    await route.fulfill({ response });
  });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  const events = () => page.evaluate(() => Array.from(window.dataLayer ?? [], item => Array.from(item)).filter(item => item[0] === 'event'));
  const go = async path => { await page.goto(`${origin}${path}`); await page.locator('.analytics-consent').waitFor(); };
  for (const width of [320, 375, 768, 1512]) {
    await page.setViewportSize({ width, height: 900 });
    await go('/');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
    assert.equal(await page.getByRole('button', { name: 'Accepter', exact: true }).isVisible(), true);
    assert.equal(requests.length, 0);
  }
  const shots = process.env.QA_SCREENSHOTS;
  if (shots) { mkdirSync(shots, { recursive: true }); await page.screenshot({ path: `${shots}/consent-desktop.png` }); }
  await page.getByRole('button', { name: 'Refuser', exact: true }).click();
  await page.locator('.analytics-consent').waitFor({ state: 'hidden' });
  assert.equal(requests.length, 0);
  await page.reload();
  await page.getByRole('link', { name: 'Paramètres des cookies', exact: true }).click();
  await page.locator('.analytics-consent--settings').waitFor();
  await page.locator('.analytics-consent--settings [role="status"]').filter({ hasText: /refusée/ }).waitFor();
  await page.getByRole('button', { name: 'Accepter', exact: true }).click();
  if (mode === 'preview') {
    assert.equal(requests.length, 0);
    await page.goto(`${origin}/projets/c-premium`);
    await page.locator('h1').waitFor();
    assert.equal(await page.locator('#onecity-ga4').count(), 0);
    assert.equal(requests.length, 0);
    await page.goto(`${origin}/parametres-cookies`);
    await page.locator('.analytics-consent--settings').waitFor();
    assert.match(await page.locator('main').innerText(), /désactivé/);
  } else {
    await page.locator('#onecity-ga4').waitFor({ state: 'attached' });
    assert.equal(requests.length, 1);
    assert.equal((await events()).filter(e => e[1] === 'page_view').length, 1);
    await page.goto(`${origin}/?email=private@example.com#secret`);
    await page.locator('#onecity-ga4').waitFor({ state: 'attached' });
    assert.doesNotMatch(JSON.stringify(await events()), /private|secret|email=/);
    // Capture link intents without opening native phone or mail applications.
    for (const [selector, name] of [['a[href^="tel:"]', 'click_phone'], ['a[href^="mailto:"]', 'click_email']]) {
      // Dispatch directly at document so the analytics listener runs before the test-only navigation cancellation.
      await page.locator(selector).first().evaluate(el => { const event = new MouseEvent('click', { bubbles: true, cancelable: true }); document.addEventListener('click', e => e.preventDefault(), { once: true }); el.dispatchEvent(event); });
      assert.equal((await events()).filter(e => e[1] === name).length, 1);
    }
    // The normal anchor navigation starts a new document: preserve the old event queue before it unloads.
    await page.locator('a[href="/projets/c-premium"]').first().evaluate(el => { document.addEventListener('click', e => e.preventDefault(), { once: true }); el.click(); });
    assert.equal((await events()).filter(e => e[1] === 'discover_project').length, 1);
    await page.goto(`${origin}/projets/c-premium`);
    await page.locator('#onecity-ga4').waitFor({ state: 'attached' });
    assert.equal((await events()).filter(e => e[1] === 'view_project').length, 1);
    await page.locator('a[data-home-interest="t4-98"]').evaluate(el => { document.addEventListener('click', e => e.preventDefault(), { once: true }); el.click(); });
    assert.equal((await events()).filter(e => e[1] === 'select_home').length, 1);
    assert.equal((await events()).filter(e => e[1] === 'project_contact_click').length, 1);
    await page.goto(`${origin}/contact?projet=c-premium&logement=t4-98&email=private@example.com`);
    await page.locator('#onecity-ga4').waitFor({ state: 'attached' });
    await page.locator('[name="firstName"]').fill('Private');
    await page.locator('[name="lastName"]').fill('Person');
    assert.equal((await events()).filter(e => e[1] === 'form_start').length, 1);
    assert.equal((await events()).filter(e => e[1] === 'generate_lead').length, 0);
    assert.doesNotMatch(JSON.stringify(await events()), /Private|Person|private@example/);
    if (process.argv.includes('--form-enabled')) {
      let attempt = 0;
      await context.route(`${publicOrigin}/api/project-contact`, async route => {
        attempt += 1;
        await route.fulfill({ status: attempt === 1 ? 503 : 200, contentType: 'application/json', body: JSON.stringify({ message: attempt === 1 ? 'Erreur simulée' : 'Envoi simulé' }) });
      });
      await page.locator('[name="email"]').fill('private@example.com');
      await page.locator('[name="consent"]').check();
      await page.getByRole('button', { name: 'Envoyer ma demande', exact: true }).click();
      await page.getByRole('status').filter({ hasText: 'Erreur simulée' }).waitFor();
      assert.equal((await events()).filter(e => e[1] === 'generate_lead').length, 0);
      await page.getByRole('button', { name: 'Envoyer ma demande', exact: true }).click();
      await page.getByRole('status').filter({ hasText: 'Votre demande a été transmise' }).waitFor();
      assert.equal((await events()).filter(e => e[1] === 'generate_lead').length, 1);
      assert.equal((await events()).find(e => e[1] === 'generate_lead')[2].home_id, 't4-98');
      assert.doesNotMatch(JSON.stringify(await events()), /Private|Person|private@example/);
      await page.locator('[name="firstName"]').fill('New');
      assert.equal((await events()).filter(e => e[1] === 'form_start').length, 2);
    }
    await page.goto(`${origin}/parametres-cookies`);
    await page.locator('#onecity-ga4').waitFor({ state: 'attached' });
    await context.addCookies([{ name: '_ga', value: 'test', domain: 'www.onecityimmobilier.fr', path: '/' }]);
    const count = requests.length;
    await page.getByRole('button', { name: 'Refuser', exact: true }).click();
    await page.waitForLoadState('load');
    await page.locator('.analytics-consent--settings').waitFor();
    assert.equal(await page.locator('#onecity-ga4').count(), 0);
    assert.equal((await context.cookies()).some(c => c.name === '_ga'), false);
    assert.equal(requests.length, count);
    await page.locator('.analytics-consent--settings [role="status"]').filter({ hasText: /refusée/ }).waitFor();
  }
  // Corrupt and expired stored choices fail closed.
  for (const raw of ['invalid', serializeConsent('accepted', new Date('2020-01-01'))]) {
    await page.evaluate(({ key, raw }) => localStorage.setItem(key, raw), { key: consentKey, raw });
    const count = requests.length;
    await page.goto(`${origin}/`);
    await page.locator('.analytics-consent').waitFor();
    assert.equal(await page.locator('#onecity-ga4').count(), 0);
    assert.equal(requests.length, count);
  }
  assert.deepEqual(errors, []);
  console.log(`Analytics ${mode}: consent, responsive settings, network isolation${mode === 'production' ? ', journey events, privacy and withdrawal' : ', GA4 excluded'} OK`);
} finally { await browser.close(); }
