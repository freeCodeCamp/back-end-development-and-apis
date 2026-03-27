# freeCodeCampOS Specification Reference

> Reference for Claude skills working with `freecodecamp-os` course authoring.
> Source: https://github.com/freeCodeCamp/freeCodeCampOS (commit 1ebf47e)

---

## Overview

`freecodecamp-os` is an npm package for building interactive coding courses that run inside Visual Studio Code, paired with the [freeCodeCamp - Courses](https://marketplace.visualstudio.com/items?itemName=freeCodeCamp.freecodecamp-courses) extension.

---

## Key Files & Structure

```
<course-root>/
  freecodecamp.conf.json        # Main config (required)
  config/
    projects.json                 # Project definitions
    state.json                    # Runtime state
  curriculum/
    locales/
      english/                  # or other locale
        learn-x-by-building-y.md  # Curriculum files (one per project)
  .vscode/
    settings.json               # Extension settings
  .logs/
    .bash_history.log
    .cwd.log
    .terminal_out.log
    .temp.log
```

---

## Configuration

### `projects.json` — Per-project fields

| Field             | Description                                            |
| ----------------- | ------------------------------------------------------ |
| `id`              | Unique project identifier                              |
| `dashedName`      | Kebab-case name matching the curriculum `.md` filename |
| `isIntegrated`    | Boolean — integrated project (hints allowed)           |
| `isPublic`        | Boolean                                                |
| `currentLesson`   | Current lesson number                                  |
| `runTestsOnWatch` | Auto-run tests on file change                          |
| `isResetEnabled`  | Enable reset button                                    |
| `numberOfLessons` | Total lesson count                                     |
| `seedEveryLesson` | Run seed on every lesson load                          |
| `blockingTests`   | Run tests sequentially in one worker                   |
| `breakOnFailure`  | Stop on first test failure                             |

---

## Curriculum Markdown Syntax

Each project has one `.md` file (e.g. `learn-x-by-building-y.md`).

### File Structure

````markdown
# Project Title

Optional JSON tags block (fenced with json):
{"tags": ["tag1", "tag2"]}

Project description paragraph.

## 0

### --description--

Lesson description HTML/Markdown content.

### --tests--

Test description text.

```js
// test code (evaluated in worker)
assert.equal(actual, expected);
```

### --seed--

#### --"<relative/file/path>"--

```<ext>
file content to write
```

#### --cmd--

```bash
command to run
```

### --hints--

#### 1

First hint content.

#### 2

Second hint content.

## 1

...

## --fcc-end--
````

### Markers Reference

| Marker                | Purpose                                             |
| --------------------- | --------------------------------------------------- |
| `# Title`             | Project title + optional json tags + description    |
| `## <N>`              | Lesson number (zero-indexed)                        |
| `meta` json block     | Per-lesson `watch`/`ignore` arrays for file watcher |
| `### --description--` | Lesson description (rendered as HTML)               |
| `### --tests--`       | Test pairs: description text + js code block        |
| `### --seed--`        | File and command seeds                              |
| `#### --"<path>"--`   | Seed a specific file                                |
| `#### --cmd--`        | Run a shell command as seed                         |
| `### --hints--`       | Numbered hint sections                              |
| `#### --force--`      | Force/prevent seed regardless of `seedEveryLesson`  |
| `## --fcc-end--`      | Required end-of-file marker                         |

### Seed File Variants

- Seeds can live inline in the main `.md` file.
- Seeds can also live in a separate `<project-dashed-name>-seed.md` file.
- **Project file seed takes priority** over the separate seed file.

---

## Testing

### Lifecycle

1. Server parses test from curriculum `.md`
2. `--before-all--` block runs (failure stops all tests)
3. All tests run in parallel worker threads (or sequentially if `blockingTests: true`)
   - `--before-each--` → test code → `--after-each--`
4. `--after-all--` block runs (failure prints error only)

### Worker Context

- Non-blocking: each test gets its own worker thread
- Blocking: all tests share one worker, run sequentially
- `--before-all--`, `--after-each--`, `--after-all--` only available on the main thread

### Globals Available in Tests

| Global      | Description                                                           |
| ----------- | --------------------------------------------------------------------- |
| `chai`      | Includes `assert`, `expect`, `config as chaiConfig`, `AssertionError` |
| `logover`   | Logger for debugging                                                  |
| `ROOT`      | Absolute path to workspace root                                       |
| `watcher`   | Chokidar FSWatcher (only in `beforeAll`/`beforeEach` on main thread)  |
| `__helpers` | Test utility functions (see below)                                    |

> Prefix variables with `__` (dunder) to avoid naming collisions in `eval`ed test context.

### Test Utilities (`__helpers`)

| Helper                                      | Description                                              |
| ------------------------------------------- | -------------------------------------------------------- |
| `controlWrapper(cb, { timeout, stepSize })` | Retry `cb` until it doesn't throw or times out           |
| `getBashHistory()`                          | Read `.logs/.bash_history.log`                           |
| `getCommandOutput(command, path)`           | Run command, return `{ stdout, stderr }`                 |
| `getCWD()`                                  | Read `.logs/.cwd.log`                                    |
| `getLastCommand(n)`                         | Get nth latest line from bash history log                |
| `getLastCWD(n)`                             | Get nth latest line from CWD log                         |
| `getTemp()`                                 | Read `.logs/.temp.log` (raw terminal input + ANSI codes) |
| `getTerminalOutput()`                       | Read `.logs/.terminal_out.log`                           |
| `importSansCache(path)`                     | Cache-busting dynamic import                             |

All helpers are relative to `ROOT`.

---

## Resetting

### Two Reset Lifecycles

1. **Whole project reset** — triggered by the Reset button. Runs `git clean` on project directory, then runs all lesson seeds in order from the start.
2. **Lesson reset** — triggered when `seedEveryLesson: true` or `--force--` marker is set. Runs only the current lesson's seed.

### Preventing File Deletion on Reset

Add files to a boilerplate `.gitignore` to prevent `git clean` from removing them during reset.

---

## Lessoning Lifecycle

1. Server parses lesson from curriculum `.md`
2. Server sends lesson data to client
3. Client renders lesson as HTML

Per-lesson `meta` block can control file watcher:

```json
{ "watch": ["path/to/watch"], "ignore": ["path/to/ignore"] }
```

---

## How Tests Are Evaluated (Runtime Internals)

Understanding the runtime helps write correct tests.

**main.js** orchestrates test runs:

- `--before-all--` is `eval`ed on the **main thread** before workers spawn. Variables set here with `global.foo = ...` are accessible to `--after-all--`.
- Each test code block is sent to a **Worker thread** via `postMessage`.
- Non-blocking (`blockingTests: false`): one worker per test, all run in parallel.
- Blocking (`blockingTests: true`): one shared worker, tests run sequentially in order.
- `--after-each--` runs on the main thread after each worker exits (via the `exit` event).
- `--after-all--` runs on the main thread once all tests finish.

**test-worker.js** evals each test:

```js
// Simplified worker eval context:
await eval(`(async () => {
  ${beforeEach}   // --before-each-- block
  ${testCode}     // the test code block
})()`);
```

Globals available inside every test code block:

- `assert`, `expect`, `chaiConfig`, `AssertionError` — from chai
- `logover` — debug logger
- `ROOT` — absolute workspace root path
- `project` — the current project config object (`project.dashedName`, `project.currentLesson`, etc.)
- `__helpers` — merged built-in + custom helpers (see below)
- `watcher` — Chokidar FSWatcher (main thread only: `--before-all--`, `--before-each--`)

**Custom helpers** from `tooling/helpers.js` are merged into `__helpers` at runtime:

```js
// test-worker.js merges them:
__helpers = { ...__helpers_builtins, ...dynamicHelpers };
```

---

## `__helpers` — Full API Reference

### Built-in (`test-utils.js`)

```js
// Retry cb on interval until it stops throwing, or timeout
await __helpers.controlWrapper(cb, { timeout: 10000, stepSize: 250 });

// Read .logs/.bash_history.log
const history = await __helpers.getBashHistory();

// Run a shell command, returns { stdout, stderr }
const { stdout, stderr } = await __helpers.getCommandOutput(
  "node -v",
  "project-dir",
);

// Read .logs/.cwd.log
const cwd = await __helpers.getCWD();

// Get nth-latest line from bash history (0 = last)
const lastCmd = await __helpers.getLastCommand(0);

// Get nth-latest line from CWD log
const lastCwd = await __helpers.getLastCWD(0);

// Read .logs/.temp.log (raw terminal input including ANSI codes)
const temp = await __helpers.getTemp();

// Read .logs/.terminal_out.log
const out = await __helpers.getTerminalOutput();

// Cache-busting dynamic import (use when learner's file changes between tests)
const mod = await __helpers.importSansCache("project-dir/index.js");
```

### Custom (`tooling/helpers.js`)

```js
// Read a directory listing (returns string[])
const dir = await __helpers.getDir("project-dir/subdir");

// Check if a path exists (absolute or relative to ROOT)
const exists = await __helpers.fileExists("project-dir/file.js"); // returns bool

// Read a file as string
const src = await __helpers.getFile("project-dashedName", "relative/path.js");

// Check if a TCP port has a listener
const listening = await __helpers.isServerListening(3001); // returns bool

// Spawn a process, fetch a URL, capture stdout/stderr
const { stdout, stderr } = await __helpers.awaitExecution(
  ["node", "server.js"],
  "http://localhost:3000",
  { expectedData: "Listening", fetchTimeout: 2000, dataTimeout: 2000 },
);

// Parse a CLI string into an argv array
const argv = __helpers.parseCli("curl --max-time 2 http://localhost:3000");
// => ['curl', '--max-time', '2', 'http://localhost:3000']

// Re-generate source code from a Babel AST node
const code = __helpers.generate(astNode).code;

// AST inspector (see Tower section below)
const t = new __helpers.Tower(sourceString);

// Babel-based AST parser (see Babeliser section below)
const b = new __helpers.Babeliser(sourceString);
```

---

## Test Patterns — Annotated Examples

### CWD / Directory Navigation

```js
// Check learner is in the right directory
const cwd = await __helpers.getLastCWD();
assert.include(cwd, project.dashedName);

// Or checking for a subdirectory
const cwd = await __helpers.getLastCWD();
assert.include(cwd, "case_converter");

// Solana-style (getCWD returns full log, need last line)
const cwdFile = await __helpers.getCWD();
const cwd = cwdFile.split("\n").filter(Boolean).pop();
assert.include(cwd, "learn-how-to-interact-with-on-chain-programs");
```

### File / Directory Existence

```js
// File exists
const fileExists = await __helpers.fileExists(
  "learn-how-to-build-an-npm-module/case_converter/index.js",
);
assert.isTrue(fileExists, "The index.js file does not exist");

// Using join (ROOT is available)
const fileExists = await __helpers.fileExists(
  join(project.dashedName, "server.js"),
);
assert.isTrue(fileExists);

// Directory listing contains entry
const dir = await __helpers.getDir(project.dashedName);
assert.include(dir, "case_converter");
```

### Command History

```js
// Last command exact match
const lastCommand = await __helpers.getLastCommand();
assert.equal(lastCommand.trim(), "npm run build");

// Last command includes substring
const lastCommand = await __helpers.getLastCommand();
assert.include(
  lastCommand,
  "curl --verbose --max-time 2 http://localhost:3001",
);

// With a small delay for slow commands
await new Promise((res) => setTimeout(res, 1000));
const lastCommand = await __helpers.getLastCommand();
assert.equal(lastCommand.trim(), "npm run build");
```

### Terminal Output / Temp Log

```js
// Check terminal raw input (interactive prompts)
const temp = await __helpers.getTemp();
assert.include(temp, "npm init");

// Extract a value from an interactive prompt line
const temp = await __helpers.getTemp();
const description = temp.match(/description: (.*)/)[1];
assert.include(description, "entry point:");

// Check terminal stdout output
const out = await __helpers.getTerminalOutput();
assert.include(out, "Hello, World!");
```

### Server Listening

```js
// Server should be running
const isListening = await __helpers.isServerListening(3001);
assert.isTrue(isListening, "The server is not listening on port 3001");

// Server should be stopped
const isListening = await __helpers.isServerListening(3001);
assert.isFalse(isListening, "The server is still listening on port 3001");
```

### Tower — AST Inspection (local project: `tooling/helpers.js`)

`Tower` wraps `@babel/parser` for structural code checks. Prefer it over regex for code shape.

```js
const file = await __helpers.getFile(project.dashedName, "server.js");
const t = new __helpers.Tower(file);

// Check a variable declaration's compact form
const http = t.getVariable("http");
assert.equal(http.compact, 'const http=require("http");');

// Check a call expression exists
const server_listen = t.getCalls("server.listen");
assert.equal(server_listen.length, 1);

// Drill into call arguments
const arg = server_listen.at(0).ast.expression.arguments.at(0);
assert.equal(arg.value, 3001);

// Inspect callback parameters
const server = t.getVariable("server");
const calls = server.getCalls("http.createServer");
const arg1 = calls.at(0).ast?.init?.arguments.at(0);
const [request, response] = arg1?.params;
assert.equal(request.name, "request");
assert.equal(response.name, "response");

// Check a function exists
const fn = t.getFunction("getUpperCase");
assert.isDefined(fn);
```

### Babeliser — AST Inspection (Solana-style; `Babeliser` from `babeliser` package)

`Babeliser` is used in the Solana curriculum and is also re-exported from `tooling/helpers.js`.

```js
// Typically loaded in --before-all-- and stored on global
const codeString = await __helpers.getFile(
  "learn-solanas-token-program-by-minting-a-fungible-token",
  "create-mint-account.js",
);
const babelisedCode = new __helpers.Babeliser(codeString);
global.babelisedCode = babelisedCode; // share to all tests in lesson

// In tests (babelisedCode available via global):
const connectionVar = babelisedCode
  .getVariableDeclarations()
  .find((v) => v.declarations?.[0]?.id?.name === "connection");
assert.exists(connectionVar);

// Check a `new X(...)` init
const newExpr = connectionVar.declarations[0].init;
assert.equal(newExpr.callee.name, "Connection");
assert.equal(newExpr.arguments[0].value, "http://localhost:8899");

// Check imports
const importDecl = babelisedCode
  .getImportDeclarations()
  .find((i) => i.source.value === "@solana/web3.js");
const specifier = importDecl.specifiers.find(
  (s) => s.imported.name === "Connection",
);
assert.exists(specifier);

// Check function declarations
const mainFn = babelisedCode
  .getFunctionDeclarations()
  .find((f) => f.id.name === "main");
assert.exists(mainFn);
assert(mainFn.async, "main should be async");

// Check expression statement (e.g. a call or await)
const callExpr = babelisedCode.getExpressionStatement("console.log");
assert.exists(callExpr);
// scope is an array like ['global', 'main']
assert.equal(callExpr.scope.join("."), "global.main");

// Generate code from an AST node
const arg = callExpr.expression.arguments[0];
const code = babelisedCode.generateCode(arg);
assert.match(code, /Saying 'hello'/);
```

### Direct File Eval

For behavioral tests when AST checks are overkill:

```js
// Load file, inject assert, eval it
const file = await __helpers.getFile(
  project.dashedName,
  "case_converter/index.js",
);
const evalCode = `${file}
assert.strictEqual(getUpperCase("hello"), "HELLO");
`;
eval(evalCode);
```

### Regex Match on File Content

For simple structural checks without AST overhead:

```js
const file = await __helpers.getFile(
  project.dashedName,
  "case_converter/index.js",
);
assert.match(file, /function getUpperCase\(|getUpperCase\s*=\s*\(/);
```

### JSON File Parsing

```js
const packageJson = JSON.parse(
  await __helpers.getFile(
    "./learn-solanas-token-program-by-minting-a-fungible-token",
    "package.json",
  ),
);
const version = packageJson.dependencies?.["@solana/web3.js"];
assert.exists(version, "You should have @solana/web3.js in dependencies");
```

### fetch / HTTP API Tests (integrated projects)

Used in `build-a-timestamp-microservice` style projects. The `__url` is typically set in `--before-each--`:

```js
// --before-each--
const __url = "http://localhost:8000/";

// Test block
const response = await fetch(`${__url}api/2016-12-25`);
const data = await response.json();
assert.strictEqual(data.unix, 1482624000000);
assert.strictEqual(data.utc, "Sun, 25 Dec 2016 00:00:00 GMT");

// Test with try/catch for network errors
try {
  const response = await fetch(`${__url}api/2016-12-25`);
  const data = await response.json();
  assert.strictEqual(data.unix, 1482624000000);
} catch (e) {
  assert.fail();
}

// Test error response
const response = await fetch(`${__url}api/this-is-not-a-date`);
const data = await response.json();
assert.strictEqual(data.error.toLowerCase(), "invalid date");

// Test approximate timestamp (current time)
const response = await fetch(`${__url}api`);
const data = await response.json();
const now = Date.now();
assert.isBelow((data.unix - now).toString().length, 6);
```

### Temporary File + Server Test (advanced)

Copy project files to `__test/`, mutate AST, spin up a modified server to test behavior:

```js
const { mkdir, writeFile, cp } = await import("fs/promises");
await mkdir(join(ROOT, "__test"), { recursive: true });
await cp(join(ROOT, project.dashedName), join(ROOT, "__test"), {
  recursive: true,
});

const file = await __helpers.getFile(project.dashedName, "server.js");
const t = new __helpers.Tower(file);
const server_listen = t.getCalls("server.listen");
const arg = server_listen.at(0).ast.expression.arguments.at(0);
arg.value = 3002; // change port to avoid conflict
// ... write modified file, spawn server, test, clean up
```

### `--before-all--` / `--after-all--` Pattern

Share expensive setup (parse file once) across all tests in a lesson:

````markdown
### --tests--

Test description.

```js
// Uses babelisedCode from --before-all--
const fn = babelisedCode
  .getFunctionDeclarations()
  .find((f) => f.id.name === "main");
assert.exists(fn);
```

### --before-all--

```js
const codeString = await __helpers.getFile("my-project", "src/main.js");
const babelisedCode = new __helpers.Babeliser(codeString);
global.babelisedCode = babelisedCode;
```

### --after-all--

```js
delete global.babelisedCode;
```
````

### Timeout / Polling (wait for async side-effects)

```js
// Simple delay before checking state
await new Promise((res) => setTimeout(res, 2100));
const lastCommand = await __helpers.getLastCommand();
assert.include(
  lastCommand,
  "curl --verbose --max-time 2 http://localhost:3001",
);

// controlWrapper: retry until passes or timeout
await __helpers.controlWrapper(
  async () => {
    const out = await __helpers.getTerminalOutput();
    assert.include(out, "Server started");
  },
  { timeout: 10000, stepSize: 500 },
);
```

---

## Seed Patterns — Annotated Examples

### Command Seed

````markdown
### --seed--

#### --cmd--

```bash
mkdir learn-how-to-build-an-npm-module/case_converter
```
````

### File Content Seed

````markdown
### --seed--

#### --"learn-nodejs-by-building-a-web-server/server.js"--

```js
const http = require("http");

const server = http.createServer((request, response) => {});

server.listen(3001);
```
````

### Multiple Files + Command in One Seed

````markdown
### --seed--

#### --cmd--

```bash
touch learn-how-to-build-an-npm-module/case_converter/package.json
```

#### --"learn-how-to-build-an-npm-module/case_converter/package.json"--

```json
{
  "name": "case_converter",
  "version": "1.0.0",
  "description": "This package is used to convert strings to a specific case.",
  "main": "index.js",
  "scripts": { "test": "node index.test.js" },
  "keywords": ["case", "converter", "uppercase", "lowercase"],
  "author": "Camper",
  "license": "MIT"
}
```

#### --"learn-how-to-build-an-npm-module/case_converter/index.js"--

```js
function getUpperCase(str) {
  return str.toUpperCase();
}
```
````

### `--force--` Seed (override `seedEveryLesson`)

````markdown
### --seed--

#### --force--

#### --"project-dir/server.js"--

```js
// forced seed content regardless of seedEveryLesson setting
```
````

---

## Description Style Guide

- **Imperative, second-person**: "Open a new terminal, and run `cd ...`"
- **One task per lesson**: Each lesson = one clear, surgical step.
- **Provide syntax help for new concepts**: Show a small code block illustrating the pattern before asking the learner to apply it.
- **Use `<dfn title="...">` for jargon**: `<dfn title="Transmission Control Protocol">TCP</dfn>`
- **Bold important warnings**: `**NOTE:** Once your server is running, click _Run Tests_`
- **Reference previous context**: "Previously, you learnt how to import modules..."

### Example — Terminal Task

```markdown
### --description--

Open a new terminal, and run `cd learn-how-to-build-an-npm-module` to change to the project directory.
```

### Example — Code Task with Syntax Help

````markdown
### --description--

You can also use the `require` function to import built-in modules. For example, to import the `fs` module:

```js
const fs = require("fs");
```

Within the `server.js` file, import the `http` module, and store it in a variable called `http`.
````

### Example — Interactive Prompt Task

```markdown
### --description--

You are being prompted for the package version. Versions are usually in the format `X.Y.Z`.

- `X`: Major revision — breaking changes
- `Y`: Minor revision — new features, backwards-compatible
- `Z`: Patch revision — bug fixes

Press `Enter` to accept the default version, `1.0.0`.
```

---

## `projects.json` — Real Example

```json
[
  {
    "id": 0,
    "dashedName": "learn-how-to-build-an-npm-module",
    "isIntegrated": false,
    "isPublic": true,
    "currentLesson": 0,
    "runTestsOnWatch": true,
    "seedEveryLesson": false,
    "isResetEnabled": false,
    "blockingTests": null,
    "breakOnFailure": null,
    "numberOfLessons": 44
  },
  {
    "id": 1,
    "dashedName": "build-a-timestamp-microservice",
    "isIntegrated": true,
    "isPublic": true,
    "currentLesson": 0,
    "runTestsOnWatch": false,
    "seedEveryLesson": false,
    "isResetEnabled": false,
    "blockingTests": true,
    "breakOnFailure": true,
    "numberOfLessons": 1
  },
  {
    "id": 2,
    "dashedName": "learn-nodejs-by-building-a-web-server",
    "isIntegrated": false,
    "isPublic": true,
    "currentLesson": 0,
    "runTestsOnWatch": true,
    "seedEveryLesson": true,
    "isResetEnabled": false,
    "blockingTests": false,
    "breakOnFailure": false,
    "numberOfLessons": 59
  }
]
```

Key patterns:

- Integrated projects (`isIntegrated: true`) have one lesson, `blockingTests: true`, `breakOnFailure: true`
- Step-by-step projects use `runTestsOnWatch: true` and `seedEveryLesson: true/false`
- `numberOfLessons` must match the actual lesson count in the `.md` file
