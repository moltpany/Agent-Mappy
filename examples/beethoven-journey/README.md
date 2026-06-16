# Beethoven Journey Example

This case study mirrors the Mozart Journey example for a second composer, and is the dataset behind the standalone [Beethoven Journey](https://moltpany.github.io/beethoven-journey/) site. It demonstrates that the Agent-Mappy shape generalizes beyond a single subject:

- one JSON array of map story entries;
- city and precise-place coordinates (Bonn, Vienna, Heiligenstadt, Teplitz, …);
- year-based timeline data spanning 1782–1826;
- source labels, URLs, and summaries (mainly Beethoven-Haus Bonn and Wikipedia);
- optional place details and listening search links;
- collection ids that group works by Beethoven's core life stages (Bonn youth, arriving in Vienna, deafness & the Heiligenstadt Testament, the heroic period, the Immortal Beloved, guardianship of nephew Karl, the late period / Ninth).

It also ships a **bilingual overlay**, `beethoven-journey.en.json`: a JSON array
keyed by the same `id`s as the base file, carrying the English translation of
each entry's `context`, `meaning`, `source.summary`, `listening.note` and
`place` notes. This is the reference implementation of the
[Bilingual (i18n) Convention](../../README.md#bilingual-i18n-convention): the
base `beethoven-journey.json` stays in the authoring language and the overlay is
merged onto it by `id` when the page is shown in English, with graceful fallback
for any entry the overlay does not cover.

Validate it from the repository root:

```bash
node tests/validate.js
```

Like the Mozart example, the wording stays conservative for uncertain premieres, commissions, nicknames (e.g. "Moonlight", "Emperor"), and the identity of the Immortal Beloved. Agent-Mappy treats this as a second reusable example, confirming the map + timeline pattern is subject-agnostic.
