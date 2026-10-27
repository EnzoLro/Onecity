import assert from 'node:assert/strict';
import { test } from 'node:test';
import { programs } from '../data/programs.ts';
import { footer } from '../data/footer.ts';
import { organization } from '../data/organization.ts';
import { createOrganization, createBreadcrumbs, createProgramStructuredData, serializeStructuredData } from '../lib/structured-data.ts';

const origin = 'https://www.example.com';

test('organization uses only the supplied public identity, without inferred profiles or legal facts', () => {
  const org = createOrganization(origin, { ...organization, name: 'One City Immobilier', email: 'projets@onecityimmobilier.fr', telephone: footer.phone.href.slice(4), address: footer.address });
  assert.equal(org.address, footer.address.join(', '));
  assert.equal(org.telephone, '+33785010457');
  assert.equal(org['@id'], `${origin}/#organization`);
  assert.equal(org.legalName, 'ONE CITY IMMOBILIER');
  assert.deepEqual(org.identifier, { '@type': 'PropertyValue', propertyID: 'SIREN', value: '440314540' });
  for (const key of ['taxID', 'sameAs', 'aggregateRating', 'review', 'areaServed']) assert.equal(key in org, false);
});

test('breadcrumb has a real two-level path, ordered positions and canonical absolute URLs', () => {
  const data = createBreadcrumbs(origin, '/projets/c-premium', 'C’Premium');
  assert.deepEqual(data.itemListElement.map(item => [item.position, item.name, item.item]), [[1, 'Accueil', `${origin}/`], [2, 'C’Premium', `${origin}/projets/c-premium`]]);
});

test('only documented apartment detail pages expose the visible homes and areas', () => {
  const program = programs[0];
  const data = createProgramStructuredData(origin, program);
  assert.equal(data['@type'], 'ApartmentComplex');
  for (const value of Object.values(program.structuredData.address)) assert.ok(program.editorial.detail.location.description.includes(value));
  assert.deepEqual(data.containsPlace.map(home => home.floorSize), program.editorial.detail.homes.items.map(home => ({ '@type': 'QuantitativeValue', value: home.area, unitCode: 'MTK' })));
  for (const p of [...programs.slice(1), { ...program, structuredData: undefined }, { ...program, editorial: {} }, { ...program, seo: { indexable: false } }]) assert.equal(createProgramStructuredData(origin, p), null);
  assert.doesNotMatch(JSON.stringify(data), /offers|price|availability|numberOfBedrooms|numberOfAccommodationUnits|aggregateRating|review/);
});

test('script serialization prevents HTML breakout while preserving exact JSON values', () => {
  const value = { name: '</script><script>alert("x")</script> & C’Premium' };
  const serialized = serializeStructuredData(value);
  assert.ok(!serialized.includes('<'));
  assert.deepEqual(JSON.parse(serialized), value);
});
