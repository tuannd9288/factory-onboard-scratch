import { before, test } from 'node:test';
import assert from 'node:assert/strict';
let sign, verify;
before(async () => ({ sign, verify } = await import('../../src/auth/token.js')));

const key = 'test-key-not-a-secret';

test('a token whose expiry was changed is refused', () => {
  const [recipient, , mac] = sign('u1', 2000, key).split('.');
  assert.equal(verify(`${recipient}.9999999999999.${mac}`, key, 1000), null);
});

test('a token with no numeric expiry is refused', () => {
  assert.equal(verify(sign('u1', undefined, key), key, 1000), null);
  assert.equal(verify(sign('u1', 'soon', key), key, 1000), null);
});
