export const productionStages = [
  { id: 'payoff-unwind', label: 'Pay-Off / Unwind', description: 'Material enters the line; tension sensing, indication, control and braking may be relevant.', kind: 'inline' },
  { id: 'joining-repair', label: 'Conductor Joining / Repair', description: 'Conductor joining or repair before downstream processing.', kind: 'inline' },
  { id: 'tension-braking', label: 'Tension / Braking', description: 'Distinct indication, sensing, control and braking roles.', kind: 'inline' },
  { id: 'pre-extrusion', label: 'Preheating and Other Pre-Extrusion Preparation', description: 'Conductor preheating and powder application occur before extrusion where required.', kind: 'inline' },
  { id: 'extrusion', label: 'Extrusion / Insulation / Sheathing', description: 'Process context between preparation and downstream inspection.', kind: 'inline' },
  { id: 'cooling-inspection', label: 'Cooling and Inline Inspection', description: 'Cooling and the installed transition to inline inspection.', kind: 'inline' },
  { id: 'dimensional-measurement', label: 'Dimensional Measurement', description: 'Inline diameter measurement, control and validated lump/neck detection.', kind: 'inline' },
  { id: 'spark-fault', label: 'Spark Testing and Fault Response', description: 'Inline insulation-fault detection and applicable downstream response.', kind: 'inline' },
  { id: 'takeup-rewind', label: 'Take-Up / Rewind / Coiling', description: 'Downstream handling where tension roles and fault response may be relevant.', kind: 'inline' },
  { id: 'offline-hv-testing', label: 'Offline High-Voltage Testing', description: 'Separate AC or DC cable/sample validation.', kind: 'offline' },
  { id: 'fire-resistance-testing', label: 'Fire-Resistance Testing', description: 'Project-specific fire and circuit-integrity test systems.', kind: 'offline' },
] as const;

export const problemOptions = [
  ['diameter-variation', 'Diameter Variation or Inadequate Measurement Visibility'],
  ['lump-neck', 'Lumps, Necks or Dimensional Irregularities'],
  ['insulation-faults', 'Inline Insulation-Fault Detection'],
  ['offline-hv', 'Offline High-Voltage Testing'],
  ['fire-resistance', 'Fire-Resistance or Circuit-Integrity Testing'],
  ['wire-preheating', 'Conductor Preheating'],
  ['powder-application', 'Powder Application'],
  ['joining-repair', 'Conductor Joining or Repair'],
  ['tension-visibility', 'Tension Visibility or Indication'],
  ['tension-instability', 'Unstable Tension or Repeated Adjustment'],
  ['load-sensing', 'Load or Tension Sensing'],
  ['braking', 'Pay-Off or Unwind Braking'],
  ['multiple-issues', 'More Than One Issue'],
  ['not-sure', 'Not Sure How to Describe It'],
] as const;

export const requirementDefinitions = [
  { id: 'inline-dimensional', label: 'Inline Dimensional Measurement', problemIds: ['diameter-variation'], productIds: ['P01', 'P02', 'P03'] },
  { id: 'lump-neck', label: 'Lump-and-Neck Detection', problemIds: ['lump-neck'], productIds: ['P03'] },
  { id: 'inline-fault', label: 'Inline Insulation-Fault Detection', problemIds: ['insulation-faults'], productIds: ['P04'] },
  { id: 'offline-hv', label: 'Offline High-Voltage Testing', problemIds: ['offline-hv'], productIds: ['P05'] },
  { id: 'fire', label: 'Fire-Resistance or Circuit-Integrity Testing', problemIds: ['fire-resistance'], productIds: ['P06'] },
  { id: 'preheating', label: 'Conductor Preheating', problemIds: ['wire-preheating'], productIds: ['P07'] },
  { id: 'powder', label: 'Powder Application', problemIds: ['powder-application'], productIds: ['P08'] },
  { id: 'joining', label: 'Conductor Joining or Repair', problemIds: ['joining-repair'], productIds: ['P09'] },
  { id: 'indication', label: 'Tension Indication', problemIds: ['tension-visibility', 'tension-instability'], productIds: ['P10'] },
  { id: 'sensing', label: 'Load or Tension Sensing', problemIds: ['load-sensing', 'tension-visibility', 'tension-instability'], productIds: ['P12'] },
  { id: 'control', label: 'Active Tension Control', problemIds: ['tension-instability'], productIds: ['P11'] },
  { id: 'braking', label: 'Pneumatic Braking', problemIds: ['braking', 'tension-instability'], productIds: ['P13'] },
] as const;

export const projectOptions = [
  ['new-line', 'New Production Line'], ['retrofit', 'Existing-Line Retrofit'], ['replacement', 'Replacement'], ['laboratory', 'Laboratory Project'], ['oem', 'OEM / Machine Build'], ['support', 'Existing-Equipment Support'],
] as const;
