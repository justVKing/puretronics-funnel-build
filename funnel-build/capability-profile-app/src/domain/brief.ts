import { productById } from '../data/catalog';
import { problemOptions, productionStages, projectOptions } from '../data/productionStages';
import { questionById } from '../data/readinessQuestions';
import { customerText, publicName } from '../data/publicContent';
import { capabilityPathsFor, chosenOptions, evaluateFit, visibleReadinessQuestions } from './fit';
import type { ExplorerState } from '../types/explorer';
import type { ReviewBrief } from '../types/readiness';

export const fitStatusLabels = { aligned: 'Aligned With Known Requirements', potential: 'Potential Match — Information Incomplete', 'project-review': 'Project-Specific Review', excluded: 'Excluded by a Known Requirement' } as const;
export function generateBrief(state: ExplorerState): ReviewBrief {
  const visible = visibleReadinessQuestions(state);
  const known: ReviewBrief['known'] = [];
  const open: string[] = [];
  for (const question of visible) {
    const options = chosenOptions(question.id, state.readinessAnswers[question.id]);
    if (!options.length || options.some((option) => option.id === 'unknown')) open.push(question.label);
    else {
      known.push({ label: question.label, value: options.map((option) => option.label).join('; ') });
      if (options.some((option) => ['partial', 'not-available', 'not-confirmed'].includes(option.id))) open.push(`Complete or Confirm: ${question.label}`);
    }
  }
  const evaluations = evaluateFit(state);
  for (const questionId of evaluations.flatMap((evaluation) => evaluation.openQuestionIds)) {
    const question = questionById.get(questionId);
    if (question) open.push(chosenOptions(questionId, state.readinessAnswers[questionId]).some((option) => option.id === 'not-applicable') ? `Confirm Whether This Required Information Applies: ${question.label}` : question.label);
  }
  const stageIds = [...new Set([...state.reviewStageIds, ...state.filters.stages])];
  if (stageIds.length) known.unshift({ label: 'Production or Testing Stages', value: stageIds.map((id) => productionStages.find((stage) => stage.id === id)?.label).filter(Boolean).join('; ') });
  const explorerProblems = state.filters.problems.filter((id) => !['multiple-issues', 'not-sure'].includes(id));
  if (explorerProblems.length) known.unshift({ label: 'Selected Requirements', value: explorerProblems.map((id) => problemOptions.find(([key]) => key === id)?.[1]).filter(Boolean).join('; ') });
  if (state.filters.routes.length) known.unshift({ label: 'Selected Project Routes', value: state.filters.routes.map((id) => projectOptions.find(([key]) => key === id)?.[1]).filter(Boolean).join('; ') });
  const capabilityPaths = capabilityPathsFor(state);
  const suggestedMaterials = ['Line or Test-Area Layout', 'Product, Conductor, Cable or Sample Details'];
  if (capabilityPaths.some((path) => path.includes('Measurement') || path.includes('Spark'))) suggestedMaterials.push('Current Line Speed, Diameter Range and Applicable Quality Specification');
  if (capabilityPaths.some((path) => path.includes('Testing'))) suggestedMaterials.push('Test Method, Sample Information and Applicable Procedure');
  if (capabilityPaths.some((path) => path.includes('Process Equipment'))) suggestedMaterials.push('Installation Space, Utilities and Process-Stage Details');
  if (capabilityPaths.some((path) => path.includes('Tension'))) suggestedMaterials.push('Machine Arrangement, Load/Tension Range, Reel/Shaft and Present Controls');
  const resultLines = evaluations.flatMap((result) => {
    const product = productById.get(result.productId)!;
    const caveats = [...new Set([...product.caveats, ...result.modelIds.map((id) => product.models.find((model) => model.id === id)?.caveat).filter((value): value is string => Boolean(value))])];
    return [
      `${product.name}: ${fitStatusLabels[result.status]}`,
      ...(result.modelIds.length ? [`  Models Remaining: ${result.modelIds.map(publicName).join('; ')}`] : []),
      ...(result.variantIds.length ? [`  Capacity Options Remaining: ${result.variantIds.map(publicName).join('; ')}`] : []),
      ...result.reasons.map((reason) => `  Selection Condition: ${customerText(reason)}`),
      ...result.exclusions.map((exclusion) => `  Exclusion: ${customerText(exclusion.reason)}`),
      ...caveats.map((caveat) => `  Technical Note: ${customerText(caveat)}`),
    ];
  });
  const uniqueOpen = [...new Set(open)];
  const lines = ['PURETRONICS — APPLICATION REVIEW BRIEF', '', `Relevant Capability Paths: ${capabilityPaths.join('; ') || 'To Be Confirmed'}`, '', 'PRODUCT AND MODEL REVIEW', ...(resultLines.length ? resultLines : ['No capability path selected yet.']), '', 'KNOWN INFORMATION', ...known.map((item) => `${item.label}: ${item.value}`), '', 'INFORMATION STILL REQUIRED', ...(uniqueOpen.length ? uniqueOpen.map((item) => `• ${item}`) : ['No open questions recorded.']), '', 'USEFUL REVIEW MATERIALS', ...suggestedMaterials.map((item) => `• ${item}`), '', 'This is a preliminary review of the information supplied. Final equipment and configuration selection requires Puretronics application review.'];
  return { title: 'Puretronics Application Review Brief', known, open: uniqueOpen, capabilityPaths, suggestedMaterials, evaluations, text: lines.map(customerText).join('\n') };
}
