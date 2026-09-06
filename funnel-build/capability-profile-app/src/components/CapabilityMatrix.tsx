import { useState } from 'react';
import { families, products } from '../data/catalog';
import { problemOptions } from '../data/productionStages';
import { useExplorer } from '../state/ExplorerProvider';

export function CapabilityMatrix() {
  const { state, dispatch } = useExplorer();
  const [showVariants, setShowVariants] = useState(false);
  const activeProblems = state.filters.problems.length ? problemOptions.filter(([id]) => state.filters.problems.includes(id)) : problemOptions;

  return (
    <div className="matrix-view">
      <div className="view-intro"><div><p className="proof-label">Capability Matrix</p><h3>Scan the portfolio by buyer need</h3></div><p>Valid cells appear only where governed product relationships exist. Blank cells remain intentionally blank.</p></div>
      <div className="matrix-toolbar">
        <label><span>Project context</span><select value={state.filters.routes[0] ?? ''} onChange={(event) => { if (state.filters.routes[0]) dispatch({ type: 'TOGGLE_FILTER', key: 'routes', value: state.filters.routes[0] }); if (event.target.value) dispatch({ type: 'TOGGLE_FILTER', key: 'routes', value: event.target.value }); }}><option value="">All project routes</option><option value="new-line">New line</option><option value="retrofit">Retrofit</option><option value="replacement">Replacement</option><option value="laboratory">Laboratory</option><option value="oem">OEM / machine build</option></select></label>
        <label className="check-control"><input type="checkbox" checked={showVariants} onChange={(event) => setShowVariants(event.target.checked)} /><span>Show approved variants</span></label>
      </div>
      <div className="matrix-table-wrap" tabIndex={0} aria-label="Scrollable capability matrix">
        <table className="capability-table"><caption>Puretronics capabilities by governed buyer need and Product Family</caption><thead><tr><th scope="col">Buyer need</th>{families.map((family) => <th scope="col" key={family.id}>{family.name}</th>)}</tr></thead><tbody>
          {activeProblems.map(([problemId, label]) => <tr key={problemId}><th scope="row">{label}</th>{families.map((family) => { const matches = products.filter((product) => product.familyId === family.id && product.buyerProblems.includes(problemId) && (!state.filters.routes.length || product.projectRoutes.some((route) => state.filters.routes.includes(route)))); return <td key={family.id}>{matches.length ? <button type="button" className="matrix-cell" onClick={() => dispatch({ type: 'OPEN_DRAWER', productId: matches[0].id })}><strong>{matches.length}</strong><span>{matches.map((product) => product.systemRole).join(' · ')}</span>{showVariants && <small>{matches.reduce((sum, product) => sum + product.models.length, 0)} approved variants</small>}</button> : <span className="matrix-empty" aria-label="Not applicable">—</span>}</td>; })}</tr>)}
        </tbody></table>
      </div>
      <div className="matrix-mobile">
        {activeProblems.map(([problemId, label]) => { const matches = products.filter((product) => product.buyerProblems.includes(problemId)); return <section key={problemId}><h4>{label}</h4>{matches.length ? matches.map((product) => <button type="button" key={product.id} onClick={() => dispatch({ type: 'OPEN_DRAWER', productId: product.id })}><span>{product.id}</span><strong>{product.shortName}</strong><small>{product.systemRole}</small></button>) : <p>No published match.</p>}</section>; })}
      </div>
    </div>
  );
}
