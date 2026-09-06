export const productionStages = [
  { id: 'conductor-preparation', label: 'Conductor Preparation', description: 'Joining, repair and preparation before downstream production.' },
  { id: 'payoff-tension', label: 'Pay-Off and Tension', description: 'Sensing, indication, control and braking at unwind or pay-off.' },
  { id: 'preheating', label: 'Conductor Preheating', description: 'Inline induction preheating before extrusion.' },
  { id: 'extrusion', label: 'Extrusion Support', description: 'Process context for preheating and inline quality measurement.' },
  { id: 'inline-measurement', label: 'Inline Measurement', description: 'Diameter measurement, control and validated lump/neck detection.' },
  { id: 'inline-spark-testing', label: 'Inline Spark Testing', description: 'Insulation-fault detection during production.' },
  { id: 'powder-application', label: 'Powder Application', description: 'Talcum or graphite application in the reviewed line position.' },
  { id: 'takeup-tension', label: 'Take-Up and Line Control', description: 'Tension sensing, control and related actuation.' },
  { id: 'offline-hv-testing', label: 'Offline High-Voltage Testing', description: 'Separate AC or DC cable/sample validation.' },
  { id: 'fire-resistance-testing', label: 'Fire-Resistance Testing', description: 'Project-specific fire and circuit-integrity test systems.' },
] as const;

export const problemOptions = [
  ['diameter-variation', 'Diameter Variation or Dimensional Consistency'],
  ['lump-neck', 'Lump-and-Neck Detection'],
  ['insulation-faults', 'Inline Insulation-Fault Detection'],
  ['offline-hv', 'Offline High-Voltage Testing'],
  ['fire-resistance', 'Fire-Resistance or Circuit-Integrity Testing'],
  ['wire-preheating', 'Conductor Preheating'],
  ['powder-application', 'Powder Application'],
  ['joining-repair', 'Conductor Joining or Repair'],
  ['tension-visibility', 'Tension Visibility or Indication'],
  ['tension-instability', 'Unstable Tension or Repeated Adjustment'],
  ['braking', 'Pay-Off or Unwind Braking'],
] as const;

export const projectOptions = [
  ['new-line', 'New Production Line'], ['retrofit', 'Existing-Line Retrofit'], ['replacement', 'Replacement'], ['laboratory', 'Laboratory Project'], ['oem', 'OEM / Machine Build'], ['support', 'Existing-Equipment Support'],
] as const;
