# Migration Validation Checklist

- [x] All pre-existing core Notion assets are mapped and fetched.
- [x] The new taxonomy governance page is mapped and fetched.
- [x] All 19 raw input/source pages, including five nested pages, are mapped and fetched.
- [x] Product database row count is 38 after the refreshed Notion query.
- [x] rows.json and rows.csv include all 44 database properties.
- [x] All signed products and variants exist.
- [x] All support items are marked Covered Support Item.
- [x] Annexure A Section 7 malformed bullet block is absent.
- [x] Signed commercial facts match the Services Agreement.
- [x] No support item implies standalone pages, campaigns, forms, automations, SEO assets, selectors, calculators, configurators, or extra deliverables.
- [x] Repository remains private.
- [x] Five and only five canonical Product Family values are active in repository data.
- [x] Product Family counts are `9 / 7 / 3 / 6 / 13`.
- [x] Fire Resistance & Circuit Integrity is a PF-03 specialized theme/module.
- [x] Process Equipment & Line Auxiliaries is separated from Tension / Braking / Line Control.
- [x] LTC-PRO remains PF-05.
- [x] Signed Agreement and immutable-source hashes match pre/post.

## Current Gate Status

- Exact Notion export validation: scripts/validate_notion_export.ps1.
- Taxonomy migration validation: scripts/validate_product_taxonomy.ps1.
- Repo-side workspace validation: scripts/validate_workspace.ps1.
- Signed-scope validation: scripts/validate_signed_scope.ps1.
