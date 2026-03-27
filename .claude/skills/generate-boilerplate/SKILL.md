---
name: generate-boilerplate
description: Scaffolds all boilerplate files for a new freeCodeCampOS project — curriculum markdown, projects.json entry, and project directory. Pass the dashed name as the argument.
argument-hint: <dashed-name>
allowed-tools: Read, Write, Edit, Glob, Bash
---

Scaffold the boilerplate for a new freeCodeCampOS project named `$ARGUMENTS`.

> **When to use this skill vs `/setup-project`:**
> Use `/generate-boilerplate` when you only need the curriculum framework (`.md` stub, `projects.json` entry, empty project directory) and will provide the project source files yourself.
> Use `/setup-project` when you also want boilerplate source files (`package.json`, `server.js`, etc.) created and dependencies installed.

## Reference

@.references/spec.md

## Steps

1. **Validate the argument.** `$ARGUMENTS` must be kebab-case (e.g. `build-a-url-shortener`). If it looks malformed, flag it and stop.

2. **Check for conflicts.** Verify none of these already exist:
   - `curriculum/locales/english/$ARGUMENTS.md`
   - A `projects.json` entry with `"dashedName": "$ARGUMENTS"`
   - A directory named `$ARGUMENTS/` in the workspace root

   If any exist, report the conflict and stop.

3. **Read `config/projects.json`** to determine the next available `id` (max existing id + 1) and understand the conventions used by existing projects.

4. **Ask the user** (if not already clear from context) whether this is:
   - An **integrated project** (`isIntegrated: true`) — one-lesson, fetch-based, `blockingTests: true`, `breakOnFailure: true`
   - A **step-by-step project** (`isIntegrated: false`) — multi-lesson, `runTestsOnWatch: true`

   Then create all three artifacts:

---

### Artifact 1 — `config/projects.json` entry

Append to the array:

```json
{
  "id": <next-id>,
  "dashedName": "$ARGUMENTS",
  "isIntegrated": <true|false>,
  "isPublic": true,
  "currentLesson": 0,
  "runTestsOnWatch": <true if step-by-step, false if integrated>,
  "seedEveryLesson": false,
  "isResetEnabled": false,
  "blockingTests": <true if integrated, null if step-by-step>,
  "breakOnFailure": <true if integrated, null if step-by-step>,
  "numberOfLessons": <1 if integrated, 1 as placeholder if step-by-step>
}
```

---

### Artifact 2 — `curriculum/locales/english/$ARGUMENTS.md`

````markdown
# <Title Case of $ARGUMENTS>

<One-sentence project description — what the learner will build.>

## 0

### --description--

TODO: Add description for lesson 0.

### --tests--

TODO: Add tests for lesson 0.

## --fcc-end--
````

---

### Artifact 3 — Project directory

Create the project directory at `$ARGUMENTS/` in the workspace root with a `.gitkeep` so it exists in version control:

```bash
mkdir -p $ARGUMENTS && touch $ARGUMENTS/.gitkeep
```

---

5. **Report what was created:**

```
## Boilerplate generated — $ARGUMENTS

- [x] config/projects.json — entry added (id: <N>)
- [x] curriculum/locales/english/$ARGUMENTS.md — created
- [x] $ARGUMENTS/ — project directory created

Next steps:
- Fill in the project description at the top of the .md file
- Add lessons using /write-description, /write-tests, /write-seed
```
