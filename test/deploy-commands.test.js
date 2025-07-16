import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import process from 'node:process';
import { deployCommands } from '../src/deploy-commands.js';

let logCalls = [], errorCalls = [];
let origLog, origError;

function createMockFn() {
	function fn() {
		fn.calls.push(Array.from(arguments));
		if (typeof fn.impl === 'function') return fn.impl.apply(this, arguments);
		return fn.returnValue;
	}
	fn.calls = [];
	fn.setImpl = function(impl) { fn.impl = impl; };
	fn.setReturn = function(val) { fn.returnValue = val; fn.impl = undefined; };
	fn.reset = function() { fn.calls = []; fn.impl = undefined; fn.returnValue = undefined; };
	return fn;
}

const putMock = createMockFn();
const applicationCommandsMock = createMockFn();
const setTokenMock = createMockFn();
setTokenMock.setReturn({ setToken: setTokenMock, put: putMock });

const SlashCommandBuilderMock = function() {
	return {
		setName: function() { return this; },
		setDescription: function() { return this; },
		addStringOption: function(fn) { fn(this); return this; },
		setRequired: function() { return this; },
		toJSON: function() { return { name: 'issue' }; }
	};
};

beforeEach(() => {
	process.env.DISCORD_TOKEN = 'test-token';
	process.env.APPLICATION_ID = 'test-app-id';
	logCalls = [];
	errorCalls = [];
	origLog = console.log;
	origError = console.error;
	console.log = (...args) => { logCalls.push(args.join(' ')); };
	console.error = (...args) => { errorCalls.push(args.join(' ')); };

	putMock.reset();
	applicationCommandsMock.reset();
	setTokenMock.reset();
	setTokenMock.setReturn({ setToken: setTokenMock, put: putMock });

	// Rückgabewerte für die Tests werden im Test gesetzt
	const discordMock = {
		REST: function() { return { setToken: setTokenMock, put: putMock }; },
		Routes: { applicationCommands: applicationCommandsMock },
		SlashCommandBuilder: SlashCommandBuilderMock
	};
	global.__discordjs_mock = discordMock;
});

afterEach(() => {
	console.log = origLog;
	console.error = origError;
	putMock.reset();
	applicationCommandsMock.reset();
	setTokenMock.reset();
	setTokenMock.setReturn({ setToken: setTokenMock, put: putMock });
});



test('registriert die Slash-Commands erfolgreich', async (t) => {
	applicationCommandsMock.setReturn('mocked/route');
	putMock.setImpl(() => Promise.resolve({}));

	await deployCommands({
		REST: function() { return { setToken: setTokenMock, put: putMock }; },
		Routes: { applicationCommands: applicationCommandsMock },
		SlashCommandBuilder: SlashCommandBuilderMock
	}, (...args) => logCalls.push(args.join(' ')), (...args) => errorCalls.push(args.join(' ')));

	assert.ok(applicationCommandsMock.calls.some(call => call[0] === 'test-app-id'));
	assert.ok(putMock.calls.some(call => call[0] === 'mocked/route'));
	assert.ok(logCalls.some(msg => msg.includes('❯ Registriere Slash-Commands')));
	assert.ok(logCalls.some(msg => msg.includes('✓ Slash-Commands global registriert')));
});

test('gibt Fehler korrekt aus', async (t) => {
	const error = new Error('API-Fehler');
	applicationCommandsMock.setReturn('mocked/route');
	putMock.setImpl(() => Promise.reject(error));

	await deployCommands({
		REST: function() { return { setToken: setTokenMock, put: putMock }; },
		Routes: { applicationCommands: applicationCommandsMock },
		SlashCommandBuilder: SlashCommandBuilderMock
	}, (...args) => logCalls.push(args.join(' ')), (...args) => errorCalls.push(args.join(' ')));
	assert.ok(errorCalls.some(msg => msg.includes('API-Fehler')));
});
