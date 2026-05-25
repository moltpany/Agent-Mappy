/**
 * story-data.js — Fallback data for file:// access.
 *
 * When the page is opened directly from the filesystem (file:// protocol),
 * fetch() is blocked and the app falls back to this global variable.
 *
 * Replace the example entry below with your real data, or point
 * story-config.js → dataUrl at a JSON file and serve via a local server.
 *
 * Variable name must match story-config.js → dataVar (default: MAP_STORY_DATA).
 */

// Fallback for file:// access. Replace with your actual data.
window.MAP_STORY_DATA = [
  {
    "id": "example-vienna-1800",
    "year": 1800,
    "city": "Vienna",
    "country": "Austria",
    "lat": 48.2082,
    "lng": 16.3738,
    "work": "Example Symphony",
    "catalogue": "Op. 1",
    "genre": "Symphony",
    "context": "Replace with source-grounded context about when and why this work was created.",
    "meaning": "Replace with source-grounded meaning about the significance of this work or place.",
    "source": {
      "label": "Example Source",
      "url": "https://example.com",
      "summary": "Replace with a real source summary that supports the claims above."
    }
  }
];
