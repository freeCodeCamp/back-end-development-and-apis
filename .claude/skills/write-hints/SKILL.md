---
name: write-hints
description: Generates a --hints-- block for a specific lesson in a freeCodeCampOS curriculum markdown file. Pass the dashed name and lesson number as arguments.
argument-hint: <dashed-name> <lesson-number>
allowed-tools: Read, Glob
---

Generate a `### --hints--` block for lesson `$ARGUMENTS[1]` of the project `$ARGUMENTS[0]`.

## Reference

@.references/spec.md

## Steps

1. Locate the file at `curriculum/locales/english/$ARGUMENTS[0].md`. If it doesn't exist, list available files under `curriculum/locales/english/` and stop.

2. Read the full file. Gather context:
   - The description for lesson `$ARGUMENTS[1]` (what the learner is asked to do).
   - The tests for lesson `$ARGUMENTS[1]` (what assertions must pass — each test is a potential hint target).
   - The seed for lesson `$ARGUMENTS[1]` (what the learner starts from).
   - The hints in 2–3 nearby lessons (to match tone and granularity already established).

3. Write hints following these rules:

   **Ordering** — ordered from vague to specific. Early hints nudge direction; later hints give near-complete guidance. A learner should be able to pass the lesson using only the last hint if needed.

   **One hint per test** (roughly) — if the lesson has N tests, aim for N hints, each addressing the concept behind one test. For a single-assertion lesson, 2–3 hints are appropriate (why → what → how).

   **Format** — each hint is a numbered `#### <N>` heading followed by markdown content. Hints may include inline code, fenced code blocks, and links. Do not use `#### --force--` or other seed markers inside hints.

   **Tone** — encouraging, not condescending. Phrase hints as guidance ("Try using…", "Remember that…") not as corrections ("You forgot to…").

   **Hint 1** — conceptual nudge. Remind the learner what concept is involved without revealing the solution.

   **Hint 2** — structural hint. Show the shape of the solution (e.g. a partial code block with blanks) without filling it in completely.

   **Hint N (last)** — near-complete. Provide the exact pattern needed, leaving only the specific values for the learner to supply.

4. Output only the finished markdown block, ready to paste into the file:

```
### --hints--

#### 1

First hint content.

#### 2

Second hint content.

#### 3

Third hint content (near-complete guidance).
```

Do not include any explanation outside the block unless you need to flag an ambiguity about the tests or description.
