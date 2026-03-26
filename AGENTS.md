# Agent Context: freeCodeCamp Curriculum & Tooling

This project manages freeCodeCamp's back-end development curriculum and the tooling used to verify learner progress.

## Core Concepts
- **Markdown-Based Curriculum**: Lessons are defined in Markdown files (`curriculum/locales/english/`) using custom tags:
  - `--description--`: Instructional text for the learner.
  - `--tests--`: JavaScript assertions using `chai` and project-specific `__helpers`.
  - `--seed--`: Initial file states and shell commands for lesson setup.
- **Project Types**:
  - **Integrated**: Single-lesson certification projects focused on final functionality.
  - **Non-integrated**: Multi-lesson step-by-step guides for incremental learning.
- **Testing Infrastructure**: Uses `__helpers` for file system checks, terminal history analysis, and AST-based code verification (via `Tower`).
