# Puretronics Wire and Cable Capability Profile

Production-quality React, Vite and TypeScript review build for the governed Puretronics Wire and Cable Industry portfolio.

## Commands

- `npm run dev` — local development server
- `npm run typecheck` — TypeScript validation
- `npm run test:run` — deterministic logic and interaction tests
- `npm run build` — GitHub Pages production build
- `npm run preview` — serve the production bundle locally

## Replaceable review configuration

Edit `src/config/site.ts` to replace the canonical URL, booking destination, service/support destination or analytics mode. The review booking destination is `#/booking-placeholder`.

The app contains no runtime Notion dependency and no credential. Its public-safe V4 snapshot is stored in `src/data/v4Catalog.generated.json`, transformed through `src/data/v4.ts`, and combined with the visitor-facing catalogue in `src/data/catalog.ts`. The snapshot contains 83 approved/current records and 747 populated technical specification rows. Asset provenance is recorded in `public/assets/asset-sources.json`.

The independent source reconciliation is frozen in `qa/v4-source-completeness-manifest.json`. Automated tests verify every record ID, parent relationship, parameter label and technical-value checksum against that manifest.

The Capability Coverage Index is a dense requirement-to-product view: it does not render empty family intersections. The comparison workbench is intentionally limited to model/variant comparison within one Primary Product. It derives its rows from the complete populated Product Database V4 specification tables for the selected records and omits parameters absent across the selected set. P12 supports both series comparison and direct comparison of all 24 approved capacity SKUs.

The Navigator, Production-Line Map and Capability Coverage Index share one governed relationship model. Filters use OR within one dimension and AND between dimensions; every carried constraint is visible and removable. The line map contains nine inline stages plus two independent offline/laboratory paths.

The Application Review is MCQ-only. Scope selections are additive, while only approved V4 technical boundaries may narrow or exclude a model. Unknown answers never cause an exclusion. Results distinguish aligned known requirements, incomplete information, project-specific review and evidence-based exclusion; final engineering selection remains subject to Puretronics application review.

Final automated coverage includes 92 unit, interaction, persistence, accessibility, relationship, V4-completeness and claim-guard tests. The browser audit script in `qa/browser-audit.cjs` verifies the public/default Matrix counts, cross-view constraints, map semantics, P08 specification coverage, booking isolation, console errors, failed responses and horizontal overflow at 390, 768, 1024 and 1440 pixels.

## Deployment

The root workflow `.github/workflows/deploy-capability-profile.yml` builds this directory and publishes `dist/` to GitHub Pages at `/puretronics-funnel-build/`.
