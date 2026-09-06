import { describe, expect, it } from 'vitest';
import { generateBrief } from '../src/domain/brief';
import { initialState } from '../src/state/reducer';

describe('readiness brief generation', () => {
  it('separates known information from open questions without inventing a selection', () => {
    const state = { ...initialState, selectedProducts: ['P04'], readinessAnswers: { outcome: 'Detect insulation faults and retain production data', lineSpeed: { status: 'known', value: '800', unit: 'm/min' }, sparkMethod: { status: 'not-known' } } };
    const brief = generateBrief(state);
    expect(brief.capabilityPaths).toContain('Inline Spark Testing and Insulation Fault Detection');
    expect(brief.known.some((item) => item.value === '800 m/min')).toBe(true);
    expect(brief.open).toContain('Spark Test Principle or Voltage Context');
    expect(brief.text).not.toMatch(/recommended model/i);
  });

  it('preserves Not applicable without treating it as missing', () => {
    const state = { ...initialState, readinessAnswers: { dimension: { status: 'not-applicable' } } };
    const brief = generateBrief(state);
    expect(brief.open).not.toContain('Relevant Dimension');
  });
});
