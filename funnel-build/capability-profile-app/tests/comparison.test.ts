import { describe, expect, it } from 'vitest';
import { comparisonEligibility } from '../src/domain/comparison';
import { explorerReducer, initialState } from '../src/state/reducer';

describe('comparison eligibility', () => {
  it('allows explicitly governed alternatives', () => expect(comparisonEligibility(['P01', 'P02'], 'alternatives').eligible).toBe(true));
  it('rejects complementary indication and control as alternatives', () => expect(comparisonEligibility(['P10', 'P11'], 'alternatives').eligible).toBe(false));
  it('allows complementary tension roles in system view with an explicit warning', () => {
    const result = comparisonEligibility(['P10', 'P11', 'P13'], 'system');
    expect(result.eligible).toBe(true);
    expect(result.reason).toContain('not present');
  });
  it('allows model comparison within one Primary Product', () => expect(comparisonEligibility(['P13'], 'variants').eligible).toBe(true));
  it('enforces the supplied desktop or mobile selection limit without dropping existing items', () => {
    let state = explorerReducer(initialState, { type: 'TOGGLE_COMPARISON', productId: 'P01', limit: 2 });
    state = explorerReducer(state, { type: 'TOGGLE_COMPARISON', productId: 'P02', limit: 2 });
    state = explorerReducer(state, { type: 'TOGGLE_COMPARISON', productId: 'P03', limit: 2 });
    expect(state.comparison).toEqual(['P01', 'P02']);
  });
});
