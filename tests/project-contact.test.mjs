/* global Request, Response */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { handleProjectContact } from '../lib/project-contact.ts';
import { programs } from '../data/programs.ts';

const payload = { project: 'c-premium', firstName: 'Test', lastName: 'Recette', email: 'qa@example.com', phone: '', interest: 't4-98', message: 'Informations sur ce T4.', consent: 'yes', website: '', 'cf-turnstile-response': 'XXXX.DUMMY.TOKEN.XXXX' };
const config = { apiKey: 'test-only', from: 'test@example.com', recipient: 'preview-recipient@example.com', turnstileSecret: 'turnstile-test' };
const key = '11111111-1111-4111-8111-111111111111';
const request = (body = payload, headers = {}) => new Request('https://preview.example.com/api/project-contact', { method: 'POST', headers: { origin: 'https://preview.example.com', 'content-type': 'application/json', 'idempotency-key': key, ...headers }, body: JSON.stringify(body) });
const unexpectedSend = () => { assert.fail('No provider request should be sent'); };

test('missing provider configuration returns 503 without pretending to send', async () => {
  for (const missing of [
    { from: config.from, recipient: config.recipient, turnstileSecret: config.turnstileSecret },
    { apiKey: config.apiKey, recipient: config.recipient, turnstileSecret: config.turnstileSecret },
    { apiKey: config.apiKey, from: config.from, turnstileSecret: config.turnstileSecret },
    { apiKey: config.apiKey, from: config.from, recipient: config.recipient },
  ]) {
    const response = await handleProjectContact(request(), programs, missing, unexpectedSend);
    assert.equal(response.status, 503);
  }
});

test('rejects invalid input and missing anti-spam token before providers are called', async () => {
  for (const change of [{ email: 'invalid' }, { firstName: '' }, { consent: 'no' }, { interest: 't4-999' }, { project: 'breuil' }, { project: 'central-avenue' }, { message: 'x'.repeat(5001) }, { website: 'spam' }, { email: 'a@b.com\r\nBcc:evil@example.com' }, { phone: 10 }, { 'cf-turnstile-response': '' }]) {
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

test('invalid, expired or wrong-action Turnstile validation blocks Resend', async () => {
  for (const verification of [{ success: false }, { success: true, action: 'other' }]) {
    const calls = [];
    const send = async (url) => {
      calls.push(url);
      if (url.includes('siteverify')) return Response.json(verification);
      assert.fail('Resend must not be called');
    };
    const response = await handleProjectContact(request(), programs, { ...config, enforceTurnstileAction: true }, send);
    assert.equal(response.status, 400);
    assert.equal(calls.length, 1);
  }
});

test('successful Turnstile validation precedes Resend and preserves safe routing', async () => {
  const calls = [];
  const send = async (url, options) => {
    calls.push({ url, ...options });
    if (url.includes('siteverify')) return Response.json({ success: true, action: 'contact' });
    return Response.json({ id: 'test-receipt' });
  };
  const response = await handleProjectContact(request({ ...payload, to: 'evil@example.com' }), programs, { ...config, enforceTurnstileAction: true }, send);
  assert.equal(response.status, 200);
  assert.equal(calls.length, 2);
  const verification = JSON.parse(calls[0].body);
  assert.equal(verification.secret, config.turnstileSecret);
  assert.equal(verification.response, payload['cf-turnstile-response']);
  assert.equal(verification.idempotency_key, key);
  const email = JSON.parse(calls[1].body);
  assert.deepEqual(email.to, [config.recipient]);
  assert.equal(email.from, config.from);
  assert.equal(email.reply_to, payload.email);
  assert.match(email.text, /T4 · 98 m²/);
});

test('provider failures never return success or leak provider details', async () => {
  const cases = [
    async (url) => url.includes('siteverify') ? Response.json({}, { status: 503 }) : Response.json({ id: 'unexpected' }),
    async (url) => url.includes('siteverify') ? Response.json({ success: true }) : Response.json({ message: 'private provider detail' }, { status: 429 }),
    async () => { throw new Error('private credential details'); },
  ];
  for (const send of cases) {
    const response = await handleProjectContact(request(), programs, config, send);
    assert.equal(response.status, 502);
    assert.doesNotMatch(await response.text(), /private/);
  }
});
