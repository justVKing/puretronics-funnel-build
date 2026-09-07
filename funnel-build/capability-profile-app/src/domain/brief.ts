import { productById } from '../data/catalog';
import { capabilityPathsFor, chosenOptions, evaluateFit, visibleReadinessQuestions } from './fit';
import type { ExplorerState } from '../types/explorer';
import type { ReviewBrief } from '../types/readiness';

export function generateBrief(state: ExplorerState): ReviewBrief {
  const visible = visibleReadinessQuestions(state);
  const known: ReviewBrief['known'] = [];
  const open: string[] = [];
  for (const question of visible) {
    const options = chosenOptions(question.id, state.readinessAnswers[question.id]);
    if (options.some((option) => option.id === 'not-applicable')) continue;
    const usable = options.filter((option) => option.id !== 'not-applicable');
    if (!usable.length || usable.some((option) => option.id === 'unknown')) open.push(question.label);
    else known.push({ label: question.label, value: usable.map((option) => option.label).join('; ') });
  }
  const evaluations = evaluateFit(state);
  const capabilityPaths = capabilityPathsFor(state);
  const suggestedMaterials = ['Line or Test-Area Layout', 'Product, Conductor, Cable or Sample Details'];
  if (capabilityPaths.some((path) => path.includes('Measurement') || path.includes('Spark'))) suggestedMaterials.push('Current Line Speed, Diameter Range and Applicable Quality Specification');
  if (capabilityPaths.some((path) => path.includes('Testing'))) suggestedMaterials.push('Test Method, Sample Information and Applicable Procedure');
  if (capabilityPaths.some((path) => path.includes('Process Equipment'))) suggestedMaterials.push('Installation Space, Utilities and Process-Stage Details');
  if (capabilityPaths.some((path) => path.includes('Tension'))) suggestedMaterials.push('Machine Arrangement, Load/Tension Range, Reel/Shaft and Present Controls');
  const resultLines = evaluations.flatMap((result) => {
    const product = productById.get(result.productId)!;
    const caveats = [...new Set([...product.caveats, ...result.modelIds.map((id) => product.models.find((model) => model.id === id)?.caveat).filter(Boolean)])];
    return [`${product.name}: ${result.status.replace('-', ' ')}${result.modelIds.length ? ` — ${result.modelIds.join(', ')}` : ''}`, ...caveats.map((caveat) => `  Caveat: ${caveat}`)];
  });
  const lines = ['PURETRONICS — APPLICATION REVIEW BRIEF', '', `Relevant capability paths: ${capabilityPaths.join('; ') || 'To be confirmed'}`, '', 'PRODUCT AND MODEL FIT', ...(resultLines.length ? resultLines : ['No capability path selected yet.']), '', 'KNOWN INFORMATION', ...known.map((item) => `${item.label}: ${item.value}`), '', 'OPEN QUESTIONS', ...(open.length ? open.map((item) => `• ${item}`) : ['No open questions recorded.']), '', 'SUGGESTED MATERIALS', ...suggestedMaterials.map((item) => `• ${item}`), '', 'Results reflect current approved public V4 information. Final equipment and configuration selection requires Puretronics application review.'];
  return { title: 'Puretronics Application Review Brief', known, open, capabilityPaths, suggestedMaterials, evaluations, text: lines.join('\n') };
}
