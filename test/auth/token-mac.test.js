import { before, test } from 'node:test';
import assert from 'node:assert/strict';
let sign, verify;
before(async () => ({ sign, verify } = await import('../../src/auth/token.js')));

test('a MAC shorter than a SHA-256 one is refused, not thrown on', () => {
  const [recipient, expiresAt] = sign('u1', 2000, 'k').split('.');
  assert.equal(verify(`${recipient}.${expiresAt}.ab`, 'k', 1000), null);
});
