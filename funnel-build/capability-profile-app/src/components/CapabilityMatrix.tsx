import { useMemo } from 'react';
import { families, familyById, productById, products } from '../data/catalog';
import { capabilityRelationships } from '../data/capabilityRelationships';
import { productionStages, projectOptions, requirementDefinitions } from '../data/productionStages';
import { matchProducts } from '../domain/matching';
import { useExplorer } from '../state/ExplorerProvider';

const relationshipLabels = {
  primary: 'Main Application Stage', adjacent: 'May Support This Stage', supporting: 'Supporting Role', 'downstream-response': 'May Support Downstream Fault Response',
} as const;

export function CapabilityMatrix() {
  const { state, dispatch } = useExplorer();
  const requirementQuery = state.filters.query;
  const setRequirementQuery = (query: string) => dispatch({ type: 'SET_QUERY', query });
  const selectedProblemIds = state.filters.problems.filter((id) => !['multiple-issues', 'not-sure'].includes(id));
  const rows = useMemo(() => requirementDefinitions.map((requirement) => {
    if (selectedProblemIds.length && !requirement.problemIds.some((id) => selectedProblemIds.includes(id))) return null;
    const eligibleIds = new Set(matchProducts(state.filters).map((result) => result.productId));
    const matches = requirement.productIds.map((id) => productById.get(id)).filter((product) => product && eligibleIds.has(product.id));
    if (!matches.length) return null;
    return { ...requirement, matches, families: [...new Set(matches.map((product) => product!.familyId))], inputs: [...new Set(matches.flatMap((product) => product!.selectionFactors))] };
  }).filter(Boolean), [state.filters]);
  const distinctProducts = new Set(rows.flatMap((row) => row?.matches.map((product) => product!.id) ?? []));
  const distinctFamilies = new Set(rows.flatMap((row) => row?.families ?? []));
  const setSingle = (key: 'routes' | 'families' | 'stages', value: string) => dispatch({ type: 'SET_FILTER_VALUES', key, values: value && value !== '__multiple' ? [value] : [] });
  const clearAll = () => { setRequirementQuery(''); dispatch({ type: 'CLEAR_FILTERS' }); dispatch({ type: 'SET_VIEW', view: 'matrix' }); };
  const selectValue = (values: string[]) => values.length === 0 ? '' : values.length === 1 ? values[0] : '__multiple';
  const architectureSummary = (product: typeof products[number]) => {
    const skuCount = product.models.flatMap((model) => model.children ?? []).length;
    if (skuCount) return `${product.models.length} Series · ${skuCount} Capacity Options`;
    if (!product.models.length) return product.availability;
    return `${product.models.length} Model${product.models.length === 1 ? '' : 's'} / Variant${product.models.length === 1 ? '' : 's'}`;
  };
  const placementLabels = (product: typeof products[number]) => {
    if (!state.filters.stages.length) return product.record?.primaryManufacturingStage ? [product.record.primaryManufacturingStage.replace(/^\d+\s*/, '')] : [];
    return capabilityRelationships.filter((relationship) => relationship.productId === product.id && state.filters.stages.includes(relationship.orientationStageId)).map((relationship) => `${productionStages.find((stage) => stage.id === relationship.orientationStageId)?.label ?? relationship.orientationStageId} — ${relationshipLabels[relationship.relationshipType]}`);
  };

  return <div className="matrix-view">
    <div className="view-intro"><div><p className="proof-label">Capability Coverage Index</p><h3>Move From a Requirement to the Relevant Capability Path</h3></div><p>Each row connects a requirement with relevant products. Stage relationships describe possible applications and do not mean that every product is required on your line.</p></div>
    <div className="matrix-toolbar coverage-toolbar">
      <label><span>Find a Requirement or Product</span><input type="search" value={requirementQuery} onChange={(event) => setRequirementQuery(event.target.value)} placeholder="e.g. tension, spark, LASER" /></label>
      <label><span>Product Family</span><select value={selectValue(state.filters.families)} onChange={(event) => setSingle('families', event.target.value)}>{state.filters.families.length > 1 && <option value="__multiple" disabled>{state.filters.families.length} Product Families Selected</option>}<option value="">All Five Product Families</option>{families.map((family) => <option value={family.id} key={family.id}>{family.name}</option>)}</select></label>
      <label><span>Where It Fits</span><select value={selectValue(state.filters.stages)} onChange={(event) => setSingle('stages', event.target.value)}>{state.filters.stages.length > 1 && <option value="__multiple" disabled>{state.filters.stages.length} Line and Test Stages Selected</option>}<option value="">All Line and Test Stages</option>{productionStages.map((stage) => <option value={stage.id} key={stage.id}>{stage.label}</option>)}</select></label>
      <label><span>Project Context</span><select value={selectValue(state.filters.routes)} onChange={(event) => setSingle('routes', event.target.value)}>{state.filters.routes.length > 1 && <option value="__multiple" disabled>{state.filters.routes.length} Project Routes Selected</option>}<option value="">All Project Routes</option>{projectOptions.map(([id, label]) => <option value={id} key={id}>{label}</option>)}</select></label>
    </div>
    <div className="coverage-metrics" aria-live="polite"><span><strong>{rows.length}</strong> Requirement Paths</span><span><strong>{distinctProducts.size}</strong> Products</span><span><strong>{distinctFamilies.size}</strong> Product Families</span></div>
    {rows.length ? <>
      <div className="matrix-table-wrap" tabIndex={0} aria-label="Scrollable Capability Coverage Index"><table className="capability-table coverage-table"><caption>Puretronics Wire and Cable Capability Coverage by Requirement</caption><thead><tr><th scope="col">Requirement</th><th scope="col">Relevant Family</th><th scope="col">Applicable Products</th><th scope="col">Where It Fits</th><th scope="col">What to Define</th></tr></thead><tbody>{rows.map((row) => row && <tr key={row.id}><th scope="row">{row.label}</th><td>{row.families.map((id) => <span className="coverage-family" key={id}>{familyById.get(id)?.name}</span>)}</td><td><div className="coverage-products">{row.matches.map((product) => product && <button type="button" key={product.id} onClick={() => dispatch({ type: 'OPEN_DRAWER', productId: product.id })}><strong>{product.shortName}</strong><small>{architectureSummary(product)}</small></button>)}</div></td><td><ul className="coverage-tags">{[...new Set(row.matches.flatMap((product) => product ? placementLabels(product) : []))].map((stage) => <li key={stage}>{stage}</li>)}</ul></td><td><ul className="coverage-inputs">{row.inputs.map((input) => <li key={input}>{input}</li>)}</ul></td></tr>)}</tbody></table></div>
      <div className="matrix-mobile coverage-mobile">{rows.map((row) => row && <article key={row.id}><p className="proof-label">Requirement</p><h4>{row.label}</h4><div className="coverage-mobile-block"><span>Applicable Products</span><div className="coverage-products">{row.matches.map((product) => product && <button type="button" key={product.id} onClick={() => dispatch({ type: 'OPEN_DRAWER', productId: product.id })}><strong>{product.shortName}</strong><small>{architectureSummary(product)}</small></button>)}</div></div><div className="coverage-mobile-block"><span>Where It Fits</span><ul className="coverage-tags">{[...new Set(row.matches.flatMap((product) => product ? placementLabels(product) : []))].map((stage) => <li key={stage}>{stage}</li>)}</ul></div></article>)}</div>
    </> : <div className="empty-state"><span className="status-icon" aria-hidden="true">0</span><h3>No Capability Path Matches These Filters</h3><p>Clear the filters to return to the complete Wire and Cable capability coverage.</p><button type="button" className="button button-secondary" onClick={clearAll}>Clear Filters</button></div>}
  </div>;
}
