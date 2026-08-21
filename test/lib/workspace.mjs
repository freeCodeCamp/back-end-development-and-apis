import { execFile } from 'node:child_process';
import {
  cp,
  lstat,
  mkdir,
  mkdtemp,
  rm,
  symlink,
  writeFile
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { promisify } from 'node:util';
import { writeEmptyLogs } from './logs.mjs';

const execFileAsync = promisify(execFile);

async function exists(path) {
  try {
    await lstat(path);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

async function copyFile(root, workspace, path, optional = false) {
  const destination = join(workspace, relative(root, path));
  await mkdir(dirname(destination), { recursive: true });
  try {
    await cp(path, destination, { recursive: true });
  } catch (error) {
    if (!optional || error.code !== 'ENOENT') throw error;
  }
}

async function trackedProjectFiles(root, project) {
  const { stdout } = await execFileAsync(
    'git',
    ['ls-files', '-z', '--', project.dashedName],
    { cwd: root, encoding: 'buffer', maxBuffer: 10 * 1024 * 1024 }
  );
  return stdout
    .toString()
    .split('\0')
    .filter(Boolean)
    .filter(path => !path.includes('/_solution/'));
}

export async function createWorkspace(root, project, throughLesson) {
  const workspace = await mkdtemp(join(tmpdir(), 'fcc-curriculum-'));
  try {
    await symlink(join(root, 'node_modules'), join(workspace, 'node_modules'), 'dir');

    const supportFiles = [
      'package.json',
      'freecodecamp.conf.json',
      'config/projects.json',
      'config/state.json',
      'tooling/helpers.js',
      `curriculum/locales/english/${project.dashedName}.md`
    ];
    const projectFiles = await trackedProjectFiles(root, project);
    await Promise.all([
      ...supportFiles.map(path =>
        copyFile(root, workspace, join(root, path))
      ),
      ...projectFiles.map(path =>
        copyFile(root, workspace, join(root, path), true)
      )
    ]);
    await writeEmptyLogs(workspace);

    for (let number = 0; number <= throughLesson; number++) {
      await applySeed(workspace, project.lessons[number]?.seed);
    }
    return workspace;
  } catch (error) {
    await rm(workspace, { recursive: true, force: true });
    throw error;
  }
}

export async function applySeed(workspace, seed = []) {
  for (const commandOrFile of seed) {
    if (typeof commandOrFile === 'string') {
      await execFileAsync('/bin/bash', ['-c', commandOrFile], {
        cwd: workspace,
        maxBuffer: 10 * 1024 * 1024
      });
      continue;
    }

    const destination = join(workspace, commandOrFile.filePath);
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(destination, commandOrFile.fileSeed);
  }
}

export async function applyLessonSnapshot(root, workspace, project, lesson) {
  const snapshot = join(root, project.dashedName, '_solution', `@${lesson}`);
  if (!(await exists(snapshot))) return false;
  await cp(snapshot, join(workspace, project.dashedName), {
    recursive: true,
    force: true
  });
  return true;
}

export async function hasLessonSnapshot(root, project, lesson) {
  return exists(join(root, project.dashedName, '_solution', `@${lesson}`));
}

export async function removeWorkspace(workspace) {
  await rm(workspace, {
    recursive: true,
    force: true,
    maxRetries: 5,
    retryDelay: 50
  });
}
