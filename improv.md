# Curriculum Improvements & Bug Report

This document summarizes identified bugs, inconsistencies, and suggested improvements for the Back-End Development and APIs curriculum.

---

## Global Suggestions

- **Port Consistency**: Port numbers vary across projects (3000, 3001, 8000, 9000). While not strictly a bug, standardized port ranges for different types of projects (e.g., 3000 for standard servers, 8000 for microservices) could reduce learner confusion.
- **Test Feedback**: Many tests provide generic failure messages. Enhancing these with more descriptive "Hints" or specific failure reasons would improve the learner experience.
- **Node.js --watch**: In projects requiring frequent restarts (e.g., `learn-nodejs-by-building-a-web-server`), mentioning the `--watch` flag (available in Node.js 18+) could be a modern improvement, though manual restarts are good for teaching the lifecycle.

---

## Project-Specific Reports

### 1. Build a Chat App (`build-a-chat-app.md`)

- **[IMPROVEMENT] Client-Side Validation**: The tests focus entirely on the server. Adding a test to ensure `public/script.js` uses `encodeURIComponent` for the username (as hinted in the description) would be beneficial.

### 2. Build a Data Sanitizer (`build-a-data-sanitizer.md`)

- **[IMPROVEMENT] Robustness**: The `inputCleaner` test uses a simple regex-style HTML stripper. Suggesting a library like `dompurify` or `sanitize-html` in a future iteration would teach production-ready habits.

### 3. Build a Personal Profile App (`build-a-personal-profile-app.md`)

### 4. Build a Timestamp Microservice (`build-a-timestamp-microservice.md`)

### 5. Learn Error Handling in Express by Building a Bank API (`learn-error-handling-in-express-by-building-a-bank-api.md`)

- **[IMPROVEMENT] High Quality**: This project is excellently structured and uses `Tower` for AST checks effectively. No major bugs found.

### 6. Learn Express by Building a Random Joke App (`learn-express-by-building-a-random-joke-app.md`)

- **[IMPROVEMENT] Seed Consistency**: Lesson 3 seed provides the `jokes` array, but Lesson 2 does not. If a learner resets at Lesson 3, they get the data, but Lesson 2 is empty. This is generally fine but worth checking for "reset" consistency.

### 7. Learn Express by Building a Weather Service API (`learn-express-by-building-a-weather-service-api.md`)

- **[IMPROVEMENT] Proxy Reliability**: The tests rely on `https://weather-proxy.freecodecamp.rocks`. A fallback or local mock would make tests more resilient to network issues.

### 8. Learn How to Build an NPM Module (`learn-how-to-build-an-npm-module.md`)

- **[BUG] Fragile REPL Test**: Lesson 6 checks `temp.match(/description: (.*)/)[1]`. The comment admits typed values aren't visible. This test is highly dependent on the internal terminal state and might fail across different environments or versions of npm.
- **[INCONSISTENCY] Lesson 43**: Using `Type done in the terminal` as a finishing trigger is a bit of a workaround. A more integrated "Finish" step in freeCodeCampOS would be cleaner.

### 9. Learn Node.js by Building a Web Server (`learn-nodejs-by-building-a-web-server.md`)

- **[BUG] Lesson 52 Negative Test**: The test checks if the server is NOT listening (`assert.isFalse(__isListening)`). This passes if the server was never started or manually stopped, even if the learner hasn't actually performed the transition to ESM that causes the expected failure. A more robust check for the specific error message in the terminal output would be better.
- **[IMPROVEMENT] Nested Callbacks**: Lesson 40 introduces deeply nested `readFile` calls (callback hell). This is a perfect opportunity to introduce a "Bonus" or future lesson on using `fs/promises` to flatten the logic.

### 10. Learn Node.js Common Modules (`learn-nodejs-common-modules.md`)

- **[IMPROVEMENT] Stream Chunks**: The stream lesson (26) could be improved by using a larger file to demonstrate that data actually comes in multiple chunks, as `poem.txt` is likely small enough to fit in a single chunk.

### 11. Learn Node.js REPL (`learn-nodejs-repl.md`)

- **[IMPROVEMENT] Interactive Context**: The tests for interactive REPL sessions are clever but can be tricky if the learner types extra characters or comments. Adding a hint to "Avoid extra comments in the REPL" would help.

### 12. Learn WebSockets by Building a Resource Monitor (`learn-websockets-by-building-a-resource-monitor.md`)

- **[BUG] Port Conflict**: Uses port 3000, which is also used by many other labs. If a learner has another lab server running, this will fail.
- **[IMPROVEMENT] Security**: A quick mention that `ws://` is insecure and `wss://` should be used in production would be a valuable security note.
