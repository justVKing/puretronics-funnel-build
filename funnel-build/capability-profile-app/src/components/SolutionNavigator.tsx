import { families } from '../data/catalog';
import { navigatorModes } from '../data/navigatorQuestions';
import { problemOptions, projectOptions } from '../data/productionStages';
import { track } from '../analytics/events';
import type { FamilyId, ProjectRoute } from '../types/catalog';
import type { NavigatorMode } from '../types/explorer';
import { useExplorer } from '../state/ExplorerProvider';

function ChoiceButton({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" className={`choice-button${selected ? ' is-selected' : ''}`} aria-pressed={selected} onClick={onClick}><span className="choice-check" aria-hidden="true">{selected ? '✓' : '+'}</span>{children}</button>;
}

export function SolutionNavigator() {
  const { state, dispatch } = useExplorer();
  const chooseMode = (mode: NavigatorMode) => {
    dispatch({ type: 'SET_MODE', mode });
    track('explorer_start_mode_selected', { mode });
  };

  if (!state.navigatorMode) {
    return (
      <div className="navigator-entry" aria-labelledby="starting-point-heading">
        <div className="view-intro">
          <div><p className="proof-label">Solution Navigator</p><h3 id="starting-point-heading">Choose Your Starting Point</h3></div>
          <p>You do not need to know a product name. Start with the information already available.</p>
        </div>
        <div className="entry-grid compact">
          {navigatorModes.map((mode, index) => (
            <button className="entry-card" key={mode.id} type="button" onClick={() => chooseMode(mode.id)}>
              <span className="entry-number">0{index + 1}</span><strong>{mode.title}</strong><span>{mode.description}</span><span className="entry-action">{mode.short} <span aria-hidden="true">→</span></span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="navigator-panel">
      <div className="navigator-heading">
        <div><p className="proof-label">Active Route</p><h3>{navigatorModes.find((mode) => mode.id === state.navigatorMode)?.title}</h3></div>
        <button type="button" className="text-button" onClick={() => dispatch({ type: 'CLEAR_FILTERS' })}>Change starting point</button>
      </div>

      {(state.navigatorMode === 'problem' || state.navigatorMode === 'guide') && (
        <fieldset>
          <legend>{state.navigatorMode === 'guide' ? 'What best describes the issue you can observe?' : 'What outcome do you need to improve?'}</legend>
          <div className="choice-grid">
            {problemOptions.map(([id, label]) => <ChoiceButton key={id} selected={state.filters.problems.includes(id)} onClick={() => { dispatch({ type: 'TOGGLE_FILTER', key: 'problems', value: id }); track('problem_selected', { ids: [id] }); }}>{label}</ChoiceButton>)}
          </div>
          {state.navigatorMode === 'guide' && state.filters.problems.some((id) => ['tension-instability', 'tension-visibility', 'braking'].includes(id)) && (
            <div className="guidance-note"><strong>Equipment roles are kept distinct.</strong><p>Tension indication provides visibility, transducers sense load, LTC-PRO controls a reviewed feedback loop, and pneumatic brakes provide actuation.</p></div>
          )}
        </fieldset>
      )}

      {state.navigatorMode === 'family' && (
        <fieldset><legend>Select one or more Product Families</legend><div className="family-choice-list">
          {families.map((family) => <ChoiceButton key={family.id} selected={state.filters.families.includes(family.id)} onClick={() => { dispatch({ type: 'TOGGLE_FILTER', key: 'families', value: family.id }); track('family_selected', { ids: [family.id] }); }}><span><strong>{family.name}</strong><small>{family.summary}</small></span></ChoiceButton>)}
        </div></fieldset>
      )}

      {state.navigatorMode === 'search' && (
        <div className="search-control"><label htmlFor="product-search">Product or model name</label><div className="search-box"><span aria-hidden="true">⌕</span><input id="product-search" type="search" value={state.filters.query} placeholder="For example: AX-400 or LASER-2030" onChange={(event) => dispatch({ type: 'SET_QUERY', query: event.target.value })} onBlur={() => { if (state.filters.query) track('product_search_used', { count: state.filters.query.length }); }} /></div><p>Searches approved product names, model codes and governed aliases.</p></div>
      )}

      {state.navigatorMode === 'project' && (
        <fieldset><legend>Which project route applies?</legend><div className="choice-grid">
          {projectOptions.filter(([id]) => id !== 'support').map(([id, label]) => <ChoiceButton key={id} selected={state.filters.routes.includes(id as ProjectRoute)} onClick={() => dispatch({ type: 'TOGGLE_FILTER', key: 'routes', value: id })}>{label}</ChoiceButton>)}
        </div><div className="guidance-note"><strong>Multi-stage review supported.</strong><p>Switch to the Production-Line Map to select every relevant stage and keep one coordinated result set.</p><button type="button" className="text-button" onClick={() => dispatch({ type: 'SET_VIEW', view: 'line' })}>Open Production-Line Map →</button></div></fieldset>
      )}
    </div>
  );
}
