import axe from 'axe-core';
import { render } from '@testing-library/react';
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
});
