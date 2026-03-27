---
name: find-unfinished-lessons
description: Scans a freeCodeCampOS curriculum markdown file for unfinished lessons — missing descriptions, missing tests, or TODO comments. Pass the project dashed name as the argument.
argument-hint: <dashed-name>
allowed-tools: Read, Glob, Grep
---

Scan the curriculum markdown file for the project `$ARGUMENTS` and report all unfinished lessons.

## Reference

@.references/spec.md

## Steps

1. Locate the file at `curriculum/locales/english/$ARGUMENTS.md`. If it doesn't exist, list available files under `curriculum/locales/english/` and stop.

2. Read the full file.

3. For each lesson (`## <N>` section, up to `## --fcc-end--`), check for these issues:

   - **Missing description** — `### --description--` section is absent, or its body is empty / whitespace-only.
   - **Missing tests** — `### --tests--` section is absent, or it has no test pairs (no description text followed by a ` ```js ` code block).
   - **TODO / placeholder content** — any occurrence of `TODO`, `FIXME`, `TBD`, or `<!-- ... -->` placeholder comments anywhere in the lesson block.

4. Output a structured report:

```
## Unfinished Lessons — <dashed-name>

### Lesson <N>
- [ ] Missing description
- [ ] Missing tests
- [ ] TODO: "<exact TODO text>"

### Lesson <N>
...

---
Total unfinished: X / Y lessons
```

If all lessons are complete, say so clearly.

## Notes

- Lesson numbers are zero-indexed (`## 0`, `## 1`, …).
- The `## --fcc-end--` marker is NOT a lesson — stop scanning there.
- A lesson with a `### --seed--` but no `### --tests--` is unfinished unless it is intentionally seed-only (rare; flag it anyway).
- Keep the report concise — list only issues, not the full lesson content.
