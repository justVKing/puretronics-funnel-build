# Adaptive Requirement Form And Routing

## Governance

The form is governed by the signed Services Agreement dated 9 July 2026 and must remain inside the Wire & Cable pilot scope. Support items cannot create standalone pages, campaigns, forms, automations, SEO assets, selectors, calculators, configurators, or extra deliverables without separate written approval.

## Form Entry Paths

| Entry path | Purpose | Primary owner |
| --- | --- | --- |
| Sales enquiry | New product or solution requirement | Sales/application owner |
| Technical proof request | Datasheet, comparison, explainer, or proof pack | Sales/application owner |
| Service/support | Installed product, maintenance, calibration, troubleshooting | Service/support owner |
| Existing customer expansion | Additional requirement from installed/customer account | Account owner |

## Required Core Fields

- Name
- Company
- Email
- Phone
- City/state/country
- Company type
- Buyer role
- Existing Puretronics customer status
- Enquiry type: sales enquiry, proof request, service/support, other
- Product family
- Production stage
- Problem type
- Urgency
- Current line/process context
- Preferred callback or response method
- Consent/permission checkbox where required by operating policy

## Conditional Fields

| Trigger | Additional fields |
| --- | --- |
| Online Measurement | Cable/wire type, diameter range, line speed, display/software needs, tolerance issue |
| Spark Testing | AC/DC requirement, voltage range, line speed, insulation type, fault marking/logging need |
| HV & Cable Validation | AC/DC HV requirement, sample/cable type, voltage/test method, reporting need |
| Fire Resistance | Cable type, test standard/context, lab/plant setup, commissioning/support need |
| Line Stability/Tension Control | Tension range, line stage, WTI/loadcell/brake/LTC-PRO context, brake model, RPM/pressure/torque context |
| Process Enhancement | Powdering, preheating, welding/splicing need, line speed, conductor/cable material |
| Service/support | Product installed, serial/model if available, issue type, downtime status, location, images/documents if available |

## Classification Logic

| Classification | Rule |
| --- | --- |
| High-intent sales | Product need and next commercial/technical action are clear |
| Technical qualification | Valid requirement with missing specs or configuration details |
| Proof-pack request | Buyer asks for datasheet, comparison, explainer, standard note, output note, or application explainer |
| Service/support | Existing product issue, calibration, maintenance, troubleshooting, or spare/accessory query |
| Support-item context | Accessory/fault-intelligence item selected without a primary product requirement |
| Out-of-scope | Product category outside signed Wire & Cable pilot or excluded deliverable request |

## Routing Rules

- Online Measurement routes to LASER product/application owner.
- Spark Testing routes to spark tester product/application owner; IoT stages and calibrator are support context only.
- HV & Cable Validation routes to testing/quality product owner.
- Fire Resistance routes to specialist system owner.
- Line Stability, Adhesion & Tension Control routes to the tension/braking/automation owner and must include LTC-PRO where WTI, loadcells, braking, torque, or line stability are involved.
- Service/support bypasses campaign qualification and routes to support owner.
- Out-of-scope or expansion requests route to commercial review before any commitment.

## Handoff Fields

Every routed enquiry should carry:

- Submitted form data
- Product family
- Product/model candidate
- Signed Scope Treatment
- Lead classification
- Urgency
- Suggested proof-pack assets
- Owner
- Next action
- SLA target
- Notes and caveats

## Acceptance Criteria

- Sales and service/support paths are separated.
- Routing aligns with Annexure A and the signed Services Agreement.
- Support-only items cannot generate standalone funnel commitments.
- Out-of-scope and expansion requests are caught before proposal or delivery promises.
