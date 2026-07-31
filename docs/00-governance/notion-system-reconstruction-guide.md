# Puretronics Notion System Reconstruction Guide

Version: 1.0.0
Effective date: 31 July 2026
Authority: repository-only reconstruction control
Owner: Vaibhav Kuvadia + Codex
Manifest: `data/notion-export/notion-reconstruction-manifest.json`
Validator: `scripts/validate_notion_reconstruction.ps1`

This guide enables a coding assistant with Notion MCP access to reconstruct the Puretronics Notion operating system to approximately 98–99% fidelity for content, structure, taxonomy, database meaning, and operational relationships.

This guide is not a Notion page and must not be copied into Notion. It is maintained only in the local repository and GitHub repository.

## Reconstruction contract

The reconstruction target is content-and-structure equivalence, not preservation of account-specific metadata.

Reconstruction must preserve:

- page titles, headings, paragraphs, lists, tables, links, diagrams, and substantive wording;
- page hierarchy, navigation meaning, source relationships, and cross-references;
- Product Master rows, properties, canonical taxonomy values, and view intent;
- signed-scope treatment, support-item restrictions, approval states, and validation status;
- the distinction between active operating content and immutable historical/source evidence.

The following are intentionally not reconstruction requirements:

- Notion page, database, view, relation, or block IDs;
- account-specific URLs, permissions, ownership, comments, revision history, and timestamps;
- exact Notion rendering of native blocks when the repository preserves their meaning in Markdown or structured data.

Any unsupported Notion-native construct must be recorded as an explicit exception in the reconstruction manifest. It must not be silently omitted or replaced with invented content.

## Source precedence

Use these sources in this order:

1. The Signed Services Agreement and protected input/source evidence. They are read-only evidence and are never rewritten.
2. Final post-cutover Notion snapshots under `data/notion-export/taxonomy-migration/2026-07-30/post-cutover/`.
3. Product Master schema, rows, CSV, taxonomy, and views under `data/product-master/`.
4. `notion-source-map.json` and `data/notion-export/notion-reconstruction-manifest.json`.
5. `migration-manifest.md`, governance documents, and migration integrity records.
6. Normalized repository Markdown and operational specifications.

Pre-migration snapshots are historical comparison evidence only. They must never override final post-cutover content.

The Product Master is product-intelligence authority only. It cannot override the Signed Agreement, signed scope, exclusions, commercial terms, or legal wording.

## Protected files and directories

The following content is permanently protected:

- `docs/00-governance/services-agreement-final-signature-copy.md`;
- `docs/04-source-archive/` and its raw child source pages;
- Signed Agreement and immutable raw-source snapshots under `data/notion-export/`;
- approved integrity manifests and baseline hashes.

No reconstruction, refresh, taxonomy migration, normalization, or code-generation workflow may edit these protected files. A new source version must be stored as a new timestamped evidence record; an existing evidence record must not be replaced.

Before and after every reconstruction refresh, run `scripts/validate_notion_reconstruction.ps1` and confirm that protected hashes are unchanged.

## Required reconstruction sequence

1. Inspect `git status` and verify the protected-file hashes.
2. Load the reconstruction manifest and source map.
3. Enumerate the 11 core surfaces and 19 immutable raw source pages.
4. Recreate the Puretronics parent and navigation hierarchy.
5. Recreate each core surface from its final post-cutover snapshot and repository mirror.
6. Recreate the Product Master from `schema.json`, `rows.csv`/`rows.json`, and `views.json`.
7. Recreate the five canonical Product Families and controlled Solution Themes exactly as defined in `data/product-master/taxonomy.json`.
8. Recreate the 19 raw source pages as historical/source evidence without rewriting their bodies.
9. Restore internal links, page relationships, source references, navigation labels, and view intent.
10. Validate content coverage, structure coverage, Product Master counts, taxonomy values, and protected hashes.
11. Produce a reconstruction report listing exact matches, normalized matches, and approved exceptions.

Do not invent technical, performance, compliance, standards, commercial, product, or scope claims. Do not promote support items into standalone deliverables. Do not create additional pages, campaigns, forms, automations, selectors, calculators, configurators, or outreach tracks unless separately approved in writing.

## Coverage contract

The current approved baseline requires:

- 11 mapped core Notion surfaces;
- 19 immutable raw source pages, including five nested source pages;
- 38 Product Master rows;
- 44 final active Product Master properties;
- 12 Product Master views;
- five and only five active Product Family values;
- Product Family distribution of `9 / 7 / 3 / 6 / 13`;
- canonical PF-05 label `Tension / Braking / Line Control`;
- LTC-PRO mapped to PF-05;
- Fire Resistance & Circuit Integrity treated as a specialized theme within PF-03;
- BS EN 50200:2006 retained as `pending-puretronics-validation`, with external compliance claims prohibited;
- unchanged Signed Agreement and immutable source evidence.

## Fidelity and exceptions

The repository is the reconstruction record. A reconstruction is accepted when all required source content and structured data are represented, all coverage checks pass, and every known Notion-native limitation is listed in the manifest.

Expected fidelity is 98–99% for content, structure, and meaning. The accepted residual variance is limited to account metadata and Notion-native presentation or behavior that is not represented in Markdown/CSV/JSON. No residual variance may conceal missing substantive content.

Approved baseline exceptions:

- account-specific IDs, URLs, permissions, ownership, comments, history, and timestamps are not preserved;
- exact rendering of toggles, callouts, synced blocks, embeds, and other native Notion blocks may be normalized while preserving meaning;
- binary attachments or externally hosted media are reproducible only when their source file or stable reference is present in the repository;
- formulas, rollups, automations, and integrations must be recreated from their documented behavior and validated separately.

## Maintenance protocol

Update this guide and its manifest after every approved Notion change that affects content, structure, taxonomy, database schema, views, source mapping, or operational meaning:

1. Capture a new timestamped raw Notion export without overwriting prior evidence.
2. Update the source map and normalized Markdown/CSV/schema/view mirrors.
3. Update the reconstruction manifest, hashes, coverage counts, and exception list.
4. Update the guide version and `project-ops/change-log.md`.
5. Correct active status text so final post-cutover state is unambiguous.
6. Run all existing workspace, Notion, taxonomy, asset-master, and signed-scope validators plus `validate_notion_reconstruction.ps1`.
7. Run `git diff --check`.
8. Commit the repository changes only after the validation gate passes.

The Signed Agreement and input/source archive remain immutable during every update. The guide remains repository-only and is never added to Notion.

## Reconstruction handoff

An assistant receiving this repository should begin with this guide, then read the manifest, source map, final post-cutover snapshots, Product Master exports, and governance rules. It should report any missing artifact or ambiguity before writing to a target Notion account. It must treat the target account as a new destination and must not attempt to reuse source-account IDs or URLs.
