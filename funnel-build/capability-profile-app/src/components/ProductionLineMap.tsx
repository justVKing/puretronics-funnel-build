import { productById, products } from '../data/catalog';
import { productionStages } from '../data/productionStages';
import { useExplorer } from '../state/ExplorerProvider';
import { track } from '../analytics/events';

const positions = [70, 180, 290, 400, 510, 620, 730, 840];

export function ProductionLineMap() {
  const { state, dispatch } = useExplorer();
  const toggleStage = (id: string) => {
    dispatch({ type: 'TOGGLE_FILTER', key: 'stages', value: id });
    track('stage_selected', { ids: [id] });
  };
  const countFor = (stage: string) => products.filter((product) => product.stages.includes(stage)).length;

  return (
    <div className="line-map-view">
      <div className="view-intro"><div><p className="proof-label">Production-Line Map</p><h3>View the Portfolio Across the Line</h3></div><p>Select one or more stages. Offline testing remains a connected but separate validation branch.</p></div>
      <div className="line-map-desktop">
        <svg viewBox="0 0 920 390" role="img" aria-labelledby="line-title line-desc">
          <title id="line-title">Interactive wire and cable production-stage map</title>
          <desc id="line-desc">Eight inline production stages run from conductor preparation through take-up, with separate branches for offline high-voltage and fire-resistance testing.</desc>
          <path d="M70 165H840" className="map-line" />
          <path d="M620 165V310H830" className="map-branch" />
          {productionStages.slice(0, 8).map((stage, index) => {
            const selected = state.filters.stages.includes(stage.id);
            return <g key={stage.id} className={`map-stage${selected ? ' is-selected' : ''}`} role="button" tabIndex={0} aria-pressed={selected} aria-label={`${stage.label}, ${countFor(stage.id)} relevant products`} transform={`translate(${positions[index]} 165)`} onClick={() => toggleStage(stage.id)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleStage(stage.id); } }}>
              <circle r="25" /><circle r="8" className="map-core" /><text y="55" textAnchor="middle">{stage.label.split(' ').map((part, i) => <tspan x="0" dy={i ? 14 : 0} key={part}>{part}</tspan>)}</text><text y="-42" textAnchor="middle" className="map-count">{countFor(stage.id)} products</text>
            </g>;
          })}
          {productionStages.slice(8).map((stage, index) => {
            const x = index === 0 ? 705 : 830;
            const selected = state.filters.stages.includes(stage.id);
            return <g key={stage.id} className={`map-offline${selected ? ' is-selected' : ''}`} role="button" tabIndex={0} aria-pressed={selected} transform={`translate(${x} 310)`} onClick={() => toggleStage(stage.id)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') toggleStage(stage.id); }}><rect x="-52" y="-23" width="104" height="46" rx="3" /><text textAnchor="middle" y="-2">{stage.label.split(' ').slice(0, 2).join(' ')}</text><text textAnchor="middle" y="12">{stage.label.split(' ').slice(2).join(' ')}</text></g>;
          })}
        </svg>
      </div>
      <ol className="line-map-mobile">
        {productionStages.map((stage, index) => <li key={stage.id}><button type="button" className={state.filters.stages.includes(stage.id) ? 'is-selected' : ''} aria-pressed={state.filters.stages.includes(stage.id)} onClick={() => toggleStage(stage.id)}><span className="stage-sequence">{String(index + 1).padStart(2, '0')}</span><span><strong>{stage.label}</strong><small>{stage.description}</small></span><b>{countFor(stage.id)}</b></button></li>)}
      </ol>
      {state.filters.stages.length > 0 && <div className="stage-results"><p><strong>{state.filters.stages.length}</strong> stages selected</p><div>{products.filter((product) => product.stages.some((stage) => state.filters.stages.includes(stage))).map((product) => <button type="button" key={product.id} onClick={() => dispatch({ type: 'OPEN_DRAWER', productId: product.id })}>{product.shortName}</button>)}</div></div>}
    </div>
  );
}
