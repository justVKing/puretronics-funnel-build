import { describe, expect, it } from 'vitest';
import { families, products } from '../src/data/catalog';
import { validateCatalog } from '../src/domain/catalogValidation';
import { matchProducts } from '../src/domain/matching';

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
});
