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

1. docs/00-governance/services-agreement-final-signature-copy.md is the locked legal and commercial source of truth.
2. The signed Services Agreement dated 9 July 2026 governs scope, commercials, exclusions, deliverables, approvals, and change control.
3. The Product Master Database is the product-intelligence source, not the legal or commercial authority.
4. Support items cannot become standalone pages, campaigns, forms, automations, SEO assets, selectors, calculators, configurators, or extra deliverables unless separately approved in writing.
5. `docs/00-governance/product-taxonomy-governance.md` controls active product classification below the signed agreement.

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

- Funnel page and five-Product-Family specifications
- Technical proof-stack map
- Adaptive requirement form and routing model
- Dashboard and reporting model
- Monthly activation operating system
- Signed-scope validation scripts

## Current Export Status

The final post-cutover live Notion baseline was captured on 30 July 2026. The repository includes a reconstruction guide and manifest for recreating the content and structure in another Notion account:

- Exact connector responses for the pre-migration baseline are stored in `data/notion-export/taxonomy-migration/2026-07-30/pre-migration/`.
- The source map now covers 19 immutable raw source pages, including five nested pages.
- The exact Product Master Database, data-source schema, and 38-row query responses are stored in data/notion-export/raw-database-fetches/.
- data/product-master/rows.json and rows.csv contain all 44 Notion properties plus each row's Notion URL.
- data/product-master/schema.json and views.json contain the canonical five-family schema and 12 configured views.
- docs/00-governance/notion-system-reconstruction-guide.md defines the 98–99% content-and-structure reconstruction contract.
- data/notion-export/notion-reconstruction-manifest.json and scripts/validate_notion_reconstruction.ps1 provide machine-readable coverage and protected-file checks.

Run `scripts/validate_product_taxonomy.ps1`, `scripts/validate_funnel_asset_master.ps1`, `scripts/validate_notion_export.ps1`, `scripts/validate_notion_reconstruction.ps1`, `scripts/validate_workspace.ps1`, and `scripts/validate_signed_scope.ps1` before accepting later refreshes.
