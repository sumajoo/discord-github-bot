import { test } from 'node:test';
import assert from 'node:assert/strict';
process.env.NODE_ENV = 'test';
import { handleIssueInteraction } from '../src/index.ts';
import axios from 'axios';

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

test('skips if not chat input command', async () => {
  const interaction = createInteraction();
  interaction.isChatInputCommand = () => false;
  let called = false;
  const orig = axios.post;
  axios.post = async () => { called = true; };
  await handleIssueInteraction(interaction);
  axios.post = orig;
  assert.equal(called, false);
  assert.equal(interaction._replies.deferred, false);
});

test('skips if command name differs', async () => {
  const interaction = createInteraction();
  interaction.commandName = 'other';
  let called = false;
  const orig = axios.post;
  axios.post = async () => { called = true; };
  await handleIssueInteraction(interaction);
  axios.post = orig;
  assert.equal(called, false);
  assert.equal(interaction._replies.deferred, false);
});

test('creates issue and replies with url', async () => {
  const interaction = createInteraction({ title: 'hi', body: 'desc' });
  process.env.GITHUB_REPO = 'a/b';
  process.env.GITHUB_TOKEN = 't';
  let received;
  const orig = axios.post;
  axios.post = async (url, payload) => {
    received = { url, payload };
    return { data: { html_url: 'https://example.com/1' } };
  };
  await handleIssueInteraction(interaction);
  axios.post = orig;
  assert.equal(interaction._replies.deferred, true);
  assert.equal(interaction._replies.message, '✅ Issue erstellt: <https://example.com/1>');
  assert.ok(received.url.includes('a/b/issues'));
  assert.equal(received.payload.title, 'hi');
});

test('handles axios error', async () => {
  const interaction = createInteraction();
  const orig = axios.post;
  axios.post = async () => { throw new Error('fail'); };
  await handleIssueInteraction(interaction);
  axios.post = orig;
  assert.equal(interaction._replies.message, '❌ Fehler beim Erstellen des Issues. Wende dich direkt an Jonas.');
});
