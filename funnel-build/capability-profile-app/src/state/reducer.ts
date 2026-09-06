import type { ExplorerAction, ExplorerState } from '../types/explorer';

export const initialState: ExplorerState = {
  view: 'navigator',
  navigatorMode: null,
  filters: { problems: [], stages: [], families: [], routes: [], query: '' },
  selectedProducts: [],
  comparison: [],
  comparisonMode: 'alternatives',
  drawerProductId: null,
  readinessAnswers: {},
  briefGenerated: false,
};

const toggle = <T,>(items: T[], value: T) => items.includes(value) ? items.filter((item) => item !== value) : [...items, value];

export function explorerReducer(state: ExplorerState, action: ExplorerAction): ExplorerState {
  switch (action.type) {
    case 'SET_VIEW': return { ...state, view: action.view };
    case 'SET_MODE': return { ...state, navigatorMode: action.mode, view: action.mode === 'stage' ? 'line' : 'navigator' };
    case 'TOGGLE_FILTER': return { ...state, filters: { ...state.filters, [action.key]: toggle(state.filters[action.key] as string[], action.value) } } as ExplorerState;
    case 'SET_QUERY': return { ...state, filters: { ...state.filters, query: action.query } };
    case 'CLEAR_FILTERS': return { ...state, filters: initialState.filters, navigatorMode: null };
    case 'TOGGLE_SELECTED': return { ...state, selectedProducts: toggle(state.selectedProducts, action.productId) };
    case 'TOGGLE_COMPARISON': return state.comparison.includes(action.productId)
      ? { ...state, comparison: state.comparison.filter((id) => id !== action.productId) }
      : state.comparison.length >= action.limit ? state : { ...state, comparison: [...state.comparison, action.productId] };
    case 'CLEAR_COMPARISON': return { ...state, comparison: [] };
    case 'SET_COMPARISON_MODE': return { ...state, comparisonMode: action.mode };
    case 'OPEN_DRAWER': return { ...state, drawerProductId: action.productId };
    case 'CLOSE_DRAWER': return { ...state, drawerProductId: null };
    case 'SET_READINESS_ANSWER': return { ...state, readinessAnswers: { ...state.readinessAnswers, [action.questionId]: action.value }, briefGenerated: false };
    case 'GENERATE_BRIEF': return { ...state, briefGenerated: true };
    case 'RESET_READINESS': return { ...state, readinessAnswers: {}, selectedProducts: [], briefGenerated: false };
    case 'RESTORE': return action.state;
    default: return state;
  }
}
