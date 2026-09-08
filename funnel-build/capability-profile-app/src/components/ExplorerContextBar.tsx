import { families } from '../data/catalog';
import { problemOptions, productionStages, projectOptions } from '../data/productionStages';
import { useExplorer } from '../state/ExplorerProvider';

export function ExplorerContextBar() {
  const { state, dispatch } = useExplorer();
  const chips = [
    ...state.filters.problems.filter((id) => !['multiple-issues', 'not-sure'].includes(id)).map((id) => ({ key: 'problems' as const, id, label: problemOptions.find(([key]) => key === id)?.[1] ?? id })),
    ...state.filters.families.map((id) => ({ key: 'families' as const, id, label: families.find((family) => family.id === id)?.name ?? id })),
    ...state.filters.stages.map((id) => ({ key: 'stages' as const, id, label: productionStages.find((stage) => stage.id === id)?.label ?? id })),
    ...state.filters.routes.map((id) => ({ key: 'routes' as const, id, label: projectOptions.find(([key]) => key === id)?.[1] ?? id })),
  ];
  if (!chips.length && !state.filters.query) return null;
  return <div className="explorer-context-bar" aria-label="Constraints Shared Across Explorer Views"><strong>Shared Explorer Constraints</strong><div>{state.filters.query && <button type="button" onClick={() => dispatch({ type: 'SET_QUERY', query: '' })}>Search: {state.filters.query} ×</button>}{chips.map((chip) => <button type="button" key={`${chip.key}-${chip.id}`} onClick={() => dispatch({ type: 'TOGGLE_FILTER', key: chip.key, value: chip.id })}>{chip.label} ×</button>)}</div><button type="button" className="text-button" onClick={() => dispatch({ type: 'CLEAR_FILTERS' })}>Clear Explorer Constraints</button></div>;
}
