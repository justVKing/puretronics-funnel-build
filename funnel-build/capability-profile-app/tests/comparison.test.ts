import { describe, expect, it } from 'vitest';
import { productById } from '../src/data/catalog';
import { allPublishedSpecificationLabels, buildModelComparison, comparableProducts, isModelComparable } from '../src/domain/comparison';
import { explorerReducer, initialState } from '../src/state/reducer';

describe('model comparison', () => {
  it('offers only Primary Products with at least two governed models', () => {
    expect(comparableProducts.length).toBe(10);
    expect(comparableProducts.every((product) => isModelComparable(product))).toBe(true);
    expect(isModelComparable(productById.get('P11'))).toBe(false);
  });

  it('includes every populated V4 specification label for the compared models', () => {
    comparableProducts.forEach((product) => {
      const technical = buildModelComparison(product).find((section) => section.id === 'technical')!;
      const rendered = technical.rows.map((row) => row.label);
      expect(rendered).toEqual(allPublishedSpecificationLabels(product));
      expect(technical.rows.length).toBeGreaterThan(0);
    });
  });

  it('does not create parameters that are absent from V4', () => {
    const product = productById.get('P13')!;
    const technical = buildModelComparison(product).find((section) => section.id === 'technical')!;
    expect(technical.rows.map((row) => row.label)).toEqual(['Max Torque for Each Calliper', 'Min Torque for Each Calliper', 'Min & Max Pressure', 'Max RPM', 'Weight', 'Inertia']);
    expect(JSON.stringify(technical)).not.toContain('Not published');
  });

  it('shows the union of populated P08 parameters without inventing values', () => {
    const product = productById.get('P08')!;
    const mixed = buildModelComparison(product, ['P08A', 'P08E']).find((section) => section.id === 'technical')!;
    const graphite = buildModelComparison(product, ['P08E', 'P08F']).find((section) => section.id === 'technical')!;
    expect(mixed.rows).toHaveLength(12);
    expect(mixed.rows.find((row) => row.label === 'Powder Mesh')?.values).toEqual({ P08A: '2000 or more', P08E: '—' });
    expect(mixed.rows.find((row) => row.label === 'Powder Specifications')?.values).toEqual({ P08A: '—', P08E: 'THIELMANN GRAPHITE; Graphite 23061 or similar' });
    expect(graphite.rows).toHaveLength(11);
    expect(graphite.rows.find((row) => row.label === 'Powder Specifications')?.values).toEqual({ P08E: 'THIELMANN GRAPHITE; Graphite 23061 or similar', P08F: 'THIELMANN GRAPHITE; Graphite 23061 or similar' });
  });

  it('compares approved P12 capacity SKUs as first-class V4 variants', () => {
    const product = productById.get('P12')!;
    const technical = buildModelComparison(product, ['P12A-C10', 'P12E-C10']).find((section) => section.id === 'technical')!;
    expect(technical.rows).toHaveLength(9);
    expect(technical.rows.find((row) => row.label === 'Loadcell Series')?.values).toEqual({ 'P12A-C10': 'LC-AR-85', 'P12E-C10': 'LC-AR-60' });
  });

  it('never emits an empty or placeholder technical value', () => {
    comparableProducts.forEach((product) => {
      const sections = buildModelComparison(product);
      expect(JSON.stringify(sections)).not.toMatch(/Not published|No approved public record/i);
      sections.flatMap((section) => section.rows).forEach((row) => expect(Object.values(row.values).some((value) => value !== '—')).toBe(true));
    });
  });

  it('enforces the supplied model limit without dropping existing selections', () => {
    let state = explorerReducer(initialState, { type: 'SET_COMPARISON_PRODUCT', productId: 'P13' });


    state = explorerReducer(state, { type: 'TOGGLE_COMPARISON_MODEL', modelId: 'P13C', limit: 2 });
    expect(state.comparisonModelIds).toEqual(['P13A', 'P13B']);
  });
});
