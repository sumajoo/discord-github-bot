import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { commands, deployCommands } = require('../dist/deploy-commands.js');

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Routes } from 'discord.js';

test('commands array contains issue command', () => {
  assert.ok(Array.isArray(commands));
  assert.equal(commands.length, 1);
  const cmd = commands[0];
  assert.equal(cmd.name, 'issue');
  assert.equal(cmd.description, 'Erstellt ein GitHub Issue');
  const titelOption = cmd.options.find(o => o.name === 'titel');
  assert.ok(titelOption);
  assert.equal(titelOption.type, 3);
});

test('deployCommands posts commands', async () => {
  const calls = [];
  const mockRest = { put: async (...args) => { calls.push(args); } };
  await deployCommands(mockRest, '123');
  assert.equal(calls.length, 1);
  assert.deepEqual(calls[0][0], Routes.applicationCommands('123'));
  assert.deepEqual(calls[0][1], { body: commands });
});
