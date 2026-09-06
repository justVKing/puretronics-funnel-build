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

  it('includes every approved model specification label in the comparison rows', () => {
    comparableProducts.forEach((product) => {
      const technical = buildModelComparison(product).find((section) => section.id === 'technical')!;
      const rendered = technical.rows.map((row) => row.label);
      allPublishedSpecificationLabels(product).forEach((label) => expect(rendered).toContain(label));
      expect(technical.rows.length).toBeGreaterThan(0);
    });
  });

  it('keeps governed decision parameters visible when a value is not published', () => {
    const product = productById.get('P13')!;
    const technical = buildModelComparison(product).find((section) => section.id === 'technical')!;
    expect(technical.rows.map((row) => row.label)).toEqual(['Braking value', 'Maximum speed', 'Pressure range', 'Weight', 'Inertia', 'Dimensions / mounting']);
    expect(technical.rows.find((row) => row.label === 'Pressure range')?.values.P13A).toBe('Not published');
  });

  it('shows an explicit publication state instead of inventing a missing value', () => {
    const product = productById.get('P08')!;
    const powder = buildModelComparison(product).find((section) => section.id === 'technical')!.rows.find((row) => row.label === 'Powder')!;
    expect(powder.values.P08A).toBe('Not published');
    expect(powder.values.P08E).toBe('Graphite');
  });

  it('enforces the supplied model limit without dropping existing selections', () => {
    let state = explorerReducer(initialState, { type: 'SET_COMPARISON_PRODUCT', productId: 'P13' });
    state = explorerReducer(state, { type: 'TOGGLE_COMPARISON_MODEL', modelId: 'P13A', limit: 2 });
    state = explorerReducer(state, { type: 'TOGGLE_COMPARISON_MODEL', modelId: 'P13B', limit: 2 });
    state = explorerReducer(state, { type: 'TOGGLE_COMPARISON_MODEL', modelId: 'P13C', limit: 2 });
    expect(state.comparisonModelIds).toEqual(['P13A', 'P13B']);
  });
});
