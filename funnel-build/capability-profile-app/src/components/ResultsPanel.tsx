import { familyById, productById } from '../data/catalog';
import { useExplorer } from '../state/ExplorerProvider';
import { track } from '../analytics/events';
import { v4RecordById } from '../data/v4';
import { productionStages } from '../data/productionStages';
import { relationshipsForStage } from '../data/capabilityRelationships';

export function ResultsPanel() {
  const { state, dispatch, results } = useExplorer();
  const isActive = state.navigatorMode || state.filters.problems.length || state.filters.stages.length || state.filters.families.length || state.filters.routes.length || state.filters.query;
  if (!isActive) return null;

  if (!results.length) return (
    <section className="empty-state" aria-live="polite">
      <span className="status-icon" aria-hidden="true">?</span><h3>No Published Match Is Available for These Selections.</h3>
      <p>Edit the filters or discuss the requirement with Puretronics so the application can be reviewed directly.</p>
      <div className="inline-actions"><button className="button button-secondary" type="button" onClick={() => dispatch({ type: 'CLEAR_FILTERS' })}>Edit filters</button><a className="text-link" href="#prepare">Prepare my brief</a></div>
    </section>
  );

  return (
    <section className="results-section" aria-labelledby="results-heading">
      <div className="results-heading"><div><p className="proof-label">Governed Results</p><h3 id="results-heading">Your Relevant Capability Paths</h3></div><p><strong>{results.length}</strong> Primary Product{results.length === 1 ? '' : 's'}</p></div>
      <p className="result-intro">Based on what you selected, these are the Puretronics capabilities worth reviewing first. Every result explains why it appeared.</p>
      <div className="sr-only" aria-live="polite">{results.length} relevant Primary Product{results.length === 1 ? '' : 's'} found.</div>
      {state.navigatorMode === 'project' && state.filters.stages.length > 0 && <div className="project-stage-groups" aria-label="Capability Paths Grouped by Selected Stage"><p className="proof-label">Stage-Grouped Review</p><h4>Capability Paths Across the Selected Project Stages</h4>{state.filters.stages.map((stageId) => { const productIds = new Set(relationshipsForStage(stageId).map((relationship) => relationship.productId)); const stageResults = results.filter((result) => productIds.has(result.productId)); return <section key={stageId}><h5>{productionStages.find((stage) => stage.id === stageId)?.label}</h5>{stageResults.length ? <ul>{stageResults.map((result) => <li key={result.productId}><button type="button" onClick={() => dispatch({ type: 'OPEN_DRAWER', productId: result.productId })}>{result.productId} · {productById.get(result.productId)?.shortName}</button></li>)}</ul> : <p>No capability path remains at this stage after the other selected constraints are applied.</p>}</section>; })}</div>}
      <div className="result-list">
        {results.map((result, index) => {
          const product = productById.get(result.productId)!;
          const selected = state.selectedProducts.includes(product.id);
          const compared = state.comparisonProductId === product.id;
          const comparable = product.models.length > 1;
          return (
            <article className="result-card" key={product.id}>
              <div className="result-rank"><span>{String(index + 1).padStart(2, '0')}</span><span>{product.id}</span></div>
              <div className="result-main">
                <p className="family-label">{familyById.get(product.familyId)?.name}</p>
                <h4>{product.name}</h4>
                <p>{product.role}</p>
                <ul className="match-reasons" aria-label="Why this result matched">{result.reasons.map((reason) => <li key={reason}><span aria-hidden="true">✓</span>{reason}</li>)}</ul>
                {result.matchedModelIds.length > 0 && <p className="matched-models">Matched V4 Record: {result.matchedModelIds.map((id) => `${id} · ${v4RecordById.get(id)?.name ?? id}`).join('; ')}</p>}
              </div>
              <div className="result-data">
                {product.specs.slice(0, 2).map((spec) => <div key={spec.label}><span>{spec.label}</span><strong>{spec.display}</strong></div>)}
                {!product.specs.length && <div><span>Selection Basis</span><strong>{product.selectionFactors.slice(0, 2).join(' · ')}</strong></div>}
              </div>
              <div className="result-actions">
                <button type="button" className="button button-secondary" onClick={() => { dispatch({ type: 'OPEN_DRAWER', productId: product.id }); track('product_detail_opened', { ids: [product.id] }); }}>View details</button>
                <button type="button" className={`tray-button${compared ? ' is-selected' : ''}`} disabled={!comparable} onClick={() => { dispatch({ type: 'SET_COMPARISON_PRODUCT', productId: compared ? null : product.id }); if (!compared) track('comparison_item_added', { ids: [product.id] }); }}>{comparable ? (compared ? 'Selected for model comparison' : 'Compare models') : 'No model set to compare'}</button>
                <button type="button" className={`tray-button${selected ? ' is-selected' : ''}`} onClick={() => dispatch({ type: 'TOGGLE_SELECTED', productId: product.id })}>{selected ? 'Added to review' : 'Prepare my review'}</button>
              </div>
            </article>
          );
        })}
      </div>
      <p className="result-guidance">Exact equipment and configuration selection is confirmed against the application, operating conditions, interfaces and project requirements.</p>
    </section>
  );
}
