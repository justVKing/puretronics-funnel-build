import { productById } from '../data/catalog';
import { relationships } from '../data/relationships';
import type { ComparisonMode } from '../types/explorer';

export function comparisonEligibility(productIds: string[], mode: ComparisonMode) {
  const selected = productIds.map((id) => productById.get(id)).filter(Boolean);
  if (mode === 'variants') {
    return selected.length === 1
      ? { eligible: selected[0]!.models.length > 1, reason: 'Variant comparison stays within one Primary Product.' }
      : { eligible: false, reason: 'Choose one Primary Product and compare its validated models.' };
  }
  if (selected.length < 2) return { eligible: false, reason: 'Select at least two options to compare.' };
  if (mode === 'alternatives') {
    const direct = selected.every((product, index) => index === 0 || relationships.some((r) => r.kind === 'alternative_to' && ((r.from === selected[0]!.id && r.to === product!.id) || (r.to === selected[0]!.id && r.from === product!.id))));
    const sameGroup = selected.every((product) => product!.comparisonGroup === selected[0]!.comparisonGroup);
    return direct || sameGroup
      ? { eligible: true, reason: 'These options share a governed technical comparison role.' }
      : { eligible: false, reason: 'These selections perform different roles. View how they work together instead.' };
  }
  const connected = selected.every((product, index) => index === 0 || relationships.some((r) => r.kind !== 'alternative_to' && [r.from, r.to].includes(selected[0]!.id) && [r.from, r.to].includes(product!.id)) || product!.familyId === 'PF05' && selected[0]!.familyId === 'PF05');
  return connected
    ? { eligible: true, reason: 'System view explains how these complementary roles may work together; it does not present them as substitutes.' }
    : { eligible: true, reason: 'System view compares equipment roles across the selected production or testing path.' };
}
