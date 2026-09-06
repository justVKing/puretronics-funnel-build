import { productById } from '../data/catalog';
import { useExplorer } from '../state/ExplorerProvider';

export function SelectionTray() {
  const { state, dispatch } = useExplorer();
  if (!state.comparison.length && !state.selectedProducts.length) return null;
  return (
    <aside className="selection-tray" aria-label="Current selections">
      <div><p className="proof-label">Your session</p><strong>{state.comparison.length} to compare · {state.selectedProducts.length} for review</strong></div>
      <div className="tray-items">{[...new Set([...state.comparison, ...state.selectedProducts])].map((id) => <span key={id}>{productById.get(id)?.shortName}</span>)}</div>
      <div className="tray-actions">{state.comparison.length > 0 && <button type="button" onClick={() => dispatch({ type: 'SET_VIEW', view: 'compare' })}>Open comparison</button>}<a href="#prepare">Prepare review</a></div>
    </aside>
  );
}
