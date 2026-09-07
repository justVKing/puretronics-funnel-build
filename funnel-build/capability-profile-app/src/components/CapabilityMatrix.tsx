import { useMemo, useState } from 'react';
import { families, familyById, productById, products } from '../data/catalog';
import { productionStages, projectOptions, requirementDefinitions } from '../data/productionStages';
import { matchProducts } from '../domain/matching';
import { useExplorer } from '../state/ExplorerProvider';

export function CapabilityMatrix() {
  const { state, dispatch } = useExplorer();
  const [requirementQuery, setRequirementQuery] = useState('');
  const selectedProblemIds = state.filters.problems.filter((id) => !['multiple-issues', 'not-sure'].includes(id));
  const rows = useMemo(() => requirementDefinitions.map((requirement) => {
    if (selectedProblemIds.length && !requirement.problemIds.some((id) => selectedProblemIds.includes(id))) return null;
    const query = requirementQuery.trim().toLowerCase();
    const labelMatch = Boolean(query && requirement.label.toLowerCase().includes(query));
    const eligible = matchProducts({ ...state.filters, problems: [], query: labelMatch ? '' : requirementQuery });
    const eligibleIds = new Set(eligible.map((result) => result.productId));
    const matches = requirement.productIds.map((id) => productById.get(id)).filter((product) => product && eligibleIds.has(product.id));
    if (!matches.length) return null;
    return { ...requirement, matches, families: [...new Set(matches.map((product) => product!.familyId))], inputs: [...new Set(matches.flatMap((product) => product!.selectionFactors))] };
  }).filter(Boolean), [requirementQuery, selectedProblemIds.join('|'), state.filters.families.join('|'), state.filters.routes.join('|'), state.filters.stages.join('|')]);
  const distinctProducts = new Set(rows.flatMap((row) => row?.matches.map((product) => product!.id) ?? []));
  const distinctFamilies = new Set(rows.flatMap((row) => row?.families ?? []));
  const setSingle = (key: 'routes' | 'families' | 'stages', value: string) => dispatch({ type: 'SET_FILTER_VALUES', key, values: value ? [value] : [] });
  const clearAll = () => { setRequirementQuery(''); dispatch({ type: 'CLEAR_FILTERS' }); dispatch({ type: 'SET_VIEW', view: 'matrix' }); };
  const activeChips = [
    ...state.filters.families.map((id) => ({ key: 'families' as const, id, label: familyById.get(id)?.name ?? id })),
    ...state.filters.stages.map((id) => ({ key: 'stages' as const, id, label: productionStages.find((stage) => stage.id === id)?.label ?? id })),
    ...state.filters.routes.map((id) => ({ key: 'routes' as const, id, label: projectOptions.find(([key]) => key === id)?.[1] ?? id })),
  ];
  const architectureSummary = (product: typeof products[number]) => {
    const skuCount = product.models.flatMap((model) => model.children ?? []).length;
    if (skuCount) return `${product.models.length} Approved Series · ${skuCount} Capacity SKUs`;
    if (!product.models.length) return product.availability;
    return `${product.models.length} Approved Model${product.models.length === 1 ? '' : 's'} / Variant${product.models.length === 1 ? '' : 's'}`;
  };

  return <div className="matrix-view">
    <div className="view-intro"><div><p className="proof-label">Capability Coverage Index</p><h3>Move From a Requirement to the Relevant Capability Path</h3></div><p>Each row is a buyer requirement. Counts distinguish requirement paths from the Primary Products represented across those paths.</p></div>
    <div className="matrix-toolbar coverage-toolbar">
      <label><span>Find a Requirement or Product</span><input type="search" value={requirementQuery} onChange={(event) => setRequirementQuery(event.target.value)} placeholder="e.g. tension, spark, LASER" /></label>
      <label><span>Product Family</span><select value={state.filters.families.length === 1 ? state.filters.families[0] : ''} onChange={(event) => setSingle('families', event.target.value)}><option value="">All Five Product Families</option>{families.map((family) => <option value={family.id} key={family.id}>{family.name}</option>)}</select></label>
      <label><span>Where It Fits</span><select value={state.filters.stages.length === 1 ? state.filters.stages[0] : ''} onChange={(event) => setSingle('stages', event.target.value)}><option value="">All Line and Test Stages</option>{productionStages.map((stage) => <option value={stage.id} key={stage.id}>{stage.label}</option>)}</select></label>
      <label><span>Project Context</span><select value={state.filters.routes.length === 1 ? state.filters.routes[0] : ''} onChange={(event) => setSingle('routes', event.target.value)}><option value="">All Project Routes</option>{projectOptions.map(([id, label]) => <option value={id} key={id}>{label}</option>)}</select></label>
    </div>
    {(activeChips.length > 0 || requirementQuery) && <div className="active-filter-bar" aria-label="Active Filters"><strong>Active Filters</strong>{requirementQuery && <button type="button" onClick={() => setRequirementQuery('')}>Search: {requirementQuery} ×</button>}{activeChips.map((chip) => <button type="button" key={`${chip.key}-${chip.id}`} onClick={() => dispatch({ type: 'TOGGLE_FILTER', key: chip.key, value: chip.id })}>{chip.label} ×</button>)}<button type="button" className="text-button" onClick={clearAll}>Clear All</button></div>}
    <div className="coverage-metrics" aria-live="polite"><span><strong>{rows.length}</strong> Requirement Paths</span><span><strong>{distinctProducts.size}</strong> Distinct Primary Products</span><span><strong>{distinctFamilies.size}</strong> Product Families</span></div>
    {rows.length ? <><div className="matrix-table-wrap" tabIndex={0} aria-label="Scrollable Capability Coverage Index"><table className="capability-table coverage-table"><caption>Puretronics Wire and Cable Capability Coverage by Requirement</caption><thead><tr><th scope="col">Requirement</th><th scope="col">Relevant Family</th><th scope="col">Applicable Primary Products</th><th scope="col">Where It Fits</th><th scope="col">What to Define</th></tr></thead><tbody>{rows.map((row) => row && <tr key={row.id}><th scope="row">{row.label}</th><td>{row.families.map((id) => <span className="coverage-family" key={id}><b>{id}</b>{familyById.get(id)?.name}</span>)}</td><td><div className="coverage-products">{row.matches.map((product) => product && <button type="button" key={product.id} onClick={() => dispatch({ type: 'OPEN_DRAWER', productId: product.id })}><span>{product.id}</span><strong>{product.shortName}</strong><small>{architectureSummary(product)}</small></button>)}</div></td><td><ul className="coverage-tags">{[...new Set(row.matches.flatMap((product) => product?.record?.primaryManufacturingStage ? [product.record.primaryManufacturingStage] : []))].map((stage) => <li key={stage}>{stage.replace(/^\d+\s*/, '')}</li>)}</ul></td><td><ul className="coverage-inputs">{row.inputs.map((input) => <li key={input}>{input}</li>)}</ul></td></tr>)}</tbody></table></div>
      <div className="matrix-mobile coverage-mobile">{rows.map((row) => row && <article key={row.id}><p className="proof-label">Requirement</p><h4>{row.label}</h4><div className="coverage-mobile-block"><span>Applicable Primary Products</span><div className="coverage-products">{row.matches.map((product) => product && <button type="button" key={product.id} onClick={() => dispatch({ type: 'OPEN_DRAWER', productId: product.id })}><span>{product.id}</span><strong>{product.shortName}</strong><small>{architectureSummary(product)}</small></button>)}</div></div></article>)}</div></> : <div className="empty-state"><span className="status-icon" aria-hidden="true">0</span><h3>No Capability Path Matches These Filters</h3><p>Clear the filters to return to the complete Wire and Cable capability coverage.</p><button type="button" className="button button-secondary" onClick={clearAll}>Clear Filters</button></div>}
  </div>;
}
