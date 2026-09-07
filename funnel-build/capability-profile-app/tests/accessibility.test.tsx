import axe from 'axe-core';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { BookingPlaceholder } from '../src/components/BookingPlaceholder';
import { ExplorerProvider } from '../src/state/ExplorerProvider';
import { CapabilityExplorer } from '../src/components/CapabilityExplorer';
import { ReadinessBuilder } from '../src/components/ReadinessBuilder';

describe('automated accessibility smoke tests', () => {
  it('has no serious or critical violations in the explorer entry state', async () => {
    const { container } = render(<main><ExplorerProvider><CapabilityExplorer /></ExplorerProvider></main>);
    const results = await axe.run(container);
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  });

  it('has no serious or critical violations in the booking placeholder', async () => {
    const { container } = render(<BookingPlaceholder />);
    const results = await axe.run(container);
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  });

  it('has no serious or critical violations in the readiness builder', async () => {
    const { container } = render(<main><ExplorerProvider><ReadinessBuilder /></ExplorerProvider></main>);
    const results = await axe.run(container);
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  });

  it('has no serious or critical violations in the capability coverage index', async () => {
    const user = userEvent.setup();
    const { container } = render(<main><ExplorerProvider><CapabilityExplorer /></ExplorerProvider></main>);
    await user.click(screen.getByRole('tab', { name: /Capability Matrix/i }));
    const results = await axe.run(container);
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  });

  it('has no serious or critical violations in a populated model comparison', async () => {
    const user = userEvent.setup();
    const { container } = render(<main><ExplorerProvider><CapabilityExplorer /></ExplorerProvider></main>);
    await user.click(screen.getByRole('tab', { name: /Comparison Workbench/i }));
    await user.selectOptions(screen.getByRole('combobox', { name: 'Primary Product' }), 'P04');
    await screen.findByRole('table', { name: /complete approved v4 model specification comparison/i });
    const results = await axe.run(container);
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  });

  it('has no serious or critical violations in a comprehensive product detail drawer', async () => {
    const user = userEvent.setup();
    const { container } = render(<main><ExplorerProvider><CapabilityExplorer /></ExplorerProvider></main>);
    await user.click(screen.getByRole('tab', { name: /Comparison Workbench/i }));
    await user.selectOptions(screen.getByRole('combobox', { name: 'Primary Product' }), 'P08');
    await user.click(await screen.findByRole('button', { name: 'View Product Details' }));
    expect(screen.getByRole('heading', { name: 'Applications' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Production and Testing Stages' })).toBeInTheDocument();
    expect(screen.getAllByText('P08F').length).toBeGreaterThanOrEqual(11);
    const results = await axe.run(container);
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  });
});
