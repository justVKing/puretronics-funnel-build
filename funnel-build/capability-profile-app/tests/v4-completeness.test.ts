import { describe, expect, it } from 'vitest';
import sourceManifest from '../qa/v4-source-completeness-manifest.json';
import { products } from '../src/data/catalog';
import { v4Records } from '../src/data/v4';

const checksum = (value: string) => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
};

describe('V4 source-to-build completeness', () => {
  it('matches the independently captured V4 record and specification totals', () => {
    expect(v4Records).toHaveLength(sourceManifest.totals.records);
    expect(v4Records.flatMap((record) => record.technicalSpecifications)).toHaveLength(sourceManifest.totals.technicalSpecifications);
    expect(sourceManifest.totals).toEqual({
      records: 83,
      technicalSpecifications: 747,
      primaryProducts: 13,
      directModelsConfigurationsAndSeries: 33,
      capacitySkus: 24,
      supportAndOptionRecords: 13,
    });
  });

  it('matches every V4 record, parameter label and technical-value checksum', () => {
    const byId = new Map(v4Records.map((record) => [record.id, record]));
    expect([...byId.keys()].sort()).toEqual(sourceManifest.records.map((record) => record.id).sort());
    sourceManifest.records.forEach((expected) => {
      const actual = byId.get(expected.id)!;
      expect(actual.recordClass).toBe(expected.recordClass);
      expect(actual.parentId).toBe(expected.parentId);
      expect(actual.technicalSpecifications).toHaveLength(expected.specificationCount);
      expect(actual.technicalSpecifications.map((specification) => specification.label)).toEqual(expected.labels);
      expect(checksum(JSON.stringify(actual.technicalSpecifications))).toBe(expected.valueChecksum);
    });
  });

  it('hydrates all primary products, direct comparison records, SKUs and support items', () => {
    const direct = products.flatMap((product) => product.models);
    const skus = direct.flatMap((model) => model.children ?? []);
    const support = products.flatMap((product) => product.supportItems ?? []);
    expect(products).toHaveLength(13);
    expect(direct).toHaveLength(33);
    expect(skus).toHaveLength(24);
    expect(support).toHaveLength(13);
    expect(products.flatMap((product) => [product, ...product.models, ...product.models.flatMap((model) => model.children ?? []), ...(product.supportItems ?? [])]).flatMap((record) => record.specs)).toHaveLength(747);
  });

  it('contains the complete eleven-parameter P08 model tables', () => {
    const p08 = products.find((product) => product.id === 'P08')!;
    p08.models.forEach((model) => expect(model.specs).toHaveLength(11));
    expect(p08.models[0].specs.map((specification) => specification.label)).toEqual([
      'Power Supply',
      'Maximum Speed (m / min)',
      'Maximum Diameter of Cable (mm)',
      'Dimensions (mm) - [H × W × D]',
      'Centre Height of Wire (mm)',
      'Maximum Power',
      'Powder Mesh',
      'Sound Level of Machine in Operation',
      'User Interface',
      'Scope Application',
      'Weight (Kg)',
    ]);
  });
});
