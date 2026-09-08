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
    expect(screen.getAllByRole('button', { name: /Spark Testing and Fault Response/i }).find((button) => button.hasAttribute('aria-pressed'))).toHaveAttribute('aria-pressed', 'true');
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

  it('shows a Navigator problem as an explicit Matrix filter instead of hidden state', async () => {
    const user = userEvent.setup();
    render(<ExplorerProvider><CapabilityExplorer /></ExplorerProvider>);
    await user.click(screen.getByRole('button', { name: /I have a production or quality problem/i }));
    await user.click(screen.getByRole('button', { name: /Diameter variation or inadequate measurement visibility/i }));
    await user.click(screen.getByRole('tab', { name: /Capability Matrix/i }));
    expect(screen.getByRole('button', { name: /Diameter Variation or Inadequate Measurement Visibility ×/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear Explorer Constraints' })).toBeInTheDocument();
  });

  it('presents offline tests as independent paths rather than stages ten and eleven', async () => {
    const user = userEvent.setup();
    render(<ExplorerProvider><CapabilityExplorer /></ExplorerProvider>);
    await user.click(screen.getByRole('tab', { name: /Production-Line Map/i }));
    expect(screen.getByRole('heading', { name: 'Inline Production Sequence' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Separate Offline / Laboratory Testing' })).toBeInTheDocument();
    expect(screen.getByText('These are not stages 10 and 11 of the production line.')).toBeInTheDocument();
  });

  it('narrows a Product Family route with a decision-active discriminator', async () => {
    const user = userEvent.setup();
    render(<ExplorerProvider><CapabilityExplorer /></ExplorerProvider>);
    await user.click(screen.getByRole('button', { name: /I know the product family/i }));
    await user.click(screen.getByRole('button', { name: /Tension \/ Braking \/ Line Control/i }));
    await user.click(screen.getByRole('button', { name: /Load \/ Tension Sensing/i }));
    expect(screen.getByText(/1 relevant Primary Product found/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Loadcells and Tension Transducers/i })).toBeInTheDocument();
  });

  it('prioritises an exact approved model-code search', async () => {
    const user = userEvent.setup();
    render(<ExplorerProvider><CapabilityExplorer /></ExplorerProvider>);
    await user.click(screen.getByRole('button', { name: /I know a product or model/i }));
    await user.type(screen.getByRole('searchbox', { name: 'Product or Model Name' }), 'AX-400');
    expect(screen.getByText(/Matched V4 Record: P13B · AX-400/i)).toBeInTheDocument();
  });

  it('groups a new-line or retrofit review by the selected project stages', async () => {
    const user = userEvent.setup();
    render(<ExplorerProvider><CapabilityExplorer /></ExplorerProvider>);
    await user.click(screen.getByRole('button', { name: /I am planning a new line or retrofit/i }));
    await user.click(screen.getByRole('button', { name: 'New Production Line' }));
    await user.click(screen.getByRole('button', { name: /Preheating and Other Pre-Extrusion Preparation/i }));
    expect(screen.getByRole('heading', { name: 'Capability Paths Across the Selected Project Stages' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Preheating and Other Pre-Extrusion Preparation' })).toBeInTheDocument();
  });

  it('uses all four guided answers and carries the known input into review state', async () => {
    const user = userEvent.setup();
    render(<ExplorerProvider><CapabilityExplorer /></ExplorerProvider>);
    await user.click(screen.getByRole('button', { name: /I am not sure where to begin/i }));
    await user.click(screen.getByRole('button', { name: 'Offline Laboratory / Test Area' }));
    await user.click(screen.getByRole('button', { name: 'Electrical / Fire Testing' }));
    await user.click(screen.getAllByRole('button', { name: 'Not Known Yet' })[1]);
    await user.click(screen.getByRole('button', { name: 'Test Method / Voltage' }));
    expect(screen.getByText(/known measurement is carried into the Application Review/i)).toBeInTheDocument();
    expect(screen.getByText(/2 relevant Primary Products found/i)).toBeInTheDocument();
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
