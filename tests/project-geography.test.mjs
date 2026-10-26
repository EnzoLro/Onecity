import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { URL } from 'node:url';
import { cPremiumLocationMap as geometry } from '../data/c-premium-location-map.ts';
import { cPremiumMapPoints as points } from '../data/c-premium-map-points.ts';

const source = JSON.parse(readFileSync(new URL('../data/geography/c-premium.json', import.meta.url), 'utf8'));
function inside([x, y], polygon) {
  let hit = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i], [xj, yj] = polygon[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

test('confirmed address and station markers use archived official coordinates inside the Yvelines', () => {
  const station = points.find(({ id }) => id === 'gare');
  assert.equal(source.commune.code, '78104');
  assert.equal(source.station.code_uic, '87381509');
  for (const id of ['project', 'express', 'school']) {
    const point = points.find((point) => point.id === id);
    const address = source.addresses[id];
    assert.equal(address.properties.citycode, '78104');
    assert.equal(address.properties.type, 'housenumber');
    assert.ok(address.properties.score > 0.7);
    if (id === 'express') assert.equal(address.properties.name, "3 Rue d'Arnouville");
    assert.deepEqual([point.longitude, point.latitude], address.geometry.coordinates);
  }
  assert.deepEqual({ lon: station.longitude, lat: station.latitude }, source.station.geo_point_2d);
  const contour = source.departments.features.find(({ properties }) => properties.code === '78').geometry.coordinates;
  assert.deepEqual(geometry.boundary, contour);
  for (const point of points) assert.equal(inside([point.longitude, point.latitude], contour[0]), true, point.label);
});

test('the map does not invent an unconfirmed motorway junction or a duplicate commune/property marker', () => {
  assert.equal(points.some(({ id }) => id === 'motorway' || id === 'commune'), false);
  assert.equal(new Set(points.map(({ id }) => id)).size, points.length);
  assert.deepEqual(geometry.coordinates, source.addresses.project.geometry.coordinates);
  assert.ok(geometry.marker[0] > 0 && geometry.marker[0] < geometry.width);
  assert.ok(geometry.marker[1] > 0 && geometry.marker[1] < geometry.height);
});
