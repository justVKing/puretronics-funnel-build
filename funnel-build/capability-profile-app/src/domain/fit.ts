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
  P01: ['pf01-function', 'pf01-min-diameter', 'pf01-max-diameter'],
  P02: ['pf01-function', 'pf01-min-diameter', 'pf01-max-diameter'],
  P03: ['pf01-function', 'pf01-min-diameter', 'pf01-max-diameter'],
  P04: ['pf02-principle', 'pf02-speed', 'pf02-voltage', 'pf02-diameter'],
  P05: ['pf03-path', 'pf03-ac-voltage', 'pf03-ac-current', 'pf03-dc-voltage', 'pf03-dc-current'],
  P06: ['pf03-path', 'pf03-fire-basis', 'pf03-fire-sample', 'pf03-fire-site'],
  P07: ['pf04-path', 'pf04-speed', 'pf04-preheat-min-size', 'pf04-preheat-max-size', 'pf04-temperature'],
  P08: ['pf04-path', 'pf04-speed', 'pf04-powder-size', 'pf04-powder-readiness'],
  P09: ['pf04-path', 'pf04-joining-material', 'pf04-joining-construction'],
  P10: ['pf05-role', 'pf05-indicator-size', 'pf05-indicator-tension'],
  P11: ['pf05-role', 'pf05-control-architecture'],
  P12: ['pf05-role', 'pf05-capacity', 'pf05-mounting'],
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
  return readinessQuestions.filter((question) => {
    if (question.familyIds && !question.familyIds.some((id) => familyIds.includes(id))) return false;
    if (!question.when) return true;
    const selected = answerIds(state.readinessAnswers[question.when.questionId]);
    return selected.some((id) => question.when!.optionIds.includes(id));
  });
}

const hasDecisiveAnswer = (state: ExplorerState, questionId: string) => {
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
    let projectReview = productId === 'P06';
    if (state.filters.routes.length && !state.filters.routes.some((route) => product.projectRoutes.includes(route))) {
      excluded = true;
      exclusions.push({ questionId: 'explorer-project-route', reason: `${product.shortName} Is Not Published for the Project Route Carried From the Explorer`, source: 'Approved Public Project-Route Mapping' });
    }
    for (const question of visible) {
      const options = chosenOptions(question.id, state.readinessAnswers[question.id]);
      const decisive = options.filter((option) => !nonDecisiveIds.has(option.id));
      if (!decisive.length) continue;
      const reviewConditions = decisive.filter((option) => option.reviewRequired);
      for (const reviewCondition of reviewConditions) {
        projectReview = true;
        reasons.push(`${question.label}: ${reviewCondition.label} — ${reviewCondition.caveat ?? 'Requires Puretronics Review'}`);
      }
      if (!question.scopeOnly) {
        const productScoped = decisive.filter((option) => option.productIds?.length);
        if (productScoped.length && !productScoped.some((option) => option.productIds!.includes(productId))) {
          excluded = true;
          exclusions.push({ questionId: question.id, reason: `${question.label}: ${decisive.map((option) => option.label).join(', ')}`, source: decisive.find((option) => option.evidence)?.evidence ?? 'Governed Capability Relationship' });
        } else if (productScoped.length) reasons.push(`${question.label}: ${decisive.map((option) => option.label).join(', ')}`);
      }
      const outsidePublishedBoundary = decisive.find((option) => option.modelIds && option.modelIds.length === 0);
      if (outsidePublishedBoundary && product.models.length) {
        excluded = true;
        modelIds = [];
        variantIds = [];
        exclusions.push({ questionId: question.id, reason: `${outsidePublishedBoundary.label} Falls Outside the Published Model Boundary`, source: outsidePublishedBoundary.evidence ?? 'Current Approved V4 Model Record' });
      }
      const modelScoped = decisive.filter((option) => option.modelIds?.some((id) => id.startsWith(productId)));
      if (modelScoped.length && modelIds.length) {
        const allowed = new Set(modelScoped.flatMap((option) => option.modelIds ?? []));
        const removed = modelIds.filter((id) => !allowed.has(id));
        modelIds = modelIds.filter((id) => allowed.has(id));
        if (variantIds.length) variantIds = variantIds.filter((id) => modelIds.some((modelId) => id.startsWith(`${modelId}-`)));
        if (removed.length) exclusions.push({ questionId: question.id, reason: `${removed.join(', ')} Do Not Cover ${decisive.map((option) => option.label).join(', ')}`, source: modelScoped[0].evidence ?? 'Current Approved V4 Model Record' });
        if (modelIds.length) reasons.push(`${question.label}: ${decisive.map((option) => option.label).join(', ')}`);
        else excluded = true;
      }
      const variantScoped = decisive.filter((option) => option.variantIds?.some((id) => id.startsWith(productId)));
      if (variantScoped.length) {
        const allowed = new Set(variantScoped.flatMap((option) => option.variantIds ?? []));
        variantIds = [...allowed].filter((id) => modelIds.some((modelId) => id.startsWith(`${modelId}-`)));
        if (!variantIds.length) excluded = true;
      }
      for (const conditionalReview of decisive.filter((option) => option.reviewRequiredModelIds?.some((id) => modelIds.includes(id)))) {
        projectReview = true;
        reasons.push(`${question.label}: ${conditionalReview.label} — ${conditionalReview.caveat ?? 'Requires Model-Specific Puretronics Review'}`);
      }
      const routes = decisive.map((option) => option.projectRoute).filter(Boolean);
      if (routes.length && !routes.some((route) => product.projectRoutes.includes(route!))) {
        excluded = true;
        exclusions.push({ questionId: question.id, reason: `${product.shortName} Is Not Published for the Selected ${decisive[0].label} Route`, source: 'Approved Public Project-Route Mapping' });
      }
    }
    const requiredVisible = (requiredQuestionIds[productId] ?? []).filter((id) => visibleIds.has(id));
    const openQuestionIds = requiredVisible.filter((id) => !hasDecisiveAnswer(state, id));
    const status = excluded ? 'excluded' : projectReview ? 'project-review' : openQuestionIds.length === 0 && requiredVisible.length > 0 ? 'aligned' : 'potential';
    return { productId, status, modelIds, variantIds, reasons: [...new Set(reasons)], exclusions, openQuestionIds };
  });
  const order = { aligned: 0, 'project-review': 1, potential: 2, excluded: 3 };
  return evaluations.sort((a, b) => order[a.status] - order[b.status] || productById.get(a.productId)!.order - productById.get(b.productId)!.order);
}

export function capabilityPathsFor(state: ExplorerState) {
  const ids = new Set(activeProductIds(state).map((id) => productById.get(id)?.familyId));
  return families.filter((family) => ids.has(family.id)).map((family) => family.name);
}
