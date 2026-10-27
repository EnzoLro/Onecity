import assert from 'node:assert/strict';
import { test } from 'node:test';
import { analyticsEnabled, readConsent, serializeConsent, safePath, linkEvents } from '../lib/analytics.ts';
import { programs } from '../data/programs.ts';
const records = programs.map(p => ({ slug: p.slug, homes: p.editorial.detail?.homes.items.map(h => h.id) ?? [] }));
const origin = 'https://www.onecityimmobilier.fr';

test('only the production environment and confirmed public host permit GA4', () => {
  for (const env of [undefined, 'preview', 'development', 'staging']) assert.equal(analyticsEnabled(env, 'www.onecityimmobilier.fr'), false);
  for (const host of ['localhost', 'onecity.vercel.app', 'onecityimmobilier.fr', 'www.onecityimmobilier.fr.example.com']) assert.equal(analyticsEnabled('production', host), false);
  assert.equal(analyticsEnabled('production', 'www.onecityimmobilier.fr'), true);
});

test('consent is versioned, explicit and expires after six calendar months for both choices', () => {
  const now = new Date('2026-01-15T10:00:00Z');
  for (const choice of ['accepted', 'refused']) {
    const raw = serializeConsent(choice, now);
    assert.equal(readConsent(raw, now.getTime()), choice);
    assert.equal(readConsent(raw, new Date('2026-07-15T10:00:00Z').getTime()), null);
    assert.equal(readConsent(raw, now.getTime() - 1), null);
  }
  for (const raw of [null, 'bad', '{}', 'true', JSON.stringify({ version: 0, choice: 'accepted', expires: Date.now() + 10000 }), JSON.stringify({ version: 1, choice: 'yes', created: 1, expires: Date.now() + 10000 })]) assert.equal(readConsent(raw), null);
});

test('only known paths enter measurement, never URL search or fragment', () => {
  assert.equal(safePath('/contact', records), '/contact');
  for (const path of ['/contact?email=private@example.com', '/private@example.com', '/apercu-composants', '/projets/invented', '/contact#private']) assert.equal(safePath(path, records), null);
});

test('phone and email measure intent without contact destination or mail subject', () => {
  assert.deepEqual(linkEvents('mailto:private@example.com?subject=secret', origin, '/', records), [{ name: 'click_email', params: { page_path: '/' } }]);
  assert.deepEqual(linkEvents('tel:+33600000000', origin, '/projets/c-premium', records), [{ name: 'click_phone', params: { page_path: '/projets/c-premium', program_id: 'c-premium' } }]);
});

test('discovery and programme contact use registry IDs and exclude foreign URLs', () => {
  assert.equal(linkEvents('/projets/c-premium?email=secret', origin, '/', records)[0].name, 'discover_project');
  assert.deepEqual(linkEvents('https://elsewhere.example/contact?projet=c-premium', origin, '/', records), []);
  assert.deepEqual(linkEvents('/contact?projet=fabricated', origin, '/', records), []);
  assert.deepEqual(linkEvents('mailto:x@example.com', origin, '/unknown', records), []);
  assert.deepEqual(linkEvents('/contact', origin, '/projets/c-premium', records), [{ name: 'project_contact_click', params: { page_path: '/projets/c-premium', program_id: 'c-premium' } }]);
});

test('a home CTA measures contact intent and a known home, never arbitrary query values', () => {
  const events = linkEvents('/contact?projet=c-premium&logement=t4-98&email=secret#secret', origin, '/projets/c-premium', records);
  assert.deepEqual(events.map(e => e.name), ['project_contact_click', 'select_home']);
  assert.equal(events[1].params.home_id, 't4-98');
  assert.doesNotMatch(JSON.stringify(events), /email|secret|logement/);
  assert.equal(linkEvents('/contact?projet=c-premium&logement=secret', origin, '/', records).length, 1);
});
