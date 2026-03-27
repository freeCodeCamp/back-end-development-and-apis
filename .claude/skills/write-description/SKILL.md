---
name: write-description
description: Generates a --description-- block for a specific lesson in a freeCodeCampOS curriculum markdown file. Pass the dashed name and lesson number as arguments.
argument-hint: <dashed-name> <lesson-number>
allowed-tools: Read, Glob
---

Generate a `### --description--` block for lesson `$ARGUMENTS[1]` of the project `$ARGUMENTS[0]`.

## Reference

@.references/spec.md

## Steps

1. Locate the file at `curriculum/locales/english/$ARGUMENTS[0].md`. If it doesn't exist, list available files under `curriculum/locales/english/` and stop.

2. Read the full file. Gather context:
   - The project title and description at the top of the file.
   - The seed for lesson `$ARGUMENTS[1]` (what files/commands are set up beforehand).
   - The tests for lesson `$ARGUMENTS[1]` (what the learner must achieve — this is the single most important input).
   - The descriptions and seeds of the 2–3 preceding lessons (for narrative continuity).

3. Write the description following the style guide:

   - **Imperative, second-person**: "Open a new terminal and run…", "In `server.js`, add…"
   - **One clear task per lesson**: the description should set up exactly what the tests verify — no more, no less.
   - **Introduce new concepts with a short example**: if the lesson requires a syntax or API the learner hasn't seen yet, show a minimal illustrative code block before asking them to apply it.
   - **Use `<dfn title="...">` for jargon** on first use: `<dfn title="HyperText Transfer Protocol">HTTP</dfn>`
   - **Bold important warnings**: `**NOTE:** Once your server is running, click _Run Tests_`
   - **Reference prior lessons** where relevant: "Previously, you used `require` to import modules…"
   - Keep it concise — typically 2–5 sentences plus any example block.

4. Output only the finished markdown block, ready to paste into the file:

````
### --description--

<generated description here>
````

Do not include any explanation outside the block unless you need to flag an ambiguity about the tests or seed.
