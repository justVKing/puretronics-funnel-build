import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ExplorerProvider } from '../src/state/ExplorerProvider';
import { ReadinessBuilder } from '../src/components/ReadinessBuilder';

describe('Requirement Readiness Builder', () => {
  it('supports a blank start and generates a brief with open questions', async () => {
    const user = userEvent.setup();
    render(<ExplorerProvider><ReadinessBuilder /></ExplorerProvider>);
    await user.click(screen.getByRole('button', { name: /Inline Spark Testing and Insulation Fault Detection/i }));
    await user.type(screen.getByLabelText(/What are you trying to improve/i), 'Detect insulation faults');
    await user.click(screen.getByRole('button', { name: 'Build My Review Brief' }));
    expect(screen.getByRole('heading', { name: 'Puretronics Application Review Brief' })).toBeInTheDocument();
    expect(screen.getByText('Detect insulation faults')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Open questions' })).toBeInTheDocument();
  });
});
