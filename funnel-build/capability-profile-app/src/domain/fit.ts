import { families, productById, products } from '../data/catalog';
import { capabilityRelationships } from '../data/capabilityRelationships';
import { questionById, readinessQuestions } from '../data/readinessQuestions';
import { requirementDefinitions } from '../data/productionStages';
import type { ExplorerState } from '../types/explorer';
import type { FitEvaluation, McqAnswer, McqOption } from '../types/readiness';

const answerIds = (answer: McqAnswer | undefined) => answer ? (Array.isArray(answer) ? answer : [answer]) : [];
const nonDecisiveIds = new Set(['unknown', 'not-applicable']);
const incompleteIds = new Set(['unknown', 'not-applicable', 'partial', 'not-available', 'not-confirmed']);
const requiredOptionIds: Record<string, string[]> = {
  'pf04-powder-readiness': ['powder-defined', 'earthing', 'air-quality', 'running-height', 'utilities'],
};

export const chosenOptions = (questionId: string, answer: McqAnswer | undefined): McqOption[] => {
  const question = questionById.get(questionId);
  return question ? answerIds(answer).map((id) => question.options.find((option) => option.id === id)).filter(Boolean) as McqOption[] : [];
};

const requiredQuestionIds: Record<string, string[]> = {
  P01: ['pf01-function', 'pf01-min-diameter', 'pf01-max-diameter', 'pf01-axes', 'pf01-output', 'pf01-material'],
  P02: ['pf01-function', 'pf01-min-diameter', 'pf01-max-diameter', 'pf01-axes', 'pf01-output', 'pf01-material'],
  P03: ['pf01-function', 'pf01-min-diameter', 'pf01-max-diameter', 'pf01-axes', 'pf01-output', 'pf01-material'],
  P04: ['pf02-principle', 'pf02-speed', 'pf02-voltage', 'pf02-diameter', 'pf02-min-voltage', 'pf02-min-diameter', 'pf02-response'],
  P05: ['pf03-path', 'pf03-ac-voltage', 'pf03-ac-current', 'pf03-dc-voltage', 'pf03-dc-current', 'pf03-test-basis', 'pf03-safety-reporting'],
  P06: ['pf03-path', 'pf03-fire-basis', 'pf03-fire-sample', 'pf03-fire-site'],
  P07: ['pf04-path', 'pf04-speed', 'pf04-preheat-min-size', 'pf04-preheat-max-size', 'pf04-temperature', 'pf04-preheat-construction', 'pf04-preheat-material'],
  P08: ['pf04-path', 'pf04-speed', 'pf04-powder-size', 'pf04-powder-readiness', 'pf04-powder-specification'],
  P09: ['pf04-path', 'pf04-joining-material', 'pf04-joining-construction', 'pf04-joining-size'],
  P10: ['pf05-role', 'pf05-indicator-size', 'pf05-indicator-tension', 'pf05-wti-installation'],
  P11: ['pf05-role', 'pf05-control-architecture'],
  P12: ['pf05-role', 'pf05-capacity', 'pf05-mounting', 'pf05-loadcell-interface'],
  P13: ['pf05-role', 'pf05-rpm', 'pf05-torque', 'pf05-air', 'pf05-torque-basis', 'pf05-brake-geometry', 'pf05-brake-duty', 'pf05-brake-mounting'],
};

export function activeProductIds(state: ExplorerState) {
  const ids = new Set<string>(state.selectedProducts);
  const familyIds = new Set([...state.reviewFamilyIds, ...state.filters.families]);
  for (const product of products) if (familyIds.has(product.familyId)) ids.add(product.id);
  const stageIds = new Set([...state.reviewStageIds, ...state.filters.stages]);
  for (const relationship of capabilityRelationships) if (stageIds.has(relationship.orientationStageId)) ids.add(relationship.productId);
  const problemIds = state.filters.problems.filter((id) => !['multiple-issues', 'not-sure'].includes(id));
  for (const requirement of requirementDefinitions) if (requirement.problemIds.some((id) => problemIds.includes(id))) for (const productId of requirement.productIds) ids.add(productId);
  for (const option of chosenOptions('primary-requirement', state.readinessAnswers['primary-requirement'])) for (const productId of option.productIds ?? []) ids.add(productId);
  return products.filter((product) => ids.has(product.id)).map((product) => product.id);
}

export function activeFamilyIds(state: ExplorerState) {
  const familyIds = new Set([...state.reviewFamilyIds, ...state.filters.families]);
  for (const id of activeProductIds(state)) {
    const familyId = productById.get(id)?.familyId;
    if (familyId) familyIds.add(familyId);
  }
  return families.filter((family) => familyIds.has(family.id)).map((family) => family.id);
}

export function visibleReadinessQuestions(state: ExplorerState) {
  const familyIds = activeFamilyIds(state);
  const productIds = activeProductIds(state);
  return readinessQuestions.filter((question) => {
    if (question.familyIds && !question.familyIds.some((id) => familyIds.includes(id))) return false;
    if (question.productIds && !question.productIds.some((id) => productIds.includes(id))) return false;
    if (!question.when) return true;
    const selected = answerIds(state.readinessAnswers[question.when.questionId]);
    return selected.some((id) => question.when!.optionIds.includes(id));
  });
}

const hasDecisiveAnswer = (state: ExplorerState, questionId: string) => {
  if (questionId === 'pf05-torque' && !answerIds(state.readinessAnswers['pf05-torque-basis']).includes('per-caliper')) return false;
  const chosen = chosenOptions(questionId, state.readinessAnswers[questionId]);
  const required = requiredOptionIds[questionId];
  if (required) return required.every((id) => chosen.some((option) => option.id === id));
  return chosen.some((option) => !incompleteIds.has(option.id));
};

export function evaluateFit(state: ExplorerState): FitEvaluation[] {
  const initialIds = activeProductIds(state);
  if (!initialIds.length) return [];
  const visible = visibleReadinessQuestions(state);
  const visibleIds = new Set(visible.map((question) => question.id));
  const evaluations = initialIds.map((productId): FitEvaluation => {
    const product = productById.get(productId)!;
    let modelIds = product.models.map((model) => model.id);
    let variantIds: string[] = [];
    const reasons: string[] = [];
    const exclusions: FitEvaluation['exclusions'] = [];
    let excluded = false;
    const modelName = (id: string) => product.models.find((model) => model.id === id)?.name ?? 'Selected configuration';
    const configurationNotes: Record<string, string> = {
      P06: 'The fire-test method, sample, system configuration and acceptance requirements need a project-specific Puretronics review.',
      P07: 'Achievable preheating speed depends on conductor diameter, material, temperature rise and heating duty. Puretronics must confirm their combined requirements.',
      P11: 'The controller requires a review of sensor signals, actuator outputs and machine interfaces before an integrated control arrangement can be confirmed.',
      P13: 'Brake selection requires the torque at operating pressure, caliper arrangement, reel and shaft geometry, mounting and thermal duty to be reviewed together.',
    };
    let projectReview = Boolean(configurationNotes[productId]);
    if (configurationNotes[productId]) reasons.push(configurationNotes[productId]);
    if (state.filters.routes.length && !state.filters.routes.some((route) => product.projectRoutes.includes(route))) {
      excluded = true;
      exclusions.push({ questionId: 'explorer-project-route', reason: `${product.shortName} does not match the selected project route.`, source: 'Approved Public Project-Route Mapping' });
    }
    for (const question of visible) {
      // A shared review can contain several families and several equipment roles.
      // A technical condition can only constrain the products it describes.
      if (question.productIds && !question.productIds.includes(productId)) continue;
      if (question.familyIds && !question.familyIds.includes(product.familyId)) continue;
      const options = chosenOptions(question.id, state.readinessAnswers[question.id]);
      const decisive = options.filter((option) => !nonDecisiveIds.has(option.id));
      if (!decisive.length) continue;
      if (question.id === 'pf05-torque' && !answerIds(state.readinessAnswers['pf05-torque-basis']).includes('per-caliper')) continue;
      const relevant = decisive.filter((option) => !option.productIds?.length || option.productIds.includes(productId));
      const reviewConditions = relevant.filter((option) => option.reviewRequired || option.configurationReview);
      for (const reviewCondition of reviewConditions) {
        projectReview = true;
        reasons.push(`${question.label} ${reviewCondition.label} — ${reviewCondition.caveat ?? 'Requires Puretronics application review.'}`);
      }
      if (!question.scopeOnly) {
        const productScoped = decisive.filter((option) => option.productIds?.length);
        if (productScoped.length && !productScoped.some((option) => option.productIds!.includes(productId))) {
          excluded = true;
          exclusions.push({ questionId: question.id, reason: `${product.shortName} serves a different equipment role from the selected requirement: ${decisive.map((option) => option.label).join(', ')}.`, source: decisive.find((option) => option.evidence)?.evidence ?? 'Governed Capability Relationship' });
        } else if (productScoped.length) reasons.push(`${question.label}: ${decisive.map((option) => option.label).join(', ')}`);
      }
      const outsideProductBoundary = relevant.length > 0 && relevant.every((option) => option.excludesProduct);
      if (outsideProductBoundary) {
        excluded = true;
        modelIds = [];
        variantIds = [];
        exclusions.push({ questionId: question.id, reason: `${relevant.map((option) => option.label).join(', ')} falls outside the published ${product.shortName} range.`, source: relevant[0].evidence ?? 'Validated Product Boundary' });
      }
      const modelScoped = relevant.filter((option) => option.modelIds !== undefined);
      const unrestrictedChoice = relevant.some((option) => option.modelIds === undefined && !option.excludesProduct);
      if (modelScoped.length && !unrestrictedChoice && product.models.length) {
        const hadModels = modelIds.length > 0;
        const allowed = new Set(modelScoped.flatMap((option) => option.modelIds ?? []));
        const affected = new Set(question.modelScope ?? product.models.map((model) => model.id));
        const anyApplicableAllowed = product.models.some((model) => affected.has(model.id) && allowed.has(model.id));
        const removed = modelIds.filter((id) => affected.has(id) && !allowed.has(id));
        modelIds = modelIds.filter((id) => !affected.has(id) || allowed.has(id));
        if (variantIds.length) variantIds = variantIds.filter((id) => modelIds.some((modelId) => id.startsWith(`${modelId}-`)));
        if (removed.length) exclusions.push({ questionId: question.id, reason: `${removed.map(modelName).join(', ')} do not cover ${relevant.map((option) => option.label).join(', ')}.`, source: modelScoped[0].evidence ?? 'Validated Model Boundary' });
        if (modelIds.length) reasons.push(`${question.label}: ${decisive.map((option) => option.label).join(', ')}`);
        else if (hadModels || !anyApplicableAllowed) {
          const configurablePreheater = productId === 'P07' && !outsideProductBoundary &&
            !['pf04-speed','pf04-temperature'].includes(question.id);
          if (configurablePreheater || relevant.some((option) => option.configurationReview)) {
            projectReview = true;
            reasons.push('No listed standard speed configuration covers the combined diameter requirements. Puretronics must review a configuration within the wider conductor envelope.');
          } else excluded = true;
        }
      }
      const variantScoped = relevant.filter((option) => option.variantIds?.some((id) => id.startsWith(productId)));
      if (variantScoped.length) {
        const allowed = new Set(variantScoped.flatMap((option) => option.variantIds ?? []));
        variantIds = [...allowed].filter((id) => modelIds.some((modelId) => id.startsWith(`${modelId}-`)));
        if (!variantIds.length) excluded = true;
      }
      for (const conditionalReview of relevant.filter((option) => option.reviewRequiredModelIds?.some((id) => modelIds.includes(id)))) {
        projectReview = true;
        reasons.push(`${question.label}: ${conditionalReview.label} — ${conditionalReview.caveat ?? 'Requires Model-Specific Puretronics Review'}`);
      }
      const routes = decisive.map((option) => option.projectRoute).filter(Boolean);
      if (routes.length && !routes.some((route) => product.projectRoutes.includes(route!))) {
        excluded = true;
        exclusions.push({ questionId: question.id, reason: `${product.shortName} does not match the selected ${decisive[0].label} project route.`, source: 'Approved Public Project-Route Mapping' });
      }
    }
    if (productId === 'P07' && visibleIds.has('pf04-preheat-max-size') && visibleIds.has('pf04-preheat-construction') &&
      answerIds(state.readinessAnswers['pf04-preheat-max-size']).includes('10-16') &&
      answerIds(state.readinessAnswers['pf04-preheat-construction']).includes('solid')) {
      excluded = true;
      modelIds = [];
      exclusions.push({ questionId: 'pf04-preheat-construction', reason: 'The published configurable solid-conductor diameter ends at 10 mm. The selected diameter is larger.', source: 'P07 Validated Configurable Envelope' });
    }
    if (productId === 'P12' && modelIds.some((id) => ['P12E','P12F'].includes(id))) {
      projectReview = true;
      reasons.push('LC-AR-60 and LC-AR-HD signal, protection and availability details require confirmation for the selected capacity and mounting arrangement.');
    }
    const requiredVisible = ['requirement-location', 'material-category', 'project-type', ...(requiredQuestionIds[productId] ?? [])].filter((id) => visibleIds.has(id));
    const openQuestionIds = requiredVisible.filter((id) => !hasDecisiveAnswer(state, id));
    const status = excluded ? 'excluded' : projectReview ? 'project-review' : openQuestionIds.length === 0 && requiredVisible.length > 0 ? 'aligned' : 'potential';
    if (excluded) { modelIds = []; variantIds = []; }
    return { productId, status, modelIds, variantIds, reasons: [...new Set(reasons)], exclusions, openQuestionIds };
  });
  const order = { aligned: 0, 'project-review': 1, potential: 2, excluded: 3 };
  return evaluations.sort((a, b) => order[a.status] - order[b.status] || productById.get(a.productId)!.order - productById.get(b.productId)!.order);
}

export function capabilityPathsFor(state: ExplorerState) {
  const ids = new Set(activeProductIds(state).map((id) => productById.get(id)?.familyId));
  return families.filter((family) => ids.has(family.id)).map((family) => family.name);
}
