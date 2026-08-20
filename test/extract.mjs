#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CoffeeDown } from '../node_modules/@freecodecamp/freecodecamp-os/.freeCodeCamp/tooling/parser.js';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const SECTIONS = new Set([
  'lesson',
  'description',
  'tests',
  'seed',
  'hooks'
]);

function parseArgs(argv) {
  const options = { section: 'lesson', json: false };
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
    else if (flag === '--section') options.section = consume();
    else if (flag === '--json') options.json = true;
    else if (flag === '--help' || flag === '-h') options.help = true;
    else throw new Error(`Unknown argument: ${argument}`);
  }

  if (!options.help && !options.project) {
    throw new Error('--project is required');
  }
  if (options.lesson !== undefined && !Number.isInteger(options.lesson)) {
    throw new Error('--lesson must be an integer');
  }
  if (!SECTIONS.has(options.section)) {
    throw new Error(`--section must be one of: ${[...SECTIONS].join(', ')}`);
  }
  return options;
}

function help() {
  console.log(`Usage: node test/extract.mjs --project <name> [options]

Options:
  --lesson <number>   Select one lesson; omit to select every lesson
  --section <name>    lesson, description, tests, seed, or hooks (default: lesson)
  --json              Emit JSON instead of Markdown

Examples:
  node test/extract.mjs --project build-a-resource-monitor --lesson 5 --section tests
  node test/extract.mjs --project build-a-resource-monitor --lesson 5 --section description
  node test/extract.mjs --project build-a-resource-monitor --lesson 5 --json`);
}

function sectionValue(lesson, section) {
  if (section === 'lesson') return lesson;
  if (section === 'hooks') {
    return {
      beforeAll: lesson.beforeAll,
      beforeEach: lesson.beforeEach,
      afterEach: lesson.afterEach,
      afterAll: lesson.afterAll
    };
  }
  return lesson[section];
}

function codeBlock(code, language = 'js') {
  return `\`\`\`${language}\n${code?.trim() ?? ''}\n\`\`\``;
}

function renderTests(tests) {
  return tests
    .map(([description, code], index) =>
      [`#### Test ${index + 1}`, description.trim(), codeBlock(code)].join('\n\n')
    )
    .join('\n\n');
}

function renderSeed(seed) {
  return seed
    .map(item => {
      if (typeof item === 'string') return codeBlock(item, 'text');
      const extension = extname(item.filePath).slice(1) || 'text';
      return [
        `#### ${item.filePath}`,
        codeBlock(item.fileSeed, extension === 'mjs' ? 'js' : extension)
      ].join('\n\n');
    })
    .join('\n\n');
}

function renderHooks(lesson) {
  return [
    ['Before all', lesson.beforeAll],
    ['Before each', lesson.beforeEach],
    ['After each', lesson.afterEach],
    ['After all', lesson.afterAll]
  ]
    .filter(([, code]) => code)
    .map(([name, code]) => [`#### ${name}`, codeBlock(code)].join('\n\n'))
    .join('\n\n');
}

function renderSection(lesson, section) {
  if (section === 'description') return lesson.description.trim();
  if (section === 'tests') return renderTests(lesson.tests);
  if (section === 'seed') return renderSeed(lesson.seed);
  if (section === 'hooks') return renderHooks(lesson);

  const parts = [];
  if (lesson.description.trim()) {
    parts.push('### Description', lesson.description.trim());
  }
  if (lesson.tests.length) parts.push('### Tests', renderTests(lesson.tests));
  const hooks = renderHooks(lesson);
  if (hooks) parts.push('### Hooks', hooks);
  if (lesson.seed.length) parts.push('### Seed', renderSeed(lesson.seed));
  if (lesson.hints.length) {
    parts.push('### Hints', lesson.hints.map(hint => hint.trim()).join('\n\n'));
  }
  return parts.join('\n\n');
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) return help();

  const projects = JSON.parse(
    await readFile(join(ROOT, 'config/projects.json'), 'utf8')
  );
  const project = projects.find(item => item.dashedName === options.project);
  if (!project) throw new Error(`Unknown project: ${options.project}`);

  const markdown = await readFile(
    join(ROOT, 'curriculum/locales/english', `${project.dashedName}.md`),
    'utf8'
  );
  const parser = new CoffeeDown(markdown);
  const { numberOfLessons } = parser.getProjectMeta();
  const numbers =
    options.lesson === undefined
      ? Array.from({ length: numberOfLessons }, (_, number) => number)
      : [options.lesson];
  if (numbers.some(number => number < 0 || number >= numberOfLessons)) {
    throw new Error(`Unknown lesson: ${project.dashedName}#${options.lesson}`);
  }

  const lessons = numbers.map(number => ({
    number,
    ...parser.getLesson(number)
  }));
  if (options.json) {
    const selected = lessons.map(lesson => ({
      number: lesson.number,
      content: sectionValue(lesson, options.section)
    }));
    console.log(JSON.stringify(selected.length === 1 ? selected[0] : selected, null, 2));
    return;
  }

  console.log(
    lessons
      .map(lesson =>
        [`## Lesson ${lesson.number}`, renderSection(lesson, options.section)]
          .filter(Boolean)
          .join('\n\n')
      )
      .join('\n\n')
  );
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
