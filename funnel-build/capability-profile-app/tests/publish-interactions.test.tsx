import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CapabilityExplorer } from '../src/components/CapabilityExplorer';
import { ReadinessBuilder } from '../src/components/ReadinessBuilder';
import { ExplorerProvider } from '../src/state/ExplorerProvider';
import { saveState } from '../src/state/persistence';
import { initialState } from '../src/state/reducer';

afterEach(() => { vi.restoreAllMocks(); Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1024 }); });
const renderExplorer = () => render(<ExplorerProvider><CapabilityExplorer /></ExplorerProvider>);
describe('publish-ready interaction regressions', () => {
  it('uses one removable search across Navigator and Matrix', async () => {
    const user = userEvent.setup(); renderExplorer();
    await user.click(screen.getByRole('button', { name: /I Know a Product or Model/i }));
    await user.type(screen.getByRole('searchbox', { name: 'Product or Model Name' }), 'AX-400');
    await user.click(screen.getByRole('tab', { name: /Capability Matrix/ }));
    expect(screen.getByRole('searchbox', { name: 'Find a Requirement or Product' })).toHaveValue('AX-400');
    expect(screen.getByText((_, element) => element?.textContent === '1 Products')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Search: AX-400 ×' }));
    expect(screen.getByRole('searchbox')).toHaveValue('');
    expect(screen.getByText((_, element) => element?.textContent === '13 Products')).toBeInTheDocument();
  });
  it('clears previous family discriminator constraints when another family is chosen', async () => {
    const user = userEvent.setup(); renderExplorer();
    await user.click(screen.getByRole('button', { name: /I Know the Product Family/i }));
    await user.click(screen.getByRole('button', { name: /Inline Measurement and Dimensional Control/ }));
    await user.click(screen.getByRole('button', { name: 'Diameter Measurement' }));
    await user.click(screen.getByRole('button', { name: /Tension \/ Braking \/ Line Control/ }));
    expect(screen.queryByRole('button', { name: /Diameter Variation.*×/ })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Your Relevant Capability Paths' })).toBeInTheDocument();
    expect(screen.getByText(/4 relevant Products found/i)).toBeInTheDocument();
  });
  it('makes the spark-method discriminator an explicit public-model constraint', async () => {
    const user = userEvent.setup(); renderExplorer();
    await user.click(screen.getByRole('button', { name: /I Know the Product Family/i }));
    await user.click(screen.getByRole('button', { name: /Inline Spark Testing and Insulation Fault Detection/ }));
    await user.click(screen.getByRole('button', { name: 'DC' }));
    expect(screen.getByRole('button', { name: /Search: DC Spark Tester ×/ })).toBeInTheDocument();
    expect(screen.getAllByText(/Matching Models or Options: DC Spark Tester/).length).toBeGreaterThan(0);
  });
  it('uses every guided answer for filtering, review context and the next information step', async () => {
    const user = userEvent.setup(); renderExplorer();
    await user.click(screen.getByRole('button', { name: /I Am Not Sure Where to Begin/i }));
    await user.click(screen.getByRole('button', { name: 'Production Line' }));
    await user.click(screen.getByRole('button', { name: 'Insulation Faults' }));
    await user.click(screen.getByRole('button', { name: 'Replacement' }));
    await user.click(screen.getByRole('button', { name: 'Line Speed' }));
    expect(screen.getByText(/1 relevant Product found/i)).toBeInTheDocument();
    expect(screen.getByText(/Line or Shaft Speed — choose the applicable range/)).toBeInTheDocument();
    const saved = JSON.parse(sessionStorage.getItem('puretronics-capability-profile:v4')!);
    expect(saved.state.filters.families).toEqual(['PF02']);
    expect(saved.state.filters.routes).toEqual(['replacement']);
    expect(saved.state.readinessAnswers).toMatchObject({ 'requirement-location': 'line', 'project-type': 'replacement', 'known-inputs': ['speed'] });
  });
  it('preserves capacity comparison when switching views and permits an empty selection', async () => {
    const user = userEvent.setup(); renderExplorer();
    await user.click(screen.getByRole('tab', { name: /Comparison Workbench/ }));
    await user.selectOptions(screen.getByRole('combobox', { name: 'Product' }), 'P12');
    await user.click(screen.getByRole('radio', { name: 'Capacity Options' }));
    await user.click(screen.getByRole('tab', { name: /Capability Matrix/ }));
    await user.click(screen.getByRole('tab', { name: /Comparison Workbench/ }));
    expect(screen.getByRole('radio', { name: 'Capacity Options' })).toBeChecked();
    expect(screen.getByRole('table', { name: /Model Specification Comparison/ })).toBeInTheDocument();
    const checked = screen.getAllByRole('checkbox').filter((input) => (input as HTMLInputElement).checked);
    for (const input of checked) await user.click(input);
    expect(screen.getByRole('heading', { name: 'Select at Least One Model' })).toBeInTheDocument();
  });
  it('removes a desktop third model when the screen becomes mobile', async () => {
    saveState({ ...initialState, view: 'compare', comparisonProductId: 'P13', comparisonModelIds: ['P13A','P13B','P13C'] });
    renderExplorer();
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 390 });
    await act(async () => { window.dispatchEvent(new Event('resize')); });
    expect(screen.getByText('2 Models or Variants Selected.')).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox').filter((input) => (input as HTMLInputElement).checked)).toHaveLength(2);
  });
  it('provides native MCQs with exclusive choices and no write-in controls', async () => {
    const user = userEvent.setup(); const { container } = render(<ExplorerProvider><ReadinessBuilder /></ExplorerProvider>);
    await user.click(screen.getByText('2. Product, Material or Sample', { exact: true }));
    const inputs = screen.getByRole('group', { name: 'Which Technical Inputs Are Already Known?' });
    await user.click(within(inputs).getByRole('checkbox', { name: 'Line or Shaft Speed' }));
    await user.click(within(inputs).getByRole('checkbox', { name: 'None Yet' }));
    expect(within(inputs).getByRole('checkbox', { name: 'Line or Shaft Speed' })).not.toBeChecked();
    await user.click(within(inputs).getByRole('checkbox', { name: 'Diameter or Product Size' }));
    expect(within(inputs).getByRole('checkbox', { name: 'None Yet' })).not.toBeChecked();
    expect(container.querySelector('input:not([type="radio"]):not([type="checkbox"]), textarea, [contenteditable="true"]')).toBeNull();
    const radios = within(screen.getByRole('group', { name: 'Where Does the Requirement Occur?' })).getAllByRole('radio');
    expect(radios.every((radio) => radio.tagName === 'INPUT')).toBe(true);
  });
  it('edits an existing brief and resets its carried scope', async () => {
    saveState({ ...initialState, selectedProducts: ['P04'], filters: { ...initialState.filters, stages: ['spark-fault'] } });
    const user = userEvent.setup(); render(<ExplorerProvider><ReadinessBuilder /></ExplorerProvider>);
    await user.click(screen.getByRole('button', { name: 'Build My Review Brief' }));
    expect(screen.getByRole('heading', { name: 'Puretronics Application Review Brief' })).toHaveFocus();
    await user.click(screen.getByRole('button', { name: 'Edit Answers' }));
    expect(screen.getByRole('heading', { name: 'Define the Application Review Scope' })).toHaveFocus();
    await user.click(screen.getByRole('button', { name: 'Build My Review Brief' }));
    await user.click(screen.getByRole('button', { name: 'Start a New Brief' }));
    await user.click(screen.getByRole('button', { name: 'Yes, Reset' }));
    expect(screen.queryByText(/Stage: Spark Testing/)).not.toBeInTheDocument();
    expect(screen.getByText((_, element) => element?.textContent === '0 Product Families and 0 Products Selected Directly.')).toBeInTheDocument();
  });
  it('copies the complete brief and expands technical details for printing', async () => {
    saveState({ ...initialState, briefGenerated: true, selectedProducts: ['P04'], readinessAnswers: { 'pf02-principle': 'acute', 'pf02-speed': '1500-2500' } });
    const user = userEvent.setup(); const copy = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue();
    render(<ExplorerProvider><ReadinessBuilder /></ExplorerProvider>);
    await user.click(screen.getByRole('button', { name: 'Copy Brief' }));
    expect(copy).toHaveBeenCalledWith(expect.stringContaining('Exclusion:'));
    const print = vi.spyOn(window, 'print').mockImplementation(() => { expect([...document.querySelectorAll('.brief-preview details')].every((detail) => (detail as HTMLDetailsElement).open)).toBe(true); });
    await user.click(screen.getByRole('button', { name: 'Print or Save Brief' }));
    expect(print).toHaveBeenCalledOnce();
    act(() => { window.dispatchEvent(new Event('afterprint')); });
    expect([...document.querySelectorAll('.brief-preview details')].every((detail) => !(detail as HTMLDetailsElement).open)).toBe(true);
  });
  it('opens only one dialog when moving from a stage to a product', async () => {
    const user = userEvent.setup(); renderExplorer();
    await user.click(screen.getByRole('tab', { name: /Production-Line Map/ }));
    await user.click(screen.getAllByRole('button', { name: /Spark Testing and Fault Response/ })[0]);
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'View Product Details →' }));
    await screen.findByRole('dialog', { name: 'Inline Spark Testing Platform' });
    expect(screen.getAllByRole('dialog')).toHaveLength(1);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
