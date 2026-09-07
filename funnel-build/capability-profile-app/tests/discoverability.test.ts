import { describe, expect, it } from 'vitest';
import { families, products } from '../src/data/catalog';
import { validateCatalog } from '../src/domain/catalogValidation';
import { matchProducts } from '../src/domain/matching';
import { requirementDefinitions, productionStages, problemOptions } from '../src/data/productionStages';
import { validateCapabilityRelationships } from '../src/data/capabilityRelationships';

describe('portfolio governance and discoverability', () => {
  it('publishes exactly five families and 13 Primary Products', () => { expect(families).toHaveLength(5); expect(products).toHaveLength(13); expect(validateCatalog()).toEqual([]); });
  it.each(products.map((product) => [product.id, product.name]))('%s is directly discoverable by its governed name', (id, name) => {
    const results = matchProducts({ problems: [], stages: [], families: [], routes: [], query: name });
    expect(results[0].productId).toBe(id);
  });
  it('keeps every variant subordinate to a Primary Product', () => {
    const modelIds = products.flatMap((product) => product.models.map((model) => model.id));
    expect(new Set(modelIds).size).toBe(modelIds.length);
    expect(modelIds.every((id) => /^P\d{2}[A-Z]$/.test(id))).toBe(true);
  });

  it('keeps the approved V4 hierarchy visible beneath the 13 Primary Products', () => {
    const direct = products.flatMap((product) => product.models);
    const skus = direct.flatMap((model) => model.children ?? []);
    expect(direct).toHaveLength(33);
    expect(skus).toHaveLength(24);
  });
  it('governs the completed explorer architecture', () => {
    expect(requirementDefinitions).toHaveLength(12);
    expect(problemOptions).toHaveLength(14);
    expect(productionStages.slice(0, 9).map((stage) => stage.id)).toEqual(['payoff-unwind', 'joining-repair', 'tension-braking', 'pre-extrusion', 'extrusion', 'cooling-inspection', 'dimensional-measurement', 'spark-fault', 'takeup-rewind']);
    expect(validateCapabilityRelationships()).toEqual([]);
    expect(new Set(requirementDefinitions.flatMap((requirement) => requirement.productIds))).toEqual(new Set(products.map((product) => product.id)));
  });
});
