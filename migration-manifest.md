# Migration Manifest

Refreshed at: 2026-07-30

## Canonical Taxonomy Migration

The five-Product-Family taxonomy migration was approved and cut over on 30 July 2026.

- Canonical governance page: https://app.notion.com/p/3ad3dd29567d817fa47ed507b3add3f9
- Product Master distribution: `9 / 7 / 3 / 6 / 13`
- Product Master rows mapped: 38 of 38
- Product Master views reconfigured in place: 12 of 12
- Editable core pages aligned: 8
- New governance page published: 1
- Immutable raw source pages verified: 19
- Signed Agreement verified unchanged: yes
- Temporary `Legacy Product Family` field removed after approved checkpoint: yes
- Canonical PF-05 label across Notion and repository: `Tension / Braking / Line Control`
- Taxonomy owner: Vaibhav Kuvadia + Codex
- Operational steward: Vaibhav Kuvadia + Codex
- BS EN 50200:2006 treatment: `pending-puretronics-validation`; external compliance claims prohibited pending Puretronics validation

Row-level mapping: `data/product-master/taxonomy-migration-manifest.csv`

Taxonomy vocabulary: `data/product-master/taxonomy.json`

Integrity hashes: `data/notion-export/taxonomy-migration/2026-07-30/integrity-manifest.csv`

Final post-cutover evidence: `data/notion-export/taxonomy-migration/2026-07-30/post-cutover/`

## Source Workspace

- Notion parent: https://app.notion.com/p/37d3dd29567d8276adfd81f554906805
- Client: Puretronics India Private Limited
- Engagement: Wire & Cable demand-generation funnel build
- Signed agreement date: 9 July 2026

## Exported Structure

- Core Notion assets fetched/mapped: 11, including the new governance page
- Raw input source pages fetched: 19, including five nested source pages
- Product database rows fetched: 38
- Product database properties at final cutover: 44 active properties; the 45-property live checkpoint remains archived before legacy-field removal
- Product database views fetched: 12

## Exact Export Status

The exact live Notion refresh gate was completed on 29 July 2026. Each mapped page was fetched directly by its Notion ID, and the connector's untouched JSON response was stored under data/notion-export/raw-page-fetches/.

The Product Master Database container, data-source schema, and exact 38-row `00 Admin - All Properties` view response are preserved under data/notion-export/raw-database-fetches/. Normalized row, CSV, schema, and view files under data/product-master/ are generated directly from those live responses without reducing the property set.

## Completed Refresh Gate

1. Fetched each of the 30 mapped surfaces listed in notion-source-map.json: 11 core surfaces and 19 immutable raw source pages.
2. Saved exact Notion connector responses to data/notion-export/raw-page-fetches/.
3. Queried and stored all 38 Product Master Database rows from `00 Admin - All Properties`, with all 44 properties.
4. Refreshed the live schema and 12 database view definitions.
5. Added a dedicated exact-export validator at scripts/validate_notion_export.ps1.

## Signed Commercial Facts

- Effective date: 9 July 2026
- Pilot term: 15 July 2026 to 31 December 2027
- Build period: July-August 2026
- Activation period: September 2026 to December 2027
- One-time build: INR 5,50,000
- Monthly retainer: INR 65,000/month for 16 months
- Retainer total: INR 10,40,000
- Total project value excluding taxes: INR 15,90,000
