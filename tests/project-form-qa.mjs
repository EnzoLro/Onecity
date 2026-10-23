/* global document */
// Run only against a local build enabled with test-only Resend configuration.
// Every contact request is intercepted by Playwright; no email is sent.
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import process from 'node:process';
import console from 'node:console';
const { chromium } = createRequire(import.meta.url)('playwright');
const base = process.argv[2] || 'http://localhost:3105';
assert.match(base, /^http:\/\/(localhost|127\.0\.0\.1):\d+$/);
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  const requests = [];
  let fail = true;
  await page.route('**/api/project-contact', async (route) => {
    requests.push({ payload: route.request().postDataJSON(), key: route.request().headers()['idempotency-key'] });
    await route.fulfill({ status: fail ? 502 : 200, contentType: 'application/json', body: JSON.stringify({ message: fail ? 'L’envoi a échoué. Veuillez réessayer.' : 'Votre demande a été transmise à notre équipe.' }) });
  });
  await page.goto(`${base}/projets/c-premium?logement=t4-103#demande-informations`);
  const form = page.locator('.project-contact');
  await page.waitForFunction(() => document.querySelector('[name="interest"][value="t4-103"]').checked);
  await form.getByRole('button', { name: 'Envoyer ma demande' }).click();
  assert.equal(requests.length, 0, 'Required fields block submission');
  await page.getByLabel('Prénom *', { exact: true }).fill('Recette');
  await page.getByLabel('Nom *', { exact: true }).fill('Locale');
  await page.getByLabel('E-mail *', { exact: true }).fill('qa@example.com');
  await page.getByRole('checkbox').check();
  await form.getByRole('button', { name: 'Envoyer ma demande' }).click();
  await form.getByRole('status').filter({ hasText: 'L’envoi a échoué' }).waitFor();
  assert.equal(await page.getByLabel('Prénom *', { exact: true }).inputValue(), 'Recette', 'Failed send preserves entered values');
  fail = false;
  await form.getByRole('button', { name: 'Envoyer ma demande' }).click();
  await form.getByRole('status').filter({ hasText: 'Votre demande a été transmise' }).waitFor();
  assert.equal(requests[0].payload.interest, 't4-103');
  assert.equal(requests[0].key, requests[1].key, 'Retry reuses idempotency key');
  assert.equal(await page.getByLabel('Prénom *', { exact: true }).inputValue(), '');
  assert.equal(await page.getByRole('radio', { name: 'À définir ensemble' }).isChecked(), true);
  console.log('PASS: required fields, preselection, failed send preserving values, retry idempotency and successful reset (intercepted HTTP only)');
} finally { await browser.close(); }
