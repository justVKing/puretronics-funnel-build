import type { FamilyId } from './catalog';

export type AnswerStatus = 'known' | 'approximate' | 'range' | 'not-known' | 'not-applicable';

export interface StructuredAnswer {
  status: AnswerStatus;
  value?: string;
  min?: string;
  max?: string;
  unit?: string;
}

export interface ReadinessQuestion {
  id: string;
  label: string;
  help?: string;
  section: 'requirement' | 'product' | 'conditions' | 'integration' | 'project';
  type: 'text' | 'select' | 'technical';
  options?: string[];
  familyIds?: FamilyId[];
  unitOptions?: string[];
}

export interface ReviewBrief {
  title: string;
  known: Array<{ label: string; value: string }>;
  open: string[];
  capabilityPaths: string[];
  suggestedMaterials: string[];
  text: string;
}
