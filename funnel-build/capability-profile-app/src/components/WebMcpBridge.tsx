import { useEffect, useRef } from 'react';
import { families, productById } from '../data/catalog';
import { useExplorer } from '../state/ExplorerProvider';

interface ModelContextTool {
  name: string;
  title: string;
  description: string;
  inputSchema: object;
  annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
  execute(input: unknown): unknown | Promise<unknown>;
}

declare global {
  interface Document {
    modelContext?: { registerTool(tool: ModelContextTool, options?: { signal?: AbortSignal }): void | Promise<void> };
  }
}

export function WebMcpBridge() {
  const { state, dispatch } = useExplorer();
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const tool: ModelContextTool = {
      name: 'stage_application_review',
      title: 'Prepare a Puretronics application review',
      description: 'Adds Wire and Cable product families or products to the visible Application Review. Accepts the listed choices only and never accepts or transmits free text.',
      inputSchema: {
        type: 'object',
        properties: {
          familyIds: { type: 'array', items: { type: 'string', enum: families.map((family) => family.id) }, uniqueItems: true },
          productIds: { type: 'array', items: { type: 'string', enum: [...productById.keys()] }, uniqueItems: true },
        },
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      async execute(input) {
        if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Input must be an object containing governed familyIds or productIds.');
        const candidate = input as { familyIds?: unknown; productIds?: unknown };
        if (Object.keys(candidate).some(key => !['familyIds', 'productIds'].includes(key))) throw new Error('Unexpected input property.');
        if ((candidate.familyIds !== undefined && !Array.isArray(candidate.familyIds)) || (candidate.productIds !== undefined && !Array.isArray(candidate.productIds))) throw new Error('Selections must be arrays.');
        const familyIds = [...new Set(Array.isArray(candidate.familyIds) ? candidate.familyIds : [])];
        const productIds = [...new Set(Array.isArray(candidate.productIds) ? candidate.productIds : [])];
        if (![...familyIds, ...productIds].every((id) => typeof id === 'string')) throw new Error('All IDs must be strings.');
        if (!familyIds.every((id) => families.some((family) => family.id === id))) throw new Error('One or more Product Family IDs are not governed public IDs.');
        if (!productIds.every((id) => productById.has(id))) throw new Error('One or more product IDs are not governed public IDs.');
        for (const id of familyIds) if (!stateRef.current.filters.families.includes(id)) dispatch({ type: 'TOGGLE_FILTER', key: 'families', value: id });
        for (const id of productIds) dispatch({ type: 'ADD_SELECTED', productId: id });
        window.location.hash = '#prepare';
        await new Promise((resolve) => requestAnimationFrame(resolve));
        document.getElementById('prepare')?.scrollIntoView();
        return { stagedFamilyIds: familyIds, stagedProductIds: productIds, destination: 'Application Review' };
      },
    };
    try { void Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => undefined); }
    catch { /* The page remains fully usable if this optional browser feature is unavailable. */ }
    return () => lifecycle.abort();
  }, [dispatch]);
  return null;
}
