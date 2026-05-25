---
name: static-map-site-builder
description: Build or adapt a no-backend static map story site from an Agent-Mappy JSON dataset. Use for GitHub Pages, Leaflet/OpenStreetMap map views, timelines, detail cards, search, collection navigation, and mobile-friendly static presentation.
---

# Static Map Site Builder

Use this skill to build a small static site from an Agent-Mappy dataset.

## Constraints

- Keep the site static: HTML, CSS, JavaScript, JSON.
- Do not add a backend, database, analytics, telemetry, or unnecessary network calls.
- Leaflet CDN and OpenStreetMap tiles are acceptable when the project allows external map resources.
- Preserve direct JSON loading and provide a fallback when local `file://` access is required.
- Design for mobile first: map, timeline, detail, search, and collection navigation must remain usable on narrow screens.

## Expected UI

- Map with markers and popup detail links.
- Timeline with selectable entries.
- Detail card with context, meaning, source, place details, and collection links.
- Search box that composes with filters.
- Collection navigation for long lists.
- Clear empty and loading states.

## Build Workflow

1. Validate the dataset.
2. Create or adapt `index.html`, `styles.css`, `script.js`, and `data/`.
3. Keep data-driven rendering separate from static layout.
4. Avoid automatic scrolling that prevents users from staying on map or timeline views.
5. Add tests for filtering, search, collection links, and data shape.
6. Run validation and manually inspect mobile layout in a browser.

## Verification

Run:

```bash
node tests/validate.js
```

For UI projects, also open the page through a local static server and verify a narrow mobile viewport.
