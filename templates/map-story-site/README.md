# Map Story Site Template

A generic static map-story site built with Leaflet + OpenStreetMap.
Derived from the Mozart Journey case study; all Mozart-specific content has been removed.

## Quick start

```bash
# From the template directory:
python -m http.server 8000
# Then open http://localhost:8000
```

Do **not** open `index.html` directly from the filesystem (`file://`). Fetch is
blocked in that mode. The `data/story-data.js` file provides a single-entry
fallback so the page still renders, but full data requires an HTTP server.

## Customisation steps

### 1. Edit `data/story-config.js`

This is the only file you need to change for most projects.

| Field | What to change |
| --- | --- |
| `dataUrl` | Path to your JSON data file (default: `data/story-data.json`) |
| `dataVar` | Global variable name in the fallback `.js` file |
| `themeKey` | localStorage key — rename to avoid collisions with other sites |
| `birthYear` | Set to a year (e.g. `1756`) to show age labels; leave `null` to hide |
| `collections` | Add objects `{ id, title, description }` matching your data |
| `periods` | Add `{ value: "YYYY-YYYY", label: "…" }` objects or leave empty to hide the filter |
| `ui.*` | All visible strings: page title, hero copy, nav labels, filter labels, etc. |
| `ui.heroBgImage` | URL of a hero background image, or `""` for the default gradient |
| `ui.lang` | BCP-47 language tag, e.g. `"en"`, `"zh-TW"`, `"de"` |

### 2. Replace `data/story-data.js` (and `data/story-data.json`)

Replace the single example entry with your real data. Each entry must conform
to the Agent-Mappy schema (`schemas/map-story.schema.json`).

Required fields per entry:
`id`, `year`, `city`, `country`, `lat`, `lng`, `work`, `catalogue`, `genre`,
`context`, `meaning`, `source` (`label`, `url`, `summary`).

Optional fields: `collections` (array of collection ids), `place`, `listening`.

### 3. Adjust brand colors (optional)

Open `styles.css` and search for **BRAND COLOR VARIABLES**.
Change `--accent` and `--accent-dark` to match your palette.

### 4. Set the `<html lang>` attribute

Set `STORY_CONFIG.ui.lang` in `story-config.js`. The inline theme script and
`script.js` both apply it to `<html lang="…">` on load.

## File structure

```text
templates/map-story-site/
├── index.html              HTML shell — edit text via story-config.js, not here
├── styles.css              Styles — change brand colors at the top
├── script.js               App logic — reads all config from story-config.js
├── data/
│   ├── story-config.js     PRIMARY customisation file
│   └── story-data.js       Fallback data for file:// access
└── README.md               This file
```

## Serving in production

The site is fully static. Copy the directory to any static host
(GitHub Pages, Netlify, Vercel, a plain nginx server, etc.).
No build step is required.

## Notes

- Dark mode is handled via `data-theme` on `<html>`. The choice persists in
  `localStorage` under the key set in `STORY_CONFIG.themeKey`.
- Map tiles load from `tile.openstreetmap.org`. The timeline and detail card
  remain usable when offline.
- All text visible in the browser can be changed through `story-config.js`
  without touching `index.html` or `script.js`.
