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
- **Example**: "Import the `readFileSync` function from the `fs` module, and store it in a variable called `readFileSync`."
- **Syntax Help**: Provide a small code block showing the syntax if the concept is new.

#### Test Design (Tests)
- **Prefer AST Analysis**: Use `__helpers.Tower` to inspect the learner's code structure.
- **Example**:
  ```js
  const file = await __helpers.getFile(project.dashedName, "server.js");
  const t = new __helpers.Tower(file);
  const readFileSync = t.getVariable("readFileSync");
  assert.equal(readFileSync.compact, 'const {readFileSync}=require("fs");');
  ```
- **Terminal Verification**: If the user needs to run a command, use `__helpers.getLastCommand()`.

### 4. Implementation (Appending)
- Construct the lesson block (`## <number>`, `--description--`, `--tests--`, and optional `--seed--`).
- **Append**: Insert the block before the `## --fcc-end--` marker in the curriculum file. If the marker is missing, append to the end of the file.

## Quality Standards
- **Surgical Changes**: Each lesson should represent one clear, manageable task.
- **Reliable Tests**: Tests must be robust and provide clear error messages if they fail.
- **Consistency**: Follow the conventions (naming, module systems) established in the project's earlier lessons.
- **Refer Context**: For deeper details on curriculum style and available `__helpers`, refer to the `AGENTS.md` file in the project root.
