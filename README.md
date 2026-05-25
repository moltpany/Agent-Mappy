# Agent-Mappy

> Source-grounded map storytelling with agent-maintained data, timelines, and static publishing.

Agent-Mappy is a lightweight framework for turning researched places, dates, people, works, sources, and personal collections into publishable interactive map stories. It starts from the Mozart Journey case study and generalizes the pattern into reusable schemas and Codex/OpenClaw-style skills.

## What This Is

Agent-Mappy is not a hosted map platform. It is a repo-shaped workflow for agents and humans who want to build small, source-aware map narratives:

- Plan the story scope before collecting data.
- Write entries with conservative source-grounded claims.
- Store entries in a machine-readable JSON schema.
- Build or maintain a static map site from that data.
- Keep examples small enough for GitHub Pages and local review.

## Core Concepts

| Concept | Purpose |
| --- | --- |
| Map story | A self-contained narrative dataset with entries, sources, and collections |
| Entry | One place-time-work node on the map and timeline |
| Source | A compact citation label, URL, and summary supporting the entry |
| Collection | A user-facing grouping such as favorites, playlists, trips, or themes |
| Static site | A no-backend HTML/CSS/JS presentation layer generated or maintained from data |

## Core Skills

| Skill | Status | What It Does |
| --- | --- | --- |
| `map-story-planner` | Ready | Defines the story scope, audience, map units, and evidence rules |
| `source-grounded-entry-writer` | Ready | Drafts and revises entries without inventing facts |
| `static-map-site-builder` | Ready | Builds or adapts a small static Leaflet-style map site from a valid dataset |

## Repository Structure

```text
.
├── README.md
├── agent-registry.json
├── schemas/
│   └── map-story.schema.json
├── examples/
│   └── mozart-journey/
│       ├── README.md
│       └── mozart-journey.json
├── skills/
│   ├── map-story-planner/
│   │   └── SKILL.md
│   ├── source-grounded-entry-writer/
│   │   └── SKILL.md
│   └── static-map-site-builder/
│       └── SKILL.md
├── tests/
│   └── validate.js
├── SYNC.md
└── LICENSE
```

## Quick Start

Validate the framework files:

```bash
node tests/validate.js
```

Use the Mozart example as the first case study:

```text
examples/mozart-journey/mozart-journey.json
```

The data file is intentionally compatible with the original Mozart Journey static page pattern: one JSON array of entries with coordinates, dates, source fields, optional place details, optional listening links, and collection ids.

## How Agents Should Use This

1. Use `map-story-planner` before creating a new map story.
2. Use `source-grounded-entry-writer` when adding or revising entries.
3. Validate entries against `schemas/map-story.schema.json`.
4. Use `static-map-site-builder` to produce or adapt a static site.
5. Run `node tests/validate.js` before committing.

## Roadmap

| Module | Status | Description |
| --- | --- | --- |
| Framework README | Ready | Project positioning and usage |
| Map story schema | Ready | Shared JSON contract for entries |
| Mozart Journey example | Ready | First case study migrated from the portfolio site |
| Static site template | Next | Generic HTML/CSS/JS version of the Mozart Journey interface |
| Source audit helper | Next | Optional script to report missing or weak source fields |
| Multi-story examples | Later | Writers, trips, exhibitions, research fieldwork |

## License

MIT.
