import { describe, expect, it } from 'vitest';
import { products } from '../src/data/catalog';
import { capabilityRelationships, validateCapabilityRelationships } from '../src/data/capabilityRelationships';
import { productionStages } from '../src/data/productionStages';
import { readinessQuestions, validateReadinessQuestions } from '../src/data/readinessQuestions';
import { activeProductIds, evaluateFit } from '../src/domain/fit';
import { generateBrief } from '../src/domain/brief';
import { initialState } from '../src/state/reducer';

const stateFor = (productIds: string[], answers: Record<string, string | string[]>) => ({ ...initialState, selectedProducts: productIds, readinessAnswers: answers });

describe('logic-hardening invariants', () => {
  it('validates every governed relationship and MCQ reference', () => {
    expect(validateCapabilityRelationships()).toEqual([]);
    expect(validateReadinessQuestions()).toEqual([]);
  });

  it('gives every Primary Product exactly one primary orientation placement', () => {
    for (const product of products) expect(capabilityRelationships.filter((relationship) => relationship.productId === product.id && relationship.relationshipType === 'primary')).toHaveLength(1);
  });

  it('keeps the nine inline stages separate from the two independent laboratory paths', () => {
    expect(productionStages.filter((stage) => stage.kind === 'inline')).toHaveLength(9);
    expect(productionStages.filter((stage) => stage.kind === 'offline').map((stage) => stage.id)).toEqual(['offline-hv-testing', 'fire-resistance-testing']);
  });

  it('combines explicit products, review families, requirements and carried stages as additive review scope', () => {
    const state = { ...initialState, selectedProducts: ['P08'], reviewFamilyIds: ['PF02'] as typeof initialState.reviewFamilyIds, reviewStageIds: ['offline-hv-testing'], readinessAnswers: { 'primary-requirement': 'braking' } };
    expect(activeProductIds(state).sort()).toEqual(['P04', 'P05', 'P08', 'P13']);
  });

  it('does not label an incomplete product review as aligned', () => {
    const [result] = evaluateFit(stateFor(['P08'], { 'pf04-path': 'graphite', 'pf04-speed': '100-150' }));
    expect(result.status).toBe('potential');
    expect(result.openQuestionIds).toEqual(expect.arrayContaining(['pf04-powder-size', 'pf04-powder-readiness']));
  });

  it('intersects both minimum and maximum PF01 boundaries', () => {
    const [result] = evaluateFit(stateFor(['P01'], { 'pf01-function': 'diameter', 'pf01-min-diameter': '0-8-to-below-1', 'pf01-max-diameter': '65-150' }));
    expect(result.modelIds).toEqual([]);
    expect(result.status).toBe('excluded');
  });

  it('keeps non-standard DC voltage and spark support functions in project review', () => {
    expect(evaluateFit(stateFor(['P05'], { 'pf03-path': 'dc', 'pf03-dc-voltage': 'other' }))[0].status).toBe('project-review');
    expect(evaluateFit(stateFor(['P04'], { 'pf02-principle': 'live', 'pf02-response': ['logging'] }))[0].status).toBe('project-review');
  });

  it('applies P04 on-demand diameter review only to the affected method', () => {
    const dc = evaluateFit(stateFor(['P04'], { 'pf02-principle': 'dc', 'pf02-diameter': '15-30' }))[0];
    const live = evaluateFit(stateFor(['P04'], { 'pf02-principle': 'live', 'pf02-diameter': '15-30' }))[0];
    expect(dc.status).toBe('project-review');
    expect(live.status).toBe('potential');
    expect(live.modelIds).toEqual(['P04A']);
  });

  it('rejects a P10 tension requirement above the published configurations', () => {
    const [result] = evaluateFit(stateFor(['P10'], { 'pf05-role': 'indication', 'pf05-indicator-tension': 'above-40' }));
    expect(result.status).toBe('excluded');
    expect(result.modelIds).toEqual([]);
  });

  it('maps every exact P12 capacity choice to at least one approved SKU', () => {
    const capacityQuestion = readinessQuestions.find((question) => question.id === 'pf05-capacity')!;
    for (const option of capacityQuestion.options.filter((item) => item.variantIds?.length)) {
      const [result] = evaluateFit(stateFor(['P12'], { 'pf05-role': 'sensing', 'pf05-capacity': option.id }));
      expect(result.modelIds).toEqual(option.modelIds);
      expect(result.variantIds).toEqual(option.variantIds);
      expect(result.variantIds.length).toBeGreaterThan(0);
    }
  });

  it('provides an explicit out-of-range outcome for every finite published model boundary', () => {
    const finiteBoundaryQuestions = ['pf01-min-diameter', 'pf01-max-diameter', 'pf02-speed', 'pf02-voltage', 'pf02-diameter', 'pf04-speed', 'pf04-preheat-min-size', 'pf04-preheat-max-size', 'pf04-powder-size', 'pf04-temperature', 'pf05-indicator-size', 'pf05-indicator-tension', 'pf05-capacity', 'pf05-rpm', 'pf05-torque', 'pf05-air'];
    for (const questionId of finiteBoundaryQuestions) {
      const question = readinessQuestions.find((item) => item.id === questionId)!;
      expect(question.options.some((option) => option.modelIds?.length === 0), `${questionId} needs an explicit outside-boundary choice`).toBe(true);
    }
  });

  it('carries selected stages into both known information and the plain-text brief', () => {
    const brief = generateBrief({ ...initialState, reviewStageIds: ['pre-extrusion'] });
    expect(brief.known[0].value).toContain('Preheating and Other Pre-Extrusion Preparation');
    expect(brief.text).toContain('Production or Testing Stages Carried From the Explorer');
  });

  it('never excludes a model solely because a governed answer is unknown', () => {
    for (const product of products) {
      const answers = Object.fromEntries(readinessQuestions.map((question) => [question.id, 'unknown']));
      const result = evaluateFit(stateFor([product.id], answers)).find((item) => item.productId === product.id)!;
      expect(result.status).not.toBe('excluded');
    }
  });
});
