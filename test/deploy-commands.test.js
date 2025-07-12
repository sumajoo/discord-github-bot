import { jest } from '@jest/globals';
import { REST } from 'discord.js';

process.env.NODE_ENV = 'test';
process.env.DISCORD_TOKEN = 't';
process.env.APPLICATION_ID = '123';

async function runOnce(mockPutBehavior) {
  const putCalls = [];
  const putSpy = jest.spyOn(REST.prototype, 'put').mockImplementation(async (...args) => {
    putCalls.push(args);
    if (mockPutBehavior) return mockPutBehavior(...args);
  });
  const logs = [];
  const errors = [];
  const logSpy = jest.spyOn(console, 'log').mockImplementation(msg => logs.push(msg));
  const errSpy = jest.spyOn(console, 'error').mockImplementation(err => errors.push(err));

  await import(`../src/deploy-commands.ts?${Math.random()}`);

  await new Promise(r => setImmediate(r));

  putSpy.mockRestore();
  logSpy.mockRestore();
  errSpy.mockRestore();

  return { putCalls, logs, errors };
}

test('registers slash commands', async () => {
  const { putCalls, logs, errors } = await runOnce();
  expect(putCalls).toHaveLength(1);
  const [url, { body }] = putCalls[0];
  expect(url).toContain(process.env.APPLICATION_ID);
  expect(Array.isArray(body)).toBe(true);
  expect(body[0].name).toBe('issue');
  expect(logs).toEqual([
    '❯ Registriere Slash-Commands …',
    '✓ Slash-Commands global registriert (kann bis zu 1 h dauern).',
  ]);
  expect(errors).toHaveLength(0);
});

test('logs error when rest.put fails', async () => {
  const { putCalls, logs, errors } = await runOnce(() => { throw new Error('fail'); });
  expect(putCalls).toHaveLength(1);
  expect(logs[0]).toBe('❯ Registriere Slash-Commands …');
  expect(errors).toHaveLength(1);
  expect(String(errors[0])).toMatch(/fail/);
});
