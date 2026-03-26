const fs = require('fs');
const path = require('path');

function setupProject(dashedName, description, isIntegrated) {
  const configPath = path.resolve('config/projects.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  
  // 1. Get next available ID
  const ids = config.map(p => p.id);
  const nextId = Math.max(...ids) + 1;

  // 2. Create project entry
  const newProject = {
    id: nextId,
    dashedName: dashedName,
    isIntegrated: isIntegrated,
    isPublic: true,
    currentLesson: 0,
    runTestsOnWatch: !isIntegrated,
    seedEveryLesson: !isIntegrated,
    isResetEnabled: false,
    numberOfLessons: isIntegrated ? 1 : 0,
    blockingTests: isIntegrated,
    breakOnFailure: isIntegrated
  };

  config.push(newProject);
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

  // 3. Create boilerplate directory
  const projectDir = path.resolve(dashedName);
  if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir);
    fs.writeFileSync(path.join(projectDir, '.gitkeep'), '');
  }

  // 4. Create Markdown file
  const markdownPath = path.resolve(`curriculum/locales/english/${dashedName}.md`);
  const title = dashedName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  let markdownContent = `# ${title}\n\n`;
  if (isIntegrated) {
    markdownContent += '```json\n{\n  "tags": ["Certification Project"]\n}\n```\n\n';
  }
  markdownContent += `${description}\n\n## 0\n\n### --description--\n\nWelcome to the ${title} project.\n\n### --tests--\n\n// Add initial tests here\n\n## --fcc-end--\n`;

  fs.writeFileSync(markdownPath, markdownContent);

  return { id: nextId, markdownPath, projectDir };
}

const args = process.argv.slice(2);
if (args.length < 3) {
  console.log('Usage: node setup_project.cjs <dashed-name> <description> <is-integrated (true/false)>');
  process.exit(1);
}

try {
  const result = setupProject(args[0], args[1], args[2] === 'true');
  console.log(JSON.stringify(result, null, 2));
} catch (err) {
  console.error(`Error: ${err.message}`);
  process.exit(1);
}
