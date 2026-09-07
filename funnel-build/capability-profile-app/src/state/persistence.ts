import type { ExplorerState } from '../types/explorer';
import { initialState } from './reducer';

const KEY = 'puretronics-capability-profile:v3';
const VERSION = 3;

export function saveState(state: ExplorerState, storage: Pick<Storage, 'setItem'> = sessionStorage) {
  storage.setItem(KEY, JSON.stringify({ version: VERSION, state }));
}

export function loadState(storage: Pick<Storage, 'getItem'> = sessionStorage): ExplorerState {
  try {
    const raw = storage.getItem(KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as { version?: number; state?: ExplorerState };
    if (parsed.version !== VERSION || !parsed.state || !parsed.state.filters) return initialState;
    return { ...initialState, ...parsed.state, filters: { ...initialState.filters, ...parsed.state.filters }, drawerProductId: null };
  } catch {
    return initialState;
  }
}

export function clearState(storage: Pick<Storage, 'removeItem'> = sessionStorage) {
  storage.removeItem(KEY);
}
