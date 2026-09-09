# Scientific publish-readiness corrections

Audit and implementation: 8–9 September 2026. This file is internal validation documentation. It must not be published as customer-facing copy.

## Independent technical authority check

The audit queried the live [Product Database V4](https://app.notion.com/p/a6c3dd29567d820892b781220917231a) using its data source `collection://7ef3dd29-567d-8264-ba41-87a028b59f1f`, filtered to Approved and Current. The result contained 83 records, with no pagination remaining. Record identity, record class and immediate parentage were compared programmatically against the local generated catalogue: **zero mismatches**.

Inventory: 13 products across five families; 22 models, five configuration classes, six loadcell series, 24 capacity options; 12 supporting records and one option. Supporting records remain subordinate. No portfolio expansion is authorised by these changes.

High-risk records were also fetched as full pages: P07/P07A, P08E/P08F, P09, P10A/P10B and P12A–P12F. These confirm that a product-level configurable envelope must not be confused with an individual configuration class, and that source qualifications cannot be turned into standard suitability claims.

Additional validated authority: `Additional Intelligence for V2.md`, completed with Puretronics Director Aakash Goyal, particularly Q8 (WTI quotation-dependent configurations) and Section 5 (preheater configurable envelope). The current V4 preheater parent still publishes the wider solid/bunched envelope. No later direct validation revoking the WTI configuration possibility was found.

## Exact Master Guide changes required

### Scope and deterministic interpretation (Sections 11–14 and the output-state appendix)

1. Every family question has an explicit product scope. Its answers constrain only those products. A spark voltage cannot exclude a laser, powder applicator or brake. Within the tension family, indicator wire size, loadcell capacity and brake torque cannot constrain each other's equipment roles.
2. Model choices within a single question combine by union; separate applicable questions combine by intersection. An applicable question that permits no model from a product must remove that product's models. It must not be skipped merely because its list contains models from another product.
3. AC-specific offline questions affect only the AC configuration; DC-specific questions affect only the DC configuration. Selecting both methods retains two distinct paths and applies each method's voltage/current limits independently.
4. Offline validation paths, process-equipment paths and tension-system roles are multiple-choice multi-select questions. Select all required paths. This supports independent AC/DC/fire work, preheating/powder/joining work, and indication/sensing/control/braking work within one review.
5. Technical questions for products outside the active review scope are hidden. Conditional answers that become hidden do not affect the outcome; this includes the combined solid-conductor/preheater diameter check.
6. Known role or project-route contradictions remain exclusions. Excluded products return no candidate models or capacity options. Customer reasons use public product/model names; source identifiers remain available only for internal traceability.
7. Status precedence is: known exclusion; project-specific/configuration review; incomplete information; preliminary alignment. A project-review result can still contain open questions. Unknown, unanswered, partial, unavailable, unconfirmed and Not Applicable answers do not meet a mandatory requirement and never create a technical exclusion by themselves.
8. The common location, material/construction category and project context must be answered for preliminary alignment. Product-specific mandatory questions below are additional. Answering a readiness question is not engineering approval.

### Measurement (PF01)

Retain these model intervals: LASER 2008 0.8–35 mm; LASER 2008B 1.0–150 mm; LASER-2012 0.1–12 mm; LASER-2030 0.1–30 mm; LASER-2060 0.5–65 mm; LASER-2010H 0.1–10 mm; LASER-2020H 0.3–20 mm; LASER-2030H 0.3–30 mm. Both requested minimum and maximum must be covered by the same remaining model. Lump/neck detection remains limited to LASER-H and does not become a general surface-inspection claim.

Mandatory: measurement function, minimum diameter, maximum diameter, axes, required outputs and optical material condition. Add `pf01-material`: opaque wire/cable; transparent/translucent product; Not Known Yet. Transparent/translucent requirements produce project review because the selected optical configuration needs confirmation.

### Spark testing (PF02)

Preserve distinct methods: Live mains-frequency AC (200 m/min, up to 30 kV, standard OD through 40 mm and on-demand through 60 mm); Acute high-frequency AC (1500 m/min, up to 15 kV, OD through 15 mm); DC (up to 2500 m/min, up to 20 kV, standard OD through 15 mm and on-demand through 30 mm). All start at 1.5 kV and 0.5 mm OD. No method's values transfer to another method.

Add mandatory `pf02-min-voltage` (below 1.5 kV / 1.5 kV or higher / unknown) and `pf02-min-diameter` (below 0.5 mm OD / 0.5 mm or larger / unknown), in addition to existing principle, maximum speed, maximum voltage, maximum diameter and fault-response questions. Values below the minimum exclude the published spark models. On-demand diameter conditions produce project review only for the affected retained method. Logging/marking/calibration/UL-electrode requests retain the configuration-review qualifications already present.

### Offline HV and fire testing (PF03)

AC remains up to 40 kV and up to 1 A; higher requirements are request-based. DC remains 0.5–20 kV at 1 mA; other requirements need review. These are separate configuration paths even when both are selected.

Add mandatory `pf03-test-basis`: sample, procedure, duration and safety arrangement defined / partly defined / unknown. Required test functions must also be answered. Fire resistance always remains Project-Specific Review, with the method, sample and site/safety questions retained; no universal standard, edition or compliance approval is inferred.

### Preheating (PF04)

Replace any statement that 0.3–3.6 mm is the complete product boundary. The current configurable parent envelope is solid conductor 0.1–10 mm; bunched conductor 0.1–16 mm; line speed 40–2000 m/min; temperature 60–180°C. The three listed classes are 1000 m/min at 0.4–3.6 mm, 1500 m/min at 0.5–2.8 mm, and 2000 m/min at 0.3–1.4 mm. Their maximum speed depends on conductor diameter.

Add mandatory material (copper / aluminium / steel / other specified material / unknown) and construction (solid / bunched or stranded / unknown). Split the minimum-diameter low end into below 0.1 mm and 0.1–below 0.3 mm. Split the maximum-diameter high end into above 3.6–10 mm, above 10–16 mm and above 16 mm. Add a shared process-speed choice below 40 m/min, followed by 40–100 m/min and the existing upper bands.

A listed class is removed when a known diameter or speed exceeds that class. If no class remains but the requirement is within the wider configurable envelope, retain the preheater product as Project-Specific Review with no standard class claimed. Solid conductor above 10 mm, any conductor below 0.1 mm or above 16 mm, speed below 40 or above 2000 m/min, and temperature outside 60–180°C exclude the published envelope. Unknown construction cannot create the solid-conductor exclusion.

Every retained preheater outcome remains Project-Specific Review: independent diameter/speed/temperature bands do not establish a thermal-duty intersection. Material, temperature rise, power and line integration require combined review.

### Powder application and joining (PF04)

Keep talcum LSP-G1/G2/G3/G2-100 and graphite LSP-G2-GR50/GR250 distinct. Their respective maximum speed/diameter pairs remain 150/40, 250/40, 400/40, 150/100, 150/40 and 100/100 (m/min and mm). A shared process-speed band above 400 m/min excludes every powder model even if it still permits preheaters.

Add mandatory `pf04-powder-specification`: talcum mesh 2000 or finer; THIELMANN GRAPHITE 23061 or confirmed equivalent; another specification; unknown. The named talcum/graphite choices narrow their respective variants. Another specification produces project review. All five readiness confirmations are required: clean/dry suitable powder; earthing below 1 V and machine earth connection; moisture/mist-free panel air; running height matching the selected applicator; 415 VAC three-phase supply and required power. Merely having these conditions documented is insufficient. Missing confirmations remain open.

Add mandatory `pf04-joining-size`: below 0.2 mm²; 0.2–6 mm²; above 6 mm²; unknown. The value is cross-sectional area, not diameter. The two outside choices exclude the documented welding product even though it has no model children. Material (copper/aluminium) and construction (solid/stranded) remain mandatory.

### Tension indication, sensing, control and braking (PF05)

WTI-90-40 remains 0.2–5 mm; WTI-100-40 remains 2–10 mm. Every tension-range selection is configuration-dependent and requires quotation review. **Replace the previous Above 40 kg exclusion** with Project-Specific Review: standard coverage above 40 kg is not asserted, and the model remains a candidate for configuration confirmation. Add mandatory installation/output readiness: mechanical arrangement, calibration and outputs defined / partly defined / unknown.

LTC-PRO is always Project-Specific Review because sensor, actuator and machine interfaces must be reviewed as one architecture. It is not a substitute for a loadcell, indicator or brake.

Retain exactly 24 loadcell capacities: LC-AR-85 10/20/50/100 kg; LC-AR-118 and LC-AR-125 each 50/100/200/500 kg; LC-AR-ST 100/200/500/1000 kg; LC-AR-60 10/20/50 kg; LC-AR-HD 100/500/1000/2000/5000 kg. Mounting combinations remain flange (85/118/60), flange with pilot hole (125), pillow block (ST/HD). Capacity and mounting intersect at the exact series/capacity option; equal capacity does not mean interchangeability. Add mandatory loadcell geometry/signal readiness: shaft geometry, load direction, signal and environment defined / partial / unknown. Any surviving LC-AR-60 or LC-AR-HD option creates project review because signal, protection and availability details require confirmation.

Brake torque ranges remain per caliper: AX-250 0.15–16 kg·m / 2500 rpm; AX-400 0.25–27 kg·m / 1500 rpm; AX-500 0.33–33 kg·m / 1200 rpm. Pressure remains 0.2–6 bar. Only apply the torque filter after the visitor confirms a per-caliper basis. Total system torque, unknown basis or a stale torque choice cannot exclude models; the per-caliper question stays open. Clarify that an out-of-range pressure answer means the **brake must operate** outside 0.2–6 bar. A higher plant supply alone is not an exclusion if it can be regulated.

Every retained brake outcome remains Project-Specific Review even when geometry, duty and mounting are documented. There is no validated torque-versus-pressure curve or supplied thermal/mechanical calculation establishing that those individually known conditions work together.

## Regression evidence

`tests/scientific-regressions.test.ts` uses independent source-transcribed numerical fixtures rather than importing the implementation mappings. It covers each applied measurement, spark, preheater, powder, weld, WTI, offline-HV and brake threshold at, below and above its limit; pairwise technical intersections; all 27 exact loadcell capacity/mounting combinations and all 24 child capacities; every technical choice's isolation from unrelated products; unknown/Not Applicable behavior; configuration/request review; AC/DC independence; stale hidden input isolation; and public model names in exclusions.

Raw generated technical data was preserved. Public rewriting of superseded capacity mentions, internal source labels and traceability caveats belongs to the public presentation adapter, not a rewrite of the source export.

No final engineering suitability, certification validity or booking approval is established by this scientific validation.
