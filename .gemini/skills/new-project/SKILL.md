---
name: new-project
description: Initializes a new freeCodeCamp project. It creates a Markdown file in `curriculum/locales/english/`, sets up a boilerplate directory, and appends project metadata to `config/projects.json` with an automatically determined ID.
---

# New Project Creation Workflow

This skill automates the setup of new freeCodeCamp curriculum projects.

## Procedural Workflow

### 1. Project Scoping
- **dashedName**: Determine a kebab-case name for the project (e.g., `learn-sql-by-building-a-database`).
- **isIntegrated**: Determine if it's a Certification Project (single lesson) or a step-by-step curriculum (multiple lessons).
- **Description & Goals**: Define the learning outcomes and a high-level description.

### 2. Initialization
Run the provided helper script to create the necessary files and update the configuration:
```bash
node <path-to-skill>/scripts/setup_project.cjs <dashed-name> "<project-description>" <true/false>
```

### 3. Content Generation
The script generates a base Markdown file. Your next task is to populate it according to the standards in `AGENTS.md`.

#### For Certification Projects (isIntegrated: true)
- The Markdown will include the `Certification Project` tag.
- Focus on defining clear user stories and functional tests in `## 0`.

#### For Curriculum Projects (isIntegrated: false)
- Start with `## 0` as a navigation or setup lesson.
- Use the `new-lesson` skill to incrementally build the curriculum.

### 4. Boilerplate Setup
- Ensure the newly created directory (e.g., `learn-sql-by-building-a-database/`) contains the necessary starting files (e.g., `package.json`, `.gitignore`, or base source files) for the learner to begin their work.

## Quality Standards
- **Consistency**: The `dashedName` must match the directory name and the `markdown` filename exactly.
- **Config Integrity**: Always use the script to update `projects.json` to ensure the `id` remains unique and sequential.
- **Style**: Refer to the project's root `AGENTS.md` for curriculum wording and testing patterns.
