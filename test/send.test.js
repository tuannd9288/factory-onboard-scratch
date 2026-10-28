import { before, test } from 'node:test';
import assert from 'node:assert/strict';
let send;
before(async () => ({ send } = await import('../src/send.js')));

test('returns what the transport returns', async () => {
  assert.equal(await send(async () => 'ok', { to: 'a', text: 'hi' }), 'ok');
});

test('retries transient failures', async () => {
  let calls = 0;
  const transport = async () => {
    calls += 1;
    if (calls < 3) throw Object.assign(new Error('busy'), { transient: true });
    return 'ok';
  };
  assert.equal(await send(transport, { to: 'a', text: 'hi' }), 'ok');
  assert.equal(calls, 3);
});

test('does not retry a permanent failure', async () => {
  let calls = 0;
  const transport = async () => {
    calls += 1;
    throw new Error('bad recipient');
  };
  await assert.rejects(send(transport, { to: 'a', text: 'hi' }), /bad recipient/);
  assert.equal(calls, 1);
});

test('refuses a message without a recipient', async () => {
  await assert.rejects(send(async () => 'ok', { text: 'hi' }), TypeError);
});

test('refuses fewer than one attempt', async () => {
  await assert.rejects(send(async () => 'ok', { to: 'a', text: 'hi' }, { attempts: 0 }), RangeError);
});

test('refuses more than ten attempts', async () => {
  await assert.rejects(send(async () => 'ok', { to: 'a', text: 'hi' }, { attempts: 11 }), RangeError);
});
