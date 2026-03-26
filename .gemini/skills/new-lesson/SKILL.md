---
name: new-lesson
description: Appends a new lesson to an existing curriculum Markdown file. It automatically determines the next lesson number and generates the `--description--` and `--tests--` based on user-provided goals, adhering to the freeCodeCamp curriculum style.
---

# New Lesson Creation Workflow

This skill provides a standardized workflow for adding incremental lessons to freeCodeCamp projects.

## Procedural Workflow

### 1. Research & Identification
- Identify the target curriculum file (e.g., `curriculum/locales/english/learn-nodejs-by-building-a-web-server.md`).
- Identify the matching project boilerplate directory (e.g., `learn-nodejs-by-building-a-web-server/`).
- **Context Gathering**: Read the last 3-5 lessons in the curriculum file to understand the current technical state and pedagogical style.

### 2. Determine Lesson Number
Run the provided helper script to find the next available lesson number:
```bash
node <path-to-skill>/scripts/get_next_lesson.cjs <path-to-curriculum-file>
```

### 3. Design the Lesson
Based on the user's goal (e.g., "Add a lesson on using the `fs` module") or the current project state, design the next step.

#### Wording Guidelines (Description)
- **Style**: Direct, imperative, and instructional.
- **Examples**:
  - "Open a new terminal, and run `cd case_converter` to change to the directory you just created." (from `learn-how-to-build-an-npm-module.md` ## 2)
  - "Within `index.js`, create a function, `getSentenceCase`, which takes a string as an argument." (from `learn-how-to-build-an-npm-module.md` ## 17)
- **Syntax Help**: Provide a small code block showing the syntax if the concept is new.

#### Test Design (Tests)
- **Prefer AST Analysis**: Use `__helpers.Tower` to inspect the learner's code structure.
- **Example (File Check)**:
  ```js
  const fileExists = await __helpers.fileExists("learn-how-to-build-an-npm-module/case_converter/index.js");
  assert.isTrue(fileExists, "The index.js file does not exist");
  ```
- **Example (AST Analysis with Tower)**:
  ```js
  const file = await __helpers.getFile(project.dashedName, "case_converter/index.test.js");
  const t = new __helpers.Tower(file);
  const variableDeclaration = t.getVariable("caseConverter").compact;
  assert.equal(variableDeclaration, 'const caseConverter=require("./index");');
  ```
- **Terminal Verification**: If the user needs to run a command, use `__helpers.getLastCommand()`.

#### Seed State (Seeds)
- Use `--seed--` to reset the environment or provide starter code.
- **Example**:
  ```markdown
  ### --seed--
  #### --cmd--
  ```bash
  cd learn-how-to-build-an-npm-module && rm -r .
  ```
  ```

### 4. Implementation (Appending)
- Construct the lesson block (`## <number>`, `--description--`, `--tests--`, and optional `--seed--`).
- **Append**: Insert the block before the `## --fcc-end--` marker in the curriculum file. If the marker is missing, append to the end of the file.

## References & Helpers
- **Custom Project Helpers**: `tooling/helpers.js` (provides `getDir`, `getFile`, `fileExists`, `Tower`, etc.).
- **Built-in freeCodeCampOS Helpers**: [test-utils.js](https://raw.githubusercontent.com/freeCodeCamp/freeCodeCampOS/1ebf47e67a56986a7fc4afff17f3276c1465f606/.freeCodeCamp/tooling/test-utils.js) (exports like `getBashHistory`, `getLastCommand`, `isServerListening`).
- **Complex Test Examples**: [Solana Curriculum](https://github.com/freeCodeCamp/solana-curriculum/tree/main/curriculum/locales/english) (reference for advanced testing logic).
- **Finished Non-integrated Example**: `curriculum/locales/english/learn-how-to-build-an-npm-module.md`.

## Quality Standards
- **Surgical Changes**: Each lesson should represent one clear, manageable task.
- **Reliable Tests**: Tests must be robust and provide clear error messages if they fail.
- **Consistency**: Follow the conventions (naming, module systems) established in the project's earlier lessons.
- **Refer Context**: For deeper details on curriculum style and available `__helpers`, refer to the `AGENTS.md` file in the project root.
