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

## Template

A ready-to-use starting point lives at `templates/map-story-site/`.
It is a generalised version of the Mozart Journey interface with all
project-specific content removed.

### Starting from the template

1. Copy `templates/map-story-site/` to your project directory.
2. Open `data/story-config.js` — this is the **only** file you normally need to edit:
   - Set `dataUrl` to point at your JSON data file.
   - Set `dataVar` to match the global variable in your fallback `.js` file.
   - Set `themeKey` to a project-unique localStorage key.
   - Set `birthYear` to a year (integer) if you want age labels, or leave `null`.
   - Populate `collections` with `{ id, title, description }` objects matching your data.
   - Populate `periods` with `{ value: "YYYY-YYYY", label }` objects, or leave empty to hide the period filter.
   - Edit all `ui.*` strings to match your language and branding.
3. Replace `data/story-data.js` (and provide `data/story-data.json`) with your real dataset.
4. Open `styles.css` and update the two brand-color variables at the top
   (search for **BRAND COLOR VARIABLES**).
5. Serve via a local static server to verify:
   ```bash
   python -m http.server 8000
   ```

### Fields that require attention

| Field in story-config.js | Notes |
| --- | --- |
| `dataUrl` | Must resolve from the site root |
| `themeKey` | Use a unique key to avoid localStorage collisions |
| `birthYear` | Set only when age display is meaningful for your subject |
| `collections` | Must match the `collections` arrays in your data entries |
| `periods` | Leave `[]` to hide the period filter entirely |
| `ui.lang` | Written to `<html lang>` — use a valid BCP-47 tag |
| `ui.heroBgImage` | Accepts any CSS-valid image URL; leave `""` for plain gradient |

## Build Workflow

1. Validate the dataset.
2. Create or adapt `index.html`, `styles.css`, `script.js`, and `data/`.
   Or copy `templates/map-story-site/` and customise `data/story-config.js`.
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
