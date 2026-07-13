// This script starts a standard Node.js REPL and appends each submitted
// expression to .temp.log so that freeCodeCampOS tests can inspect what
// the learner typed.  All REPL output (prompts, results, .help text, etc.)
// continues to flow through the normal tee redirect set up in .bashrc.
const repl = require("repl");
const fs = require("fs");
const path = require("path");

const logPath = path.join(__dirname, "..", ".logs", ".repl.log");

const r = repl.start({ prompt: "> " });

r.on("line", (line) => {
  if (line.trim()) {
    fs.appendFileSync(logPath, line + "\n");
  }
});
