import rawCatalog from './v4Catalog.generated.json';

// Keep technical traceability in the source snapshot; customer copy is curated here.
const records = new Map(rawCatalog.records.map((record) => [record.id, record]));
export const publicName = (id: string): string => customerText(records.get(id)?.name ?? 'Equipment option');

const replacements: Record<string, string> = {
  'Stage 1 Fault Interface': 'Fault Interface',
  'Stage 2 Data Logging and Graphics': 'Data Logging and Graphics',
  'Stage 3 Inline Marking System': 'Inline Fault Marking System',
  'A governed group of laser-system support components for applicable measurement installations.': 'Laser-system accessories for the selected measurement installation.',
  'A governed group of optional laser-system support and control components for applicable installations.': 'Optional display, logging, mounting and control accessories for the selected laser system.',
  'Model-specific and accessory-specific claims must be checked on the exact child or support record.': 'Confirm the selected model, accessories and interfaces for your application.',
  'Do not describe LASER-H as a general surface-defect inspection system or transfer LASER-H software/HMI claims to WTI.': 'LASER-H detects diameter changes and lump-and-neck conditions. Other surface defects require a separate inspection review.',
  'A governed selection path for mains-frequency AC, high-frequency AC, and DC spark testing with staged fault intelligence.': 'Choose between mains-frequency AC, high-frequency AC and DC spark testing, with fault indication, logging or marking as required.',
  'The frozen Stage 1 fault-interface record for spark-testing fault detection and basic indication.': 'Provides a fault interface and basic indication for spark testing.',
  'The Stage 2 data-logging and graphics support record for selected spark-tester models.': 'Adds data logging and graphics to compatible spark-tester models.',
  'The Stage 3 inline-marking support record for project-dependent spark-testing configurations.': 'Adds inline fault marking where the selected spark tester and line arrangement support it.',
  'A sensitivity-calibration support record for spark tester verification and calibration workflows.': 'Supports spark-tester sensitivity verification and calibration.',
  'Test values and utilities may be configured for the application and should not be generalized across AC and DC records.': 'Voltage, current, test duration and utilities must be confirmed separately for the selected AC or DC tester.',
  'Fire Resistance standards and editions remain Pending Validation; final compliance is quotation-dependent.': 'Confirm the required test standard, edition and complete system configuration with Puretronics. Compliance must be assessed against the specific project and test procedure.',
  'PH 10019C is retained because it appears in Puretronics Input Files. P07A–P07C are speed configuration classes, not separate combinatorial SKUs.': 'Preheater speed configurations require review against wire material, construction, diameter and target temperature. Confirm the complete operating combination with Puretronics.',
  'Do not infer universal material, diameter, or process limits without an applicable source.': 'Confirm conductor material, solid or stranded construction, conductor size and the required joint before selection.',
  'WTI alone is not the complete closed-loop controller. Preserve source-provided units; use SI only where the source provides no unit.': 'WTI measures and indicates tension. Active tension control also requires a suitable controller and actuator.',
  'WTI is a tension-indication device and is not presented as the complete closed-loop controller. Use P11 for the controller path where closed-loop control is required.': 'WTI measures and indicates tension. Review the LTC-PRO controller and suitable sensing and actuation when active control is required.',
  'P11 is intentionally standalone and has no dummy children in the frozen hierarchy.': 'Confirm the sensing, actuator or brake, machine interfaces and control mode for the complete tension-control system.',
  'A governed route from loadcell series and mechanical fit to the exact capacity and compatible support items.': 'Select a loadcell by its capacity, mounting and shaft arrangement, then confirm the required accessories.',
  'Select the loadcell series by mounting and shaft arrangement, then choose the exact approved capacity SKU and compatible amplifier, bracket, cable, or bearing support.': 'Select the loadcell series by mounting and shaft arrangement, then choose a capacity and compatible amplifier, bracket, cable or bearing support.',
  'CE-compliant versions and stainless-steel construction are custom. ATEX/explosion-proof applicability is limited to LC-AR-85. The military-type connector claim is not general.': 'CE-compliant versions and stainless-steel construction require a custom quotation. ATEX or explosion-proof requirements can be reviewed for LC-AR-85 only; confirm the exact certification and connector for the selected configuration.',
  'Capacity-specific values are governed on the approved SKU records. ATEX or explosion-proof applicability is limited to this series where required.': 'Choose one of the listed capacities and confirm mounting, overload and signal requirements. ATEX or explosion-proof requirements need confirmation for the selected LC-AR-85 configuration.',
  'Capacity-specific values are governed on the approved SKU records.': 'Choose one of the listed capacities and confirm mounting, overload, signal and installation requirements.',
  'Capacity-specific values are governed on the approved SKU records. The validated current top capacity is 1000 kg; the older 2000 kg listing is superseded.': 'LC-AR-ST is available in the listed 100, 200, 500 and 1000 kg capacities. Confirm mounting, overload and signal requirements.',
  'Capacity-specific values are governed on the approved SKU records. This series is supported by the brochure source; final signal, protection, and availability details require confirmation.': 'Choose one of the listed capacities. Confirm signal, overload protection and availability for the selected LC-AR-60 configuration.',
  'The capacity belongs to this exact loadcell series. Do not treat a same-capacity SKU from another series as mechanically interchangeable.': 'Capacity and mechanical fit must be checked together. Loadcells with the same capacity may have different mounting and shaft arrangements.',
};

export function customerText(value: string): string {
  if (replacements[value]) return replacements[value];
  return value
    .replace(/Stage 1/g, 'Basic fault indication')
    .replace(/Stage 2/g, 'Data logging and graphics')
    .replace(/Stage 3/g, 'Inline fault marking')
    .replace(/Use this record for /g, 'For ')
    .replace(/capacity record/g, 'capacity option')
    .replace(/Select this SKU/g, 'Select this capacity option')
    .replace(/a governed (flange mount with pilot bore|flange mount|heavy-duty pillow block|pillow block) selection path/g, 'a $1 arrangement')
    .replace(/ support record within P12/g, ' accessory for loadcell installations')
    .replace(/\b(?:P\d{2}[A-Z]?(?:-C\d+)?|LS[12])\b/g, (id) => publicName(id));
}

const mountingBySeries: Record<string, string> = {
  P12A: 'Flange Mount; 17 mm Shaft', P12B: 'Flange Mount; 25 mm Shaft',
  P12C: 'Flange Mount With Pilot Bore; 25 mm Shaft', P12D: 'Pillow Block; 35 mm or 40 mm Shaft',
  P12E: 'Flange Mount; 17 mm Shaft', P12F: 'Heavy-Duty Pillow Block; 35 mm or 40 mm Shaft',
};

export function publicSpecificationValue(recordId: string, label: string, value: string): string {
  if (label === 'Capacity' && mountingBySeries[recordId]) {
    const capacities = rawCatalog.records.filter((record) => record.parentId === recordId && record.recordClass === 'SKU')
      .map((record) => Number(record.id.split('-C')[1])).sort((a, b) => a - b);
    return `${capacities.join(' / ')} kg`;
  }
  if (label === 'Series Mounting' && recordId.includes('-C')) return mountingBySeries[recordId.split('-C')[0]];
  if (recordId === 'P12E' && label === 'Mounting') return mountingBySeries.P12E;
  if (recordId === 'P04' && label === 'Platform Capability') return 'Mains-Frequency AC, High-Frequency AC and DC Spark Testing; Select the Required Method';
  if (recordId === 'P05' && label === 'Tester Path') return 'Separate AC and DC High-Voltage Testers';
  if (recordId === 'P12' && label === 'Connector') return 'Connector Type Requires Confirmation for the Selected Model and Application';
  if (recordId === 'P12' && label === 'Certification Reference') return 'Confirm Required Certification for the Selected Configuration; ATEX Review Is Limited to LC-AR-85';
  if (recordId === 'P12' && label === 'Signal and Protection') return 'Selected Series: 20 mV/10 V Output and Up to 300% Full-Scale Protection; Confirm for the Selected Series and Capacity';
  return customerText(value);
}
