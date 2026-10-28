import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createLimiter } from '../src/ratelimit.js';

test('allows up to the limit, then refuses', () => {
  let t = 0;
  const limiter = createLimiter({ limit: 2, windowMs: 1000, now: () => t });
  assert.equal(limiter.allow('a'), true);
  assert.equal(limiter.allow('a'), true);
  assert.equal(limiter.allow('a'), false);
});

test('counts each recipient on its own', () => {
  const limiter = createLimiter({ limit: 1, windowMs: 1000, now: () => 0 });
  assert.equal(limiter.allow('a'), true);
  assert.equal(limiter.allow('b'), true);
});

test('frees a slot once the window passes', () => {
  let t = 0;
  const limiter = createLimiter({ limit: 1, windowMs: 1000, now: () => t });
  assert.equal(limiter.allow('a'), true);
  t = 1000;
  assert.equal(limiter.allow('a'), true);
});

test('reports what is left', () => {
  const limiter = createLimiter({ limit: 3, windowMs: 1000, now: () => 0 });
  limiter.allow('a');
  assert.equal(limiter.remaining('a'), 2);
});
