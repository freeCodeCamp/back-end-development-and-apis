# Contributing

## Curriculum tests

Requirements: Node.js 24 and dependencies installed with `npm ci`.

```bash
npm test                 # runtime, solution-state, and AST checks
npm run test:crash       # runtime crashes, timeouts, and rejected promises
npm run test:lint        # parse and unsafe-dereference checks
```

Filter runs while developing:

```bash
node test/run.mjs --project build-a-web-server
node test/run.mjs --project build-a-web-server --lesson 15
node test/run.mjs --check crash,solution
```

Useful options:

- `--concurrency <n>` - parallel lesson workers
- `--timeout <ms>` - per-test timeout
- `--settle <ms>` - wait for late promise rejections
- `--json` - emit JSON Lines records
- `--junit[=<path>]` - write JUnit XML

Every run validates curriculum structure. Runtime tests execute in temporary workspaces; project files and `.logs/` remain untouched. Tests may pass or fail with `AssertionError`. Other errors, timeouts, and unhandled rejections fail harness.

Solution checks use next lesson seed or `_solution/@<lesson>/` snapshot. Starting state must fail at least one test; reference state must pass all tests. Live-server and terminal-fixture coverage remains skipped where no safe fixture exists.

## Allowlisting

Add unavoidable exceptions to `test/allowlist.json`:

```json
{
  "build-a-web-server#35#0": "Reason this specific test cannot be checked yet"
}
```

Keys use `<project>#<lesson>` or `<project>#<lesson>#<testIndex>`. Every entry needs non-empty reason. Invalid or stale entries fail run. Allowlisted entries remain visible in summary.

## Before submitting

Run smallest relevant filtered command, then `npm test`. CI runs full harness and uploads JUnit results.
