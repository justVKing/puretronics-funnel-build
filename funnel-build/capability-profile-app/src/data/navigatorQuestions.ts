import { families } from './catalog';
import { problemOptions, productionStages, projectOptions } from './productionStages';

export const navigatorModes = [
  { id: 'problem', title: 'I Have a Production or Quality Problem', short: 'Start with a Problem', description: 'Select the outcome you need to improve—from dimensional consistency to tension stability.' },
  { id: 'stage', title: 'I Know Where the Requirement Occurs', short: 'Explore the Production-Line Map', description: 'Choose a production or testing stage and see relevant equipment roles.' },
  { id: 'family', title: 'I Know the Product Family', short: 'Browse Product Families', description: 'Go directly to one of five capability areas.' },
  { id: 'search', title: 'I Know a Product or Model', short: 'Find a Product or Model', description: 'Search by product, model or common equipment name.' },
  { id: 'project', title: 'I Am Planning a New Line or Retrofit', short: 'Explore a Project Route', description: 'Review multiple stages and equipment roles for an installation or upgrade.' },
  { id: 'guide', title: 'I Am Not Sure Where to Begin', short: 'Guide Me', description: 'Start with the observed condition and immediate need.' },
] as const;

export const navigatorOptionSets = { families, problemOptions, productionStages, projectOptions };
