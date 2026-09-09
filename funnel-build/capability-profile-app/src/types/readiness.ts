import type { FamilyId, ProjectRoute } from './catalog';

export type QuestionId = string;
export type OptionId = string;
export type McqAnswer = OptionId | OptionId[];
export type FitStatus = 'aligned' | 'potential' | 'project-review' | 'excluded';

export interface TechnicalPredicate { kind: 'allowed-models' | 'product-path' | 'project-route'; ids: string[]; }
export interface McqOption {
  id: OptionId;
  label: string;
  productIds?: string[];
  modelIds?: string[];
  variantIds?: string[];
  projectRoute?: ProjectRoute;
  evidence?: string;
  caveat?: string;
  reviewRequired?: boolean;
  reviewRequiredModelIds?: string[];
  /** A confirmed contradiction to a product-level limit, including products without models. */
  excludesProduct?: boolean;
  /** Retain the configurable product for review even when no standard configuration remains. */
  configurationReview?: boolean;
}
export interface McqQuestion {
  id: QuestionId;
  label: string;
  purpose: string;
  section: 'requirement' | 'application' | 'conditions' | 'integration' | 'project';
  mode: 'single' | 'multiple';
  scopeOnly?: boolean;
  familyIds?: FamilyId[];
  /** The products whose technical conditions this question can constrain. */
  productIds?: string[];
  /** Only these methods are constrained; other selected methods remain independent. */
  modelScope?: string[];
  when?: { questionId: QuestionId; optionIds: OptionId[] };
  options: McqOption[];
}
export interface ExclusionReason { questionId: string; reason: string; source: string; }
export interface FitEvaluation { productId: string; status: FitStatus; modelIds: string[]; variantIds: string[]; reasons: string[]; exclusions: ExclusionReason[]; openQuestionIds: string[]; }
export interface ReviewBrief {
  title: string;
  known: Array<{ label: string; value: string }>;
  open: string[];
  capabilityPaths: string[];
  suggestedMaterials: string[];
  evaluations: FitEvaluation[];
  text: string;
}
