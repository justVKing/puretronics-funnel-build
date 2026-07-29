# Puretronics Funnel Build

Private build workspace for the Puretronics Wire & Cable demand-generation funnel.

This repository mirrors the operating structure of the Puretronics Notion workspace and turns it into a version-controlled build system for:

- signed agreement governance
- funnel architecture
- commercial alignment
- product intelligence
- raw source traceability
- page specs, forms, routing, dashboard, and activation work

## Source Of Truth Rules

1. docs/00-governance/services-agreement-final-signature-copy.md is the locked legal and commercial source of truth once the raw Notion export is refreshed into this repo.
2. The signed Services Agreement dated 9 July 2026 governs scope, commercials, exclusions, deliverables, approvals, and change control.
3. The Product Master Database is the product-intelligence source, not the legal or commercial authority.
4. Support items cannot become standalone pages, campaigns, forms, automations, SEO assets, selectors, calculators, configurators, or extra deliverables unless separately approved in writing.

## Navigation

- Governance: docs/00-governance/
- Funnel architecture: docs/01-funnel-architecture/
- Commercials: docs/02-commercial/
- Product intelligence: docs/03-product-intelligence/
- Raw source archive: docs/04-source-archive/
- Structured product data: data/product-master/
- Build work: funnel-build/
- Activation work: activation/
- Project operations: project-ops/

## Current Build Status

The repo contains the build-ready operating artifacts for the first funnel-build pass:

- Funnel page and solution-block specifications
- Technical proof-stack map
- Adaptive requirement form and routing model
- Dashboard and reporting model
- Monthly activation operating system
- Signed-scope validation scripts

## Current Export Status

This initial repository was generated from verified Notion inventory, schema, page summaries, and product row data available in the Codex task context. The live Notion connector became unavailable during execution, so raw block-perfect page snapshots are marked as pending refresh in migration-manifest.md.

Before treating this repository as the final archival mirror, run a refresh pass from Notion and replace data/notion-export/raw-page-fetches/ with exact fetched content. If live Notion connector access is unavailable, place the untouched manual export under data/notion-export/manual/ before normalization.

Issue #8 remains dependent on live Notion connector access or a manual Notion export because exact raw Notion blocks cannot be recreated from summaries without changing evidentiary fidelity.
