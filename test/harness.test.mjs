import assert from 'node:assert/strict';
import test from 'node:test';
import { isLiveServerTest } from './lib/worker.mjs';

test('ignores WebSocket text in assertion messages', () => {
  const code = `assert.equal(
  socketType,
  "WebSocket",
  "socket should be initialized with new WebSocket().",
);`;
  assert.equal(isLiveServerTest(code, ''), false);
});

test('detects a real WebSocket connection', () => {
  const code = `const socket = new WebSocket("ws://localhost:3000");`;
  assert.equal(isLiveServerTest(code, ''), true);
});

test('ignores isServerListening text in assertion messages', () => {
  const code = `assert.isTrue(ok, "run __helpers.isServerListening(3000)");`;
  assert.equal(isLiveServerTest(code, ''), false);
});

test('detects a real isServerListening call', () => {
  const code = `const ok = await __helpers.isServerListening(3000);`;
  assert.equal(isLiveServerTest(code, ''), true);
});

test('ignores commented-out live-server code', () => {
  const code = `// new WebSocket("ws://localhost:3000")
assert.isTrue(true);`;
  assert.equal(isLiveServerTest(code, ''), false);
});
