import { describe, expect, it } from 'vitest';
import { productById } from '../src/data/catalog';

describe('high-risk technical claim guards', () => {
  it('limits P03 to validated lump-and-neck detection', () => expect(productById.get('P03')?.caveats.join(' ')).toMatch(/not a general surface-defect/i));
  it('keeps Live, Acute and DC values on separate P04 model records', () => {
    const models = productById.get('P04')!.models;
    expect(models.map((model) => model.name)).toEqual(['Live Spark Tester', 'Acute Spark Tester', 'DC Spark Tester']);
    expect(models.find((model) => model.name.startsWith('Acute'))?.specs.find((spec) => spec.label === 'Line Speed')?.display).toBe('Up to 1500 m/min');
  });
  it('keeps P06 source-limited and project-specific', () => {
    const product = productById.get('P06')!;
    expect(product.governance.evidence).toBe('Source-Limited');
    expect(product.availability).toBe('Project-Specific System.');
    expect(product.specs).toHaveLength(0);
  });
  it('publishes six approved P08 variants without extrapolation', () => expect(productById.get('P08')?.models).toHaveLength(6));
  it('distinguishes P10 indication from active control', () => expect(productById.get('P10')?.caveats.join(' ')).toMatch(/does not provide active/i));
  it('limits ATEX to the LC-AR-85 model record', () => {
    const models = productById.get('P12')!.models;
    expect(models.filter((model) => model.specs.some((spec) => spec.label === 'ATEX')).map((model) => model.id)).toEqual(['P12A']);
  });
  it('keeps P13 speed and braking values model-specific', () => {
    const models = productById.get('P13')!.models;
    expect(models.map((model) => model.specs.find((spec) => spec.label === 'Maximum Speed')?.display)).toEqual(['2500 rpm', '1500 rpm', '1200 rpm']);
  });
});
