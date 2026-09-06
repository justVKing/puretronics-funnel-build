import type { FamilyId, ProjectRoute } from './catalog';

export type ExplorerView = 'navigator' | 'line' | 'matrix' | 'compare';
export type NavigatorMode = 'problem' | 'stage' | 'family' | 'search' | 'project' | 'guide';
export type ComparisonMode = 'alternatives' | 'variants' | 'system';

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
  comparison: string[];
  comparisonMode: ComparisonMode;
  drawerProductId: string | null;
  readinessAnswers: Record<string, unknown>;
  briefGenerated: boolean;
}

export type ExplorerAction =
  | { type: 'SET_VIEW'; view: ExplorerView }
  | { type: 'SET_MODE'; mode: NavigatorMode }
  | { type: 'TOGGLE_FILTER'; key: 'problems' | 'stages' | 'families' | 'routes'; value: string }
  | { type: 'SET_QUERY'; query: string }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'TOGGLE_SELECTED'; productId: string }
  | { type: 'TOGGLE_COMPARISON'; productId: string; limit: number }
  | { type: 'CLEAR_COMPARISON' }
  | { type: 'SET_COMPARISON_MODE'; mode: ComparisonMode }
  | { type: 'OPEN_DRAWER'; productId: string }
  | { type: 'CLOSE_DRAWER' }
  | { type: 'SET_READINESS_ANSWER'; questionId: string; value: unknown }
  | { type: 'GENERATE_BRIEF' }
  | { type: 'RESET_READINESS' }
  | { type: 'RESTORE'; state: ExplorerState };
