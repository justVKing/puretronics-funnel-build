# Puretronics publish-readiness audit — 9 September 2026

Public URL: https://justvking.github.io/puretronics-funnel-build/

Verdict: corrected customer-facing capability build; the final booking journey remains externally blocked. No approved live booking URL or explicit approval to use the existing service contact page for application-review enquiries was supplied. The CTA honestly leads to brief preparation. No placeholder route is presented. Indexing remains intentionally disabled pending launch-host approval.

## Findings and corrections

High severity, corrected:
- Family and product-role conditions previously contaminated unrelated products; technical filters now apply only to their explicit product/method scope.
- Model allowlists previously ignored zero-overlap contradictions; applicable constraints now intersect and excluded products have no remaining candidates.
- Incomplete information could produce preliminary alignment; mandatory operating inputs now remain open, with separate configuration and request-based outcomes.
- Preheater configuration-class limits were mistaken for the whole product envelope. Wider validated solid/bunched envelopes are retained for technical review; speed/material/diameter/thermal duty must be reviewed together.
- WTI configured ranges, controller integration, loadcell LC-AR-60/HD details and brake torque/pressure/geometry/duty now require technical review where source evidence does not establish combined suitability.
- Added spark minimum voltage and diameter, weld cross-sectional area, powder grade and actual installation-confirmation questions.
- Corrected superseded LC-AR-85 and LC-AR-ST capacity prose; all 24 capacity options show actual series mounting requirements.
- Removed internal record IDs, database versions, source tables, publication labels and internal architecture language from customer presentation and copied briefs. Raw source export remains unchanged.
- Removed the historical certificate and unapproved testimonial/evidence-request modules.
- Retired the booking placeholder. Without destination approval, links say Prepare an Application Review and lead to the MCQ brief.

Medium severity, corrected:
- Navigator and Matrix now share search. Exact public model matches rank ahead of aliases and broad matches; all filters remain visible/removable.
- Family discriminators clear conflicting prior choices. Guided/project answers are used, carried and explained. AC/DC, process and tension roles can be selected independently together.
- Fixed Edit Answers, reset, additive product preparation, stale hidden answers, session schema recovery and denied-storage handling.
- Comparison selection level survives view changes and reload; models can all be deselected; mobile limits remove the hidden third selection.
- Native radio/checkbox MCQs support keyboard operation. Dialogs have unique titles, inert background, stable focus trapping, Escape and focus restoration. Nested stage/product dialogs are eliminated. Removed erroneous scroll-to-top on every anchor navigation.
- Increased small touch targets, made keyboard focus visible, corrected comparison contrast, and kept hidden mobile CTA out of the focus order.
- Copy includes public product/model names and exclusion reasons. Print expands selection notes and exclusions and saves the complete brief.
- Analytics is genuinely disabled. Payload sanitizer allowlists values and keys. Booking links append no context and clear saved review when a destination is configured. Optional browser tool rejects unknown keys and duplicate product toggles.
- Canonical, Open Graph and structured-data URL aligned. Social preview compressed from 1,060,333 bytes to 70,038 bytes; correct intrinsic dimensions supplied. Fonts preload and use swap. Internal asset provenance moved out of deployed public assets.

## Scientific and portfolio validation

Independent live approved/current technical-source reconciliation found zero identity or parentage mismatches across 83 records. Coverage: five families, 13 products, 33 models/configuration classes/series, 24 capacity options, 13 supporting items/options. All 747 populated technical specification entries remain represented; comparison uses the union of populated parameters and does not rank a winner. The Matrix default is exactly 12 Requirement Paths, 13 Products and 5 Product Families.

267 scientific regressions independently transcribe validated limits and check at/below/above thresholds, intersections, requests/configurations, unknowns, role isolation, AC/DC separation and loadcell capacity/mounting combinations. Detailed source findings are in scientific-rules.md. The Master Guide is aligned with 60 current MCQs and the changed state rules.

## Validation evidence

- TypeScript and production build: pass.
- Complete automated suite: 388 tests pass (including 267 scientific regressions).
- Local Chrome production audit: 151 checks pass; 36 accessibility states have no WCAG-tagged axe violations.
- Responsive: 390, 768, 1024 and 1440 px, all four views, no document overflow; screenshots inspected. Keyboard tabs, skip link, drawer trap/Escape/restoration, copy, edit, reset and print/PDF verified.
- Browser console errors and failed requests: zero in local audit. Direct production assets return 200.
- Local mobile Lighthouse: performance 89, accessibility 100, best practices 100, SEO 66. FCP 2.0 s, LCP 2.6 s, TBT 280 ms, CLS 0. Scores are single-run measurements; SEO is deliberately reduced by noindex.
- Bundle: about 590 kB JavaScript (130 kB gzip) and 57 kB CSS (10 kB gzip). No remote font dependency. Dependency audit: zero advisories at audit time.
- Deployed results and workflow outcome are recorded in the final task response and qa/publish/public-report.json.

## Exact configuration requiring approval

- bookingUrl: null. Supply the approved live booking URL, or explicitly authorize https://pureindia.net/contact-us for application-review enquiries. The existing page was verified HTTP 200 and remains the service destination.
- indexable: false. Approve the current canonical URL as the launch host before changing to true. Current robots: noindex, nofollow.
- canonicalUrl: https://justvking.github.io/puretronics-funnel-build/
- analyticsMode: disabled. No analytics integration or identifier is fabricated.
- certificate: module removed; no current certificate is claimed.

Unrelated modified project documents, untracked research, input files and pre-existing screenshots are preserved and excluded from the release commit.
