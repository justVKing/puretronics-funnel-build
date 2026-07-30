# Puretronics Wire & Cable Taxonomy Governance

Version: 1.0.0
Effective date: 30 July 2026
Approval state: approved
Taxonomy owner: Vaibhav Kuvadia + Codex
Operational steward: Vaibhav Kuvadia + Codex

Live Notion authority: https://app.notion.com/p/3ad3dd29567d817fa47ed507b3add3f9

## Authority and precedence

This document controls product classification across the Puretronics Wire & Cable operating system. It does not amend the signed Services Agreement. The signed Services Agreement and repository governance rules continue to outrank this taxonomy.

The Product Master is product-intelligence authority, not legal or commercial authority. Technical, performance, compliance, standards, commercial, and product claims still require the source and validation treatment defined elsewhere in the repository.

## Operating model

- `Product Family` is the sole top-level product taxonomy.
- `Solution Theme` is subordinate and many-to-many.
- `Manufacturing Flow Stage` is a separate ordered navigation axis.
- `Buyer Problem` is a separate discovery axis.
- The funnel supports discovery by problem, production stage, or Product Family.
- `Solution Block` is retired as an independent taxonomy. The legacy asset-master column remains only for schema compatibility and must contain the same canonical slug as `product_family`, or a controlled `cross-family`/`not-applicable` value.
- PF identifiers are governance identifiers. Public-facing content uses the full technical family label.

## Canonical Product Families

| ID | Canonical Product Family | Slug | Inclusion criteria | Exclusions | Expected rows |
| --- | --- | --- | --- | --- | ---: |
| PF-01 | Inline Measurement & Dimensional Control | `inline-measurement-dimensional-control` | Inline laser measurement, dimensional inspection, and directly supporting measurement records | Spark, offline cable testing, process auxiliaries, tension/braking | 9 |
| PF-02 | Inline Spark Testing & Insulation Fault Detection | `inline-spark-testing-insulation-fault-detection` | Inline spark testers plus contextual fault-intelligence/calibration support | Offline AC/DC HV testing and fire-resistance testing | 7 |
| PF-03 | Cable Testing & Validation | `cable-testing-validation` | Offline AC/DC HV testers and the Fire Resistance Cable Testing System | Inline spark inspection | 3 |
| PF-04 | Process Equipment & Line Auxiliaries | `process-equipment-line-auxiliaries` | Wire preheating, static powder application, conductor joining and repair | Tension sensing/control and braking | 6 |
| PF-05 | Tension / Braking / Line Control | `tension-braking-line-control` | Tension indicators/controllers, loadcells, braking and unwind/rewind control | Preheating, powdering and welding | 13 |

Fire Resistance & Circuit Integrity is a specialized Solution Theme within PF-03, not a one-product top-level family. LTC-PRO is always PF-05.

## Controlled Solution Themes

1. Dimensional Measurement & Control
2. Spark Testing & Fault Intelligence
3. Electrical/HV Validation
4. Fire Resistance & Circuit Integrity
5. Wire Preheating & Adhesion
6. Static Powder Application
7. Conductor Joining & Repair
8. Tension Measurement & Control
9. Braking & Unwind/Rewind Control
10. Data & Reporting
11. Calibration & Support

The Fire Resistance Cable Testing System must not carry `Electrical/HV Validation` merely because high voltage may appear in a test context. Only technically supported cross-cutting themes may be applied.

## Legacy-to-canonical crosswalk

| Legacy classification | Canonical treatment |
| --- | --- |
| Online Measurement | PF-01 |
| Fault & Safety Testing — spark products/support | PF-02 |
| Fault & Safety Testing — AC/DC HV and fire testing | PF-03 |
| Process Enhancement | PF-04 |
| Tension / Braking / Automation | PF-05 |
| Online Measurement solution block | PF-01 |
| Spark Testing solution block | PF-02 |
| HV Validation solution block | PF-03 |
| Fire Resistance solution block | PF-03 specialized theme/module |
| Line Stability solution block | Split between PF-04 and PF-05 |

Deprecated labels and slugs may remain only in immutable contractual/source evidence, pre-migration snapshots, migration manifests, and this crosswalk. They must not be used in active filters, routes, tags, generated specifications, or operational instructions.

## Support-item and signed-scope rules

Support items remain contextual support items. They may inform a parent family experience or proof asset, but they cannot become standalone pages, campaigns, forms, automations, SEO assets, selectors, calculators, configurators, outreach tracks, or extra deliverables without separate written approval.

The Product Master’s `Signed Scope Treatment` and signed-scope notes must be validated by individual row fetch or exact export. Aggregate queries that omit the treatment are not authoritative for scope control.

## Authoritative row mapping

The row-level mapping and migration result are stored in `data/product-master/taxonomy-migration-manifest.csv`. Acceptance requires:

- exactly 38 rows;
- exactly one Product Family per row;
- distribution `9 / 7 / 3 / 6 / 13`;
- zero unmapped rows;
- LTC-PRO in PF-05;
- Fire Resistance Cable Testing in PF-03 without the Electrical/HV theme.

## Change control

Any proposed family, label, slug, theme, inclusion rule, or mapping change requires:

1. written rationale and affected-row list;
2. signed-scope impact check;
3. technical validation where claims or standards may be affected;
4. Product Master, views, repository, tags, routes, generators, and validator impact review;
5. owner approval and a versioned change-log entry.

The migration checkpoint was approved on 30 July 2026. The temporary live Notion `Legacy Product Family` field was removed after the final checkpoint export. Rollback evidence remains in the timestamped exports and row-level migration manifest.

## Approved cross-system label

PF-05 uses `Tension / Braking / Line Control` in live Notion, repository data, routes, filters, tags, governance, and buyer-facing content. No punctuation variant or synonym is active.

## Standards note

The existing BS EN 50200:2006 source reference remains `pending-puretronics-validation`. It must not support an external compliance claim until Puretronics validates the applicable edition. This taxonomy migration does not change or assert compliance.

## Change log

| Date | Version | Change | State |
| --- | --- | --- | --- |
| 2026-07-30 | 1.0.0 | Approved five canonical Product Families, controlled themes, ownership, legacy crosswalk, scope safeguards, 38-row distribution, and final cutover | Approved |
