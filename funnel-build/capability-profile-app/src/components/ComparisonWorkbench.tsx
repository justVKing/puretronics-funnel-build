import { productById } from '../data/catalog';
import { comparisonEligibility } from '../domain/comparison';
import { useExplorer } from '../state/ExplorerProvider';
import type { ComparisonMode } from '../types/explorer';
import { track } from '../analytics/events';

const modes: Array<{ id: ComparisonMode; label: string; description: string }> = [
  { id: 'alternatives', label: 'Like-for-like', description: 'Compare options only where the technical role is genuinely equivalent.' },
  { id: 'variants', label: 'Models / variants', description: 'Compare approved models within one Primary Product.' },
  { id: 'system', label: 'System roles', description: 'Understand complementary products without presenting them as substitutes.' },
];

export function ComparisonWorkbench() {
  const { state, dispatch } = useExplorer();
  const selected = state.comparison.map((id) => productById.get(id)).filter(Boolean);
  const eligibility = comparisonEligibility(state.comparison, state.comparisonMode);
  const baseProduct = selected[0];

  return (
    <div className="comparison-view">
      <div className="view-intro"><div><p className="proof-label">Comparison Workbench</p><h3>Compare without creating false equivalence</h3></div><p>Place up to three desktop options—or two on mobile—side by side.</p></div>
      <div className="comparison-modes" role="radiogroup" aria-label="Comparison type">{modes.map((mode) => <button type="button" role="radio" aria-checked={state.comparisonMode === mode.id} className={state.comparisonMode === mode.id ? 'is-active' : ''} onClick={() => { dispatch({ type: 'SET_COMPARISON_MODE', mode: mode.id }); track('comparison_viewed', { mode: mode.id, ids: state.comparison }); }} key={mode.id}><strong>{mode.label}</strong><span>{mode.description}</span></button>)}</div>
      {!selected.length && <div className="empty-state"><span className="status-icon" aria-hidden="true">+</span><h3>No comparison options selected</h3><p>Add products from your results, or open the Navigator to build a relevant set.</p><button type="button" className="button button-secondary" onClick={() => dispatch({ type: 'SET_VIEW', view: 'navigator' })}>Return to Navigator</button></div>}
      {selected.length > 0 && <div className={`comparison-message${eligibility.eligible ? ' is-valid' : ''}`}><strong>{eligibility.eligible ? 'Comparison context' : 'Comparison conflict'}</strong><p>{eligibility.reason}</p></div>}
      {state.comparisonMode === 'variants' && baseProduct && (
        <div className="comparison-table-wrap"><table className="comparison-table"><caption>{baseProduct.name} approved model comparison</caption><thead><tr><th scope="col">Technical field</th>{baseProduct.models.map((model) => <th scope="col" key={model.id}>{model.name}<small>{model.id}</small></th>)}</tr></thead><tbody>{[...new Set(baseProduct.models.flatMap((model) => model.specs.map((spec) => spec.label)))].map((label) => <tr key={label}><th scope="row">{label}</th>{baseProduct.models.map((model) => <td key={model.id}>{model.specs.find((spec) => spec.label === label)?.display ?? 'Not published'}</td>)}</tr>)}</tbody></table></div>
      )}
      {state.comparisonMode !== 'variants' && eligibility.eligible && selected.length > 1 && (
        <div className="comparison-table-wrap"><table className="comparison-table"><caption>{state.comparisonMode === 'system' ? 'Complementary system roles' : 'Like-for-like product comparison'}</caption><thead><tr><th scope="col">Review field</th>{selected.map((product) => <th scope="col" key={product!.id}>{product!.shortName}<small>{product!.id}</small></th>)}</tr></thead><tbody>
          <tr><th scope="row">System role</th>{selected.map((product) => <td key={product!.id}>{product!.systemRole}</td>)}</tr>
          <tr><th scope="row">Primary function</th>{selected.map((product) => <td key={product!.id}>{product!.primaryFunction}</td>)}</tr>
          <tr><th scope="row">Published technical context</th>{selected.map((product) => <td key={product!.id}>{product!.specs.length ? product!.specs.map((spec) => `${spec.label}: ${spec.display}`).join(' · ') : 'Application-specific; see validated models or selection factors.'}</td>)}</tr>
          <tr><th scope="row">Selection factors</th>{selected.map((product) => <td key={product!.id}>{product!.selectionFactors.join(' · ')}</td>)}</tr>
          <tr><th scope="row">Availability</th>{selected.map((product) => <td key={product!.id}>{product!.availability}</td>)}</tr>
        </tbody></table></div>
      )}
      {selected.length > 0 && <div className="comparison-footer"><div>{selected.map((product) => <button type="button" key={product!.id} onClick={() => dispatch({ type: 'TOGGLE_COMPARISON', productId: product!.id, limit: 3 })}>Remove {product!.shortName}</button>)}</div><button type="button" className="text-button" onClick={() => dispatch({ type: 'CLEAR_COMPARISON' })}>Clear comparison</button><a className="button" href="#prepare" onClick={() => selected.forEach((product) => { if (!state.selectedProducts.includes(product!.id)) dispatch({ type: 'TOGGLE_SELECTED', productId: product!.id }); })}>Prepare a review for these options</a></div>}
    </div>
  );
}
