import { describe, expect, it } from 'vitest';
import { generateBrief } from '../src/domain/brief';
import { initialState } from '../src/state/reducer';

describe('readiness brief generation', () => {
  it('separates governed answers from open questions and evaluates model fit', () => {
    const state = { ...initialState, selectedProducts: ['P04'], readinessAnswers: { 'primary-requirement': 'spark', 'pf02-speed': '200-1500', 'pf02-principle': 'unknown' } };
    const brief = generateBrief(state);
    expect(brief.capabilityPaths).toContain('Inline Spark Testing and Insulation Fault Detection');
    expect(brief.known.some((item) => item.value === 'Above 200 m/min to 1500 m/min')).toBe(true);
    expect(brief.open).toContain('Which Inline Spark-Test Principle Is Required?');
    expect(brief.evaluations[0].modelIds).toEqual(['P04B', 'P04C']);
    expect(brief.text).not.toMatch(/recommended model|final selection/i);
  });

  it('preserves Not Applicable without treating it as missing', () => {
    const state = { ...initialState, selectedProducts: ['P12'], readinessAnswers: { 'pf05-capacity': 'not-applicable' } };
    const brief = generateBrief(state);
    expect(brief.open).not.toContain('Which Exact Published Loadcell Capacity Is Required?');
  });
});
