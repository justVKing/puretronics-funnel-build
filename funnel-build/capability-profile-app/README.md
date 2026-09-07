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

## Deployment

The root workflow `.github/workflows/deploy-capability-profile.yml` builds this directory and publishes `dist/` to GitHub Pages at `/puretronics-funnel-build/`.
