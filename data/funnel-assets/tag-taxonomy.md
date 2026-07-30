# Funnel Asset Controlled Tag Taxonomy

## Purpose

This taxonomy is the controlled vocabulary for `funnel-asset-master.csv`. Tags are lowercase, kebab-case, semicolon-separated, deduplicated, and sorted in each CSV cell. A tag may be added only when it is documented in the canonical registry below.

## Construction rules

- Use one canonical tag instead of synonyms.
- Preserve `not-applicable` through the relevant category tag where a dimension does not apply.
- Product/model tags identify coverage context; they do not imply a standalone page or campaign.
- Support-item tags are permitted only on source records or contextual proof assets whose `scope_treatment` is `covered-support`.
- Readiness is a compact lifecycle view derived from controlled status columns. The status columns remain authoritative.
- Technical validation tags never replace Puretronics approval of claims, specifications, standards, diagrams, or compliance context.

## Tag families

| Tag family | Prefix | Controlled meaning |
| --- | --- | --- |
| Asset class | `asset-class-` | Source, page, module, form, proof, workflow, dashboard, report, activation, governance, integration, operations, or QA asset class |
| Workstream | `workstream-` | Canonical implementation or activation workstream |
| Legacy-compatible family mirror | `solution-` | Same canonical slug as Product Family, cross-family, or not-applicable; not an independent taxonomy |
| Product family | `product-family-` | One of the five canonical Product Families, cross-family, or not-applicable |
| Product/model | `product-model-` | Exact Product Master row mapped to a funnel/proof context |
| Production stage | `stage-` | Canonical manufacturing, testing, support, reporting, cross-stage, or not-applicable stage |
| Buyer persona | `persona-` | Canonical buyer or internal operating role |
| Buyer problem | `problem-` | Canonical production, testing, routing, delivery, integration, or readiness problem |
| Funnel stage | `funnel-` | Awareness through retention/expansion, cross-funnel, or internal operations |
| Channel | `channel-` | Website, library, form, routing, reporting, LinkedIn, cold email, handoff, multi-channel, or internal operations |
| Content format | `format-` | Canonical asset format |
| Scope treatment | `scope-` | Signed primary, covered support, funnel operational, governance, approval-required, or excluded-reference-only |
| Lifecycle/readiness | `readiness-` | Built, approved, specified, in progress, decision-required, or not started |
| Validation requirement | `validation-` | Technical validation required, validated, not required, or decision-required |
| Recurrence/cadence | `recurrence-` | One-time, monthly, continuous, as-needed, per-prospect, per-release, or not-applicable |
| Navigation/form/classification | `navigation-`, `form-path-`, `classification-` | Controlled implementation subtypes required for coverage validation |
| Signed commitment | `commitment-` | Contracted recurring activation quantity family |
| Page role | `page-` | Canonical page-level role |

## Controlled column values

- `scope_treatment`: signed-primary; covered-support; funnel-operational; governance; approval-required; excluded-reference-only
- `priority`: critical; high; medium; low
- `mvp_required`: yes; no; decision-required
- status columns: not-started; specified; in-progress; ready-for-review; approved; built; not-applicable; blocked; decision-required
- `technical_validation_status`: not-required; pending-puretronics-validation; validated; decision-required

## Canonical tag registry

The validator reads the registry between the markers exactly.

<!-- canonical-tags:start -->
asset-class-activation-series
asset-class-dashboard
asset-class-form
asset-class-form-path
asset-class-governance-asset
asset-class-integration-asset
asset-class-module
asset-class-operational-asset
asset-class-page
asset-class-proof-asset
asset-class-qa-asset
asset-class-report
asset-class-section
asset-class-source-asset
asset-class-workflow
channel-adaptive-form
channel-cold-email
channel-dashboard
channel-internal-operations
channel-internal-routing
channel-linkedin-outreach
channel-multi-channel
channel-reporting
channel-technical-library
channel-website
classification-high-intent-sales
classification-out-of-scope
classification-proof-pack-request
classification-service-support
classification-support-item-context
classification-technical-qualification
commitment-cold-email-sends-monthly
commitment-company-page-assets-monthly
commitment-leadership-assets-monthly
commitment-linkedin-prospects-monthly
commitment-technical-assets-monthly
form-path-existing-customer-expansion
form-path-sales-enquiry
form-path-service-support
form-path-technical-proof-request
format-application-explainer
format-checklist
format-classification-rule
format-comparison-table
format-conditional-branch
format-content-template
format-cta
format-dashboard-view
format-data-model
format-datasheet-set
format-demo-workflow
format-deployment-runbook
format-email-sequence
format-faq-group
format-form
format-form-path
format-governance-record
format-handoff-schema
format-integration-note
format-integration-spec
format-operating-plan
format-outreach-sequence
format-page
format-post-series
format-production-stage-diagram
format-qa-checklist
format-reference-record
format-report-template
format-reporting-pack
format-router
format-routing-workflow
format-section
format-service-proof
format-product-family-experience
format-standards-note
format-triage-workflow
funnel-awareness
funnel-commercial-discussion
funnel-consideration
funnel-conversion
funnel-cross-funnel
funnel-internal-operations
funnel-retention-expansion
funnel-technical-evaluation
navigation-family
navigation-problem
navigation-stage
page-master-gateway
persona-automation-engineer
persona-commercial-decision-maker
persona-internal-operations
persona-maintenance-head
persona-oem-integrator
persona-owner-director
persona-plant-head
persona-production-manager
persona-purchase-procurement
persona-qa-qc-head
persona-rd-technical-team
persona-sales-engineer
persona-service-user
problem-braking-control
problem-buyer-segment
problem-calibration-support
problem-commercial-visibility
problem-conductor-preheating
problem-delivery-accountability
problem-diameter-variation
problem-enquiry-quality
problem-existing-customer-expansion
problem-fault-traceability
problem-fire-resistance-validation
problem-form-usability
problem-hv-validation
problem-installation-context
problem-insulation-faults
problem-integration-requirement
problem-line-stability
problem-management-visibility
problem-model-selection
problem-not-applicable
problem-outreach-performance
problem-outreach-relevance
problem-powder-adhesion
problem-problem-demand
problem-product-demand
problem-production-readiness
problem-proof-engagement
problem-reporting-requirement
problem-requirement-completeness
problem-routing-accountability
problem-routing-clarity
problem-sales-enquiry
problem-scope-clarity
problem-service-support
problem-solution-discovery
problem-technical-confidence
problem-technical-proof-request
problem-tension-instability
problem-test-setup
problem-testing-context
problem-welding-splicing
product-family-cross-family
product-family-cable-testing-validation
product-family-inline-measurement-dimensional-control
product-family-inline-spark-testing-insulation-fault-detection
product-family-not-applicable
product-family-process-equipment-line-auxiliaries
product-family-tension-braking-line-control
product-model-ac-hv-tester
product-model-acute-spark-tester
product-model-ax-250-pneumatic-brake
product-model-ax-400-pneumatic-brake
product-model-ax-500-pneumatic-brake
product-model-butt-welding-machine
product-model-dc-hv-tester
product-model-dc-spark-tester
product-model-fire-resistance-cable-testing-system
product-model-inline-induction-wire-preheater-1000-m-min
product-model-inline-induction-wire-preheater-1500-m-min
product-model-inline-induction-wire-preheater-2000-m-min
product-model-laser-2008b
product-model-laser-2010h
product-model-laser-2012
product-model-laser-2020h
product-model-laser-2030
product-model-laser-2030h
product-model-laser-2060
product-model-laser-diameter-gauge-laser-2008
product-model-laser-measurement-accessories-group
product-model-live-spark-tester
product-model-loadcell-accessories-integration-items
product-model-loadcell-ar-118-series
product-model-loadcell-ar-125-series
product-model-loadcell-ar-85-series
product-model-loadcell-ar-st-series
product-model-loadcell-lc-ar-60-series
product-model-loadcell-lc-ar-hd-series
product-model-lsp-g1-static-powder-applicator
product-model-lsp-g2-static-powder-applicator
product-model-ltc-pro-web-tension-controller
product-model-spark-tester-iot-stage-1-fault-interface
product-model-spark-tester-iot-stage-2-data-logging-and-graphics
product-model-spark-tester-iot-stage-3-inline-marking-system
product-model-spark-tester-sensitivity-calibrator
product-model-wire-tension-indicator-wti-100-40
product-model-wire-tension-indicator-wti-90-40
readiness-approved
readiness-built
readiness-decision-required
readiness-specified
recurrence-as-needed
recurrence-continuous
recurrence-monthly
recurrence-not-applicable
recurrence-one-time
recurrence-per-prospect
recurrence-per-release
scope-approval-required
scope-covered-support
scope-excluded-reference-only
scope-funnel-operational
scope-governance
scope-signed-primary
solution-cable-testing-validation
solution-cross-family
solution-inline-measurement-dimensional-control
solution-inline-spark-testing-insulation-fault-detection
solution-not-applicable
solution-process-equipment-line-auxiliaries
solution-tension-braking-line-control
stage-calibration-support
stage-cooling
stage-cross-stage
stage-data-reporting-layer
stage-extrusion-coating
stage-fire-compliance-testing
stage-inline-marking
stage-joining-butt-welding
stage-not-applicable
stage-offline-hv-testing
stage-online-measurement
stage-pay-off-unwind
stage-powdering-talc-application
stage-pre-extrusion-preheating
stage-repair-rework
stage-rewinding-coiling
stage-spark-fault-inspection
stage-tension-and-braking-control
stage-tension-braking-control
validation-technical-not-required
validation-technical-required
workstream-activation-content
workstream-cold-email
workstream-dashboard-and-reporting
workstream-forms-and-routing
workstream-governance
workstream-integrations
workstream-linkedin-outreach
workstream-operations
workstream-qa-and-deployment
workstream-source-intelligence
workstream-technical-library
workstream-website-experience
<!-- canonical-tags:end -->
