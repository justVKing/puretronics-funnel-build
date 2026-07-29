# Migration Validation Checklist

- [x] All 10 core Notion assets are mapped and fetched.
- [x] All 14 raw input child pages are mapped and fetched.
- [x] Product database row count is 38 after the refreshed Notion query.
- [x] rows.json and rows.csv include all 44 database properties.
- [x] All signed products and variants exist.
- [x] All support items are marked Covered Support Item.
- [x] Annexure A Section 7 malformed bullet block is absent.
- [x] Signed commercial facts match the Services Agreement.
- [x] No support item implies standalone pages, campaigns, forms, automations, SEO assets, selectors, calculators, configurators, or extra deliverables.
- [x] Repository remains private.

## Current Gate Status

- Exact Notion export validation: scripts/validate_notion_export.ps1.
- Repo-side workspace validation: scripts/validate_workspace.ps1.
- Signed-scope validation: scripts/validate_signed_scope.ps1.
