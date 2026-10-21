import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getHomeTestimonials, approvedTestimonials, demoTestimonials } from '../data/testimonials.ts';

for (const environment of ['production', 'staging', '', undefined]) {
  test(`no fictional home reviews in ${String(environment)} production builds`, () => {
    const result = getHomeTestimonials(environment, 'production');
    assert.equal(result.items, approvedTestimonials);
    assert.equal(result.notice, undefined);
  });
}
test('production overrides development', () => {
  assert.equal(getHomeTestimonials('production', 'development').items, approvedTestimonials);
});
for (const [environment, nodeEnvironment] of [['preview', 'production'], [undefined, 'development']]) {
  test(`explicit demonstration in ${environment ?? nodeEnvironment}`, () => {
    const result = getHomeTestimonials(environment, nodeEnvironment);
    assert.equal(result.items, demoTestimonials);
    assert.match(result.notice, /Avis fictif/);
    assert.equal(new Set(result.items.map(item => item.id)).size, 3);
    assert.equal(new Set(result.items.map(item => item.quote)).size, 1);
  });
}
