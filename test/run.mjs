#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadCorpus, selectCorpus } from './lib/corpus.mjs';
import { lintCorpus } from './lib/lint.mjs';
import {
  applyLessonSnapshot,
  createWorkspace,
  hasLessonSnapshot,
  removeWorkspace
} from './lib/workspace.mjs';
import { runLessonTests } from './lib/worker.mjs';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const DEFAULT_CONCURRENCY = Math.min(8, Math.max(1, Number(process.env.CI_JOBS) || 8));

function parseArgs(argv) {
  const options = {
    checks: new Set(),
    concurrency: DEFAULT_CONCURRENCY,
    timeout: 5_000,
    settle: 500,
    json: false,
    junit: null
  };
  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index];
    const [flag, inline] = argument.split('=', 2);
    const value = inline ?? argv[index + 1];
    const consume = () => {
      if (inline === undefined) index++;
      return value;
    };
    if (flag === '--project') options.project = consume();
    else if (flag === '--lesson') options.lesson = Number(consume());
    else if (flag === '--check') {
      for (const check of consume().split(',')) options.checks.add(check);
    } else if (flag === '--concurrency') options.concurrency = Number(consume());
    else if (flag === '--timeout') options.timeout = Number(consume());
    else if (flag === '--settle') options.settle = Number(consume());
    else if (flag === '--json') options.json = true;
    else if (flag === '--junit') {
      options.junit = inline ?? 'curriculum-results.xml';
      if (inline === undefined && value && !value.startsWith('--')) {
        options.junit = consume();
      }
    } else if (flag === '--help' || flag === '-h') options.help = true;
    else throw new Error(`Unknown argument: ${argument}`);
  }
  if (!options.checks.size) {
    options.checks = new Set(['crash', 'solution', 'lint']);
  }
  for (const check of options.checks) {
    if (!['crash', 'solution', 'lint'].includes(check)) {
      throw new Error(`Unknown check: ${check}`);
    }
  }
  if (options.lesson !== undefined && !options.project) {
    throw new Error('--lesson requires --project');
  }
  if (!Number.isInteger(options.lesson ?? 0) || (options.lesson ?? 0) < 0) {
    throw new Error('--lesson must be a non-negative integer');
  }
  if (!Number.isInteger(options.concurrency) || options.concurrency < 1) {
    throw new Error('--concurrency must be a positive integer');
  }
  return options;
}

function help() {
  console.log(`Usage: node test/run.mjs [options]

Options:
  --project <name>       Run one project
  --lesson <number>      Run one lesson (requires --project)
  --check <checks>       crash, solution, lint; comma-separated
  --concurrency <count>  Parallel lesson workers (default: ${DEFAULT_CONCURRENCY})
  --timeout <ms>         Per-test timeout (default: 5000)
  --settle <ms>          Late-rejection settle delay (default: 500)
  --json                 Write JSON Lines records to stdout
  --junit[=<path>]       Write JUnit XML (default path: curriculum-results.xml)`);
}

async function loadAllowlist(projects) {
  const path = join(ROOT, 'test/allowlist.json');
  const raw = JSON.parse(await readFile(path, 'utf8'));
  if (!raw || Array.isArray(raw) || typeof raw !== 'object') {
    throw new Error('test/allowlist.json must be an object');
  }
  const validLessons = new Map(
    projects.flatMap(project =>
      project.lessons.map(lesson => [
        `${project.dashedName}#${lesson.number}`,
        lesson.tests.length
      ])
    )
  );
  const entries = new Map();
  for (const [key, value] of Object.entries(raw)) {
    const reason = typeof value === 'string' ? value : value?.reason;
    if (typeof reason !== 'string' || !reason.trim()) {
      throw new Error(`Allowlist entry '${key}' requires a reason`);
    }
    const match = key.match(/^(.+)#(\d+)(?:#(\d+))?$/);
    if (!match) throw new Error(`Invalid allowlist key: ${key}`);
    const lessonKey = `${match[1]}#${Number(match[2])}`;
    const testCount = validLessons.get(lessonKey);
    if (testCount === undefined) throw new Error(`Stale allowlist entry: ${key}`);
    if (match[3] !== undefined && Number(match[3]) >= testCount) {
      throw new Error(`Stale allowlist test index: ${key}`);
    }
    entries.set(key, { reason, matched: false });
  }
  return entries;
}

function keyFor(record, includeTest = true) {
  const lesson = `${record.project}#${record.lesson}`;
  return includeTest && record.testId !== null && record.testId !== undefined
    ? `${lesson}#${record.testId}`
    : lesson;
}

function allowIssue(issue, allowlist) {
  const exact = allowlist.get(keyFor(issue));
  const lesson = allowlist.get(keyFor(issue, false));
  const entry = exact ?? lesson;
  if (!entry) return false;
  entry.matched = true;
  issue.allowlisted = true;
  issue.allowlistReason = entry.reason;
  return true;
}

async function mapLimit(items, limit, mapper) {
  const output = new Array(items.length);
  let next = 0;
  async function lane() {
    while (true) {
      const index = next++;
      if (index >= items.length) return;
      output[index] = await mapper(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, lane));
  return output;
}

async function runState(project, lesson, state, throughLesson, options, snapshot) {
  const workspace = await createWorkspace(ROOT, project, throughLesson);
  try {
    if (snapshot) {
      await applyLessonSnapshot(ROOT, workspace, project, lesson.number);
    }
    return await runLessonTests({
      root: ROOT,
      workspace,
      project,
      lesson,
      state,
      timeout: options.timeout,
      settle: options.settle
    });
  } finally {
    await removeWorkspace(workspace);
  }
}

function hasUsableSeed(seed = []) {
  return seed.some(item =>
    typeof item === 'string' ? item.trim() : item.fileSeed.trim()
  );
}

function isLogBasedLesson(lesson) {
  return lesson.tests.some(([, code]) =>
    /\b__helpers\.(?:getBashHistory|getCWD|getLastCommand|getLastCWD|getRepl|getTemp|getTerminalOutput)\s*\(/.test(
      code
    )
  );
}

async function runRuntime(projects, options) {
  const jobs = projects.flatMap(project =>
    (project.selectedLessons ?? project.lessons).map(lesson => ({
      project,
      lesson
    }))
  );
  return mapLimit(jobs, options.concurrency, async ({ project, lesson }) => {
    const own = await runState(
      project,
      lesson,
      'starting',
      lesson.number,
      options,
      false
    );
    let solution = [];
    let reference = null;
    const snapshot = await hasLessonSnapshot(ROOT, project, lesson.number);
    if (snapshot) {
      reference = 'snapshot';
      solution = await runState(
        project,
        lesson,
        'solution',
        lesson.number,
        options,
        true
      );
    } else if (hasUsableSeed(project.lessons[lesson.number + 1]?.seed)) {
      reference = 'next-seed';
      solution = await runState(
        project,
        lesson,
        'solution',
        lesson.number + 1,
        options,
        false
      );
    }
    return {
      project,
      lesson,
      own,
      solution,
      reference,
      checkable: Boolean(reference) && !isLogBasedLesson(lesson)
    };
  });
}

function runtimeIssues(results, checks) {
  const issues = [];
  const badRuntime = new Set(['crash', 'timeout', 'unhandledRejection']);
  for (const result of results) {
    for (const record of [...result.own, ...result.solution]) {
      if (badRuntime.has(record.status)) issues.push(record);
    }
    if (!checks.has('solution') || !result.checkable) continue;
    const solutionRun = result.solution.filter(record => record.status !== 'skipped');
    const startingRun = result.own.filter(record => record.status !== 'skipped');
    for (const record of solutionRun) {
      if (record.status === 'fail') {
        issues.push({
          ...record,
          errorClass: 'SolutionDidNotPass',
          message: record.message || 'Reference solution failed'
        });
      }
    }
    if (
      startingRun.length &&
      startingRun.every(record => record.status === 'pass')
    ) {
      issues.push({
        project: result.project.dashedName,
        lesson: result.lesson.number,
        testId: null,
        state: 'starting',
        status: 'solution',
        errorClass: 'StartingStatePassed',
        message: 'All tests pass on lesson starting state'
      });
    }
  }
  return issues;
}

function coverage(results, checks) {
  const byProject = new Map();
  for (const result of results) {
    let bucket;
    const hasSkipped = [...result.own, ...result.solution].some(
      record => record.status === 'skipped'
    );
    if (hasSkipped) bucket = 'skipped';
    else if (checks.has('solution') && result.checkable) bucket = 'checked';
    else bucket = 'crash-only';
    const counts = byProject.get(result.project.dashedName) ?? {
      checked: 0,
      'crash-only': 0,
      skipped: 0
    };
    counts[bucket]++;
    byProject.set(result.project.dashedName, counts);
  }
  return byProject;
}

function escapeXml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

async function writeJUnit(path, records, issues) {
  const issueSet = new Set(issues);
  const cases = records.map((record, index) => {
    const name = `${keyFor(record)}${record.state ? ` [${record.state}]` : ''}`;
    const issue = issueSet.has(record) && !record.allowlisted;
    const skipped = record.status === 'skipped' || record.allowlisted;
    const body = issue
      ? `<failure type="${escapeXml(record.errorClass)}" message="${escapeXml(
          record.message
        )}"/>`
      : skipped
        ? `<skipped message="${escapeXml(record.message)}"/>`
        : '';
    return `<testcase id="${index}" classname="${escapeXml(
      record.project
    )}" name="${escapeXml(name)}">${body}</testcase>`;
  });
  const synthetic = issues
    .filter(issue => !records.includes(issue))
    .map((issue, index) => {
      const body = issue.allowlisted
        ? `<skipped message="${escapeXml(issue.allowlistReason)}"/>`
        : `<failure type="${escapeXml(
            issue.errorClass
          )}" message="${escapeXml(issue.message)}"/>`;
      return `<testcase id="issue-${index}" classname="${escapeXml(
        issue.project
      )}" name="${escapeXml(keyFor(issue))}">${body}</testcase>`;
    });
  const failures = issues.filter(issue => !issue.allowlisted).length;
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<testsuite name="curriculum" tests="${
    cases.length + synthetic.length
  }" failures="${failures}">\n${[...cases, ...synthetic].join('\n')}\n</testsuite>\n`;
  await writeFile(resolve(path), xml);
}

async function validateCurriculum(quiet = false) {
  const modulePath = join(
    ROOT,
    'node_modules/@freecodecamp/freecodecamp-os/.freeCodeCamp/tooling/validate.js'
  );
  const { validateCurriculum: validate } = await import(modulePath);
  if (!quiet) return validate();

  const originalLog = console.log;
  const originalInfo = console.info;
  const originalWarn = console.warn;
  console.log = () => {};
  console.info = () => {};
  console.warn = () => {};
  try {
    await validate();
  } finally {
    console.log = originalLog;
    console.info = originalInfo;
    console.warn = originalWarn;
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) return help();

  const allProjects = await loadCorpus(ROOT);
  const projects = selectCorpus(allProjects, options);
  const allowlist = await loadAllowlist(allProjects);
  const records = [];
  let results = [];

  await validateCurriculum(options.json);

  if (options.checks.has('lint')) {
    records.push(...lintCorpus(projects));
  }
  if (options.checks.has('crash') || options.checks.has('solution')) {
    results = await runRuntime(projects, options);
    records.push(...results.flatMap(result => [...result.own, ...result.solution]));
  }

  const issues = [
    ...records.filter(record => record.status === 'lint'),
    ...runtimeIssues(results, options.checks)
  ];
  for (const issue of issues) allowIssue(issue, allowlist);
  const failures = issues.filter(issue => !issue.allowlisted);

  if (options.json) {
    for (const record of records) console.log(JSON.stringify(record));
  } else {
    for (const issue of issues) {
      const allowed = issue.allowlisted ? 'ALLOWLISTED ' : '';
      const test = issue.testId === null ? '' : `#${issue.testId}`;
      const state = issue.state ? ` [${issue.state}]` : '';
      console.error(
        `${allowed}${issue.project}#${issue.lesson}${test}${state} ${issue.errorClass}: ${issue.message}`
      );
    }
  }

  if (results.length) {
    const summary = coverage(results, options.checks);
    const output = options.json ? console.error : console.log;
    output('Coverage:');
    for (const [project, counts] of summary) {
      output(
        `  ${project}: checked=${counts.checked} crash-only=${counts['crash-only']} skipped=${counts.skipped}`
      );
    }
  }
  if (allowlist.size) {
    const output = options.json ? console.error : console.log;
    output('Allowlist:');
    for (const [key, entry] of allowlist) {
      output(`  ${entry.matched ? 'used' : 'not encountered'} ${key}: ${entry.reason}`);
    }
  }
  const output = options.json ? console.error : console.log;
  output(
    `Curriculum harness: ${records.length} records, ${issues.length} issues, ${failures.length} failures`
  );

  if (options.junit) await writeJUnit(options.junit, records, issues);
  if (failures.length) process.exitCode = 1;
}

main().catch(error => {
  console.error(error.stack ?? error);
  process.exitCode = 1;
});
