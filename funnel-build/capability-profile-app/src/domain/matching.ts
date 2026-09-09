import { families, products } from '../data/catalog';
import { problemOptions, productionStages, projectOptions, requirementDefinitions } from '../data/productionStages';
import { capabilityRelationships } from '../data/capabilityRelationships';
import type { ExplorerFilters, MatchResult } from '../types/explorer';

const normalise = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const labelFor = (collection: readonly (readonly [string, string])[], id: string) => collection.find(([key]) => key === id)?.[1] ?? '';
const searchTermMatches = (term: string, query: string) => term === query || (term.length >= 4 && query.length >= 3 && term.includes(query));

export function matchProducts(filters: ExplorerFilters): MatchResult[] {
  const query = normalise(filters.query);
  const hasFilters = query || filters.problems.some((problem) => !['multiple-issues', 'not-sure'].includes(problem)) || filters.stages.length || filters.families.length || filters.routes.length;
  return products.map((product): MatchResult => {
    let score = hasFilters ? 0 : 1;
    const reasons: string[] = hasFilters ? [] : ['Part of the Puretronics Wire and Cable Portfolio'];
    const matchedModelIds: string[] = [];
    let queryMatched = !query;
    if (query) {
      const models = [...product.models, ...product.models.flatMap((model) => model.children ?? []), ...(product.supportItems ?? [])];
      const exactModels = models.filter((model) => normalise(model.name) === query);
      const aliasModels = models.filter((model) => model.aliases.some((alias) => normalise(alias) === query));
      const partialModels = models.filter((model) => [model.name, ...model.aliases].some((term) => searchTermMatches(normalise(term), query)));
      const matchingModels = exactModels.length ? exactModels : aliasModels.length ? aliasModels : partialModels;
      const productExact = [product.name, product.shortName].some((name) => normalise(name) === query);
      const productMatch = [product.name, product.shortName, ...product.aliases].some((term) => searchTermMatches(normalise(term), query));
      const requirementMatch = requirementDefinitions.some((requirement) => requirement.productIds.some((id) => id === product.id) && searchTermMatches(normalise(requirement.label), query));
      queryMatched = Boolean(matchingModels.length || productMatch || requirementMatch);
      if (matchingModels.length) {
        score += exactModels.length ? 10000 : aliasModels.length ? 7000 : 4000;
        matchedModelIds.push(...matchingModels.map((model) => model.id));
        reasons.push(`Matching Models or Options: ${matchingModels.map((model) => model.name).join(', ')}`);
      } else if (productMatch) {
        score += productExact ? 3000 : 2000;
        reasons.push(`Matches ${product.shortName}`);
      } else if (requirementMatch) {
        score += 1000;
        reasons.push('Matches the Requirement You Searched For');
      }
    }
    const ordinaryProblems = filters.problems.filter((problem) => !['multiple-issues', 'not-sure'].includes(problem));
    const problemMatched = !ordinaryProblems.length || ordinaryProblems.some((problem) => product.buyerProblems.includes(problem));
    for (const problem of ordinaryProblems) if (product.buyerProblems.includes(problem)) {
      score += 38;
      reasons.push(`Relevant to ${labelFor(problemOptions, problem)}`);
    }
    const relationships = capabilityRelationships.filter((item) => item.productId === product.id);
    const stageMatched = !filters.stages.length || filters.stages.some((stage) => relationships.some((item) => item.orientationStageId === stage));
    for (const stage of filters.stages) {
      const relationship = relationships.find((item) => item.orientationStageId === stage);
      if (!relationship) continue;
      score += 30;
      const label = productionStages.find((item) => item.id === stage)?.label ?? '';
      reasons.push(relationship.relationshipType === 'primary' ? `Used at ${label}` : `May Support ${label}, Depending on the Line Arrangement`);
    }
    const familyMatched = !filters.families.length || filters.families.includes(product.familyId);
    if (filters.families.includes(product.familyId)) { score += 26; reasons.push(`Part of ${families.find((item) => item.id === product.familyId)?.name}`); }
    const routeMatched = !filters.routes.length || filters.routes.some((route) => product.projectRoutes.includes(route));
    for (const route of filters.routes) if (product.projectRoutes.includes(route)) { score += 18; reasons.push(`Available for Review for ${labelFor(projectOptions, route)}`); }
    const eligible = queryMatched && problemMatched && stageMatched && familyMatched && routeMatched;
    return { productId: product.id, score: eligible ? Math.max(score, 1) : 0, reasons: [...new Set(reasons)].slice(0, 3), matchedModelIds };
  }).filter((result) => result.score > 0).sort((a, b) => b.score - a.score || products.find((p) => p.id === a.productId)!.order - products.find((p) => p.id === b.productId)!.order);
}
