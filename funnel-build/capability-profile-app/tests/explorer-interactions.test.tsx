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
    await user.click(screen.getByRole('button', { name: /Diameter variation or inadequate measurement visibility/i }));
    expect(screen.getByRole('heading', { name: 'Your Relevant Capability Paths' })).toBeInTheDocument();
    expect(screen.getByText(/3 relevant Primary Products found/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText('Why this result matched')[0]).toHaveTextContent('Relevant to Diameter Variation or Inadequate Measurement Visibility');
  });

  it('preserves selected stages while switching explorer views', async () => {
    const user = userEvent.setup();
    render(<ExplorerProvider><CapabilityExplorer /></ExplorerProvider>);
    await user.click(screen.getByRole('tab', { name: /Production-Line Map/i }));
    const stage = screen.getAllByRole('button', { name: /Spark Testing and Fault Response/i })[0];
    await user.click(stage);
    await user.click(screen.getByRole('tab', { name: /Solution Navigator/i }));
    await user.click(screen.getByRole('tab', { name: /Production-Line Map/i }));
    expect(screen.getAllByRole('button', { name: /Spark Testing and Fault Response/i })[0]).toHaveAttribute('aria-pressed', 'true');
  });

  it('presents a dense capability coverage index without empty family intersections', async () => {
    const user = userEvent.setup();
    render(<ExplorerProvider><CapabilityExplorer /></ExplorerProvider>);
    await user.click(screen.getByRole('tab', { name: /Capability Matrix/i }));
    expect(screen.getByRole('heading', { name: /Move from a requirement/i })).toBeInTheDocument();
    expect(screen.getByText((_, element) => element?.textContent === '12 Requirement Paths')).toBeInTheDocument();
    expect(screen.getByText((_, element) => element?.textContent === '13 Distinct Primary Products')).toBeInTheDocument();
    expect(screen.getByText((_, element) => element?.textContent === '5 Product Families')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'All Five Product Families' })).toBeInTheDocument();
    expect(screen.queryByLabelText('Not applicable')).not.toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /LASER 2008 Series/i }).length).toBeGreaterThan(0);
  });

  it('lets visitors select a product and models directly in the comparison tab', async () => {
    const user = userEvent.setup();
    render(<ExplorerProvider><CapabilityExplorer /></ExplorerProvider>);
    await user.click(screen.getByRole('tab', { name: /Comparison Workbench/i }));
    await user.selectOptions(screen.getByRole('combobox', { name: 'Primary Product' }), 'P13');
    expect(await screen.findByRole('heading', { name: 'Choose Models or Variants' })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: /complete approved v4 model specification comparison/i })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'Max Torque for Each Calliper' })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'Max RPM' })).toBeInTheDocument();
    expect(screen.queryByText('Like-for-like')).not.toBeInTheDocument();
    expect(screen.queryByText('System roles')).not.toBeInTheDocument();
  });

  it('renders all eleven V4 technical parameters for the first two P08 models', async () => {
    const user = userEvent.setup();
    render(<ExplorerProvider><CapabilityExplorer /></ExplorerProvider>);
    await user.click(screen.getByRole('tab', { name: /Comparison Workbench/i }));
    await user.selectOptions(screen.getByRole('combobox', { name: 'Primary Product' }), 'P08');
    expect(await screen.findByText(/11 technical parameters, plus publication context/i)).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'Power Supply' })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'Dimensions (mm) - [H × W × D]' })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'Weight (Kg)' })).toBeInTheDocument();
  });

  it('allows direct comparison of P12 capacity SKUs', async () => {
    const user = userEvent.setup();
    render(<ExplorerProvider><CapabilityExplorer /></ExplorerProvider>);
    await user.click(screen.getByRole('tab', { name: /Comparison Workbench/i }));
    await user.selectOptions(screen.getByRole('combobox', { name: 'Primary Product' }), 'P12');
    await user.click(await screen.findByRole('radio', { name: 'Capacity SKUs' }));
    expect(await screen.findByText(/9 technical parameters, plus publication context/i)).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'Capacity' })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'Loadcell Series' })).toBeInTheDocument();
  });
});
