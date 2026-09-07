import { describe, expect, it } from 'vitest';
import { initialState } from '../src/state/reducer';
import { loadState, saveState } from '../src/state/persistence';

class MemoryStorage {
  data = new Map<string, string>();
  setItem(key: string, value: string) { this.data.set(key, value); }
  getItem(key: string) { return this.data.get(key) ?? null; }
}

describe('session persistence', () => {
  it('round-trips allowlisted explorer state', () => {
    const storage = new MemoryStorage();
    const state = { ...initialState, selectedProducts: ['P04'], filters: { ...initialState.filters, stages: ['spark-fault'] }, readinessAnswers: { 'pf02-principle': 'acute' } };
    saveState(state, storage);
    expect(loadState(storage).selectedProducts).toEqual(['P04']);
    expect(loadState(storage).filters.stages).toEqual(['spark-fault']);
    expect(loadState(storage).readinessAnswers).toEqual({ 'pf02-principle': 'acute' });
  });

  it('falls back safely on corrupt data', () => {
    const storage = new MemoryStorage();
    storage.setItem('puretronics-capability-profile:v3', '{invalid');
    expect(loadState(storage)).toEqual(initialState);
  });
});
