import { productById } from '../data/catalog';
import { useExplorer } from '../state/ExplorerProvider';

export function SelectionTray() {
  const { state, dispatch } = useExplorer();
  if (!state.selectedProducts.length) return null;
  return (
    <aside className="selection-tray" aria-label="Current selections">
      <div><p className="proof-label">Your Application Review</p><strong>{state.selectedProducts.length} Product{state.selectedProducts.length === 1 ? '' : 's'} Selected</strong></div>
      <div className="tray-items">{state.selectedProducts.map((id) => <span key={id}>{productById.get(id)?.shortName}</span>)}</div>
      <div className="tray-actions">{state.comparisonProductId && state.view !== 'compare' && <button type="button" onClick={() => dispatch({ type: 'SET_VIEW', view: 'compare' })}>Open Model Comparison</button>}<a href="#prepare">Prepare Review</a></div>
    </aside>
  );
}
