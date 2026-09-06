import { useEffect } from 'react';
import { useExplorer } from '../state/ExplorerProvider';
import type { ExplorerView } from '../types/explorer';
import { SolutionNavigator } from './SolutionNavigator';
import { ProductionLineMap } from './ProductionLineMap';
import { CapabilityMatrix } from './CapabilityMatrix';
import { ComparisonWorkbench } from './ComparisonWorkbench';
import { ResultsPanel } from './ResultsPanel';
import { ProductDrawer } from './ProductDrawer';
import { SelectionTray } from './SelectionTray';
import { track } from '../analytics/events';

const views: Array<{ id: ExplorerView; label: string; number: string }> = [
  { id: 'navigator', label: 'Solution Navigator', number: '01' },
  { id: 'line', label: 'Production-Line Map', number: '02' },
  { id: 'matrix', label: 'Capability Matrix', number: '03' },
  { id: 'compare', label: 'Comparison Workbench', number: '04' },
];

export function CapabilityExplorer() {
  const { state, dispatch } = useExplorer();
  useEffect(() => { track('capability_explorer_started', { location: 'capability-profile' }); }, []);
  return (
    <div className="explorer-shell">
      <div className="explorer-tabs" role="tablist" aria-label="Capability explorer views">{views.map((view, index) => <button type="button" role="tab" id={`tab-${view.id}`} aria-controls={`panel-${view.id}`} aria-selected={state.view === view.id} tabIndex={state.view === view.id ? 0 : -1} className={state.view === view.id ? 'is-active' : ''} key={view.id} onClick={() => dispatch({ type: 'SET_VIEW', view: view.id })} onKeyDown={(event) => { if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return; event.preventDefault(); const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? views.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + views.length) % views.length; dispatch({ type: 'SET_VIEW', view: views[nextIndex].id }); requestAnimationFrame(() => document.getElementById(`tab-${views[nextIndex].id}`)?.focus()); }}><span>{view.number}</span>{view.label}{view.id === 'compare' && state.comparison.length > 0 && <b>{state.comparison.length}</b>}</button>)}</div>
      <div className="explorer-panel" role="tabpanel" id={`panel-${state.view}`} aria-labelledby={`tab-${state.view}`}>
        {state.view === 'navigator' && <><SolutionNavigator /><ResultsPanel /></>}
        {state.view === 'line' && <><ProductionLineMap /><ResultsPanel /></>}
        {state.view === 'matrix' && <CapabilityMatrix />}
        {state.view === 'compare' && <ComparisonWorkbench />}
      </div>
      <SelectionTray />
      <ProductDrawer />
    </div>
  );
}
