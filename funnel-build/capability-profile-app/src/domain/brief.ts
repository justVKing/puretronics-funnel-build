import { families, productById } from '../data/catalog';
import { readinessQuestions } from '../data/readinessQuestions';
import type { ExplorerState } from '../types/explorer';
import type { ReviewBrief, StructuredAnswer } from '../types/readiness';

export function answerDisplay(value: unknown) {
  if (typeof value === 'string') return value.trim();
  if (!value || typeof value !== 'object') return '';
  const answer = value as StructuredAnswer;
  if (answer.status === 'not-known') return 'Not known yet';
  if (answer.status === 'not-applicable') return 'Not applicable';
  if (answer.status === 'range') return `${answer.min || '?'}–${answer.max || '?'}${answer.unit ? ` ${answer.unit}` : ''}`;
  const prefix = answer.status === 'approximate' ? 'Approximately ' : '';
  return `${prefix}${answer.value || ''}${answer.unit ? ` ${answer.unit}` : ''}`.trim();
}

export function generateBrief(state: ExplorerState): ReviewBrief {
  const selectedProducts = state.selectedProducts.map((id) => productById.get(id)).filter(Boolean);
  const familyIds = [...new Set(selectedProducts.map((product) => product!.familyId).concat(state.filters.families))];
  const capabilityPaths = familyIds.map((id) => families.find((family) => family.id === id)?.name).filter(Boolean) as string[];
  const known: Array<{ label: string; value: string }> = [];
  const open: string[] = [];

  for (const question of readinessQuestions) {
    if (question.familyIds?.length && !question.familyIds.some((id) => familyIds.includes(id))) continue;
    const value = state.readinessAnswers[question.id];
    const display = answerDisplay(value);
    if (!display || display === 'Not known yet') open.push(question.label);
    else if (display !== 'Not applicable') known.push({ label: question.label, value: display });
  }

  const suggestedMaterials = ['Line or test-area layout', 'Product, conductor, cable or sample details'];
  if (familyIds.includes('PF01') || familyIds.includes('PF02')) suggestedMaterials.push('Current line speed, diameter range and applicable quality specification');
  if (familyIds.includes('PF03')) suggestedMaterials.push('Test method, sample information and applicable procedure');
  if (familyIds.includes('PF04')) suggestedMaterials.push('Installation space, utilities and process-stage details');
  if (familyIds.includes('PF05')) suggestedMaterials.push('Machine arrangement, load/tension range, reel/shaft and present controls');

  const productNames = selectedProducts.map((product) => product!.name);
  const lines = [
    'PURETRONICS — APPLICATION REVIEW BRIEF', '',
    `Relevant capability paths: ${capabilityPaths.join('; ') || 'To be confirmed'}`,
    `Products reviewed: ${productNames.join('; ') || 'No product selected yet'}`, '',
    'KNOWN INFORMATION', ...known.map((item) => `${item.label}: ${item.value}`), '',
    'OPEN QUESTIONS', ...(open.length ? open.map((item) => `• ${item}`) : ['No open questions recorded.']), '',
    'SUGGESTED MATERIALS', ...suggestedMaterials.map((item) => `• ${item}`), '',
    'Exact equipment and configuration selection is confirmed against the complete application, operating conditions, interfaces and project requirements.',
  ];

  return { title: 'Puretronics Application Review Brief', known, open, capabilityPaths, suggestedMaterials, text: lines.join('\n') };
}
