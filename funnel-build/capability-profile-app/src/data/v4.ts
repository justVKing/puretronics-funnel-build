import rawCatalog from './v4Catalog.generated.json';
import type { ModelVariant, TechnicalDatum, V4RecordClass, V4RecordDetails } from '../types/catalog';

interface GeneratedSpecification {
  label: string;
  value: string;
}

interface GeneratedRecord extends Omit<V4RecordDetails, 'subItemType' | 'variantCode' | 'parentId'> {
  familyId: string | null;
  itemLevel: string;
  subItemType: string | null;
  variantCode: string | null;
  parentId: string | null;
  rootPrimaryProductId: string | null;
  parentageBasis: string | null;
  technicalSpecifications: GeneratedSpecification[];
}

export const V4_SOURCE_DATABASE = rawCatalog.sourceDatabase;
export const V4_INCLUSION_RULE = rawCatalog.inclusionRule;
export const V4_EXPECTED_RECORD_COUNT = 83;
export const V4_EXPECTED_SPECIFICATION_COUNT = 747;

export const v4Records = rawCatalog.records as GeneratedRecord[];
export const v4RecordById = new Map(v4Records.map((record) => [record.id, record]));

const kindFor = (label: string): TechnicalDatum['kind'] => {
  const value = label.toLowerCase();
  if (/temperature/.test(value)) return 'temperature';
  if (/speed|frequency|scan rate|rpm|throughput/.test(value)) return 'speed';
  if (/volt|power supply|supply|current|electrical|analog|analogue/.test(value)) return 'voltage';
  if (/range|diameter|size|dimension|height|length|width|weight|capacity|torque|pressure|inertia|load|tension/.test(value)) return 'capacity';
  return 'feature';
};

export function specificationsFor(recordId: string): TechnicalDatum[] {
  const record = v4RecordById.get(recordId);
  return record?.technicalSpecifications.map((specification) => ({
    label: specification.label,
    display: specification.value,
    kind: kindFor(specification.label),
    sourceRecord: recordId,
  })) ?? [];
}

export function publicRecordDetails(recordId: string): V4RecordDetails | undefined {
  const record = v4RecordById.get(recordId);
  if (!record) return undefined;
  return {
    id: record.id,
    name: record.name,
    recordClass: record.recordClass as V4RecordClass,
    subItemType: record.subItemType ?? undefined,
    variantCode: record.variantCode ?? undefined,
    parentId: record.parentId ?? undefined,
    primaryFunction: record.primaryFunction,
    buyerProblemSolved: record.buyerProblemSolved,
    buyerValue: record.buyerValue,
    primaryUseCase: record.primaryUseCase,
    selectionFactors: record.selectionFactors,
    availability: record.availability,
    technicalCaveats: record.technicalCaveats,
    quotationConfirmationNote: record.quotationConfirmationNote,
    bestFitBuyerQuestion: record.bestFitBuyerQuestion,
    primaryManufacturingStage: record.primaryManufacturingStage,
    recommendedNextAction: record.recommendedNextAction,
    sourceAuthority: record.sourceAuthority,
    sources: record.sources,
    evidenceStatus: record.evidenceStatus,
    qaStatus: record.qaStatus,
    validationDate: record.validationDate ?? undefined,
    lastReviewed: record.lastReviewed ?? undefined,
  };
}

const aliasesFor = (record: GeneratedRecord) => [record.name, record.variantCode ?? '', record.id].filter(Boolean).map((value) => value.toLowerCase());

export function toVariant(record: GeneratedRecord): ModelVariant {
  return {
    id: record.id,
    name: record.name,
    aliases: aliasesFor(record),
    specs: specificationsFor(record.id),
    caveat: record.technicalCaveats || undefined,
    availability: record.availability || undefined,
    record: publicRecordDetails(record.id),
    children: v4Records.filter((item) => item.parentId === record.id && item.recordClass === 'SKU').map(toVariant),
  };
}

export function directTechnicalVariants(productId: string) {
  return v4Records
    .filter((record) => record.parentId === productId && ['Model', 'Configuration Class', 'Series'].includes(record.recordClass))
    .map(toVariant);
}

export function supportingItems(productId: string) {
  return v4Records
    .filter((record) => record.parentId === productId && ['Support', 'Option'].includes(record.recordClass))
    .map(toVariant);
}

export function allComparisonVariants(productId: string) {
  const direct = directTechnicalVariants(productId);
  return [...direct, ...direct.flatMap((variant) => variant.children ?? [])];
}
