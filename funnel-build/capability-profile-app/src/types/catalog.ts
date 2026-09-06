export type FamilyId = 'PF01' | 'PF02' | 'PF03' | 'PF04' | 'PF05';
export type ProjectRoute = 'new-line' | 'retrofit' | 'replacement' | 'laboratory' | 'oem' | 'support';
export type RelationshipKind = 'alternative_to' | 'works_with' | 'supports';

export interface ProductFamily {
  id: FamilyId;
  name: string;
  summary: string;
  selectionInputs: string;
}

export interface TechnicalDatum {
  label: string;
  display: string;
  kind: 'range' | 'speed' | 'voltage' | 'capacity' | 'temperature' | 'feature' | 'availability';
  sourceRecord: string;
  qualifier?: string;
}

export interface ModelVariant {
  id: string;
  name: string;
  aliases: string[];
  specs: TechnicalDatum[];
  caveat?: string;
  availability?: string;
}

export interface ProductRecord {
  id: string;
  order: number;
  familyId: FamilyId;
  name: string;
  shortName: string;
  aliases: string[];
  role: string;
  primaryFunction: string;
  buyerProblems: string[];
  stages: string[];
  projectRoutes: ProjectRoute[];
  useCases: string[];
  selectionFactors: string[];
  specs: TechnicalDatum[];
  models: ModelVariant[];
  caveats: string[];
  availability: string;
  comparisonGroup: string;
  systemRole: string;
  image?: string;
  governance: {
    approval: 'Approved';
    claimState: 'Current';
    evidence: 'Validated' | 'Source-Limited';
    qa: 'Public';
    lastValidated: string;
  };
}

export interface ProductRelationship {
  from: string;
  to: string;
  kind: RelationshipKind;
  reason: string;
}
