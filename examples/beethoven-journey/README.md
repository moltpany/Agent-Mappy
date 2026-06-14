# Beethoven Journey Example

This case study mirrors the Mozart Journey example for a second composer, and is the dataset behind the standalone [Beethoven Journey](https://moltpany.github.io/beethoven-journey/) site. It demonstrates that the Agent-Mappy shape generalizes beyond a single subject:

- one JSON array of map story entries;
- city and precise-place coordinates (Bonn, Vienna, Heiligenstadt, Teplitz, …);
- year-based timeline data spanning 1782–1826;
- source labels, URLs, and summaries (mainly Beethoven-Haus Bonn and Wikipedia);
- optional place details and listening search links;
- collection ids that group works by Beethoven's core life stages (Bonn youth, arriving in Vienna, deafness & the Heiligenstadt Testament, the heroic period, the Immortal Beloved, guardianship of nephew Karl, the late period / Ninth).

Validate it from the repository root:

```bash
node tests/validate.js
```

Like the Mozart example, the wording stays conservative for uncertain premieres, commissions, nicknames (e.g. "Moonlight", "Emperor"), and the identity of the Immortal Beloved. Agent-Mappy treats this as a second reusable example, confirming the map + timeline pattern is subject-agnostic.
