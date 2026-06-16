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
| Bilingual overlay | An optional `*.en.json` file of per-entry translations, keyed by `id`, merged onto the base data at runtime |

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
│   ├── mozart-journey/
│   │   ├── README.md
│   │   └── mozart-journey.json
│   └── beethoven-journey/
│       ├── README.md
│       ├── beethoven-journey.json
│       └── beethoven-journey.en.json   # English overlay, keyed by id
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

Use the bundled case studies as references:

```text
examples/mozart-journey/mozart-journey.json
examples/beethoven-journey/beethoven-journey.json
```

The data file is intentionally compatible with the original Mozart Journey static page pattern: one JSON array of entries with coordinates, dates, source fields, optional place details, optional listening links, and collection ids.

## How Agents Should Use This

1. Use `map-story-planner` before creating a new map story.
2. Use `source-grounded-entry-writer` when adding or revising entries.
3. Validate entries against `schemas/map-story.schema.json`.
4. Use `static-map-site-builder` to produce or adapt a static site.
5. Run `node tests/validate.js` before committing.

## Bilingual (i18n) Convention

Map stories are often authored in one language but read internationally. The
proven pattern (shipped in Mozart Journey and Beethoven Journey) keeps one
authoritative dataset and layers translations on top, so nothing is duplicated
or forked:

- **One source of truth.** The base `data/<story>.json` stays in the authoring
  language and remains the only place facts, ids, coordinates and sources live.
- **UI strings** (nav, headings, buttons, collection names, dynamic labels)
  live in the site's `script.js` as a small `t(key)` dictionary per language.
- **Per-entry prose** (the translatable fields: `context`, `meaning`,
  `source.summary`, `listening.note`, and `place.kind` / `place.certainty` /
  `place.note`) lives in an **English overlay** `data/<story>.en.json`: a JSON
  array of objects keyed by the same `id` as the base entry, carrying only the
  translated fields. Mirror it to `data/<story>.en.js`
  (`window.<STORY>_DATA_EN = …`) for `file://` fallback, exactly like the base.
- **Merge at runtime, fall back gracefully.** When the page is in English, look
  up each entry's overlay by `id` and shallow-merge the translated fields over
  the base entry. If an `id` is missing from the overlay, the base-language text
  shows for that one entry — never an error.

**Maintenance contract:** the overlay's `id` set must be a *subset* of the base
ids (every overlay entry maps to a real base entry; no orphans). Whenever you
**add or edit a work** in the base data, add or update the matching `id` in the
overlay. `tests/validate.js` enforces the subset rule for any `*.en.json` that
sits next to an example. See `examples/beethoven-journey/beethoven-journey.en.json`
for a complete overlay.

## Roadmap

| Module | Status | Description |
| --- | --- | --- |
| Framework README | Ready | Project positioning and usage |
| Map story schema | Ready | Shared JSON contract for entries (incl. optional `sources` array) |
| Sourcing & certainty method | Ready | Source priority ladder, copyright red line, place-certainty scale |
| Build pitfalls checklist | Ready | Known map/detail/mobile issues folded back from a downstream work |
| Mozart Journey example | Ready | First case study migrated from the portfolio site |
| Beethoven Journey example | Ready | Second case study, confirming the pattern is subject-agnostic |
| Bilingual overlay convention | Ready | Per-entry `*.en.json` translations keyed by id, merged at runtime with fallback |
| Static site template | Next | Generic HTML/CSS/JS version of the Mozart Journey interface |
| Source audit helper | Next | Optional script to report missing or weak source fields |
| Multi-story examples | Later | Writers, trips, exhibitions, research fieldwork |

> Some of these were learned from a downstream Agent-Mappy-style work (a music
> diary) and folded back into the framework — the molting loop in practice:
> the framework improves from what its derived works discover.

## License

MIT.
