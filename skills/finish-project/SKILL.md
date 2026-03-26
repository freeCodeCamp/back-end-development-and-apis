---
name: finish-project
description: Completes a partially finished freeCodeCamp project by identifying and filling in missing `--description--`, `--tests--`, and `--seed--` sections for all lessons in a given project.
---

# Finish Project Completion Workflow

This skill is designed to polish and complete projects that have gaps in their curriculum Markdown.

## Procedural Workflow

### 1. Identify Gaps
Identify which lessons in the curriculum Markdown (`curriculum/locales/english/<dashedName>.md`) are incomplete. Use the provided helper script:
```bash
node <path-to-skill>/scripts/find_gaps.cjs <path-to-markdown-file>
```

### 2. Research Solution State
For each incomplete lesson, examine the project's boilerplate files (`<dashedName>/`) and the progression of surrounding lessons to understand:
- What technical concept is being introduced?
- What specific code changes is the learner expected to make?
- What terminal commands are relevant?

### 3. Generate Missing Content
Following the standards in `AGENTS.md`, fill in the gaps for each lesson.

#### Missing Descriptions
- Provide clear, imperative instructions.
- Include syntax examples for new concepts.
- Example: "Import the `readFile` function from the `fs` module using an `import` statement."

#### Missing/Empty Tests
- Use `__helpers.Tower` for AST-based verification.
- Ensure tests are robust and provide meaningful feedback.
- Example:
  ```js
  const file = await __helpers.getFile(project.dashedName, "server.js");
  const t = new __helpers.Tower(file);
  const readFile = t.getVariable("readFile");
  assert.equal(readFile.compact, 'import{readFile}from"fs";');
  ```

#### Missing Seeds
- If a lesson requires a specific starting state (e.g., a new file or partially filled file), add the `--seed--` section.

### 4. Validation
- **Incremental Verification**: As you fill gaps, ensure the lesson's tests correctly align with the new description.
- **Consistency Check**: Ensure the entire project's difficulty curve and module system (CommonJS vs ESM) remain consistent.

## Quality Standards
- **Manageable Increments**: Ensure each completed lesson still represents a single, surgical task.
- **No Brittle Regex**: Prioritize `Tower` or `Babeliser` for code inspection.
- **Follow Project Style**: Adhere to the tone and wording established in existing finished projects like `build-a-timestamp-microservice.md`.
