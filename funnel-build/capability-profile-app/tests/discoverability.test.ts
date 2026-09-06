import { describe, expect, it } from 'vitest';
import { families, products } from '../src/data/catalog';
import { validateCatalog } from '../src/domain/catalogValidation';
import { matchProducts } from '../src/domain/matching';

describe('portfolio governance and discoverability', () => {
  it('publishes exactly five families and 13 Primary Products', () => { expect(families).toHaveLength(5); expect(products).toHaveLength(13); expect(validateCatalog()).toEqual([]); });
  it.each(products.map((product) => [product.id, product.name]))('%s is directly discoverable by its governed name', (id, name) => {
    const results = matchProducts({ problems: [], stages: [], families: [], routes: [], query: name });
    expect(results[0].productId).toBe(id);
  });
  it('keeps every variant subordinate to a Primary Product', () => {
    const modelIds = products.flatMap((product) => product.models.map((model) => model.id));
    expect(new Set(modelIds).size).toBe(modelIds.length);
    expect(modelIds.every((id) => /^P\d{2}[A-Z]$/.test(id))).toBe(true);
  });

  it('covers every governed V4 model and its populated technical fields', () => {
    const expectedFields: Record<string, string[]> = {
      P01A: ['Measurement Range', 'Scan Velocity', 'Scan Rate'], P01B: ['Measurement Range', 'Scan Velocity', 'Scan Rate'],
      P02A: ['Measurement Range', 'Measurement Frequency'], P02B: ['Measurement Range', 'Measurement Frequency'], P02C: ['Measurement Range', 'Measurement Frequency'],
      P03A: ['Measurement Range', 'Scanning Frequency', 'Single-Axis Sampling'], P03B: ['Measurement Range', 'Scanning Frequency', 'Single-Axis Sampling'], P03C: ['Measurement Range', 'Scanning Frequency', 'Single-Axis Sampling'],
      P04A: ['Test Principle', 'Voltage Paths', 'Cable Diameter', 'Line Speed'], P04B: ['Test Principle', 'Voltage Paths', 'Cable Diameter', 'Line Speed'], P04C: ['Test Principle', 'Voltage Paths', 'Cable Diameter', 'Line Speed'],
      P05A: ['Test Method', 'Voltage', 'Current'], P05B: ['Test Method', 'Voltage', 'Current'],
      P07A: ['Line Speed', 'Wire Range', 'Target Temperature'], P07B: ['Line Speed', 'Wire Range', 'Target Temperature'], P07C: ['Line Speed', 'Wire Range', 'Target Temperature'],
      P08A: ['Product Size', 'Line Speed'], P08B: ['Product Size', 'Line Speed'], P08C: ['Product Size', 'Line Speed'], P08D: ['Product Size', 'Line Speed'], P08E: ['Powder', 'Product Size', 'Line Speed'], P08F: ['Powder', 'Product Size', 'Line Speed'],
      P10A: ['Wire Range', 'Published Configurations'], P10B: ['Wire Range', 'Published Configurations'],
      P12A: ['Capacities', 'ATEX'], P12B: ['Capacities'], P12C: ['Capacities'], P12D: ['Capacities'], P12E: ['Capacities'], P12F: ['Capacities'],
      P13A: ['Braking Value', 'Maximum Speed'], P13B: ['Braking Value', 'Maximum Speed'], P13C: ['Braking Value', 'Maximum Speed'],
    };
    const models = products.flatMap((product) => product.models);
    expect(Object.keys(expectedFields).sort()).toEqual(models.map((model) => model.id).sort());
    models.forEach((model) => expect(model.specs.map((spec) => spec.label)).toEqual(expectedFields[model.id]));
  });
});
