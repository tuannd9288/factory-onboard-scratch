import { before, test } from 'node:test';
import assert from 'node:assert/strict';
let send;
before(async () => ({ send } = await import('../src/send.js')));

test('a transient failure on every attempt rejects after exactly `attempts` calls', async () => {
  let calls = 0;
  const transport = async () => {
    calls += 1;
    throw Object.assign(new Error('busy'), { transient: true });
  };
  await assert.rejects(send(transport, { to: 'a', text: 'hi' }, { attempts: 4 }), /busy/);
  assert.equal(calls, 4);
});

test('a message without text is refused before the transport is called', async () => {
  let calls = 0;
  await assert.rejects(send(async () => { calls += 1; }, { to: 'a' }), TypeError);
  assert.equal(calls, 0);
});
