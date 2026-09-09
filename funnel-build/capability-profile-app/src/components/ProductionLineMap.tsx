import { useState } from 'react';
import { familyById, productById } from '../data/catalog';
import { productionStages } from '../data/productionStages';
import { relationshipsForStage } from '../data/capabilityRelationships';
import { useExplorer } from '../state/ExplorerProvider';
import { track } from '../analytics/events';
import { AccessibleDialog } from './AccessibleDialog';

const positions = [48, 150, 252, 354, 456, 558, 660, 762, 864];
const roleLabels = { primary: 'Main Application Stage', adjacent: 'May Support This Stage', supporting: 'Supporting Role', 'downstream-response': 'May Support Downstream Fault Response' } as const;

export function ProductionLineMap() {
  const { state, dispatch } = useExplorer();
  const [openStageId, setOpenStageId] = useState<string | null>(null);
  const inlineStages = productionStages.filter((stage) => stage.kind === 'inline');
  const offlineStages = productionStages.filter((stage) => stage.kind !== 'inline');
  const toggleStage = (id: string) => { dispatch({ type: 'TOGGLE_FILTER', key: 'stages', value: id }); track('stage_selected', { ids: [id] }); };
  const openStage = (id: string) => { if (!state.filters.stages.includes(id)) toggleStage(id); setOpenStageId(id); };
  const stage = productionStages.find((item) => item.id === openStageId);
  const stageRelationships = openStageId ? relationshipsForStage(openStageId) : [];
  const countsFor = (id: string) => {
    const relationships = relationshipsForStage(id);
    return {
      primary: new Set(relationships.filter((relationship) => relationship.relationshipType === 'primary').map((relationship) => relationship.productId)).size,
      contextual: new Set(relationships.filter((relationship) => relationship.relationshipType !== 'primary').map((relationship) => relationship.productId)).size,
      total: new Set(relationships.map((relationship) => relationship.productId)).size,
    };
  };
  const countLabel = (id: string) => {
    const counts = countsFor(id);
    if (!counts.total) return 'Process Context';
    if (!counts.contextual) return `${counts.primary} Primary`;
    if (!counts.primary) return `${counts.contextual} Contextual`;
    return `${counts.primary} Primary · ${counts.contextual} Contextual`;
  };

  const stageButton = (item: typeof productionStages[number], index?: number) => <button type="button" className={state.filters.stages.includes(item.id) ? 'is-selected' : ''} aria-pressed={state.filters.stages.includes(item.id)} onClick={() => openStage(item.id)}><span className="stage-sequence">{index === undefined ? 'LAB' : String(index + 1).padStart(2, '0')}</span><span><strong>{item.label}</strong><small>{item.description}</small></span><b>{countLabel(item.id)}</b></button>;

  return <div className="line-map-view">
    <div className="view-intro"><div><p className="proof-label">Production-Line Orientation Map</p><h3>See Where Each Capability Can Fit</h3></div><p>Use this map to identify possible equipment locations. Supporting applications depend on your line arrangement; a placement does not mean that the equipment is required at every stage.</p></div>
    <div className="map-relationship-key" aria-label="Relationship Key"><span><i className="key-primary" />Main Application Stage</span><span><i className="key-context" />Possible Supporting Application</span><span><i className="key-lab" />Separate Offline / Laboratory Path</span></div>
    <div className="line-map-desktop"><svg viewBox="0 0 920 430" role="group" aria-labelledby="line-title" aria-describedby="line-desc"><title id="line-title">Interactive Wire and Cable Production-Stage Map</title><desc id="line-desc">Nine inline orientation stages run from pay-off through take-up. Offline high-voltage and fire-resistance testing are two separate laboratory paths and are not downstream production stages.</desc><path d="M48 165H864" className="map-line" />{inlineStages.map((item, index) => { const selected = state.filters.stages.includes(item.id); return <g key={item.id} className={`map-stage${selected ? ' is-selected' : ''}`} role="button" tabIndex={0} aria-pressed={selected} aria-label={`${item.label}, ${countLabel(item.id)}`} transform={`translate(${positions[index]} 165)`} onClick={() => openStage(item.id)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openStage(item.id); } }}><circle r="23" /><circle r="7" className="map-core" /><text y="48" textAnchor="middle">{item.label.split(' ').reduce<string[]>((lines, word) => { const last = lines.at(-1) ?? ''; if (`${last} ${word}`.trim().length <= 13) lines[lines.length - 1] = `${last} ${word}`.trim(); else lines.push(word); return lines; }, ['']).map((line, i) => <tspan x="0" dy={i ? 12 : 0} key={line}>{line}</tspan>)}</text><text y="-38" textAnchor="middle" className="map-count">{countsFor(item.id).total ? `${countsFor(item.id).total} Relevant` : 'Context'}</text></g>; })}<g className="map-laboratory-label"><text x="460" y="300" textAnchor="middle">SEPARATE OFFLINE / LABORATORY REVIEW PATHS</text><path d="M300 315H620" /></g>{offlineStages.map((item, index) => { const x = index ? 610 : 310; const selected = state.filters.stages.includes(item.id); return <g key={item.id} className={`map-offline${selected ? ' is-selected' : ''}`} role="button" tabIndex={0} aria-pressed={selected} aria-label={`${item.label}, independent laboratory path, ${countLabel(item.id)}`} transform={`translate(${x} 365)`} onClick={() => openStage(item.id)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openStage(item.id); } }}><rect x="-128" y="-31" width="256" height="62" rx="3" /><text textAnchor="middle" y="-5">{item.label}</text><text textAnchor="middle" y="14" className="map-count">{countLabel(item.id)}</text></g>; })}</svg></div>
    <div className="line-map-mobile"><section aria-labelledby="inline-stage-heading"><h4 id="inline-stage-heading">Inline Production Sequence</h4><ol>{inlineStages.map((item, index) => <li key={item.id}>{stageButton(item, index)}</li>)}</ol></section><section className="offline-stage-list" aria-labelledby="offline-stage-heading"><p className="proof-label">Independent Paths</p><h4 id="offline-stage-heading">Separate Offline / Laboratory Testing</h4><p>Review these independent laboratory requirements separately from the production sequence.</p><ul>{offlineStages.map((item) => <li key={item.id}>{stageButton(item)}</li>)}</ul></section></div>
    {state.filters.stages.length > 0 && <div className="stage-results"><p><strong>{state.filters.stages.length}</strong> Stages Selected</p><div>{state.filters.stages.map((id) => <button type="button" key={id} onClick={() => setOpenStageId(id)}>{productionStages.find((item) => item.id === id)?.label}</button>)}</div><button type="button" className="text-button" onClick={() => dispatch({ type: 'SET_FILTER_VALUES', key: 'stages', values: [] })}>Clear Stages</button></div>}
    <AccessibleDialog open={Boolean(stage)} title={stage?.label ?? 'Stage Details'} onClose={() => setOpenStageId(null)} className="stage-dialog"><div className="stage-drawer-content"><p>{stage?.description}</p>{stageRelationships.length ? <div className="stage-capabilities">{stageRelationships.map((relationship) => { const product = productById.get(relationship.productId)!; return <article key={`${relationship.productId}-${relationship.relationshipType}`}><p className="family-label">{familyById.get(relationship.familyId)?.name}</p><h3>{product.shortName}</h3><span className={`relationship-badge relationship-${relationship.relationshipType}`}>{roleLabels[relationship.relationshipType]}</span><p>{relationship.explanation}</p><small>System Role: {relationship.systemRole}</small><button type="button" className="text-button" onClick={() => { setOpenStageId(null); requestAnimationFrame(() => dispatch({ type: 'OPEN_DRAWER', productId: product.id })); }}>View Product Details →</button></article>; })}</div> : <div className="guidance-note"><strong>Process Context</strong><p>Review the adjoining stages to identify equipment relevant to this part of your line.</p></div>}<div className="inline-actions"><button type="button" className="button" onClick={() => { if (stage) dispatch({ type: 'ADD_REVIEW_STAGE', stageId: stage.id }); setOpenStageId(null); document.querySelector('#prepare')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }}>Add Stage to Application Review</button><button type="button" className="button button-secondary" onClick={() => setOpenStageId(null)}>Close</button></div></div></AccessibleDialog>
  </div>;
}
