# Interaction Rules for Master Guide Alignment

This file records the publish-readiness changes implemented in the Explorer and Application Review. The Master Guide should incorporate these rules; this file is internal QA documentation and is not a public asset.

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
