import { before, test } from 'node:test';
import assert from 'node:assert/strict';
let createLimiter;
before(async () => ({ createLimiter } = await import('../src/ratelimit.js')));

test('a refused send does not hold a slot', () => {
  let t = 0;
  const limiter = createLimiter({ limit: 1, windowMs: 1000, now: () => t });
  assert.equal(limiter.allow('a'), true);
  t = 500;
  assert.equal(limiter.allow('a'), false);
  t = 1000;
  assert.equal(limiter.allow('a'), true);
});

test('remaining gives a slot back once the window passes', () => {
  let t = 0;
  const limiter = createLimiter({ limit: 1, windowMs: 1000, now: () => t });
  limiter.allow('a');
  assert.equal(limiter.remaining('a'), 0);
  t = 1000;
  assert.equal(limiter.remaining('a'), 1);
});
