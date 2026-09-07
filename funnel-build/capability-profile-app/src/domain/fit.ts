import { families, productById, products } from '../data/catalog';
import { questionById, readinessQuestions } from '../data/readinessQuestions';
import type { ExplorerState } from '../types/explorer';
import type { FitEvaluation, McqAnswer, McqOption } from '../types/readiness';

const answerIds = (answer: McqAnswer | undefined) => answer ? (Array.isArray(answer) ? answer : [answer]) : [];
export const chosenOptions = (questionId: string, answer: McqAnswer | undefined): McqOption[] => {
  const question = questionById.get(questionId);
  return question ? answerIds(answer).map((id) => question.options.find((option) => option.id === id)).filter(Boolean) as McqOption[] : [];
};

export function activeProductIds(state: ExplorerState) {
  const explicit = state.selectedProducts.length ? state.selectedProducts : products.filter((product) => state.filters.families.includes(product.familyId)).map((product) => product.id);
  const requirementProducts = chosenOptions('primary-requirement', state.readinessAnswers['primary-requirement']).flatMap((option) => option.productIds ?? []);
  if (explicit.length && requirementProducts.length) return explicit.filter((id) => requirementProducts.includes(id));
  return [...new Set(explicit.length ? explicit : requirementProducts)];
}

export function activeFamilyIds(state: ExplorerState) {
  return [...new Set([...state.filters.families, ...activeProductIds(state).map((id) => productById.get(id)?.familyId).filter(Boolean)])];
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

export function evaluateFit(state: ExplorerState): FitEvaluation[] {
  const initialIds = activeProductIds(state);
  if (!initialIds.length) return [];
  const evaluations = initialIds.map((productId): FitEvaluation => {
    const product = productById.get(productId)!;
    let modelIds = product.models.map((model) => model.id);
    const reasons: string[] = [];
    const exclusions: FitEvaluation['exclusions'] = [];
    let excluded = false;
    let projectReview = productId === 'P06';
    for (const question of visibleReadinessQuestions(state)) {
      const options = chosenOptions(question.id, state.readinessAnswers[question.id]);
      const decisive = options.filter((option) => !['unknown', 'not-applicable'].includes(option.id));
      if (!decisive.length) continue;
      const reviewCondition = decisive.find((option) => option.reviewRequired);
      if (reviewCondition) {
        projectReview = true;
        reasons.push(`${question.label}: ${reviewCondition.label} Requires Request-Based Puretronics Review`);
      }
      const productScoped = decisive.filter((option) => option.productIds?.length);
      if (productScoped.length && !productScoped.some((option) => option.productIds!.includes(productId))) {
        excluded = true;
        exclusions.push({ questionId: question.id, reason: `${question.label}: ${decisive.map((option) => option.label).join(', ')}`, source: decisive.find((option) => option.evidence)?.evidence ?? 'Governed Capability Relationship' });
      } else if (productScoped.length) reasons.push(`${question.label}: ${decisive.map((option) => option.label).join(', ')}`);
      const outsidePublishedBoundary = decisive.find((option) => option.modelIds && option.modelIds.length === 0);
      if (outsidePublishedBoundary && product.models.length) {
        excluded = true;
        modelIds = [];
        exclusions.push({ questionId: question.id, reason: `${outsidePublishedBoundary.label} Falls Outside the Published Model Boundary`, source: outsidePublishedBoundary.evidence ?? 'Current Approved V4 Model Record' });
      }
      const modelScoped = decisive.filter((option) => option.modelIds?.some((id) => id.startsWith(productId)));
      if (modelScoped.length && modelIds.length) {
        const allowed = new Set(modelScoped.flatMap((option) => option.modelIds ?? []));
        const removed = modelIds.filter((id) => !allowed.has(id));
        modelIds = modelIds.filter((id) => allowed.has(id));
        if (removed.length) exclusions.push({ questionId: question.id, reason: `${removed.join(', ')} Do Not Cover ${decisive.map((option) => option.label).join(', ')}`, source: modelScoped[0].evidence ?? 'Current Approved V4 Model Record' });
        if (modelIds.length) reasons.push(`${question.label}: ${decisive.map((option) => option.label).join(', ')}`);
        else excluded = true;
      }
      const routes = decisive.map((option) => option.projectRoute).filter(Boolean);
      if (routes.length && !routes.some((route) => product.projectRoutes.includes(route!))) {
        excluded = true;
        exclusions.push({ questionId: question.id, reason: `${product.shortName} Is Not Published for the Selected ${decisive[0].label} Route`, source: 'Approved Public Project-Route Mapping' });
      }
    }
    const answeredDiscriminators = reasons.length;
    const status = excluded ? 'excluded' : projectReview ? 'project-review' : answeredDiscriminators >= 2 ? 'aligned' : 'potential';
    return { productId, status, modelIds, reasons: [...new Set(reasons)], exclusions };
  });
  const order = { aligned: 0, 'project-review': 1, potential: 2, excluded: 3 };
  return evaluations.sort((a, b) => order[a.status] - order[b.status] || productById.get(a.productId)!.order - productById.get(b.productId)!.order);
}

export function capabilityPathsFor(state: ExplorerState) {
  return activeFamilyIds(state).map((id) => families.find((family) => family.id === id)?.name).filter(Boolean) as string[];
}
