import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ExplorerProvider } from '../src/state/ExplorerProvider';
import { ReadinessBuilder } from '../src/components/ReadinessBuilder';

describe('Requirement Readiness Builder', () => {
  it('supports a blank start and generates a brief with open questions', async () => {
    const user = userEvent.setup();
    const { container } = render(<ExplorerProvider><ReadinessBuilder /></ExplorerProvider>);
    await user.click(screen.getByRole('button', { name: /Inline Spark Testing and Insulation Fault Detection/i }));
    await user.click(screen.getByRole('radio', { name: /Inline Insulation-Fault Detection/i }));
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(container.querySelector('input:not([type=radio]):not([type=checkbox]), textarea, [contenteditable="true"]')).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Build My Review Brief' }));
    expect(screen.getByRole('heading', { name: 'Puretronics Application Review Brief' })).toBeInTheDocument();
    expect(screen.getByText((_, element) => element?.textContent === 'Inline Spark Testing Platform' && element?.tagName === 'STRONG')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Open Questions' })).toBeInTheDocument();
  });
});
