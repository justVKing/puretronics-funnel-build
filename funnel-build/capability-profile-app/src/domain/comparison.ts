import { products } from '../data/catalog';
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

const governedParameterOrder: Record<string, string[]> = {
  P01: ['Measurement range', 'Measurement axes / method', 'Scan velocity', 'Scan rate', 'Accuracy', 'Resolution', 'Repeatability', 'Control / display', 'Communication / outputs', 'Software / data', 'Installation inputs'],
  P02: ['Measurement range', 'Measurement axes / method', 'Measurement frequency', 'Accuracy', 'Repeatability', 'Display', 'Alarm output', 'Communication', 'Transparent-material support', 'Power supply', 'Dimensions', 'Weight'],
  P03: ['Measurement range', 'Measurement axes / method', 'Scanning frequency', 'Single-axis sampling', 'Accuracy', 'Repeatability', 'Lump-and-neck capability', 'Control / display', 'Communication / outputs', 'Installation inputs'],
  P04: ['Test principle', 'Voltage paths', 'Cable diameter', 'Line speed', 'Test frequency', 'Electrode', 'Fault interface', 'Logging / graphics', 'Marking', 'Calibration', 'Power supply', 'Safety / interlocking', 'Running height', 'Dimensions', 'Weight'],
  P05: ['Test method', 'Voltage', 'Current', 'Sample / cable range', 'Application', 'Reporting', 'Safety / interlocking', 'Project status'],
  P07: ['Conductor construction / material', 'Wire range', 'Line speed', 'Target temperature', 'Power supply', 'Induction frequency', 'Power output', 'Dimensions', 'Running height', 'Control system', 'Installation inputs'],
  P08: ['Powder', 'Product size', 'Line speed', 'Power supply', 'Maximum power', 'Powder mesh', 'Dimensions / centre height', 'Sound level', 'User interface', 'Application scope', 'Weight', 'Earthing / air quality'],
  P10: ['Wire range', 'Published configurations', 'Supply', 'Analogue output', 'Transistor output', 'Communication', 'Controller role'],
  P12: ['Capacities', 'Mounting', 'Shaft diameter', 'Signal output', 'Overload protection', 'Construction / material', 'Certification', 'ATEX', 'Connector', 'Working temperature', 'Sensitivity'],
  P13: ['Braking value', 'Maximum speed', 'Pressure range', 'Weight', 'Inertia', 'Dimensions / mounting'],
};

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

export function buildModelComparison(product: ProductRecord): ComparisonSection[] {
  const labels = [...new Set([...(governedParameterOrder[product.id] ?? []), ...product.models.flatMap((model) => model.specs.map((spec) => spec.label))])];
  const technicalRows = labels.map((label) => makeRow(
    `spec-${label}`,
    label,
    product.models,
    (model) => model.specs.find((spec) => spec.label === label)?.display ?? 'Not published',
    (model) => model.specs.find((spec) => spec.label === label)?.sourceRecord ?? 'No approved public record',
  ));

  return [
    {
      id: 'publication',
      label: 'Publication status',
      rows: [
        makeRow('availability', 'Availability', product.models, (model) => model.availability ?? product.availability, (model) => model.id),
        makeRow('caveat', 'Model-specific caveat', product.models, (model) => model.caveat ?? product.caveats.join(' '), (model) => model.id),
      ],
    },
    { id: 'technical', label: 'Approved public technical specifications', rows: technicalRows },
  ];
}

export function allPublishedSpecificationLabels(product: ProductRecord) {
  return [...new Set(product.models.flatMap((model) => model.specs.map((spec) => spec.label)))];
}
