import { Worker } from 'node:worker_threads';
import { join } from 'node:path';
import { parse } from '@babel/parser';

function errorDetails(error = {}) {
  const firstStackLine = error.stack?.split('\n', 1)[0] ?? '';
  const stackClass = firstStackLine.match(/^([A-Za-z]*Error)\b/)?.[1];
  return {
    errorClass: stackClass ?? error.name ?? error.type ?? null,
    message: error.message ?? firstStackLine ?? String(error)
  };
}

function projectForWorker(project) {
  const {
    lessons: _lessons,
    selectedLessons: _selectedLessons,
    curriculumFile: _file,
    ...config
  } = project;
  return config;
}

class LessonWorker {
  constructor({ root, workspace, project, beforeEach, timeout, settle }) {
    this.timeout = timeout;
    this.settle = settle;
    this.current = null;
    this.dead = false;
    this.worker = new Worker(
      join(
        root,
        'node_modules/@freecodecamp/freecodecamp-os/.freeCodeCamp/tooling/tests/test-worker.js'
      ),
      {
        // Do not inherit parent flags. Strict mode turns a rejection from any
        // floating promise into worker failure, independent of API/callee name.
        execArgv: ['--unhandled-rejections=strict'],
        env: { ...process.env, INIT_CWD: workspace },
        workerData: { beforeEach, project: projectForWorker(project) },
        stdout: true,
        stderr: true,
        stdin: true
      }
    );
    this.worker.stdout.on('data', () => {});
    this.worker.stderr.on('data', () => {});
    this.worker.on('message', message => this.onMessage(message));
    this.worker.on('error', error => this.onError(error));
    this.worker.on('exit', code => this.onExit(code));
  }

  onMessage(message) {
    if (!this.current || message.testId !== this.current.testId) return;
    this.current.message = message;
    this.current.settleTimer = setTimeout(
      () => this.finish(this.classifyMessage(message)),
      this.settle
    );
  }

  onError(error) {
    this.dead = true;
    if (!this.current) return;
    const status = this.current.message ? 'unhandledRejection' : 'crash';
    this.finish({ status, ...errorDetails(error) });
  }

  onExit(code) {
    this.dead = true;
    if (this.current && !this.current.done) {
      this.finish({
        status: 'crash',
        errorClass: 'WorkerExit',
        message: `Worker exited with code ${code}`
      });
    }
  }

  classifyMessage(message) {
    if (message.passed) {
      return { status: 'pass', errorClass: null, message: null };
    }
    const details = errorDetails(message.error);
    return {
      status: message.error?.type === 'AssertionError' ? 'fail' : 'crash',
      ...details
    };
  }

  finish(result) {
    const current = this.current;
    if (!current || current.done) return;
    current.done = true;
    clearTimeout(current.timeoutTimer);
    clearTimeout(current.settleTimer);
    this.current = null;
    current.resolve(result);
  }

  run(testCode, testId) {
    if (this.dead) throw new Error('Cannot run a test in a dead worker');
    if (this.current) throw new Error('Worker already has an in-flight test');

    return new Promise(resolve => {
      const timeoutTimer = setTimeout(async () => {
        this.dead = true;
        this.finish({
          status: 'timeout',
          errorClass: 'TimeoutError',
          message: `Test exceeded ${this.timeout}ms`
        });
        await this.worker.terminate();
      }, this.timeout);
      this.current = {
        testId,
        resolve,
        timeoutTimer,
        settleTimer: null,
        message: null,
        done: false
      };
      this.worker.postMessage({ testCode, testId });
    });
  }

  async terminate() {
    this.dead = true;
    await this.worker.terminate();
  }
}

export async function runLessonTests({
  root,
  workspace,
  project,
  lesson,
  state,
  timeout = 5_000,
  settle = 500,
  skipLiveServer = true
}) {
  const records = [];
  let runner;
  const needsLiveServer =
    skipLiveServer &&
    lesson.tests.some(([, code]) =>
      isLiveServerTest(code, lesson.beforeEach ?? '')
    );

  for (let testId = 0; testId < lesson.tests.length; testId++) {
    const [, testCode] = lesson.tests[testId];
    if (needsLiveServer) {
      records.push({
        project: project.dashedName,
        lesson: lesson.number,
        testId,
        state,
        status: 'skipped',
        errorClass: null,
        message: 'Requires a live project server'
      });
      continue;
    }

    if (!runner || runner.dead) {
      runner = new LessonWorker({
        root,
        workspace,
        project,
        beforeEach: lesson.beforeEach ?? '',
        timeout,
        settle
      });
    }

    const result = await runner.run(testCode, testId);
    records.push({
      project: project.dashedName,
      lesson: lesson.number,
      testId,
      state,
      ...result
    });
  }

  if (runner && !runner.dead) await runner.terminate();
  return records;
}

function childNodes(node) {
  const result = [];
  for (const [key, value] of Object.entries(node)) {
    if (['loc', 'start', 'end', 'extra', 'comments', 'errors'].includes(key)) {
      continue;
    }
    if (Array.isArray(value)) {
      result.push(...value.filter(child => child?.type));
    } else if (value?.type) {
      result.push(value);
    }
  }
  return result;
}

function parseTestBlock(code) {
  return parse(`async function __test() {\n${code}\n}`, {
    sourceType: 'module'
  });
}

function fetchHelpers(beforeEach) {
  if (!/\bfetch\s*\(/.test(beforeEach)) return [];
  let ast;
  try {
    ast = parseTestBlock(beforeEach);
  } catch {
    return [];
  }
  const helpers = [];
  const containsFetch = node => {
    if (node.type === 'CallExpression' && node.callee?.name === 'fetch') {
      return true;
    }
    return childNodes(node).some(containsFetch);
  };
  const visit = node => {
    if (
      node.type === 'VariableDeclarator' &&
      node.id?.type === 'Identifier' &&
      ['ArrowFunctionExpression', 'FunctionExpression'].includes(node.init?.type) &&
      containsFetch(node.init)
    ) {
      helpers.push(node.id.name);
    }
    if (node.type === 'FunctionDeclaration' && containsFetch(node)) {
      if (node.id?.name) helpers.push(node.id.name);
    }
    for (const child of childNodes(node)) visit(child);
  };
  visit(ast.program);
  return helpers;
}

function isLiveServerTest(code, beforeEach) {
  if (/\b__helpers\.isServerListening\s*\(/.test(code)) return true;
  if (/\bnew\s+WebSocket\s*\(/.test(code)) return true;
  if (
    fetchHelpers(beforeEach).some(name =>
      new RegExp(`\\b${name}\\s*\\(`).test(code)
    )
  ) {
    return true;
  }
  if (!/\bfetch\s*\(/.test(code)) return false;

  let ast;
  try {
    ast = parseTestBlock(code);
  } catch {
    return true;
  }

  const parents = new Map();
  const fetches = [];
  const visit = (node, parent = null) => {
    if (parent) parents.set(node, parent);
    if (node.type === 'CallExpression' && node.callee?.name === 'fetch') {
      fetches.push(node);
    }
    for (const child of childNodes(node)) visit(child, node);
  };
  visit(ast.program);

  // Only bounded fetches are safe without a server. This preserves runtime
  // rejection coverage for tests that use AbortController around fetch.
  if (!/\bAbortController\s*\(/.test(code)) return fetches.length > 0;
  return fetches.some(fetchCall => {
    let current = fetchCall;
    while (parents.has(current)) {
      const parent = parents.get(current);
      if (parent.type === 'TryStatement') {
        return !(
          parent.handler &&
          current.start >= parent.block.start &&
          current.end <= parent.block.end
        );
      }
      current = parent;
    }
    return true;
  });
}
