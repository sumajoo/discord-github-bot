import { test } from 'node:test';
import assert from 'node:assert/strict';
import axios from 'axios';
import type { Interaction } from 'discord.js';

process.env.NODE_ENV = 'test';
const { handleIssueInteraction } = await import('../src/index.ts');

type Replies = { deferred: boolean; message: string | null };

function createInteraction({ title = 'T', body = 'B' } = {}): Interaction & { _replies: Replies } {
  const replies = { deferred: false, message: null as string | null };
  const interaction: any = {
    isChatInputCommand: () => true,
    commandName: 'issue',
    options: {
      getString(name: string) {
        if (name === 'titel') return title;
        if (name === 'beschreibung') return body;
        return null;
      },
    },
    user: { tag: 'User#1', id: '1' },
    deferReply: async ({ flags }: { flags: number }) => {
      replies.deferred = flags === 64;
    },
    editReply: async (msg: string) => {
      replies.message = msg;
    },
    _replies: replies,
  };
  return interaction as Interaction & { _replies: Replies };
}

test('skips if not chat input command', async () => {
  const interaction: any = createInteraction();
  interaction.isChatInputCommand = (() => false) as any;
  let called = false;
  const orig = axios.post;
  axios.post = (async () => {
    called = true;
  }) as any;
  await handleIssueInteraction(interaction as unknown as Interaction);
  axios.post = orig;
  assert.equal(called, false);
  assert.equal(interaction._replies.deferred, false);
});

test('skips if command name differs', async () => {
  const interaction: any = createInteraction();
  interaction.commandName = 'other';
  let called = false;
  const orig = axios.post;
  axios.post = (async () => {
    called = true;
  }) as any;
  await handleIssueInteraction(interaction as unknown as Interaction);
  axios.post = orig;
  assert.equal(called, false);
  assert.equal(interaction._replies.deferred, false);
});

test('creates issue and replies with url', async () => {
  const interaction: any = createInteraction({ title: 'hi', body: 'desc' });
  process.env.GITHUB_REPO = 'a/b';
  process.env.GITHUB_TOKEN = 't';
  let received: { url?: string; payload?: any } = {};
  const orig = axios.post;
  axios.post = (async (url: string, payload: any) => {
    received = { url, payload };
    return { data: { html_url: 'https://example.com/1' } } as any;
  }) as any;
  await handleIssueInteraction(interaction as unknown as Interaction);
  axios.post = orig;
  assert.equal(interaction._replies.deferred, true);
  assert.equal(
    interaction._replies.message,
    '✅ Issue erstellt: <https://example.com/1>'
  );
  assert.ok(received.url!.includes('a/b/issues'));
  assert.equal(received.payload!.title, 'hi');
});

test('handles axios error', async () => {
  const interaction: any = createInteraction();
  const orig = axios.post;
  axios.post = (async () => {
    throw new Error('fail');
  }) as any;
  await handleIssueInteraction(interaction as unknown as Interaction);
  axios.post = orig;
  assert.equal(
    interaction._replies.message,
    '❌ Fehler beim Erstellen des Issues. Wende dich direkt an Jonas.'
  );
});
