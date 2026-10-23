/* global Request, Response */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { handleProjectContact } from '../lib/project-contact.ts';
import { programs } from '../data/programs.ts';

const payload = { project: 'c-premium', firstName: 'Test', lastName: 'Recette', email: 'qa@example.com', phone: '', interest: 't4-98', message: 'Informations sur ce T4.', consent: 'yes', website: '' };
const config = { apiKey: 'test-only', from: 'test@example.com', recipient: 'projets@onecityimmobilier.fr' };
const key = '11111111-1111-4111-8111-111111111111';
const request = (body = payload, headers = {}) => new Request('https://preview.example.com/api/project-contact', { method: 'POST', headers: { origin: 'https://preview.example.com', 'content-type': 'application/json', 'idempotency-key': key, ...headers }, body: JSON.stringify(body) });
const unexpectedSend = () => { assert.fail('No email should be sent'); };

test('missing Resend configuration returns 503 without pretending to send', async () => {
  const response = await handleProjectContact(request(), programs, { recipient: config.recipient }, unexpectedSend);
  assert.equal(response.status, 503);
});

test('rejects invalid input, fabricated homes, non-commercial projects and absent consent before sending', async () => {
  for (const change of [{ email: 'invalid' }, { firstName: '' }, { consent: 'no' }, { interest: 't4-999' }, { project: 'breuil' }, { project: 'central-avenue' }, { message: 'x'.repeat(5001) }, { website: 'spam' }, { email: 'a@b.com\r\nBcc:evil@example.com' }, { phone: 10 }]) {
    assert.equal((await handleProjectContact(request({ ...payload, ...change }), programs, config, unexpectedSend)).status, 400, JSON.stringify(change));
  }
});

test('rejects foreign origins, wrong content type, missing request key and oversized JSON', async () => {
  assert.equal((await handleProjectContact(request(payload, { origin: 'https://evil.example' }), programs, config, unexpectedSend)).status, 403);
  assert.equal((await handleProjectContact(request(payload, { 'content-type': 'text/plain' }), programs, config, unexpectedSend)).status, 415);
  assert.equal((await handleProjectContact(request(payload, { 'idempotency-key': '' }), programs, config, unexpectedSend)).status, 400);
  assert.equal((await handleProjectContact(request({ ...payload, message: 'x'.repeat(33000) }), programs, config, unexpectedSend)).status, 413);
  assert.equal((await handleProjectContact(request(null), programs, config, unexpectedSend)).status, 400);
});

test('Resend request uses a fixed recipient, verified sender config, visitor reply-to and stable idempotency', async () => {
  const calls = [];
  const send = async (url, options) => { calls.push({ url, ...options }); return Response.json({ id: 'test-receipt' }); };
  for (let attempt = 0; attempt < 2; attempt++) assert.equal((await handleProjectContact(request({ ...payload, to: 'evil@example.com' }), programs, config, send)).status, 200);
  const [first, second] = calls;
  assert.equal(first.url, 'https://api.resend.com/emails');
  assert.deepEqual(JSON.parse(first.body).to, [config.recipient]);
  assert.equal(JSON.parse(first.body).from, config.from);
  assert.equal(JSON.parse(first.body).reply_to, payload.email);
  assert.match(JSON.parse(first.body).text, /T4 · 98 m²/);
  assert.equal(first.headers['Idempotency-Key'], second.headers['Idempotency-Key']);
  assert.equal(first.body, second.body);
});

test('provider failures, incomplete receipts and network errors never return success', async () => {
  for (const send of [async () => Response.json({ message: 'private provider detail' }, { status: 429 }), async () => Response.json({}), async () => { throw new Error('private credential details'); }]) {
    const response = await handleProjectContact(request(), programs, config, send);
    assert.equal(response.status, 502);
    assert.doesNotMatch(await response.text(), /private/);
  }
});
