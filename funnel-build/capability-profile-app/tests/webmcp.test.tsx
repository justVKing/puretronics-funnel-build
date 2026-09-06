import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ExplorerProvider, useExplorer } from '../src/state/ExplorerProvider';
import { WebMcpBridge } from '../src/components/WebMcpBridge';

function StateProbe() {
  const { state } = useExplorer();
  return <output>{state.selectedProducts.join(',')}|{state.filters.families.join(',')}</output>;
}

describe('WebMCP application-review tool', () => {
  it('registers a governed-ID-only tool and updates the visible app state', async () => {
    let registered: { execute(input: unknown): unknown | Promise<unknown>; name: string } | undefined;
    Object.defineProperty(document, 'modelContext', { configurable: true, value: { registerTool: vi.fn((tool) => { registered = tool; }) } });
    render(<ExplorerProvider><WebMcpBridge /><StateProbe /></ExplorerProvider>);
    expect(registered?.name).toBe('stage_application_review');
    await registered?.execute({ familyIds: ['PF05'], productIds: ['P13'] });
    expect(await screen.findByText('P13|PF05')).toBeInTheDocument();
    await expect(registered?.execute({ productIds: ['OUT-OF-SCOPE'] })).rejects.toThrow(/not governed/i);
    Object.defineProperty(document, 'modelContext', { configurable: true, value: undefined });
  });
});
