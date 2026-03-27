---
name: write-tests
description: Generates a --tests-- block for a specific lesson in a freeCodeCampOS curriculum markdown file. Pass the dashed name and lesson number as arguments.
argument-hint: <dashed-name> <lesson-number>
allowed-tools: Read, Glob
---

Generate a `### --tests--` block for lesson `$ARGUMENTS[1]` of the project `$ARGUMENTS[0]`.

## Reference

@.references/spec.md

## Steps

1. Locate the file at `curriculum/locales/english/$ARGUMENTS[0].md`. If it doesn't exist, list available files under `curriculum/locales/english/` and stop.

2. Read the full file. Gather context:
   - The project title and overall goal.
   - The seed for lesson `$ARGUMENTS[1]` (the starting file state the learner works from).
   - The description for lesson `$ARGUMENTS[1]` (what the learner is asked to do — the primary spec for the tests).
   - The tests of the 2–3 preceding lessons (to match style, helper usage, and variable naming conventions already established).
   - Whether `blockingTests` is relevant (check `config/projects.json` if accessible).

3. Write tests following these rules:

   **Coverage** — every assertion in the description must have at least one test. Do not test things not mentioned in the description.

   **Choose the right helper** — prefer the simplest helper that works:
   - File content checks → `__helpers.getFile(project.dashedName, "path")` + regex or Tower/Babeliser for structural checks
   - Command history → `__helpers.getLastCommand()`
   - Terminal output → `__helpers.getTerminalOutput()`
   - CWD → `__helpers.getLastCWD()`
   - Server running → `__helpers.isServerListening(port)`
   - HTTP behavior → `fetch(...)` (integrated projects only)
   - Structural/AST checks → `new __helpers.Tower(file)` (preferred over regex for code shape)

   **Test pair format** — each test is a plain-text description line followed immediately by a fenced ` ```js ` block:
   ```
   Description of what is being tested.

   ```js
   // test code
   assert.something(...);
   ```
   ```

   **Assertions** — use `chai` globals (`assert`, `expect`). Prefer `assert` for clarity. Include a failure message string as the last argument where it aids debugging.

   **Prefix locals with `__`** to avoid `eval` collisions (e.g. `__file`, `__t`, `__res`).

   **Use `--before-all--`** only when two or more tests share expensive setup (e.g. parsing a file once with Tower or Babeliser). Store results on `global` and clean up in `--after-all--`. Do not use it when the lesson has only one test — inline the setup instead.

   **Use `--before-each--`** for lightweight per-test setup that must repeat (e.g. declaring `__url` for fetch-based integrated tests). Do not declare variables inside individual test blocks that belong in `--before-each--`.

   **`--before-all--` vs `--before-each--` quick rule:**
   - Integrated project with `fetch` tests → `--before-each--` for `__url`, no `--before-all--`
   - Step-by-step with file/AST checks across multiple tests → `--before-all--` to parse once, `--after-all--` to clean up
   - Single test in the lesson → neither; inline everything

4. Output only the finished markdown block, ready to paste into the file:

````
### --tests--

First test description.

```js
// test code
```

Second test description.

```js
// test code
```

### --before-all--

```js
// optional shared setup
```

### --after-all--

```js
// optional cleanup
```
````

Omit `--before-all--` / `--after-all--` if not needed. Do not include any explanation outside the block unless you need to flag an ambiguity about the description or seed.
