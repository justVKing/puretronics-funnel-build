import { products } from '../data/catalog';
import { allComparisonVariants } from '../data/v4';
import type { ModelVariant, ProductRecord } from '../types/catalog';

export interface ComparisonRow {
  key: string;
  label: string;
  values: Record<string, string>;
  sourceRecords: Record<string, string>;
  differs: boolean;
}

export interface ComparisonSection {
  id: 'publication' | 'technical';
  label: string;
  rows: ComparisonRow[];
}

export const comparableProducts = products.filter((product) => product.models.length > 1);

export function isModelComparable(product: ProductRecord | undefined) {
  return Boolean(product && product.models.length > 1);
}

const makeRow = (
  key: string,
  label: string,
  models: ModelVariant[],
  value: (model: ModelVariant) => string,
  source: (model: ModelVariant) => string,
): ComparisonRow => {
  const values = Object.fromEntries(models.map((model) => [model.id, value(model)]));
  return {
    key,
    label,
    values,
    sourceRecords: Object.fromEntries(models.map((model) => [model.id, source(model)])),
    differs: new Set(Object.values(values)).size > 1,
  };
};

export function buildModelComparison(product: ProductRecord, selectedModelIds?: string[]): ComparisonSection[] {
  const availableModels = allComparisonVariants(product.id);
  const models = selectedModelIds?.length
    ? availableModels.filter((model) => selectedModelIds.includes(model.id))
    : product.models;
  const labels = [...new Set(models.flatMap((model) => model.specs.map((spec) => spec.label)))];
  const technicalRows = labels.map((label) => makeRow(
    `spec-${label}`,
    label,
    models,
    (model) => model.specs.find((spec) => spec.label === label)?.display ?? '—',
    (model) => model.specs.find((spec) => spec.label === label)?.sourceRecord ?? '',
  ));

  return [
    {
      id: 'publication',
      label: 'Publication Status',
      rows: [
        makeRow('availability', 'Availability', models, (model) => model.availability ?? product.availability, (model) => model.id),
        makeRow('caveat', 'Model-Specific Caveat', models, (model) => model.caveat ?? product.caveats.join(' '), (model) => model.id),
      ],
    },
    { id: 'technical', label: 'Approved Public Technical Specifications', rows: technicalRows },
  ];
}

export function allPublishedSpecificationLabels(product: ProductRecord) {
  return [...new Set(product.models.flatMap((model) => model.specs.map((spec) => spec.label)))];
}
