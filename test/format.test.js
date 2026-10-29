import { before, test } from 'node:test';
import assert from 'node:assert/strict';
let truncate, squash;
before(async () => ({ truncate, squash } = await import('../src/format.js')));

test('keeps short text whole', () => {
  assert.equal(truncate('xin chào', 20), 'xin chào');
});

test('cuts long text with an ellipsis', () => {
  assert.equal(truncate('abcdefgh', 5), 'abcd…');
});

test('never splits an emoji', () => {
  assert.equal(truncate('ab👍🏽cd', 4), 'ab👍🏽…');
});

test('squashes whitespace', () => {
  assert.equal(squash('  a \n\t b  '), 'a b');
});

test('takes the initials of a Vietnamese name', async () => {
  const format = await import('../src/format.js');
  assert.equal(format.initials('  Nguyễn  Văn Tuấn '), 'NVT');
});
