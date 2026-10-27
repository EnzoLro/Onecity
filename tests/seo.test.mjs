import assert from 'node:assert/strict';
import { test } from 'node:test';
import { programs } from '../data/programs.ts';
import { canonicalOrigin, getSeoConfig, pageSeo, createPageMetadata, createProgramMetadata, createSitemap, createRobots, isProgramIndexable } from '../lib/seo.ts';

const production = { VERCEL_ENV: 'production', SITE_URL: 'https://www.example.com' };
const preview = { ...production, VERCEL_ENV: 'preview' };

test('indexing requires production; the public origin is confirmed and overrides are validated', () => {
  for (const env of [{}, { SITE_URL: production.SITE_URL }, preview, { ...production, VERCEL_ENV: 'development' }]) {
    assert.equal(getSeoConfig(env).indexable, false);
    assert.equal(createPageMetadata(pageSeo.home, env).robots.index, false);
    assert.deepEqual(createSitemap(programs, env), []);
    assert.deepEqual(createRobots(env), { rules: { userAgent: '*', disallow: '/' } });
  }
  for (const SITE_URL of ['invalid', 'http://example.com', 'https://example.com/path', 'https://example.com?x=1', 'https://example.com/#x', 'https://user:pass@example.com']) {
    assert.throws(() => getSeoConfig({ ...production, SITE_URL }));
  }
  assert.equal(getSeoConfig(production).indexable, true);
  assert.equal(getSeoConfig({ VERCEL_ENV: 'production' }).origin, canonicalOrigin);
  assert.equal(getSeoConfig({ VERCEL_ENV: 'production' }).indexable, true);
  assert.equal(getSeoConfig({ ...production, SITE_URL: production.SITE_URL + '/' }).origin, production.SITE_URL);
});

test('canonical and social URLs always use the configured production origin', () => {
  for (const env of [production, preview]) {
    const metadata = createPageMetadata(pageSeo.contact, env);
    assert.equal(metadata.alternates.canonical, production.SITE_URL + '/contact');
    assert.equal(metadata.openGraph.url, metadata.alternates.canonical);
    assert.equal(metadata.openGraph.locale, 'fr_FR');
    assert.match(metadata.openGraph.images[0].url, /^https:\/\/www.example.com\/brand\//);
    assert.equal(metadata.twitter.card, 'summary_large_image');
  }
  assert.equal(createPageMetadata(pageSeo.home, {}).alternates.canonical, canonicalOrigin + '/');
});

test('only completed, explicitly approved programs enter the production sitemap', () => {
  assert.deepEqual(programs.filter(isProgramIndexable).map(p => p.slug), ['c-premium']);
  const sitemap = createSitemap(programs, production);
  assert.deepEqual(sitemap.map(p => p.url), [production.SITE_URL + '/', production.SITE_URL + '/contact', production.SITE_URL + '/projets/c-premium']);
  assert.equal(new Set(sitemap.map(p => p.url)).size, sitemap.length);
  assert.deepEqual(createRobots(production), { rules: { userAgent: '*', allow: '/', disallow: '/api/' }, sitemap: production.SITE_URL + '/sitemap.xml' });
  const future = { ...programs[0], slug: 'future', seo: undefined };
  assert.equal(isProgramIndexable(future), false);
  assert.equal(isProgramIndexable({ ...future, seo: programs[0].seo }), true);
  assert.equal(isProgramIndexable({ ...programs[0], editorial: {} }), false);
});

test('page titles and descriptions are unique, scaffolds remain noindex even in production', () => {
  const metadata = [...Object.values(pageSeo).map(p => createPageMetadata(p, production)), ...programs.map(p => createProgramMetadata(p, production))];
  for (const field of ['title', 'description']) assert.equal(new Set(metadata.map(p => p[field])).size, metadata.length);
  for (const program of programs) {
    assert.equal(createProgramMetadata(program, production).robots.index, program.slug === 'c-premium');
    assert.equal(createProgramMetadata(program, preview).robots.index, false);
  }
  assert.equal(createPageMetadata({ ...pageSeo.contact, indexable: false }, production).robots.index, false);
});
