// Starter file — add your code here
const fs = require('fs');
console.log(fs);

const fs = require('fs');

fs.readFile('assets/poem.txt', { encoding: 'utf8' }, (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log(data);
});