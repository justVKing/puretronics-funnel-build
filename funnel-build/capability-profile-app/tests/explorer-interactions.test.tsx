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
    expect(screen.getByRole('heading', { name: 'Your relevant capability paths' })).toBeInTheDocument();
    expect(screen.getByText(/3 relevant Primary Products found/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText('Why this result matched')[0]).toHaveTextContent('Relevant to diameter variation');
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
});
