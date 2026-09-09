import type { McqQuestion } from '../types/readiness';
import { families, products } from './catalog';

const unknown = { id: 'unknown', label: 'Not Known Yet' };
const na = { id: 'not-applicable', label: 'Not Applicable' };

const questionDefinitions: McqQuestion[] = [
  { id: 'requirement-location', label: 'Where Does the Requirement Occur?', purpose: 'Separates inline production capabilities from offline laboratory validation.', section: 'requirement', mode: 'single', options: [
    { id: 'line', label: 'On a Production Line', productIds: ['P01','P02','P03','P04','P07','P08','P09','P10','P11','P12','P13'] },
    { id: 'laboratory', label: 'In an Offline Laboratory or Test Area', productIds: ['P05','P06'] },
    { id: 'both', label: 'Both Production and Offline Validation' }, unknown,
  ] },
  { id: 'primary-requirement', label: 'Which Requirement Is Closest to the Application?', purpose: 'Adds the governed Primary Product path to the review scope without discarding products or stages already carried forward.', section: 'requirement', mode: 'single', scopeOnly: true, options: [
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
  { id: 'pf01-min-diameter', label: 'What Is the Smallest Diameter the Selected Model Must Measure?', purpose: 'Checks the lower boundary of each approved model range as well as the maximum requirement.', section: 'conditions', mode: 'single', familyIds: ['PF01'], options: [
    { id: 'below-0-1', label: 'Below 0.1 mm', modelIds: [], evidence: 'V4 Model Measurement Ranges', caveat: 'No published PF01 model range begins below 0.1 mm.' },
    { id: '0-1-to-below-0-3', label: '0.1 mm to Below 0.3 mm', modelIds: ['P02A','P02B','P03A'], evidence: 'V4 Model Measurement Ranges' },
    { id: '0-3-to-below-0-5', label: '0.3 mm to Below 0.5 mm', modelIds: ['P02A','P02B','P03A','P03B','P03C'], evidence: 'V4 Model Measurement Ranges' },
    { id: '0-5-to-below-0-8', label: '0.5 mm to Below 0.8 mm', modelIds: ['P02A','P02B','P02C','P03A','P03B','P03C'], evidence: 'V4 Model Measurement Ranges' },
    { id: '0-8-to-below-1', label: '0.8 mm to Below 1.0 mm', modelIds: ['P01A','P02A','P02B','P02C','P03A','P03B','P03C'], evidence: 'V4 Model Measurement Ranges' },
    { id: '1-or-more', label: '1.0 mm or Larger', modelIds: ['P01A','P01B','P02A','P02B','P02C','P03A','P03B','P03C'], evidence: 'V4 Model Measurement Ranges' }, unknown,
  ] },
  { id: 'pf01-max-diameter', label: 'What Maximum Measurement Diameter Must the Selected Model Cover?', purpose: 'Uses approved model measurement ranges without extrapolation.', section: 'conditions', mode: 'single', familyIds: ['PF01'], options: [
    { id: 'up-to-10', label: 'Up to 10 mm', modelIds: ['P01A','P01B','P02A','P02B','P02C','P03A','P03B','P03C'], evidence: 'V4 Model Measurement Ranges' },
    { id: '10-12', label: 'Above 10 mm to 12 mm', modelIds: ['P01A','P01B','P02A','P02B','P02C','P03B','P03C'], evidence: 'V4 Model Measurement Ranges' },
    { id: '12-20', label: 'Above 12 mm to 20 mm', modelIds: ['P01A','P01B','P02B','P02C','P03B','P03C'], evidence: 'V4 Model Measurement Ranges' },
    { id: '20-30', label: 'Above 20 mm to 30 mm', modelIds: ['P01A','P01B','P02B','P02C','P03C'], evidence: 'V4 Model Measurement Ranges' },
    { id: '30-35', label: 'Above 30 mm to 35 mm', modelIds: ['P01A','P01B','P02C'], evidence: 'V4 Model Measurement Ranges' },
    { id: '35-65', label: 'Above 35 mm to 65 mm', modelIds: ['P01B','P02C'], evidence: 'V4 Model Measurement Ranges' },
    { id: '65-150', label: 'Above 65 mm to 150 mm', modelIds: ['P01B'], evidence: 'V4 Model Measurement Ranges' }, { id: 'above-150', label: 'Above 150 mm', modelIds: [], evidence: 'V4 Model Measurement Ranges', caveat: 'No published PF01 model range extends above 150 mm.' }, unknown,
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
    { id: 'up-to-200', label: 'Up to 200 m/min', modelIds: ['P04A','P04B','P04C'], evidence: 'P04 Model Speed Limits' }, { id: '200-1500', label: 'Above 200 m/min to 1500 m/min', modelIds: ['P04B','P04C'], evidence: 'P04 Model Speed Limits' }, { id: '1500-2500', label: 'Above 1500 m/min to 2500 m/min', modelIds: ['P04C'], evidence: 'P04 Model Speed Limits' }, { id: 'above-2500', label: 'Above 2500 m/min', modelIds: [], evidence: 'P04 Model Speed Limits', caveat: 'No published P04 model speed exceeds 2500 m/min.' }, unknown,
  ] },
  { id: 'pf02-voltage', label: 'Which Maximum Test-Voltage Band Applies?', purpose: 'Uses the approved P04 method-specific voltage paths.', section: 'conditions', mode: 'single', familyIds: ['PF02'], options: [
    { id: 'below-1-5', label: 'Below 1.5 kV', modelIds: [], evidence: 'P04 Approved Voltage Ranges', caveat: 'The published P04 voltage paths begin at 1.5 kV.' },
    { id: 'up-to-10', label: '1.5 kV to 10 kV', modelIds: ['P04A','P04B','P04C'], evidence: 'P04 Approved Voltage Ranges' },
    { id: '10-15', label: 'Above 10 kV to 15 kV', modelIds: ['P04A','P04B','P04C'], evidence: 'P04 Approved Voltage Ranges' },
    { id: '15-20', label: 'Above 15 kV to 20 kV', modelIds: ['P04A','P04C'], evidence: 'P04 Approved Voltage Ranges' },
    { id: '20-25', label: 'Above 20 kV to 25 kV', modelIds: ['P04A'], evidence: 'P04 Approved Voltage Paths' },
    { id: '25-30', label: 'Above 25 kV to 30 kV', modelIds: ['P04A'], evidence: 'P04 Approved Voltage Paths' }, { id: 'above-30', label: 'Above 30 kV', modelIds: [], evidence: 'P04 Approved Voltage Paths', caveat: 'No published P04 voltage path exceeds 30 kV.' }, unknown,
  ] },
  { id: 'pf02-diameter', label: 'Which Maximum Wire or Cable-Diameter Band Applies?', purpose: 'Keeps standard and on-demand P04 diameter conditions explicit.', section: 'conditions', mode: 'single', familyIds: ['PF02'], options: [
    { id: 'below-0-5', label: 'Below 0.5 mm OD', modelIds: [], evidence: 'P04 Approved Wire-Size Ranges', caveat: 'The published P04 wire-size paths begin at 0.5 mm OD.' },
    { id: 'up-to-15', label: '0.5 mm to 15 mm OD', modelIds: ['P04A','P04B','P04C'], evidence: 'P04 Approved Wire-Size Ranges' },
    { id: '15-30', label: 'Above 15 mm to 30 mm OD', modelIds: ['P04A','P04C'], reviewRequiredModelIds: ['P04C'], evidence: 'P04 Approved Wire-Size Ranges', caveat: 'DC coverage above 15 mm is an on-demand condition.' },
    { id: '30-40', label: 'Above 30 mm to 40 mm OD', modelIds: ['P04A'], evidence: 'P04 Approved Wire-Size Ranges' },
    { id: '40-60', label: 'Above 40 mm to 60 mm OD', modelIds: ['P04A'], reviewRequiredModelIds: ['P04A'], evidence: 'P04 Approved Wire-Size Ranges', caveat: 'This is an on-demand Live AC condition.' }, { id: 'above-60', label: 'Above 60 mm OD', modelIds: [], evidence: 'P04 Approved Wire-Size Ranges', caveat: 'No published P04 wire-size path exceeds 60 mm OD.' }, unknown,
  ] },
  { id: 'pf02-response', label: 'Which Fault-Response or Quality Functions Are Required?', purpose: 'Captures supporting functions without treating them as spark-tester substitutes.', section: 'conditions', mode: 'multiple', familyIds: ['PF02'], options: [
    { id: 'indication', label: 'Fault Indication and Counting' },
    { id: 'logging', label: 'Data Logging and Graphics', reviewRequired: true, evidence: 'P04 Stage 2 Support Record', caveat: 'Validated only for selected Acute and DC models; not confirmed for Live.' },
    { id: 'marking', label: 'Inline Fault Marking', reviewRequired: true, evidence: 'P04 Stage 3 Support Record', caveat: 'Custom and configuration-dependent.' },
    { id: 'calibration', label: 'Sensitivity Calibration', reviewRequired: true, evidence: 'P04 Sensitivity-Calibrator Support Record', caveat: 'Depends on the tester, sensing method, procedure and documentation need.' },
    { id: 'ul-electrode', label: 'UL Electrode Option', reviewRequired: true, evidence: 'P04 UL Electrode Option Record', caveat: 'Custom and project-specific for Live, Acute and DC testers.' }, unknown,
  ] },
  { id: 'pf03-path', label: 'Which Offline Validation Paths Apply?', purpose: 'Select each required test method. AC, DC and fire testing remain separate capabilities.', section: 'conditions', mode: 'multiple', familyIds: ['PF03'], options: [
    { id: 'ac', label: 'Offline AC High-Voltage Testing', productIds: ['P05'], modelIds: ['P05A'], evidence: 'P05A Approved Test Method' }, { id: 'dc', label: 'Offline DC High-Voltage Testing', productIds: ['P05'], modelIds: ['P05B'], evidence: 'P05B Approved Test Method' }, { id: 'fire', label: 'Fire-Resistance / Circuit-Integrity Testing', productIds: ['P06'], evidence: 'P06 Project-Specific System Record' }, unknown,
  ] },
  { id: 'pf03-ac-voltage', label: 'Which Maximum AC Test-Voltage Band Applies?', purpose: 'Uses the approved AC high-voltage path without transferring DC limits.', section: 'conditions', mode: 'single', familyIds: ['PF03'], when: { questionId: 'pf03-path', optionIds: ['ac'] }, options: [
    { id: 'up-to-20', label: 'Up to 20 kV AC', modelIds: ['P05A'], evidence: 'P05A Approved Voltage Range' }, { id: '20-40', label: 'Above 20 kV to 40 kV AC', modelIds: ['P05A'], evidence: 'P05A Approved Voltage Range' }, { id: 'above-40', label: 'Above 40 kV AC', modelIds: ['P05A'], reviewRequired: true, evidence: 'P05A Request-Based Range Note', caveat: 'Requirements above 40 kV are request-based.' }, unknown,
  ] },
  { id: 'pf03-ac-current', label: 'Which Maximum AC Output-Current Band Applies?', purpose: 'Uses the approved AC output-current path.', section: 'conditions', mode: 'single', familyIds: ['PF03'], when: { questionId: 'pf03-path', optionIds: ['ac'] }, options: [
    { id: 'up-to-1ma', label: 'Up to 1 mA AC', modelIds: ['P05A'], evidence: 'P05A Approved Output Current' }, { id: '1ma-1a', label: 'Above 1 mA to 1 A AC', modelIds: ['P05A'], evidence: 'P05A Approved Output Current' }, { id: 'above-1a', label: 'Above 1 A AC', modelIds: ['P05A'], reviewRequired: true, evidence: 'P05A Request-Based Current Note', caveat: 'Requirements above 1 A are request-based.' }, unknown,
  ] },
  { id: 'pf03-dc-voltage', label: 'Which Maximum DC Test-Voltage Band Applies?', purpose: 'Uses the approved DC range and keeps other voltage requirements request-based.', section: 'conditions', mode: 'single', familyIds: ['PF03'], when: { questionId: 'pf03-path', optionIds: ['dc'] }, options: [
    { id: '0-5-to-20', label: '0.5 kV to 20 kV DC', modelIds: ['P05B'], evidence: 'P05B Approved Voltage Range' }, { id: 'other', label: 'Another DC Voltage Range', modelIds: ['P05B'], reviewRequired: true, evidence: 'P05B Request-Based Voltage Note', caveat: 'Other DC voltage ranges are available only on request.' }, unknown,
  ] },
  { id: 'pf03-dc-current', label: 'Which DC Output-Current Requirement Applies?', purpose: 'Keeps the published 1 mA DC value separate from request-based requirements.', section: 'conditions', mode: 'single', familyIds: ['PF03'], when: { questionId: 'pf03-path', optionIds: ['dc'] }, options: [
    { id: '1ma', label: '1 mA DC', modelIds: ['P05B'], evidence: 'P05B Approved Output Current' }, { id: 'other', label: 'Another DC Output Current', modelIds: ['P05B'], reviewRequired: true, evidence: 'P05B Request-Based Configuration Note', caveat: 'A different DC current requires Puretronics review.' }, unknown,
  ] },
  { id: 'pf03-safety-reporting', label: 'Which Offline Test Functions Are Required?', purpose: 'Records safety, timing, indication and discharge requirements for review.', section: 'conditions', mode: 'multiple', familyIds: ['PF03'], when: { questionId: 'pf03-path', optionIds: ['ac','dc'] }, options: [
    { id: 'fault-indication', label: 'Audio / Visual Fault Indication' }, { id: 'timer', label: 'Digital Timer' }, { id: 'door-interlock', label: 'Door Interlock' }, { id: 'auto-discharge', label: 'Soft Auto-Discharge' }, { id: 'reporting', label: 'Recorded Test Results or Reporting' }, unknown,
  ] },
  { id: 'pf03-fire-basis', label: 'Is the Fire-Test Method or Applicable Specification Available?', purpose: 'P06 remains project-specific and requires the intended test basis.', section: 'conditions', mode: 'single', familyIds: ['PF03'], when: { questionId: 'pf03-path', optionIds: ['fire'] }, options: [
    { id: 'available', label: 'Yes — Method or Specification Is Available', productIds: ['P06'], evidence: 'P06 Project-Specific Review Inputs' }, { id: 'partial', label: 'Partly Defined' }, { id: 'not-available', label: 'Not Available Yet' }, unknown,
  ] },
  { id: 'pf03-fire-sample', label: 'Is the Cable or Sample Construction Defined?', purpose: 'Records the test article needed to configure a project-specific P06 system.', section: 'conditions', mode: 'single', familyIds: ['PF03'], when: { questionId: 'pf03-path', optionIds: ['fire'] }, options: [
    { id: 'defined', label: 'Cable or Sample Construction Is Defined' }, { id: 'partial', label: 'Partly Defined' }, unknown,
  ] },
  { id: 'pf03-fire-site', label: 'Are the Test-Area, Utilities and Safety Requirements Defined?', purpose: 'Surfaces system-level installation inputs without claiming a standard fixed configuration.', section: 'conditions', mode: 'single', familyIds: ['PF03'], when: { questionId: 'pf03-path', optionIds: ['fire'] }, options: [
    { id: 'defined', label: 'Test Area, Utilities and Safety Requirements Are Defined' }, { id: 'partial', label: 'Partly Defined' }, unknown,
  ] },
  { id: 'pf04-path', label: 'Which Process-Equipment Requirements Apply?', purpose: 'Select each required process. Preheating, powder application and joining serve different roles.', section: 'conditions', mode: 'multiple', familyIds: ['PF04'], options: [
    { id: 'preheat', label: 'Inline Conductor Preheating', productIds: ['P07'] }, { id: 'talc', label: 'Talcum Powder Application', productIds: ['P08'], modelIds: ['P08A','P08B','P08C','P08D'], evidence: 'P08 Approved Talcum Variant Records' }, { id: 'graphite', label: 'Graphite Powder Application', productIds: ['P08'], modelIds: ['P08E','P08F'], evidence: 'P08 Approved Graphite Variant Records' }, { id: 'joining', label: 'Conductor Joining / Repair', productIds: ['P09'] }, unknown,
  ] },
  { id: 'pf04-speed', label: 'Which Maximum Process-Speed Band Applies?', purpose: 'Applies only approved P07 and P08 model speed boundaries.', section: 'conditions', mode: 'single', familyIds: ['PF04'], when: { questionId: 'pf04-path', optionIds: ['preheat','talc','graphite'] }, options: [
    { id: 'below-40', label: 'Below 40 m/min', modelIds: ['P08A','P08B','P08C','P08D','P08E','P08F'], evidence: 'P07 Validated Minimum Line Speed and P08 Maximum Speeds' },
    { id: 'up-to-100', label: '40 m/min to 100 m/min', modelIds: ['P07A','P07B','P07C','P08A','P08B','P08C','P08D','P08E','P08F'], evidence: 'P07/P08 Approved Speed Limits' },
    { id: '100-150', label: 'Above 100 m/min to 150 m/min', modelIds: ['P07A','P07B','P07C','P08A','P08B','P08C','P08D','P08E'], evidence: 'P07/P08 Approved Speed Limits' },
    { id: '150-250', label: 'Above 150 m/min to 250 m/min', modelIds: ['P07A','P07B','P07C','P08B','P08C'], evidence: 'P07/P08 Approved Speed Limits' },
    { id: '250-400', label: 'Above 250 m/min to 400 m/min', modelIds: ['P07A','P07B','P07C','P08C'], evidence: 'P07/P08 Approved Speed Limits' },
    { id: '400-1000', label: 'Above 400 m/min to 1000 m/min', modelIds: ['P07A','P07B','P07C'], evidence: 'P07 Approved Speed Configurations' },
    { id: '1000-1500', label: 'Above 1000 m/min to 1500 m/min', modelIds: ['P07B','P07C'], evidence: 'P07 Approved Speed Configurations' },
    { id: '1500-2000', label: 'Above 1500 m/min to 2000 m/min', modelIds: ['P07C'], evidence: 'P07 Approved Speed Configurations' }, { id: 'above-2000', label: 'Above 2000 m/min', modelIds: [], evidence: 'P07/P08 Approved Speed Limits', caveat: 'No published P07 or P08 path exceeds 2000 m/min.' }, unknown, na,
  ] },
  { id: 'pf04-preheat-min-size', label: 'What Is the Smallest Conductor Diameter to Be Preheated?', purpose: 'Checks the lower boundary of each P07 speed configuration.', section: 'conditions', mode: 'single', familyIds: ['PF04'], when: { questionId: 'pf04-path', optionIds: ['preheat'] }, options: [
    { id: 'below-0-1', label: 'Below 0.1 mm', modelIds: [], excludesProduct: true, evidence: 'P07 Validated Configurable Envelope', caveat: 'The published configurable conductor range starts at 0.1 mm.' }, { id: 'below-0-3', label: '0.1 mm to Below 0.3 mm', modelIds: [], configurationReview: true, evidence: 'P07 Validated Configurable Envelope', caveat: 'This diameter requires a configured preheater application review.' }, { id: '0-3-to-below-0-4', label: '0.3 mm to Below 0.4 mm', modelIds: ['P07C'], evidence: 'P07 Approved Wire Ranges' }, { id: '0-4-to-below-0-5', label: '0.4 mm to Below 0.5 mm', modelIds: ['P07A','P07C'], evidence: 'P07 Approved Wire Ranges' }, { id: '0-5-or-more', label: '0.5 mm or Larger', modelIds: ['P07A','P07B','P07C'], evidence: 'P07 Approved Wire Ranges' }, unknown,
  ] },
  { id: 'pf04-preheat-max-size', label: 'What Is the Largest Conductor Diameter to Be Preheated?', purpose: 'Checks the upper boundary of each P07 speed configuration.', section: 'conditions', mode: 'single', familyIds: ['PF04'], when: { questionId: 'pf04-path', optionIds: ['preheat'] }, options: [
    { id: 'up-to-1-4', label: 'Up to 1.4 mm', modelIds: ['P07A','P07B','P07C'], evidence: 'P07 Approved Wire Ranges' }, { id: '1-4-to-2-8', label: 'Above 1.4 mm to 2.8 mm', modelIds: ['P07A','P07B'], evidence: 'P07 Approved Wire Ranges' }, { id: '2-8-to-3-6', label: 'Above 2.8 mm to 3.6 mm', modelIds: ['P07A'], evidence: 'P07 Approved Wire Ranges' }, { id: 'above-3-6', label: 'Above 3.6 mm to 10 mm', modelIds: [], configurationReview: true, evidence: 'P07 Validated Configurable Envelope', caveat: 'This diameter requires a configured preheater application review.' }, { id: '10-16', label: 'Above 10 mm to 16 mm', modelIds: [], configurationReview: true, evidence: 'P07 Validated Configurable Envelope', caveat: 'This range is published for bunched conductors only and requires configuration review.' }, { id: 'above-16', label: 'Above 16 mm', modelIds: [], excludesProduct: true, evidence: 'P07 Validated Configurable Envelope', caveat: 'This exceeds the published maximum configurable conductor diameter.' }, unknown,
  ] },
  { id: 'pf04-powder-size', label: 'Which Maximum Cable-Diameter Band Applies?', purpose: 'Uses only approved P08 model-specific cable-diameter boundaries.', section: 'conditions', mode: 'single', familyIds: ['PF04'], when: { questionId: 'pf04-path', optionIds: ['talc','graphite'] }, options: [
    { id: 'up-to-40', label: 'Up to 40 mm', modelIds: ['P08A','P08B','P08C','P08D','P08E','P08F'], evidence: 'P08 Approved Diameter Ranges' }, { id: '40-100', label: 'Above 40 mm to 100 mm', modelIds: ['P08D','P08F'], evidence: 'P08 Approved Diameter Ranges' }, { id: 'above-100', label: 'Above 100 mm', modelIds: [], evidence: 'P08 Approved Diameter Ranges', caveat: 'No published P08 cable-diameter path exceeds 100 mm.' }, unknown,
  ] },
  { id: 'pf04-temperature', label: 'Which Target Conductor-Temperature Band Applies?', purpose: 'Uses the approved P07 target-temperature range without extrapolation.', section: 'conditions', mode: 'single', familyIds: ['PF04'], when: { questionId: 'pf04-path', optionIds: ['preheat'] }, options: [
    { id: '60-180', label: '60°C to 180°C', modelIds: ['P07A','P07B','P07C'], evidence: 'P07 Approved Maximum Wire Temperature' }, { id: 'outside', label: 'Outside 60°C to 180°C', modelIds: [], evidence: 'P07 Approved Maximum Wire Temperature', caveat: 'The published P07 configurations do not establish a range outside 60–180°C.' }, unknown,
  ] },
  { id: 'pf04-powder-readiness', label: 'Which Powder-Application Conditions Are Confirmed?', purpose: 'Surfaces the utilities and installation inputs needed for a powder-applicator review.', section: 'conditions', mode: 'multiple', familyIds: ['PF04'], when: { questionId: 'pf04-path', optionIds: ['talc','graphite'] }, options: [
    { id: 'powder-defined', label: 'Clean, Dry Powder Meets the Selected Talcum Mesh or Graphite Grade' }, { id: 'earthing', label: 'Earthing Below 1 V and the Machine Earth Connection Are Confirmed' }, { id: 'air-quality', label: 'Panel Air Is Free of Moisture and Mist' }, { id: 'running-height', label: 'Wire Running Height Matches the Selected Applicator' }, { id: 'utilities', label: '415 VAC Three-Phase Supply and Required Power Are Available' }, unknown,
  ] },
  { id: 'pf04-joining-material', label: 'Which Conductor Material Requires Joining or Repair?', purpose: 'Records the conductor material without extrapolating a welding range.', section: 'conditions', mode: 'single', familyIds: ['PF04'], when: { questionId: 'pf04-path', optionIds: ['joining'] }, options: [
    { id: 'copper', label: 'Copper' }, { id: 'aluminium', label: 'Aluminium' }, unknown,
  ] },
  { id: 'pf04-joining-construction', label: 'Which Conductor Construction Applies?', purpose: 'Records the approved construction categories for the P09 application review.', section: 'conditions', mode: 'single', familyIds: ['PF04'], when: { questionId: 'pf04-path', optionIds: ['joining'] }, options: [
    { id: 'solid', label: 'Solid Conductor' }, { id: 'stranded', label: 'Stranded Wire' }, unknown,
  ] },
  { id: 'pf05-role', label: 'Which Tension-System Roles Are Required?', purpose: 'Select each role required. Indication, sensing, control and braking perform different functions.', section: 'conditions', mode: 'multiple', familyIds: ['PF05'], options: [
    { id: 'indication', label: 'Tension Indication', productIds: ['P10'] }, { id: 'sensing', label: 'Load / Tension Sensing', productIds: ['P12'] }, { id: 'control', label: 'Active Tension Control', productIds: ['P11'] }, { id: 'braking', label: 'Pneumatic Braking Actuation', productIds: ['P13'] }, { id: 'integrated', label: 'Integrated Sensing, Control and Braking Review', productIds: ['P10','P11','P12','P13'] }, unknown,
  ] },
  { id: 'pf05-indicator-size', label: 'Which Wire-Size Band Applies to the Tension Indicator?', purpose: 'Uses approved WTI model wire-size ranges.', section: 'conditions', mode: 'single', familyIds: ['PF05'], when: { questionId: 'pf05-role', optionIds: ['indication','integrated'] }, options: [
    { id: 'below-0-2', label: 'Below 0.2 mm', modelIds: [], evidence: 'P10 Approved Wire-Size Ranges', caveat: 'No published P10 wire range begins below 0.2 mm.' }, { id: '0-2-2', label: '0.2 mm to Below 2 mm', modelIds: ['P10A'], evidence: 'P10 Approved Wire-Size Ranges' }, { id: '2-5', label: '2 mm to 5 mm', modelIds: ['P10A','P10B'], evidence: 'P10 Approved Wire-Size Ranges' }, { id: '5-10', label: 'Above 5 mm to 10 mm', modelIds: ['P10B'], evidence: 'P10 Approved Wire-Size Ranges' }, { id: 'above-10', label: 'Above 10 mm', modelIds: [], evidence: 'P10 Approved Wire-Size Ranges', caveat: 'No published P10 wire range extends above 10 mm.' }, unknown,
  ] },
  { id: 'pf05-indicator-tension', label: 'Which Maximum Published Tension Configuration Is Required?', purpose: 'Uses the two approved WTI tension configurations and identifies requirements beyond them.', section: 'conditions', mode: 'single', familyIds: ['PF05'], when: { questionId: 'pf05-role', optionIds: ['indication','integrated'] }, options: [
    { id: 'up-to-15', label: 'Up to 15 kg', modelIds: ['P10A','P10B'], reviewRequired: true, evidence: 'Puretronics Validated WTI Configuration Answer Q8', caveat: 'The tension range is configured and confirmed for the application.' }, { id: '15-to-40', label: 'Above 15 kg to 40 kg', modelIds: ['P10A','P10B'], reviewRequired: true, evidence: 'Puretronics Validated WTI Configuration Answer Q8', caveat: 'The tension range is configured and confirmed for the application.' }, { id: 'above-40', label: 'Above 40 kg', modelIds: ['P10A','P10B'], reviewRequired: true, evidence: 'Puretronics Validated WTI Configuration Answer Q8', caveat: 'Higher tension ranges require a configured quotation; standard coverage is not established.' }, unknown,
  ] },
  { id: 'pf05-capacity', label: 'Which Exact Published Loadcell Capacity Is Required?', purpose: 'Resolves against approved capacity SKU records rather than broad series bands.', section: 'conditions', mode: 'single', familyIds: ['PF05'], when: { questionId: 'pf05-role', optionIds: ['sensing','integrated'] }, options: [
    { id: '10', label: '10 kg', modelIds: ['P12A','P12E'], variantIds: ['P12A-C10','P12E-C10'], evidence: 'P12 Approved Capacity SKU Records' },
    { id: '20', label: '20 kg', modelIds: ['P12A','P12E'], variantIds: ['P12A-C20','P12E-C20'], evidence: 'P12 Approved Capacity SKU Records' },
    { id: '50', label: '50 kg', modelIds: ['P12A','P12B','P12C','P12E'], variantIds: ['P12A-C50','P12B-C50','P12C-C50','P12E-C50'], evidence: 'P12 Approved Capacity SKU Records' },
    { id: '100', label: '100 kg', modelIds: ['P12A','P12B','P12C','P12D','P12F'], variantIds: ['P12A-C100','P12B-C100','P12C-C100','P12D-C100','P12F-C100'], evidence: 'P12 Approved Capacity SKU Records' },
    { id: '200', label: '200 kg', modelIds: ['P12B','P12C','P12D'], variantIds: ['P12B-C200','P12C-C200','P12D-C200'], evidence: 'P12 Approved Capacity SKU Records' },
    { id: '500', label: '500 kg', modelIds: ['P12B','P12C','P12D','P12F'], variantIds: ['P12B-C500','P12C-C500','P12D-C500','P12F-C500'], evidence: 'P12 Approved Capacity SKU Records' },
    { id: '1000', label: '1000 kg', modelIds: ['P12D','P12F'], variantIds: ['P12D-C1000','P12F-C1000'], evidence: 'P12 Approved Capacity SKU Records' },
    { id: '2000', label: '2000 kg', modelIds: ['P12F'], variantIds: ['P12F-C2000'], evidence: 'P12 Approved Capacity SKU Records' },
    { id: '5000', label: '5000 kg', modelIds: ['P12F'], variantIds: ['P12F-C5000'], evidence: 'P12 Approved Capacity SKU Records' }, { id: 'other-capacity', label: 'Another Capacity', modelIds: [], evidence: 'P12 Approved Capacity SKU Records', caveat: 'No current approved capacity SKU exactly matches this selection.' }, unknown, na,
  ] },
  { id: 'pf05-mounting', label: 'Which Loadcell Mounting Category Applies?', purpose: 'Uses the approved P12 series mounting arrangements.', section: 'conditions', mode: 'single', familyIds: ['PF05'], when: { questionId: 'pf05-role', optionIds: ['sensing','integrated'] }, options: [
    { id: 'flange', label: 'Flange Mount', modelIds: ['P12A','P12B','P12E'], evidence: 'P12 Approved Mounting Arrangements' }, { id: 'flange-pilot', label: 'Flange Mount With Pilot Hole', modelIds: ['P12C'], evidence: 'P12C Approved Mounting Arrangement' }, { id: 'pillow-block', label: 'Pillow-Block Arrangement', modelIds: ['P12D','P12F'], evidence: 'P12 Approved Mounting Arrangements' }, unknown,
  ] },
  { id: 'pf05-control-architecture', label: 'Which Existing Tension-Control Architecture Is Known?', purpose: 'Clarifies the sensing, controller and actuation interfaces without treating them as substitutes.', section: 'conditions', mode: 'multiple', familyIds: ['PF05'], when: { questionId: 'pf05-role', optionIds: ['control','integrated'] }, options: [
    { id: 'strain-gauge', label: 'Strain-Gauge Loadcell Feedback' }, { id: 'dancer', label: 'Dancer Input' }, { id: 'line-speed', label: 'Line-Speed Input' }, { id: 'diameter', label: 'Diameter Input' }, { id: 'magnetic-brake', label: 'Magnetic-Brake Output' }, { id: 'pneumatic-brake', label: 'Pneumatic-Brake E-to-P Output' }, unknown,
  ] },
  { id: 'pf05-rpm', label: 'Which Maximum Brake-Speed Band Applies?', purpose: 'Uses approved P13 model-specific RPM limits.', section: 'conditions', mode: 'single', familyIds: ['PF05'], when: { questionId: 'pf05-role', optionIds: ['braking','integrated'] }, options: [
    { id: 'up-to-1200', label: 'Up to 1200 rpm', modelIds: ['P13A','P13B','P13C'], evidence: 'P13 Approved Maximum RPM' }, { id: '1200-1500', label: 'Above 1200 rpm to 1500 rpm', modelIds: ['P13A','P13B'], evidence: 'P13 Approved Maximum RPM' }, { id: '1500-2500', label: 'Above 1500 rpm to 2500 rpm', modelIds: ['P13A'], evidence: 'P13 Approved Maximum RPM' }, { id: 'above-2500', label: 'Above 2500 rpm', modelIds: [], evidence: 'P13 Approved Maximum RPM', caveat: 'No published P13 maximum speed exceeds 2500 rpm.' }, unknown, na,
  ] },
  { id: 'pf05-torque', label: 'Which Required Braking-Torque Band per Caliper Applies?', purpose: 'Uses approved P13 model-specific minimum and maximum torque values. Enter the per-caliper requirement only; total system torque cannot be compared directly.', section: 'conditions', mode: 'single', familyIds: ['PF05'], when: { questionId: 'pf05-role', optionIds: ['braking','integrated'] }, options: [
    { id: 'below-0-15', label: 'Below 0.15 kg·m', modelIds: [], evidence: 'P13 Approved Torque Ranges', caveat: 'No published P13 per-caliper range begins below 0.15 kg·m.' }, { id: '0-15-0-24', label: '0.15 kg·m to Below 0.25 kg·m', modelIds: ['P13A'], evidence: 'P13 Approved Torque Ranges' }, { id: '0-25-0-32', label: '0.25 kg·m to Below 0.33 kg·m', modelIds: ['P13A','P13B'], evidence: 'P13 Approved Torque Ranges' }, { id: '0-33-16', label: '0.33 kg·m to 16 kg·m', modelIds: ['P13A','P13B','P13C'], evidence: 'P13 Approved Torque Ranges' }, { id: '16-27', label: 'Above 16 kg·m to 27 kg·m', modelIds: ['P13B','P13C'], evidence: 'P13 Approved Torque Ranges' }, { id: '27-33', label: 'Above 27 kg·m to 33 kg·m', modelIds: ['P13C'], evidence: 'P13 Approved Torque Ranges' }, { id: 'above-33', label: 'Above 33 kg·m', modelIds: [], evidence: 'P13 Approved Torque Ranges', caveat: 'No published P13 per-caliper range exceeds 33 kg·m.' }, unknown,
  ] },
  { id: 'pf05-air', label: 'What Is Known About the Pneumatic Supply?', purpose: 'Records the approved brake pressure range and site-readiness status.', section: 'conditions', mode: 'single', familyIds: ['PF05'], when: { questionId: 'pf05-role', optionIds: ['braking','integrated'] }, options: [
    { id: 'within-range', label: 'A Regulated Brake Supply Within 0.2 Bar to 6 Bar Is Available', modelIds: ['P13A','P13B','P13C'], evidence: 'P13 Approved Pressure Range' }, { id: 'outside-range', label: 'The Brake Must Operate Outside 0.2 Bar to 6 Bar', modelIds: [], evidence: 'P13 Approved Pressure Range', caveat: 'The published brake models do not establish operation outside 0.2–6 Bar. A higher plant supply pressure alone is not an exclusion if it can be regulated for the brake.' }, { id: 'not-confirmed', label: 'Pneumatic Supply Is Not Confirmed' }, unknown,
  ] },
  { id: 'pf05-torque-basis', label: 'How Is the Braking Demand Defined?', purpose: 'Prevents total system demand from being compared directly with a per-caliper published value.', section: 'conditions', mode: 'single', familyIds: ['PF05'], when: { questionId: 'pf05-role', optionIds: ['braking','integrated'] }, options: [
    { id: 'per-caliper', label: 'Required Torque per Caliper Is Known' }, { id: 'total-only', label: 'Only Total System Braking Demand Is Known', reviewRequired: true, evidence: 'P13 Per-Caliper Braking Values', caveat: 'Puretronics must establish the caliper arrangement before model selection.' }, unknown,
  ] },
  { id: 'pf05-brake-geometry', label: 'What Is Known About Reel, Core and Shaft Geometry?', purpose: 'Records a mandatory P13 selection input without inventing a dimensional fit.', section: 'conditions', mode: 'single', familyIds: ['PF05'], when: { questionId: 'pf05-role', optionIds: ['braking','integrated'] }, options: [
    { id: 'documented', label: 'Reel, Core and Shaft Dimensions Are Documented' }, { id: 'partial', label: 'Only Partly Documented' }, unknown,
  ] },
  { id: 'pf05-brake-duty', label: 'Is the Braking Duty Defined?', purpose: 'Records the duty requirement needed for final thermal and mechanical review.', section: 'conditions', mode: 'single', familyIds: ['PF05'], when: { questionId: 'pf05-role', optionIds: ['braking','integrated'] }, options: [
    { id: 'defined', label: 'Duty and Operating Cycle Are Defined' }, { id: 'partial', label: 'Partly Defined' }, unknown,
  ] },
  { id: 'pf05-brake-mounting', label: 'Is the Brake Mounting Arrangement Defined?', purpose: 'Records installation readiness without claiming mechanical interchangeability.', section: 'conditions', mode: 'single', familyIds: ['PF05'], when: { questionId: 'pf05-role', optionIds: ['braking','integrated'] }, options: [
    { id: 'defined', label: 'Mounting Arrangement Is Defined' }, { id: 'partial', label: 'Partly Defined' }, unknown,
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

const additionalQuestions: McqQuestion[] = [
  { id: 'pf01-material', label: 'Which Optical Measurement Condition Applies?', purpose: 'Transparent-material measurement requires the appropriate model and advance configuration.', section: 'conditions', mode: 'single', familyIds: ['PF01'], options: [
    { id: 'opaque', label: 'Opaque Wire or Cable' }, { id: 'transparent', label: 'Transparent or Translucent Product', reviewRequired: true, evidence: 'LASER Model Transparency Configuration Notes', caveat: 'Confirm the material and optical measurement configuration with Puretronics.' }, unknown,
  ] },
  { id: 'pf02-min-diameter', label: 'What Is the Smallest Wire or Cable Diameter to Be Spark Tested?', purpose: 'The whole required diameter range must remain above the spark tester minimum.', section: 'conditions', mode: 'single', familyIds: ['PF02'], options: [
    { id: 'below-0-5', label: 'Below 0.5 mm OD', modelIds: [], evidence: 'P04 Approved Wire-Size Ranges' }, { id: '0-5-or-more', label: '0.5 mm OD or Larger', modelIds: ['P04A','P04B','P04C'], evidence: 'P04 Approved Wire-Size Ranges' }, unknown,
  ] },
  { id: 'pf02-min-voltage', label: 'What Is the Lowest Required Spark-Test Voltage?', purpose: 'Checks the lower limit as well as the maximum test voltage.', section: 'conditions', mode: 'single', familyIds: ['PF02'], options: [
    { id: 'below-1-5', label: 'Below 1.5 kV', modelIds: [], evidence: 'P04 Approved Voltage Ranges' }, { id: '1-5-or-more', label: '1.5 kV or Higher', modelIds: ['P04A','P04B','P04C'], evidence: 'P04 Approved Voltage Ranges' }, unknown,
  ] },
  { id: 'pf03-test-basis', label: 'Are the Offline Electrical Test Method and Sample Defined?', purpose: 'Voltage and current alone do not establish the sample, test duration or safety arrangement.', section: 'conditions', mode: 'single', familyIds: ['PF03'], when: { questionId: 'pf03-path', optionIds: ['ac','dc'] }, options: [
    { id: 'defined', label: 'Sample, Test Procedure, Duration and Safety Arrangement Are Defined' }, { id: 'partial', label: 'Only Partly Defined' }, unknown,
  ] },
  { id: 'pf04-preheat-construction', label: 'Which Conductor Construction Will Be Preheated?', purpose: 'The configurable diameter envelope differs for solid and bunched conductors.', section: 'conditions', mode: 'single', familyIds: ['PF04'], when: { questionId: 'pf04-path', optionIds: ['preheat'] }, options: [
    { id: 'solid', label: 'Solid Conductor' }, { id: 'bunched', label: 'Bunched or Stranded Conductor' }, unknown,
  ] },
  { id: 'pf04-preheat-material', label: 'Which Preheater Material Is Specified?', purpose: 'Heating power and achievable speed depend on the actual conductor material and diameter.', section: 'conditions', mode: 'single', familyIds: ['PF04'], when: { questionId: 'pf04-path', optionIds: ['preheat'] }, options: [
    { id: 'copper', label: 'Copper' }, { id: 'aluminium', label: 'Aluminium' }, { id: 'steel', label: 'Steel' }, { id: 'other', label: 'Another Specified Material', reviewRequired: true, evidence: 'P07 Validated Configurable Material Envelope', caveat: 'Puretronics must confirm the material and heating configuration.' }, unknown,
  ] },
  { id: 'pf04-powder-specification', label: 'Which Powder Specification Has Been Confirmed?', purpose: 'Talcum and graphite have different material requirements. A matching speed and diameter do not establish powder compatibility.', section: 'conditions', mode: 'multiple', familyIds: ['PF04'], when: { questionId: 'pf04-path', optionIds: ['talc','graphite'] }, options: [
    { id: 'talc-2000', label: 'Talcum Powder, Mesh 2000 or Finer', modelIds: ['P08A','P08B','P08C','P08D'], evidence: 'P08 Talcum Powder Specifications' },
    { id: 'graphite-23061', label: 'THIELMANN GRAPHITE 23061 or Confirmed Equivalent', modelIds: ['P08E','P08F'], evidence: 'P08 Graphite Powder Specifications' },
    { id: 'other', label: 'Another Powder Specification', reviewRequired: true, evidence: 'P08 Model-Specific Powder Requirements', caveat: 'Alternative powder specifications require Puretronics confirmation.' }, unknown,
  ] },
  { id: 'pf04-joining-size', label: 'What Conductor Cross-Section Requires Joining?', purpose: 'Checks conductor cross-sectional area; this value is not a diameter in millimetres.', section: 'conditions', mode: 'single', familyIds: ['PF04'], when: { questionId: 'pf04-path', optionIds: ['joining'] }, options: [
    { id: 'below-0-2', label: 'Below 0.2 mm²', excludesProduct: true, evidence: 'P09 Validated 0.2–6 sq mm Range', caveat: 'The published joining range starts at 0.2 mm².' }, { id: '0-2-to-6', label: '0.2 mm² to 6 mm²' }, { id: 'above-6', label: 'Above 6 mm²', excludesProduct: true, evidence: 'P09 Validated 0.2–6 sq mm Range', caveat: 'The published joining range ends at 6 mm².' }, unknown,
  ] },
  { id: 'pf05-loadcell-interface', label: 'Are the Loadcell Geometry and Signal Requirements Defined?', purpose: 'Matching capacity and mounting category does not establish shaft geometry, load direction or electrical compatibility.', section: 'conditions', mode: 'single', familyIds: ['PF05'], when: { questionId: 'pf05-role', optionIds: ['sensing','integrated'] }, options: [
    { id: 'defined', label: 'Shaft Geometry, Load Direction, Signal and Environment Are Defined' }, { id: 'partial', label: 'Only Partly Defined' }, unknown,
  ] },
  { id: 'pf05-wti-installation', label: 'Are the Tension-Indicator Installation and Output Needs Defined?', purpose: 'Wire size and tension range do not establish mechanical fit, calibration or the required output.', section: 'conditions', mode: 'single', familyIds: ['PF05'], when: { questionId: 'pf05-role', optionIds: ['indication','integrated'] }, options: [
    { id: 'defined', label: 'Mechanical Arrangement, Calibration and Outputs Are Defined' }, { id: 'partial', label: 'Only Partly Defined' }, unknown,
  ] },
];

const productScope = (id: string): string[] | undefined => {
  if (id.startsWith('pf01-')) return ['P01','P02','P03'];
  if (id.startsWith('pf02-')) return ['P04'];
  if (id === 'pf03-path') return ['P05','P06'];
  if (id.startsWith('pf03-fire-')) return ['P06'];
  if (id.startsWith('pf03-')) return ['P05'];
  if (id === 'pf04-path') return ['P07','P08','P09'];
  if (id === 'pf04-speed') return ['P07','P08'];
  if (id.startsWith('pf04-preheat-') || id === 'pf04-temperature') return ['P07'];
  if (id.startsWith('pf04-powder-')) return ['P08'];
  if (id.startsWith('pf04-joining-')) return ['P09'];
  if (id === 'pf05-role') return ['P10','P11','P12','P13'];
  if (id.startsWith('pf05-indicator-') || id === 'pf05-wti-installation') return ['P10'];
  if (['pf05-capacity','pf05-mounting','pf05-loadcell-interface'].includes(id)) return ['P12'];
  if (id === 'pf05-control-architecture') return ['P11'];
  if (id.startsWith('pf05-')) return ['P13'];
  return undefined;
};

// Keep added technical questions next to their family, ahead of common integration questions.
const sections: McqQuestion['section'][] = ['requirement','application','conditions','integration','project'];
export const readinessQuestions: McqQuestion[] = [...questionDefinitions, ...additionalQuestions]
  .map((question) => ({ ...question, productIds: productScope(question.id),
    modelScope: question.id.startsWith('pf03-ac-') ? ['P05A'] : question.id.startsWith('pf03-dc-') ? ['P05B'] : undefined }))
  .sort((a, b) => sections.indexOf(a.section) - sections.indexOf(b.section) ||
    (a.section === 'conditions' ? (a.familyIds?.[0] ?? '').localeCompare(b.familyIds?.[0] ?? '') : 0));

export const questionById = new Map(readinessQuestions.map((question) => [question.id, question]));

export function validateReadinessQuestions() {
  const errors: string[] = [];
  const productIds = new Set(products.map((product) => product.id));
  const modelIds = new Set(products.flatMap((product) => product.models.map((model) => model.id)));
  const variantIds = new Set(products.flatMap((product) => product.models.flatMap((model) => model.children ?? []).map((variant) => variant.id)));
  const familyIds = new Set(families.map((family) => family.id));
  const questionIds = new Set<string>();
  for (const question of readinessQuestions) {
    if (questionIds.has(question.id)) errors.push(`Duplicate Question ID: ${question.id}`);
    questionIds.add(question.id);
    if (!question.options.length) errors.push(`Question Has No Options: ${question.id}`);
    if (question.familyIds?.some((id) => !familyIds.has(id))) errors.push(`Unknown Family on ${question.id}`);
    if (question.productIds?.some((id) => !productIds.has(id))) errors.push(`Unknown Product Scope on ${question.id}`);
    const optionIds = new Set<string>();
    for (const option of question.options) {
      if (optionIds.has(option.id)) errors.push(`Duplicate Option ${option.id} on ${question.id}`);
      optionIds.add(option.id);
      if (option.productIds?.some((id) => !productIds.has(id))) errors.push(`Unknown Product on ${question.id}/${option.id}`);
      if (option.modelIds?.some((id) => !modelIds.has(id))) errors.push(`Unknown Model on ${question.id}/${option.id}`);
      if (option.reviewRequiredModelIds?.some((id) => !modelIds.has(id))) errors.push(`Unknown Conditional-Review Model on ${question.id}/${option.id}`);
      if (option.variantIds?.some((id) => !variantIds.has(id))) errors.push(`Unknown Variant on ${question.id}/${option.id}`);
      if ((option.modelIds || option.variantIds || option.reviewRequired || option.reviewRequiredModelIds || option.excludesProduct || option.configurationReview) && !option.evidence) errors.push(`Missing Evidence on ${question.id}/${option.id}`);
    }
  }
  for (const question of readinessQuestions) if (question.when) {
    const parent = questionById.get(question.when.questionId);
    if (!parent) errors.push(`Unknown Parent Question on ${question.id}`);
    else if (question.when.optionIds.some((id) => !parent.options.some((option) => option.id === id))) errors.push(`Unknown Parent Option on ${question.id}`);
  }
  return errors;
}
