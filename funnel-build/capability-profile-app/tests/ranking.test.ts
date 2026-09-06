import { describe, expect, it } from 'vitest';
import { rankResults } from '../src/domain/ranking';
import { matchProducts } from '../src/domain/matching';

describe('result ranking', () => {
  it('sorts by fixed score and stable product ID tie-break', () => {
    const ranked = rankResults([
      { productId: 'P04', score: 10, reasons: [], matchedModelIds: [] },
      { productId: 'P02', score: 30, reasons: [], matchedModelIds: [] },
      { productId: 'P01', score: 30, reasons: [], matchedModelIds: [] },
    ]);
    expect(ranked.map((result) => result.productId)).toEqual(['P01', 'P02', 'P04']);
  });

  it('gives an exact model search precedence over route-only matches', () => {
    const results = matchProducts({ problems: [], stages: [], families: [], routes: ['retrofit'], query: 'LASER-2030' });
    expect(results[0].productId).toBe('P02');
    expect(results[0].score).toBeGreaterThan(100);
  });
});
