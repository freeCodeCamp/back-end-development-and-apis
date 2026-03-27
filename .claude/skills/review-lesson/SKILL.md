---
name: review-lesson
description: Reviews a specific lesson in a freeCodeCampOS curriculum markdown file for quality — checks description/test alignment, seed safety, helper appropriateness, and hint ordering. Pass the dashed name and lesson number as arguments.
argument-hint: <dashed-name> <lesson-number>
allowed-tools: Read, Glob
---

Review lesson `$ARGUMENTS[1]` of the project `$ARGUMENTS[0]` for quality and correctness.

## Reference

@.references/spec.md

## Steps

1. Locate `curriculum/locales/english/$ARGUMENTS[0].md`. If it doesn't exist, list available files and stop.

2. Read the full file. Extract the complete block for lesson `$ARGUMENTS[1]` including its description, tests, seed, and hints (if any). Also read the previous lesson's seed to understand the starting file state.

3. Evaluate each dimension below and record a pass ✅, warning ⚠️, or failure ❌ for each.

---

### Dimension 1 — Description / test alignment

- Does the description ask for exactly what the tests verify — no more, no less?
- Are there tests that check something the description never mentions?
- Does the description promise something no test verifies?

### Dimension 2 — Seed safety

- Does the seed provide a starting state without solving the task?
- Does the seed accidentally include code that would cause any test to pass without learner action?
- Is the seed the minimal delta from the previous lesson (no re-seeding unchanged files)?

### Dimension 3 — Test quality

- Is there at least one test per requirement mentioned in the description?
- Are the right helpers used for the task type?
  - File content → `getFile` + Tower/Babeliser/regex (not `getTerminalOutput`)
  - Shell commands → `getLastCommand` (not `getTerminalOutput`)
  - Server running → `isServerListening` (not `getCommandOutput`)
  - HTTP behavior → `fetch` (integrated projects only)
- Are local variables prefixed with `__` to avoid `eval` collisions?
- Is `--before-all--` used only when multiple tests share expensive setup? Is it absent when only one test exists?
- Is `--before-each--` used for per-test setup (e.g. `__url`) rather than in-test declarations?
- Do assertion failure messages (second `assert` argument) aid debugging?

### Dimension 4 — Hints (if present)

- Are hints ordered from vague to specific?
- Does the last hint provide near-complete guidance?
- Does any hint give away the answer prematurely (e.g. hint 1 shows exact code)?

### Dimension 5 — Description style

- Is the description imperative and second-person?
- Are new syntax concepts introduced with a short example before asking the learner to apply them?
- Is jargon wrapped in `<dfn title="...">`?
- Is the task atomic — one clear thing to do?

---

4. Output a structured report:

```
## Lesson Review — <dashed-name> / Lesson <N>

| Dimension              | Status | Notes |
|------------------------|--------|-------|
| Description/test align | ✅/⚠️/❌ | ... |
| Seed safety            | ✅/⚠️/❌ | ... |
| Test quality           | ✅/⚠️/❌ | ... |
| Hints                  | ✅/⚠️/❌/N/A | ... |
| Description style      | ✅/⚠️/❌ | ... |

### Issues to fix
- <specific actionable item>
- <specific actionable item>
```

If there are no issues, say so clearly and omit the "Issues to fix" section.
