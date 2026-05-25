(function () {
  "use strict";

  // ─── Configuration ─────────────────────────────────────────────────────────
  var CONFIG     = window.STORY_CONFIG || {};
  var UI         = CONFIG.ui           || {};
  var DATA_URL   = CONFIG.dataUrl      || "data/story-data.json";
  var DATA_VAR   = CONFIG.dataVar      || "MAP_STORY_DATA";
  var THEME_KEY  = CONFIG.themeKey     || "map-story-theme";
  var BIRTH_YEAR = (typeof CONFIG.birthYear === "number" && isFinite(CONFIG.birthYear))
                    ? CONFIG.birthYear : null;
  var COLLECTIONS = Array.isArray(CONFIG.collections) ? CONFIG.collections : [];
  var PERIODS     = Array.isArray(CONFIG.periods)     ? CONFIG.periods     : [];

  // UI string helpers — fall back to sensible English defaults
  function ui(key, fallback) {
    return (UI[key] != null) ? UI[key] : (fallback !== undefined ? fallback : key);
  }

  // ─── App state ─────────────────────────────────────────────────────────────
  var state = {
    entries:    [],
    filtered:   [],
    selectedId: null,
    map:        null,
    markers:    new Map(),
  };

  // ─── DOM helpers ───────────────────────────────────────────────────────────
  function $(id) { return document.getElementById(id); }
  function setText(id, text) { var el = $(id); if (el) el.textContent = text; }

  // ─── Filtering ─────────────────────────────────────────────────────────────
  function parsePeriod(period) {
    if (!period || period === "all") return null;
    var parts = period.split("-").map(function (p) { return parseInt(p, 10); });
    if (parts.length !== 2 || parts.some(isNaN)) return null;
    return { start: parts[0], end: parts[1] };
  }

  function filterEntries(entries, filters) {
    var period = parsePeriod(filters.period);
    var query  = String(filters.query || "").trim().toLowerCase();
    return entries.filter(function (entry) {
      var cityMatches   = !filters.city   || filters.city   === "all" || entry.city   === filters.city;
      var genreMatches  = !filters.genre  || filters.genre  === "all" || entry.genre  === filters.genre;
      var periodMatches = !period || (entry.year >= period.start && entry.year <= period.end);
      var queryMatches  = !query  || [entry.work, entry.catalogue, entry.city, entry.country, entry.genre, entry.year]
                            .filter(Boolean).join(" ").toLowerCase().includes(query);
      return cityMatches && genreMatches && periodMatches && queryMatches;
    });
  }

  function getFilterOptions(entries, key) {
    return Array.from(new Set(entries.map(function (e) { return e[key]; }).filter(Boolean))).sort(
      function (a, b) { return String(a).localeCompare(String(b)); }
    );
  }

  function byYearThenCity(a, b) {
    return a.year - b.year || String(a.city).localeCompare(String(b.city));
  }

  // ─── Coordinates ───────────────────────────────────────────────────────────
  function getEntryCoordinates(entry) {
    if (entry.place && typeof entry.place.lat === "number" && typeof entry.place.lng === "number") {
      return [entry.place.lat, entry.place.lng];
    }
    return [entry.lat, entry.lng];
  }

  // ─── Age helpers ───────────────────────────────────────────────────────────
  function getAge(year) { return year - BIRTH_YEAR; }
  function formatAge(year) { return "age " + getAge(year); }

  // ─── Collection helpers ────────────────────────────────────────────────────
  function getCollectionGroups(entries) {
    return COLLECTIONS.map(function (c) {
      return Object.assign({}, c, {
        entries: entries.filter(function (e) {
          return Array.isArray(e.collections) && e.collections.includes(c.id);
        }).sort(byYearThenCity),
      });
    }).filter(function (c) { return c.entries.length > 0; });
  }

  function getEntryCollections(entry) {
    if (!entry || !Array.isArray(entry.collections)) return [];
    return COLLECTIONS.filter(function (c) { return entry.collections.includes(c.id); });
  }

  // ─── Theme management ──────────────────────────────────────────────────────
  function getStoredTheme() {
    try { return window.localStorage ? window.localStorage.getItem(THEME_KEY) : null; }
    catch (e) { return null; }
  }

  function saveTheme(theme) {
    try { if (window.localStorage) window.localStorage.setItem(THEME_KEY, theme); }
    catch (e) {}
  }

  function normalizeTheme(t) { return t === "dark" ? "dark" : "light"; }

  function applyTheme(theme, persist) {
    var normalized = normalizeTheme(theme);
    document.documentElement.dataset.theme = normalized;
    var button = $("theme-toggle");
    if (button) {
      var isDark = normalized === "dark";
      button.textContent = isDark ? ui("themeLight", "Light") : ui("themeDark", "Dark");
      button.setAttribute("aria-pressed", isDark ? "true" : "false");
      button.setAttribute("aria-label", isDark ? ui("themeToLight", "Switch to light mode") : ui("themeToDark", "Switch to dark mode"));
    }
    if (persist) saveTheme(normalized);
    return normalized;
  }

  function getInitialTheme() {
    var stored = getStoredTheme();
    if (stored === "dark" || stored === "light") return stored;
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
    return "light";
  }

  function toggleTheme() {
    var current = normalizeTheme(document.documentElement.dataset.theme);
    return applyTheme(current === "dark" ? "light" : "dark", true);
  }

  function initTheme() {
    applyTheme(getInitialTheme(), false);
    var button = $("theme-toggle");
    if (button) button.addEventListener("click", toggleTheme);
  }

  // ─── Data loading ──────────────────────────────────────────────────────────
  function loadEntries() {
    return fetch(DATA_URL)
      .then(function (response) {
        if (!response.ok) throw new Error("Cannot load " + DATA_URL);
        return response.json();
      })
      .catch(function (error) {
        var fallback = window[DATA_VAR];
        if (Array.isArray(fallback)) return fallback;
        throw error;
      });
  }

  // ─── Filter UI initialisation ──────────────────────────────────────────────
  function buildSelect(select, options, allLabel) {
    select.innerHTML = "";
    var all = document.createElement("option");
    all.value = "all";
    all.textContent = allLabel;
    select.appendChild(all);
    for (var i = 0; i < options.length; i++) {
      var o = document.createElement("option");
      o.value = options[i];
      o.textContent = options[i];
      select.appendChild(o);
    }
  }

  function buildPeriodSelect() {
    var select = $("period-filter");
    var label  = $("label-period");
    if (!select) return;
    select.innerHTML = "";
    if (PERIODS.length === 0) {
      // Hide the entire label when no periods are configured
      if (label) label.setAttribute("data-hidden", "");
      return;
    }
    var allOpt = document.createElement("option");
    allOpt.value = "all";
    allOpt.textContent = ui("filterAllPeriods", "All periods");
    select.appendChild(allOpt);
    for (var i = 0; i < PERIODS.length; i++) {
      var o = document.createElement("option");
      o.value = PERIODS[i].value;
      o.textContent = PERIODS[i].label;
      select.appendChild(o);
    }
  }

  function currentFilters() {
    return {
      city:   $("city-filter")   ? $("city-filter").value   : "all",
      genre:  $("genre-filter")  ? $("genre-filter").value  : "all",
      period: $("period-filter") ? $("period-filter").value : "all",
      query:  $("search-filter") ? $("search-filter").value : "",
    };
  }

  function initFilters(entries) {
    var cityEl  = $("city-filter");
    var genreEl = $("genre-filter");
    if (cityEl)  buildSelect(cityEl,  getFilterOptions(entries, "city"),  ui("filterAllCities",  "All cities"));
    if (genreEl) buildSelect(genreEl, getFilterOptions(entries, "genre"), ui("filterAllGenres",  "All genres"));
    buildPeriodSelect();
    ["city-filter", "genre-filter", "period-filter"].forEach(function (id) {
      var el = $(id);
      if (el) el.addEventListener("change", applyFilters);
    });
    var search = $("search-filter");
    if (search) search.addEventListener("input", applyFilters);
  }

  // ─── Map ───────────────────────────────────────────────────────────────────
  function initMap() {
    var warning = $("map-warning");
    if (!window.L) {
      if (warning) warning.hidden = false;
      return;
    }
    state.map = window.L.map("map", { scrollWheelZoom: true, worldCopyJump: true })
      .setView([48.7, 9.2], 5);
    var tiles = window.L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    });
    if (warning) {
      tiles.on("tileerror", function () { warning.hidden = false; });
    }
    tiles.addTo(state.map);
  }

  // ─── Render: map markers ───────────────────────────────────────────────────
  function renderMarkers(entries) {
    if (!state.map) return;
    state.map.closePopup();
    state.markers.forEach(function (marker) {
      marker.closePopup();
      state.map.removeLayer(marker);
    });
    document.querySelectorAll(".leaflet-popup").forEach(function (p) { p.remove(); });
    state.markers.clear();

    for (var i = 0; i < entries.length; i++) {
      (function (entry) {
        var coords    = getEntryCoordinates(entry);
        var placeLine = entry.place ? "<br><span>" + entry.place.name + "</span>" : "";
        var popupBtn  = ui("popupDetailBtn", "View detail");
        var marker    = window.L.marker(coords).addTo(state.map);
        marker.bindPopup(
          "<strong>" + entry.city + ", " + entry.year + "</strong>" +
          "<br>" + entry.work + " " + entry.catalogue + placeLine +
          "<br><button type=\"button\" class=\"popup-detail-link\" data-id=\"" + entry.id + "\">" +
            popupBtn +
          "</button>"
        );
        marker.on("click", function () { selectEntry(entry.id, false, false); });
        marker.on("popupopen", function () {
          var popupEl = marker.getPopup && marker.getPopup().getElement
            ? marker.getPopup().getElement() : null;
          var btn = popupEl ? popupEl.querySelector(".popup-detail-link") : null;
          if (btn) btn.addEventListener("click", function () { selectEntry(entry.id, false, true); }, { once: true });
        });
        state.markers.set(entry.id, marker);
      })(entries[i]);
    }

    if (entries.length > 1) {
      state.map.fitBounds(
        window.L.latLngBounds(entries.map(getEntryCoordinates)),
        { padding: [36, 36] }
      );
    } else if (entries.length === 1) {
      state.map.setView(getEntryCoordinates(entries[0]), 7);
    }
  }

  // ─── Render: timeline ──────────────────────────────────────────────────────
  function renderTimeline(entries) {
    var list = $("timeline-list");
    if (!list) return;
    list.innerHTML = "";
    var sorted = entries.slice().sort(byYearThenCity);
    for (var i = 0; i < sorted.length; i++) {
      (function (entry) {
        var button = document.createElement("button");
        button.type = "button";
        button.className = "timeline-item";
        button.dataset.id = entry.id;
        var agePart = BIRTH_YEAR ? "<small>" + formatAge(entry.year) + "</small>" : "";
        button.innerHTML =
          "<span class=\"timeline-year\">" + entry.year + agePart + "</span>" +
          "<span class=\"timeline-body\"><strong>" + entry.city + "</strong>" +
          "<span>" + entry.work + " · " + entry.catalogue + "</span></span>";
        button.addEventListener("click", function () { selectEntry(entry.id, true, false); });
        list.appendChild(button);
      })(sorted[i]);
    }
  }

  // ─── Render: sources ───────────────────────────────────────────────────────
  function renderSources(entries) {
    var container = $("source-list");
    if (!container) return;
    container.innerHTML = "";
    var sorted = entries.slice().sort(byYearThenCity);
    for (var i = 0; i < sorted.length; i++) {
      var entry = sorted[i];
      if (!entry.source || !entry.source.url) continue;
      var link = document.createElement("a");
      link.href = entry.source.url;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.textContent = entry.year + " " + entry.city + ": " + entry.source.label;
      container.appendChild(link);
    }
  }

  // ─── Render: collection nav ────────────────────────────────────────────────
  function renderCollectionNav(groups) {
    var nav = $("collection-nav");
    if (!nav) return;
    nav.replaceChildren();
    for (var i = 0; i < groups.length; i++) {
      var c    = groups[i];
      var link = document.createElement("a");
      link.href = "#collection-" + c.id;
      link.textContent = c.title + " (" + c.entries.length + ")";
      nav.appendChild(link);
    }
  }

  // ─── Render: collections ───────────────────────────────────────────────────
  function renderCollections(entries) {
    var container = $("collection-list");
    if (!container) return;
    if (COLLECTIONS.length === 0) {
      // Hide the whole collections section when none are configured
      var section = document.getElementById("collections");
      if (section) section.hidden = true;
      return;
    }
    var groups = getCollectionGroups(entries);
    container.innerHTML = "";
    renderCollectionNav(groups);
    for (var g = 0; g < groups.length; g++) {
      (function (collection) {
        var section = document.createElement("article");
        section.className = "collection-card";
        section.id = "collection-" + collection.id;
        var items = collection.entries.map(function (entry) {
          var agePart = BIRTH_YEAR
            ? " · " + formatAge(entry.year)
            : "";
          return "<button type=\"button\" class=\"collection-item\" data-id=\"" + entry.id + "\" aria-pressed=\"false\">" +
            "<span>" + entry.year + agePart + "</span>" +
            "<strong>" + entry.work + "</strong>" +
            "<small>" + entry.catalogue + " · " + entry.city + "</small>" +
            "</button>";
        }).join("");
        section.innerHTML =
          "<div class=\"collection-card-head\">" +
          "<h3>" + collection.title + "</h3>" +
          "<p>" + collection.description + "</p></div>" +
          "<div class=\"collection-items\">" + items + "</div>";
        section.querySelectorAll(".collection-item").forEach(function (b) {
          b.addEventListener("click", function () { selectEntry(b.dataset.id, true, true); });
        });
        container.appendChild(section);
      })(groups[g]);
    }
    highlightSelected();
  }

  // ─── Render: detail collections tags ──────────────────────────────────────
  function renderDetailCollections(entry) {
    var container = $("detail-collections");
    if (!container) return;
    container.innerHTML = "";
    if (!entry) { container.hidden = true; return; }
    var cols = getEntryCollections(entry);
    if (cols.length === 0) { container.hidden = true; return; }
    for (var i = 0; i < cols.length; i++) {
      var tag = document.createElement("a");
      tag.href = "#collection-" + cols[i].id;
      tag.className = "collection-tag";
      tag.textContent = cols[i].title;
      container.appendChild(tag);
    }
    container.hidden = false;
  }

  // ─── Render: listening links ───────────────────────────────────────────────
  function renderListening(entry) {
    var wrapper = $("detail-listening");
    if (!wrapper) return;
    if (!entry || !entry.listening) { wrapper.hidden = true; return; }
    var listening = entry.listening;
    setText("detail-listening-target", listening.target || "");
    setText("detail-listening-note",   listening.note   || "");
    var linksEl = $("detail-listening-links");
    if (linksEl) {
      linksEl.innerHTML = "";
      var links = Array.isArray(listening.links) ? listening.links : [];
      for (var i = 0; i < links.length; i++) {
        var a = document.createElement("a");
        a.href   = links[i].url;
        a.target = "_blank";
        a.rel    = "noreferrer";
        a.textContent = links[i].label;
        linksEl.appendChild(a);
      }
    }
    wrapper.hidden = false;
  }

  // ─── Render: place image ───────────────────────────────────────────────────
  function renderPlaceImage(place) {
    var figure  = $("detail-place-image");
    var imgEl   = $("detail-place-image-img");
    var caption = $("detail-place-image-caption");
    var srcLink = $("detail-place-image-source");
    if (!figure) return;
    if (!place || !place.image || !place.image.url) { figure.hidden = true; return; }
    if (imgEl) {
      imgEl.src = place.image.url;
      imgEl.alt = place.image.caption || "";
      imgEl.onerror = function () {
        if (caption) caption.textContent = ui("imageLoadError", "Image unavailable — see image source link.");
        imgEl.style.display = "none";
      };
    }
    if (caption) caption.textContent = place.image.caption || "";
    if (srcLink) {
      srcLink.href = place.image.sourceUrl || "#";
      srcLink.textContent = ui("viewImageSourcePrefix", "Image source: ") +
        (place.image.sourceLabel || place.image.sourceUrl || "");
      srcLink.hidden = !place.image.sourceUrl;
    }
    figure.hidden = false;
  }

  // ─── Render: place note ────────────────────────────────────────────────────
  function renderPlace(place) {
    var wrapper = $("detail-place");
    if (!wrapper) return;
    if (!place) { wrapper.hidden = true; return; }
    setText("detail-place-kind",    place.kind    || "");
    setText("detail-place-name",    place.name    || "");
    setText("detail-place-address", place.address || "");
    setText("detail-place-note",    place.note    || "");
    var srcLink = $("detail-place-source");
    if (srcLink && place.source) {
      srcLink.href = place.source.url || "#";
      srcLink.textContent = ui("viewPlaceSourcePrefix", "View place source: ") +
        (place.source.label || place.source.url || "");
      srcLink.hidden = !place.source.url;
    } else if (srcLink) {
      srcLink.hidden = true;
    }
    renderPlaceImage(place);
    wrapper.hidden = false;
  }

  // ─── Render: detail card ───────────────────────────────────────────────────
  function renderDetail(entry) {
    if (!entry) {
      setText("detail-work",    ui("noResults",       "No matching locations"));
      setText("detail-meta",    "Adjust filters to see results.");
      setText("detail-context", "No results for current filters.");
      setText("detail-meaning", "No results for current filters.");
      renderDetailCollections(null);
      renderListening(null);
      renderPlace(null);
      var mapLink = $("detail-map-link");
      if (mapLink) mapLink.hidden = true;
      var srcLink = $("detail-source");
      if (srcLink) srcLink.hidden = true;
      return;
    }
    setText("detail-work", entry.work + (entry.catalogue ? " " + entry.catalogue : ""));
    var agePart = BIRTH_YEAR ? " · " + formatAge(entry.year) : "";
    setText("detail-meta",
      entry.year + agePart +
      " · " + entry.city + ", " + entry.country +
      " · " + entry.genre
    );
    setText("detail-context", entry.context || "");
    setText("detail-meaning", entry.meaning || "");
    renderDetailCollections(entry);
    renderListening(entry);
    renderPlace(entry.place || null);
    var mapLink = $("detail-map-link");
    if (mapLink) {
      mapLink.textContent = ui("viewMapBtn", "View on map");
      mapLink.hidden = false;
    }
    var srcLink = $("detail-source");
    if (srcLink && entry.source) {
      srcLink.href = entry.source.url || "#";
      srcLink.textContent = ui("viewSourcePrefix", "View source: ") + (entry.source.label || "");
      srcLink.hidden = !entry.source.url;
    }
  }

  // ─── Highlight selected in timeline / collections ──────────────────────────
  function highlightSelected() {
    document.querySelectorAll(".timeline-item").forEach(function (item) {
      item.classList.toggle("is-active", item.dataset.id === state.selectedId);
    });
    document.querySelectorAll(".collection-item").forEach(function (item) {
      var selected = item.dataset.id === state.selectedId;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-pressed", selected ? "true" : "false");
    });
  }

  // ─── Timeline selection banner ─────────────────────────────────────────────
  function updateTimelineSelection(entry) {
    var container = $("timeline-selection");
    var text      = $("timeline-selection-text");
    var btn       = $("timeline-detail-link");
    if (!container || !text) return;
    if (!entry) { text.textContent = ""; container.hidden = true; return; }
    text.textContent = "Selected: " + entry.year + " · " + entry.work + " " + entry.catalogue;
    if (btn) btn.textContent = ui("viewDetailBtn", "View detail");
    container.hidden = false;
  }

  // ─── Focus entry on map ────────────────────────────────────────────────────
  function focusEntryOnMap(entry, scrollToMap) {
    var mapElement = $("map");
    if (scrollToMap && mapElement && typeof mapElement.scrollIntoView === "function") {
      mapElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    if (state.map) {
      state.map.setView(
        getEntryCoordinates(entry),
        Math.max(state.map.getZoom(), 6),
        { animate: true }
      );
      if (state.markers.has(entry.id)) state.markers.get(entry.id).openPopup();
    }
  }

  // ─── Select entry ──────────────────────────────────────────────────────────
  function selectEntry(id, focusMap, scrollToDetail) {
    var entry = state.filtered.find(function (e) { return e.id === id; }) ||
                state.entries.find(function (e)  { return e.id === id; });
    if (!entry) return;
    state.selectedId = entry.id;
    renderDetail(entry);
    highlightSelected();
    updateTimelineSelection(entry);
    if (scrollToDetail) {
      var detailEl = $("detail");
      if (detailEl && typeof detailEl.scrollIntoView === "function") {
        detailEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    if (focusMap) focusEntryOnMap(entry, false);
    // Wire up detail "View on map" button
    var mapLink = $("detail-map-link");
    if (mapLink) {
      mapLink.onclick = function () { focusEntryOnMap(entry, true); };
    }
    // Wire up timeline "View detail" button
    var detailLink = $("timeline-detail-link");
    if (detailLink) {
      detailLink.onclick = function () {
        var detailSection = $("detail");
        if (detailSection) detailSection.scrollIntoView({ behavior: "smooth", block: "start" });
      };
    }
  }

  // ─── Apply filters ─────────────────────────────────────────────────────────
  function applyFilters() {
    state.filtered = filterEntries(state.entries, currentFilters()).sort(byYearThenCity);
    setText("result-count", state.filtered.length + " " + ui("mapTitle", "locations").toLowerCase());
    renderMarkers(state.filtered);
    renderTimeline(state.filtered);
    var stillVisible = state.filtered.some(function (e) { return e.id === state.selectedId; });
    var nextEntry    = stillVisible
      ? state.filtered.find(function (e) { return e.id === state.selectedId; })
      : state.filtered[0];
    state.selectedId = nextEntry ? nextEntry.id : null;
    renderDetail(nextEntry || null);
    highlightSelected();
    updateTimelineSelection(nextEntry || null);
  }

  // ─── Apply UI strings from config ─────────────────────────────────────────
  function applyUiStrings() {
    // Page-level
    if (UI.pageTitle) document.title = UI.pageTitle;
    if (UI.lang)      document.documentElement.lang = UI.lang;
    // Hero background image
    if (UI.heroBgImage) {
      var hero = document.querySelector(".hero");
      if (hero) hero.style.backgroundImage = "url('" + UI.heroBgImage + "')";
    }
    // Nav
    setText("nav-brand",       ui("navBrand",       "Map Story"));
    setText("nav-collections", ui("navCollections", "Collections"));
    setText("nav-timeline",    ui("navTimeline",    "Timeline"));
    setText("nav-detail",      ui("navDetail",      "Detail"));
    setText("nav-sources",     ui("navSources",     "Sources"));
    // Hero
    setText("hero-eyebrow",    ui("heroEyebrow",    "Place · Time · Story"));
    setText("hero-title",      ui("heroTitle",      "Map Story"));
    setText("hero-copy",       ui("heroCopy",       ""));
    // Filter section
    setText("filter-title",    ui("filterTitle",    "Explore by city, period, and genre"));
    var labelSearch = $("label-search");
    if (labelSearch) labelSearch.firstChild.textContent = ui("filterSearch", "Search") + " ";
    var searchInput = $("search-filter");
    if (searchInput) searchInput.placeholder = ui("filterSearchPlaceholder", "Work / city / genre");
    var labelCity = $("label-city");
    if (labelCity) labelCity.firstChild.textContent = ui("filterCity", "City") + " ";
    var labelPeriod = $("label-period");
    if (labelPeriod) labelPeriod.firstChild.textContent = ui("filterPeriod", "Period") + " ";
    var labelGenre = $("label-genre");
    if (labelGenre) labelGenre.firstChild.textContent = ui("filterGenre", "Genre") + " ";
    // Map / timeline headers
    setText("map-kicker",       ui("mapKicker",      "Map"));
    setText("map-title",        ui("mapTitle",       "Locations"));
    setText("map-warning",      ui("mapWarning",     ""));
    setText("timeline-kicker",  ui("timelineKicker", "Timeline"));
    setText("timeline-title",   ui("timelineTitle",  "Works & Events"));
    // Detail
    setText("detail-kicker",          ui("detailKicker",        "Detail"));
    setText("detail-work",            ui("detailDefault",        "Select a location or year"));
    setText("detail-meta",            ui("detailDefaultMeta",    ""));
    setText("detail-context-heading", ui("detailContextHeading", "Context"));
    setText("detail-meaning-heading", ui("detailMeaningHeading", "Meaning"));
    // Collections
    setText("collections-kicker", ui("collectionsKicker", "Collections"));
    setText("collections-title",  ui("collectionsTitle",  "Grouped by theme or curation"));
    // Sources
    setText("sources-kicker",  ui("sourcesKicker",  "Sources"));
    setText("sources-title",   ui("sourcesTitle",   "References"));
    setText("sources-policy",  ui("sourcesPolicy",  ""));
    // Footer
    setText("footer-note",     ui("footerNote",     ""));
  }

  // ─── Init ──────────────────────────────────────────────────────────────────
  function init() {
    initTheme();
    applyUiStrings();
    loadEntries()
      .then(function (data) {
        state.entries = data.slice().sort(byYearThenCity);
        initFilters(state.entries);
        initMap();
        renderCollections(state.entries);
        renderSources(state.entries);
        applyFilters();
      })
      .catch(function (error) {
        console.error(error);
        setText("result-count", "Data not loaded");
        setText("detail-work",  ui("loadError", "Failed to load data"));
        setText("detail-meta",  "Open via a local static server: python -m http.server 8000");
        var warning = $("map-warning");
        if (warning) warning.hidden = false;
      });
  }

  // ─── Public test interface ─────────────────────────────────────────────────
  window.MapStory = {
    filterEntries:       filterEntries,
    getFilterOptions:    getFilterOptions,
    getEntryCoordinates: getEntryCoordinates,
    getAge:              getAge,
    formatAge:           formatAge,
    getCollectionGroups: getCollectionGroups,
    getEntryCollections: getEntryCollections,
    applyTheme:          applyTheme,
    getInitialTheme:     getInitialTheme,
    toggleTheme:         toggleTheme,
    loadEntries:         loadEntries,
    parsePeriod:         parsePeriod,
    selectEntry:         selectEntry,
    applyFilters:        applyFilters,
  };

  if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", init);
  }

})();
