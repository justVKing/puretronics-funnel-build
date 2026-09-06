import type { ProductRelationship } from '../types/catalog';

export const relationships: ProductRelationship[] = [
  { from: 'P01', to: 'P02', kind: 'alternative_to', reason: 'Both provide inline dimensional measurement; model range and measurement architecture determine fit.' },
  { from: 'P02', to: 'P01', kind: 'alternative_to', reason: 'Both provide inline dimensional measurement; model range and measurement architecture determine fit.' },
  { from: 'P01', to: 'P04', kind: 'works_with', reason: 'Measurement and insulation-fault detection can occupy complementary inline quality-control stages.' },
  { from: 'P07', to: 'P01', kind: 'works_with', reason: 'Preheating and downstream inline measurement may form separate roles in an extrusion line.' },
  { from: 'P10', to: 'P12', kind: 'works_with', reason: 'An indicator and a sensing element may work together when the reviewed architecture requires both roles.' },
  { from: 'P12', to: 'P11', kind: 'supports', reason: 'A loadcell or transducer can provide feedback for a reviewed controller architecture.' },
  { from: 'P11', to: 'P13', kind: 'works_with', reason: 'A controller and pneumatic brake may provide control and actuation roles in a reviewed tension system.' },
  { from: 'P12', to: 'P13', kind: 'works_with', reason: 'Sensing and braking are complementary roles, not substitutes.' },
];
