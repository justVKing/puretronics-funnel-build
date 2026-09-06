import type { ProductFamily, ProductRecord } from '../types/catalog';

const governance = (evidence: 'Validated' | 'Source-Limited' = 'Validated') => ({
  approval: 'Approved' as const,
  claimState: 'Current' as const,
  evidence,
  qa: 'Public' as const,
  lastValidated: '2026-09-05',
});

const datum = (label: string, display: string, kind: 'range' | 'speed' | 'voltage' | 'capacity' | 'temperature' | 'feature' | 'availability', sourceRecord: string, qualifier?: string) => ({ label, display, kind, sourceRecord, qualifier });

export const families: ProductFamily[] = [
  { id: 'PF01', name: 'Inline Measurement and Dimensional Control', summary: 'Monitor wire and cable dimensions during production and bring clearer measurement visibility into quality and process-control decisions.', selectionInputs: 'Diameter range, material and construction, line speed, measurement location, axes, control and output needs.' },
  { id: 'PF02', name: 'Inline Spark Testing and Insulation Fault Detection', summary: 'Detect insulation faults during production and review the appropriate spark-testing method and fault-information requirement.', selectionInputs: 'Construction, insulation, diameter, speed, test method, voltage, fault response, data and calibration needs.' },
  { id: 'PF03', name: 'Cable Testing and Validation', summary: 'Review offline electrical and specialised fire-resistance cable-testing requirements with method and project context separated.', selectionInputs: 'Test objective, AC/DC method, sample, voltage/current, procedure, environment, reporting and acceptance.' },
  { id: 'PF04', name: 'Process Equipment and Line Auxiliaries', summary: 'Support conductor preheating, powder application and conductor joining or repair.', selectionInputs: 'Construction, size, line speed, target temperature, powder, installation space, utilities and interfaces.' },
  { id: 'PF05', name: 'Tension / Braking / Line Control', summary: 'Distinguish tension indication, sensing, active control and pneumatic braking across tension-sensitive processes.', selectionInputs: 'Material, dimension, tension/load, speed, reel geometry, control mode, air supply and mounting.' },
];

export const products: ProductRecord[] = [
  {
    id: 'P01', order: 1, familyId: 'PF01', name: 'LASER 2008 Series Diameter Measurement Platform', shortName: 'LASER 2008 Series', aliases: ['laser 2008', 'laser 2008b'], systemRole: 'Inline measurement and control',
    role: 'Continuous non-contact diameter measurement with control functions depending on validated configuration.', primaryFunction: 'Measures wire and cable diameter inline and supports clearer process-control decisions.',
    buyerProblems: ['diameter-variation', 'dimensional-consistency'], stages: ['inline-measurement', 'extrusion'], projectRoutes: ['new-line', 'retrofit', 'replacement', 'oem'], useCases: ['Inline diameter measurement after extrusion, insulation or sheathing'],
    selectionFactors: ['Minimum and maximum diameter', 'Line speed', 'Measurement location', 'Control and output requirements'],
    specs: [datum('Measurement range', '0.8–150 mm across the series', 'range', 'P01'), datum('Scan rate', '416 scans/second', 'speed', 'P01'), datum('Scan velocity', '156–210 m/s by model', 'speed', 'P01')],
    models: [
      { id: 'P01A', name: 'LASER 2008', aliases: ['2008'], specs: [datum('Measurement range', '0.8–35 mm', 'range', 'P01A'), datum('Scan velocity', '156 m/s', 'speed', 'P01A'), datum('Scan rate', '416 scans/second', 'speed', 'P01A')] },
      { id: 'P01B', name: 'LASER 2008B', aliases: ['2008b'], specs: [datum('Measurement range', '1.0–150 mm', 'range', 'P01B'), datum('Scan velocity', '210 m/s', 'speed', 'P01B'), datum('Scan rate', '416 scans/second', 'speed', 'P01B')] },
    ], caveats: ['Control functions depend on the validated configuration and interfaces.'], availability: 'Standard platform; configuration review required.', comparisonGroup: 'diameter-2008', image: 'products/ldg-thumb.jpg', governance: governance(),
  },
  {
    id: 'P02', order: 2, familyId: 'PF01', name: 'LASER 2000 Series Scan Micrometers', shortName: 'LASER 2000 Series', aliases: ['laser 2012', 'laser 2030', 'laser 2060', 'scan micrometer'], systemRole: 'High-frequency dual-axis measurement',
    role: 'High-frequency dual-axis scan micrometers for model-specific measurement ranges.', primaryFunction: 'Provides non-contact dimensional measurement across three validated model ranges.',
    buyerProblems: ['diameter-variation', 'dimensional-consistency'], stages: ['inline-measurement', 'extrusion'], projectRoutes: ['new-line', 'retrofit', 'replacement', 'oem'], useCases: ['Inline wire and cable diameter measurement'],
    selectionFactors: ['Required range', 'Number of axes', 'Line conditions', 'Output requirements'], specs: [datum('Series measurement range', '0.1–65 mm across models', 'range', 'P02'), datum('Measurement frequency', '800 times/second per axis', 'speed', 'P02')],
    models: [
      { id: 'P02A', name: 'LASER-2012', aliases: ['laser 2012', '2012'], specs: [datum('Measurement range', '0.1–12 mm', 'range', 'P02A'), datum('Measurement frequency', '800 times/second per axis', 'speed', 'P02A')] },
      { id: 'P02B', name: 'LASER-2030', aliases: ['laser 2030', '2030'], specs: [datum('Measurement range', '0.1–30 mm', 'range', 'P02B'), datum('Measurement frequency', '800 times/second per axis', 'speed', 'P02B')] },
      { id: 'P02C', name: 'LASER-2060', aliases: ['laser 2060', '2060'], specs: [datum('Measurement range', '0.5–65 mm', 'range', 'P02C'), datum('Measurement frequency', '800 times/second per axis', 'speed', 'P02C')] },
    ], caveats: ['Select models by validated range and complete application conditions.'], availability: 'Standard models.', comparisonGroup: 'diameter-2000', image: 'products/ldg-thumb.jpg', governance: governance(),
  },
  {
    id: 'P03', order: 3, familyId: 'PF01', name: 'LASER-H Series Diameter Measurement, Control and Lump/Neck Detection', shortName: 'LASER-H Series', aliases: ['laser 2010h', 'laser 2020h', 'laser 2030h', 'lump neck detector'], systemRole: 'Measurement, control and validated lump/neck detection',
    role: 'Inline diameter measurement and control with validated lump-and-neck detection.', primaryFunction: 'Measures diameter and detects validated lump-and-neck conditions at high sampling frequency.',
    buyerProblems: ['diameter-variation', 'dimensional-consistency', 'lump-neck'], stages: ['inline-measurement', 'extrusion'], projectRoutes: ['new-line', 'retrofit', 'replacement', 'oem'], useCases: ['Diameter measurement', 'Lump-and-neck detection'],
    selectionFactors: ['Diameter range', 'Condition of interest', 'Control/output requirements', 'Line arrangement'], specs: [datum('Sampling frequency', '20 kHz', 'speed', 'P03'), datum('Single-axis sampling', '10 kHz', 'speed', 'P03')],
    models: [
      { id: 'P03A', name: 'LASER-2010H', aliases: ['2010h'], specs: [datum('Measurement range', '0.1–10 mm', 'range', 'P03A'), datum('Scanning frequency', '20 kHz', 'speed', 'P03A'), datum('Single-axis sampling', '10 kHz', 'speed', 'P03A')] },
      { id: 'P03B', name: 'LASER-2020H', aliases: ['2020h'], specs: [datum('Measurement range', '0.3–20 mm', 'range', 'P03B'), datum('Scanning frequency', '20 kHz', 'speed', 'P03B'), datum('Single-axis sampling', '10 kHz', 'speed', 'P03B')] },
      { id: 'P03C', name: 'LASER-2030H', aliases: ['2030h'], specs: [datum('Measurement range', '0.3–30 mm', 'range', 'P03C'), datum('Scanning frequency', '20 kHz', 'speed', 'P03C'), datum('Single-axis sampling', '10 kHz', 'speed', 'P03C')] },
    ], caveats: ['Lump-and-neck detection is validated; this is not a general surface-defect inspection claim.'], availability: 'Standard models.', comparisonGroup: 'laser-h', image: 'products/ldg-thumb.jpg', governance: governance(),
  },
  {
    id: 'P04', order: 4, familyId: 'PF02', name: 'Inline Spark Testing Platform', shortName: 'Inline Spark Testing', aliases: ['live spark tester', 'acute spark tester', 'dc spark tester', 'spark tester'], systemRole: 'Inline insulation-fault detection',
    role: 'Live, Acute and DC test paths with model-specific voltage, diameter and speed limits.', primaryFunction: 'Detects insulation faults inline using the selected validated test principle.',
    buyerProblems: ['insulation-faults', 'quality-detection'], stages: ['inline-spark-testing', 'extrusion'], projectRoutes: ['new-line', 'retrofit', 'replacement', 'oem'], useCases: ['Inline insulation-fault detection', 'Fault information and downstream response review'],
    selectionFactors: ['Test principle', 'Voltage', 'Cable diameter', 'Line speed', 'Fault response', 'Data, marking and calibration needs'], specs: [datum('Platform voltage context', '1.5–30 kV, model dependent', 'voltage', 'P04'), datum('Platform speed context', '200–2500 m/min, model dependent', 'speed', 'P04')],
    models: [
      { id: 'P04A', name: 'Live Spark Tester', aliases: ['live'], specs: [datum('Test principle', 'Live AC at supply frequency', 'feature', 'P04A'), datum('Voltage paths', '1.5–15 / 25 / 30 kV', 'voltage', 'P04A'), datum('Cable diameter', '0.5–40 mm; 60 mm on demand', 'range', 'P04A'), datum('Line speed', 'Up to 200 m/min', 'speed', 'P04A')] },
      { id: 'P04B', name: 'Acute Spark Tester', aliases: ['acute'], specs: [datum('Test principle', 'High-frequency sine-wave AC', 'feature', 'P04B'), datum('Voltage paths', '1.5–10 / 15 kV', 'voltage', 'P04B'), datum('Cable diameter', '0.5–15 mm', 'range', 'P04B'), datum('Line speed', 'Up to 1500 m/min', 'speed', 'P04B')] },
      { id: 'P04C', name: 'DC Spark Tester', aliases: ['dc'], specs: [datum('Test principle', 'Direct current', 'feature', 'P04C'), datum('Voltage paths', '1.5–15 / 20 kV', 'voltage', 'P04C'), datum('Cable diameter', '0.5–15 mm; 30 mm on demand', 'range', 'P04C'), datum('Line speed', 'Up to 2500 m/min, model dependent', 'speed', 'P04C')] },
    ], caveats: ['Live, Acute and DC values are model-specific and must not be blended.', 'Fault interface, logging, marking and calibration support are shown only where applicable.'], availability: 'Standard and on-demand options as identified by model.', comparisonGroup: 'spark-method', image: 'products/spark-thumb.jpg', governance: governance(),
  },
  {
    id: 'P05', order: 5, familyId: 'PF03', name: 'Offline High-Voltage Tester Platform', shortName: 'Offline High-Voltage Testers', aliases: ['hv tester', 'high voltage tester', 'ac hv', 'dc hv'], systemRole: 'Offline electrical validation', role: 'Separate AC and DC offline high-voltage test paths.', primaryFunction: 'Supports offline high-voltage testing of finished cable or samples.',
    buyerProblems: ['offline-hv', 'quality-validation'], stages: ['offline-hv-testing'], projectRoutes: ['laboratory', 'replacement', 'new-line'], useCases: ['Finished-cable and laboratory high-voltage testing'], selectionFactors: ['AC or DC method', 'Voltage/current', 'Sample', 'Test procedure', 'Throughput and reporting'],
    specs: [], models: [
      { id: 'P05A', name: 'AC High-Voltage Tester', aliases: ['ac high voltage'], specs: [datum('Test method', 'Alternating current (AC)', 'feature', 'P05A'), datum('Voltage', 'Up to 40 kV', 'voltage', 'P05A'), datum('Current', 'Up to 1 A', 'capacity', 'P05A')], caveat: 'Requirements above 40 kV are request-based.' },
      { id: 'P05B', name: 'DC High-Voltage Tester', aliases: ['dc high voltage'], specs: [datum('Test method', 'Direct current (DC)', 'feature', 'P05B'), datum('Voltage', '0.5–20 kV', 'voltage', 'P05B'), datum('Current', '1 mA', 'capacity', 'P05B')], caveat: 'Other voltage requirements are request-based.' },
    ], caveats: ['AC and DC capabilities are separate and must not be combined into one value.'], availability: 'Standard and request-based configurations.', comparisonGroup: 'offline-hv', image: 'products/hv-tester-thumb.jpg', governance: governance(),
  },
  {
    id: 'P06', order: 6, familyId: 'PF03', name: 'Fire Resistance Cable Testing System', shortName: 'Fire Resistance Testing System', aliases: ['fire alarm cable tester', 'circuit integrity', 'fire resistance'], systemRole: 'Project-specific laboratory validation', role: 'Project-configured fire-resistance or circuit-integrity test system.', primaryFunction: 'Supports defined fire-resistance cable test projects against the supplied method and system requirements.',
    buyerProblems: ['fire-resistance', 'quality-validation'], stages: ['fire-resistance-testing'], projectRoutes: ['laboratory', 'new-line'], useCases: ['Project-specific fire-resistance and circuit-integrity testing'], selectionFactors: ['Test method', 'Cable/sample context', 'Applicable specification', 'System configuration', 'Utilities and acceptance'], specs: [], models: [],
    caveats: ['This is a project-specific system. No universal test standard, configuration or performance claim is implied.'], availability: 'Project-specific system.', comparisonGroup: 'fire-system', image: 'products/fire-alarm.jpg', governance: governance('Source-Limited'),
  },
  {
    id: 'P07', order: 7, familyId: 'PF04', name: 'Inline Induction Wire Preheater', shortName: 'Induction Wire Preheater', aliases: ['wire preheater', 'ph10019c', 'induction preheater'], systemRole: 'Conductor preparation', role: 'Inline induction preheating before extrusion.', primaryFunction: 'Preheats solid or bunched conductor inline before extrusion.',
    buyerProblems: ['wire-preheating', 'process-stability'], stages: ['preheating', 'extrusion'], projectRoutes: ['new-line', 'retrofit', 'replacement', 'oem'], useCases: ['Conductor preheating before extrusion'], selectionFactors: ['Solid or bunched conductor', 'Wire size', 'Line speed', 'Target temperature', 'Installation and utilities'],
    specs: [datum('Solid conductor', '0.1–10 mm', 'range', 'P07'), datum('Bunched conductor', '0.1–16 mm', 'range', 'P07'), datum('Target temperature', '60–180 °C', 'temperature', 'P07'), datum('Validated speed configurations', '40–2000 m/min', 'speed', 'P07')],
    models: [
      { id: 'P07A', name: 'PH10019C / 1000', aliases: ['ph10019c 1000'], specs: [datum('Line speed', 'Up to 1000 m/min; depends on wire diameter', 'speed', 'P07A'), datum('Wire range', '0.4–3.6 mm', 'range', 'P07A'), datum('Target temperature', '60–180 °C', 'temperature', 'P07A')] },
      { id: 'P07B', name: 'PH10019C / 1500', aliases: ['ph10019c 1500'], specs: [datum('Line speed', 'Up to 1500 m/min; depends on wire diameter', 'speed', 'P07B'), datum('Wire range', '0.5–2.8 mm', 'range', 'P07B'), datum('Target temperature', '60–180 °C', 'temperature', 'P07B')] },
      { id: 'P07C', name: 'PH10019C / 2000', aliases: ['ph10019c 2000'], specs: [datum('Line speed', 'Up to 2000 m/min; depends on wire diameter', 'speed', 'P07C'), datum('Wire range', '0.3–1.4 mm', 'range', 'P07C'), datum('Target temperature', '60–180 °C', 'temperature', 'P07C')] },
    ], caveats: ['Speed, conductor range and target temperature are configuration-dependent.'], availability: 'Configured variants.', comparisonGroup: 'preheater', image: 'products/preheater-thumb.jpg', governance: governance(),
  },
  {
    id: 'P08', order: 8, familyId: 'PF04', name: 'LSP Static Powder Applicator', shortName: 'LSP Powder Applicator', aliases: ['lsp', 'static powder', 'talcum applicator', 'graphite applicator'], systemRole: 'Powder application', role: 'Static applicator for validated talcum or graphite powder variants.', primaryFunction: 'Applies powder consistently at a defined production stage with model-specific size and speed limits.',
    buyerProblems: ['powder-application', 'process-stability'], stages: ['powder-application'], projectRoutes: ['new-line', 'retrofit', 'replacement', 'oem'], useCases: ['Talcum powder application', 'Graphite powder application'], selectionFactors: ['Powder type', 'Product size', 'Line speed', 'Earthing', 'Air quality and installation'], specs: [],
    models: [
      { id: 'P08A', name: 'LSP G1', aliases: ['g1'], specs: [datum('Product size', 'Up to 40 mm', 'range', 'P08A'), datum('Line speed', 'Up to 150 m/min', 'speed', 'P08A')] },
      { id: 'P08B', name: 'LSP G2', aliases: ['g2'], specs: [datum('Product size', 'Up to 40 mm', 'range', 'P08B'), datum('Line speed', 'Up to 250 m/min', 'speed', 'P08B')] },
      { id: 'P08C', name: 'LSP G3', aliases: ['g3'], specs: [datum('Product size', 'Up to 40 mm', 'range', 'P08C'), datum('Line speed', 'Up to 400 m/min', 'speed', 'P08C')] },
      { id: 'P08D', name: 'LSP G2-100', aliases: ['g2-100'], specs: [datum('Product size', 'Up to 100 mm', 'range', 'P08D'), datum('Line speed', 'Up to 150 m/min', 'speed', 'P08D')] },
      { id: 'P08E', name: 'LSP G2-GR50', aliases: ['g2-gr50'], specs: [datum('Powder', 'Graphite', 'feature', 'P08E'), datum('Product size', 'Up to 40 mm', 'range', 'P08E'), datum('Line speed', 'Up to 150 m/min', 'speed', 'P08E')] },
      { id: 'P08F', name: 'LSP G2-GR250', aliases: ['g2-gr250'], specs: [datum('Powder', 'Graphite', 'feature', 'P08F'), datum('Product size', 'Up to 100 mm', 'range', 'P08F'), datum('Line speed', 'Up to 100 m/min', 'speed', 'P08F')] },
    ], caveats: ['Powder must be clean, dry and uncontaminated.', 'Earthing below 1 V and moisture/mist-free panel air are required operating considerations.'], availability: 'Standard validated variants.', comparisonGroup: 'lsp', governance: governance(),
  },
  {
    id: 'P09', order: 9, familyId: 'PF04', name: 'Butt Welding Machine', shortName: 'Butt Welding Machine', aliases: ['butt welder', 'wire welding'], systemRole: 'Conductor joining and repair', role: 'Joins documented copper or aluminium conductor ranges.', primaryFunction: 'Supports conductor joining, repair and production continuity for the reviewed material and range.',
    buyerProblems: ['joining-repair', 'production-continuity'], stages: ['conductor-preparation', 'joining-repair'], projectRoutes: ['new-line', 'retrofit', 'replacement'], useCases: ['Conductor joining and repair'], selectionFactors: ['Material', 'Conductor construction', 'Cross-section or diameter', 'Duty and installation'], specs: [], models: [], caveats: ['Confirmed selection depends on conductor material, construction and documented range.'], availability: 'Application reviewed.', comparisonGroup: 'butt-welder', image: 'products/butt-welding-thumb.jpg', governance: governance(),
  },
  {
    id: 'P10', order: 10, familyId: 'PF05', name: 'Wire Tension Indicator', shortName: 'Wire Tension Indicator', aliases: ['wti', 'wti-90-40', 'wti-100-40', 'tension display'], systemRole: 'Indication', role: 'Measures and indicates wire tension; it is not an active tension controller.', primaryFunction: 'Provides tension visibility for reviewed wire sizes and tension configurations.',
    buyerProblems: ['tension-visibility', 'tension-instability', 'wire-breaks'], stages: ['payoff-tension', 'takeup-tension'], projectRoutes: ['new-line', 'retrofit', 'replacement', 'oem'], useCases: ['Tension measurement and indication'], selectionFactors: ['Wire size', 'Tension range', 'Visibility need', 'Mounting'], specs: [],
    models: [
      { id: 'P10A', name: 'WTI-90-40', aliases: ['wti 90 40'], specs: [datum('Wire range', '0.2–5 mm', 'range', 'P10A'), datum('Published configurations', '15 kg / 40 kg', 'capacity', 'P10A')] },
      { id: 'P10B', name: 'WTI-100-40', aliases: ['wti 100 40'], specs: [datum('Wire range', '2–10 mm', 'range', 'P10B'), datum('Published configurations', '15 kg / 40 kg', 'capacity', 'P10B')] },
    ], caveats: ['This product indicates tension; it does not provide active closed-loop control.', 'Higher tension requirements are reviewed and quoted against the application.'], availability: 'Standard published configurations; other requirements by review.', comparisonGroup: 'wti', image: 'products/wire-tension-thumb.jpg', governance: governance(),
  },
  {
    id: 'P11', order: 11, familyId: 'PF05', name: 'LTC-PRO Web Tension Controller', shortName: 'LTC-PRO Controller', aliases: ['ltc-pro', 'ltc pro', 'tension controller'], systemRole: 'Control', role: 'Processes feedback and commands an active tension-control response.', primaryFunction: 'Provides the controller role in a reviewed closed-loop tension architecture.',
    buyerProblems: ['tension-instability', 'manual-adjustment', 'wire-breaks'], stages: ['payoff-tension', 'takeup-tension'], projectRoutes: ['new-line', 'retrofit', 'replacement', 'oem'], useCases: ['Closed-loop tension control'], selectionFactors: ['Feedback architecture', 'Setpoint', 'Machine interface', 'Existing sensor and actuator'], specs: [], models: [],
    caveats: ['The controller is one role in a system and requires reviewed sensing, actuation and machine interfaces.'], availability: 'Application reviewed.', comparisonGroup: 'tension-control', image: 'products/pure-tension-controller.jpg', governance: governance(),
  },
  {
    id: 'P12', order: 12, familyId: 'PF05', name: 'Loadcells and Tension Transducers', shortName: 'Loadcells and Transducers', aliases: ['loadcell', 'load cell', 'lc-ar-85', 'lc-ar-118', 'lc-ar-125', 'lc-ar-st', 'lc-ar-60', 'lc-ar-hd'], systemRole: 'Sensing', role: 'Senses load or tension for indication or control architectures.', primaryFunction: 'Provides model-specific load sensing across approved capacities and mounting arrangements.',
    buyerProblems: ['tension-visibility', 'tension-instability', 'load-feedback'], stages: ['payoff-tension', 'takeup-tension'], projectRoutes: ['new-line', 'retrofit', 'replacement', 'oem'], useCases: ['Tension sensing', 'Load feedback'], selectionFactors: ['Load range', 'Mounting', 'Direction', 'Environment', 'Signal context'], specs: [datum('Portfolio capacity', '10–5000 kg across models', 'capacity', 'P12')],
    models: [
      { id: 'P12A', name: 'LC-AR-85', aliases: ['ar85'], specs: [datum('Capacities', '10 / 20 / 50 / 100 kg', 'capacity', 'P12A'), datum('ATEX', 'Available only for LC-AR-85 where specified', 'feature', 'P12A')] },
      { id: 'P12B', name: 'LC-AR-118', aliases: ['ar118'], specs: [datum('Capacities', '50 / 100 / 200 / 500 kg', 'capacity', 'P12B')] },
      { id: 'P12C', name: 'LC-AR-125', aliases: ['ar125'], specs: [datum('Capacities', '50 / 100 / 200 / 500 kg', 'capacity', 'P12C')] },
      { id: 'P12D', name: 'LC-AR-ST', aliases: ['ar st'], specs: [datum('Capacities', '100 / 200 / 500 / 1000 kg', 'capacity', 'P12D')] },
      { id: 'P12E', name: 'LC-AR-60', aliases: ['ar60'], specs: [datum('Capacities', '10 / 20 / 50 kg', 'capacity', 'P12E')] },
      { id: 'P12F', name: 'LC-AR-HD', aliases: ['ar hd'], specs: [datum('Capacities', '100 / 500 / 1000 / 2000 / 5000 kg', 'capacity', 'P12F')] },
    ], caveats: ['Capacities, materials, certifications and ATEX status are model-specific.', 'ATEX must not be generalized beyond LC-AR-85.'], availability: 'Standard and custom options by model.', comparisonGroup: 'loadcell', image: 'products/loadcell-thumb.jpg', governance: governance(),
  },
  {
    id: 'P13', order: 13, familyId: 'PF05', name: 'Pneumatic Brake', shortName: 'Pneumatic Brake', aliases: ['ax250', 'ax-250', 'ax400', 'ax-400', 'ax500', 'ax-500', 'pneumatic brake'], systemRole: 'Actuation', role: 'Provides pneumatic braking actuation in applicable unwind or pay-off arrangements.', primaryFunction: 'Applies model-specific braking for reviewed reel geometry, speed, duty and air-supply conditions.',
    buyerProblems: ['tension-instability', 'braking', 'manual-adjustment', 'wire-breaks'], stages: ['payoff-tension', 'takeup-tension'], projectRoutes: ['new-line', 'retrofit', 'replacement', 'oem'], useCases: ['Pay-off braking', 'Unwind tension actuation'], selectionFactors: ['Reel geometry', 'Shaft speed', 'Braking demand', 'Duty', 'Air supply', 'Mounting'], specs: [],
    models: [
      { id: 'P13A', name: 'AX-250', aliases: ['ax250'], specs: [datum('Braking value', '0.15–16 kg·m per caliper', 'capacity', 'P13A'), datum('Maximum speed', '2500 rpm', 'speed', 'P13A')] },
      { id: 'P13B', name: 'AX-400', aliases: ['ax400'], specs: [datum('Braking value', '0.25–27 kg·m per caliper', 'capacity', 'P13B'), datum('Maximum speed', '1500 rpm', 'speed', 'P13B')] },
      { id: 'P13C', name: 'AX-500', aliases: ['ax500'], specs: [datum('Braking value', '0.33–33 kg·m per caliper', 'capacity', 'P13C'), datum('Maximum speed', '1200 rpm', 'speed', 'P13C')] },
    ], caveats: ['Braking value, speed, pressure and other limits are model-specific.', 'Final brake selection requires reel, shaft, duty, air-supply and mounting review.'], availability: 'Standard models; application review required.', comparisonGroup: 'pneumatic-brake', image: 'products/pnuematic-brake-thumb.jpg', governance: governance(),
  },
];

export const productById = new Map(products.map((product) => [product.id, product]));
export const familyById = new Map(families.map((family) => [family.id, family]));
