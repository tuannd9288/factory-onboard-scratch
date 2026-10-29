import { before, test } from 'node:test';
import assert from 'node:assert/strict';
let truncate, initials;
before(async () => ({ truncate, initials } = await import('../src/format.js')));

test('a limit of zero gives nothing and a limit of one gives one character', () => {
  assert.equal(truncate('abc', 0), '');
  assert.equal(truncate('abc', 1), 'a');
});

test('text exactly as long as the limit is kept whole', () => {
  assert.equal(truncate('abcde', 5), 'abcde');
});

test('a blank name has no initials', () => {
  assert.equal(initials(' '), '');
});
