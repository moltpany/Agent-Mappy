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

## Source Priority Ladder

When choosing a source for a factual claim, prefer higher tiers and fall back
only when a higher tier has no stable, linkable page for that specific entry:

1. **Official first-party institution** — the subject's official portal,
   foundation, museum, archive, or (for a performance) the venue's own page.
2. **Authoritative research database** — a recognized scholarly catalogue or
   research network for the subject.
3. **Authoritative rights-holder / publisher** — the original or critical-edition
   publisher's work page (often the canonical primary source for a work).
4. **Reputable encyclopedia / score archive** — a stable, well-edited general
   reference, used as a starting point or as a cross-check.

Record honestly which tier a source belongs to. If only a lower tier is
available, say so in the audit notes rather than implying a stronger source.

## Copyright Red Line

Take **citations, not reproductions**. From any source, extract the *facts*
(dates, places, premieres, dedications, the URL) and write your own concise
summary. Do not paste blocks of a source's prose into the dataset; quote at
most a short attributed phrase. This protects both copyright and the
no-fabrication stance.

## Place Certainty Scale

When adding a `place`, set `place.certainty` with an operational rule and always
explain the choice in `place.note`:

- **high** — a documented, specific location: a premiere venue, a recorded
  address, a building with primary-source evidence. Coordinates point at that
  building.
- **medium** — the subject's landmark or residence in the right city
  (e.g. a composer's house museum) that is real and strongly associated, but
  not the exact room where the event happened. Note this limitation.
- **low** — only the city is known. Anchor to one verifiable city-level landmark
  and say in the note that this is a city-level node.

Never invent coordinates to reach a higher certainty. A verified city-level
point is better than a precise-looking guess.

## Entry Workflow

1. Identify the existing schema and collection ids.
2. Gather sources for the entry, climbing the source priority ladder.
3. Draft the entry with required fields from `schemas/map-story.schema.json`.
4. Add `place` only when the source supports the detail; set `place.certainty`
   by the scale above and justify it in `place.note`.
5. Cite generously: keep the primary `source`, and when a second source
   meaningfully cross-checks or strengthens the entry, add an optional
   `sources` array (primary first, then secondary). Each item keeps
   `label` + `url` + `summary`.
6. Add `listening` or media links only when they are search links or explicitly allowed by the project.
7. Validate JSON syntax and required fields.
8. Update any worklist or audit file used by the project, recording the source
   tier and any certainty fallbacks.
9. **If the story is bilingual, keep the overlay in lockstep.** When you add or
   edit an entry in the base data, add or update the matching `id` in the
   `data/<story>.en.json` overlay (translate `context`, `meaning`,
   `source.summary`, `listening.note`, and any `place.kind` / `certainty` /
   `note`) and regenerate the `.en.js` mirror. The overlay's id set must stay a
   subset of the base ids; never invent an overlay id with no base entry. See
   the [Bilingual (i18n) Convention](../../README.md#bilingual-i18n-convention).
   When translating, take *citations, not reproductions* — translate the facts
   into your own concise wording and preserve every hedge.

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
