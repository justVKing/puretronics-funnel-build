import { describe, expect, it } from 'vitest';
import { products, productById } from '../src/data/catalog';
import { publicRecordDetails, specificationsFor, v4Records } from '../src/data/v4';
import { buildModelComparison } from '../src/domain/comparison';

const internalLanguage = /\b(?:P\d{2}[A-Z]?(?:-C\d+)?|PF\d{2}|LS[12]|V4|SKU|SKUs)\b|governed|source[- ](?:record|backed|literature|range|series)|(?:child|support|capacity|series) record|database|frozen hierarchy|dummy children|Pending Validation|Review Build|placeholder|publication status|Input Files|Source-Backed Scope/i;

describe('customer-facing product information', () => {
  it('removes internal language from every displayed detail and all technical values', () => {
    for (const record of v4Records) {
      const detail = publicRecordDetails(record.id)!;
      for (const field of ['name', 'primaryFunction', 'primaryUseCase', 'buyerProblemSolved', 'buyerValue', 'bestFitBuyerQuestion', 'selectionFactors', 'availability', 'technicalCaveats', 'quotationConfirmationNote'] as const) {
        expect(detail[field], `${record.id}: ${field}`).not.toMatch(internalLanguage);
      }
      for (const spec of specificationsFor(record.id)) expect(`${spec.label}: ${spec.display}`, `${record.id}: ${spec.label}`).not.toMatch(internalLanguage);
    }
  });

  it('retains every populated technical parameter with a nonempty customer value', () => {
    expect(v4Records.reduce((sum, record) => sum + specificationsFor(record.id).length, 0)).toBe(747);
    for (const record of v4Records) {
      expect(specificationsFor(record.id).map((spec) => spec.label)).toEqual(record.technicalSpecifications.map((spec) => spec.label));
      expect(specificationsFor(record.id).every((spec) => spec.display.trim().length > 0)).toBe(true);
    }
  });

  it('shows only supported loadcell capacity options and the actual mounting arrangement', () => {
    for (const series of productById.get('P12')!.models) {
      const capacities = series.children!.map((child) => Number(child.id.split('-C')[1])).sort((a, b) => a - b);
      expect(series.specs.find((spec) => spec.label === 'Capacity')?.display).toBe(`${capacities.join(' / ')} kg`);
      for (const capacity of series.children!) {
        const mounting = capacity.specs.find((spec) => spec.label === 'Series Mounting')?.display;
        expect(mounting).toMatch(/(?:Flange Mount|Pillow Block)/);
        expect(mounting).toMatch(/(?:17|25|35).*mm/);
      }
    }
    expect(specificationsFor('P12A').find((spec) => spec.label === 'Capacity')?.display).toBe('10 / 20 / 50 / 100 kg');
    expect(specificationsFor('P12D').find((spec) => spec.label === 'Capacity')?.display).toBe('100 / 200 / 500 / 1000 kg');
  });

  it('keeps comparison values customer-facing for all model and capacity combinations', () => {
    for (const product of products) {
      const variants = [...product.models, ...product.models.flatMap((model) => model.children ?? [])];
      for (let index = 0; index < variants.length; index++) {
        const selected = variants.slice(index, index + 3);
        for (const section of buildModelComparison(product, selected.map((model) => model.id))) {
          expect(section.label).not.toMatch(internalLanguage);
          for (const row of section.rows) for (const value of Object.values(row.values)) expect(value).not.toMatch(internalLanguage);
        }
      }
    }
  });
});
