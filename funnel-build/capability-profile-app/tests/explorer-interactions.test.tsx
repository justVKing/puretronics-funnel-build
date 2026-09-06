import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ExplorerProvider } from '../src/state/ExplorerProvider';
import { CapabilityExplorer } from '../src/components/CapabilityExplorer';

describe('capability explorer interactions', () => {
  it('starts a problem-led route and returns explainable results', async () => {
    const user = userEvent.setup();
    render(<ExplorerProvider><CapabilityExplorer /></ExplorerProvider>);
    await user.click(screen.getByRole('button', { name: /I have a production or quality problem/i }));
    await user.click(screen.getByRole('button', { name: /Diameter variation or dimensional consistency/i }));
    expect(screen.getByRole('heading', { name: 'Your Relevant Capability Paths' })).toBeInTheDocument();
    expect(screen.getByText(/3 relevant Primary Products found/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText('Why this result matched')[0]).toHaveTextContent('Relevant to Diameter Variation or Dimensional Consistency');
  });

  it('preserves selected stages while switching explorer views', async () => {
    const user = userEvent.setup();
    render(<ExplorerProvider><CapabilityExplorer /></ExplorerProvider>);
    await user.click(screen.getByRole('tab', { name: /Production-Line Map/i }));
    const stage = screen.getAllByRole('button', { name: /Inline spark testing/i })[0];
    await user.click(stage);
    await user.click(screen.getByRole('tab', { name: /Solution Navigator/i }));
    await user.click(screen.getByRole('tab', { name: /Production-Line Map/i }));
    expect(screen.getAllByRole('button', { name: /Inline spark testing/i })[0]).toHaveAttribute('aria-pressed', 'true');
  });

  it('presents a dense capability coverage index without empty family intersections', async () => {
    const user = userEvent.setup();
    render(<ExplorerProvider><CapabilityExplorer /></ExplorerProvider>);
    await user.click(screen.getByRole('tab', { name: /Capability Matrix/i }));
    expect(screen.getByRole('heading', { name: /Move from a requirement/i })).toBeInTheDocument();
    expect(screen.getByText(/governed requirement paths shown/i).closest('p')).toHaveTextContent('11 governed requirement paths shown');
    expect(screen.queryByLabelText('Not applicable')).not.toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /LASER 2008 Series/i }).length).toBeGreaterThan(0);
  });

  it('lets visitors select a product and models directly in the comparison tab', async () => {
    const user = userEvent.setup();
    render(<ExplorerProvider><CapabilityExplorer /></ExplorerProvider>);
    await user.click(screen.getByRole('tab', { name: /Comparison Workbench/i }));
    await user.selectOptions(screen.getByRole('combobox', { name: 'Primary Product' }), 'P13');
    expect(await screen.findByRole('heading', { name: 'Choose Models' })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: /complete approved v4 model specification comparison/i })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'Braking Value' })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'Maximum Speed' })).toBeInTheDocument();
    expect(screen.queryByText('Like-for-like')).not.toBeInTheDocument();
    expect(screen.queryByText('System roles')).not.toBeInTheDocument();
  });
});
