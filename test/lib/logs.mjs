import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const LOG_FILES = [
  '.bash_history.log',
  '.cwd.log',
  '.history_cwd.log',
  '.repl.log',
  '.temp.log',
  '.terminal_out.log'
];

export async function writeEmptyLogs(workspace) {
  const directory = join(workspace, '.logs');
  await mkdir(directory, { recursive: true });
  await Promise.all(
    LOG_FILES.map(file => writeFile(join(directory, file), '', 'utf8'))
  );
}
