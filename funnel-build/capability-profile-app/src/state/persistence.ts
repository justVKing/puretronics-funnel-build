import { families, productById, products } from '../data/catalog';
import { readinessQuestions } from '../data/readinessQuestions';
import { navigatorModes } from '../data/navigatorQuestions';
import { productionStages, problemOptions, projectOptions } from '../data/productionStages';
import type { ExplorerState } from '../types/explorer';
import { initialState } from './reducer';

const KEY = 'puretronics-capability-profile:v4';
const VERSION = 4;
const isObject = (value: unknown): value is Record<string, unknown> => Boolean(value && typeof value === 'object' && !Array.isArray(value));
const strings = (value: unknown, allowed: readonly string[]) => Array.isArray(value) ? [...new Set(value.filter((id): id is string => typeof id === 'string' && allowed.includes(id)))] : [];
const navigatorChoices: Record<string, string[]> = {
  multipleIssues: ['', 'active'], knownInputs: ['diameter','speed','voltage','temperature','load','none'], guideKnown: ['diameter','speed','voltage','temperature','load','none'],
  guideLocation: ['line','lab','unknown'], guideConcern: [...families.map((family) => family.id), 'unknown'], guideProject: ['new-line','retrofit','replacement','unknown'], existingEquipment: ['known','partial','none','unknown'],
  'pf01-need': ['diameter','lump','unknown'], 'pf02-method': ['live','acute','dc','unknown'], 'pf02-response': ['indication','data','marking','unknown'], 'pf03-need': ['hv','fire','unknown'], 'pf04-need': ['heat','powder','join','unknown'], 'pf05-role': ['indication','sensing','control','braking','integrated','unknown'],
};

export function sanitizeState(value: unknown): ExplorerState {
  if (!isObject(value) || !isObject(value.filters)) return initialState;
  const filters = value.filters;
  const comparisonProduct = typeof value.comparisonProductId === 'string' ? productById.get(value.comparisonProductId) : undefined;
  const comparisonLevel = value.comparisonLevel === 'capacities' || (Array.isArray(value.comparisonModelIds) && value.comparisonModelIds.some((id) => typeof id === 'string' && id.includes('-C'))) ? 'capacities' : 'models';
  const candidates = comparisonLevel === 'capacities' ? comparisonProduct?.models.flatMap((model) => model.children ?? []) ?? [] : comparisonProduct?.models ?? [];
  const readinessAnswers: ExplorerState['readinessAnswers'] = {};
  for (const question of readinessQuestions) {
    const raw = isObject(value.readinessAnswers) ? value.readinessAnswers[question.id] : undefined;
    const answers = strings(Array.isArray(raw) ? raw : [raw], question.options.map((option) => option.id));
    if (!answers.length) continue;
    const exclusive = answers.find((id) => ['none','unknown','not-applicable'].includes(id));
    readinessAnswers[question.id] = question.mode === 'single' ? answers[0] : exclusive ? [exclusive] : answers;
  }
  const navigatorAnswers: ExplorerState['navigatorAnswers'] = {};
  if (isObject(value.navigatorAnswers)) for (const [id, allowed] of Object.entries(navigatorChoices)) {
    const raw = value.navigatorAnswers[id];
    if (typeof raw === 'string' && allowed.includes(raw)) navigatorAnswers[id] = raw;
  }
  return {
    ...initialState,
    view: ['navigator','line','matrix','compare'].includes(String(value.view)) ? value.view as ExplorerState['view'] : initialState.view,
    navigatorMode: navigatorModes.some((mode) => mode.id === value.navigatorMode) ? value.navigatorMode as ExplorerState['navigatorMode'] : null,
    filters: {
      query: typeof filters.query === 'string' ? filters.query.slice(0, 160) : '',
      problems: strings(filters.problems, problemOptions.map(([id]) => id)), stages: strings(filters.stages, productionStages.map((stage) => stage.id)),
      families: strings(filters.families, families.map((family) => family.id)) as ExplorerState['filters']['families'], routes: strings(filters.routes, projectOptions.map(([id]) => id)) as ExplorerState['filters']['routes'],
    },
    selectedProducts: strings(value.selectedProducts, products.map((product) => product.id)),
    reviewFamilyIds: strings(value.reviewFamilyIds, families.map((family) => family.id)) as ExplorerState['reviewFamilyIds'], reviewStageIds: strings(value.reviewStageIds, productionStages.map((stage) => stage.id)),
    comparisonProductId: comparisonProduct?.id ?? null, comparisonLevel, comparisonModelIds: strings(value.comparisonModelIds, candidates.map((model) => model.id)).slice(0, 3), comparisonShowDifferences: value.comparisonShowDifferences === true,
    drawerProductId: null, readinessAnswers, navigatorAnswers, briefGenerated: value.briefGenerated === true,
  };
}

export function saveState(state: ExplorerState, storage?: Pick<Storage, 'setItem'>) {
  try { (storage ?? sessionStorage).setItem(KEY, JSON.stringify({ version: VERSION, state: sanitizeState(state) })); } catch { /* The review remains usable when browser storage is unavailable. */ }
}

export function loadState(storage?: Pick<Storage, 'getItem'>): ExplorerState {
  try {
    const raw = (storage ?? sessionStorage).getItem(KEY);
    if (!raw) return initialState;
    const parsed: unknown = JSON.parse(raw);
    return isObject(parsed) && parsed.version === VERSION ? sanitizeState(parsed.state) : initialState;
  } catch { return initialState; }
}

export function clearState(storage?: Pick<Storage, 'removeItem'>) {
  try { (storage ?? sessionStorage).removeItem(KEY); } catch { /* No retained review is required for navigation. */ }
}
