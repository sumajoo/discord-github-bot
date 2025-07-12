import { test, mock } from 'node:test';
import assert from 'node:assert/strict';

process.env.NODE_ENV = 'test';
process.env.DISCORD_TOKEN = 't';
process.env.APPLICATION_ID = '123';

async function runOnce(mockPutBehavior) {
  const { REST } = await import('discord.js');
  const putCalls = [];
  const putMock = mock.method(REST.prototype, 'put', async (...args) => {
    putCalls.push(args);
    if (mockPutBehavior) return mockPutBehavior(...args);
  });
  const logs = [];
  const errors = [];
  const logMock = mock.method(console, 'log', msg => logs.push(msg));
  const errMock = mock.method(console, 'error', err => errors.push(err));

  await import(`../src/deploy-commands.ts?${Math.random()}`);

  // allow async iife to finish
  await new Promise(r => setImmediate(r));

  putMock.mock.restore();
  logMock.mock.restore();
  errMock.mock.restore();

  return { putCalls, logs, errors };
}

test('registers slash commands', async () => {
  const { putCalls, logs, errors } = await runOnce();
  assert.equal(putCalls.length, 1);
  const [url, { body }] = putCalls[0];
  assert.ok(url.includes(process.env.APPLICATION_ID));
  assert.equal(Array.isArray(body), true);
  assert.equal(body[0].name, 'issue');
  assert.deepEqual(logs, [
    '❯ Registriere Slash-Commands …',
    '✓ Slash-Commands global registriert (kann bis zu 1 h dauern).',
  ]);
  assert.equal(errors.length, 0);
});

test('logs error when rest.put fails', async () => {
  const { putCalls, logs, errors } = await runOnce(() => { throw new Error('fail'); });
  assert.equal(putCalls.length, 1);
  assert.equal(logs[0], '❯ Registriere Slash-Commands …');
  assert.equal(errors.length, 1);
  assert.match(String(errors[0]), /fail/);
});
