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

The app contains no runtime Notion dependency and no credential. Public product data is curated in `src/data/catalog.ts`. Asset provenance is recorded in `public/assets/asset-sources.json`.

The Capability Coverage Index is a dense requirement-to-product view: it does not render empty family intersections. The comparison workbench is intentionally limited to model-to-model comparison within one Primary Product. It renders every governed comparison parameter, showing `Not published` wherever no approved public value exists rather than inferring a specification.

## Deployment

The root workflow `.github/workflows/deploy-capability-profile.yml` builds this directory and publishes `dist/` to GitHub Pages at `/puretronics-funnel-build/`.
