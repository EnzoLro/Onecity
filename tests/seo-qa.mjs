/* global fetch, URL */
import process from 'node:process';
import assert from 'node:assert/strict';

// Run against a built server or Preview; example.com is reserved for local fixtures.
const base = process.argv[2] ?? 'http://localhost:3114';
const mode = process.argv[3] ?? 'preview';
const origin = process.argv[4];
const routes = ['/', '/contact', '/projets/c-premium', '/projets/central-avenue', '/projets/breuil', '/mentions-legales', '/politique-de-confidentialite', '/parametres-cookies', '/apercu-composants'];
const indexable = new Set(['/', '/contact', '/projets/c-premium']);
const titles = new Set();
const descriptions = new Set();
for (const path of routes) {
  const response = await fetch(new URL(path, base), { headers: { 'user-agent': 'Googlebot' } });
  assert.equal(response.status, 200, path);
  const html = await response.text();
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]*)"/);
  assert.ok(title, path);
  assert.ok(description?.[1], path);
  assert.ok(!titles.has(title), `Duplicate title on ${path}`);
  assert.ok(!descriptions.has(description[1]), `Duplicate description on ${path}`);
  titles.add(title); descriptions.add(description[1]);
  const robots = html.match(/<meta name="robots" content="([^"]*)"/)?.[1];
  assert.ok(robots, path);
  assert.equal(robots.includes('noindex'), !(mode === 'production' && origin && indexable.has(path)), path);
  assert.ok(html.includes('property="og:title"'), path);
  assert.ok(html.includes('property="og:description"'), path);
  assert.ok(html.includes('property="og:locale" content="fr_FR"'), path);
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  assert.equal(canonical ? new URL(canonical).href : undefined, origin ? new URL(path, origin).href : undefined, path);
  if (origin) {
    assert.ok(html.includes('property="og:image"'), path);
    const social = html.match(/<meta property="og:url" content="([^"]*)"/)?.[1];
    assert.equal(social, canonical);
  }
}
const robotsResponse = await fetch(new URL('/robots.txt', base));
assert.equal(robotsResponse.status, 200);
const robots = await robotsResponse.text();
const sitemapResponse = await fetch(new URL('/sitemap.xml', base));
assert.equal(sitemapResponse.status, 200);
assert.match(sitemapResponse.headers.get('content-type'), /xml/);
const sitemap = await sitemapResponse.text();
assert.match(sitemap, /<urlset[^>]*xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9"/);
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
if (mode === 'production' && origin) {
  assert.deepEqual(urls.sort(), [...indexable].map(path => new URL(path, origin).href).sort());
  assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`));
  assert.ok(!robots.includes('Disallow: /\n'));
} else {
  assert.deepEqual(urls, []);
  assert.ok(robots.includes('Disallow: /'));
  assert.ok(!robots.includes('Sitemap:'));
}
const queryHtml = await (await fetch(new URL('/contact?projet=c-premium&logement=t4-98', base), { headers: { 'user-agent': 'Googlebot' } })).text();
assert.equal(queryHtml.match(/<link rel="canonical" href="([^"]*)"/)?.[1], origin ? origin + '/contact' : undefined);
assert.equal((await fetch(new URL('/projets/inconnu', base))).status, 404);
process.stdout.write(`SEO QA: ${routes.length} pages, contact parameters, robots, sitemap and 404 passed (${mode}).\n`);
