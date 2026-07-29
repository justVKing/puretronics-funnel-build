# Migration Validation Checklist

- [ ] All 10 core Notion assets are mapped in notion-source-map.json.
- [ ] All 14 raw input child pages are mapped.
- [ ] Product database row count is 38 after refreshed Notion query.
- [ ] rows.json and rows.csv include every database property after refresh.
- [ ] All signed products and variants exist.
- [ ] All support items are marked Covered Support Item.
- [ ] Annexure A Section 7 malformed bullet block is absent.
- [ ] Signed commercial facts match the Services Agreement.
- [ ] No support item implies standalone pages, campaigns, forms, automations, SEO assets, selectors, calculators, configurators, or extra deliverables.
- [ ] Repository remains private.

## Current Gate Status

- Repo-side workspace validation can run now through scripts/validate_workspace.ps1.
- Signed-scope validation can run now through scripts/validate_signed_scope.ps1.
- Exact Notion raw export validation remains blocked until Notion connector access is restored or a manual export is placed under data/notion-export/manual/.
