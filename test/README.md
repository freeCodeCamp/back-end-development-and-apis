# Curriculum test harness

## Promise handling

JavaScript AST alone cannot determine whether an arbitrary call returns a promise. Maintaining names such as `fetch`, helper methods, or package APIs would be incomplete and would silently miss newly added async functions.

Harness therefore does not statically classify promise-returning calls. Every lesson worker instead runs with `--unhandled-rejections=strict`, has an `error` listener, and remains alive for a configurable settle period after each test. A rejected floating promise from any function becomes a `crash` or `unhandledRejection` record. This preserves runtime behavior and requires no callee allowlist.

Resolved promises intentionally are not classified as floating. Without type contracts or instrumenting every call, doing so reliably is impossible in JavaScript. Instrumentation would alter test timing and side effects.

AST lint remains limited to mechanically provable authoring errors:

- parse failures
- unguarded dereferences of nullable lookup results

## Commands

```sh
npm test
npm run test:lint
npm run test:crash
node test/run.mjs --project build-a-web-server --lesson 15 --check crash
```
