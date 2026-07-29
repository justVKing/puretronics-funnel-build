# Manual Notion Export Fallback

Use this folder only if the live Notion connector is unavailable.

Required manual export package:

- All 10 core Notion pages listed in notion-source-map.json
- All 14 raw input child source pages
- Full Product Master Database export with every property
- Page/database export timestamps

Rules:

- Do not rewrite raw exported content for readability.
- Preserve Notion headings, bullets, tables, database rows, and page hierarchy.
- Normalize copies into data/notion-export/raw-page-fetches/ only after preserving the untouched export here.
- Treat docs/00-governance/services-agreement-final-signature-copy.md as locked. The signed Services Agreement dated 9 July 2026 governs contracted scope, commercials, exclusions, deliverables, approvals, and change control.
