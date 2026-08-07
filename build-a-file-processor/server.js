const fs = require("fs");

const fsPromises = fs.promises;

async function main() {
  const data = await fsPromises.readFile('assets/poem.txt', {
    encoding: "utf8",
  });

  console.log(data);
}

main();
