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
      title: 'Stage a Puretronics application review',
      description: 'Adds governed Wire and Cable Product Families or Primary Products to the visible Requirement Readiness Builder. Accepts IDs only and never accepts or transmits free text.',
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
        const familyIds = Array.isArray(candidate.familyIds) ? candidate.familyIds : [];
        const productIds = Array.isArray(candidate.productIds) ? candidate.productIds : [];
        if (![...familyIds, ...productIds].every((id) => typeof id === 'string')) throw new Error('All IDs must be strings.');
        if (!familyIds.every((id) => families.some((family) => family.id === id))) throw new Error('One or more Product Family IDs are not governed public IDs.');
        if (!productIds.every((id) => productById.has(id))) throw new Error('One or more product IDs are not governed public IDs.');
        for (const id of familyIds) if (!stateRef.current.filters.families.includes(id)) dispatch({ type: 'TOGGLE_FILTER', key: 'families', value: id });
        for (const id of productIds) if (!stateRef.current.selectedProducts.includes(id)) dispatch({ type: 'TOGGLE_SELECTED', productId: id });
        window.location.hash = '#prepare';
        await new Promise((resolve) => requestAnimationFrame(resolve));
        document.getElementById('prepare')?.scrollIntoView();
        return { stagedFamilyIds: familyIds, stagedProductIds: productIds, destination: 'Requirement Readiness Builder' };
      },
    };
    try { void Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch((error) => console.warn('WebMCP tool registration failed', error)); }
    catch (error) { console.warn('WebMCP tool registration failed', error); }
    return () => lifecycle.abort();
  }, [dispatch]);
  return null;
}
