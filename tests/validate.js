const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function validateRegistry() {
  const registry = readJson("agent-registry.json");
  assert(registry.repository === "Agent-Mappy", "registry should identify Agent-Mappy");
  assert(Array.isArray(registry.skills) && registry.skills.length === 3, "registry should list three starter skills");
  for (const skill of registry.skills) {
    assert(skill.id && skill.file && exists(skill.file), `${skill.id} should point to an existing skill file`);
    assert(Array.isArray(skill.triggers) && skill.triggers.length > 0, `${skill.id} should include trigger phrases`);
  }
  assert(Array.isArray(registry.examples) && registry.examples.length >= 1, "registry should include at least one example");
  for (const example of registry.examples) {
    assert(example.file && exists(example.file), `${example.id} should point to an existing example file`);
  }
}

function validateSchema() {
  const schema = readJson("schemas/map-story.schema.json");
  assert(schema.type === "array", "map story schema should validate an array");
  assert(schema.items && Array.isArray(schema.items.required), "schema should define required entry fields");
  for (const field of ["id", "year", "city", "country", "lat", "lng", "work", "catalogue", "genre", "context", "meaning", "source"]) {
    assert(schema.items.required.includes(field), `schema should require ${field}`);
  }
}

function validateMozartExample() {
  const entries = readJson("examples/mozart-journey/mozart-journey.json");
  assert(Array.isArray(entries), "Mozart example should be an array");
  assert(entries.length >= 20, "Mozart example should include a substantial case-study dataset");

  const ids = new Set();
  for (const entry of entries) {
    assert(entry.id && !ids.has(entry.id), `entry id should be unique: ${entry.id}`);
    ids.add(entry.id);
    for (const field of ["year", "city", "country", "lat", "lng", "work", "catalogue", "genre", "context", "meaning"]) {
      assert(entry[field] !== undefined && entry[field] !== "", `${entry.id} should include ${field}`);
    }
    assert(Number.isInteger(entry.year), `${entry.id} year should be an integer`);
    assert(typeof entry.lat === "number" && entry.lat >= -90 && entry.lat <= 90, `${entry.id} should include valid latitude`);
    assert(typeof entry.lng === "number" && entry.lng >= -180 && entry.lng <= 180, `${entry.id} should include valid longitude`);
    assert(entry.source && entry.source.label && entry.source.url && entry.source.summary, `${entry.id} should include source label, url, and summary`);
    if (entry.sources !== undefined) {
      assert(Array.isArray(entry.sources) && entry.sources.length >= 1, `${entry.id} sources should be a non-empty array when present`);
      for (const s of entry.sources) {
        assert(s && s.label && s.url && s.summary, `${entry.id} each source should include label, url, and summary`);
      }
    }
    if (entry.place) {
      assert(entry.place.name && entry.place.address && entry.place.note, `${entry.id} place should include name, address, and note`);
      assert(entry.place.source && entry.place.source.label && entry.place.source.url, `${entry.id} place should include a source`);
    }
  }
}

function validateSkills() {
  const skillPaths = [
    "skills/map-story-planner/SKILL.md",
    "skills/source-grounded-entry-writer/SKILL.md",
    "skills/static-map-site-builder/SKILL.md",
  ];
  for (const skillPath of skillPaths) {
    const text = fs.readFileSync(path.join(root, skillPath), "utf8");
    assert(text.startsWith("---\n"), `${skillPath} should start with YAML frontmatter`);
    assert(text.includes("\nname:"), `${skillPath} should include a name`);
    assert(text.includes("\ndescription:"), `${skillPath} should include a description`);
  }
}

function validateRequiredFiles() {
  for (const file of ["README.md", "SYNC.md", "LICENSE", ".gitignore"]) {
    assert(exists(file), `${file} should exist`);
  }
}

// Bilingual convention: an optional `<example>.en.json` overlay must be an array
// of `{ id, ... }` objects whose ids are a SUBSET of the base example ids (every
// overlay entry maps to a real base entry; missing ids are allowed and fall back
// to the base language at runtime).
function validateOverlays() {
  const registry = readJson("agent-registry.json");
  for (const example of registry.examples) {
    const overlayRel = example.file.replace(/\.json$/, ".en.json");
    if (!exists(overlayRel)) {
      continue;
    }
    const base = readJson(example.file);
    const overlay = readJson(overlayRel);
    const baseIds = new Set(base.map((entry) => entry.id));
    assert(Array.isArray(overlay), `${overlayRel} should be a JSON array`);
    const seen = new Set();
    for (const item of overlay) {
      assert(item && item.id, `${overlayRel} every entry should have an id`);
      assert(!seen.has(item.id), `${overlayRel} ids should be unique: ${item.id}`);
      seen.add(item.id);
      assert(baseIds.has(item.id), `${overlayRel} id has no base entry: ${item.id}`);
      assert(
        item.context || item.meaning || item.place || item.listening || item.source,
        `${overlayRel} ${item.id} should carry at least one translated field`,
      );
    }
  }
}

const tests = [
  validateRequiredFiles,
  validateRegistry,
  validateSchema,
  validateMozartExample,
  validateOverlays,
  validateSkills,
];

for (const test of tests) {
  test();
  console.log(`PASS ${test.name}`);
}
