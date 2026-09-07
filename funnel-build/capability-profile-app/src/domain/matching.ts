import { families, products } from '../data/catalog';
import { problemOptions, productionStages, projectOptions } from '../data/productionStages';
import { capabilityRelationships } from '../data/capabilityRelationships';
import type { ExplorerFilters, MatchResult } from '../types/explorer';

const normalise = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const labelFor = (collection: readonly (readonly [string, string])[], id: string) => collection.find(([key]) => key === id)?.[1] ?? id;
const searchTermMatches = (term: string, query: string) => term === query || (term.length >= 4 && query.length >= 3 && (term.includes(query) || query.includes(term)));

export function matchProducts(filters: ExplorerFilters): MatchResult[] {
  const query = normalise(filters.query);
  const hasFilters = query || filters.problems.some((problem) => !['multiple-issues', 'not-sure'].includes(problem)) || filters.stages.length || filters.families.length || filters.routes.length;

  return products.map((product) => {
    let score = hasFilters ? 0 : 1;
    const reasons: string[] = hasFilters ? [] : ['Included in the Complete Governed Wire and Cable Portfolio'];
    const matchedModelIds: string[] = [];

    let queryMatched = !query;
    if (query) {
      const productTerms = [product.id, product.name, product.shortName, ...product.aliases].map(normalise);
      const directProductMatch = productTerms.some((term) => searchTermMatches(term, query));
      const subordinateRecords = [...product.models, ...product.models.flatMap((model) => model.children ?? []), ...(product.supportItems ?? [])];
      const subordinateTerms = subordinateRecords.map((model) => ({ model, terms: [model.id, model.name, ...model.aliases].map(normalise) }));
      const exactModelMatches = subordinateTerms.filter(({ terms }) => terms.includes(query));
      const modelMatches = (exactModelMatches.length ? exactModelMatches : subordinateTerms.filter(({ terms }) => terms.some((term) => searchTermMatches(term, query)))).map(({ model }) => model);
      if (modelMatches.length) {
        queryMatched = true;
        score += 140;
        matchedModelIds.push(...modelMatches.map((model) => model.id));
        reasons.push(`Matched V4 Record: ${modelMatches.map((model) => model.name).join(', ')}`);
      } else if (directProductMatch) {
        queryMatched = true;
        score += 110;
        reasons.push(`Matched the Governed Product Record ${product.id}`);
      }
    }

    const ordinaryProblems = filters.problems.filter((problem) => !['multiple-issues', 'not-sure'].includes(problem));
    const problemMatched = !ordinaryProblems.length || ordinaryProblems.some((problem) => product.buyerProblems.includes(problem) || (problem === 'load-sensing' && product.id === 'P12'));
    for (const problem of ordinaryProblems) {
      if (product.buyerProblems.includes(problem)) {
        score += 38;
        reasons.push(`Relevant to ${labelFor(problemOptions, problem)}`);
      }
    }
    const productStageIds = capabilityRelationships.filter((item) => item.productId === product.id).map((item) => item.orientationStageId);
    const stageMatched = !filters.stages.length || filters.stages.some((stage) => productStageIds.includes(stage));
    for (const stage of filters.stages) {
      if (productStageIds.includes(stage)) {
        score += 30;
        reasons.push(`Fits the ${productionStages.find((item) => item.id === stage)?.label ?? stage} Stage`);
      }
    }
    const familyMatched = !filters.families.length || filters.families.includes(product.familyId);
    for (const family of filters.families) {
      if (product.familyId === family) {
        score += 26;
        reasons.push(`Belongs to ${families.find((item) => item.id === family)?.name}`);
      }
    }
    const routeMatched = !filters.routes.length || filters.routes.some((route) => product.projectRoutes.includes(route));
    for (const route of filters.routes) {
      if (product.projectRoutes.includes(route)) {
        score += 18;
        reasons.push(`Can Be Reviewed for a ${labelFor(projectOptions, route)} Route`);
      }
    }

    const eligible = queryMatched && problemMatched && stageMatched && familyMatched && routeMatched;
    return { productId: product.id, score: eligible ? score : 0, reasons: [...new Set(reasons)].slice(0, 3), matchedModelIds };
  }).filter((result) => result.score > 0).sort((a, b) => b.score - a.score || products.find((p) => p.id === a.productId)!.order - products.find((p) => p.id === b.productId)!.order);
}
