export const productionStages = [
  { id: 'conductor-preparation', label: 'Conductor preparation', description: 'Joining, repair and preparation before downstream production.' },
  { id: 'payoff-tension', label: 'Pay-off and tension', description: 'Sensing, indication, control and braking at unwind or pay-off.' },
  { id: 'preheating', label: 'Conductor preheating', description: 'Inline induction preheating before extrusion.' },
  { id: 'extrusion', label: 'Extrusion support', description: 'Process context for preheating and inline quality measurement.' },
  { id: 'inline-measurement', label: 'Inline measurement', description: 'Diameter measurement, control and validated lump/neck detection.' },
  { id: 'inline-spark-testing', label: 'Inline spark testing', description: 'Insulation-fault detection during production.' },
  { id: 'powder-application', label: 'Powder application', description: 'Talcum or graphite application in the reviewed line position.' },
  { id: 'takeup-tension', label: 'Take-up and line control', description: 'Tension sensing, control and related actuation.' },
  { id: 'offline-hv-testing', label: 'Offline high-voltage testing', description: 'Separate AC or DC cable/sample validation.' },
  { id: 'fire-resistance-testing', label: 'Fire-resistance testing', description: 'Project-specific fire and circuit-integrity test systems.' },
] as const;

export const problemOptions = [
  ['diameter-variation', 'Diameter variation or dimensional consistency'],
  ['lump-neck', 'Lump-and-neck detection'],
  ['insulation-faults', 'Inline insulation-fault detection'],
  ['offline-hv', 'Offline high-voltage testing'],
  ['fire-resistance', 'Fire-resistance or circuit-integrity testing'],
  ['wire-preheating', 'Conductor preheating'],
  ['powder-application', 'Powder application'],
  ['joining-repair', 'Conductor joining or repair'],
  ['tension-visibility', 'Tension visibility or indication'],
  ['tension-instability', 'Unstable tension or repeated adjustment'],
  ['braking', 'Pay-off or unwind braking'],
] as const;

export const projectOptions = [
  ['new-line', 'New production line'], ['retrofit', 'Existing-line retrofit'], ['replacement', 'Replacement'], ['laboratory', 'Laboratory project'], ['oem', 'OEM / machine build'], ['support', 'Existing-equipment support'],
] as const;
