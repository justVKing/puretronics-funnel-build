# Funnel Asset Master

## Purpose

`funnel-asset-master.csv` is the canonical Phase 1 implementation backlog and content/build inventory for the Puretronics Wire & Cable funnel. It records existing sources, specified buyer-facing assets, proof assets, form/routing logic, reporting, recurring activation families, integrations, governance, operations, QA, and deployment requirements without starting frontend implementation.

## Row rule

One row represents one atomic, independently buildable, publishable, reusable, or operational asset. Individual form fields, product properties, and minor copy fragments remain inside their parent asset unless independently managed. Monthly commitments are reusable series/template rows with cadence and quantity, not 16 months of duplicated instances.

## Source and scope rules

1. Signed Services Agreement and repository governance rules.
2. Exact raw Notion responses under `data/notion-export/`.
3. Product Master exports under `data/product-master/`.
4. Funnel-build specifications.
5. Normalized Markdown.

Technical, performance, standards, compliance, commercial, and product claims are never inferred to fill blanks. Product Master rows are product-intelligence inputs, not legal/commercial authority. Support items remain contextual and cannot become standalone pages, campaigns, forms, automations, SEO assets, selectors, calculators, configurators, or extra deliverables.

## How existing and future assets are distinguished

- Existing sources use `asset_class=source-asset`, an approved content status for the source record itself, and non-applicable design/build status.
- Specified assets use `content_status=specified` and separate design, build, validation, and approval status.
- Approval-dependent or scope-sensitive assets use `scope_treatment=approval-required` and `decision-required` status where implementation cannot safely proceed.
- Support-only product rows and proof contexts use `scope_treatment=covered-support`.

## Relationships and taxonomy

- `parent_asset_id` expresses page, section, system, campaign-series, template, and workflow hierarchy.
- `dependencies` uses semicolon-separated asset IDs.
- `product_models` uses exact Product Master names so all 38 rows can be reconciled.
- `source_refs` uses repository-relative paths, optionally followed by a Markdown/raw-source heading after `#`.
- Product Family is the sole top-level product taxonomy.
- The retained `solution_block` column mirrors the canonical family slug for schema compatibility and is not an independent classification.
- Fire Resistance & Circuit Integrity is a specialized PF-03 module.

## Assumptions and conservative decisions

- The Signed Agreement is immutable and remains the legal/commercial authority; exact snapshots are integrity-checked during taxonomy migration.
- The raw architecture's “Spark Tester Selector” label is represented only as a comparison table because selectors/configurators are excluded.
- OEM/integration enquiry capture and opportunity reporting are inventoried as approval-required where the raw architecture is broader than the signed build scope. No standalone OEM page is created.
- The repository specifies a core cold-email sequence but not its number of touches; it is recorded as a template family with the step count left for decision.
- Owners remain `unassigned` until Puretronics and Stratagem Olympus approve an operating responsibility map.

## Maintenance workflow

1. Update sources first.
2. Add or revise rows without reusing an existing `asset_id`.
3. Use only controlled column values and documented tags.
4. Keep multi-value fields semicolon-separated.
5. Add any new tag to `tag-taxonomy.md` before using it.
6. Run `scripts/validate_funnel_asset_master.ps1` and the repository validators.

## Files

- `funnel-asset-master.csv`: canonical asset database.
- `tag-taxonomy.md`: controlled tag definitions and registry.
- `../../scripts/validate_funnel_asset_master.ps1`: structural, scope, coverage, source, status, and CSV validation.
