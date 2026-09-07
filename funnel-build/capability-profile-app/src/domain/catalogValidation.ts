import { families, products } from '../data/catalog';
import { V4_EXPECTED_RECORD_COUNT, V4_EXPECTED_SPECIFICATION_COUNT, v4Records } from '../data/v4';

const flattenVariants = (items: typeof products[number]['models']): typeof products[number]['models'] => items.flatMap((item) => [item, ...flattenVariants(item.children ?? [])]);

export function validateCatalog() {
  const errors: string[] = [];
  if (families.length !== 5) errors.push('The public catalogue must contain exactly five Product Families.');
  if (products.length !== 13) errors.push('The public catalogue must contain exactly 13 Primary Products.');
  if (v4Records.length !== V4_EXPECTED_RECORD_COUNT) errors.push(`The V4 public dataset must contain exactly ${V4_EXPECTED_RECORD_COUNT} approved current records.`);
  if (v4Records.reduce((total, record) => total + record.technicalSpecifications.length, 0) !== V4_EXPECTED_SPECIFICATION_COUNT) errors.push(`The V4 public dataset must contain exactly ${V4_EXPECTED_SPECIFICATION_COUNT} populated technical specifications.`);
  const ids = new Set<string>();
  for (const product of products) {
    if (ids.has(product.id)) errors.push(`Duplicate product ID: ${product.id}`);
    ids.add(product.id);
    if (product.governance.approval !== 'Approved' || product.governance.claimState !== 'Current' || product.governance.qa !== 'Public') errors.push(`${product.id} is not publication-ready.`);
    if (product.governance.evidence === 'Source-Limited' && product.caveats.length === 0) errors.push(`${product.id} requires a source-limited caveat.`);
    const technicalChildren = flattenVariants(product.models);
    const supportItems = product.supportItems ?? [];
    for (const item of [...product.specs, ...technicalChildren.flatMap((model) => model.specs), ...supportItems.flatMap((item) => item.specs)]) if (!item.sourceRecord) errors.push(`${product.id} has an unsourced technical value.`);
    for (const model of [...technicalChildren, ...supportItems]) {
      if (!model.specs.length) errors.push(`${model.id} has no populated V4 technical fields.`);
      if (new Set(model.specs.map((spec) => spec.label)).size !== model.specs.length) errors.push(`${model.id} has duplicate V4 technical fields.`);
      if (model.specs.some((spec) => spec.sourceRecord !== model.id)) errors.push(`${model.id} has a technical value assigned to the wrong source record.`);
    }
  }
  for (const record of v4Records) if (!record.technicalSpecifications.length) errors.push(`${record.id} has no extracted V4 technical specifications.`);
  return errors;
}
