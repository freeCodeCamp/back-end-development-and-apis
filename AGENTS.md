# Agent Context: freeCodeCamp Curriculum & Tooling

This document provides the necessary context for LLMs to understand the structure, style, and implementation details of the freeCodeCamp curriculum.

## Curriculum Structure & Markdown Format

Projects are defined in Markdown files using custom tags to delineate instructions, tests, and state.

### Metadata
Projects begin with an optional JSON block for tags:
```json
{
  "tags": ["Certification Project"]
}
```

### Lessons
Lessons are denoted by H2 headers (e.g., `## 0`, `## 1`). Each lesson contains:

#### 1. `--description--`
Instructions for the learner.
- **Wording Style**: Direct, imperative, and instructional.
  - "Open a new terminal, and run `cd ...`."
  - "Within the `server.js` file, import the `http` module."
  - "Create a variable called `url` and set it equal to..."
- **Formatting**: Use backticks for code symbols, file names, and commands.

#### 2. `--tests--`
A collection of test blocks. Each block consists of a **Description** (what the learner should have done) and a **JavaScript snippet** (the assertion).
- **Test Text**: Written as a requirement.
  - "You should have `const http = require("http")` within `server.js`."
  - "The `index.js` file should export the `getUpperCase` function."
- **Test Code**: Uses `chai` (assert/expect) and `__helpers`.
  - **Example (File Check)**:
    ```js
    const fileExists = await __helpers.fileExists(join(project.dashedName, "server.js"));
    assert.isTrue(fileExists, "The server.js file does not exist");
    ```
  - **Example (AST Analysis with Tower)**:
    ```js
    const file = await __helpers.getFile(project.dashedName, "server.js");
    const t = new __helpers.Tower(file);
    const http = t.getVariable("http");
    assert.equal(http.compact, 'const http=require("http");');
    ```

#### 3. `--seed--`
Defines the starting state for a lesson or a way to reset the environment.
- **`--cmd--`**: Shell commands to prepare the directory.
  - `cd learn-how-to-build-an-npm-module && rm -r .`
- **`--"path/to/file"--`**: Writes exact content to a file.
  ```markdown
  #### --"server.js"--
  ```js
  const http = require("http");
  ```
  ```

#### 4. Lifecycle Hooks
- `--before-each--`, `--after-each--`, `--before-all--`, `--after-all--`: Run JavaScript setup/teardown logic.

## Project Types

### Integrated Projects (Certification)
- **Goal**: Build a complete app from a blank slate.
- **Structure**: One large lesson (`## 0`).
- **Description**: High-level requirements and user stories.
- **Tests**: Verify final functionality (e.g., API responses).
  - **Example**: `const response = await fetch("${__url}api/2016-12-25"); const data = await response.json(); assert.strictEqual(data.unix, 1482624000000);`

### Non-integrated Projects (Step-by-step)
- **Goal**: Learn concepts through small, incremental changes.
- **Structure**: Dozens of small lessons.
- **Description**: Focuses on a single task (e.g., "Import a module").
- **Tests**: Verify specific syntax or recent commands.
- **Boilerplate**: Usually starts with navigating to the project directory.
  - **Example (Lesson 0)**: "Run `cd learn-how-to-build-an-npm-module` to change to the project directory."

## Implementation Guidelines & Best Practices

### Writing Descriptions
- Use **Directional Language**: Tell the user where to work ("Within the `public/` directory...") and what to do ("...create a file named `style.css`").
- Provide **Syntax Examples**: When introducing a new concept, provide a code block showing the syntax.
  ```markdown
  To create a server, use the `createServer` method:
  ```js
  const server = http.createServer();
  ```
  ```

### Writing Tests
- **AST > Regex**: Always prefer `__helpers.Tower` or `__helpers.Babeliser` over regex for checking code structure. Regex is brittle and hard to maintain.
- **Terminal History**: Use `__helpers.getLastCommand()` or `__helpers.getBashHistory()` to verify the learner ran a specific command.
- **Live Servers**: If the learner starts a server, use `__helpers.isServerListening(port)` to verify it before running functional tests.
- **Cleanup**: If a test creates temporary files or directories (e.g., using `mkdir` or `cp`), use `--after-all--` to remove them.

### Global Helpers (`__helpers`) Reference
- `getDir(path)`: List files in a directory.
- `getFile(project, path)`: Read file content as string.
- `fileExists(path)`: Check for file existence.
- `getLastCommand()`: Get last terminal command.
- `getLastCWD()`: Get last directory path from terminal.
- `Tower(code)`: Create AST inspector.
  - `.getVariable(name)`
  - `.getFunction(name)`
  - `.getCalls(callSite)`
  - `.compact`: Minified code string.
- `awaitExecution(cmd, url, options)`: Run a process, poll a URL, then kill the process.
- `parseCli(str)`: Parse a command string into an arguments array.
