import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sign, verify } from '../../src/auth/token.js';

const key = 'test-key-not-a-secret';

test('a signed token verifies to its recipient', () => {
  assert.equal(verify(sign('u1', 2000, key), key, 1000), 'u1');
});

test('an expired token is refused', () => {
  assert.equal(verify(sign('u1', 1000, key), key, 1000), null);
});

test('a token signed with another key is refused', () => {
  assert.equal(verify(sign('u1', 2000, 'other-key'), key, 1000), null);
});

test('a tampered recipient is refused', () => {
  const token = sign('u1', 2000, key).replace(/^u1/, 'u2');
  assert.equal(verify(token, key, 1000), null);
});

test('a malformed token is refused', () => {
  assert.equal(verify('nonsense', key, 1000), null);
});
