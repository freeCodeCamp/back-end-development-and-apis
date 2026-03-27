---
name: create-project
description: Fully creates a new freeCodeCampOS project end-to-end — runs setup-project, then generates descriptions, tests, and seeds for every lesson. Pass the dashed name and an outline of the project as arguments.
argument-hint: <dashed-name> "<project outline>"
allowed-tools: Read, Write, Edit, Glob, Bash
---

Create a complete freeCodeCampOS project named `$ARGUMENTS[0]` based on the outline: `$ARGUMENTS[1]`.

## Reference

@.references/spec.md

## Available Skills

The following skills are available and must be used at the appropriate phases:

- `/setup-project` — creates `projects.json` entry, curriculum `.md` stub, project directory, source files, and installs dependencies
- `/generate-boilerplate` — creates curriculum scaffolding only (use if `/setup-project` has already been run)
- `/write-description <dashed-name> <N>` — generates `### --description--` for lesson N
- `/write-tests <dashed-name> <N>` — generates `### --tests--` for lesson N
- `/write-seed <dashed-name> <N>` — generates `### --seed--` for lesson N
- `/write-hints <dashed-name> <N>` — generates `### --hints--` for lesson N
- `/review-lesson <dashed-name> <N>` — quality-checks a completed lesson
- `/find-unfinished-lessons <dashed-name>` — audits the curriculum file for gaps

## Phase 1 — Plan

Before writing any files, produce a **lesson plan** and confirm it with the user:

1. Identify the project type (integrated or step-by-step) from the outline.
2. Identify the stack (language, frameworks, dependencies, port).
3. For step-by-step projects, draft a numbered lesson outline:
   - Each lesson = one atomic, testable task.
   - Order lessons so each builds directly on the previous.
   - Aim for lessons that are small enough to test with 1–3 assertions.
   - Note which lessons need a seed (file write or shell command) vs. which rely on the learner's own edits.
   - Suggest a rough lesson count based on scope: simple single-endpoint API ≈ 8–15 lessons; multi-route CRUD API ≈ 25–40 lessons; full framework walkthrough ≈ 40–70 lessons. State your estimate and reasoning so the user can calibrate.
4. Present the plan as a markdown table:

| # | Task | Seed needed? |
|---|------|-------------|
| 0 | ... | yes / no |
| 1 | ... | yes / no |
| … | … | … |

**Wait for user approval before continuing.** Adjust the plan if the user requests changes.

## Phase 2 — Setup

Run `/setup-project $ARGUMENTS[0]`, providing the agreed stack and project type. This creates:
- `config/projects.json` entry
- `curriculum/locales/english/$ARGUMENTS[0].md` stub
- `$ARGUMENTS[0]/` source files + `npm install`

## Phase 3 — Write Lessons

For each lesson N in the approved plan, in order:

1. **Seed first** (if needed) — run `/write-seed $ARGUMENTS[0] <N>` and insert the result into the curriculum `.md`.
2. **Tests second** — run `/write-tests $ARGUMENTS[0] <N>` and insert the result.
3. **Description last** — run `/write-description $ARGUMENTS[0] <N>` and insert the result.
4. **Review** — run `/review-lesson $ARGUMENTS[0] <N>` and fix any issues before moving to the next lesson.

   > Description is written last because it should reflect what the tests actually verify — not the other way around.

After writing each lesson, insert its content into `curriculum/locales/english/$ARGUMENTS[0].md` under the correct `## <N>` heading, replacing the TODO stubs.

## Phase 4 — Finalise

1. Run `/find-unfinished-lessons $ARGUMENTS[0]` and fix any gaps reported.
2. Verify `## --fcc-end--` is the last marker in the curriculum file.

## Phase 5 — Report

```
## Project created — $ARGUMENTS[0]

Lessons: <N>
Type: integrated | step-by-step
Stack: <dependencies>

Files:
- config/projects.json (updated)
- curriculum/locales/english/$ARGUMENTS[0].md (<N> lessons)
- $ARGUMENTS[0]/package.json
- $ARGUMENTS[0]/<entry-point>
- <any additional files>

Audit: /find-unfinished-lessons $ARGUMENTS[0] — all clear
```
