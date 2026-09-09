import { describe, expect, it } from 'vitest';
import { products } from '../src/data/catalog';
import { publicName } from '../src/data/publicContent';
import { problemOptions } from '../src/data/productionStages';
import { generateBrief } from '../src/domain/brief';
import { matchProducts } from '../src/domain/matching';
import { activeProductIds } from '../src/domain/fit';
import { explorerReducer, initialState } from '../src/state/reducer';
import { clearState, loadState, sanitizeState, saveState } from '../src/state/persistence';

const storageKey = 'puretronics-capability-profile:v4';
describe('publish-ready state and search regressions', () => {
  it('recovers malformed current-version state without importing arbitrary values', () => {
    sessionStorage.setItem(storageKey, JSON.stringify({ version: 4, state: { filters: { query: ['wrong'], families: ['PF02', 'INVALID'], stages: {}, routes: null, problems: 'diameter-variation' }, selectedProducts: 'P04', reviewFamilyIds: 4, comparisonModelIds: null, navigatorAnswers: { guideConcern: 'secret' }, readinessAnswers: { freeText: 'private', 'pf02-principle': 'invented', 'known-inputs': ['speed','none'] }, view: 'bad' } }));
    const restored = loadState();
    expect(restored.view).toBe('navigator');
    expect(restored.filters).toEqual({ query: '', families: ['PF02'], problems: [], stages: [], routes: [] });
    expect(restored.selectedProducts).toEqual([]);
    expect(restored.readinessAnswers).toEqual({ 'known-inputs': ['none'] });
    expect(restored.navigatorAnswers).toEqual({});
    expect(() => matchProducts(restored.filters)).not.toThrow();
  });
  it('remains usable when browser storage denies reads or writes', () => {
    expect(loadState({ getItem: () => { throw new DOMException('Denied'); } })).toEqual(initialState);
    expect(() => saveState(initialState, { setItem: () => { throw new DOMException('Full'); } })).not.toThrow();
    expect(() => clearState({ removeItem: () => { throw new DOMException('Denied'); } })).not.toThrow();
  });
  it('restores valid capacity selections under the correct comparison level', () => {
    let state = explorerReducer(initialState, { type: 'SET_COMPARISON_PRODUCT', productId: 'P12' });
    state = explorerReducer(state, { type: 'SET_COMPARISON_LEVEL', level: 'capacities' });
    saveState(state);
    expect(loadState().comparisonLevel).toBe('capacities');
    expect(loadState().comparisonModelIds).toEqual(state.comparisonModelIds);
    const { comparisonLevel: ignored, ...legacyState } = state;
    void ignored;
    expect(sanitizeState(legacyState).comparisonLevel).toBe('capacities');
  });
  it('rejects comparison selections belonging to another product', () => {
    const state = sanitizeState({ ...initialState, comparisonProductId: 'P13', comparisonModelIds: ['P04A','P13A','P13A'] });
    expect(state.comparisonModelIds).toEqual(['P13A']);
  });
  it('allows removal of every comparison model and clears hidden mobile selections', () => {
    let state = explorerReducer(initialState, { type: 'SET_COMPARISON_PRODUCT', productId: 'P13' });
    state = explorerReducer(state, { type: 'TOGGLE_COMPARISON_MODEL', modelId: 'P13C', limit: 3 });
    state = explorerReducer(state, { type: 'LIMIT_COMPARISON_MODELS', limit: 2 });
    expect(state.comparisonModelIds).toEqual(['P13A','P13B']);
    for (const id of [...state.comparisonModelIds]) state = explorerReducer(state, { type: 'TOGGLE_COMPARISON_MODEL', modelId: id, limit: 2 });
    expect(state.comparisonModelIds).toEqual([]);
  });
  it('adds a selected product idempotently', () => {
    const state = explorerReducer({ ...initialState, selectedProducts: ['P04'] }, { type: 'ADD_SELECTED', productId: 'P04' });
    expect(state.selectedProducts).toEqual(['P04']);
  });
  it('edits an existing brief and resets its entire carried scope', () => {
    const state = { ...initialState, selectedProducts: ['P04'], filters: { ...initialState.filters, stages: ['spark-fault'], query: 'Spark' }, briefGenerated: true, readinessAnswers: { 'pf02-principle': 'live' } };
    expect(explorerReducer(state, { type: 'EDIT_BRIEF' }).briefGenerated).toBe(false);
    const reset = explorerReducer(state, { type: 'RESET_READINESS' });
    expect(reset.readinessAnswers).toEqual({});
    expect(reset.filters).toEqual(initialState.filters);
    expect(activeProductIds(reset)).toEqual([]);
  });
  it('puts every exact public model ahead of broad matches', () => {
    for (const product of products) for (const model of product.models) {
      const results = matchProducts({ ...initialState.filters, query: model.name });
      expect(results[0]?.matchedModelIds, model.name).toContain(model.id);
      expect(results[0]?.score).toBeGreaterThanOrEqual(10000);
    }
  });
  it('keeps search as an AND constraint alongside families and stages', () => {
    expect(matchProducts({ ...initialState.filters, query: 'AX-400', families: ['PF01'] })).toEqual([]);
    expect(matchProducts({ ...initialState.filters, query: 'AX-400', stages: ['offline-hv-testing'] })).toEqual([]);
    expect(matchProducts({ ...initialState.filters, query: 'AX-400', families: ['PF05'] }).map((result) => result.productId)).toEqual(['P13']);
  });
  it('keeps ordinary problem journeys discoverable without internal result wording', () => {
    for (const [id] of problemOptions.filter(([id]) => !['multiple-issues','not-sure'].includes(id))) {
      const results = matchProducts({ ...initialState.filters, problems: [id] });
      expect(results.length, id).toBeGreaterThan(0);
      expect(results.flatMap((result) => result.reasons).join(' ')).not.toMatch(/\b(?:V4|governed|record|PF0[1-5]|P\d\d[A-Z]?)\b/i);
    }
  });
  it('copies public model names, exclusion reasons and visible Not Applicable answers', () => {
    const brief = generateBrief({ ...initialState, selectedProducts: ['P04'], readinessAnswers: { 'pf02-principle': 'acute', 'pf02-speed': '1500-2500', 'existing-equipment': 'not-applicable' } });
    expect(brief.text).toContain('Excluded by a Known Requirement');
    expect(brief.text).toContain('Exclusion:');
    expect(brief.text).toContain(publicName('P04B'));
    expect(brief.known.some((item) => item.value === 'Not Applicable')).toBe(true);
    expect(brief.text).not.toMatch(/\b(?:V4|governed|source record|PF0[1-5]|P\d\d[A-Z]?(?:-C\d+)?)\b/i);
  });
});
