import { describe, expect, it } from 'vitest';
import { evaluateFit } from '../src/domain/fit';
import { initialState } from '../src/state/reducer';
import { products } from '../src/data/catalog';
import { readinessQuestions } from '../src/data/readinessQuestions';

const stateFor = (selectedProducts: string[], readinessAnswers: Record<string, string | string[]>) => ({ ...initialState, selectedProducts, readinessAnswers });

describe('V4 evidence-based fit evaluation', () => {
  it('uses unique governed IDs and references only published products and models', () => {
    const productIds = new Set(products.map((product) => product.id));
    const modelIds = new Set(products.flatMap((product) => product.models.map((model) => model.id)));
    expect(new Set(readinessQuestions.map((question) => question.id)).size).toBe(readinessQuestions.length);
    for (const question of readinessQuestions) {
      expect(new Set(question.options.map((option) => option.id)).size).toBe(question.options.length);
      for (const option of question.options) {
        expect(option.productIds?.every((id) => productIds.has(id)) ?? true).toBe(true);
        expect(option.modelIds?.every((id) => modelIds.has(id)) ?? true).toBe(true);
      }
    }
  });

  it('excludes an impossible spark-principle and speed combination', () => {
    const [result] = evaluateFit(stateFor(['P04'], { 'pf02-principle': 'acute', 'pf02-speed': '1500-2500' }));
    expect(result.status).toBe('excluded');
    expect(result.modelIds).toEqual([]);
    expect(result.exclusions.every((item) => item.source.length > 0)).toBe(true);
  });

  it('narrows pneumatic brakes by approved maximum RPM', () => {
    const [result] = evaluateFit(stateFor(['P13'], { 'pf05-role': 'braking', 'pf05-rpm': '1500-2500' }));
    expect(result.modelIds).toEqual(['P13A']);
  });

  it('narrows loadcell series by approved capacity', () => {
    const [result] = evaluateFit(stateFor(['P12'], { 'pf05-role': 'sensing', 'pf05-load': '2000-5000' }));
    expect(result.modelIds).toEqual(['P12F']);
  });

  it('applies intersecting P13 torque and speed boundaries', () => {
    const [result] = evaluateFit(stateFor(['P13'], { 'pf05-role': 'braking', 'pf05-rpm': '1200-1500', 'pf05-torque': '27-33' }));
    expect(result.modelIds).toEqual([]);
    expect(result.status).toBe('excluded');
  });

  it('excludes conditions explicitly outside a published boundary', () => {
    const [result] = evaluateFit(stateFor(['P07'], { 'pf04-path': 'preheat', 'pf04-temperature': 'outside' }));
    expect(result.status).toBe('excluded');
    expect(result.exclusions[0].source).toBe('P07 Approved Maximum Wire Temperature');
  });

  it('keeps request-based P05 ranges in project review rather than treating them as published standard coverage', () => {
    const [result] = evaluateFit(stateFor(['P05'], { 'pf03-path': 'ac', 'pf03-voltage': 'above-40' }));
    expect(result.status).toBe('project-review');
    expect(result.reasons.join(' ')).toMatch(/request-based/i);
  });

  it('keeps graphite powder variants separate and applies speed', () => {
    const [result] = evaluateFit(stateFor(['P08'], { 'pf04-path': 'graphite', 'pf04-speed': '100-150' }));
    expect(result.status).toBe('aligned');
    expect(result.modelIds).toEqual(['P08E']);
  });

  it('keeps P06 project-specific and never excludes on unknown answers', () => {
    const [result] = evaluateFit(stateFor(['P06'], { 'pf03-path': 'unknown' }));
    expect(result.status).toBe('project-review');
    expect(result.exclusions).toEqual([]);
  });
});
