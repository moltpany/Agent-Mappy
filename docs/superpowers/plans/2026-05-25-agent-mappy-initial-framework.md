# Agent-Mappy Initial Framework Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Initialize Agent-Mappy as a public source-grounded map storytelling framework with reusable skills, schema, validation, and the Mozart Journey case study.

**Architecture:** Keep the repository framework-first, similar to Agent-HR: docs at the root, machine-readable registry, skill folders, schema folder, example data, and a lightweight validation script. Avoid a frontend template in the first commit so the concept and data contract are clear before UI extraction.

**Tech Stack:** Static Markdown, JSON, JSON Schema, Node.js validation script, GitHub repository.

---

### Task 1: Repository Skeleton

**Files:**
- Create: `README.md`
- Create: `SYNC.md`
- Create: `.gitignore`
- Create: `LICENSE`

- [x] Add public project positioning, sync notes, ignored local files, and MIT license.

### Task 2: Machine-Readable Framework Contract

**Files:**
- Create: `agent-registry.json`
- Create: `schemas/map-story.schema.json`

- [x] Define starter skills, example metadata, discovery keywords, and the required map story entry fields.

### Task 3: Mozart Journey Case Study

**Files:**
- Create: `examples/mozart-journey/README.md`
- Create: `examples/mozart-journey/mozart-journey.json`

- [x] Copy the public Mozart Journey data as Agent-Mappy's first example dataset.

### Task 4: Starter Skills

**Files:**
- Create: `skills/map-story-planner/SKILL.md`
- Create: `skills/source-grounded-entry-writer/SKILL.md`
- Create: `skills/static-map-site-builder/SKILL.md`

- [x] Add concise frontmatter and workflows for planning, source-grounded writing, and static site building.

### Task 5: Validation

**Files:**
- Create: `tests/validate.js`

- [x] Add a dependency-free Node validation script for registry files, schema shape, example data shape, required files, and skill frontmatter.

### Task 6: Publish

**Files:**
- All created files.

- [x] Run `node tests/validate.js`.
- [ ] Commit as `init: Agent-Mappy framework`.
- [ ] Push `main` to `https://github.com/moltpany/Agent-Mappy.git` through the local proxy if direct GitHub access fails.
