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
- **Example of Unfinished Project**: `curriculum/locales/english/learn-nodejs-by-building-a-web-server.md` contains several lessons with `assert.fail()` that need real logic.

### 2. Research Solution State
For each incomplete lesson, examine the project's boilerplate files (`<dashedName>/`) and the progression of surrounding lessons to understand:
- What technical concept is being introduced?
- What specific code changes is the learner expected to make?
- What terminal commands are relevant?
- **Reference**: Look at `curriculum/locales/english/learn-how-to-build-an-npm-module.md` to see how a completed sequence of lessons should look.

### 3. Generate Missing Content
Following the standards in `AGENTS.md`, fill in the gaps for each lesson.

#### Missing Descriptions
- Provide clear, imperative instructions.
- **Reference**: See `learn-how-to-build-an-npm-module.md` ## 15 for a clear description of a coding task.

#### Missing/Empty Tests
- Use `__helpers.Tower` for AST-based verification.
- **Example from Finished Project**:
  ```js
  const file = await __helpers.getFile(project.dashedName, "index.js");
  const t = new __helpers.Tower(file);
  const getUpperCase = t.getFunction("getUpperCase");
  assert.isDefined(getUpperCase, "The getUpperCase function is not defined");
  ```

#### Missing Seeds
- Ensure the learner starts each lesson with the correct file structure.
- **Reference**: `learn-how-to-build-an-npm-module.md` ## 14 shows how to seed a new file.

### 4. Validation
- **Incremental Verification**: As you fill gaps, ensure the lesson's tests correctly align with the new description.
- **Consistency Check**: Ensure the entire project's difficulty curve and module system (CommonJS vs ESM) remain consistent.

## Quality Standards
- **Manageable Increments**: Ensure each completed lesson still represents a single, surgical task.
- **No Brittle Regex**: Prioritize `Tower` or `Babeliser` for code inspection.
- **Follow Project Style**: Adhere to the tone and wording established in finished projects like `build-a-timestamp-microservice.md` or `learn-how-to-build-an-npm-module.md`.
