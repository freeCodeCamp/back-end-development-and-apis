const fs = require('fs');
const path = require('path');

function getNextLesson(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  let maxLesson = -1;

  for (const line of lines) {
    const match = line.match(/^## (\d+)/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxLesson) {
        maxLesson = num;
      }
    }
  }

  return maxLesson + 1;
}

const args = process.argv.slice(2);
if (args.length < 1) {
  console.error('Usage: node get_next_lesson.cjs <file_path>');
  process.exit(1);
}

const filePath = args[0];
try {
  const nextNumber = getNextLesson(filePath);
  console.log(nextNumber);
} catch (err) {
  console.error(`Error reading file: ${err.message}`);
  process.exit(1);
}
