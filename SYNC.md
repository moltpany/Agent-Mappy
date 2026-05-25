# Sync Notes

This repository is the public Agent-Mappy framework. It can be developed directly here, while case-study data may come from other repositories such as the Mozart Journey portfolio project.

## Initial Publish

```bash
git add .
git commit -m "init: Agent-Mappy framework"
git push -u origin main
```

## Updating From A Case Study

When a source project changes, copy only the reusable data or docs that belong in Agent-Mappy. Do not copy private notes, credentials, local config, or unrelated site assets.

For Mozart Journey, the expected public example file is:

```text
examples/mozart-journey/mozart-journey.json
```

After copying, run:

```bash
node tests/validate.js
```

## Release Checklist

- [ ] README reflects the current framework scope.
- [ ] `agent-registry.json` points to existing files.
- [ ] `schemas/map-story.schema.json` parses as JSON.
- [ ] Example datasets parse and pass validation.
- [ ] Skills contain concise frontmatter and actionable workflows.
- [ ] No secrets, tokens, private `.env` values, or credentials are committed.
