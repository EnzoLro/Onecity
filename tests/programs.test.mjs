import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { test } from 'node:test';
import { URL } from 'node:url';
import { programs, getProgram, projectHref } from '../data/programs.ts';

test('program routes and fact identifiers are unique', () => {
  assert.equal(new Set(programs.map(({ slug }) => slug)).size, programs.length);
  for (const program of programs) {
    assert.match(program.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.equal(getProgram(program.slug), program);
    assert.equal(projectHref(program.slug), `/projets/${program.slug}`);
    assert.equal(new Set(program.commercial.facts.map(({ id }) => id)).size, program.commercial.facts.length);
  }
  assert.equal(getProgram('unknown-program'), undefined);
  assert.equal(getProgram('toString'), undefined);
});

test('card selections and commercial disclosures resolve in their own program', () => {
  for (const program of programs) {
    const { facts, conditions } = program.commercial;
    assert.equal(new Set(conditions.map(({ id }) => id)).size, conditions.length);
    for (const id of program.editorial.card?.factIds ?? []) {
      assert.ok(facts.some((fact) => fact.id === id), `${program.slug}: missing fact ${id}`);
    }
    for (const fact of facts) {
      if (fact.condition) {
        assert.ok(conditions.some(({ id }) => id === fact.condition), `${program.slug}: missing disclosure`);
        assert.ok(fact.marker);
      }
    }
  }
});

test('published images exist and have accessible descriptions', () => {
  for (const program of programs) {
    for (const content of [program.editorial.card, program.editorial.featured]) {
      if (!content) continue;
      assert.ok(content.image.alt.trim());
      assert.ok(existsSync(new URL(`../public${content.image.src}`, import.meta.url)), content.image.src);
    }
  }
});

test('Breuil stays provisional without unconfirmed commercial content or home card', () => {
  const breuil = getProgram('breuil');
  assert.ok(breuil);
  assert.equal(breuil.label, 'Breuil');
  assert.deepEqual(breuil.commercial, { facts: [], conditions: [] });
  assert.deepEqual(breuil.editorial, {});
});
