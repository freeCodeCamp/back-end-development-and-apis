---
name: setup-project
description: Full end-to-end setup for a new freeCodeCampOS project — creates the projects.json entry, curriculum markdown stub, project directory, and all boilerplate source files (package.json, server.js, etc.), then installs dependencies. Pass the dashed name as the argument.
argument-hint: <dashed-name>
allowed-tools: Read, Write, Edit, Glob, Bash
---

Set up a complete new freeCodeCampOS project named `$ARGUMENTS`.

> **When to use this skill vs `/generate-boilerplate`:**
> Use `/setup-project` when you need the full package — curriculum framework AND runnable source files (`package.json`, `server.js`, etc.) with dependencies installed.
> Use `/generate-boilerplate` when you only need the curriculum scaffolding and will supply the project source files yourself.

## Reference

@.references/spec.md

## Steps

### 1 — Validate & gather intent

- Confirm `$ARGUMENTS` is kebab-case. If not, flag it and stop.
- Check for conflicts: `curriculum/locales/english/$ARGUMENTS.md`, a `projects.json` entry with `"dashedName": "$ARGUMENTS"`, or a directory `$ARGUMENTS/` already existing. If any exist, report and stop.
- Ask the user (if not already clear from context):
  1. **Project type** — integrated (one-lesson certification project, fetch-tested) or step-by-step (multi-lesson, file-watched)?
  2. **Stack** — what dependencies are needed (e.g. `express`, `cors`, `mongoose`)? What is the entry point filename (default: `server.js`)?
  3. **Port** — what port will the server listen on (default: `3000` for step-by-step, `8000` for integrated)?
  4. **Any extra boilerplate files** — e.g. `public/`, `views/`, `.env` stub?

### 2 — `config/projects.json` entry

Read the current `config/projects.json` to find the next available `id` (max existing id + 1), then append:

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

### 3 — Curriculum markdown

Create `curriculum/locales/english/$ARGUMENTS.md`:

**Integrated project:**
````markdown
# <Title Case of $ARGUMENTS>

```json
{"tags": ["Certification Project"]}
```

<One-sentence description of what the learner will build.>

## 0

### --description--

TODO: Add description.

### --tests--

TODO: Add tests.

### --before-each--

```js
const __url = "http://localhost:<port>/";
```

## --fcc-end--
````

**Step-by-step project:**
````markdown
# <Title Case of $ARGUMENTS>

<One-sentence description of what the learner will build.>

## 0

### --description--

TODO: Add description for lesson 0.

### --tests--

TODO: Add tests for lesson 0.

## --fcc-end--
````

### 4 — Project source files

Create the project directory and all boilerplate source files.

**Always create:**

`$ARGUMENTS/package.json`:
```json
{
  "name": "$ARGUMENTS",
  "version": "0.0.1",
  "description": "",
  "main": "<entry-point>",
  "scripts": {
    "start": "node <entry-point>"
  },
  "dependencies": {
    <user-specified dependencies with latest versions>
  },
  "keywords": ["node", "freecodecamp"],
  "license": "MIT",
  "type": "module"
}
```

`$ARGUMENTS/<entry-point>` (e.g. `server.js`) — a minimal starter matching the project type:

- **Integrated (Express):**
```js
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.static('public'));

const port = process.env.PORT || <port>;
app.listen(port, () => console.log(`Listening on port ${port}`));
```

- **Step-by-step (plain Node http):**
```js
// Starter file — add your code here
```

**Create any additional boilerplate files the user requested** (e.g. `public/index.html`, `views/index.html`, `.env`).

### 5 — Install dependencies

```bash
cd $ARGUMENTS && npm install
```

### 6 — Report

```
## Project setup complete — $ARGUMENTS

Files created:
- [x] config/projects.json — entry added (id: <N>)
- [x] curriculum/locales/english/$ARGUMENTS.md
- [x] $ARGUMENTS/package.json
- [x] $ARGUMENTS/<entry-point>
- [x] <any additional files>

Dependencies installed:
- <list>

Next steps:
- Write curriculum content with /write-description, /write-tests, /write-seed
- Run /find-unfinished-lessons $ARGUMENTS to audit progress
```
