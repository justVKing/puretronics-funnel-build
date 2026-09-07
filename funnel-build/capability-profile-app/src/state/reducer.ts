import type { ExplorerAction, ExplorerState } from '../types/explorer';

export const initialState: ExplorerState = {
  view: 'navigator',
  navigatorMode: null,
  filters: { problems: [], stages: [], families: [], routes: [], query: '' },
  selectedProducts: [],
  comparisonProductId: null,
  comparisonModelIds: [],
  comparisonShowDifferences: false,
  drawerProductId: null,
  readinessAnswers: {},
  briefGenerated: false,
  navigatorAnswers: {},
};

const toggle = <T,>(items: T[], value: T) => items.includes(value) ? items.filter((item) => item !== value) : [...items, value];

export function explorerReducer(state: ExplorerState, action: ExplorerAction): ExplorerState {
  switch (action.type) {
    case 'SET_VIEW': return { ...state, view: action.view };
    case 'SET_MODE': return { ...state, navigatorMode: action.mode, view: action.mode === 'stage' ? 'line' : 'navigator' };
    case 'TOGGLE_FILTER': return { ...state, filters: { ...state.filters, [action.key]: toggle(state.filters[action.key] as string[], action.value) } } as ExplorerState;
    case 'SET_FILTER_VALUES': return { ...state, filters: { ...state.filters, [action.key]: action.values } } as ExplorerState;
    case 'SET_NAVIGATOR_ANSWER': return { ...state, navigatorAnswers: { ...state.navigatorAnswers, [action.questionId]: action.value } };
    case 'SET_QUERY': return { ...state, filters: { ...state.filters, query: action.query } };
    case 'CLEAR_FILTERS': return { ...state, filters: initialState.filters, navigatorMode: null, navigatorAnswers: {} };
    case 'TOGGLE_SELECTED': return { ...state, selectedProducts: toggle(state.selectedProducts, action.productId) };
    case 'SET_COMPARISON_PRODUCT': {
      if (!action.productId) return { ...state, comparisonProductId: null, comparisonModelIds: [], comparisonShowDifferences: false };
      return { ...state, comparisonProductId: action.productId, comparisonModelIds: [], comparisonShowDifferences: false };
    }
    case 'TOGGLE_COMPARISON_MODEL': return state.comparisonModelIds.includes(action.modelId)
      ? { ...state, comparisonModelIds: state.comparisonModelIds.filter((id) => id !== action.modelId) }
      : state.comparisonModelIds.length >= action.limit ? state : { ...state, comparisonModelIds: [...state.comparisonModelIds, action.modelId] };
    case 'SET_COMPARISON_DIFFERENCES': return { ...state, comparisonShowDifferences: action.show };
    case 'CLEAR_COMPARISON': return { ...state, comparisonProductId: null, comparisonModelIds: [], comparisonShowDifferences: false };
    case 'OPEN_DRAWER': return { ...state, drawerProductId: action.productId };
    case 'CLOSE_DRAWER': return { ...state, drawerProductId: null };
    case 'SET_READINESS_ANSWER': return { ...state, readinessAnswers: { ...state.readinessAnswers, [action.questionId]: action.value }, briefGenerated: false };
    case 'GENERATE_BRIEF': return { ...state, briefGenerated: true };
    case 'RESET_READINESS': return { ...state, readinessAnswers: {}, selectedProducts: [], briefGenerated: false };
    case 'RESTORE': return action.state;
    default: return state;
  }
}
