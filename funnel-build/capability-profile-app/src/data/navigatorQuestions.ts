import { families } from './catalog';
import { problemOptions, productionStages, projectOptions } from './productionStages';

export const navigatorModes = [
  { id: 'problem', title: 'I have a production or quality problem', short: 'Start with a problem', description: 'Select the outcome you need to improve—from dimensional consistency to tension stability.' },
  { id: 'stage', title: 'I know where the requirement occurs', short: 'Explore the production-line map', description: 'Choose a production or testing stage and see relevant equipment roles.' },
  { id: 'family', title: 'I know the product family', short: 'Browse product families', description: 'Go directly to one of five governed capability areas.' },
  { id: 'search', title: 'I know a product or model', short: 'Find a product or model', description: 'Search the governed catalogue by product, model or approved alias.' },
  { id: 'project', title: 'I am planning a new line or retrofit', short: 'Explore a project route', description: 'Review multiple stages and equipment roles for an installation or upgrade.' },
  { id: 'guide', title: 'I am not sure where to begin', short: 'Guide me', description: 'Start with the observed condition and immediate need.' },
] as const;

export const navigatorOptionSets = { families, problemOptions, productionStages, projectOptions };
