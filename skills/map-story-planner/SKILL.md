---
name: map-story-planner
description: Plan a source-grounded Agent-Mappy map story before data writing or site building. Use when the user wants to start a map narrative, turn a topic into an interactive map, define entries/collections/sources, or decide whether a topic fits Agent-Mappy.
---

# Map Story Planner

Use this skill before creating a new Agent-Mappy dataset or static site.

## Workflow

1. Define the subject, audience, and publishing target.
2. Choose the entry unit: person-place event, work-place event, trip stop, site visit, or research location.
3. Decide the required fields for each entry. Keep the base Agent-Mappy fields unless the project needs a justified extension.
4. Define the source policy: accepted sources, uncertainty wording, and fields that must never be invented.
5. Define collection groups for user navigation: themes, playlists, trips, periods, or personal favorites.
6. Decide the first case-study slice small enough to complete and verify.
7. Produce a concise implementation checklist.

## Required Design Decisions

- **Map scope:** geographic area and expected number of nodes.
- **Timeline scope:** years, dates, ranges, or unordered places.
- **Narrative scope:** what the detail card should explain.
- **Evidence scope:** what counts as a reliable source.
- **Uncertainty rule:** how to phrase approximate places, disputed dates, and inferred meanings.
- **Static output:** GitHub Pages, local HTML, or template-only data.

## Output Format

Return:

```markdown
## Agent-Mappy Plan

Subject:
Audience:
Entry unit:
Map/timeline scope:
Required fields:
Collection groups:
Source policy:
First slice:
Validation:
```

Keep the plan small. Prefer a working first slice over a broad platform design.
