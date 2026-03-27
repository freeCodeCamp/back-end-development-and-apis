---
name: add-lesson
description: Inserts a new lesson at a given position in an existing freeCodeCampOS curriculum markdown file, renumbers subsequent lessons, and generates description, tests, and seed for the new lesson. Pass the dashed name and the position to insert at.
argument-hint: <dashed-name> <insert-at-lesson-number>
allowed-tools: Read, Write, Edit, Glob, Bash
---

Insert a new lesson at position `$ARGUMENTS[1]` in the project `$ARGUMENTS[0]`.

## Reference

@.references/spec.md

## Notes on lesson numbering

Lessons are zero-indexed. `rejig.js` (`node tooling/rejig.js <filename.md>`) renumbers all `## <N>` markers in a file sequentially from 0. Use it after inserting the new lesson block to fix any numbering gaps — do not manually renumber.

## Steps

1. Locate `curriculum/locales/english/$ARGUMENTS[0].md`. If it doesn't exist, list available files and stop.

2. Read the full file. Identify:
   - The lesson block currently at position `$ARGUMENTS[1]` (the lesson the new one will push forward).
   - The lesson immediately before it (`$ARGUMENTS[1] - 1`) for context on what state the learner is in.

3. Ask the user what the new lesson should teach (if not already clear from context). Confirm before writing.

4. **Draft the new lesson block** using the surrounding context:

   - **Seed** — what starting state does the learner need? Use `/write-seed` logic: minimal delta from the previous lesson, don't solve the task.
   - **Tests** — what must pass? Use `/write-tests` logic: one assertion per requirement, appropriate helpers.
   - **Description** — what is the learner asked to do? Use `/write-description` logic: imperative, second-person, introduce new syntax with an example if needed.

   Assemble the block:

   ````markdown
   ## PLACEHOLDER

   ### --description--

   <generated description>

   ### --tests--

   <generated tests>

   ### --seed--

   <generated seed, if needed>
   ````

   Use `## PLACEHOLDER` as the heading — `rejig.js` will assign the correct number.

5. **Insert** the new block into the file immediately before the `## <N>` heading that currently occupies position `$ARGUMENTS[1]`.

6. **Run rejig** to renumber all lessons:

   ```bash
   node tooling/rejig.js $ARGUMENTS[0].md
   ```

7. Report what was done:

   ```
   Inserted new lesson at position $ARGUMENTS[1] in $ARGUMENTS[0].
   Subsequent lessons renumbered via rejig.js.
   New lesson covers: <one-line summary>
   ```
