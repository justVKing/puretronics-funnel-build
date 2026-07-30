# Five Product-Family Experience Specifications

## Governance

These specs are governed by the signed Services Agreement dated 9 July 2026. They are architectural build references, not separate commercial commitments.

Support items may appear inside proof stacks and technical context only. They do not create standalone pages, campaigns, forms, automations, SEO assets, selectors, calculators, configurators, outreach tracks, or extra deliverables unless separately approved in writing.

## PF-01 — Inline Measurement & Dimensional Control

Purpose: help wire and cable teams evaluate diameter, dimensional consistency, and inline measurement requirements.

Covered products and variants:

- Laser Diameter Gauge / LASER 2008
- LASER 2008B
- LASER-2060
- LASER-2012
- LASER-2030
- LASER-2010H
- LASER-2020H
- LASER-2030H

Support items:

- Laser / Measurement Accessories Group, including PC software and motorised controller

Required proof stack:

- Datasheets and model comparison table
- Application explainer for extrusion and dimensional control
- Production-stage diagram for inline measurement placement
- Output and integration notes
- FAQ covering diameter variation, model selection, display/software outputs, and installation context

## PF-02 — Inline Spark Testing & Insulation Fault Detection

Purpose: help teams detect insulation faults and route spark-testing requirements into the right product/spec conversation.

Covered products:

- Live Spark Tester
- Acute Spark Tester
- DC Spark Tester

Support items:

- Spark Tester IoT Stage 1 Fault Interface
- Spark Tester IoT Stage 2 Data Logging & Graphics
- Spark Tester IoT Stage 3 Inline Marking System
- Spark Tester Sensitivity Calibrator

Required proof stack:

- Live/Acute/DC Spark comparison table
- Application explainer for insulation fault detection
- Standards and testing-context notes, subject to Puretronics validation
- Output and fault-intelligence support notes
- FAQ covering voltage selection, inline marking, data logging, calibration, and service/support routing

## PF-03 — Cable Testing & Validation

Purpose: help quality/testing teams distinguish AC HV and DC HV testing needs and request the correct validation conversation.

Covered products:

- AC HV Tester
- DC HV Tester
- Fire Resistance Cable Testing System

Required proof stack:

- AC vs DC HV comparison table
- Application explainer for finished-cable validation
- Standards notes, subject to Puretronics validation
- Requirement checklist for voltage, sample type, test method, and throughput
- FAQ covering AC/DC selection, safety, documentation, and service routing

### Specialized Solution Theme — Fire Resistance & Circuit Integrity

Purpose: position the Fire Resistance Cable Testing System as a specialized validation theme within PF-03. This theme is not a separate Product Family.

Covered product:

- Fire Resistance Cable Testing System

Required proof stack:

- System overview datasheet
- Application explainer for fire-resistance testing requirements
- Production/testing-stage diagram
- Standards notes, subject to Puretronics validation
- FAQ covering test setup, validation context, inputs required, and support boundaries

## PF-04 — Process Equipment & Line Auxiliaries

Purpose: help production teams evaluate preheating, powder application, conductor joining, repair, and related line-auxiliary requirements.

Covered products and variants:

- LSP-G1 Static Powder Applicator
- LSP-G2 Static Powder Applicator
- Inline Induction Wire Preheater variants at 1000/1500/2000 m/min
- Butt Welding Machine

Required proof stack:

- Preheater variant comparison table and application note
- LSP-G1/LSP-G2 comparison and application note
- Butt welding suitability table and conductor-joining explainer
- Production-stage diagram for pre-extrusion and joining contexts
- Output and integration notes where technically supported
- FAQ covering powdering, conductor preheating, butt welding, and integration context

## PF-05 — Tension / Braking / Line Control

Purpose: help production teams diagnose tension instability, braking control, load measurement, unwind/rewind control, and closed-loop line-control requirements.

Covered products and variants:

- Wire Tension Indicator WTI-90-40
- Wire Tension Indicator WTI-100-40
- LTC-PRO Web Tension Controller
- Loadcell AR-85, AR-118, AR-125, AR-ST, LC-AR-60, LC-AR-HD
- AX-250 Pneumatic Brake
- AX-400 Pneumatic Brake
- AX-500 Pneumatic Brake

Support items:

- Loadcell Accessories / Integration Items, covering amplifier, small/big brackets, connecting cable, L bracket for AR-85, and bearing block

Required proof stack:

- Tension-control architecture showing WTI, loadcells, LTC-PRO, and pneumatic brakes together
- Brake torque, pressure, and RPM table
- Loadcell model and accessory integration notes
- LTC-PRO control and integration note
- FAQ covering tension, braking, load measurement, closed-loop control, and line stability

## Shared Acceptance Criteria

- Each Product Family has a clear purpose, product scope, support-item treatment, and proof stack.
- `Solution Theme` is subordinate and many-to-many; Manufacturing Flow Stage and Buyer Problem remain separate axes.
- Fire Resistance & Circuit Integrity remains a specialized PF-03 theme.
- The machine-readable family slugs are documented in `docs/00-governance/product-taxonomy-governance.md`.
- LTC-PRO Web Tension Controller appears in tension/control coverage wherever WTI, loadcells, braking, torque, or line stability are discussed.
- Accessory and fault-intelligence items remain support-only.
- Specs do not introduce new commercials or excluded deliverables.
