import { productById } from '../data/catalog';
import { useExplorer } from '../state/ExplorerProvider';

export function SelectionTray() {
  const { state, dispatch } = useExplorer();
  if (!state.comparisonProductId && !state.selectedProducts.length) return null;
  const sessionProductIds = [...new Set([...(state.comparisonProductId ? [state.comparisonProductId] : []), ...state.selectedProducts])];
  return (
    <aside className="selection-tray" aria-label="Current selections">
      <div><p className="proof-label">Your session</p><strong>{state.comparisonProductId ? (state.comparisonModelIds.length ? `${state.comparisonModelIds.length} model${state.comparisonModelIds.length === 1 ? '' : 's'} to compare` : 'Model comparison ready') : 'No model comparison'} · {state.selectedProducts.length} for review</strong></div>
      <div className="tray-items">{sessionProductIds.map((id) => <span key={id}>{productById.get(id)?.shortName}</span>)}</div>
      <div className="tray-actions">{state.comparisonProductId && <button type="button" onClick={() => dispatch({ type: 'SET_VIEW', view: 'compare' })}>Open model comparison</button>}<a href="#prepare">Prepare review</a></div>
    </aside>
  );
}
