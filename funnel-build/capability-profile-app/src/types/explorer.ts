import type { FamilyId, ProjectRoute } from './catalog';
import type { McqAnswer } from './readiness';

export type ExplorerView = 'navigator' | 'line' | 'matrix' | 'compare';
export type NavigatorMode = 'problem' | 'stage' | 'family' | 'search' | 'project' | 'guide';

export interface ExplorerFilters {
  problems: string[];
  stages: string[];
  families: FamilyId[];
  routes: ProjectRoute[];
  query: string;
}

export interface MatchResult {
  productId: string;
  score: number;
  reasons: string[];
  matchedModelIds: string[];
}

export interface ExplorerState {
  view: ExplorerView;
  navigatorMode: NavigatorMode | null;
  filters: ExplorerFilters;
  selectedProducts: string[];
  reviewFamilyIds: FamilyId[];
  reviewStageIds: string[];
  comparisonProductId: string | null;
  comparisonLevel: 'models' | 'capacities';
  comparisonModelIds: string[];
  comparisonShowDifferences: boolean;
  drawerProductId: string | null;
  readinessAnswers: Record<string, McqAnswer>;
  briefGenerated: boolean;
  navigatorAnswers: Record<string, string | string[]>;
}

export type ExplorerAction =
  | { type: 'SET_VIEW'; view: ExplorerView }
  | { type: 'SET_MODE'; mode: NavigatorMode }
  | { type: 'TOGGLE_FILTER'; key: 'problems' | 'stages' | 'families' | 'routes'; value: string }
  | { type: 'SET_FILTER_VALUES'; key: 'problems' | 'stages' | 'families' | 'routes'; values: string[] }
  | { type: 'SET_NAVIGATOR_ANSWER'; questionId: string; value: string | string[] }
  | { type: 'SET_QUERY'; query: string }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'TOGGLE_SELECTED'; productId: string }
  | { type: 'ADD_SELECTED'; productId: string }
  | { type: 'TOGGLE_REVIEW_FAMILY'; familyId: FamilyId }
  | { type: 'ADD_REVIEW_STAGE'; stageId: string }
  | { type: 'REMOVE_REVIEW_STAGE'; stageId: string }
  | { type: 'SET_COMPARISON_PRODUCT'; productId: string | null }
  | { type: 'SET_COMPARISON_LEVEL'; level: 'models' | 'capacities' }
  | { type: 'LIMIT_COMPARISON_MODELS'; limit: number }
  | { type: 'TOGGLE_COMPARISON_MODEL'; modelId: string; limit: number }
  | { type: 'SET_COMPARISON_DIFFERENCES'; show: boolean }
  | { type: 'CLEAR_COMPARISON' }
  | { type: 'OPEN_DRAWER'; productId: string }
  | { type: 'CLOSE_DRAWER' }
  | { type: 'SET_READINESS_ANSWER'; questionId: string; value: McqAnswer }
  | { type: 'GENERATE_BRIEF' }
  | { type: 'EDIT_BRIEF' }
  | { type: 'RESET_READINESS' }
  | { type: 'RESTORE'; state: ExplorerState };
