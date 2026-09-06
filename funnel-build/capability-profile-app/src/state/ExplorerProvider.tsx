import { createContext, useContext, useEffect, useMemo, useReducer, type Dispatch, type ReactNode } from 'react';
import { matchProducts } from '../domain/matching';
import type { ExplorerAction, ExplorerState, MatchResult } from '../types/explorer';
import { explorerReducer, initialState } from './reducer';
import { loadState, saveState } from './persistence';

interface ContextValue { state: ExplorerState; dispatch: Dispatch<ExplorerAction>; results: MatchResult[] }
const ExplorerContext = createContext<ContextValue | null>(null);

export function ExplorerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(explorerReducer, initialState, () => typeof window === 'undefined' ? initialState : loadState());
  useEffect(() => { saveState(state); }, [state]);
  const results = useMemo(() => matchProducts(state.filters), [state.filters]);
  const value = useMemo(() => ({ state, dispatch, results }), [state, results]);
  return <ExplorerContext.Provider value={value}>{children}</ExplorerContext.Provider>;
}

export function useExplorer() {
  const context = useContext(ExplorerContext);
  if (!context) throw new Error('useExplorer must be used inside ExplorerProvider');
  return context;
}
