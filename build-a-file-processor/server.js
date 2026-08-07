const fs = require('fs');

fs.readFile('assets/poem.txt', { encoding: 'utf8' }, (err, data) => {
  console.log(data);
});
