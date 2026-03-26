---
name: create-project
description: Orchestrates the generation of an entire freeCodeCamp project (boilerplate, configuration, and all lessons) based on a high-level description of learning outcomes. It uses the workflows defined in `new-project` and `new-lesson` to ensure consistency and quality.
---

# Create Project Orchestration Workflow

This skill is designed to build a complete project from start to finish based on a set of learning outcomes.

## Procedural Workflow

### 1. Curriculum Design & Mapping
- **Analyze Outcomes**: Break down the provided learning outcomes into a sequence of small, incremental technical steps.
- **Draft Lesson Outlines**: Create a list of 5-10 (or more) lesson titles and brief descriptions of what each will teach.
  - **Reference**: See `curriculum/locales/english/learn-how-to-build-an-npm-module.md` for a complete step-by-step outline (44 lessons).
- **Review Against AGENTS.md**: Ensure the progression follows the project's pedagogical standards.

### 2. Project Initialization
Initialize the project structure using the `new-project` workflow:
- **Command**:
  ```bash
  node skills/new-project/scripts/setup_project.cjs <dashed-name> "<description>" <is-integrated>
  ```
- **Boilerplate**: Immediately create the essential files (e.g., `package.json`, `server.js`, `index.js`) in the new directory.
  - **Example**: See the starting state of `learn-how-to-build-an-npm-module/`.

### 3. Incremental Lesson Generation
Iteratively generate each lesson using the `new-lesson` logic:
- **Determine Next Lesson**: Use `node skills/new-lesson/scripts/get_next_lesson.cjs <file>`.
- **Generate & Append**: For each lesson in your outline:
  1. Write the instruction (`--description--`).
  2. Write the verification tests (`--tests--`) using `Tower` for AST analysis.
  3. Include any necessary seeds (`--seed--`) if the lesson requires a specific starting code state.
- **Complex Logic**: Refer to [Solana Curriculum](https://github.com/freeCodeCamp/solana-curriculum/tree/main/curriculum/locales/english) for examples of advanced multi-file tests.

### 4. Batch Processing (Optional)
If the project is large, you may generate 5-10 lessons in a single turn, but ensure each is appended sequentially and correctly numbered.

### 5. Validation & Final Review
- **Consistency Check**: Verify that the tests correctly identify the code described in the instructions.
- **Style Check**: Ensure the entire project adheres to the tone and formatting defined in `AGENTS.md`.

## References & Examples
- **Finished Certification Project**: `curriculum/locales/english/build-a-timestamp-microservice.md`.
- **Finished Step-by-Step Project**: `curriculum/locales/english/learn-how-to-build-an-npm-module.md`.
- **Testing Logic Reference**: [test-utils.js](https://raw.githubusercontent.com/freeCodeCamp/freeCodeCampOS/1ebf47e67a56986a7fc4afff17f3276c1465f606/.freeCodeCamp/tooling/test-utils.js).

## Quality Standards
- **Manageable Increments**: Each lesson must focus on a single, isolated change.
- **Robust Tests**: Tests should never rely on brittle regex if AST analysis is possible.
- **Functional Integrity**: The final state of the project (after the last lesson) must be a fully working application that meets all learning outcomes.
