# Puretronics Wire and Cable Capability Profile

React, Vite and TypeScript capability profile deployed through GitHub Pages.

Commands: npm run typecheck; npm run test:run; npm run build; npm run preview.

The release audit and outstanding external configuration are in qa/publish-readiness.md. Scientific validation is in qa/scientific-rules.md; interaction rules are in qa/interaction-rules.md. The Master Guide is maintained in ../page-specs/Master Guide (Puretronics CPLP).md.

The public catalogue covers five families and 13 products. Raw technical source data is retained for traceability; the public adapter provides customer wording and approved capacity/mounting descriptions. No runtime Notion connection or credential is used.

src/config/site.ts holds the canonical URL, base path, service destination, booking destination and indexing policy. bookingUrl remains null until an approved destination is supplied; CTAs lead honestly to brief preparation. Indexing and analytics remain disabled.

qa/publish-audit.cjs checks production-browser behavior, accessibility, responsive overflow, copy/print and direct assets. Run with Playwright available and pass the site URL as its first argument. Reports/screenshots are written to qa/publish.
