import { useMemo, useState } from 'react';
import { families, familyById, products } from '../data/catalog';
import { problemOptions, productionStages, projectOptions } from '../data/productionStages';
import { useExplorer } from '../state/ExplorerProvider';

export function CapabilityMatrix() {
  const { state, dispatch } = useExplorer();
  const [requirementQuery, setRequirementQuery] = useState('');
  const activeProblems = state.filters.problems.length ? problemOptions.filter(([id]) => state.filters.problems.includes(id)) : problemOptions;
  const rows = useMemo(() => activeProblems.map(([problemId, label]) => {
    const matches = products.filter((product) => product.buyerProblems.includes(problemId)
      && (!state.filters.routes.length || product.projectRoutes.some((route) => state.filters.routes.includes(route)))
      && (!state.filters.families.length || state.filters.families.includes(product.familyId))
      && (!state.filters.stages.length || product.stages.some((stage) => state.filters.stages.includes(stage))));
    const search = requirementQuery.trim().toLocaleLowerCase();
    const searchable = [label, ...matches.flatMap((product) => [product.name, product.shortName, familyById.get(product.familyId)?.name ?? ''])].join(' ').toLocaleLowerCase();
    if (!matches.length || (search && !searchable.includes(search))) return null;
    return {
      problemId,
      label,
      matches,
      families: [...new Set(matches.map((product) => product.familyId))],
      stages: [...new Set(matches.flatMap((product) => product.stages))],
      inputs: [...new Set(matches.flatMap((product) => product.selectionFactors))],
    };
  }).filter(Boolean), [activeProblems, requirementQuery, state.filters.families, state.filters.routes, state.filters.stages]);

  const replaceSingleFilter = (key: 'routes' | 'families' | 'stages', value: string) => {
    const current = state.filters[key][0];
    if (current) dispatch({ type: 'TOGGLE_FILTER', key, value: current });
    if (value) dispatch({ type: 'TOGGLE_FILTER', key, value });
  };

  return (
    <div className="matrix-view">
      <div className="view-intro"><div><p className="proof-label">Capability Coverage Index</p><h3>Move from a requirement to the relevant capability path</h3></div><p>Every row is a valid portfolio relationship. Use it to see the applicable family, products, line position and information needed for a useful review.</p></div>
      <div className="matrix-toolbar coverage-toolbar">
        <label><span>Find a requirement or product</span><input type="search" value={requirementQuery} onChange={(event) => setRequirementQuery(event.target.value)} placeholder="e.g. tension, spark, LASER" /></label>
        <label><span>Product Family</span><select value={state.filters.families[0] ?? ''} onChange={(event) => replaceSingleFilter('families', event.target.value)}><option value="">All five families</option>{families.map((family) => <option value={family.id} key={family.id}>{family.name}</option>)}</select></label>
        <label><span>Where it fits</span><select value={state.filters.stages[0] ?? ''} onChange={(event) => replaceSingleFilter('stages', event.target.value)}><option value="">All line and test stages</option>{productionStages.map((stage) => <option value={stage.id} key={stage.id}>{stage.label}</option>)}</select></label>
        <label><span>Project context</span><select value={state.filters.routes[0] ?? ''} onChange={(event) => replaceSingleFilter('routes', event.target.value)}><option value="">All project routes</option>{projectOptions.map(([id, label]) => <option value={id} key={id}>{label}</option>)}</select></label>
      </div>
      <p className="coverage-count" aria-live="polite"><strong>{rows.length}</strong> governed requirement path{rows.length === 1 ? '' : 's'} shown</p>
      {rows.length > 0 ? <div className="matrix-table-wrap" tabIndex={0} aria-label="Scrollable capability coverage index">
        <table className="capability-table coverage-table"><caption>Puretronics Wire and Cable capability coverage by requirement</caption><thead><tr><th scope="col">Requirement</th><th scope="col">Relevant family</th><th scope="col">Applicable Primary Products</th><th scope="col">Where it fits</th><th scope="col">What to define</th></tr></thead><tbody>
          {rows.map((row) => row && <tr key={row.problemId}><th scope="row">{row.label}</th><td>{row.families.map((id) => <span className="coverage-family" key={id}><b>{id}</b>{familyById.get(id)?.name}</span>)}</td><td><div className="coverage-products">{row.matches.map((product) => <button type="button" key={product.id} onClick={() => dispatch({ type: 'OPEN_DRAWER', productId: product.id })}><span>{product.id}</span><strong>{product.shortName}</strong><small>{product.models.length ? `${product.models.length} approved models` : product.availability}</small></button>)}</div></td><td><ul className="coverage-tags">{row.stages.map((id) => <li key={id}>{productionStages.find((stage) => stage.id === id)?.label ?? id}</li>)}</ul></td><td><ul className="coverage-inputs">{row.inputs.map((input) => <li key={input}>{input}</li>)}</ul></td></tr>)}
        </tbody></table>
      </div> : <div className="empty-state"><span className="status-icon" aria-hidden="true">0</span><h3>No governed path matches these filters</h3><p>Clear the filters to return to the complete Wire and Cable capability coverage.</p><button type="button" className="button button-secondary" onClick={() => { setRequirementQuery(''); dispatch({ type: 'CLEAR_FILTERS' }); }}>Clear filters</button></div>}
      <div className="matrix-mobile coverage-mobile">
        {rows.map((row) => row && <article key={row.problemId}><p className="proof-label">Requirement</p><h4>{row.label}</h4><div className="coverage-mobile-block"><span>Relevant family</span>{row.families.map((id) => <strong key={id}>{familyById.get(id)?.name}</strong>)}</div><div className="coverage-mobile-block"><span>Applicable Primary Products</span><div className="coverage-products">{row.matches.map((product) => <button type="button" key={product.id} onClick={() => dispatch({ type: 'OPEN_DRAWER', productId: product.id })}><span>{product.id}</span><strong>{product.shortName}</strong><small>{product.models.length ? `${product.models.length} approved models` : product.availability}</small></button>)}</div></div><div className="coverage-mobile-block"><span>Where it fits</span><ul className="coverage-tags">{row.stages.map((id) => <li key={id}>{productionStages.find((stage) => stage.id === id)?.label ?? id}</li>)}</ul></div><div className="coverage-mobile-block"><span>What to define</span><ul className="coverage-inputs">{row.inputs.map((input) => <li key={input}>{input}</li>)}</ul></div></article>)}
      </div>
    </div>
  );
}
