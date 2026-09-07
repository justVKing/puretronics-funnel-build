import type { McqQuestion } from '../types/readiness';

const unknown = { id: 'unknown', label: 'Not Known Yet' };
const na = { id: 'not-applicable', label: 'Not Applicable' };

export const readinessQuestions: McqQuestion[] = [
  { id: 'requirement-location', label: 'Where Does the Requirement Occur?', purpose: 'Separates inline production capabilities from offline laboratory validation.', section: 'requirement', mode: 'single', options: [
    { id: 'line', label: 'On a Production Line', productIds: ['P01','P02','P03','P04','P07','P08','P09','P10','P11','P12','P13'] },
    { id: 'laboratory', label: 'In an Offline Laboratory or Test Area', productIds: ['P05','P06'] },
    { id: 'both', label: 'Both Production and Offline Validation' }, unknown,
  ] },
  { id: 'primary-requirement', label: 'Which Requirement Is Closest to the Application?', purpose: 'Connects the observed need to the governed Primary Product path.', section: 'requirement', mode: 'single', options: [
    { id: 'dimensional', label: 'Inline Dimensional Measurement', productIds: ['P01','P02','P03'] },
    { id: 'lump-neck', label: 'Lump-and-Neck Detection', productIds: ['P03'] },
    { id: 'spark', label: 'Inline Insulation-Fault Detection', productIds: ['P04'] },
    { id: 'offline-hv', label: 'Offline High-Voltage Testing', productIds: ['P05'] },
    { id: 'fire', label: 'Fire-Resistance or Circuit-Integrity Testing', productIds: ['P06'] },
    { id: 'preheat', label: 'Conductor Preheating', productIds: ['P07'] },
    { id: 'powder', label: 'Powder Application', productIds: ['P08'] },
    { id: 'joining', label: 'Conductor Joining or Repair', productIds: ['P09'] },
    { id: 'indication', label: 'Tension Indication', productIds: ['P10'] },
    { id: 'sensing', label: 'Load or Tension Sensing', productIds: ['P12'] },
    { id: 'control', label: 'Active Tension Control', productIds: ['P11'] },
    { id: 'braking', label: 'Pneumatic Braking', productIds: ['P13'] },
    { id: 'integrated-tension', label: 'Integrated Tension / Braking Path', productIds: ['P10','P11','P12','P13'] }, unknown,
  ] },
  { id: 'material-category', label: 'What Is Being Processed or Tested?', purpose: 'Records the material context without claiming unsupported compatibility.', section: 'application', mode: 'single', options: [
    { id: 'solid-wire', label: 'Solid Wire or Conductor' }, { id: 'bunched', label: 'Bunched or Stranded Conductor' }, { id: 'insulated-wire', label: 'Insulated Wire' }, { id: 'cable', label: 'Cable' }, { id: 'web', label: 'Web Material' }, { id: 'sample', label: 'Laboratory Sample' }, unknown,
  ] },
  { id: 'known-inputs', label: 'Which Technical Inputs Are Already Known?', purpose: 'Controls which evidence can be assessed now and which questions remain open.', section: 'application', mode: 'multiple', options: [
    { id: 'diameter', label: 'Diameter or Product Size' }, { id: 'speed', label: 'Line or Shaft Speed' }, { id: 'voltage', label: 'Test Method or Voltage' }, { id: 'temperature', label: 'Target Temperature' }, { id: 'load', label: 'Tension or Load' }, { id: 'none', label: 'None Yet' },
  ] },
  { id: 'pf01-function', label: 'Which Measurement Function Is Required?', purpose: 'Preserves the validated boundary between diameter measurement and lump/neck detection.', section: 'conditions', mode: 'single', familyIds: ['PF01'], options: [
    { id: 'diameter', label: 'Diameter Measurement', productIds: ['P01','P02','P03'] }, { id: 'lump-neck', label: 'Diameter Measurement With Lump-and-Neck Detection', productIds: ['P03'] }, unknown,
  ] },
  { id: 'pf01-max-diameter', label: 'What Maximum Measurement Diameter Must the Selected Model Cover?', purpose: 'Uses approved model measurement ranges without extrapolation.', section: 'conditions', mode: 'single', familyIds: ['PF01'], options: [
    { id: 'up-to-10', label: 'Up to 10 mm', modelIds: ['P01A','P01B','P02A','P02B','P02C','P03A','P03B','P03C'], evidence: 'V4 Model Measurement Ranges' },
    { id: '10-12', label: 'Above 10 mm to 12 mm', modelIds: ['P01A','P01B','P02A','P02B','P02C','P03B','P03C'], evidence: 'V4 Model Measurement Ranges' },
    { id: '12-20', label: 'Above 12 mm to 20 mm', modelIds: ['P01A','P01B','P02B','P02C','P03B','P03C'], evidence: 'V4 Model Measurement Ranges' },
    { id: '20-30', label: 'Above 20 mm to 30 mm', modelIds: ['P01A','P01B','P02B','P02C','P03C'], evidence: 'V4 Model Measurement Ranges' },
    { id: '30-35', label: 'Above 30 mm to 35 mm', modelIds: ['P01A','P01B','P02C'], evidence: 'V4 Model Measurement Ranges' },
    { id: '35-65', label: 'Above 35 mm to 65 mm', modelIds: ['P01B','P02C'], evidence: 'V4 Model Measurement Ranges' },
    { id: '65-150', label: 'Above 65 mm to 150 mm', modelIds: ['P01B'], evidence: 'V4 Model Measurement Ranges' }, unknown,
  ] },
  { id: 'pf01-axes', label: 'Which Measurement-Axis Requirement Applies?', purpose: 'Records whether the application requires a defined dual-axis measurement path.', section: 'conditions', mode: 'single', familyIds: ['PF01'], options: [
    { id: 'single-or-unspecified', label: 'Single Axis or Axis Count Not Specified' }, { id: 'dual', label: 'Dual-Axis Measurement', productIds: ['P02','P03'], evidence: 'P02/P03 Approved Working Principle' }, unknown,
  ] },
  { id: 'pf01-output', label: 'Which Measurement Output Is Required?', purpose: 'Separates local visibility, alarm, data and control-interface expectations for technical review.', section: 'conditions', mode: 'multiple', familyIds: ['PF01'], options: [
    { id: 'local-display', label: 'Local Display' }, { id: 'limit-alarm', label: 'Upper / Lower Limit Alarm' }, { id: 'data', label: 'Data Collection or Analysis' }, { id: 'communications', label: 'Machine or Control-System Communication' }, unknown,
  ] },
  { id: 'pf02-principle', label: 'Which Inline Spark-Test Principle Is Required?', purpose: 'Keeps Live, Acute and DC methods separate.', section: 'conditions', mode: 'single', familyIds: ['PF02'], options: [
    { id: 'live', label: 'Live AC at Supply Frequency', modelIds: ['P04A'], evidence: 'P04A Approved Test Principle' }, { id: 'acute', label: 'Acute / High-Frequency Sine-Wave AC', modelIds: ['P04B'], evidence: 'P04B Approved Test Principle' }, { id: 'dc', label: 'Direct Current', modelIds: ['P04C'], evidence: 'P04C Approved Test Principle' }, unknown,
  ] },
  { id: 'pf02-speed', label: 'Which Maximum Line-Speed Band Applies?', purpose: 'Uses the approved P04 method-specific speed limits.', section: 'conditions', mode: 'single', familyIds: ['PF02'], options: [
    { id: 'up-to-200', label: 'Up to 200 m/min', modelIds: ['P04A','P04B','P04C'], evidence: 'P04 Model Speed Limits' }, { id: '200-1500', label: 'Above 200 m/min to 1500 m/min', modelIds: ['P04B','P04C'], evidence: 'P04 Model Speed Limits' }, { id: '1500-2500', label: 'Above 1500 m/min to 2500 m/min', modelIds: ['P04C'], evidence: 'P04 Model Speed Limits' }, unknown,
  ] },
  { id: 'pf02-voltage', label: 'Which Maximum Test-Voltage Band Applies?', purpose: 'Uses the approved P04 method-specific voltage paths.', section: 'conditions', mode: 'single', familyIds: ['PF02'], options: [
    { id: 'up-to-10', label: 'Up to 10 kV', modelIds: ['P04A','P04B','P04C'], evidence: 'P04 Approved Voltage Ranges' },
    { id: '10-15', label: 'Above 10 kV to 15 kV', modelIds: ['P04A','P04B','P04C'], evidence: 'P04 Approved Voltage Ranges' },
    { id: '15-20', label: 'Above 15 kV to 20 kV', modelIds: ['P04A','P04C'], evidence: 'P04 Approved Voltage Ranges' },
    { id: '20-25', label: 'Above 20 kV to 25 kV', modelIds: ['P04A'], evidence: 'P04 Approved Voltage Paths' },
    { id: '25-30', label: 'Above 25 kV to 30 kV', modelIds: ['P04A'], evidence: 'P04 Approved Voltage Paths' }, unknown,
  ] },
  { id: 'pf02-diameter', label: 'Which Maximum Wire or Cable-Diameter Band Applies?', purpose: 'Keeps standard and on-demand P04 diameter conditions explicit.', section: 'conditions', mode: 'single', familyIds: ['PF02'], options: [
    { id: 'up-to-15', label: 'Up to 15 mm OD', modelIds: ['P04A','P04B','P04C'], evidence: 'P04 Approved Wire-Size Ranges' },
    { id: '15-30', label: 'Above 15 mm to 30 mm OD', modelIds: ['P04A','P04C'], evidence: 'P04 Approved Wire-Size Ranges', caveat: 'DC coverage above 15 mm is an on-demand condition.' },
    { id: '30-40', label: 'Above 30 mm to 40 mm OD', modelIds: ['P04A'], evidence: 'P04 Approved Wire-Size Ranges' },
    { id: '40-60', label: 'Above 40 mm to 60 mm OD', modelIds: ['P04A'], evidence: 'P04 Approved Wire-Size Ranges', caveat: 'This is an on-demand Live AC condition.' }, unknown,
  ] },
  { id: 'pf02-response', label: 'Which Fault-Response or Quality Functions Are Required?', purpose: 'Captures supporting functions without treating them as spark-tester substitutes.', section: 'conditions', mode: 'multiple', familyIds: ['PF02'], options: [
    { id: 'indication', label: 'Fault Indication and Counting' }, { id: 'logging', label: 'Data Logging and Graphics' }, { id: 'marking', label: 'Inline Fault Marking' }, { id: 'calibration', label: 'Sensitivity Calibration' }, { id: 'ul-electrode', label: 'UL Electrode Option' }, unknown,
  ] },
  { id: 'pf03-path', label: 'Which Offline Validation Path Applies?', purpose: 'Separates electrical HV testing from project-specific fire testing.', section: 'conditions', mode: 'single', familyIds: ['PF03'], options: [
    { id: 'ac', label: 'Offline AC High-Voltage Testing', productIds: ['P05'], modelIds: ['P05A'], evidence: 'P05A Approved Test Method' }, { id: 'dc', label: 'Offline DC High-Voltage Testing', productIds: ['P05'], modelIds: ['P05B'], evidence: 'P05B Approved Test Method' }, { id: 'fire', label: 'Fire-Resistance / Circuit-Integrity Testing', productIds: ['P06'], evidence: 'P06 Project-Specific System Record' }, unknown,
  ] },
  { id: 'pf03-voltage', label: 'Which Maximum Offline Test-Voltage Band Applies?', purpose: 'Uses only the approved AC and DC high-voltage ranges.', section: 'conditions', mode: 'single', familyIds: ['PF03'], when: { questionId: 'pf03-path', optionIds: ['ac','dc'] }, options: [
    { id: 'up-to-20', label: 'Up to 20 kV', modelIds: ['P05A','P05B'], evidence: 'P05 Approved Voltage Ranges' }, { id: '20-40', label: 'Above 20 kV to 40 kV', modelIds: ['P05A'], evidence: 'P05A Approved Voltage Range' }, { id: 'above-40', label: 'Above 40 kV', reviewRequired: true, evidence: 'P05A Request-Based Range Note', caveat: 'Requirements above 40 kV require a request-based Puretronics review.' }, unknown,
  ] },
  { id: 'pf03-current', label: 'Which Maximum Output-Current Band Applies?', purpose: 'Keeps the published AC and DC output-current boundaries distinct.', section: 'conditions', mode: 'single', familyIds: ['PF03'], when: { questionId: 'pf03-path', optionIds: ['ac','dc'] }, options: [
    { id: 'up-to-1ma', label: 'Up to 1 mA', modelIds: ['P05A','P05B'], evidence: 'P05 Approved Output Current' }, { id: '1ma-1a', label: 'Above 1 mA to 1 A', modelIds: ['P05A'], evidence: 'P05A Approved Output Current' }, { id: 'above-1a', label: 'Above 1 A', reviewRequired: true, evidence: 'P05A Request-Based Current Note', caveat: 'Requirements above 1 A require a request-based Puretronics review.' }, unknown,
  ] },
  { id: 'pf03-safety-reporting', label: 'Which Offline Test Functions Are Required?', purpose: 'Records safety, timing, indication and discharge requirements for review.', section: 'conditions', mode: 'multiple', familyIds: ['PF03'], when: { questionId: 'pf03-path', optionIds: ['ac','dc'] }, options: [
    { id: 'fault-indication', label: 'Audio / Visual Fault Indication' }, { id: 'timer', label: 'Digital Timer' }, { id: 'door-interlock', label: 'Door Interlock' }, { id: 'auto-discharge', label: 'Soft Auto-Discharge' }, { id: 'reporting', label: 'Recorded Test Results or Reporting' }, unknown,
  ] },
  { id: 'pf03-fire-basis', label: 'Is the Fire-Test Method or Applicable Specification Available?', purpose: 'P06 remains project-specific and requires the intended test basis.', section: 'conditions', mode: 'single', familyIds: ['PF03'], when: { questionId: 'pf03-path', optionIds: ['fire'] }, options: [
    { id: 'available', label: 'Yes — Method or Specification Is Available', productIds: ['P06'], evidence: 'P06 Project-Specific Review Inputs' }, { id: 'partial', label: 'Partly Defined' }, { id: 'not-available', label: 'Not Available Yet' }, unknown,
  ] },
  { id: 'pf04-path', label: 'Which Process-Equipment Requirement Applies?', purpose: 'Separates preheating, powdering and joining roles.', section: 'conditions', mode: 'single', familyIds: ['PF04'], options: [
    { id: 'preheat', label: 'Inline Conductor Preheating', productIds: ['P07'] }, { id: 'talc', label: 'Talcum Powder Application', productIds: ['P08'], modelIds: ['P08A','P08B','P08C','P08D'] }, { id: 'graphite', label: 'Graphite Powder Application', productIds: ['P08'], modelIds: ['P08E','P08F'] }, { id: 'joining', label: 'Conductor Joining / Repair', productIds: ['P09'] }, unknown,
  ] },
  { id: 'pf04-speed', label: 'Which Maximum Process-Speed Band Applies?', purpose: 'Applies only approved P07 and P08 model speed boundaries.', section: 'conditions', mode: 'single', familyIds: ['PF04'], when: { questionId: 'pf04-path', optionIds: ['preheat','talc','graphite'] }, options: [
    { id: 'up-to-100', label: 'Up to 100 m/min', modelIds: ['P07A','P07B','P07C','P08A','P08B','P08C','P08D','P08E','P08F'], evidence: 'P07/P08 Approved Speed Limits' },
    { id: '100-150', label: 'Above 100 m/min to 150 m/min', modelIds: ['P07A','P07B','P07C','P08A','P08B','P08C','P08D','P08E'], evidence: 'P07/P08 Approved Speed Limits' },
    { id: '150-250', label: 'Above 150 m/min to 250 m/min', modelIds: ['P07A','P07B','P07C','P08B','P08C'], evidence: 'P07/P08 Approved Speed Limits' },
    { id: '250-400', label: 'Above 250 m/min to 400 m/min', modelIds: ['P07A','P07B','P07C','P08C'], evidence: 'P07/P08 Approved Speed Limits' },
    { id: '400-1000', label: 'Above 400 m/min to 1000 m/min', modelIds: ['P07A','P07B','P07C'], evidence: 'P07 Approved Speed Configurations' },
    { id: '1000-1500', label: 'Above 1000 m/min to 1500 m/min', modelIds: ['P07B','P07C'], evidence: 'P07 Approved Speed Configurations' },
    { id: '1500-2000', label: 'Above 1500 m/min to 2000 m/min', modelIds: ['P07C'], evidence: 'P07 Approved Speed Configurations' }, unknown, na,
  ] },
  { id: 'pf04-size', label: 'Which Maximum Conductor or Product-Size Band Applies?', purpose: 'Uses approved P07 wire-diameter and P08 cable-diameter boundaries.', section: 'conditions', mode: 'single', familyIds: ['PF04'], when: { questionId: 'pf04-path', optionIds: ['preheat','talc','graphite'] }, options: [
    { id: 'up-to-1-4', label: 'Up to 1.4 mm', modelIds: ['P07A','P07B','P07C','P08A','P08B','P08C','P08D','P08E','P08F'], evidence: 'P07/P08 Approved Size Ranges' },
    { id: '1-4-2-8', label: 'Above 1.4 mm to 2.8 mm', modelIds: ['P07A','P07B','P08A','P08B','P08C','P08D','P08E','P08F'], evidence: 'P07/P08 Approved Size Ranges' },
    { id: '2-8-3-6', label: 'Above 2.8 mm to 3.6 mm', modelIds: ['P07A','P08A','P08B','P08C','P08D','P08E','P08F'], evidence: 'P07/P08 Approved Size Ranges' },
    { id: '3-6-40', label: 'Above 3.6 mm to 40 mm', modelIds: ['P08A','P08B','P08C','P08D','P08E','P08F'], evidence: 'P08 Approved Diameter Ranges' },
    { id: '40-100', label: 'Above 40 mm to 100 mm', modelIds: ['P08D','P08F'], evidence: 'P08 Approved Diameter Ranges' }, unknown,
  ] },
  { id: 'pf04-temperature', label: 'Which Target Conductor-Temperature Band Applies?', purpose: 'Uses the approved P07 target-temperature range without extrapolation.', section: 'conditions', mode: 'single', familyIds: ['PF04'], when: { questionId: 'pf04-path', optionIds: ['preheat'] }, options: [
    { id: '60-180', label: '60°C to 180°C', modelIds: ['P07A','P07B','P07C'], evidence: 'P07 Approved Maximum Wire Temperature' }, { id: 'outside', label: 'Outside 60°C to 180°C', modelIds: [], evidence: 'P07 Approved Maximum Wire Temperature', caveat: 'The published P07 configurations do not establish a range outside 60–180°C.' }, unknown,
  ] },
  { id: 'pf04-powder-readiness', label: 'Which Powder-Application Conditions Are Confirmed?', purpose: 'Surfaces the utilities and installation inputs needed for a powder-applicator review.', section: 'conditions', mode: 'multiple', familyIds: ['PF04'], when: { questionId: 'pf04-path', optionIds: ['talc','graphite'] }, options: [
    { id: 'powder-defined', label: 'Powder Grade or Mesh Is Defined' }, { id: 'earthing', label: 'Earthing Arrangement Is Defined' }, { id: 'air-quality', label: 'Compressed-Air Quality Is Defined' }, { id: 'running-height', label: 'Wire Running Height Is Defined' }, { id: 'utilities', label: 'Electrical and Utility Supply Is Defined' }, unknown,
  ] },
  { id: 'pf04-joining-material', label: 'Which Conductor Material Requires Joining or Repair?', purpose: 'Records the conductor material without extrapolating a welding range.', section: 'conditions', mode: 'single', familyIds: ['PF04'], when: { questionId: 'pf04-path', optionIds: ['joining'] }, options: [
    { id: 'copper', label: 'Copper' }, { id: 'aluminium', label: 'Aluminium' }, unknown,
  ] },
  { id: 'pf04-joining-construction', label: 'Which Conductor Construction Applies?', purpose: 'Records the approved construction categories for the P09 application review.', section: 'conditions', mode: 'single', familyIds: ['PF04'], when: { questionId: 'pf04-path', optionIds: ['joining'] }, options: [
    { id: 'solid', label: 'Solid Conductor' }, { id: 'stranded', label: 'Stranded Wire' }, unknown,
  ] },
  { id: 'pf05-role', label: 'Which Tension-System Role Is Required?', purpose: 'Prevents indication, sensing, control and actuation from being treated as substitutes.', section: 'conditions', mode: 'single', familyIds: ['PF05'], options: [
    { id: 'indication', label: 'Tension Indication', productIds: ['P10'] }, { id: 'sensing', label: 'Load / Tension Sensing', productIds: ['P12'] }, { id: 'control', label: 'Active Tension Control', productIds: ['P11'] }, { id: 'braking', label: 'Pneumatic Braking Actuation', productIds: ['P13'] }, { id: 'integrated', label: 'Integrated Sensing, Control and Braking Review', productIds: ['P10','P11','P12','P13'] }, unknown,
  ] },
  { id: 'pf05-indicator-size', label: 'Which Wire-Size Band Applies to the Tension Indicator?', purpose: 'Uses approved WTI model wire-size ranges.', section: 'conditions', mode: 'single', familyIds: ['PF05'], when: { questionId: 'pf05-role', optionIds: ['indication'] }, options: [
    { id: '0-2-2', label: '0.2 mm to Below 2 mm', modelIds: ['P10A'], evidence: 'P10 Approved Wire-Size Ranges' }, { id: '2-5', label: '2 mm to 5 mm', modelIds: ['P10A','P10B'], evidence: 'P10 Approved Wire-Size Ranges' }, { id: '5-10', label: 'Above 5 mm to 10 mm', modelIds: ['P10B'], evidence: 'P10 Approved Wire-Size Ranges' }, unknown,
  ] },
  { id: 'pf05-load', label: 'Which Maximum Load or Tension-Capacity Band Applies?', purpose: 'Uses approved P12 series capacities.', section: 'conditions', mode: 'single', familyIds: ['PF05'], when: { questionId: 'pf05-role', optionIds: ['sensing','integrated'] }, options: [
    { id: 'up-to-50', label: 'Up to 50 kg', modelIds: ['P12A','P12B','P12C','P12E','P12F'], evidence: 'P12 Approved Series Capacities' }, { id: '50-100', label: 'Above 50 kg to 100 kg', modelIds: ['P12A','P12B','P12C','P12D','P12F'], evidence: 'P12 Approved Series Capacities' }, { id: '100-200', label: 'Above 100 kg to 200 kg', modelIds: ['P12B','P12C','P12D','P12F'], evidence: 'P12 Approved Series Capacities' }, { id: '200-500', label: 'Above 200 kg to 500 kg', modelIds: ['P12B','P12C','P12D','P12F'], evidence: 'P12 Approved Series Capacities' }, { id: '500-1000', label: 'Above 500 kg to 1000 kg', modelIds: ['P12D','P12F'], evidence: 'P12 Approved Series Capacities' }, { id: '1000-2000', label: 'Above 1000 kg to 2000 kg', modelIds: ['P12F'], evidence: 'P12 Approved Series Capacities' }, { id: '2000-5000', label: 'Above 2000 kg to 5000 kg', modelIds: ['P12F'], evidence: 'P12 Approved Series Capacities' }, unknown, na,
  ] },
  { id: 'pf05-mounting', label: 'Which Loadcell Mounting Category Applies?', purpose: 'Uses the approved P12 series mounting arrangements.', section: 'conditions', mode: 'single', familyIds: ['PF05'], when: { questionId: 'pf05-role', optionIds: ['sensing','integrated'] }, options: [
    { id: 'flange', label: 'Flange Mount', modelIds: ['P12A','P12B','P12E'], evidence: 'P12 Approved Mounting Arrangements' }, { id: 'flange-pilot', label: 'Flange Mount With Pilot Hole', modelIds: ['P12C'], evidence: 'P12C Approved Mounting Arrangement' }, { id: 'pillow-block', label: 'Pillow-Block Arrangement', modelIds: ['P12D','P12F'], evidence: 'P12 Approved Mounting Arrangements' }, unknown,
  ] },
  { id: 'pf05-control-architecture', label: 'Which Existing Tension-Control Architecture Is Known?', purpose: 'Clarifies the sensing, controller and actuation interfaces without treating them as substitutes.', section: 'conditions', mode: 'multiple', familyIds: ['PF05'], when: { questionId: 'pf05-role', optionIds: ['control','integrated'] }, options: [
    { id: 'strain-gauge', label: 'Strain-Gauge Loadcell Feedback' }, { id: 'dancer', label: 'Dancer Input' }, { id: 'line-speed', label: 'Line-Speed Input' }, { id: 'diameter', label: 'Diameter Input' }, { id: 'magnetic-brake', label: 'Magnetic-Brake Output' }, { id: 'pneumatic-brake', label: 'Pneumatic-Brake E-to-P Output' }, unknown,
  ] },
  { id: 'pf05-rpm', label: 'Which Maximum Brake-Speed Band Applies?', purpose: 'Uses approved P13 model-specific RPM limits.', section: 'conditions', mode: 'single', familyIds: ['PF05'], when: { questionId: 'pf05-role', optionIds: ['braking','integrated'] }, options: [
    { id: 'up-to-1200', label: 'Up to 1200 rpm', modelIds: ['P13A','P13B','P13C'], evidence: 'P13 Approved Maximum RPM' }, { id: '1200-1500', label: 'Above 1200 rpm to 1500 rpm', modelIds: ['P13A','P13B'], evidence: 'P13 Approved Maximum RPM' }, { id: '1500-2500', label: 'Above 1500 rpm to 2500 rpm', modelIds: ['P13A'], evidence: 'P13 Approved Maximum RPM' }, unknown, na,
  ] },
  { id: 'pf05-torque', label: 'Which Required Braking-Torque Band per Caliper Applies?', purpose: 'Uses approved P13 model-specific minimum and maximum torque values.', section: 'conditions', mode: 'single', familyIds: ['PF05'], when: { questionId: 'pf05-role', optionIds: ['braking','integrated'] }, options: [
    { id: '0-15-0-24', label: '0.15 kg·m to Below 0.25 kg·m', modelIds: ['P13A'], evidence: 'P13 Approved Torque Ranges' }, { id: '0-25-0-32', label: '0.25 kg·m to Below 0.33 kg·m', modelIds: ['P13A','P13B'], evidence: 'P13 Approved Torque Ranges' }, { id: '0-33-16', label: '0.33 kg·m to 16 kg·m', modelIds: ['P13A','P13B','P13C'], evidence: 'P13 Approved Torque Ranges' }, { id: '16-27', label: 'Above 16 kg·m to 27 kg·m', modelIds: ['P13B','P13C'], evidence: 'P13 Approved Torque Ranges' }, { id: '27-33', label: 'Above 27 kg·m to 33 kg·m', modelIds: ['P13C'], evidence: 'P13 Approved Torque Ranges' }, unknown,
  ] },
  { id: 'pf05-air', label: 'What Is Known About the Pneumatic Supply?', purpose: 'Records the approved brake pressure range and site-readiness status.', section: 'conditions', mode: 'single', familyIds: ['PF05'], when: { questionId: 'pf05-role', optionIds: ['braking','integrated'] }, options: [
    { id: 'within-range', label: '0.2 Bar to 6 Bar Is Available', modelIds: ['P13A','P13B','P13C'], evidence: 'P13 Approved Pressure Range' }, { id: 'outside-range', label: 'Available Pressure Is Outside 0.2 Bar to 6 Bar', modelIds: [], evidence: 'P13 Approved Pressure Range', caveat: 'The published P13 models do not establish operation outside 0.2–6 Bar.' }, { id: 'not-confirmed', label: 'Pneumatic Supply Is Not Confirmed' }, unknown,
  ] },
  { id: 'existing-equipment', label: 'What Is Known About the Existing Equipment?', purpose: 'Identifies integration uncertainty without collecting free text.', section: 'integration', mode: 'single', options: [
    { id: 'documented', label: 'Existing Equipment and Interfaces Are Documented' }, { id: 'partial', label: 'Only Partly Documented' }, { id: 'none', label: 'No Existing Equipment' }, unknown, na,
  ] },
  { id: 'evidence', label: 'Which Review Materials Are Available?', purpose: 'Identifies evidence that can support the next technical conversation.', section: 'integration', mode: 'multiple', options: [
    { id: 'layout', label: 'Line or Test-Area Layout' }, { id: 'drawing', label: 'Mechanical or Electrical Drawings' }, { id: 'procedure', label: 'Test Procedure or Customer Specification' }, { id: 'photos', label: 'Equipment Photographs' }, { id: 'sample', label: 'Product or Sample Details' }, { id: 'none', label: 'None Available Yet' },
  ] },
  { id: 'project-type', label: 'What Is the Project Context?', purpose: 'Applies the approved project route to the product shortlist.', section: 'project', mode: 'single', options: [
    { id: 'new-line', label: 'New Production Line', projectRoute: 'new-line' }, { id: 'retrofit', label: 'Existing-Line Retrofit', projectRoute: 'retrofit' }, { id: 'replacement', label: 'Replacement', projectRoute: 'replacement' }, { id: 'laboratory', label: 'Laboratory Project', projectRoute: 'laboratory' }, { id: 'oem', label: 'OEM / Machine Build', projectRoute: 'oem' }, { id: 'support', label: 'Existing-Equipment Support', projectRoute: 'support' }, unknown,
  ] },
  { id: 'project-stage', label: 'What Is the Current Project Stage?', purpose: 'Organises the review without implying a commercial commitment.', section: 'project', mode: 'single', options: [
    { id: 'concept', label: 'Early Concept' }, { id: 'budgeting', label: 'Budgeting' }, { id: 'technical', label: 'Active Technical Review' }, { id: 'procurement', label: 'Procurement' }, { id: 'installation', label: 'Installation Planning' }, unknown,
  ] },
  { id: 'timing', label: 'Which Timing Band Best Describes the Project?', purpose: 'Records planning urgency without promising availability.', section: 'project', mode: 'single', options: [
    { id: 'immediate', label: 'Immediate Technical Review' }, { id: 'quarter', label: 'Within 3 Months' }, { id: 'six-months', label: 'Within 3–6 Months' }, { id: 'later', label: 'More Than 6 Months' }, unknown,
  ] },
];

export const questionById = new Map(readinessQuestions.map((question) => [question.id, question]));
