import { families, products } from '../data/catalog';

export function validateCatalog() {
  const errors: string[] = [];
  if (families.length !== 5) errors.push('The public catalogue must contain exactly five Product Families.');
  if (products.length !== 13) errors.push('The public catalogue must contain exactly 13 Primary Products.');
  const ids = new Set<string>();
  for (const product of products) {
    if (ids.has(product.id)) errors.push(`Duplicate product ID: ${product.id}`);
    ids.add(product.id);
    if (product.governance.approval !== 'Approved' || product.governance.claimState !== 'Current' || product.governance.qa !== 'Public') errors.push(`${product.id} is not publication-ready.`);
    if (product.governance.evidence === 'Source-Limited' && product.caveats.length === 0) errors.push(`${product.id} requires a source-limited caveat.`);
    for (const item of [...product.specs, ...product.models.flatMap((model) => model.specs)]) if (!item.sourceRecord) errors.push(`${product.id} has an unsourced technical value.`);
  }
  return errors;
}
