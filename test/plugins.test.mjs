import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { pluginEvents } from '@freecodecamp/freecodecamp-os/.freeCodeCamp/plugin/index.js';
import '../tooling/plugins.js';

test('passing a file processor lesson clears stale command logs', async t => {
  const originalDirectory = process.cwd();
  const fixture = await mkdtemp(join(tmpdir(), 'file-processor-logs-'));
  t.after(async () => {
    process.chdir(originalDirectory);
    await rm(fixture, { recursive: true, force: true });
  });

  const logsDirectory = join(fixture, '.logs');
  const historyPath = join(logsDirectory, '.bash_history.log');
  await mkdir(logsDirectory);
  await writeFile(historyPath, 'node server.js\n');
  process.chdir(fixture);

  await pluginEvents.onLessonPassed({
    id: 1,
    dashedName: 'build-a-file-processor'
  });

  assert.equal(await readFile(historyPath, 'utf8'), '');
});
