param(
  [string]$Root = (Get-Location).Path
)

$ErrorActionPreference = "Stop"

function Ensure-Dir {
  param([string]$Path)
  if (-not (Test-Path -LiteralPath $Path)) {
    New-Item -ItemType Directory -Force -Path $Path | Out-Null
  }
}

function Write-Utf8 {
  param(
    [string]$Path,
    [string]$Content
  )
  $dir = Split-Path -Parent $Path
  if ($dir) { Ensure-Dir $dir }
  Set-Content -LiteralPath $Path -Value $Content -Encoding UTF8
}

function Slug {
  param([string]$Text)
  $s = $Text.ToLowerInvariant()
  $s = $s -replace '[^a-z0-9]+','-'
  $s = $s.Trim('-')
  return $s
}

$exportedAt = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssK")
$repoName = "puretronics-funnel-build"
$notionParent = "https://app.notion.com/p/37d3dd29567d8276adfd81f554906805"

$pages = @(
  @{ title="Puretronics India Private Limited"; id="37d3dd29567d8276adfd81f554906805"; url="https://app.notion.com/p/37d3dd29567d8276adfd81f554906805"; repo_path="README.md"; category="workspace-parent"; authority="navigation-index" },
  @{ title="Input Files - Wire and Cable Industry Product Portfolio"; id="3383dd29567d8266bcf3013893c23fd4"; url="https://app.notion.com/p/3383dd29567d8266bcf3013893c23fd4"; repo_path="docs/04-source-archive/input-files-index.md"; category="raw-source-archive"; authority="historical-source" },
  @{ title="Master Document - Wire and Cable Industry Product Portfolio and Technical Reference"; id="d4a3dd29567d83d1b1e20155d6c3d3f2"; url="https://app.notion.com/p/d4a3dd29567d83d1b1e20155d6c3d3f2"; repo_path="docs/03-product-intelligence/master-product-portfolio-technical-reference.md"; category="product-intelligence"; authority="technical-reference" },
  @{ title="Puretronics Wire & Cable Product Master Database"; id="c303dd29567d83f9bfc301995427e6e7"; url="https://app.notion.com/p/c303dd29567d83f9bfc301995427e6e7"; repo_path="data/product-master/"; category="database"; authority="product-intelligence-source" },
  @{ title="Puretronics Wire & Cable Product Intelligence Hub"; id="c5c3dd29567d8304bb3e81ffce55f094"; url="https://app.notion.com/p/c5c3dd29567d8304bb3e81ffce55f094"; repo_path="docs/03-product-intelligence/product-intelligence-hub.md"; category="product-intelligence"; authority="operating-guide" },
  @{ title="Master User-Guide - Puretronics Wire & Cable Product Database"; id="88f3dd29567d8348b3f9811b30824878"; url="https://app.notion.com/p/88f3dd29567d8348b3f9811b30824878"; repo_path="docs/03-product-intelligence/master-user-guide-product-database.md"; category="product-intelligence"; authority="operating-guide" },
  @{ title="Internal Copy - Annexure A | Funnel Architecture"; id="6843dd29567d82b0af5d01d9657188e2"; url="https://app.notion.com/p/6843dd29567d82b0af5d01d9657188e2"; repo_path="docs/01-funnel-architecture/internal-copy-annexure-a-funnel-architecture.md"; category="funnel-architecture"; authority="internal-working-copy" },
  @{ title="Annexure A | Funnel Architecture"; id="a6b3dd29567d82eca75a01da552644bb"; url="https://app.notion.com/p/a6b3dd29567d82eca75a01da552644bb"; repo_path="docs/01-funnel-architecture/annexure-a-funnel-architecture.md"; category="funnel-architecture"; authority="aligned-reference" },
  @{ title="Annexure B | Commercial Structure & Pricing"; id="d1c3dd29567d82dcb12a81fd1325f84f"; url="https://app.notion.com/p/d1c3dd29567d82dcb12a81fd1325f84f"; repo_path="docs/02-commercial/annexure-b-commercial-structure-pricing.md"; category="commercial"; authority="aligned-reference" },
  @{ title="Services Agreement - Final Signature Copy"; id="3ac3dd29567d80149762e193b61bc191"; url="https://app.notion.com/p/3ac3dd29567d80149762e193b61bc191"; repo_path="docs/00-governance/services-agreement-final-signature-copy.md"; category="signed-agreement"; authority="locked-source-of-truth" }
)

$rawInputs = @(
  @{ title="Laser Diameter Gauge"; id="9c33dd29567d83728e3281201cfa9bf9"; url="https://app.notion.com/p/9c33dd29567d83728e3281201cfa9bf9" },
  @{ title="Static Powder Applicator"; id="6673dd29567d821c8a27017ae8c4b2d0"; url="https://app.notion.com/p/6673dd29567d821c8a27017ae8c4b2d0" },
  @{ title="Butt Welding Machine"; id="7f03dd29567d827ba260010d8dd891a7"; url="https://app.notion.com/p/7f03dd29567d827ba260010d8dd891a7" },
  @{ title="Fire Resistance Cable Testing System"; id="2b43dd29567d82fca9400126dff11aa1"; url="https://app.notion.com/p/2b43dd29567d82fca9400126dff11aa1" },
  @{ title="Inline Induction Wire Preheater"; id="9c63dd29567d835ea69f8133a0b00e48"; url="https://app.notion.com/p/9c63dd29567d835ea69f8133a0b00e48" },
  @{ title="Loadcell"; id="8bc3dd29567d82629931814e557073e7"; url="https://app.notion.com/p/8bc3dd29567d82629931814e557073e7" },
  @{ title="LTC-PRO"; id="61c3dd29567d835ea606019eb29af383"; url="https://app.notion.com/p/61c3dd29567d835ea606019eb29af383" },
  @{ title="Pneumatic Brake"; id="86d3dd29567d8259b33101edb2c599a3"; url="https://app.notion.com/p/86d3dd29567d8259b33101edb2c599a3" },
  @{ title="Spark Tester with IoT Accessories"; id="edb3dd29567d8326a3c801d6b99cb699"; url="https://app.notion.com/p/edb3dd29567d8326a3c801d6b99cb699" },
  @{ title="Spark Tester"; id="cb63dd29567d82f1aef401a0732c5d57"; url="https://app.notion.com/p/cb63dd29567d82f1aef401a0732c5d57" },
  @{ title="Spark Tester Sensitivity Calibrator"; id="9f93dd29567d83fda16901acfa241728"; url="https://app.notion.com/p/9f93dd29567d83fda16901acfa241728" },
  @{ title="Wire & Cable Brochure"; id="1323dd29567d82d1b9e8811a69f1f184"; url="https://app.notion.com/p/1323dd29567d82d1b9e8811a69f1f184" },
  @{ title="Wire Tension Indicator"; id="5bf3dd29567d821fbb6e81247973a4fb"; url="https://app.notion.com/p/5bf3dd29567d821fbb6e81247973a4fb" },
  @{ title="Wire Tension Indicator with IoT"; id="c2c3dd29567d83bb9ed98106a68a3de7"; url="https://app.notion.com/p/c2c3dd29567d83bb9ed98106a68a3de7" }
)

$primaryNote = "Covered by signed Services Agreement Annexure A dated 9 July 2026. Product intelligence must remain within the signed Wire & Cable pilot scope; final specs/configuration to be verified where row caveats require."
$supportNote = "Covered as a support item only under signed Services Agreement Annexure A dated 9 July 2026; no standalone page, campaign, form, automation, outreach sequence, SEO asset, selector, calculator, configurator, or extra deliverable unless separately approved in writing."

$products = @(
  @{ name="AC HV Tester"; row_type="Product"; family="Fault & Safety Testing"; priority="Supporting"; treatment="Covered Primary / Variant"; note=$primaryNote },
  @{ name="Acute Spark Tester"; row_type="Product"; family="Fault & Safety Testing"; priority="Strategic"; treatment="Covered Primary / Variant"; note=$primaryNote },
  @{ name="AX-250 Pneumatic Brake"; row_type="Model / Variant"; family="Tension / Braking / Automation"; priority="Strategic"; treatment="Covered Primary / Variant"; note=$primaryNote },
  @{ name="AX-400 Pneumatic Brake"; row_type="Model / Variant"; family="Tension / Braking / Automation"; priority="Strategic"; treatment="Covered Primary / Variant"; note=$primaryNote },
  @{ name="AX-500 Pneumatic Brake"; row_type="Model / Variant"; family="Tension / Braking / Automation"; priority="Strategic"; treatment="Covered Primary / Variant"; note=$primaryNote },
  @{ name="Butt Welding Machine"; row_type="Product"; family="Process Enhancement"; priority="Supporting"; treatment="Covered Primary / Variant"; note=$primaryNote },
  @{ name="DC HV Tester"; row_type="Product"; family="Fault & Safety Testing"; priority="Strategic"; treatment="Covered Primary / Variant"; note=$primaryNote },
  @{ name="DC Spark Tester"; row_type="Product"; family="Fault & Safety Testing"; priority="Strategic"; treatment="Covered Primary / Variant"; note=$primaryNote },
  @{ name="Fire Resistance Cable Testing System"; row_type="System"; family="Fault & Safety Testing"; priority="Hero"; treatment="Covered Primary / Variant"; note=$primaryNote },
  @{ name="Inline Induction Wire Preheater - 1000 m/min"; row_type="Model / Variant"; family="Process Enhancement"; priority="Strategic"; treatment="Covered Primary / Variant"; note=$primaryNote },
  @{ name="Inline Induction Wire Preheater - 1500 m/min"; row_type="Model / Variant"; family="Process Enhancement"; priority="Strategic"; treatment="Covered Primary / Variant"; note=$primaryNote },
  @{ name="Inline Induction Wire Preheater - 2000 m/min"; row_type="Model / Variant"; family="Process Enhancement"; priority="Strategic"; treatment="Covered Primary / Variant"; note=$primaryNote },
  @{ name="Laser / Measurement Accessories Group"; row_type="Accessory"; family="Online Measurement"; priority="Supporting"; treatment="Covered Support Item"; note=$supportNote },
  @{ name="LASER 2008B"; row_type="Model / Variant"; family="Online Measurement"; priority="Strategic"; treatment="Covered Primary / Variant"; note=$primaryNote },
  @{ name="Laser Diameter Gauge / LASER 2008"; row_type="Model / Variant"; family="Online Measurement"; priority="Hero"; treatment="Covered Primary / Variant"; note=$primaryNote },
  @{ name="LASER-2010H"; row_type="Model / Variant"; family="Online Measurement"; priority="Strategic"; treatment="Covered Primary / Variant"; note=$primaryNote },
  @{ name="LASER-2012"; row_type="Model / Variant"; family="Online Measurement"; priority="Strategic"; treatment="Covered Primary / Variant"; note=$primaryNote },
  @{ name="LASER-2020H"; row_type="Model / Variant"; family="Online Measurement"; priority="Hero"; treatment="Covered Primary / Variant"; note=$primaryNote },
  @{ name="LASER-2030"; row_type="Model / Variant"; family="Online Measurement"; priority="Strategic"; treatment="Covered Primary / Variant"; note=$primaryNote },
  @{ name="LASER-2030H"; row_type="Model / Variant"; family="Online Measurement"; priority="Strategic"; treatment="Covered Primary / Variant"; note=$primaryNote },
  @{ name="LASER-2060"; row_type="Model / Variant"; family="Online Measurement"; priority="Strategic"; treatment="Covered Primary / Variant"; note=$primaryNote },
  @{ name="Live Spark Tester"; row_type="Product"; family="Fault & Safety Testing"; priority="Hero"; treatment="Covered Primary / Variant"; note=$primaryNote },
  @{ name="Loadcell Accessories / Integration Items"; row_type="Accessory"; family="Tension / Braking / Automation"; priority="Supporting"; treatment="Covered Support Item"; note=$supportNote },
  @{ name="Loadcell AR-118 Series"; row_type="Model / Variant"; family="Tension / Braking / Automation"; priority="Strategic"; treatment="Covered Primary / Variant"; note=$primaryNote },
  @{ name="Loadcell AR-125 Series"; row_type="Model / Variant"; family="Tension / Braking / Automation"; priority="Strategic"; treatment="Covered Primary / Variant"; note=$primaryNote },
  @{ name="Loadcell AR-85 Series"; row_type="Model / Variant"; family="Tension / Braking / Automation"; priority="Strategic"; treatment="Covered Primary / Variant"; note=$primaryNote },
  @{ name="Loadcell AR-ST Series"; row_type="Model / Variant"; family="Tension / Braking / Automation"; priority="Strategic"; treatment="Covered Primary / Variant"; note=$primaryNote },
  @{ name="Loadcell LC-AR-60 Series"; row_type="Model / Variant"; family="Tension / Braking / Automation"; priority="Supporting"; treatment="Covered Primary / Variant"; note=$primaryNote },
  @{ name="Loadcell LC-AR-HD Series"; row_type="Model / Variant"; family="Tension / Braking / Automation"; priority="Strategic"; treatment="Covered Primary / Variant"; note=$primaryNote },
  @{ name="LSP-G1 Static Powder Applicator"; row_type="Model / Variant"; family="Process Enhancement"; priority="Hero"; treatment="Covered Primary / Variant"; note=$primaryNote },
  @{ name="LSP-G2 Static Powder Applicator"; row_type="Model / Variant"; family="Process Enhancement"; priority="Hero"; treatment="Covered Primary / Variant"; note=$primaryNote },
  @{ name="LTC-PRO Web Tension Controller"; row_type="Product"; family="Tension / Braking / Automation"; priority="Hero"; treatment="Covered Primary / Variant"; note=$primaryNote },
  @{ name="Spark Tester IoT Stage 1 Fault Interface"; row_type="Accessory"; family="Fault & Safety Testing"; priority="Supporting"; treatment="Covered Support Item"; note=$supportNote },
  @{ name="Spark Tester IoT Stage 2 Data Logging & Graphics"; row_type="Accessory"; family="Fault & Safety Testing"; priority="Supporting"; treatment="Covered Support Item"; note=$supportNote },
  @{ name="Spark Tester IoT Stage 3 Inline Marking System"; row_type="Accessory"; family="Fault & Safety Testing"; priority="Supporting"; treatment="Covered Support Item"; note=$supportNote },
  @{ name="Spark Tester Sensitivity Calibrator"; row_type="Accessory"; family="Fault & Safety Testing"; priority="Supporting"; treatment="Covered Support Item"; note=$supportNote },
  @{ name="Wire Tension Indicator WTI-100-40"; row_type="Model / Variant"; family="Tension / Braking / Automation"; priority="Strategic"; treatment="Covered Primary / Variant"; note=$primaryNote },
  @{ name="Wire Tension Indicator WTI-90-40"; row_type="Model / Variant"; family="Tension / Braking / Automation"; priority="Strategic"; treatment="Covered Primary / Variant"; note=$primaryNote }
)

$dirs = @(
  "docs/00-governance",
  "docs/01-funnel-architecture",
  "docs/02-commercial",
  "docs/03-product-intelligence/products",
  "docs/04-source-archive/raw-child-source-pages",
  "data/product-master",
  "data/notion-export/raw-page-fetches",
  "data/notion-export/raw-database-fetches",
  "funnel-build/page-specs",
  "funnel-build/forms-and-routing",
  "funnel-build/technical-library",
  "funnel-build/dashboard-and-reporting",
  "funnel-build/qa-checklists",
  "activation/content",
  "activation/linkedin-outreach",
  "activation/cold-email",
  "activation/reporting",
  "project-ops",
  "scripts"
)

foreach ($d in $dirs) { Ensure-Dir (Join-Path $Root $d) }

$sourceMap = @{
  generated_at = $exportedAt
  repo_name = $repoName
  notion_parent = $notionParent
  export_status = "structure-and-governance export complete; raw block-perfect export pending refreshed Notion connector access"
  core_pages = $pages
  raw_input_pages = $rawInputs
  product_database = @{
    database_id = "c303dd29567d83f9bfc301995427e6e7"
    data_source_id = "c643dd29-567d-82e8-b556-0710db1026be"
    row_count_verified_during_planning = 38
    repo_paths = @("data/product-master/schema.json", "data/product-master/views.json", "data/product-master/rows.json", "data/product-master/rows.csv", "docs/03-product-intelligence/products/")
  }
}

Write-Utf8 (Join-Path $Root "notion-source-map.json") (($sourceMap | ConvertTo-Json -Depth 8) + "`n")

$readme = @"
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

1. `docs/00-governance/services-agreement-final-signature-copy.md` is the locked legal and commercial source of truth once the raw Notion export is refreshed into this repo.
2. The signed Services Agreement dated 9 July 2026 governs scope, commercials, exclusions, deliverables, approvals, and change control.
3. The Product Master Database is the product-intelligence source, not the legal or commercial authority.
4. Support items cannot become standalone pages, campaigns, forms, automations, SEO assets, selectors, calculators, configurators, or extra deliverables unless separately approved in writing.

## Navigation

- Governance: `docs/00-governance/`
- Funnel architecture: `docs/01-funnel-architecture/`
- Commercials: `docs/02-commercial/`
- Product intelligence: `docs/03-product-intelligence/`
- Raw source archive: `docs/04-source-archive/`
- Structured product data: `data/product-master/`
- Build work: `funnel-build/`
- Activation work: `activation/`
- Project operations: `project-ops/`

## Current Export Status

This initial repository was generated from verified Notion inventory, schema, page summaries, and product row data available in the Codex task context. The live Notion connector became unavailable during execution, so raw block-perfect page snapshots are marked as pending refresh in `migration-manifest.md`.

Before treating this repository as the final archival mirror, run a refresh pass from Notion and replace `data/notion-export/raw-page-fetches/` with exact fetched content.
"@
Write-Utf8 (Join-Path $Root "README.md") $readme

Write-Utf8 (Join-Path $Root "CONFIDENTIALITY.md") @"
# Confidentiality

This is a private client workspace for Puretronics India Private Limited and Stratagem Olympus LLP.

It may contain confidential commercial, legal, technical, product, campaign, prospecting, and operational information.

Do not make this repository public. Do not publish signed agreement material, bank details, legal identifiers, client data, access credentials, outreach lists, or campaign data without explicit written authorization.
"@

Write-Utf8 (Join-Path $Root "LICENSE.md") @"
# Proprietary

All content in this repository is proprietary and confidential unless a file explicitly says otherwise.

No license is granted for public reuse, redistribution, sublicensing, or publication.
"@

$manifest = @"
# Migration Manifest

Generated at: $exportedAt

## Source Workspace

- Notion parent: $notionParent
- Client: Puretronics India Private Limited
- Engagement: Wire & Cable demand-generation funnel build
- Signed agreement date: 9 July 2026

## Exported Structure

- Core Notion pages mapped: $($pages.Count)
- Raw input child pages mapped: $($rawInputs.Count)
- Product database rows represented: $($products.Count)
- Product database rows verified during planning: 38

## Important Export Limitation

During planning, Notion fetch/query access was available and confirmed the workspace map, database schema, database row count, and row governance fields. During execution, the live Notion fetch/query tools stopped being exposed by tool discovery. This repo therefore contains a faithful build-workspace migration, source map, schema summary, row export, and governance docs, but the raw block-perfect Notion page snapshots are pending a refresh pass.

## Required Refresh Gate

Before calling this a final archival mirror:

1. Re-fetch each page listed in notion-source-map.json.
2. Save exact raw Notion-flavored Markdown to data/notion-export/raw-page-fetches/.
3. Re-query the database and replace data/product-master/rows.json and data/product-master/rows.csv with all properties.
4. Re-run the validation checklist in funnel-build/qa-checklists/migration-validation.md.

## Signed Commercial Facts

- Effective date: 9 July 2026
- Pilot term: 15 July 2026 to 31 December 2027
- Build period: July-August 2026
- Activation period: September 2026 to December 2027
- One-time build: INR 5,50,000
- Monthly retainer: INR 65,000/month for 16 months
- Retainer total: INR 10,40,000
- Total project value excluding taxes: INR 15,90,000
"@
Write-Utf8 (Join-Path $Root "migration-manifest.md") $manifest

Write-Utf8 (Join-Path $Root "docs/00-governance/signed-scope-summary.md") @"
# Signed Scope Summary

The Services Agreement dated 9 July 2026 is the locked source of truth.

## Term

- Pilot project: 15 July 2026 to 31 December 2027
- One-Time Custom Funnel Build: July-August 2026
- Monthly Demand Activation Retainer: September 2026 to December 2027

## Commercial Structure

- One-time build fee: INR 5,50,000
- Monthly retainer: INR 65,000 per month
- Retainer duration: 16 months
- Total retainer value: INR 10,40,000
- Total project value excluding taxes: INR 15,90,000

## Monthly Activation Scope

- 4 technical thought-leadership/document assets per month
- 8 Company Page distribution posts/assets per month
- 8 leadership or sales-profile LinkedIn posts/assets per month
- Outreach to 300 LinkedIn prospects per month
- Up to 20,000 campaign email sends per month

## Scope Rule

Products, variants, and accessories may be grouped logically. Inclusion in the signed product list does not automatically require separate pages, campaigns, forms, automations, or assets for every product, variant, model, or accessory.
"@

Write-Utf8 (Join-Path $Root "docs/00-governance/exclusions-and-change-control.md") @"
# Exclusions And Change Control

Excluded unless separately approved in writing:

- Products not listed in signed Annexure A
- Product categories outside the Wire & Cable pilot scope
- Additional standalone product pages
- Additional campaigns
- Paid advertising and media buying
- SEO
- Domain procurement and mailbox procurement
- Prospect database costs, list building, enrichment, and verification
- Photography, videography, travel, printing, and trade show support
- Sales closure responsibility
- Legal, regulatory, or region-specific data-governance advisory
- Product selectors, calculators, configurators, export expansion, OEM/partner expansion, multilingual expansion, or anything not expressly included

Support items remain support-only unless written approval expands scope, fees, and timelines.
"@

Write-Utf8 (Join-Path $Root "docs/00-governance/services-agreement-final-signature-copy.md") @"
# Services Agreement - Final Signature Copy

Source Notion page: https://app.notion.com/p/3ac3dd29567d80149762e193b61bc191

## Locked Authority

This file is the repo placeholder for the signed Services Agreement final signature copy. The signed agreement remains the legal and commercial source of truth.

## Refresh Required

The exact raw Notion-flavored Markdown must be re-exported from the source page into this file or into `data/notion-export/raw-page-fetches/services-agreement-final-signature-copy.md` before this repo is treated as a complete legal archive.

## Known Signed Facts

- Effective date: 9 July 2026
- Pilot project: 15 July 2026 to 31 December 2027
- One-time build: INR 5,50,000
- Monthly retainer: INR 65,000/month for 16 months
- Total project value: INR 15,90,000 excluding taxes
"@

$annexureA = @"
# Annexure A | Funnel Architecture

Source Notion page: https://app.notion.com/p/a6b3dd29567d82eca75a01da552644bb

## Signed Agreement Alignment

This architecture is aligned to the signed Services Agreement dated 9 July 2026.

- Pilot project: 15 July 2026 to 31 December 2027
- Build period: July-August 2026
- Activation period: September 2026 to December 2027

Commercial terms, payment terms, exclusions, and scope-change handling are governed by the signed Services Agreement.

## Core Funnel Architecture

The Puretronics Wire & Cable Demand Engine converts production problems, testing needs, measurement requirements, process-control challenges, and integration opportunities into qualified technical conversations through:

1. Wire & Cable Industry Landing Page
2. Three Buyer Navigation Modes
3. Five Solution Blocks
4. Technical Library
5. Adaptive Requirement Form
6. Internal Routing and Follow-Up Logic
7. Dashboard and Management Visibility

## Three Buyer Navigation Modes

- Find by Problem
- Find by Production Stage
- Find by Product Family

## Five Solution Blocks

| Solution Block | Role |
| --- | --- |
| Online Measurement & Dimensional Control | Laser diameter, ovality, width, thickness, and measurement confidence |
| Spark Testing & Insulation Fault Detection | Live Spark, Acute Spark, DC Spark, and support-only fault intelligence |
| HV & Cable Validation | AC HV, DC HV, and offline insulation validation |
| Fire Resistance Cable Testing | Fire/water/shock compliance-led testing conversations |
| Line Stability, Adhesion & Tension Control | Preheater, LSP, Butt Welding, WTI, LTC-PRO, Loadcells, and Pneumatic Brake |

## Section 7 Defect Guard

The malformed residual bullet block previously found under Section 7 must not be reintroduced:

- No duplicate LTC-PRO proof-asset bullet detached from the table
- No nested pneumatic brake table bullet under an unrelated item
- No duplicate output/integration proof bullet
- No stray downloadable-asset bullet outside the proof stack
- No generic FAQ bullet detached from the proof stack

## Scope Caveat

Accessories and fault-intelligence items are support-only and do not imply standalone pages, campaigns, forms, automations, SEO assets, selectors, calculators, configurators, or extra deliverables unless separately approved in writing.
"@
Write-Utf8 (Join-Path $Root "docs/01-funnel-architecture/annexure-a-funnel-architecture.md") $annexureA
Write-Utf8 (Join-Path $Root "docs/01-funnel-architecture/internal-copy-annexure-a-funnel-architecture.md") ($annexureA -replace "# Annexure A \| Funnel Architecture", "# Internal Copy - Annexure A | Funnel Architecture")

Write-Utf8 (Join-Path $Root "docs/01-funnel-architecture/funnel-page-and-asset-map.md") @"
# Funnel Page And Asset Map

## Initial Build Pages

1. Wire & Cable Industry Landing Page
2. Online Measurement & Dimensional Control
3. Spark Testing & Insulation Fault Detection
4. HV & Cable Validation
5. Fire Resistance Cable Testing System
6. Line Stability, Adhesion & Tension Control
7. Technical Library
8. Adaptive Requirement Form
9. Service & Support
10. OEM Integration Section / Compact Page

## Technical Library Proof Stack

- Technical datasheets
- Product/model comparison tables
- Application explainers
- Production-stage diagrams
- Standards relevance notes
- Output/integration notes
- Sample report or data-output examples
- Demo/evaluation workflow
- Service capability proof
- FAQs
"@

Write-Utf8 (Join-Path $Root "docs/02-commercial/annexure-b-commercial-structure-pricing.md") @"
# Annexure B | Commercial Structure & Pricing

Source Notion page: https://app.notion.com/p/d1c3dd29567d82dcb12a81fd1325f84f

## Signed Commercial Structure

| Component | Period | Value excluding taxes |
| --- | --- | --- |
| One-Time Custom Funnel Build | July-August 2026 | INR 5,50,000 |
| Monthly Demand Activation Retainer | September 2026 to December 2027 | INR 65,000/month for 16 months |
| Total Monthly Retainer Value | 16 months | INR 10,40,000 |
| Total Project Value | 15 July 2026 to 31 December 2027 | INR 15,90,000 |

## Payment Terms

- Advance: INR 3,30,000 payable upon execution
- Balance: INR 2,20,000 payable by 31 August 2026, Go-Live, or full completion, whichever occurs earlier
- Monthly retainer payment window: 15th to 20th day of every month for the same month

## Monthly Scope

- 4 technical thought-leadership/document assets per month
- 8 Company Page distribution posts/assets per month
- 8 leadership or sales-profile LinkedIn posts/assets per month
- LinkedIn outreach to 300 prospects per month
- 1 connection request plus 2 follow-ups
- Up to 20,000 campaign email sends per month
- Additional email sends: INR 0.50 per additional email, subject to prior written approval

## Exclusions

Use `docs/00-governance/exclusions-and-change-control.md` for the governing exclusion list.
"@

Write-Utf8 (Join-Path $Root "docs/03-product-intelligence/product-intelligence-hub.md") @"
# Puretronics Wire & Cable Product Intelligence Hub

Use this hub as the product-intelligence operating layer for Puretronics Wire & Cable work.

The signed Services Agreement dated 9 July 2026 remains the legal and commercial source of truth for contracted scope, covered products, exclusions, commercials, deliverables, and scope changes.

## Navigation Order

1. Check the signed Services Agreement and aligned Annexure A/B for scope-sensitive work.
2. Use `data/product-master/rows.json` for product intelligence.
3. Use product pages in `docs/03-product-intelligence/products/` for human-readable row summaries.
4. Use `data/product-master/schema.json` and `views.json` before changing database structure.

## Governance Notes

- The product database is the single product-intelligence source.
- It does not override the signed agreement.
- Accessories and support items cannot become standalone deliverables without written approval.
"@

Write-Utf8 (Join-Path $Root "docs/03-product-intelligence/master-user-guide-product-database.md") @"
# Master User Guide - Puretronics Wire & Cable Product Database

## Agreement Governance Protocol

1. Signed agreement first for scope, commercials, exclusions, deliverables, approvals, and change-control rules.
2. Annexure A/B for aligned funnel and commercial interpretation.
3. Product database for product intelligence, technical reference, buyer problems, sales positioning, and source/spec governance.
4. Support items remain support-only.

## Key Row Types

- Product
- Model / Variant
- Accessory
- System

## Key Fields

- Product / Model Name
- Product Family
- Product Type
- Row Type
- Sales Priority
- Manufacturing Flow Stage
- Solution Theme
- Signed Scope Treatment
- Signed Scope Note
- Spec Confidence

## AI-Agent Protocol

Do not invent specs, standards, certifications, dimensions, weights, or integration details absent from source rows. Do not collapse WTI, Loadcells, Pneumatic Brakes, and LTC-PRO into one generic tension product.
"@

Write-Utf8 (Join-Path $Root "docs/03-product-intelligence/master-product-portfolio-technical-reference.md") @"
# Master Document - Wire and Cable Industry Product Portfolio and Technical Reference

This document is the repo-level technical reference placeholder for the Notion master document.

## Signed Scope Overlay

The master product-intelligence document is aligned to the signed Services Agreement dated 9 July 2026. It remains a technical and sales reference, while the signed Services Agreement remains the legal and commercial source of truth.

## Covered Product Universe

See `data/product-master/rows.json` and generated product pages under `docs/03-product-intelligence/products/`.

## Support-Only Rule

Laser accessories, spark tester fault-intelligence/accessory items, and loadcell accessories are support items only. Their inclusion does not imply standalone pages, campaigns, forms, automations, outreach sequences, SEO, product selectors, calculators, configurators, export/OEM/partner/multilingual expansion, or additional product pages unless separately approved in writing.
"@

Write-Utf8 (Join-Path $Root "docs/04-source-archive/input-files-index.md") @"
# Input Files - Wire and Cable Industry Product Portfolio

This is the raw source archive index. It is not the signed scope, commercial scope, or delivery scope.

The signed Services Agreement dated 9 July 2026 governs covered products, exclusions, commercials, deliverables, and scope-control treatment.

## Raw Input Pages

$(
  ($rawInputs | ForEach-Object { "- [$($_.title)]($($_.url))" }) -join "`n"
)
"@

foreach ($raw in $rawInputs) {
  $slug = Slug $raw.title
  Write-Utf8 (Join-Path $Root "docs/04-source-archive/raw-child-source-pages/$slug.md") @"
# $($raw.title)

Source Notion page: $($raw.url)

Raw content refresh pending live Notion connector access.

This file exists to preserve the source archive structure inside GitHub and to provide a stable destination for the next exact Notion export pass.
"@
}

$schema = @{
  data_source_id = "c643dd29-567d-82e8-b556-0710db1026be"
  title_property = "Product / Model Name"
  row_count_verified = 38
  governance_properties = @("Signed Scope Treatment", "Signed Scope Note", "Spec Confidence", "Important Caveats")
  signed_scope_treatment_options = @("Covered Primary / Variant", "Covered Support Item", "Reference Only", "Out of Signed Scope")
  row_type_options = @("Product", "Model / Variant", "Accessory", "System")
  product_family_options = @("Online Measurement", "Fault & Safety Testing", "Process Enhancement", "Tension / Braking / Automation")
  sales_priority_options = @("Hero", "Strategic", "Supporting", "Niche")
  export_limitation = "Initial rows contain governance/identity fields verified during planning; full all-property export requires refreshed Notion query access."
}
Write-Utf8 (Join-Path $Root "data/product-master/schema.json") (($schema | ConvertTo-Json -Depth 6) + "`n")

$views = @(
  @{ name="00 Admin - All Properties"; type="table"; purpose="Full maintenance view for database operators" },
  @{ name="01 Sales Snapshot"; type="table"; purpose="Quick commercial overview for sales and proposal work" },
  @{ name="02 Manufacturing Flow"; type="table"; purpose="Ordered production-line map" },
  @{ name="03 Buyer Discovery"; type="table"; purpose="Persona, problem, question, CTA, and sales-note view" },
  @{ name="04 Product Family Navigator"; type="table"; purpose="Portfolio navigation by product family" },
  @{ name="05 Hero Products"; type="table"; purpose="Proposal anchors and funnel-first products" },
  @{ name="06 Technical Lookup"; type="table"; purpose="Technical comparison and configuration support" },
  @{ name="07 Connected Factory / Industry 4.0"; type="table"; purpose="Connected/data/HMI/ERP/reporting/control products" },
  @{ name="08 Proposal & Funnel Builder"; type="table"; purpose="Funnel stage and proposal planning" },
  @{ name="09 Cross-Sell & Bundles"; type="table"; purpose="Bundle logic and complementary mapping" },
  @{ name="10 Source & Spec Governance"; type="table"; purpose="Source coverage, caveats, and quotation-risk review" },
  @{ name="Context Tags"; type="table"; purpose="Flexible process/application filtering" }
)
Write-Utf8 (Join-Path $Root "data/product-master/views.json") (($views | ConvertTo-Json -Depth 5) + "`n")
Write-Utf8 (Join-Path $Root "data/product-master/rows.json") (($products | ConvertTo-Json -Depth 6) + "`n")

$csvRows = @("Product / Model Name,Row Type,Product Family,Sales Priority,Signed Scope Treatment,Signed Scope Note")
foreach ($p in $products) {
  $vals = @($p.name, $p.row_type, $p.family, $p.priority, $p.treatment, $p.note) | ForEach-Object {
    '"' + ($_ -replace '"','""') + '"'
  }
  $csvRows += ($vals -join ",")
}
Write-Utf8 (Join-Path $Root "data/product-master/rows.csv") ($csvRows -join "`n")

$checklist = @{
  signed_products_expected = @("LASER 2008", "LASER 2008B", "LASER-2060", "LASER-2012", "LASER-2030", "LASER-2010H", "LASER-2020H", "LASER-2030H", "WTI-90-40", "WTI-100-40", "Live Spark", "Acute Spark", "DC Spark", "AC HV", "DC HV", "Fire Resistance Cable Testing System", "Inline Induction Wire Preheater 1000", "Inline Induction Wire Preheater 1500", "Inline Induction Wire Preheater 2000", "LSP-G1", "LSP-G2", "Butt Welding Machine", "LTC-PRO", "AR-85", "AR-118", "AR-125", "AR-ST", "LC-AR-60", "LC-AR-HD", "AX-250", "AX-400", "AX-500")
  support_items_expected = @("Laser / Measurement Accessories Group", "Spark Tester IoT Stage 1 Fault Interface", "Spark Tester IoT Stage 2 Data Logging & Graphics", "Spark Tester IoT Stage 3 Inline Marking System", "Spark Tester Sensitivity Calibrator", "Loadcell Accessories / Integration Items")
}
Write-Utf8 (Join-Path $Root "data/product-master/signed-scope-checklist.json") (($checklist | ConvertTo-Json -Depth 5) + "`n")

foreach ($p in $products) {
  $slug = Slug $p.name
  $content = @"
# $($p.name)

| Field | Value |
| --- | --- |
| Row Type | $($p.row_type) |
| Product Family | $($p.family) |
| Sales Priority | $($p.priority) |
| Signed Scope Treatment | $($p.treatment) |

## Signed Scope Note

$($p.note)

## Operating Rule

Use this page as a product-intelligence row summary. Confirm final technical specifications, configuration, and quotation details against source materials and Puretronics validation before external commitment.
"@
  Write-Utf8 (Join-Path $Root "docs/03-product-intelligence/products/$slug.md") $content
}

Write-Utf8 (Join-Path $Root "funnel-build/page-specs/README.md") @"
# Page Specs

Use this folder for build-ready page specifications derived from Annexure A.

Initial page set:

- Wire & Cable Industry Landing Page
- Online Measurement & Dimensional Control
- Spark Testing & Insulation Fault Detection
- HV & Cable Validation
- Fire Resistance Cable Testing System
- Line Stability, Adhesion & Tension Control
- Technical Library
- Adaptive Requirement Form
- Service & Support
- OEM Integration Section / Compact Page
"@

Write-Utf8 (Join-Path $Root "funnel-build/forms-and-routing/README.md") @"
# Forms And Routing

This folder will hold the adaptive requirement form specification, conditional fields, routing logic, lead classification, and service-support separation rules.
"@

Write-Utf8 (Join-Path $Root "funnel-build/technical-library/README.md") @"
# Technical Library

This folder will hold proof assets, comparison tables, standards notes, integration notes, FAQs, and request-proof-pack logic.
"@

Write-Utf8 (Join-Path $Root "funnel-build/dashboard-and-reporting/README.md") @"
# Dashboard And Reporting

This folder will hold the dashboard model for product interest, buyer segment, problem area, enquiry quality, routing ownership, and activation performance.
"@

Write-Utf8 (Join-Path $Root "funnel-build/qa-checklists/migration-validation.md") @"
# Migration Validation Checklist

- [ ] All 10 core Notion assets are mapped in `notion-source-map.json`.
- [ ] All 14 raw input child pages are mapped.
- [ ] Product database row count is 38 after refreshed Notion query.
- [ ] `rows.json` and `rows.csv` include every database property after refresh.
- [ ] All signed products and variants exist.
- [ ] All support items are marked `Covered Support Item`.
- [ ] Annexure A Section 7 malformed bullet block is absent.
- [ ] Signed commercial facts match the Services Agreement.
- [ ] No support item implies standalone pages, campaigns, forms, automations, SEO assets, selectors, calculators, configurators, or extra deliverables.
- [ ] Repository remains private.
"@

Write-Utf8 (Join-Path $Root "activation/content/README.md") "# Content Activation`n`nMonthly content production scope: 4 technical thought-leadership/document assets, 8 Company Page posts/assets, and 8 leadership or sales-profile LinkedIn posts/assets.`n"
Write-Utf8 (Join-Path $Root "activation/linkedin-outreach/README.md") "# LinkedIn Outreach`n`nSigned monthly scope: outreach to 300 prospects per month with 1 connection request and 2 follow-ups, plus optimization, reporting, and assisted inbox management.`n"
Write-Utf8 (Join-Path $Root "activation/cold-email/README.md") "# Cold Email`n`nSigned monthly scope: up to 20,000 campaign email sends per month, core sequence setup, basic reply triage, optimization, reporting, and CSV/manual lead handoff.`n"
Write-Utf8 (Join-Path $Root "activation/reporting/README.md") "# Reporting`n`nUse this folder for monthly activation reporting and campaign-quality review.`n"

Write-Utf8 (Join-Path $Root "project-ops/roadmap.md") @"
# Roadmap

1. Refresh exact Notion raw export.
2. Lock repository migration validation.
3. Convert Annexure A into build-ready page specs.
4. Build funnel content architecture.
5. Build technical library.
6. Build form and routing logic.
7. Build dashboard/reporting model.
8. Prepare activation execution system.
"@

Write-Utf8 (Join-Path $Root "project-ops/implementation-checklist.md") @"
# Implementation Checklist

- [ ] Re-fetch Notion raw pages.
- [ ] Re-export full database rows with all properties.
- [ ] Validate signed scope.
- [ ] Write landing page spec.
- [ ] Write five solution-block page specs.
- [ ] Write technical library spec.
- [ ] Write adaptive form spec.
- [ ] Write routing and dashboard specs.
- [ ] Prepare activation workboards.
"@

Write-Utf8 (Join-Path $Root "project-ops/change-log.md") "# Change Log`n`n## $exportedAt`n`n- Created initial GitHub build workspace from verified Notion inventory and product row governance data.`n"
Write-Utf8 (Join-Path $Root "project-ops/open-questions.md") "# Open Questions`n`n- Refresh exact Notion raw export once connector access is available in execution context.`n"

foreach ($p in $pages) {
  $slug = Slug $p.title
  Write-Utf8 (Join-Path $Root "data/notion-export/raw-page-fetches/$slug.json") (($p + @{ raw_export_status="pending-refresh"; generated_at=$exportedAt }) | ConvertTo-Json -Depth 5)
}
Write-Utf8 (Join-Path $Root "data/notion-export/raw-database-fetches/product-master-database.json") (($sourceMap.product_database + @{ raw_export_status="pending-refresh"; generated_at=$exportedAt }) | ConvertTo-Json -Depth 5)

Write-Output "Generated Puretronics repo workspace at $Root"
Write-Output "Core pages mapped: $($pages.Count)"
Write-Output "Raw input pages mapped: $($rawInputs.Count)"
Write-Output "Product rows generated: $($products.Count)"
