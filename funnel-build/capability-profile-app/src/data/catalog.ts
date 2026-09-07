import type { ProductFamily, ProductRecord } from '../types/catalog';
import { directTechnicalVariants, publicRecordDetails, specificationsFor, supportingItems } from './v4';

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

const productBlueprints: ProductRecord[] = [
  {
    id: 'P01', order: 1, familyId: 'PF01', name: 'LASER 2008 Series Diameter Measurement Platform', shortName: 'LASER 2008 Series', aliases: ['laser 2008', 'laser 2008b'], systemRole: 'Inline measurement and control',
    role: 'Continuous non-contact diameter measurement with control functions depending on validated configuration.', primaryFunction: 'Measures wire and cable diameter inline and supports clearer process-control decisions.',
    buyerProblems: ['diameter-variation', 'dimensional-consistency'], stages: ['dimensional-measurement', 'cooling-inspection'], projectRoutes: ['new-line', 'retrofit', 'replacement', 'oem'], useCases: ['Inline Diameter Measurement After Extrusion, Insulation or Sheathing'],
    selectionFactors: ['Minimum and Maximum Diameter', 'Line Speed', 'Measurement Location', 'Control and Output Requirements'],
    specs: [datum('Measurement Range', '0.8–150 mm Across the Series', 'range', 'P01'), datum('Scan Rate', '416 scans/second', 'speed', 'P01'), datum('Scan Velocity', '156–210 m/s by Model', 'speed', 'P01')],
    models: [
      { id: 'P01A', name: 'LASER 2008', aliases: ['2008'], specs: [datum('Measurement Range', '0.8–35 mm', 'range', 'P01A'), datum('Scan Velocity', '156 m/s', 'speed', 'P01A'), datum('Scan Rate', '416 scans/second', 'speed', 'P01A')] },
      { id: 'P01B', name: 'LASER 2008B', aliases: ['2008b'], specs: [datum('Measurement Range', '1.0–150 mm', 'range', 'P01B'), datum('Scan Velocity', '210 m/s', 'speed', 'P01B'), datum('Scan Rate', '416 scans/second', 'speed', 'P01B')] },
    ], caveats: ['Control Functions Depend on the Validated Configuration and Interfaces.'], availability: 'Standard Platform; Configuration Review Required.', comparisonGroup: 'diameter-2008', image: 'products/ldg-thumb.jpg', governance: governance(),
  },
  {
    id: 'P02', order: 2, familyId: 'PF01', name: 'LASER 2000 Series Scan Micrometers', shortName: 'LASER 2000 Series', aliases: ['laser 2012', 'laser 2030', 'laser 2060', 'scan micrometer'], systemRole: 'High-frequency dual-axis measurement',
    role: 'High-frequency dual-axis scan micrometers for model-specific measurement ranges.', primaryFunction: 'Provides non-contact dimensional measurement across three validated model ranges.',
    buyerProblems: ['diameter-variation', 'dimensional-consistency'], stages: ['dimensional-measurement', 'cooling-inspection'], projectRoutes: ['new-line', 'retrofit', 'replacement', 'oem'], useCases: ['Inline Wire and Cable Diameter Measurement'],
    selectionFactors: ['Required Range', 'Number of Axes', 'Line Conditions', 'Output Requirements'], specs: [datum('Series Measurement Range', '0.1–65 mm Across Models', 'range', 'P02'), datum('Measurement Frequency', '800 times/second per axis', 'speed', 'P02')],
    models: [
      { id: 'P02A', name: 'LASER-2012', aliases: ['laser 2012', '2012'], specs: [datum('Measurement Range', '0.1–12 mm', 'range', 'P02A'), datum('Measurement Frequency', '800 times/second per axis', 'speed', 'P02A')] },
      { id: 'P02B', name: 'LASER-2030', aliases: ['laser 2030', '2030'], specs: [datum('Measurement Range', '0.1–30 mm', 'range', 'P02B'), datum('Measurement Frequency', '800 times/second per axis', 'speed', 'P02B')] },
      { id: 'P02C', name: 'LASER-2060', aliases: ['laser 2060', '2060'], specs: [datum('Measurement Range', '0.5–65 mm', 'range', 'P02C'), datum('Measurement Frequency', '800 times/second per axis', 'speed', 'P02C')] },
    ], caveats: ['Select Models by Validated Range and Complete Application Conditions.'], availability: 'Standard Models.', comparisonGroup: 'diameter-2000', image: 'products/ldg-thumb.jpg', governance: governance(),
  },
  {
    id: 'P03', order: 3, familyId: 'PF01', name: 'LASER-H Series Diameter Measurement, Control and Lump/Neck Detection', shortName: 'LASER-H Series', aliases: ['laser 2010h', 'laser 2020h', 'laser 2030h', 'lump neck detector'], systemRole: 'Measurement, control and validated lump/neck detection',
    role: 'Inline diameter measurement and control with validated lump-and-neck detection.', primaryFunction: 'Measures diameter and detects validated lump-and-neck conditions at high sampling frequency.',
    buyerProblems: ['diameter-variation', 'dimensional-consistency', 'lump-neck'], stages: ['dimensional-measurement', 'cooling-inspection'], projectRoutes: ['new-line', 'retrofit', 'replacement', 'oem'], useCases: ['Diameter Measurement', 'Lump-and-Neck Detection'],
    selectionFactors: ['Diameter Range', 'Condition of Interest', 'Control/Output Requirements', 'Line Arrangement'], specs: [datum('Sampling Frequency', '20 kHz', 'speed', 'P03'), datum('Single-Axis Sampling', '10 kHz', 'speed', 'P03')],
    models: [
      { id: 'P03A', name: 'LASER-2010H', aliases: ['2010h'], specs: [datum('Measurement Range', '0.1–10 mm', 'range', 'P03A'), datum('Scanning Frequency', '20 kHz', 'speed', 'P03A'), datum('Single-Axis Sampling', '10 kHz', 'speed', 'P03A')] },
      { id: 'P03B', name: 'LASER-2020H', aliases: ['2020h'], specs: [datum('Measurement Range', '0.3–20 mm', 'range', 'P03B'), datum('Scanning Frequency', '20 kHz', 'speed', 'P03B'), datum('Single-Axis Sampling', '10 kHz', 'speed', 'P03B')] },
      { id: 'P03C', name: 'LASER-2030H', aliases: ['2030h'], specs: [datum('Measurement Range', '0.3–30 mm', 'range', 'P03C'), datum('Scanning Frequency', '20 kHz', 'speed', 'P03C'), datum('Single-Axis Sampling', '10 kHz', 'speed', 'P03C')] },
    ], caveats: ['Lump-and-Neck Detection Is Validated; This Is Not a General Surface-Defect Inspection Claim.'], availability: 'Standard Models.', comparisonGroup: 'laser-h', image: 'products/ldg-thumb.jpg', governance: governance(),
  },
  {
    id: 'P04', order: 4, familyId: 'PF02', name: 'Inline Spark Testing Platform', shortName: 'Inline Spark Testing', aliases: ['live spark tester', 'acute spark tester', 'dc spark tester', 'spark tester'], systemRole: 'Inline insulation-fault detection',
    role: 'Live, Acute and DC test paths with model-specific voltage, diameter and speed limits.', primaryFunction: 'Detects insulation faults inline using the selected validated test principle.',
    buyerProblems: ['insulation-faults', 'quality-detection'], stages: ['spark-fault', 'cooling-inspection'], projectRoutes: ['new-line', 'retrofit', 'replacement', 'oem'], useCases: ['Inline Insulation-Fault Detection', 'Fault Information and Downstream Response Review'],
    selectionFactors: ['Test Principle', 'Voltage', 'Cable Diameter', 'Line Speed', 'Fault Response', 'Data, Marking and Calibration Needs'], specs: [datum('Platform Voltage Context', '1.5–30 kV, Model Dependent', 'voltage', 'P04'), datum('Platform Speed Context', '200–2500 m/min, Model Dependent', 'speed', 'P04')],
    models: [
      { id: 'P04A', name: 'Live Spark Tester', aliases: ['live'], specs: [datum('Test Principle', 'Live AC at Supply Frequency', 'feature', 'P04A'), datum('Voltage Paths', '1.5–15 / 25 / 30 kV', 'voltage', 'P04A'), datum('Cable Diameter', '0.5–40 mm; 60 mm on Demand', 'range', 'P04A'), datum('Line Speed', 'Up to 200 m/min', 'speed', 'P04A')] },
      { id: 'P04B', name: 'Acute Spark Tester', aliases: ['acute'], specs: [datum('Test Principle', 'High-Frequency Sine-Wave AC', 'feature', 'P04B'), datum('Voltage Paths', '1.5–10 / 15 kV', 'voltage', 'P04B'), datum('Cable Diameter', '0.5–15 mm', 'range', 'P04B'), datum('Line Speed', 'Up to 1500 m/min', 'speed', 'P04B')] },
      { id: 'P04C', name: 'DC Spark Tester', aliases: ['dc'], specs: [datum('Test Principle', 'Direct Current', 'feature', 'P04C'), datum('Voltage Paths', '1.5–15 / 20 kV', 'voltage', 'P04C'), datum('Cable Diameter', '0.5–15 mm; 30 mm on Demand', 'range', 'P04C'), datum('Line Speed', 'Up to 2500 m/min, Model Dependent', 'speed', 'P04C')] },
    ], caveats: ['Live, Acute and DC Values Are Model-Specific and Must Not Be Blended.', 'Fault Interface, Logging, Marking and Calibration Support Are Shown Only Where Applicable.'], availability: 'Standard and On-Demand Options as Identified by Model.', comparisonGroup: 'spark-method', image: 'products/spark-thumb.jpg', governance: governance(),
  },
  {
    id: 'P05', order: 5, familyId: 'PF03', name: 'Offline High-Voltage Tester Platform', shortName: 'Offline High-Voltage Testers', aliases: ['hv tester', 'high voltage tester', 'ac hv', 'dc hv'], systemRole: 'Offline electrical validation', role: 'Separate AC and DC offline high-voltage test paths.', primaryFunction: 'Supports offline high-voltage testing of finished cable or samples.',
    buyerProblems: ['offline-hv', 'quality-validation'], stages: ['offline-hv-testing'], projectRoutes: ['laboratory', 'replacement', 'new-line'], useCases: ['Finished-Cable and Laboratory High-Voltage Testing'], selectionFactors: ['AC or DC Method', 'Voltage/Current', 'Sample', 'Test Procedure', 'Throughput and Reporting'],
    specs: [], models: [
      { id: 'P05A', name: 'AC High-Voltage Tester', aliases: ['ac high voltage'], specs: [datum('Test Method', 'Alternating Current (AC)', 'feature', 'P05A'), datum('Voltage', 'Up to 40 kV', 'voltage', 'P05A'), datum('Current', 'Up to 1 A', 'capacity', 'P05A')], caveat: 'Requirements Above 40 kV Are Request-Based.' },
      { id: 'P05B', name: 'DC High-Voltage Tester', aliases: ['dc high voltage'], specs: [datum('Test Method', 'Direct Current (DC)', 'feature', 'P05B'), datum('Voltage', '0.5–20 kV', 'voltage', 'P05B'), datum('Current', '1 mA', 'capacity', 'P05B')], caveat: 'Other Voltage Requirements Are Request-Based.' },
    ], caveats: ['AC and DC Capabilities Are Separate and Must Not Be Combined Into One Value.'], availability: 'Standard and Request-Based Configurations.', comparisonGroup: 'offline-hv', image: 'products/hv-tester-thumb.jpg', governance: governance(),
  },
  {
    id: 'P06', order: 6, familyId: 'PF03', name: 'Fire Resistance Cable Testing System', shortName: 'Fire Resistance Testing System', aliases: ['fire alarm cable tester', 'circuit integrity', 'fire resistance'], systemRole: 'Project-specific laboratory validation', role: 'Project-configured fire-resistance or circuit-integrity test system.', primaryFunction: 'Supports defined fire-resistance cable test projects against the supplied method and system requirements.',
    buyerProblems: ['fire-resistance', 'quality-validation'], stages: ['fire-resistance-testing'], projectRoutes: ['laboratory', 'new-line'], useCases: ['Project-Specific Fire-Resistance and Circuit-Integrity Testing'], selectionFactors: ['Test Method', 'Cable/Sample Context', 'Applicable Specification', 'System Configuration', 'Utilities and Acceptance'], specs: [], models: [],
    caveats: ['This Is a Project-Specific System. No Universal Test Standard, Configuration or Performance Claim Is Implied.'], availability: 'Project-Specific System.', comparisonGroup: 'fire-system', image: 'products/fire-alarm.jpg', governance: governance('Source-Limited'),
  },
  {
    id: 'P07', order: 7, familyId: 'PF04', name: 'Inline Induction Wire Preheater', shortName: 'Induction Wire Preheater', aliases: ['wire preheater', 'ph10019c', 'induction preheater'], systemRole: 'Conductor preparation', role: 'Inline induction preheating before extrusion.', primaryFunction: 'Preheats solid or bunched conductor inline before extrusion.',
    buyerProblems: ['wire-preheating', 'process-stability'], stages: ['pre-extrusion', 'extrusion'], projectRoutes: ['new-line', 'retrofit', 'replacement', 'oem'], useCases: ['Conductor Preheating Before Extrusion'], selectionFactors: ['Solid or Bunched Conductor', 'Wire Size', 'Line Speed', 'Target Temperature', 'Installation and Utilities'],
    specs: [datum('Solid Conductor', '0.1–10 mm', 'range', 'P07'), datum('Bunched Conductor', '0.1–16 mm', 'range', 'P07'), datum('Target Temperature', '60–180 °C', 'temperature', 'P07'), datum('Validated Speed Configurations', '40–2000 m/min', 'speed', 'P07')],
    models: [
      { id: 'P07A', name: 'PH10019C / 1000', aliases: ['ph10019c 1000'], specs: [datum('Line Speed', 'Up to 1000 m/min; Depends on Wire Diameter', 'speed', 'P07A'), datum('Wire Range', '0.4–3.6 mm', 'range', 'P07A'), datum('Target Temperature', '60–180 °C', 'temperature', 'P07A')] },
      { id: 'P07B', name: 'PH10019C / 1500', aliases: ['ph10019c 1500'], specs: [datum('Line Speed', 'Up to 1500 m/min; Depends on Wire Diameter', 'speed', 'P07B'), datum('Wire Range', '0.5–2.8 mm', 'range', 'P07B'), datum('Target Temperature', '60–180 °C', 'temperature', 'P07B')] },
      { id: 'P07C', name: 'PH10019C / 2000', aliases: ['ph10019c 2000'], specs: [datum('Line Speed', 'Up to 2000 m/min; Depends on Wire Diameter', 'speed', 'P07C'), datum('Wire Range', '0.3–1.4 mm', 'range', 'P07C'), datum('Target Temperature', '60–180 °C', 'temperature', 'P07C')] },
    ], caveats: ['Speed, Conductor Range and Target Temperature Are Configuration-Dependent.'], availability: 'Configured Variants.', comparisonGroup: 'preheater', image: 'products/preheater-thumb.jpg', governance: governance(),
  },
  {
    id: 'P08', order: 8, familyId: 'PF04', name: 'LSP Static Powder Applicator', shortName: 'LSP Powder Applicator', aliases: ['lsp', 'static powder', 'talcum applicator', 'graphite applicator'], systemRole: 'Powder application', role: 'Static applicator for validated talcum or graphite powder variants.', primaryFunction: 'Applies powder consistently at a defined production stage with model-specific size and speed limits.',
    buyerProblems: ['powder-application', 'process-stability'], stages: ['pre-extrusion'], projectRoutes: ['new-line', 'retrofit', 'replacement', 'oem'], useCases: ['Talcum Powder Application', 'Graphite Powder Application'], selectionFactors: ['Powder Type', 'Product Size', 'Line Speed', 'Earthing', 'Air Quality and Installation'], specs: [],
    models: [
      { id: 'P08A', name: 'LSP G1', aliases: ['g1'], specs: [datum('Product Size', 'Up to 40 mm', 'range', 'P08A'), datum('Line Speed', 'Up to 150 m/min', 'speed', 'P08A')] },
      { id: 'P08B', name: 'LSP G2', aliases: ['g2'], specs: [datum('Product Size', 'Up to 40 mm', 'range', 'P08B'), datum('Line Speed', 'Up to 250 m/min', 'speed', 'P08B')] },
      { id: 'P08C', name: 'LSP G3', aliases: ['g3'], specs: [datum('Product Size', 'Up to 40 mm', 'range', 'P08C'), datum('Line Speed', 'Up to 400 m/min', 'speed', 'P08C')] },
      { id: 'P08D', name: 'LSP G2-100', aliases: ['g2-100'], specs: [datum('Product Size', 'Up to 100 mm', 'range', 'P08D'), datum('Line Speed', 'Up to 150 m/min', 'speed', 'P08D')] },
      { id: 'P08E', name: 'LSP G2-GR50', aliases: ['g2-gr50'], specs: [datum('Powder', 'Graphite', 'feature', 'P08E'), datum('Product Size', 'Up to 40 mm', 'range', 'P08E'), datum('Line Speed', 'Up to 150 m/min', 'speed', 'P08E')] },
      { id: 'P08F', name: 'LSP G2-GR250', aliases: ['g2-gr250'], specs: [datum('Powder', 'Graphite', 'feature', 'P08F'), datum('Product Size', 'Up to 100 mm', 'range', 'P08F'), datum('Line Speed', 'Up to 100 m/min', 'speed', 'P08F')] },
    ], caveats: ['Powder Must Be Clean, Dry and Uncontaminated.', 'Earthing Below 1 V and Moisture/Mist-Free Panel Air Are Required Operating Considerations.'], availability: 'Standard Validated Variants.', comparisonGroup: 'lsp', governance: governance(),
  },
  {
    id: 'P09', order: 9, familyId: 'PF04', name: 'Butt Welding Machine', shortName: 'Butt Welding Machine', aliases: ['butt welder', 'wire welding'], systemRole: 'Conductor joining and repair', role: 'Joins documented copper or aluminium conductor ranges.', primaryFunction: 'Supports conductor joining, repair and production continuity for the reviewed material and range.',
    buyerProblems: ['joining-repair', 'production-continuity'], stages: ['joining-repair'], projectRoutes: ['new-line', 'retrofit', 'replacement'], useCases: ['Conductor Joining and Repair'], selectionFactors: ['Material', 'Conductor Construction', 'Cross-Section or Diameter', 'Duty and Installation'], specs: [], models: [], caveats: ['Confirmed Selection Depends on Conductor Material, Construction and Documented Range.'], availability: 'Application Reviewed.', comparisonGroup: 'butt-welder', image: 'products/butt-welding-thumb.jpg', governance: governance(),
  },
  {
    id: 'P10', order: 10, familyId: 'PF05', name: 'Wire Tension Indicator', shortName: 'Wire Tension Indicator', aliases: ['wti', 'wti-90-40', 'wti-100-40', 'tension display'], systemRole: 'Indication', role: 'Measures and indicates wire tension; it is not an active tension controller.', primaryFunction: 'Provides tension visibility for reviewed wire sizes and tension configurations.',
    buyerProblems: ['tension-visibility', 'tension-instability', 'wire-breaks'], stages: ['tension-braking', 'payoff-unwind', 'takeup-rewind'], projectRoutes: ['new-line', 'retrofit', 'replacement', 'oem'], useCases: ['Tension Measurement and Indication'], selectionFactors: ['Wire Size', 'Tension Range', 'Visibility Need', 'Mounting'], specs: [],
    models: [
      { id: 'P10A', name: 'WTI-90-40', aliases: ['wti 90 40'], specs: [datum('Wire Range', '0.2–5 mm', 'range', 'P10A'), datum('Published Configurations', '15 kg / 40 kg', 'capacity', 'P10A')] },
      { id: 'P10B', name: 'WTI-100-40', aliases: ['wti 100 40'], specs: [datum('Wire Range', '2–10 mm', 'range', 'P10B'), datum('Published Configurations', '15 kg / 40 kg', 'capacity', 'P10B')] },
    ], caveats: ['This Product Indicates Tension; It Does Not Provide Active Closed-Loop Control.', 'Higher Tension Requirements Are Reviewed and Quoted Against the Application.'], availability: 'Standard Published Configurations; Other Requirements by Review.', comparisonGroup: 'wti', image: 'products/wire-tension-thumb.jpg', governance: governance(),
  },
  {
    id: 'P11', order: 11, familyId: 'PF05', name: 'LTC-PRO Web Tension Controller', shortName: 'LTC-PRO Controller', aliases: ['ltc-pro', 'ltc pro', 'tension controller'], systemRole: 'Control', role: 'Processes feedback and commands an active tension-control response.', primaryFunction: 'Provides the controller role in a reviewed closed-loop tension architecture.',
    buyerProblems: ['tension-instability', 'manual-adjustment', 'wire-breaks'], stages: ['tension-braking', 'payoff-unwind', 'takeup-rewind'], projectRoutes: ['new-line', 'retrofit', 'replacement', 'oem'], useCases: ['Closed-Loop Tension Control'], selectionFactors: ['Feedback Architecture', 'Setpoint', 'Machine Interface', 'Existing Sensor and Actuator'], specs: [], models: [],
    caveats: ['The Controller Is One Role in a System and Requires Reviewed Sensing, Actuation and Machine Interfaces.'], availability: 'Application Reviewed.', comparisonGroup: 'tension-control', image: 'products/pure-tension-controller.jpg', governance: governance(),
  },
  {
    id: 'P12', order: 12, familyId: 'PF05', name: 'Loadcells and Tension Transducers', shortName: 'Loadcells and Transducers', aliases: ['loadcell', 'load cell', 'lc-ar-85', 'lc-ar-118', 'lc-ar-125', 'lc-ar-st', 'lc-ar-60', 'lc-ar-hd'], systemRole: 'Sensing', role: 'Senses load or tension for indication or control architectures.', primaryFunction: 'Provides model-specific load sensing across approved capacities and mounting arrangements.',
    buyerProblems: ['tension-visibility', 'tension-instability', 'load-feedback', 'load-sensing'], stages: ['tension-braking', 'payoff-unwind', 'takeup-rewind'], projectRoutes: ['new-line', 'retrofit', 'replacement', 'oem'], useCases: ['Tension Sensing', 'Load Feedback'], selectionFactors: ['Load Range', 'Mounting', 'Direction', 'Environment', 'Signal Context'], specs: [datum('Portfolio Capacity', '10–5000 kg across models', 'capacity', 'P12')],
    models: [
      { id: 'P12A', name: 'LC-AR-85', aliases: ['ar85'], specs: [datum('Capacities', '10 / 20 / 50 / 100 kg', 'capacity', 'P12A'), datum('ATEX', 'Available Only for LC-AR-85 Where Specified', 'feature', 'P12A')] },
      { id: 'P12B', name: 'LC-AR-118', aliases: ['ar118'], specs: [datum('Capacities', '50 / 100 / 200 / 500 kg', 'capacity', 'P12B')] },
      { id: 'P12C', name: 'LC-AR-125', aliases: ['ar125'], specs: [datum('Capacities', '50 / 100 / 200 / 500 kg', 'capacity', 'P12C')] },
      { id: 'P12D', name: 'LC-AR-ST', aliases: ['ar st'], specs: [datum('Capacities', '100 / 200 / 500 / 1000 kg', 'capacity', 'P12D')] },
      { id: 'P12E', name: 'LC-AR-60', aliases: ['ar60'], specs: [datum('Capacities', '10 / 20 / 50 kg', 'capacity', 'P12E')] },
      { id: 'P12F', name: 'LC-AR-HD', aliases: ['ar hd'], specs: [datum('Capacities', '100 / 500 / 1000 / 2000 / 5000 kg', 'capacity', 'P12F')] },
    ], caveats: ['Capacities, Materials, Certifications and ATEX Status Are Model-Specific.', 'ATEX Must Not Be Generalized Beyond LC-AR-85.'], availability: 'Standard and Custom Options by Model.', comparisonGroup: 'loadcell', image: 'products/loadcell-thumb.jpg', governance: governance(),
  },
  {
    id: 'P13', order: 13, familyId: 'PF05', name: 'Pneumatic Brake', shortName: 'Pneumatic Brake', aliases: ['ax250', 'ax-250', 'ax400', 'ax-400', 'ax500', 'ax-500', 'pneumatic brake'], systemRole: 'Actuation', role: 'Provides pneumatic braking actuation in applicable unwind or pay-off arrangements.', primaryFunction: 'Applies model-specific braking for reviewed reel geometry, speed, duty and air-supply conditions.',
    buyerProblems: ['tension-instability', 'braking', 'manual-adjustment', 'wire-breaks'], stages: ['tension-braking', 'payoff-unwind', 'takeup-rewind'], projectRoutes: ['new-line', 'retrofit', 'replacement', 'oem'], useCases: ['Pay-Off Braking', 'Unwind Tension Actuation'], selectionFactors: ['Reel Geometry', 'Shaft Speed', 'Braking Demand', 'Duty', 'Air Supply', 'Mounting'], specs: [],
    models: [
      { id: 'P13A', name: 'AX-250', aliases: ['ax250'], specs: [datum('Braking Value', '0.15–16 kg·m per caliper', 'capacity', 'P13A'), datum('Maximum Speed', '2500 rpm', 'speed', 'P13A')] },
      { id: 'P13B', name: 'AX-400', aliases: ['ax400'], specs: [datum('Braking Value', '0.25–27 kg·m per caliper', 'capacity', 'P13B'), datum('Maximum Speed', '1500 rpm', 'speed', 'P13B')] },
      { id: 'P13C', name: 'AX-500', aliases: ['ax500'], specs: [datum('Braking Value', '0.33–33 kg·m per caliper', 'capacity', 'P13C'), datum('Maximum Speed', '1200 rpm', 'speed', 'P13C')] },
    ], caveats: ['Braking Value, Speed, Pressure and Other Limits Are Model-Specific.', 'Final Brake Selection Requires Reel, Shaft, Duty, Air-Supply and Mounting Review.'], availability: 'Standard Models; Application Review Required.', comparisonGroup: 'pneumatic-brake', image: 'products/pnuematic-brake-thumb.jpg', governance: governance(),
  },
];

export const products: ProductRecord[] = productBlueprints.map((product) => {
  const record = publicRecordDetails(product.id);
  const aliasesById = new Map(product.models.map((model) => [model.id, model.aliases]));
  const models = directTechnicalVariants(product.id).map((model) => ({
    ...model,
    aliases: [...new Set([...(aliasesById.get(model.id) ?? []), ...model.aliases])],
  }));

  return {
    ...product,
    name: record?.name ?? product.name,
    primaryFunction: record?.primaryFunction || product.primaryFunction,
    specs: specificationsFor(product.id),
    models,
    supportItems: supportingItems(product.id),
    caveats: record?.technicalCaveats ? [record.technicalCaveats] : product.caveats,
    availability: record?.availability || product.availability,
    record,
  };
});

export const productById = new Map(products.map((product) => [product.id, product]));
export const familyById = new Map(families.map((family) => [family.id, family]));
