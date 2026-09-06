import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '../src/App';

describe('booking placeholder boundary', () => {
  it('shows no retained family, product or brief context', () => {
    sessionStorage.setItem('puretronics-capability-profile:v1', JSON.stringify({ version: 1, state: { filters: { families: ['PF05'] }, selectedProducts: ['P13'], readinessAnswers: { outcome: 'secret free text' } } }));
    window.location.hash = '#/booking-placeholder';
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Booking System Page — Review Placeholder' })).toBeInTheDocument();
    expect(screen.queryByText(/Tension \/ Braking/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/secret free text/i)).not.toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/P13/);
  });
});
