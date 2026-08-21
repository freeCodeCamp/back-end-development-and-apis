import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { CoffeeDown } from '../../node_modules/@freecodecamp/freecodecamp-os/.freeCodeCamp/tooling/parser.js';

export async function loadCorpus(root) {
  const config = JSON.parse(await readFile(join(root, 'config/projects.json')));
  const projects = [];

  for (const projectConfig of config) {
    const filePath = join(
      root,
      'curriculum/locales/english',
      `${projectConfig.dashedName}.md`
    );
    const markdown = await readFile(filePath, 'utf8');
    const parser = new CoffeeDown(markdown);
    const meta = parser.getProjectMeta();
    const lessons = Array.from({ length: meta.numberOfLessons }, (_, number) => ({
      number,
      ...parser.getLesson(number)
    }));

    projects.push({
      ...projectConfig,
      numberOfLessons: meta.numberOfLessons,
      curriculumFile: filePath,
      lessons
    });
  }

  return projects;
}

export function selectCorpus(projects, { project, lesson } = {}) {
  let selected = projects;
  if (project) {
    selected = selected.filter(candidate => candidate.dashedName === project);
    if (!selected.length) throw new Error(`Unknown project: ${project}`);
  }

  return selected.map(candidate => {
    if (lesson === undefined) {
      return { ...candidate, selectedLessons: candidate.lessons };
    }
    const selectedLessons = candidate.lessons.filter(
      item => item.number === lesson
    );
    if (!selectedLessons.length) {
      throw new Error(`Unknown lesson: ${candidate.dashedName}#${lesson}`);
    }
    return { ...candidate, selectedLessons };
  });
}

