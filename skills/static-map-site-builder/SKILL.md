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

## Known Pitfalls (check these every build)

These are real issues seen in shipped Agent-Mappy-style sites. Handle them
explicitly rather than discovering them in production:

- **Overlapping markers at shared coordinates.** When several entries share the
  same `lat`/`lng` (e.g. multiple works in one city), their markers stack and
  only the top one is clickable — the rest become unreachable. Group entries by
  coordinate into one location marker (show the count) whose popup lists every
  entry at that point, each individually selectable. Prefer finer per-entry
  coordinates where the source supports them so fewer points collide.
- **Empty detail panel on first load.** If nothing is selected initially, the
  detail card sits on placeholder text ("pending…") and looks broken. Auto-select
  the first visible entry after the initial render (and after a filter change
  that hides the current selection), so the panel always shows real content.
- **Mobile filter overflow.** A `<select>` sizes to its longest option, so long
  labels (full names, bilingual strings) can push the control past the viewport.
  Give filter controls `min-width: 0` and `width: 100%` inside a flex container,
  and stack filters one per row on narrow screens.
- **Popups ignoring the theme.** Default Leaflet popups are light-on-white and
  jar in dark mode. Style the popup wrapper/tip to follow the page theme tokens.
- **Selected entry invisible on the map.** When an entry is chosen from a list,
  highlight its marker (size/colour) so the map and the detail stay in sync.

## Verification

Run:

```bash
node tests/validate.js
```

For UI projects, also open the page through a local static server and verify a narrow mobile viewport.
