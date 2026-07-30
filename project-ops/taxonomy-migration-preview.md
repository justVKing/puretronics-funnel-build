# Puretronics Canonical Product Taxonomy Migration Preview

Date: 30 July 2026
State: approved and cut over
Commit/push state: local commit authorized; push not authorized

## Decision and authority

The system now uses five canonical Product Families:

| ID | Product Family | Repository rows | Live Notion rows |
| --- | --- | ---: | ---: |
| PF-01 | Inline Measurement & Dimensional Control | 9 | 9 |
| PF-02 | Inline Spark Testing & Insulation Fault Detection | 7 | 7 |
| PF-03 | Cable Testing & Validation | 3 | 3 |
| PF-04 | Process Equipment & Line Auxiliaries | 6 | 6 |
| PF-05 | Tension / Braking / Line Control | 13 | 13 |

Live governance page: https://app.notion.com/p/3ad3dd29567d817fa47ed507b3add3f9

The Signed Agreement remains unchanged and outranks the taxonomy.

## Row migration

- 38 of 38 Product Master rows have one canonical Product Family.
- Fire Resistance Cable Testing System is PF-03 with `Fire Resistance & Circuit Integrity` and `Data & Reporting`; it does not carry `Electrical/HV Validation`.
- LTC-PRO is PF-05 with tension, braking/unwind-rewind, and data/reporting themes.
- All three AX pneumatic brakes are PF-05 with tension and braking/unwind-rewind themes.
- Row-by-row old/new family, themes, signed-scope treatment, and migration result are recorded in `data/product-master/taxonomy-migration-manifest.csv`.

Live verification used individual page fetches for all 38 rows because the aggregate Notion SQL query exhibits cache lag after property updates. The individual-fetch result is stored in `data/notion-export/taxonomy-migration/2026-07-30/post-migration/live-row-verification.json`.

## Product Master schema and views

- New canonical family field populated and renamed to `Product Family`.
- The previous field was renamed to `Legacy Product Family` for the reversible checkpoint, then removed after approval.
- Product Family Navigator is grouped by canonical Product Family.
- Proposal & Funnel Builder displays Product Family.
- All other view property visibility, grouping, filters, and sorting were re-bound or verified.
- Controlled Solution Theme choices were reduced to the 11 canonical values.

Views verified:

1. 00 Admin - All Properties
2. 01 Sales Snapshot
3. 02 Manufacturing Flow
4. 03 Buyer Discovery
5. 04 Product Family Navigator
6. 05 Hero Products
7. 06 Technical Lookup
8. 07 Connected Factory / Industry 4.0
9. 08 Proposal & Funnel Builder
10. 09 Cross-Sell & Bundles
11. 10 Source & Spec Governance
12. Context Tags

## Core Notion page alignment

| Surface | Result |
| --- | --- |
| Main Puretronics page | Governance authority linked as a child page |
| Input Files archive index | Governance notice added; source bodies remain historical |
| Master Document | Four-family headings replaced with five Product Families |
| Product Intelligence Hub | Governance and Product Master operating-authority rules added |
| Master User Guide | Canonical values, AI-agent rules, and deprecated-term controls added |
| Internal Copy Annexure A | Diagrams, hierarchy, family overview, Fire/PF-03 relationship, and PF-04/PF-05 split aligned |
| Annexure A Funnel Architecture | Same in-place alignment; URL preserved |
| Annexure B | Taxonomy/navigation terminology aligned only; commercials unchanged |
| Taxonomy Governance | New canonical authority published |

Repository and live scans found no deprecated architecture labels on the eight editable core surfaces after migration.

The repository-wide occurrence record is in `project-ops/taxonomy-occurrence-report.md`. Deprecated vocabulary is confined to immutable evidence, timestamped migration history, governance crosswalks, and migration/validation logic that must recognize it.

## Funnel-asset migration

- Existing `FA-####` identifiers were preserved.
- FA-0077 is the PF-03 Cable Testing & Validation parent experience.
- FA-0078 is a PF-03 Fire Resistance & Circuit Integrity child theme/proof module.
- FA-0079 is the PF-04 Process Equipment & Line Auxiliaries parent experience.
- FA-0211 is the new PF-05 Tension / Braking / Line Control parent experience.
- Product/source/proof/form/routing parents were rewired without renumbering unrelated rows.
- Five nested raw-source rows and the governance authority were appended as FA-0212 through FA-0217.
- Final asset count: 217.
- The old `five-solution-blocks.md` filename was replaced by `five-product-families.md`.

## Recoverability and integrity

- Pre-migration baseline: `data/notion-export/taxonomy-migration/2026-07-30/pre-migration/`
- Post-migration snapshot: `data/notion-export/taxonomy-migration/2026-07-30/post-migration/`
- Signed Agreement hash: unchanged.
- Fourteen direct raw source hashes: unchanged.
- Five nested raw source hashes: unchanged.
- Integrity records: 20 of 20 unchanged.

The initial five nested IDs recorded during audit were malformed. Correct IDs were resolved from the exact parent-page exports and added to `notion-source-map.json`; the corrected pages were then fetched and integrity-recorded.

## Approved decisions

1. Taxonomy Version 1.0 is approved effective 30 July 2026.
2. PF-05 is standardized everywhere as `Tension / Braking / Line Control`.
3. The hidden live `Legacy Product Family` field was removed after the final checkpoint.
4. Taxonomy owner: Vaibhav Kuvadia + Codex.
5. Operational steward: Vaibhav Kuvadia + Codex.
6. The existing BS EN 50200 reference remains `pending-puretronics-validation` and cannot support an external compliance claim.
7. A local Git commit is authorized; push is not authorized.

## Scope protection

- No Signed Agreement content, properties, comments, commercials, dates, quantities, prices, exclusions, or legal language were changed.
- Support items remain contextual and are not standalone deliverables.
- No frontend, campaign expansion, product-page expansion, SEO, selector, calculator, configurator, commit, or push was performed.

## Validation result

All required checks passed on 30 July 2026:

- `scripts/validate_product_taxonomy.ps1`
- `scripts/validate_funnel_asset_master.ps1`
- `scripts/validate_notion_export.ps1`
- `scripts/validate_workspace.ps1`
- `scripts/validate_signed_scope.ps1`
- CSV parsing, controlled tags, and Product Master coverage checks
- repository-wide deprecated-term scan with controlled allowlist
- `git diff --check`
