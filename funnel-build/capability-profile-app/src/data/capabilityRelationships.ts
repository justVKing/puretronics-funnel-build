import { products } from './catalog';
import { productionStages, requirementDefinitions } from './productionStages';
import type { CapabilityRelationship, CapabilityRelationshipType } from '../types/catalog';

const primaryStages: Record<string, string> = {
  P01: '08 Online Measurement', P02: '08 Online Measurement', P03: '08 Online Measurement', P04: '09 Spark / Fault Inspection',
  P05: '12 Offline HV Testing', P06: '13 Fire / Compliance Testing', P07: '04 Pre-extrusion / Preheating',
  P08: '05 Powdering / Talc Application', P09: '02 Joining / Butt Welding', P10: '03 Tension & Braking Control',
  P11: '03 Tension & Braking Control', P12: '03 Tension & Braking Control', P13: '03 Tension & Braking Control',
};

const stageLinks: Array<[string, string, CapabilityRelationshipType, string]> = [
  ['P10', 'payoff-unwind', 'adjacent', 'Provides tension indication in applicable pay-off arrangements.'],
  ['P11', 'payoff-unwind', 'adjacent', 'Provides the controller role in a reviewed pay-off tension architecture.'],
  ['P12', 'payoff-unwind', 'adjacent', 'Provides the sensing role in applicable pay-off arrangements.'],
  ['P13', 'payoff-unwind', 'adjacent', 'Provides pneumatic braking actuation in applicable pay-off arrangements.'],
  ['P09', 'joining-repair', 'primary', 'Supports conductor joining and repair.'],
  ['P10', 'tension-braking', 'primary', 'Indicates tension; it is not an active controller.'],
  ['P11', 'tension-braking', 'primary', 'Processes feedback and commands a reviewed tension-control response.'],
  ['P12', 'tension-braking', 'primary', 'Senses load or tension for indication or control architectures.'],
  ['P13', 'tension-braking', 'primary', 'Provides pneumatic braking actuation.'],
  ['P07', 'pre-extrusion', 'primary', 'Preheats conductor inline before extrusion.'],
  ['P08', 'pre-extrusion', 'primary', 'Applies talcum or graphite powder before extrusion where the process requires it.'],
  ['P07', 'extrusion', 'adjacent', 'Supports the process immediately before extrusion.'],
  ['P01', 'cooling-inspection', 'adjacent', 'May be installed downstream where line arrangement supports dimensional inspection.'],
  ['P02', 'cooling-inspection', 'adjacent', 'May be installed downstream where line arrangement supports dimensional inspection.'],
  ['P03', 'cooling-inspection', 'adjacent', 'May be installed downstream where line arrangement supports measurement and lump/neck detection.'],
  ['P04', 'cooling-inspection', 'adjacent', 'May be installed downstream where line arrangement supports spark testing.'],
  ['P01', 'dimensional-measurement', 'primary', 'Provides inline dimensional measurement.'],
  ['P02', 'dimensional-measurement', 'primary', 'Provides inline dimensional measurement across model-specific ranges.'],
  ['P03', 'dimensional-measurement', 'primary', 'Provides measurement and validated lump-and-neck detection.'],
  ['P04', 'spark-fault', 'primary', 'Provides inline insulation-fault detection.'],
  ['P04', 'takeup-rewind', 'downstream-response', 'Fault response may inform downstream handling where the reviewed line architecture supports it.'],
  ['P10', 'takeup-rewind', 'adjacent', 'Provides tension indication in applicable take-up arrangements.'],
  ['P11', 'takeup-rewind', 'adjacent', 'Provides active-control logic in a reviewed take-up architecture.'],
  ['P12', 'takeup-rewind', 'adjacent', 'Provides load or tension sensing in applicable take-up arrangements.'],
  ['P13', 'takeup-rewind', 'adjacent', 'May provide braking actuation in applicable rewind arrangements.'],
  ['P05', 'offline-hv-testing', 'primary', 'Supports separate AC or DC offline high-voltage testing.'],
  ['P06', 'fire-resistance-testing', 'primary', 'Supports project-specific fire-resistance or circuit-integrity testing.'],
];

const requirementsByProduct = new Map<string, string[]>();
for (const requirement of requirementDefinitions) for (const productId of requirement.productIds) {
  requirementsByProduct.set(productId, [...(requirementsByProduct.get(productId) ?? []), requirement.id]);
}

export const capabilityRelationships: CapabilityRelationship[] = stageLinks.map(([productId, orientationStageId, relationshipType, explanation]) => {
  const product = products.find((item) => item.id === productId)!;
  return {
    productId, familyId: product.familyId, requirementIds: requirementsByProduct.get(productId) ?? [],
    primaryV4Stage: primaryStages[productId], orientationStageId, relationshipType, projectRoutes: product.projectRoutes,
    systemRole: product.systemRole, sourceAuthority: relationshipType === 'primary' ? 'Product Database V4' : 'Interactive Sections Specification',
    approved: true, explanation,
  };
});

export function validateCapabilityRelationships() {
  const errors: string[] = [];
  const validProducts = new Set(products.map((product) => product.id));
  const validStages = new Set(productionStages.map((stage) => stage.id));
  const validRequirements = new Set(requirementDefinitions.map((requirement) => requirement.id));
  for (const relationship of capabilityRelationships) {
    if (!validProducts.has(relationship.productId)) errors.push(`Unknown Product: ${relationship.productId}`);
    if (!validStages.has(relationship.orientationStageId as never)) errors.push(`Unknown Stage: ${relationship.orientationStageId}`);
    if (relationship.requirementIds.some((id) => !validRequirements.has(id as never))) errors.push(`Unknown Requirement on ${relationship.productId}`);
  }
  for (const product of products) if (!capabilityRelationships.some((relationship) => relationship.productId === product.id && relationship.relationshipType === 'primary')) errors.push(`No Primary Placement: ${product.id}`);
  return errors;
}

export const relationshipsForStage = (stageId: string) => capabilityRelationships.filter((relationship) => relationship.orientationStageId === stageId);
