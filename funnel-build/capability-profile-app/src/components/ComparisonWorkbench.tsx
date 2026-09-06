import { useEffect, useMemo, useState } from 'react';
import { familyById, productById } from '../data/catalog';
import { productionStages } from '../data/productionStages';
import { buildModelComparison, comparableProducts } from '../domain/comparison';
import { useExplorer } from '../state/ExplorerProvider';
import { track } from '../analytics/events';

export function ComparisonWorkbench() {
  const { state, dispatch } = useExplorer();
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const product = state.comparisonProductId ? productById.get(state.comparisonProductId) : undefined;
  const selectionLimit = isMobile ? 2 : 3;

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (!product || state.comparisonModelIds.length) return;
    product.models.slice(0, 2).forEach((model) => dispatch({ type: 'TOGGLE_COMPARISON_MODEL', modelId: model.id, limit: 3 }));
  }, [dispatch, product, state.comparisonModelIds.length]);

  const selectedModels = product?.models.filter((model) => state.comparisonModelIds.includes(model.id)) ?? [];
  const visibleModels = selectedModels.slice(0, selectionLimit);
  const visibleModelKey = visibleModels.map((model) => model.id).join('|');
  const sections = useMemo(() => product ? buildModelComparison(product, visibleModelKey.split('|').filter(Boolean)) : [], [product, visibleModelKey]);
  const visibleSections = sections.map((section) => ({ ...section, rows: state.comparisonShowDifferences ? section.rows.filter((row) => row.differs) : section.rows }));
  const visibleRowCount = visibleSections.reduce((total, section) => total + section.rows.length, 0);

  const chooseProduct = (productId: string) => {
    dispatch({ type: 'SET_COMPARISON_PRODUCT', productId: productId || null });
    track('comparison_viewed', { mode: 'models', ids: productId ? [productId] : [] });
  };

  return (
    <div className="comparison-view">
      <div className="view-intro"><div><p className="proof-label">Model Comparison</p><h3>Compare Approved Models Within One Primary Product</h3></div><p>Select the product here, choose two or three models, and review every populated technical specification held in Product Database V4 for those models. Parameters absent from V4 across the selected set are not shown.</p></div>

      <section className="comparison-setup" aria-labelledby="comparison-product-heading">
        <div className="comparison-step"><span>01</span><div><h4 id="comparison-product-heading">Choose a Primary Product</h4><p>Only products with two or more governed models are listed.</p></div></div>
        <label className="comparison-product-select"><span>Primary Product</span><select value={product?.id ?? ''} onChange={(event) => chooseProduct(event.target.value)}><option value="">Select a product to compare</option>{comparableProducts.map((item) => <option value={item.id} key={item.id}>{item.id} · {item.name} ({item.models.length} models)</option>)}</select></label>
      </section>

      {!product && <div className="empty-state"><span className="status-icon" aria-hidden="true">+</span><h3>Choose a Product to Begin</h3><p>The model selector and complete approved specification set will appear here. You do not need to visit the Navigator first.</p></div>}

      {product && <>
        <section className="comparison-context" aria-label="Selected product context"><div><p className="proof-label">{product.id} · {familyById.get(product.familyId)?.name}</p><h4>{product.name}</h4><p>{product.primaryFunction}</p></div><dl><div><dt>Where It Fits</dt><dd>{product.stages.map((id) => productionStages.find((stage) => stage.id === id)?.label ?? id).join(' · ')}</dd></div><div><dt>Selection Factors</dt><dd>{product.selectionFactors.join(' · ')}</dd></div></dl><button type="button" className="text-button" onClick={() => dispatch({ type: 'OPEN_DRAWER', productId: product.id })}>View Product Details</button></section>

        <section className="model-selector" aria-labelledby="model-selector-heading"><div className="comparison-step"><span>02</span><div><h4 id="model-selector-heading">Choose Models</h4><p>Select up to {selectionLimit} models on this screen. The technical table updates immediately.</p></div></div><div className="model-choice-grid">{product.models.map((model) => { const checked = state.comparisonModelIds.includes(model.id); const disabled = !checked && state.comparisonModelIds.length >= selectionLimit; return <label className={checked ? 'is-selected' : ''} key={model.id}><input type="checkbox" checked={checked} disabled={disabled} onChange={() => dispatch({ type: 'TOGGLE_COMPARISON_MODEL', modelId: model.id, limit: selectionLimit })} /><span>{model.id}</span><strong>{model.name}</strong><small>{model.specs.map((spec) => `${spec.label}: ${spec.display}`).slice(0, 2).join(' · ')}</small></label>; })}</div><p className="selection-note" aria-live="polite">{state.comparisonModelIds.length} model{state.comparisonModelIds.length === 1 ? '' : 's'} selected{isMobile && state.comparisonModelIds.length > 2 ? '; the first two are shown on mobile' : ''}.</p></section>

        {visibleModels.length > 0 && <section className="comparison-output" aria-labelledby="comparison-output-heading"><div className="comparison-output-header"><div className="comparison-step"><span>03</span><div><h4 id="comparison-output-heading">Review All Approved Specifications</h4><p>{visibleRowCount} parameter{visibleRowCount === 1 ? '' : 's'} shown across {visibleModels.length} selected model{visibleModels.length === 1 ? '' : 's'}.</p></div></div><label className="check-control"><input type="checkbox" checked={state.comparisonShowDifferences} onChange={(event) => dispatch({ type: 'SET_COMPARISON_DIFFERENCES', show: event.target.checked })} /><span>Show Differences Only</span></label></div>
          {visibleRowCount ? <><div className="comparison-table-wrap"><table className="comparison-table"><caption>{product.name}: Complete Approved V4 Model Specification Comparison</caption><thead><tr><th scope="col">Technical Parameter</th>{visibleModels.map((model) => <th scope="col" key={model.id}>{model.name}<small>{model.id}</small></th>)}</tr></thead>{visibleSections.map((section) => section.rows.length > 0 && <tbody key={section.id}><tr className="comparison-section-row"><th scope="rowgroup" colSpan={visibleModels.length + 1}>{section.label}</th></tr>{section.rows.map((row) => <tr key={row.key}><th scope="row">{row.label}</th>{visibleModels.map((model) => <td key={model.id}><strong>{row.values[model.id]}</strong>{row.sourceRecords[model.id] && <small>Source: {row.sourceRecords[model.id]}</small>} {!row.sourceRecords[model.id] && <span className="sr-only">No V4 value is recorded for this model.</span>}</td>)}</tr>)}</tbody>)}</table></div><div className="comparison-mobile-table" aria-label={`${product.name} mobile model comparison`}>{visibleSections.map((section) => section.rows.length > 0 && <section key={section.id}><h5>{section.label}</h5>{section.rows.map((row) => <article key={row.key}><h6>{row.label}</h6><dl>{visibleModels.map((model) => <div key={model.id}><dt>{model.name}<small>{model.id}</small></dt><dd>{row.values[model.id]}{row.sourceRecords[model.id] && <small>Source: {row.sourceRecords[model.id]}</small>} {!row.sourceRecords[model.id] && <span className="sr-only">No V4 value is recorded for this model.</span>}</dd></div>)}</dl></article>)}</section>)}</div></> : <div className="empty-state compact"><h4>No Differing Parameters in the Selected Set</h4><p>Turn off “Show Differences Only” to review the complete V4 specification table.</p></div>}
          <p className="comparison-disclaimer">This table displays every technical parameter populated in Product Database V4 for at least one selected model. Parameters absent from V4 across the selected set are omitted. An em dash means V4 contains no value for that specific model; no values are inferred. Final selection still requires application review.</p>
        </section>}

        {visibleModels.length === 0 && <div className="empty-state compact"><h3>Select at Least One Model</h3><p>Choose models above to populate the technical specification table.</p></div>}

        <div className="comparison-footer"><button type="button" className="text-button" onClick={() => dispatch({ type: 'CLEAR_COMPARISON' })}>Clear model comparison</button><a className="button" href="#prepare" onClick={() => { if (!state.selectedProducts.includes(product.id)) dispatch({ type: 'TOGGLE_SELECTED', productId: product.id }); }}>Prepare a review for {product.shortName}</a></div>
      </>}
    </div>
  );
}
