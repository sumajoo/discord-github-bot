import { jest } from '@jest/globals';
import axios from 'axios';
import { handleIssueInteraction } from '../src/index.ts';

process.env.NODE_ENV = 'test';

function createInteraction({ title = 'T', body = 'B' } = {}) {
  const replies = { deferred: false, message: null };
  return {
    isChatInputCommand: () => true,
    commandName: 'issue',
    options: {
      getString(name) {
        if (name === 'titel') return title;
        if (name === 'beschreibung') return body;
        return null;
      },
    },
    user: { tag: 'User#1', id: '1' },
    deferReply: async ({ flags }) => { replies.deferred = flags === 64; },
    editReply: async msg => { replies.message = msg; },
    _replies: replies,
  };
}

afterEach(() => {
  jest.restoreAllMocks();
});

test('skips if not chat input command', async () => {
  const interaction = createInteraction();
  interaction.isChatInputCommand = () => false;
  const postSpy = jest.spyOn(axios, 'post').mockResolvedValue();
  await handleIssueInteraction(interaction);
  expect(postSpy).not.toHaveBeenCalled();
  expect(interaction._replies.deferred).toBe(false);
});

test('skips if command name differs', async () => {
  const interaction = createInteraction();
  interaction.commandName = 'other';
  const postSpy = jest.spyOn(axios, 'post').mockResolvedValue();
  await handleIssueInteraction(interaction);
  expect(postSpy).not.toHaveBeenCalled();
  expect(interaction._replies.deferred).toBe(false);
});

test('creates issue and replies with url', async () => {
  const interaction = createInteraction({ title: 'hi', body: 'desc' });
  process.env.GITHUB_REPO = 'a/b';
  process.env.GITHUB_TOKEN = 't';
  const postSpy = jest.spyOn(axios, 'post').mockResolvedValue({ data: { html_url: 'https://example.com/1' } });
  await handleIssueInteraction(interaction);
  expect(interaction._replies.deferred).toBe(true);
  expect(interaction._replies.message).toBe('✅ Issue erstellt: <https://example.com/1>');
  expect(postSpy).toHaveBeenCalled();
  const [url, payload] = postSpy.mock.calls[0];
  expect(url).toContain('a/b/issues');
  expect(payload.title).toBe('hi');
});

test('handles axios error', async () => {
  const interaction = createInteraction();
  jest.spyOn(axios, 'post').mockRejectedValue(new Error('fail'));
  await handleIssueInteraction(interaction);
  expect(interaction._replies.message).toBe('❌ Fehler beim Erstellen des Issues. Wende dich direkt an Jonas.');
});
