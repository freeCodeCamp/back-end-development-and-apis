---
name: write-seed
description: Generates a --seed-- block for a specific lesson in a freeCodeCampOS curriculum markdown file. Pass the dashed name and lesson number as arguments.
argument-hint: <dashed-name> <lesson-number>
allowed-tools: Read, Glob
---

Generate a `### --seed--` block for lesson `$ARGUMENTS[1]` of the project `$ARGUMENTS[0]`.

## Reference

@.references/spec.md

## Steps

1. Locate the file at `curriculum/locales/english/$ARGUMENTS[0].md`. If it doesn't exist, list available files under `curriculum/locales/english/` and stop.

2. Read the full file. Gather context:
   - The project title and overall goal.
   - The description for lesson `$ARGUMENTS[1]` (what the learner must do — defines what state to start from).
   - The tests for lesson `$ARGUMENTS[1]` (what must pass — confirms what the seed should NOT already solve).
   - The seed and resulting file state of the previous lesson (`$ARGUMENTS[1] - 1`) to understand what files already exist and their current content.
   - The seeds of 2–3 earlier lessons for naming and structure conventions.

3. Design the seed following these rules:

   **Purpose** — the seed sets up the *starting state* for the lesson. It should give the learner exactly what they need to attempt the task, without doing the task for them. The tests must still require learner action to pass.

   **Minimal delta** — only include files or commands that change from the previous lesson's state. Do not re-seed unchanged files.

   **File seeds** — use `#### --"<relative/path>"--` with a fenced code block for each file that needs to be written or overwritten. Paths are relative to the workspace root (e.g. `learn-nodejs-by-building-a-web-server/server.js`).

   **Command seeds** — use `#### --cmd--` with a fenced `bash` block for shell commands (e.g. `mkdir`, `touch`, `npm install`). Place `--cmd--` before file seeds when the command creates directories or files that the file seed depends on.

   **`--force--`** — add `#### --force--` before seeds that must always run regardless of `seedEveryLesson`. Use sparingly.

   **Don't over-seed** — if the previous lesson's seed already produced the correct file state, no seed is needed. Output a note explaining this instead.

4. Output only the finished markdown block, ready to paste into the file:

````
### --seed--

#### --cmd--

```bash
command to run
```

#### --"project-dir/path/to/file.js"--

```js
file content
```
````

Omit `--cmd--` or file sections if not needed. Do not include any explanation outside the block unless you need to flag an ambiguity or reason why no seed is required.
