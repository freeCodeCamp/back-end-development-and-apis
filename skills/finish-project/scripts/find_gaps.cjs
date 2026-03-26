const fs = require('fs');
const path = require('path');

function findGaps(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lessons = content.split(/^## (\d+)/m).slice(1);
  const gaps = [];

  for (let i = 0; i < lessons.length; i += 2) {
    const num = lessons[i];
    const body = lessons[i + 1];
    
    const missingDescription = !body.includes('### --description--') || body.match(/### --description--\s*(\n+|$)/);
    const missingTests = !body.includes('### --tests--') || body.match(/### --tests--\s*(\n+(##|--fcc-end--)|$)/);
    // Add logic for empty tests (only comments or empty)
    const emptyTests = body.match(/### --tests--\s*\n+```js\s*\n+(\/\/.*)?\s*```/);

    if (missingDescription || missingTests || emptyTests) {
      gaps.push({
        lesson: num,
        missingDescription: !!missingDescription,
        missingTests: !!missingTests || !!emptyTests
      });
    }
  }

  return gaps;
}

const args = process.argv.slice(2);
if (args.length < 1) {
  console.log('Usage: node find_gaps.cjs <file_path>');
  process.exit(1);
}

try {
  const gaps = findGaps(args[0]);
  console.log(JSON.stringify(gaps, null, 2));
} catch (err) {
  console.error(`Error: ${err.message}`);
  process.exit(1);
}
