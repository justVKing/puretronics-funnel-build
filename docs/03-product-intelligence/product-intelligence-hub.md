# Puretronics Wire & Cable Product Intelligence Hub

Use this hub as the product-intelligence operating layer for Puretronics Wire & Cable work.

The signed Services Agreement dated 9 July 2026 remains the legal and commercial source of truth for contracted scope, covered products, exclusions, commercials, deliverables, and scope changes.

## Navigation Order

1. Check the signed Services Agreement and aligned Annexure A/B for scope-sensitive work.
2. Use data/product-master/rows.json for product intelligence.
3. Use product pages in docs/03-product-intelligence/products/ for human-readable row summaries.
4. Use data/product-master/schema.json and views.json before changing database structure.
5. Use docs/00-governance/product-taxonomy-governance.md for Product Family, Solution Theme, slug, and legacy-term controls.

## Governance Notes

- The product database is the single product-intelligence source.
- It does not override the signed agreement.
- Product Family is the sole top-level taxonomy. Solution Theme is subordinate; Manufacturing Flow Stage and Buyer Problem are separate axes.
- Accessories and support items cannot become standalone deliverables without written approval.
