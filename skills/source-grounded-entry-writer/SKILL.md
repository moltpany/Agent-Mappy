---
name: source-grounded-entry-writer
description: Write, revise, or fact-check Agent-Mappy map story entries with reliable sources, conservative claims, coordinates, uncertainty notes, and collection metadata. Use when adding entries to a map story JSON file or refining existing nodes.
---

# Source-Grounded Entry Writer

Use this skill when creating or changing map story entries.

## Rules

- Do not invent facts, dates, places, commissions, performances, coordinates, or meanings.
- Use reliable sources before adding factual claims.
- Prefer city-level wording when precise residences, venues, or rooms are uncertain.
- Preserve uncertainty in `place.certainty` and `place.note`.
- Keep `source.label`, `source.url`, and `source.summary` compact and useful.
- Keep user-facing copy in the story's language.
- Add collection ids only when the grouping is intentional.

## Entry Workflow

1. Identify the existing schema and collection ids.
2. Gather sources for the entry.
3. Draft the entry with required fields from `schemas/map-story.schema.json`.
4. Add `place` only when the source supports the detail.
5. Add `listening` or media links only when they are search links or explicitly allowed by the project.
6. Validate JSON syntax and required fields.
7. Update any worklist or audit file used by the project.

## Wording Guidance

Use conservative phrases when needed:

- "commonly associated with"
- "usually dated to"
- "the exact venue is not confirmed"
- "the page treats this as a city-level node"
- "this interpretation is used as narrative framing, not a documented intention"

Avoid unsupported phrases:

- "was composed in this exact room" without a source
- "was written for this person" without a source
- "proves that" for interpretive meaning
- precise coordinates for uncertain locations

## Validation

Before completion, run the project's validation command. For this repository:

```bash
node tests/validate.js
```
