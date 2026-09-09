# Master Guide — Puretronics Capability Profile Landing Page

**Document Name:** Master Guide (Puretronics CPLP)
**CPLP Meaning:** Puretronics Capability Profile Landing Page
**Document Purpose:** Single Source of Truth for understanding and validating the two interactive sections
**Document Status:** Corrected Implementation; Booking Approval Outstanding
**Last Verified:** 9 September 2026
**Executable Reference:** [Puretronics Wire and Cable Capability Profile](https://justvking.github.io/puretronics-funnel-build/)

> This guide explains what the interactive system asks, how it interprets each answer, what it returns, and where Puretronics must still make an engineering decision. It does not replace Product Database V4 or a Puretronics application review.

## 1. Document Authority

This guide is the master explanation of the interactive logic used on the Capability Profile Landing Page.

Three sources have different jobs:

| Source | What It Controls |
|---|---|
| This Master Guide | How the two interactive sections work and how their inputs become outputs |
| Product Database V4 | Product identity, hierarchy, technical specifications, published ranges, caveats and approval status |
| Deployed Capability Profile | The working, executable version of the logic described here |

If this guide and the live page behave differently, the difference must be investigated. If a technical value in this guide conflicts with Product Database V4, V4 controls the technical value.

The governing evidence hierarchy is:

1. Later Direct Puretronics Validation
2. Current Approved Product Database V4 Records
3. Final Capability Profile Landing-Page Copy
4. Approved Interactive-Experience Specification
5. Technical Validation Questionnaire and Consolidated Project Sources
6. Older Brochures and Product-Specific Source Material
7. Current Website and LinkedIn for Stable Company Context, Imagery and Branding Only

An older source cannot overrule a newer validated V4 record. A contextual website statement cannot create a product, specification or capability inside this system.

The portfolio is limited to Puretronics equipment and capabilities for the Wire and Cable Industry. The system does not claim that Puretronics manufactures wires or cables.

## 2. How to Use This Guide

### Five-Minute Overview

Read Sections 3 and 4 to understand the complete visitor journey and the basic rules.

### Business Review

Read Sections 5 to 10 to understand the four Explorer views, the Application Review experience and the value each provides to a prospect or customer.

### Technical Validation

Read Sections 11 to 18 and the appendices to validate every relationship, question, boundary, output and safeguard.

When Puretronics wants a change, record it in the validation table in Section 17. A correction should identify the present rule, the required rule and the V4 record or later Puretronics validation supporting the change.

### Contents

1. [Document Authority](#1-document-authority)
2. [How to Use This Guide](#2-how-to-use-this-guide)
3. [The Complete System in One Page](#3-the-complete-system-in-one-page)
4. [System Foundations](#4-system-foundations)
5. [Interactive Section 1 — Capability Explorer](#5-interactive-section-1--capability-explorer)
6. [Solution Navigator](#6-solution-navigator)
7. [Production-Line Map](#7-production-line-map)
8. [Capability Matrix](#8-capability-matrix)
9. [Model-to-Model Comparison Workbench](#9-model-to-model-comparison-workbench)
10. [Interactive Section 2 — Prepare Your Application Review](#10-interactive-section-2--prepare-your-application-review)
11. [Complete Input-to-Output Dictionary](#11-complete-input-to-output-dictionary)
12. [Scientific Product and Model Fit Logic](#12-scientific-product-and-model-fit-logic)
13. [Unknowns, Exclusions and Safeguards](#13-unknowns-exclusions-and-safeguards)
14. [Application Review Brief](#14-application-review-brief)
15. [Worked End-to-End Journeys](#15-worked-end-to-end-journeys)
16. [Privacy, Session and Analytics](#16-privacy-session-and-analytics)
17. [Puretronics Validation Checklist](#17-puretronics-validation-checklist)
18. [Appendices](#18-appendices)

## 3. The Complete System in One Page

```text
Visitor's Requirement
        ↓
Interactive Section 1 — Capability Explorer
        ↓
Relevant Product Paths
        ↓
Optional Model-to-Model Comparison
        ↓
Interactive Section 2 — MCQ Application Review
        ↓
Product and Model Fit Summary
        ↓
Application Review Brief
        ↓
Separate Booking System Page
```

| Stage | Visitor Provides | System Does | Visitor Receives |
|---|---|---|---|
| Capability Explorer | A problem, stage, Product Family, product/model name or project context | Matches the input against one governed portfolio and relationship model | Relevant Primary Products with reasons |
| Production-Line Map | One or more production or testing stages | Shows primary and contextual equipment roles | A stage-based view of where capabilities may fit |
| Capability Matrix | Requirement, family, stage and project-route filters | Applies the same matching rules in a compact coverage index | Filtered requirement paths and accurate counts |
| Comparison Workbench | One Primary Product and up to two or three models | Collects every V4 parameter populated for at least one selected model | A model-to-model specification table |
| Application Review | Governed multiple-choice answers | Adds scope, applies V4 boundaries and identifies missing information | Candidate products/models, exclusions and open questions |
| Review Brief | The visitor's completed or incomplete MCQ selections | Organises known information and unresolved questions | A copyable and printable technical discussion brief |
| Booking Boundary | The CTA location only | Opens a brief preparation until an external booking destination is approved | An application brief; external booking remains unconfigured |

> **Central Principle:** Scope choices add relevant possibilities. Approved technical facts narrow them. Unknown information never creates a false rejection or recommendation.

## 4. System Foundations

### 4.1 What the System Is Designed to Do

The system helps a visitor move from a real production or testing requirement to a useful Puretronics review path. It can show that a product or model remains relevant to the information supplied. It can also show that a published model boundary conflicts with a known requirement.

It does not provide final engineering approval, compatibility confirmation, commercial availability, pricing, installation approval or a guaranteed recommendation.

### 4.2 Product-Language Definitions

| Term | Plain-English Meaning |
|---|---|
| Product Family | One of five high-level capability areas |
| Primary Product | A governed customer-facing product platform or system |
| Model | A named technical model under a Primary Product |
| Variant or Configuration Class | A governed version selected by method, speed, size or another configuration condition |
| Capacity SKU | A specific approved capacity record under a loadcell series |
| Support Item | An accessory or supporting support record; it remains subordinate and is not presented as a Primary Product |
| Governed Public Information | Information approved for public use in the current V4 dataset |

### 4.3 Portfolio Architecture

| Product Family | Primary Product | Approved Models, Variants or Series |
|---|---|---|
| PF01 — Inline Measurement and Dimensional Control | P01 — LASER 2008 Series Diameter Measurement Platform | P01A LASER 2008; P01B LASER 2008B |
| PF01 — Inline Measurement and Dimensional Control | P02 — LASER 2000 Series Scan Micrometers | P02A LASER-2012; P02B LASER-2030; P02C LASER-2060 |
| PF01 — Inline Measurement and Dimensional Control | P03 — LASER-H Series Diameter Measurement, Control and Lump / Neck Detection | P03A LASER-2010H; P03B LASER-2020H; P03C LASER-2030H |
| PF02 — Inline Spark Testing and Insulation Fault Detection | P04 — Inline Spark Testing Platform | P04A Live Spark Tester: Mains-Frequency AC; P04B Acute Spark Tester: High-Frequency AC; P04C DC Spark Tester |
| PF03 — Cable Testing and Validation | P05 — Offline High-Voltage Tester Platform | P05A AC HV Tester; P05B DC HV Tester |
| PF03 — Cable Testing and Validation | P06 — Fire Resistance Cable Testing System | Project-Specific System; No Standard Model List |
| PF04 — Process Equipment and Line Auxiliaries | P07 — Inline Induction Wire Preheater | P07A 1000 m/min; P07B 1500 m/min; P07C 2000 m/min |
| PF04 — Process Equipment and Line Auxiliaries | P08 — LSP Static Powder Applicator | P08A LSP-G1; P08B LSP-G2; P08C LSP-G3; P08D LSP-G2-100; P08E LSP-G2-GR50; P08F LSP-G2-GR250 |
| PF04 — Process Equipment and Line Auxiliaries | P09 — Butt Welding Machine | Application-Reviewed Product; No Public Model List |
| PF05 — Tension / Braking / Line Control | P10 — Wire Tension Indicator | P10A WTI-90-40; P10B WTI-100-40 |
| PF05 — Tension / Braking / Line Control | P11 — LTC-PRO Web Tension Controller | Application-Reviewed Controller; No Public Model List |
| PF05 — Tension / Braking / Line Control | P12 — Loadcells and Tension Transducers | P12A LC-AR-85 Series; P12B LC-AR-118 Series; P12C LC-AR-125 Series; P12D LC-AR-ST Series; P12E LC-AR-60 Series; P12F LC-AR-HD Series; 24 Approved Capacity SKUs |
| PF05 — Tension / Braking / Line Control | P13 — Pneumatic Brake | P13A AX-250; P13B AX-400; P13C AX-500 |

### 4.4 One Shared Visitor Session

The Navigator, Map, Matrix and Workbench are views of one visitor session. A selection made in one view can remain active in another. The page displays active constraints so the visitor can see and remove them.

The browser stores an allowlisted session snapshot in `sessionStorage`. This means the information can survive a page refresh in the same browser tab or session. It is not a customer record and is not sent to Puretronics.

The following can be carried into the Application Review:

- Explicitly Selected Products
- Selected Product Families
- Selected Requirements
- Selected Production or Testing Stages
- Selected Project Routes

The approved external booking destination receives none of that visible context. It receives no family, product, model, answer or brief.

### 4.5 Deterministic Logic

The system uses fixed rules. The same inputs produce the same outputs. It does not use a chatbot, generative AI or a hidden recommendation model.

This matters because each result can be explained. Puretronics can inspect the rule, approve it or request a correction.

### 4.6 Data Baseline Used by the Experience

The public-safe V4 snapshot used by the deployed page contains 83 approved/current records and 747 populated technical-specification entries. Those 83 records include Primary Products, models, configuration classes, series, capacity SKUs, support records and other approved subordinate records. They do not change the public count of 13 Primary Products.

The interactive system uses only the data required for public discovery, comparison and application review. It does not expose internal notes, credentials or private Notion properties. There is no live Notion dependency; therefore, a later V4 change must be deliberately reviewed and published into a new site dataset before it appears on the landing page.

The following distinction is essential:

| Information Type | What the System May Do | What the System Must Not Do |
|---|---|---|
| Product Identity | Show the approved Product Family, Primary Product and subordinate record | Invent a product, merge separate products or promote a support item |
| Technical Value | Display a populated approved V4 value | Fill a missing value by assumption or brochure analogy |
| Capability Relationship | Explain a primary or contextual relationship | Turn proximity on the map into a compatibility claim |
| Model Fit | Retain or remove a model using an approved boundary | Claim final engineering suitability |
| Project-Specific Need | Identify the relevant product path and missing inputs | Turn a configurable requirement into a standard specification |
| Commercial Decision | Direct the visitor to an application review | Promise price, delivery, availability or booking outcome |

### 4.7 What “Relevant” Means

“Relevant” means that a governed relationship connects the visitor's current input with a Puretronics Primary Product. It does not mean “recommended,” “best,” “fully compatible” or “approved for purchase.”

A product can be relevant for several different reasons. It may solve the selected problem, fit the selected stage, belong to the selected family, be approved for the selected project route or contain an exact model-code match. The result card states the strongest applicable reasons so the visitor can understand the connection.

### 4.8 What “Aligned” Means

“Aligned With Known Requirements” is narrower than “relevant” but still not final selection. It means:

1. The product is already in the review scope.
2. Every currently visible mandatory discriminator for that product has a decisive answer.
3. At least one governed model or configuration remains after applying those answers.
4. No selected condition requires project-specific treatment.
5. No selected fact contradicts a published boundary.

Puretronics must still review the complete product, machine, process, safety, interface and installation context.

## 5. Interactive Section 1 — Capability Explorer

### 5.1 Purpose

The Capability Explorer provides four ways to examine the same governed portfolio. They are not four separate recommendation engines.

| Visitor Situation | Best View | Why |
|---|---|---|
| “I know the problem but not the product.” | Solution Navigator | Begins with the observed requirement |
| “I know where on the line this happens.” | Production-Line Map | Begins with process location |
| “I want to scan the portfolio.” | Capability Matrix | Shows all 12 requirement paths compactly |
| “I know the product and want to compare models.” | Comparison Workbench | Shows complete populated V4 specifications side by side |

### 5.2 Shared Filtering Logic

The normal rule is **OR within one dimension and AND between different dimensions**.

- Two selected stages mean a product can match either selected stage.
- Two selected Product Families mean a product can belong to either selected family.
- A selected stage and a selected family mean the product must satisfy both.
- A search term and a selected project route mean the record must match the search and be approved for the route.

| Problem | Family | Stage | Route | Result Rule |
|---|---|---|---|---|
| None | None | None | None | Show the complete governed portfolio |
| One or More | None | None | None | Match any selected problem |
| None | One or More | None | None | Match any selected family |
| One or More | One or More | None | None | Match a selected problem and a selected family |
| One or More | One or More | One or More | One or More | Match at least one selection in every populated dimension |

The New-Line or Retrofit route is deliberately broader. When the visitor selects several stages, the output is grouped by stage so that a multi-stage project is not forced into a single winner.

### 5.3 Search Rules

Search is a constraint, not an extra source of unrelated results.

Search priority is:

1. Exact Approved Model or SKU Code
2. Approved Model Alias
3. Primary Product Name or ID
4. Partial Governed Match

Case, spacing and punctuation are normalised. For example, `AX400`, `AX-400` and an approved AX-400 alias lead to the same governed record.

### 5.4 Relationship Types

| Relationship | Meaning |
|---|---|
| Primary V4 Placement | The product's governed main manufacturing or testing stage |
| Adjacent Process Context | The product may be relevant near that stage, subject to the line arrangement |
| Supporting Role | A subordinate item supports a primary product or system |
| Downstream Response Context | Information from an upstream product may affect a later process action |
| Separate Offline / Laboratory Path | The activity is outside the inline production sequence |

Context does not mean compatibility, necessity or installation approval.

### 5.5 Practical Combination Examples

#### Example A — One Problem

If the visitor selects **Powder Application** and nothing else, the common engine returns P08 — LSP Static Powder Applicator. The result appears because P08 is the governed Primary Product for that requirement.

#### Example B — Problem Plus Family

If the visitor selects **Tension Visibility or Indication** and PF05 — Tension / Braking / Line Control, the result remains inside PF05 and can include P10 and P12 because the requirement is connected to both indication and sensing. Selecting the family does not force all four PF05 roles to appear.

#### Example C — Family Plus Conflicting Stage

If the visitor selects PF03 — Cable Testing and Validation and the inline dimensional-measurement stage, no product satisfies both dimensions. The correct response is an empty state, not a blended result. The interface shows the active constraints and lets the visitor remove one.

#### Example D — Multiple Stages

If a new-line visitor selects pre-extrusion preparation, dimensional measurement and spark testing, the multi-stage project output groups P07/P08, P01/P02/P03 and P04 by stage. The products are not ranked as substitutes because they perform different jobs.

#### Example E — Exact Search With Another Constraint

An exact search for AX-400 identifies P13B. If the visitor also applies a route for which P13 is not publicly mapped, the route constraint wins and the record does not remain eligible. Exact search improves priority; it does not bypass governance.

#### Example F — Contextual Stage Match

Selecting cooling and inline inspection can surface P01–P04 as contextual results. Their explanations say that the line arrangement may support downstream measurement or spark testing. The system does not claim that the equipment belongs inside the cooling process.

### 5.6 Clearing and Preserving State

Switching between Navigator, Map, Matrix and Comparison preserves the current session. This lets a visitor examine the same need from another angle without starting again.

The shared context bar is the truth about active Explorer constraints. Removing one chip removes that exact constraint. “Clear Explorer Constraints” removes the Navigator filters and answers and returns the Explorer to its broad default. Product selections intentionally carried to the Application Review remain separate from ordinary Explorer filters until the visitor removes or resets them.

## 6. Solution Navigator

### 6.1 Route 1 — Start With a Problem

**Use When:** The visitor can describe an operational or quality issue.

**Input:** One or more of the 14 problem choices.

**Logic:** The system maps the selected problem to one or more governed requirement paths and Primary Products. “More Than One Issue” enables multi-issue guidance. “Not Sure How to Describe It” moves the visitor to the guided route.

**Output:** Ranked products with plain-language reasons.

| Problem Choice | Requirement Path | Primary Products |
|---|---|---|
| Diameter Variation or Inadequate Measurement Visibility | Inline Dimensional Measurement | P01, P02, P03 |
| Lumps, Necks or Dimensional Irregularities | Lump-and-Neck Detection | P03 |
| Inline Insulation-Fault Detection | Inline Insulation-Fault Detection | P04 |
| Offline High-Voltage Testing | Offline High-Voltage Testing | P05 |
| Fire-Resistance or Circuit-Integrity Testing | Fire-Resistance or Circuit-Integrity Testing | P06 |
| Conductor Preheating | Conductor Preheating | P07 |
| Powder Application | Powder Application | P08 |
| Conductor Joining or Repair | Conductor Joining or Repair | P09 |
| Tension Visibility or Indication | Tension Indication and Load/Tension Sensing | P10, P12 |
| Unstable Tension or Repeated Adjustment | Tension Indication, Load/Tension Sensing, Active Tension Control and Pneumatic Braking | P10, P11, P12, P13 |
| Load or Tension Sensing | Load or Tension Sensing | P12 |
| Pay-Off or Unwind Braking | Pneumatic Braking | P13 |
| More Than One Issue | Multiple Selected Requirement Paths | Depends on subsequent selections |
| Not Sure How to Describe It | Guided Route | Begins broad; no unsupported product conclusion |

### 6.2 Route 2 — Start With a Stage

**Use When:** The visitor knows where the requirement occurs.

**Input:** One or more inline stages or laboratory paths.

**Logic:** The stage is matched against both primary and contextual relationships. The output explains which relationship applies.

**Output:** Stage-relevant products, relationship labels and reasons. The same selection appears in the Map and Matrix.

### 6.3 Route 3 — Start With a Product Family

**Use When:** The visitor already understands the broad capability area.

**Input:** One of the five Product Families, followed by a family discriminator such as measurement function, test path, process role or tension-system role.

**Logic:** Family selection brings every Primary Product in that family into view. A governed discriminator can then narrow the result.

**Output:** Family purpose, products, common requirements, relevant stages and focused results.

### 6.4 Route 4 — Find a Product or Model

**Use When:** The visitor knows a model code, product name or approved alias.

**Input:** Search text.

**Logic:** Exact record matches are placed before aliases, Primary Products and partial matches. Models and SKUs remain subordinate to their Primary Product.

**Output:** The matched V4 record and its parent Primary Product. A no-match state offers problem, family and guided routes.

### 6.5 Route 5 — Plan a New Line or Retrofit

**Use When:** More than one production stage or equipment role may be involved.

**Inputs:** Project type, stages in scope, intended outcomes and existing-equipment status.

**Logic:** The selected stage groups are combined and displayed separately. The system does not force one product to represent a complete line.

**Output:** Stage-grouped capability paths and the information required for each stage.

### 6.6 Route 6 — Guide Me

**Use When:** The visitor is uncertain about the correct vocabulary.

The route asks no more than four broad questions:

1. Production Line, Offline Laboratory or Not Known
2. Broad Requirement Category
3. New Project, Existing-Line Issue, Replacement or Not Known
4. Known Technical Context Category

The output is a useful family-level path plus the next discriminating question. “Not Known Yet” broadens the result; it never manufactures certainty.

### 6.7 Ranking

Ranking changes the order of eligible results. It does not make an ineligible product eligible.

| Match Type | Relative Priority |
|---|---|
| Exact Approved Model Record | Highest |
| Primary Product Record | Very High |
| Buyer Requirement | High |
| Stage Relationship | Medium-High |
| Product Family | Medium |
| Project Route | Supporting |
| Equal Score | Stable V4 Portfolio Order |

Every result displays up to three reasons explaining why it appeared.

### 6.8 Result States

| State | Meaning | Next Step |
|---|---|---|
| Relevant Results Found | Governed records satisfy the active constraints | Inspect, select, compare or prepare a review |
| Broad Family Result | Information is insufficient for model narrowing | Answer the next technical question |
| No Exact Model Result | Search did not match a public V4 record | Try a problem, stage or family route |
| No Governed Public Match | No record satisfies all active constraints | Remove or correct a filter; ask Puretronics if the need is outside published data |
| Multiple-Stage Result | A new-line/OEM review spans several stages | Review the products within each stage group |
| Recoverable Error | Local data or interface state could not be read | Reset or reload without submitting information |

## 7. Production-Line Map

The Map is an orientation aid. It is not a complete cable-manufacturing specification.

| Stage | Stage Purpose | Primary Products | Contextual Products | Why They Appear |
|---|---|---|---|---|
| 1. Pay-Off / Unwind | Material enters the line | None | P10, P11, P12, P13 | Indication, sensing, control and braking may support applicable pay-off arrangements |
| 2. Conductor Joining / Repair | Join or repair conductor before processing | P09 | None | P09 performs the joining/repair role |
| 3. Tension / Braking | Manage separate tension-system roles | P10, P11, P12, P13 | None | P10 indicates, P12 senses, P11 controls and P13 actuates braking |
| 4. Preheating and Other Pre-Extrusion Preparation | Prepare material before extrusion | P07, P08 | None | P07 preheats; P08 applies talcum or graphite powder |
| 5. Extrusion / Insulation / Sheathing | Form the insulated or sheathed product | None | P07 | P07 supports the immediately preceding preheating process |
| 6. Cooling and Inline Inspection | Transition from cooling to inspection | None | P01, P02, P03, P04 | Measurement or spark testing may be installed downstream, depending on the line |
| 7. Dimensional Measurement | Measure diameter and applicable lump/neck conditions | P01, P02, P03 | None | These are the governed inline measurement platforms |
| 8. Spark Testing and Fault Response | Detect inline insulation faults | P04 | None | P04 provides the spark-testing role |
| 9. Take-Up / Rewind / Coiling | Handle downstream product | None | P04, P10, P11, P12, P13 | Fault response and tension roles may affect applicable downstream arrangements |
| Offline High-Voltage Testing | Validate finished cable or samples outside the line | P05 | None | P05 provides separate AC or DC HV paths |
| Fire-Resistance Testing | Conduct a defined fire/circuit-integrity project | P06 | None | P06 is a project-specific laboratory system |

The two laboratory paths are not stages 10 and 11. They are independent review paths.

Selecting a stage does three things:

1. Highlights the stage.
2. Filters the common result engine.
3. Opens a stage drawer explaining each product's role.

“Add Stage to Application Review” also adds the stage to Interactive Section 2 and scrolls the visitor to it.

## 8. Capability Matrix

### 8.1 Why There Are 12 Paths and 13 Products

The Matrix is organised by buyer requirement, not by product count. One requirement can contain several products, and one product can serve more than one problem context.

For example, **Inline Dimensional Measurement** contains P01, P02 and P03. The 12 requirement rows together contain all 13 distinct Primary Products.

The unfiltered default must show:

- **12 Requirement Paths**
- **13 Distinct Primary Products**
- **5 Product Families**

### 8.2 Requirement Crosswalk

| Requirement Path | Primary Products |
|---|---|
| Inline Dimensional Measurement | P01, P02, P03 |
| Lump-and-Neck Detection | P03 |
| Inline Insulation-Fault Detection | P04 |
| Offline High-Voltage Testing | P05 |
| Fire-Resistance or Circuit-Integrity Testing | P06 |
| Conductor Preheating | P07 |
| Powder Application | P08 |
| Conductor Joining or Repair | P09 |
| Tension Indication | P10 |
| Load or Tension Sensing | P12 |
| Active Tension Control | P11 |
| Pneumatic Braking | P13 |

### 8.3 Filters

| Filter | Effect |
|---|---|
| Find a Requirement or Product | Constrains rows by requirement, product, model or alias match |
| Product Family | Shows paths containing products in the selected family; empty state reads “All Five Product Families” |
| Where It Fits | Uses the shared primary and contextual stage relationships |
| Project Context | Keeps products approved for the selected project route |

The Matrix search box is a view-local inspection tool. Its search text does not automatically become Application Review data. A shared requirement selected through the Navigator remains visible across views, while a product opened from the Matrix can be added to the Application Review through its Product Details drawer.

Filtered counts describe the current result, not the total portfolio.

### 8.4 Worked Matrix Examples

| Input | Output |
|---|---|
| No Filters | 12 Paths, 13 Products, 5 Families |
| Search `Spark` | Inline Insulation-Fault Detection and P04 |
| Family PF03 | Offline HV and Fire-Resistance paths; P05 and P06 |
| Stage Pre-Extrusion | Conductor Preheating and Powder Application; P07 and P08 |
| Requirement Tension Instability | P10, P11, P12 and P13 across their distinct requirement rows |

The dense format deliberately avoids displaying dozens of empty family intersections.

## 9. Model-to-Model Comparison Workbench

### 9.1 Comparison Boundary

Only models, variants or capacity SKUs within one Primary Product are compared. Products with different system roles are not forced into a technical table.

The visitor can select the Primary Product directly from the Workbench. No earlier Navigator step is required.

- Desktop: Up to Three Records
- Mobile: Up to Two Visible Records
- P12: Loadcell Series or Individual Capacity SKUs

### 9.2 How Rows Are Built

The Workbench collects the union of every specification label populated in V4 for at least one selected record.

- If a parameter exists for at least one selected model, the row is shown.
- If the parameter is absent for every selected model, the row is omitted.
- If a row is shown but one model has no V4 value, that cell contains an em dash (`—`).
- The em dash means “V4 has no value for this record.” It does not mean zero, not applicable or technically unavailable.
- “Show Differences Only” hides rows whose displayed values are identical.
- Availability and model-specific caveats are shown separately from technical specifications.

### 9.3 P08 Example

Selecting P08 — LSP Static Powder Applicator and two LSP models displays every populated V4 specification found across those selected records. For LSP-G1 and LSP-G2, this includes the full populated technical set—such as power supply, maximum speed, maximum cable diameter, dimensions, centre height, maximum power, powder specification, operating sound level, user interface, application scope and weight—where held in V4.

The Workbench does not score a winner. A higher speed or larger size is not automatically better; the correct model depends on the complete application.

## 10. Interactive Section 2 — Prepare Your Application Review

### 10.1 Purpose

The Application Review turns browsing into an organised technical conversation. It collects no contact details and submits nothing automatically.

### 10.2 Entry Routes

The visitor may begin with no prior selection or carry forward:

- A Product From the Navigator
- A Product Family
- A Shared Requirement Selected Through the Explorer
- A Map Stage
- A Project Route
- A Product From the Comparison Workbench
- Any Combination of These

Carried products, families, requirements and stages are additive. They remain visible and removable. A project route is also carried visibly, but it acts as a compatibility constraint on the candidate scope; a route alone does not create a product candidate.

### 10.3 MCQ Structure

The builder uses only governed buttons, radio-style choices and checkboxes. There are no write-in or unrestricted numeric fields.

| Section | Purpose |
|---|---|
| 1. Requirement and Capability Path | Establish where the requirement occurs and the closest capability path |
| 2. Product, Material or Sample | Record what is being processed and which inputs are known |
| 3. Governed Technical Conditions | Apply family-specific V4 choices and boundaries |
| 4. Integration and Evidence | Identify existing interfaces and available review material |
| 5. Project Context | Record route, project stage and timing band |

“Not Known Yet” leaves an open question. “Not Applicable” is visible in Known Information; if the information is mandatory it also creates a confirmation need. Partial, unavailable and unconfirmed answers remain visible and cannot establish alignment.

For multiple-choice questions, “None Yet,” “Not Known Yet” and “Not Applicable” are exclusive choices. Selecting a substantive choice removes the exclusive choice.

## 11. Complete Input-to-Output Dictionary

The current exhaustive dictionary is Appendix D. It includes all 60 questions, their conditional branches, product scopes and option effects. Scope is additive; scientific conditions constrain only applicable products.

## 12. Scientific Product and Model Fit Logic



### 12. Scope and deterministic interpretation (Sections 11–14 and the output-state appendix)

1. Every family question has an explicit product scope. Its answers constrain only those products. A spark voltage cannot exclude a laser, powder applicator or brake. Within the tension family, indicator wire size, loadcell capacity and brake torque cannot constrain each other's equipment roles.
2. Model choices within a single question combine by union; separate applicable questions combine by intersection. An applicable question that permits no model from a product must remove that product's models. It must not be skipped merely because its list contains models from another product.
3. AC-specific offline questions affect only the AC configuration; DC-specific questions affect only the DC configuration. Selecting both methods retains two distinct paths and applies each method's voltage/current limits independently.
4. Offline validation paths, process-equipment paths and tension-system roles are multiple-choice multi-select questions. Select all required paths. This supports independent AC/DC/fire work, preheating/powder/joining work, and indication/sensing/control/braking work within one review.
5. Technical questions for products outside the active review scope are hidden. Conditional answers that become hidden do not affect the outcome; this includes the combined solid-conductor/preheater diameter check.
6. Known role or project-route contradictions remain exclusions. Excluded products return no candidate models or capacity options. Customer reasons use public product/model names; source identifiers remain available only for internal traceability.
7. Status precedence is: known exclusion; project-specific/configuration review; incomplete information; preliminary alignment. A project-review result can still contain open questions. Unknown, unanswered, partial, unavailable, unconfirmed and Not Applicable answers do not meet a mandatory requirement and never create a technical exclusion by themselves.
8. The common location, material/construction category and project context must be answered for preliminary alignment. Product-specific mandatory questions below are additional. Answering a readiness question is not engineering approval.

### 12. Measurement (PF01)

Retain these model intervals: LASER 2008 0.8–35 mm; LASER 2008B 1.0–150 mm; LASER-2012 0.1–12 mm; LASER-2030 0.1–30 mm; LASER-2060 0.5–65 mm; LASER-2010H 0.1–10 mm; LASER-2020H 0.3–20 mm; LASER-2030H 0.3–30 mm. Both requested minimum and maximum must be covered by the same remaining model. Lump/neck detection remains limited to LASER-H and does not become a general surface-inspection claim.

Mandatory: measurement function, minimum diameter, maximum diameter, axes, required outputs and optical material condition. Add `pf01-material`: opaque wire/cable; transparent/translucent product; Not Known Yet. Transparent/translucent requirements produce project review because the selected optical configuration needs confirmation.

### 12. Spark testing (PF02)

Preserve distinct methods: Live mains-frequency AC (200 m/min, up to 30 kV, standard OD through 40 mm and on-demand through 60 mm); Acute high-frequency AC (1500 m/min, up to 15 kV, OD through 15 mm); DC (up to 2500 m/min, up to 20 kV, standard OD through 15 mm and on-demand through 30 mm). All start at 1.5 kV and 0.5 mm OD. No method's values transfer to another method.

Mandatory `pf02-min-voltage` (below 1.5 kV / 1.5 kV or higher / unknown) and `pf02-min-diameter` (below 0.5 mm OD / 0.5 mm or larger / unknown), in addition to existing principle, maximum speed, maximum voltage, maximum diameter and fault-response questions. Values below the minimum exclude the published spark models. On-demand diameter conditions produce project review only for the affected retained method. Logging/marking/calibration/UL-electrode requests retain the configuration-review qualifications already present.

### 12. Offline HV and fire testing (PF03)

AC remains up to 40 kV and up to 1 A; higher requirements are request-based. DC remains 0.5–20 kV at 1 mA; other requirements need review. These are separate configuration paths even when both are selected.

Mandatory `pf03-test-basis`: sample, procedure, duration and safety arrangement defined / partly defined / unknown. Required test functions must also be answered. Fire resistance always remains Project-Specific Review, with the method, sample and site/safety questions retained; no universal standard, edition or compliance approval is inferred.

### 12. Preheating (PF04)

Do not treat 0.3–3.6 mm is the complete product boundary. The current configurable parent envelope is solid conductor 0.1–10 mm; bunched conductor 0.1–16 mm; line speed 40–2000 m/min; temperature 60–180°C. The three listed classes are 1000 m/min at 0.4–3.6 mm, 1500 m/min at 0.5–2.8 mm, and 2000 m/min at 0.3–1.4 mm. Their maximum speed depends on conductor diameter.

Mandatory material (copper / aluminium / steel / other specified material / unknown) and construction (solid / bunched or stranded / unknown). Split the minimum-diameter low end into below 0.1 mm and 0.1–below 0.3 mm. Split the maximum-diameter high end into above 3.6–10 mm, above 10–16 mm and above 16 mm. Add a shared process-speed choice below 40 m/min, followed by 40–100 m/min and the existing upper bands.

A listed class is removed when a known diameter or speed exceeds that class. If no class remains but the requirement is within the wider configurable envelope, retain the preheater product as Project-Specific Review with no standard class claimed. Solid conductor above 10 mm, any conductor below 0.1 mm or above 16 mm, speed below 40 or above 2000 m/min, and temperature outside 60–180°C exclude the published envelope. Unknown construction cannot create the solid-conductor exclusion.

Every retained preheater outcome remains Project-Specific Review: independent diameter/speed/temperature bands do not establish a thermal-duty intersection. Material, temperature rise, power and line integration require combined review.

### 12. Powder application and joining (PF04)

Keep talcum LSP-G1/G2/G3/G2-100 and graphite LSP-G2-GR50/GR250 distinct. Their respective maximum speed/diameter pairs remain 150/40, 250/40, 400/40, 150/100, 150/40 and 100/100 (m/min and mm). A shared process-speed band above 400 m/min excludes every powder model even if it still permits preheaters.

Mandatory `pf04-powder-specification`: talcum mesh 2000 or finer; THIELMANN GRAPHITE 23061 or confirmed equivalent; another specification; unknown. The named talcum/graphite choices narrow their respective variants. Another specification produces project review. All five readiness confirmations are required: clean/dry suitable powder; earthing below 1 V and machine earth connection; moisture/mist-free panel air; running height matching the selected applicator; 415 VAC three-phase supply and required power. Merely having these conditions documented is insufficient. Missing confirmations remain open.

Mandatory `pf04-joining-size`: below 0.2 mm²; 0.2–6 mm²; above 6 mm²; unknown. The value is cross-sectional area, not diameter. The two outside choices exclude the documented welding product even though it has no model children. Material (copper/aluminium) and construction (solid/stranded) remain mandatory.

### 12. Tension indication, sensing, control and braking (PF05)

WTI-90-40 remains 0.2–5 mm; WTI-100-40 remains 2–10 mm. Every tension-range selection is configuration-dependent and requires quotation review. **The Above 40 kg outcome** with Project-Specific Review: standard coverage above 40 kg is not asserted, and the model remains a candidate for configuration confirmation. Mandatory installation/output readiness: mechanical arrangement, calibration and outputs defined / partly defined / unknown.

LTC-PRO is always Project-Specific Review because sensor, actuator and machine interfaces must be reviewed as one architecture. It is not a substitute for a loadcell, indicator or brake.

Retain exactly 24 loadcell capacities: LC-AR-85 10/20/50/100 kg; LC-AR-118 and LC-AR-125 each 50/100/200/500 kg; LC-AR-ST 100/200/500/1000 kg; LC-AR-60 10/20/50 kg; LC-AR-HD 100/500/1000/2000/5000 kg. Mounting combinations remain flange (85/118/60), flange with pilot hole (125), pillow block (ST/HD). Capacity and mounting intersect at the exact series/capacity option; equal capacity does not mean interchangeability. Mandatory loadcell geometry/signal readiness: shaft geometry, load direction, signal and environment defined / partial / unknown. Any surviving LC-AR-60 or LC-AR-HD option creates project review because signal, protection and availability details require confirmation.

Brake torque ranges remain per caliper: AX-250 0.15–16 kg·m / 2500 rpm; AX-400 0.25–27 kg·m / 1500 rpm; AX-500 0.33–33 kg·m / 1200 rpm. Pressure remains 0.2–6 bar. Only apply the torque filter after the visitor confirms a per-caliper basis. Total system torque, unknown basis or a stale torque choice cannot exclude models; the per-caliper question stays open. Clarify that an out-of-range pressure answer means the **brake must operate** outside 0.2–6 bar. A higher plant supply alone is not an exclusion if it can be regulated.

Every retained brake outcome remains Project-Specific Review even when geometry, duty and mounting are documented. There is no validated torque-versus-pressure curve or supplied thermal/mechanical calculation establishing that those individually known conditions work together.


## 13. Unknowns, Exclusions and Safeguards

- Unknown answers never exclude a product or model.
- Unanswered mandatory questions appear under Information Still Required.
- Partial, unavailable or unconfirmed answers are recorded and also create a confirmation question.
- Missing V4 specifications are never invented.
- Request-based conditions produce Project-Specific Review, not a standard-coverage claim.
- P03 supports validated lump-and-neck detection; it is not described as a general surface-defect system.
- P04 Live, Acute and DC methods retain separate voltage, diameter and speed paths.
- P05 AC and DC voltage/current paths remain separate.
- P06 always remains project-specific.
- P10 indicates tension and is not an active controller.
- P11 is the controller role and requires reviewed sensing, actuation and machine interfaces.
- P12 capacities, materials, certifications and ATEX status remain model/SKU-specific. ATEX is not generalised beyond LC-AR-85 where specified.
- P13 values are model-specific and per-caliper where stated. Reel geometry, shaft speed, duty, air and mounting still require review.
- A contextual map relationship never proves installation fit.
- An em dash in comparison never becomes a technical value.

## 14. Application Review Brief

The generated brief contains:

| Brief Section | Content |
|---|---|
| Relevant Capability Paths | Product Families represented by the active candidate products |
| Product and Model Fit | Status for every candidate Primary Product |
| Models Remaining | Model records surviving the selected technical boundaries |
| Exact Capacity SKUs Remaining | P12 capacity SKUs matching the selected capacity and series intersection |
| Evidence-Based Exclusions | Selected condition, excluded records and evidence source |
| Known Information | Decisive MCQ answers and carried Explorer stages, requirements and routes |
| Information Still Required | Mandatory unanswered, unknown or incomplete questions |
| Product-Specific Caveats | V4 caveats for the product and remaining models |
| Useful Review Materials | Suggested layouts, drawings, procedures and application details |
| Disclaimer | Final selection requires Puretronics application review |

The visitor can edit answers, copy the brief, print/save it, or reset after confirmation. No brief is automatically submitted.

The booking CTA records only an allowlisted location such as “Readiness Brief.” The review placeholder displays no retained context.

## 15. Worked End-to-End Journeys

### 15.1 Diameter Variation

| Step | Visitor Input | System Interpretation | Visible Output |
|---|---|---|---|
| 1 | Diameter Variation | Measurement requirement | P01, P02, P03 |
| 2 | Lump/Neck Not Required | Diameter-only function remains | P01, P02, P03 |
| 3 | Minimum 0.5 mm; Maximum 35 mm | Intersect lower and upper model ranges | P01A/P01B/P02C remain among applicable records |
| 4 | Dual Axis | Apply approved dual-axis path | P02 family path retained; P01 removed by function requirement |

Known inputs enter the brief. Output/interface needs remain open unless answered. Final installation location and interfaces require Puretronics review.

### 15.2 High-Speed Spark Testing

| Step | Visitor Input | System Interpretation | Visible Output |
|---|---|---|---|
| 1 | Inline Insulation-Fault Detection | P04 path | Live, Acute and DC models available initially |
| 2 | Above 1500 to 2500 m/min | Apply speed limit | P04C DC remains |
| 3 | DC and 15 mm or less | Apply method and diameter | P04C remains |
| 4 | Logging Required | Supporting function needs validation | Project-Specific Review |

The brief explains why P04C remains and why logging still needs Puretronics confirmation.

### 15.3 Offline AC High-Voltage Testing

| Step | Visitor Input | System Interpretation | Visible Output |
|---|---|---|---|
| 1 | Offline Laboratory | P05/P06 scope | Offline test paths |
| 2 | AC HV | P05A method | P05A remains |
| 3 | Up to 40 kV and Up to 1 A | Within published path | Preliminary alignment when required questions are complete |
| 4 | Above 40 kV | Request-based condition | Project-Specific Review, not exclusion |

### 15.4 Fire-Resistance System

| Step | Visitor Input | System Interpretation | Visible Output |
|---|---|---|---|
| 1 | Fire/Circuit-Integrity Testing | P06 path | P06 Project-Specific System |
| 2 | Method Partly Defined | Essential basis incomplete | Project-Specific Review plus open question |
| 3 | Sample and Site Partly Defined | Configuration inputs incomplete | Exact missing information listed |

P06 is never labelled a standard fixed system.

### 15.5 Wire Preheating

| Step | Visitor Input | System Interpretation | Visible Output |
|---|---|---|---|
| 1 | Preheat | P07 path | Three configurations initially |
| 2 | 1500 m/min Maximum | Speed keeps P07B/P07C | Two configurations remain |
| 3 | Minimum 0.5 mm; Maximum 2.8 mm | Intersect wire ranges | P07B remains among the exact configured paths |
| 4 | 60–180°C | Inside published range | Project-Specific Review; combined thermal duty requires confirmation |

### 15.6 Powder Application

| Step | Visitor Input | System Interpretation | Visible Output |
|---|---|---|---|
| 1 | Graphite Powder | P08E/P08F | Graphite variants only |
| 2 | 100–150 m/min | Speed intersection | P08E remains |
| 3 | Up to 40 mm | Diameter intersection | P08E remains |
| 4 | All Five Readiness Conditions Confirmed | Mandatory installation information complete | Aligned With Known Requirements, subject to review |

### 15.7 Tension Instability

| Step | Visitor Input | System Interpretation | Visible Output |
|---|---|---|---|
| 1 | Unstable Tension | Multi-role requirement | P10, P11, P12, P13 |
| 2 | Integrated Review | Keep all four distinct roles | Indication, sensing, control and braking remain separate |
| 3 | Capacity, speed and brake data | Apply only to the relevant roles | Model/SKU narrowing for P12/P13 |

The output does not describe P10, P11, P12 and P13 as substitutes.

### 15.8 Multi-Stage New Line or OEM Project

| Step | Visitor Input | System Interpretation | Visible Output |
|---|---|---|---|
| 1 | New Line or OEM | Multi-stage project mode | Stage selection enabled |
| 2 | Pre-Extrusion, Measurement and Spark Testing | Union of stage groups | P07/P08; P01/P02/P03; P04 grouped by stage |
| 3 | Add Stages to Review | Carry stage scope | Family-specific MCQs become available |

The system does not force a single product to represent the whole project.

### 15.9 Known-Model Search

| Step | Visitor Input | System Interpretation | Visible Output |
|---|---|---|---|
| 1 | `AX-400` | Exact approved model code | P13B AX-400 under P13 Pneumatic Brake |
| 2 | Open Product | Parent/child relationship retained | Product role, specifications and caveats |
| 3 | Compare | Same-product comparison | AX models and complete populated V4 rows |
| 4 | Prepare Review | P13 carried forward | Brake-specific MCQs and open questions |

### 15.10 What Each Scenario Contributes to the Brief

| Scenario | Known Information | Typical Open Information | Why the Candidate Remains | Possible Exclusion | What Puretronics Must Validate |
|---|---|---|---|---|---|
| Diameter Variation | Measurement function and selected diameter bands | Axis, outputs, installation location and interfaces | At least one measurement model covers the chosen minimum and maximum | A model is removed when either diameter boundary is outside its range | Complete range, line conditions, axes, mounting and control interface |
| High-Speed Spark Testing | Method, speed, voltage and diameter bands | Fault-response equipment, electrode, logging, marking and calibration details | A P04 method record survives all published limits | A method is removed by a contradictory principle, speed, voltage or diameter | Test method, electrode, construction, line conditions and support functions |
| Offline AC HV | AC path, voltage band and current band | Sample, procedure, safety arrangement and reporting | P05A covers the selected published AC conditions | A conflicting route can remove P05; request-based values change status | Exact electrical duty, procedure, sample, safeguards and reporting |
| Fire Resistance | Fire path and any defined method, sample or site information | Exact method, edition, acceptance, layout, utilities and safety | P06 is the governed fire/circuit-integrity project path | No invented standard range is used to reject P06 | Complete project-specific system definition |
| Wire Preheating | Speed, minimum size, maximum size and temperature | Construction, installation space, utilities and interfaces | A P07 configuration survives the intersection | No P07 model survives a contradictory size, speed or temperature | Actual conductor, thermal duty, speed/diameter relationship and installation |
| Powder Application | Powder type, speed, diameter and readiness confirmations | Any unconfirmed powder, earthing, air, height or utility input | A talcum or graphite variant survives the selected boundaries | No P08 variant survives an out-of-range speed/diameter combination | Powder suitability, earthing, air quality, utilities and mechanical arrangement |
| Tension Instability | Required role and any known load, speed, torque or air condition | Machine architecture, geometry, duty, mounting and feedback | Each of P10–P13 remains only for its distinct role | A model or SKU can be removed by its own published boundary | Whether indication, sensing, control and actuation are required together |
| Multi-Stage Project | Project route and all selected stages | Stage-specific dimensions, speeds, interfaces, utilities and acceptance | Products are grouped within every selected stage | A later technical answer can remove a model within one stage | Complete line architecture and interfaces between equipment roles |
| Known-Model Search | Exact model identity and its parent Primary Product | Application conditions required to validate that model | Exact record match establishes a review path, not suitability | Later technical answers can show that the known model conflicts with the need | Whether the requested model fits the actual application |

For every scenario, the brief records the known governed choices, lists unanswered mandatory questions, explains model removals and retains applicable V4 caveats. The booking step receives none of this content.

## 16. Privacy, Session and Analytics

### Session

- State is stored only for the browser session.
- The stored shape is versioned.
- Invalid or older free-text readiness state is discarded safely.
- Reset returns the interactive experience to its governed defaults.

### Data

- No Runtime Notion Query
- No Exposed Token or Credential
- No Contact Details Collected
- No Automatic Form Submission
- No Free Text Stored in the URL

### Analytics

Analytics may record allowlisted IDs such as route, question, option, product/model, result count, exclusion reason and CTA location.

Analytics must not record personal data, raw search text, document contents, generated brief contents or arbitrary free text.

## 17. Puretronics Validation Checklist

### Portfolio and Discovery

- [ ] The Five Product Families are correct.
- [ ] All 13 Primary Products are correctly named and grouped.
- [ ] The model, variant and capacity-SKU hierarchy is correct.
- [ ] The 14 problem choices reflect real customer language.
- [ ] The 12 Matrix requirement paths are correct.
- [ ] Approved aliases and search behaviour are correct.

### Production and Testing Context

- [ ] Every Primary V4 placement is correct.
- [ ] Every adjacent relationship is useful and not misleading.
- [ ] The downstream fault-response context is correct.
- [ ] Offline HV and fire testing are correctly separated from the production line.
- [ ] P08 is correctly placed before extrusion.
- [ ] PF05 indication, sensing, control and braking roles are correctly separated.

### Application Review

- [ ] All MCQ wording is technically understandable.
- [ ] All numerical bands reproduce approved V4 boundaries.
- [ ] Request-based conditions are correctly labelled.
- [ ] Unknown information is handled correctly.
- [ ] Every hard exclusion is scientifically justified.
- [ ] Mandatory information for each product is complete.
- [ ] The four result statuses are acceptable.
- [ ] Suggested review documents are sufficient.

### Comparison and Conversion

- [ ] Every populated V4 comparison parameter is shown correctly.
- [ ] Em-dash behaviour is clear and acceptable.
- [ ] The Workbench should remain model-to-model only.
- [ ] The Application Review Brief is useful for a Puretronics discussion.
- [ ] No retained context should appear on the approved external booking destination.

### Correction Register

| Guide Section | Current Rule | Approved / Change Required | Required Correction | Puretronics Source |
|---|---|---|---|---|
| Example: PF02 Voltage | P04 paths currently end at the approved model limits |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |

## 18. Appendices

### Appendix A — Portfolio Architecture

The complete five-family, 13-product and model/variant architecture is recorded in Section 4.3. P12 capacity choices resolve to 24 V4 capacity SKUs beneath six loadcell series. Support records remain subordinate and do not alter the 13-product count.

### Appendix B — Requirement-to-Product Master Crosswalk

The complete 12-path crosswalk is recorded in Section 8.2. The sum of appearances is not the distinct-product count because P03 appears in both dimensional measurement and lump/neck discovery, while PF05 products may also be returned together for tension instability.

### Appendix C — Stage-to-Product Master Crosswalk

The complete nine-stage and two-laboratory-path crosswalk is recorded in Section 7. Primary relationships derive from V4. Adjacent and downstream-response relationships derive from the approved interactive orientation specification.

### Appendix D — MCQ Rule Register

Verified against the implemented 60 MCQs on 9 September 2026. These internal IDs are for validation only and do not appear on the public page. Common mandatory questions are location, material category and project context. Product-specific mandatory inputs are defined in Section 12.

| Question ID | Customer Question | Mode | Product Scope / Branch | Choices and Technical Effect |
|---|---|---|---|---|
| `requirement-location` | Where Does the Requirement Occur? | single | Common | On a Production Line; roles P01, P02, P03, P04, P07, P08, P09, P10, P11, P12, P13<br>In an Offline Laboratory or Test Area; roles P05, P06<br>Both Production and Offline Validation<br>Not Known Yet |
| `primary-requirement` | Which Requirement Is Closest to the Application? | single | Common | Inline Dimensional Measurement; roles P01, P02, P03<br>Lump-and-Neck Detection; roles P03<br>Inline Insulation-Fault Detection; roles P04<br>Offline High-Voltage Testing; roles P05<br>Fire-Resistance or Circuit-Integrity Testing; roles P06<br>Conductor Preheating; roles P07<br>Powder Application; roles P08<br>Conductor Joining or Repair; roles P09<br>Tension Indication; roles P10<br>Load or Tension Sensing; roles P12<br>Active Tension Control; roles P11<br>Pneumatic Braking; roles P13<br>Integrated Tension / Braking Path; roles P10, P11, P12, P13<br>Not Known Yet |
| `material-category` | What Is Being Processed or Tested? | single | Common | Solid Wire or Conductor<br>Bunched or Stranded Conductor<br>Insulated Wire<br>Cable<br>Web Material<br>Laboratory Sample<br>Not Known Yet |
| `known-inputs` | Which Technical Inputs Are Already Known? | multiple | Common | Diameter or Product Size<br>Line or Shaft Speed<br>Test Method or Voltage<br>Target Temperature<br>Tension or Load<br>None Yet |
| `pf01-function` | Which Measurement Function Is Required? | single | P01, P02, P03 | Diameter Measurement; roles P01, P02, P03<br>Diameter Measurement With Lump-and-Neck Detection; roles P03<br>Not Known Yet |
| `pf01-min-diameter` | What Is the Smallest Diameter the Selected Model Must Measure? | single | P01, P02, P03 | Below 0.1 mm → No listed model<br>0.1 mm to Below 0.3 mm → P02A, P02B, P03A<br>0.3 mm to Below 0.5 mm → P02A, P02B, P03A, P03B, P03C<br>0.5 mm to Below 0.8 mm → P02A, P02B, P02C, P03A, P03B, P03C<br>0.8 mm to Below 1.0 mm → P01A, P02A, P02B, P02C, P03A, P03B, P03C<br>1.0 mm or Larger → P01A, P01B, P02A, P02B, P02C, P03A, P03B, P03C<br>Not Known Yet |
| `pf01-max-diameter` | What Maximum Measurement Diameter Must the Selected Model Cover? | single | P01, P02, P03 | Up to 10 mm → P01A, P01B, P02A, P02B, P02C, P03A, P03B, P03C<br>Above 10 mm to 12 mm → P01A, P01B, P02A, P02B, P02C, P03B, P03C<br>Above 12 mm to 20 mm → P01A, P01B, P02B, P02C, P03B, P03C<br>Above 20 mm to 30 mm → P01A, P01B, P02B, P02C, P03C<br>Above 30 mm to 35 mm → P01A, P01B, P02C<br>Above 35 mm to 65 mm → P01B, P02C<br>Above 65 mm to 150 mm → P01B<br>Above 150 mm → No listed model<br>Not Known Yet |
| `pf01-axes` | Which Measurement-Axis Requirement Applies? | single | P01, P02, P03 | Single Axis or Axis Count Not Specified<br>Dual-Axis Measurement; roles P02, P03<br>Not Known Yet |
| `pf01-output` | Which Measurement Output Is Required? | multiple | P01, P02, P03 | Local Display<br>Upper / Lower Limit Alarm<br>Data Collection or Analysis<br>Machine or Control-System Communication<br>Not Known Yet |
| `pf01-material` | Which Optical Measurement Condition Applies? | single | P01, P02, P03 | Opaque Wire or Cable<br>Transparent or Translucent Product; Technical Review<br>Not Known Yet |
| `pf02-principle` | Which Inline Spark-Test Principle Is Required? | single | P04 | Live AC at Supply Frequency → P04A<br>Acute / High-Frequency Sine-Wave AC → P04B<br>Direct Current → P04C<br>Not Known Yet |
| `pf02-speed` | Which Maximum Line-Speed Band Applies? | single | P04 | Up to 200 m/min → P04A, P04B, P04C<br>Above 200 m/min to 1500 m/min → P04B, P04C<br>Above 1500 m/min to 2500 m/min → P04C<br>Above 2500 m/min → No listed model<br>Not Known Yet |
| `pf02-voltage` | Which Maximum Test-Voltage Band Applies? | single | P04 | Below 1.5 kV → No listed model<br>1.5 kV to 10 kV → P04A, P04B, P04C<br>Above 10 kV to 15 kV → P04A, P04B, P04C<br>Above 15 kV to 20 kV → P04A, P04C<br>Above 20 kV to 25 kV → P04A<br>Above 25 kV to 30 kV → P04A<br>Above 30 kV → No listed model<br>Not Known Yet |
| `pf02-diameter` | Which Maximum Wire or Cable-Diameter Band Applies? | single | P04 | Below 0.5 mm OD → No listed model<br>0.5 mm to 15 mm OD → P04A, P04B, P04C<br>Above 15 mm to 30 mm OD → P04A, P04C; review P04C<br>Above 30 mm to 40 mm OD → P04A<br>Above 40 mm to 60 mm OD → P04A; review P04A<br>Above 60 mm OD → No listed model<br>Not Known Yet |
| `pf02-response` | Which Fault-Response or Quality Functions Are Required? | multiple | P04 | Fault Indication and Counting<br>Data Logging and Graphics; Technical Review<br>Inline Fault Marking; Technical Review<br>Sensitivity Calibration; Technical Review<br>UL Electrode Option; Technical Review<br>Not Known Yet |
| `pf02-min-diameter` | What Is the Smallest Wire or Cable Diameter to Be Spark Tested? | single | P04 | Below 0.5 mm OD → No listed model<br>0.5 mm OD or Larger → P04A, P04B, P04C<br>Not Known Yet |
| `pf02-min-voltage` | What Is the Lowest Required Spark-Test Voltage? | single | P04 | Below 1.5 kV → No listed model<br>1.5 kV or Higher → P04A, P04B, P04C<br>Not Known Yet |
| `pf03-path` | Which Offline Validation Paths Apply? | multiple | P05, P06 | Offline AC High-Voltage Testing → P05A; roles P05<br>Offline DC High-Voltage Testing → P05B; roles P05<br>Fire-Resistance / Circuit-Integrity Testing; roles P06<br>Not Known Yet |
| `pf03-ac-voltage` | Which Maximum AC Test-Voltage Band Applies? | single | P05; when pf03-path = ac | Up to 20 kV AC → P05A<br>Above 20 kV to 40 kV AC → P05A<br>Above 40 kV AC → P05A; Technical Review<br>Not Known Yet |
| `pf03-ac-current` | Which Maximum AC Output-Current Band Applies? | single | P05; when pf03-path = ac | Up to 1 mA AC → P05A<br>Above 1 mA to 1 A AC → P05A<br>Above 1 A AC → P05A; Technical Review<br>Not Known Yet |
| `pf03-dc-voltage` | Which Maximum DC Test-Voltage Band Applies? | single | P05; when pf03-path = dc | 0.5 kV to 20 kV DC → P05B<br>Another DC Voltage Range → P05B; Technical Review<br>Not Known Yet |
| `pf03-dc-current` | Which DC Output-Current Requirement Applies? | single | P05; when pf03-path = dc | 1 mA DC → P05B<br>Another DC Output Current → P05B; Technical Review<br>Not Known Yet |
| `pf03-safety-reporting` | Which Offline Test Functions Are Required? | multiple | P05; when pf03-path = ac / dc | Audio / Visual Fault Indication<br>Digital Timer<br>Door Interlock<br>Soft Auto-Discharge<br>Recorded Test Results or Reporting<br>Not Known Yet |
| `pf03-fire-basis` | Is the Fire-Test Method or Applicable Specification Available? | single | P06; when pf03-path = fire | Yes — Method or Specification Is Available; roles P06<br>Partly Defined<br>Not Available Yet<br>Not Known Yet |
| `pf03-fire-sample` | Is the Cable or Sample Construction Defined? | single | P06; when pf03-path = fire | Cable or Sample Construction Is Defined<br>Partly Defined<br>Not Known Yet |
| `pf03-fire-site` | Are the Test-Area, Utilities and Safety Requirements Defined? | single | P06; when pf03-path = fire | Test Area, Utilities and Safety Requirements Are Defined<br>Partly Defined<br>Not Known Yet |
| `pf03-test-basis` | Are the Offline Electrical Test Method and Sample Defined? | single | P05; when pf03-path = ac / dc | Sample, Test Procedure, Duration and Safety Arrangement Are Defined<br>Only Partly Defined<br>Not Known Yet |
| `pf04-path` | Which Process-Equipment Requirements Apply? | multiple | P07, P08, P09 | Inline Conductor Preheating; roles P07<br>Talcum Powder Application → P08A, P08B, P08C, P08D; roles P08<br>Graphite Powder Application → P08E, P08F; roles P08<br>Conductor Joining / Repair; roles P09<br>Not Known Yet |
| `pf04-speed` | Which Maximum Process-Speed Band Applies? | single | P07, P08; when pf04-path = preheat / talc / graphite | Below 40 m/min → P08A, P08B, P08C, P08D, P08E, P08F<br>40 m/min to 100 m/min → P07A, P07B, P07C, P08A, P08B, P08C, P08D, P08E, P08F<br>Above 100 m/min to 150 m/min → P07A, P07B, P07C, P08A, P08B, P08C, P08D, P08E<br>Above 150 m/min to 250 m/min → P07A, P07B, P07C, P08B, P08C<br>Above 250 m/min to 400 m/min → P07A, P07B, P07C, P08C<br>Above 400 m/min to 1000 m/min → P07A, P07B, P07C<br>Above 1000 m/min to 1500 m/min → P07B, P07C<br>Above 1500 m/min to 2000 m/min → P07C<br>Above 2000 m/min → No listed model<br>Not Known Yet<br>Not Applicable |
| `pf04-preheat-min-size` | What Is the Smallest Conductor Diameter to Be Preheated? | single | P07; when pf04-path = preheat | Below 0.1 mm → No listed model; Known Exclusion<br>0.1 mm to Below 0.3 mm → No listed model; Technical Review<br>0.3 mm to Below 0.4 mm → P07C<br>0.4 mm to Below 0.5 mm → P07A, P07C<br>0.5 mm or Larger → P07A, P07B, P07C<br>Not Known Yet |
| `pf04-preheat-max-size` | What Is the Largest Conductor Diameter to Be Preheated? | single | P07; when pf04-path = preheat | Up to 1.4 mm → P07A, P07B, P07C<br>Above 1.4 mm to 2.8 mm → P07A, P07B<br>Above 2.8 mm to 3.6 mm → P07A<br>Above 3.6 mm to 10 mm → No listed model; Technical Review<br>Above 10 mm to 16 mm → No listed model; Technical Review<br>Above 16 mm → No listed model; Known Exclusion<br>Not Known Yet |
| `pf04-powder-size` | Which Maximum Cable-Diameter Band Applies? | single | P08; when pf04-path = talc / graphite | Up to 40 mm → P08A, P08B, P08C, P08D, P08E, P08F<br>Above 40 mm to 100 mm → P08D, P08F<br>Above 100 mm → No listed model<br>Not Known Yet |
| `pf04-temperature` | Which Target Conductor-Temperature Band Applies? | single | P07; when pf04-path = preheat | 60°C to 180°C → P07A, P07B, P07C<br>Outside 60°C to 180°C → No listed model<br>Not Known Yet |
| `pf04-powder-readiness` | Which Powder-Application Conditions Are Confirmed? | multiple | P08; when pf04-path = talc / graphite | Clean, Dry Powder Meets the Selected Talcum Mesh or Graphite Grade<br>Earthing Below 1 V and the Machine Earth Connection Are Confirmed<br>Panel Air Is Free of Moisture and Mist<br>Wire Running Height Matches the Selected Applicator<br>415 VAC Three-Phase Supply and Required Power Are Available<br>Not Known Yet |
| `pf04-joining-material` | Which Conductor Material Requires Joining or Repair? | single | P09; when pf04-path = joining | Copper<br>Aluminium<br>Not Known Yet |
| `pf04-joining-construction` | Which Conductor Construction Applies? | single | P09; when pf04-path = joining | Solid Conductor<br>Stranded Wire<br>Not Known Yet |
| `pf04-preheat-construction` | Which Conductor Construction Will Be Preheated? | single | P07; when pf04-path = preheat | Solid Conductor<br>Bunched or Stranded Conductor<br>Not Known Yet |
| `pf04-preheat-material` | Which Preheater Material Is Specified? | single | P07; when pf04-path = preheat | Copper<br>Aluminium<br>Steel<br>Another Specified Material; Technical Review<br>Not Known Yet |
| `pf04-powder-specification` | Which Powder Specification Has Been Confirmed? | multiple | P08; when pf04-path = talc / graphite | Talcum Powder, Mesh 2000 or Finer → P08A, P08B, P08C, P08D<br>THIELMANN GRAPHITE 23061 or Confirmed Equivalent → P08E, P08F<br>Another Powder Specification; Technical Review<br>Not Known Yet |
| `pf04-joining-size` | What Conductor Cross-Section Requires Joining? | single | P09; when pf04-path = joining | Below 0.2 mm²; Known Exclusion<br>0.2 mm² to 6 mm²<br>Above 6 mm²; Known Exclusion<br>Not Known Yet |
| `pf05-role` | Which Tension-System Roles Are Required? | multiple | P10, P11, P12, P13 | Tension Indication; roles P10<br>Load / Tension Sensing; roles P12<br>Active Tension Control; roles P11<br>Pneumatic Braking Actuation; roles P13<br>Integrated Sensing, Control and Braking Review; roles P10, P11, P12, P13<br>Not Known Yet |
| `pf05-indicator-size` | Which Wire-Size Band Applies to the Tension Indicator? | single | P10; when pf05-role = indication / integrated | Below 0.2 mm → No listed model<br>0.2 mm to Below 2 mm → P10A<br>2 mm to 5 mm → P10A, P10B<br>Above 5 mm to 10 mm → P10B<br>Above 10 mm → No listed model<br>Not Known Yet |
| `pf05-indicator-tension` | Which Maximum Published Tension Configuration Is Required? | single | P10; when pf05-role = indication / integrated | Up to 15 kg → P10A, P10B; Technical Review<br>Above 15 kg to 40 kg → P10A, P10B; Technical Review<br>Above 40 kg → P10A, P10B; Technical Review<br>Not Known Yet |
| `pf05-capacity` | Which Exact Published Loadcell Capacity Is Required? | single | P12; when pf05-role = sensing / integrated | 10 kg → P12A, P12E; capacities P12A-C10, P12E-C10<br>20 kg → P12A, P12E; capacities P12A-C20, P12E-C20<br>50 kg → P12A, P12B, P12C, P12E; capacities P12A-C50, P12B-C50, P12C-C50, P12E-C50<br>100 kg → P12A, P12B, P12C, P12D, P12F; capacities P12A-C100, P12B-C100, P12C-C100, P12D-C100, P12F-C100<br>200 kg → P12B, P12C, P12D; capacities P12B-C200, P12C-C200, P12D-C200<br>500 kg → P12B, P12C, P12D, P12F; capacities P12B-C500, P12C-C500, P12D-C500, P12F-C500<br>1000 kg → P12D, P12F; capacities P12D-C1000, P12F-C1000<br>2000 kg → P12F; capacities P12F-C2000<br>5000 kg → P12F; capacities P12F-C5000<br>Another Capacity → No listed model<br>Not Known Yet<br>Not Applicable |
| `pf05-mounting` | Which Loadcell Mounting Category Applies? | single | P12; when pf05-role = sensing / integrated | Flange Mount → P12A, P12B, P12E<br>Flange Mount With Pilot Hole → P12C<br>Pillow-Block Arrangement → P12D, P12F<br>Not Known Yet |
| `pf05-control-architecture` | Which Existing Tension-Control Architecture Is Known? | multiple | P11; when pf05-role = control / integrated | Strain-Gauge Loadcell Feedback<br>Dancer Input<br>Line-Speed Input<br>Diameter Input<br>Magnetic-Brake Output<br>Pneumatic-Brake E-to-P Output<br>Not Known Yet |
| `pf05-rpm` | Which Maximum Brake-Speed Band Applies? | single | P13; when pf05-role = braking / integrated | Up to 1200 rpm → P13A, P13B, P13C<br>Above 1200 rpm to 1500 rpm → P13A, P13B<br>Above 1500 rpm to 2500 rpm → P13A<br>Above 2500 rpm → No listed model<br>Not Known Yet<br>Not Applicable |
| `pf05-torque` | Which Required Braking-Torque Band per Caliper Applies? | single | P13; when pf05-role = braking / integrated | Below 0.15 kg·m → No listed model<br>0.15 kg·m to Below 0.25 kg·m → P13A<br>0.25 kg·m to Below 0.33 kg·m → P13A, P13B<br>0.33 kg·m to 16 kg·m → P13A, P13B, P13C<br>Above 16 kg·m to 27 kg·m → P13B, P13C<br>Above 27 kg·m to 33 kg·m → P13C<br>Above 33 kg·m → No listed model<br>Not Known Yet |
| `pf05-air` | What Is Known About the Pneumatic Supply? | single | P13; when pf05-role = braking / integrated | A Regulated Brake Supply Within 0.2 Bar to 6 Bar Is Available → P13A, P13B, P13C<br>The Brake Must Operate Outside 0.2 Bar to 6 Bar → No listed model<br>Pneumatic Supply Is Not Confirmed<br>Not Known Yet |
| `pf05-torque-basis` | How Is the Braking Demand Defined? | single | P13; when pf05-role = braking / integrated | Required Torque per Caliper Is Known<br>Only Total System Braking Demand Is Known; Technical Review<br>Not Known Yet |
| `pf05-brake-geometry` | What Is Known About Reel, Core and Shaft Geometry? | single | P13; when pf05-role = braking / integrated | Reel, Core and Shaft Dimensions Are Documented<br>Only Partly Documented<br>Not Known Yet |
| `pf05-brake-duty` | Is the Braking Duty Defined? | single | P13; when pf05-role = braking / integrated | Duty and Operating Cycle Are Defined<br>Partly Defined<br>Not Known Yet |
| `pf05-brake-mounting` | Is the Brake Mounting Arrangement Defined? | single | P13; when pf05-role = braking / integrated | Mounting Arrangement Is Defined<br>Partly Defined<br>Not Known Yet |
| `pf05-loadcell-interface` | Are the Loadcell Geometry and Signal Requirements Defined? | single | P12; when pf05-role = sensing / integrated | Shaft Geometry, Load Direction, Signal and Environment Are Defined<br>Only Partly Defined<br>Not Known Yet |
| `pf05-wti-installation` | Are the Tension-Indicator Installation and Output Needs Defined? | single | P10; when pf05-role = indication / integrated | Mechanical Arrangement, Calibration and Outputs Are Defined<br>Only Partly Defined<br>Not Known Yet |
| `existing-equipment` | What Is Known About the Existing Equipment? | single | Common | Existing Equipment and Interfaces Are Documented<br>Only Partly Documented<br>No Existing Equipment<br>Not Known Yet<br>Not Applicable |
| `evidence` | Which Review Materials Are Available? | multiple | Common | Line or Test-Area Layout<br>Mechanical or Electrical Drawings<br>Test Procedure or Customer Specification<br>Equipment Photographs<br>Product or Sample Details<br>None Available Yet |
| `project-type` | What Is the Project Context? | single | Common | New Production Line<br>Existing-Line Retrofit<br>Replacement<br>Laboratory Project<br>OEM / Machine Build<br>Existing-Equipment Support<br>Not Known Yet |
| `project-stage` | What Is the Current Project Stage? | single | Common | Early Concept<br>Budgeting<br>Active Technical Review<br>Procurement<br>Installation Planning<br>Not Known Yet |
| `timing` | Which Timing Band Best Describes the Project? | single | Common | Immediate Technical Review<br>Within 3 Months<br>Within 3–6 Months<br>More Than 6 Months<br>Not Known Yet |

### Appendix E — Result and Exclusion Glossary

| Term | Meaning |
|---|---|
| Candidate | A record still in the review scope |
| Aligned | Consistent with the answered mandatory public conditions; not final approval |
| Potential | Still possible, but essential information is incomplete |
| Project-Specific | Requires direct configuration or validation by Puretronics |
| Excluded | Contradicts a selected published boundary or approved route |
| Open Question | Information needed before the review can become more specific |
| Evidence Source | The V4 record or governed relationship supporting the outcome |

### Appendix F — Plain-English Glossary

| Term | Meaning |
|---|---|
| Inline | Installed in or used during the running production process |
| Offline | Tested separately from the running production line |
| AC | Alternating Current |
| DC | Direct Current |
| OD | Outside Diameter |
| RPM | Revolutions per Minute |
| HMI | Human-Machine Interface |
| E-to-P | Electrical-to-Pneumatic Control Conversion |
| Pay-Off / Unwind | The line area from which material is released |
| Take-Up / Rewind | The line area where material is collected |
| Lump/Neck | A validated local diameter increase or decrease condition |
| Per Caliper | A value applying to one brake caliper, not automatically to the whole braking system |

### Appendix G — Source and Traceability Register

| Information Type | Governing Source |
|---|---|
| Product Families and Primary Products | Product Database V4 |
| Models, Variants, SKUs and Specifications | Product Database V4 Public-Safe Snapshot and Completeness Manifest |
| Primary Manufacturing Stage | Product Database V4 |
| Adjacent and Downstream Map Context | Interactive Sections Specification |
| Matching and Ranking | Deployed Deterministic Result Engine |
| Comparison Rows | Populated V4 Technical Specifications for Selected Records |
| MCQ Choices and Boundaries | V4-Governed Readiness Question Dataset |
| Fit Status and Brief | Deployed Fit and Brief Logic |
| Booking Boundary | Central Site Configuration |

The current validation evidence is recorded in capability-profile-app/qa/publish-readiness.md and the automated/browser reports. The scientific suite includes 267 source-based regressions.

### Appendix H — Change Control

When Puretronics requests a logic change:

1. Identify the affected guide section and V4 record.
2. State whether the change affects product facts, relationship logic, an MCQ, a model boundary or output wording.
3. Supply the later Puretronics validation or approved V4 update.
4. Update Product Database V4 first when the change is technical.
5. Update the curated public dataset and executable logic.
6. Update this Master Guide in the same release.
7. Re-run automated, responsive and deployed-site validation.
8. Record the verification date.

This keeps the guide, the governed technical source and the public experience aligned.


## 19. Publish-Readiness Implementation — 9 September 2026

## Shared Explorer Search and Filters

- Navigator and Matrix use the same persisted search value. Switching views neither clears it nor introduces a separate hidden Matrix search. Every active search remains visible and removable in the shared filter bar.
- OR applies within problems, families, stages and project routes; AND applies between dimensions and search.
- Search includes public product/model names, aliases, and the twelve requirement labels. Exact public model names have the highest ranking tier, followed by exact model aliases, broad model matches, exact product names, broad product names, and requirement-label matches. Other filter scores cannot outrank a higher search tier.
- Selecting a different Navigator Product Family clears the previous family discriminator's problem and model-search constraint. Other independently selected stages/project routes remain visible.
- In the Spark Testing family, Live AC, High-Frequency AC and DC selections identify the corresponding public model in the shared search. Fault indication, logging and marking choices are carried into review and show the applicable technical-review condition in results.
- Guided location, broad concern and project context constrain capability results. The known-measurement answer is carried into the Application Review and changes the explicit next-information prompt; it does not fabricate a numerical match before an operating range is supplied.
- The Matrix default is exactly 12 Requirement Paths, 13 Products and 5 Product Families. Its family dropdown retains the exact label All Five Product Families.

## Model Comparison

- Comparison remains within a single product. Selecting a product initially selects its first two models; visitors may remove every model and see an explicit empty selection state.
- Loadcell comparison level (series or capacity options) persists with the selection, including across view changes and session restoration. Older saved capacity selections are recovered under the capacity level.
- Maximum selections: three at widths of 768 pixels or greater; two below 768 pixels. Changing to a smaller screen retains the first two and removes the third so no hidden selection affects the table or disables other choices.
- Specification rows are the union of populated parameters across the selected models. All-empty parameters are omitted; em dash is used only for a value absent on one model when another selected model has that parameter. The em dash is explained in customer language. No source IDs, publication-status terms, database labels or internal record identifiers appear.
- Show Differences Only compares the displayed values. The comparison gives no winner or inference that a greater number means better application fit.

## Application Review and Brief

- Questions use native radio and checkbox inputs, fieldsets and legends. There are no text, textarea, contenteditable or unrestricted numerical fields in the Application Review.
- None Yet, Not Known Yet and Not Applicable are exclusive choices in a multiple-choice group. Selecting a substantive answer removes an exclusive choice. An exclusive checkbox may itself be cleared.
- Progress is the count of visible questions with a valid selected answer. An emptied checkbox group is unanswered. Progress explicitly measures answers, not engineering readiness.
- Not Applicable is retained in Known Information. If the fit evaluator requires the input for the selected product, the brief also asks to confirm whether that required information applies. Not Known Yet creates an open question. Partial/unconfirmed answers remain visible and add a confirmation question.
- Edit Answers exits the generated brief while preserving scope and answers and restoring keyboard focus to the review heading.
- Start a New Brief requires one inline reset confirmation, then clears answers plus all carried products, families, requirements, stages, project routes and search context. No old carried scope remains in the new blank review.
- Adding a product from a product drawer or comparison is idempotent: repeating the action cannot remove an already selected product.
- Plain-text copy contains public product/model/capacity names, exact customer status labels, remaining options, selection reasons, exclusions, known information, open questions, caveats and suggested review materials. Internal source identifiers are not included.
- Print/Save opens exclusion and technical-note disclosures before printing, then restores their previous open state after printing. Generated-brief focus moves to its heading; copy success/failure is announced.
- Stage-to-product navigation closes the stage dialog before opening product details, so only one modal/focus trap exists at a time.
- Internal question-purpose rationale is not rendered. Customer-relevant caveats are curated through the public copy adapter.

## Persistence

- Session key: puretronics-capability-profile:v4. Version: 4. The existing version is retained to recover valid current sessions, with runtime shape and value validation added.
- Allowed views, routes, families, stages, products, comparison models, question IDs and option IDs are validated. Unknown/malformed values and extra fields are discarded. Comparison model IDs must belong to the selected product and level. Duplicate selections are removed.
- Single-choice questions restore one valid option. Multiple-choice questions enforce exclusive choices even when an old stored state was malformed.
- Read, write, or removal failure in browser session storage does not crash the page; the active in-memory review remains usable.

## Regression Coverage

New tests: tests/publish-state.test.ts and tests/publish-interactions.test.tsx. Coverage includes malformed same-version recovery, storage denial, capacity-level persistence, model-parent selection validation, mobile limits, empty comparison, idempotent add, complete reset, public-name search ranking, search AND constraints, all ordinary problems, customer-only brief content, cross-view search, family discriminator changes, Spark method visibility, guided answers, native MCQ exclusivity, edit/reset focus, clipboard, print disclosure restoration, and one-dialog stage-to-product navigation.


### Publication Configuration and External Blocker

The canonical URL remains https://justvking.github.io/puretronics-funnel-build/. Indexing has not been approved; robots remains noindex, nofollow. Analytics is disabled and emits no events or console messages. Customer text contains public product/model names without database IDs, source codes or internal publication language. The historical certificate and unapproved proof module are removed.

No approved booking destination or application-review contact fallback was supplied. bookingUrl is null; conversion links honestly say “Prepare an Application Review” and lead to #prepare. This is not a live booking journey. The legacy #/booking-placeholder route returns to the profile and displays no placeholder. The approved existing service route remains https://pureindia.net/contact-us. Set bookingUrl only after Puretronics supplies or approves the external destination. No selected context is appended to a booking URL; saved context is cleared when such a configured link is followed.
