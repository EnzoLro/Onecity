/* global fetch, URL */
import process from 'node:process';
import assert from 'node:assert/strict';

const base = process.argv[2] ?? 'http://localhost:3115';
const origin = process.argv[3] ?? 'https://www.onecityimmobilier.fr';
const routes = ['/', '/contact', '/projets/c-premium', '/projets/central-avenue', '/projets/breuil', '/mentions-legales', '/politique-de-confidentialite', '/parametres-cookies', '/apercu-composants'];
for (const path of routes) {
  const response = await fetch(new URL(path, base), { headers: { 'user-agent': 'Googlebot' } });
  assert.equal(response.status, 200, path);
  const html = await response.text();
  const visible = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '').replace(/<[^>]*>/g, ' ');
  const compact = value => value.replace(/\s/g, '').toLowerCase();
  const payloads = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(match => JSON.parse(match[1]));
  const orgs = payloads.filter(item => item['@type'] === 'Organization');
  assert.equal(orgs.length, 1, path);
  assert.equal(orgs[0]['@id'], `${origin}/#organization`);
  assert.ok(visible.includes(orgs[0].legalName));
  assert.ok(visible.includes(orgs[0].identifier.value));
  for (const field of ['name', 'email', 'telephone']) assert.ok(compact(visible).includes(compact(orgs[0][field])), `${path}: visible ${field}`);
  const breadcrumbs = payloads.filter(item => item['@type'] === 'BreadcrumbList');
  assert.equal(breadcrumbs.length, path === '/' || path === '/apercu-composants' ? 0 : 1, path);
  for (const breadcrumb of breadcrumbs) {
    assert.ok(html.includes('aria-label="Fil d’Ariane"'), path);
    assert.equal(breadcrumb.itemListElement[1].item, `${origin}${path}`);
    assert.ok(html.includes(`aria-current="page">${breadcrumb.itemListElement[1].name}<`), path);
  }
  const residences = payloads.filter(item => item['@type'] === 'ApartmentComplex');
  assert.equal(residences.length, path === '/projets/c-premium' ? 1 : 0, path);
  for (const residence of residences) {
    for (const key of ['streetAddress', 'addressLocality']) assert.ok(visible.includes(residence.address[key]));
    assert.deepEqual(residence.containsPlace.map(home => home.floorSize.value), [98, 103]);
    for (const home of residence.containsPlace) assert.ok(html.includes(`id="home-${home['@id'].split('#home-')[1]}"`));
  }
  for (const payload of payloads) {
    assert.equal(payload['@context'], 'https://schema.org');
    assert.doesNotMatch(JSON.stringify(payload), /orimaj|aggregateRating|"review"|"offers"|"availability"|"FAQPage"/i);
  }
}
process.stdout.write(`JSON-LD QA: ${routes.length} pages, JSON parsing, visible content, breadcrumbs and programme exclusions passed.\n`);
