/**
 * story-config.js — Customization entry point for map-story-site template.
 *
 * Copy this file to your project, then edit the values below.
 * All display strings are in the `ui` block so you can localise
 * or rebrand without touching index.html or script.js.
 *
 * BRAND COLORS: See styles.css and search for "Brand color variables"
 * to find the two CSS custom properties you most likely want to change.
 */

window.STORY_CONFIG = {

  // ─── Data ──────────────────────────────────────────────────────────────────

  /** URL of the JSON data file fetched at runtime. */
  dataUrl: "data/story-data.json",

  /**
   * Global variable name used as a file:// fallback.
   * Must match the variable assigned in data/story-data.js.
   */
  dataVar: "MAP_STORY_DATA",

  // ─── Persistence ───────────────────────────────────────────────────────────

  /** localStorage key used to persist the light/dark theme choice. */
  themeKey: "map-story-theme",

  // ─── Optional features ─────────────────────────────────────────────────────

  /**
   * Set to the subject's birth year (integer) to show age labels next to
   * years in the timeline and detail card.
   * Leave null to disable age display.
   *
   * Example: 1756  →  "1791 · age 35"
   */
  birthYear: null,

  /**
   * Collections define thematic or curated groupings that entries can
   * belong to. Each entry may list zero or more collection ids in its
   * `collections` array.
   *
   * Shape: { id: string, title: string, description: string }
   *
   * Example:
   *   { id: "favorites", title: "My Favorites", description: "Personal picks." }
   */
  collections: [],

  /**
   * Period filter options shown in the period <select>.
   * Leave empty to hide the period filter entirely.
   *
   * Shape: { value: string, label: string }
   * The value must be in "YYYY-YYYY" format for range matching.
   *
   * Example:
   *   { value: "1800-1850", label: "1800–1850 Early" }
   */
  periods: [],

  // ─── UI strings ────────────────────────────────────────────────────────────

  ui: {
    /** BCP-47 language tag written to <html lang="...">. */
    lang: "en",

    /** Browser tab title. */
    pageTitle: "Map Story",

    // Hero
    heroEyebrow: "Place · Time · Story",
    heroTitle: "Map Story",
    heroCopy: "Explore places, works, and events on an interactive map.",
    /**
     * Optional hero background image URL.
     * Leave as empty string for a plain CSS gradient.
     */
    heroBgImage: "",

    // Navigation
    navBrand: "Map Story",
    navCollections: "Collections",
    navTimeline: "Timeline",
    navDetail: "Detail",
    navSources: "Sources",

    // Theme toggle
    themeLight: "Light",
    themeDark: "Dark",
    themeToLight: "Switch to light mode",
    themeToDark: "Switch to dark mode",

    // Filter section
    filterTitle: "Explore by city, period, and genre",
    filterSearch: "Search",
    filterSearchPlaceholder: "Work / city / genre",
    filterCity: "City",
    filterPeriod: "Period",
    filterGenre: "Genre",
    filterAllCities: "All cities",
    filterAllPeriods: "All periods",
    filterAllGenres: "All genres",

    // Map panel
    mapKicker: "Map",
    mapTitle: "Locations",

    // Timeline panel
    timelineKicker: "Timeline",
    timelineTitle: "Works & Events",

    // Detail section
    viewDetailBtn: "View detail",
    detailKicker: "Detail",
    detailDefault: "Select a location or year",
    detailDefaultMeta: "Click a map marker or timeline item to see details here.",
    detailContextHeading: "Context",
    detailMeaningHeading: "Meaning",
    viewMapBtn: "View on map",
    viewSourcePrefix: "View source: ",
    viewPlaceSourcePrefix: "View place source: ",
    viewImageSourcePrefix: "Image source: ",
    imageLoadError: "Image unavailable — see image source link.",
    popupDetailBtn: "View detail",

    // Collections section
    collectionsKicker: "Collections",
    collectionsTitle: "Grouped by theme or curation",

    // Sources section
    sourcesKicker: "Sources",
    sourcesTitle: "References",
    sourcesPolicy:
      "Each entry includes a source label and URL. " +
      "Uncertain or approximate claims use conservative phrasing.",

    // Footer / warnings
    footerNote:
      "Static site · Leaflet + OpenStreetMap · Data in data/story-data.json",
    mapWarning:
      "Map tiles require network access; timeline and detail remain readable offline.",
    loadError:
      "Failed to load data. Open via a local static server: python -m http.server 8000",
    noResults: "No matching locations",
  },
};
