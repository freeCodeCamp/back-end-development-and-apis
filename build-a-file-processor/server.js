// Starter file — add your code here
const fs = require('fs');
console.log(fs);

 const data = fs.readFileSync('assets/poem.txt');
 console.log(data);