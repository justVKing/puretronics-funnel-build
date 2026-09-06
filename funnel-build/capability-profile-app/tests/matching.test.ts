import { describe, expect, it } from 'vitest';
import { matchProducts } from '../src/domain/matching';
import type { ExplorerFilters } from '../src/types/explorer';

const filters = (overrides: Partial<ExplorerFilters> = {}): ExplorerFilters => ({ problems: [], stages: [], families: [], routes: [], query: '', ...overrides });

describe('product matching', () => {
  it('returns all 13 governed Primary Products for an unfiltered catalogue', () => {
    expect(matchProducts(filters())).toHaveLength(13);
  });

  it('matches only approved dimensional-control products for diameter variation', () => {
    expect(matchProducts(filters({ problems: ['diameter-variation'] })).map((result) => result.productId)).toEqual(['P01', 'P02', 'P03']);
  });

  it('resolves known model aliases to the correct parent product', () => {
    const result = matchProducts(filters({ query: 'AX-400' }))[0];
    expect(result.productId).toBe('P13');
    expect(result.matchedModelIds).toEqual(['P13B']);
    expect(result.reasons[0]).toContain('AX-400');
  });

  it('does not blend offline and inline high-voltage routes', () => {
    expect(matchProducts(filters({ stages: ['offline-hv-testing'] })).map((result) => result.productId)).toEqual(['P05']);
  });
});
