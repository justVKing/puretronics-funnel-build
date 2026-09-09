import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import App from '../src/App';
import { BookingLink } from '../src/components/SiteHeader';
import { siteConfig } from '../src/config/site';

describe('application-review destination boundary', () => {
  it('retires the legacy placeholder URL without exposing a placeholder or invalid saved input', () => {
    sessionStorage.setItem('puretronics-capability-profile:v4', JSON.stringify({ version: 4, state: { filters: { families: ['PF05'] }, selectedProducts: ['P13'], readinessAnswers: { outcome: 'secret free text' } } }));
    window.location.hash = '#/booking-placeholder';
    render(<App />);
    expect(document.body.textContent).not.toMatch(/Review Placeholder|Review Build|secret free text|\bP13\b/);
    expect(window.location.hash).toBe('#top');
    expect(document.querySelector('a[href*="placeholder"]')).toBeNull();
  });
  it('uses the Puretronics-approved application-review contact route', () => {
    render(<BookingLink location="header">Book an Application Review</BookingLink>);
    expect(siteConfig.bookingUrl).toBe('https://pureindia.net/contact-us');
    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://pureindia.net/contact-us');
    expect(screen.getByRole('link')).toHaveTextContent('Book an Application Review');
  });
  it('sends no selection context and clears local state when an approved external destination is configured', () => {
    const configured = siteConfig.bookingUrl;
    Object.assign(siteConfig, { bookingUrl: 'https://pureindia.net/contact-us' });
    sessionStorage.setItem('puretronics-capability-profile:v4', 'private session context');
    render(<BookingLink location="header">Review</BookingLink>);
    const link = screen.getByRole('link');
    link.addEventListener('click', event => event.preventDefault());
    fireEvent.click(link);
    expect(link).toHaveAttribute('href', 'https://pureindia.net/contact-us');
    expect(link).toHaveAttribute('referrerpolicy', 'no-referrer');
    expect(sessionStorage.getItem('puretronics-capability-profile:v4')).toBeNull();
    Object.assign(siteConfig, { bookingUrl: configured });
  });
});
