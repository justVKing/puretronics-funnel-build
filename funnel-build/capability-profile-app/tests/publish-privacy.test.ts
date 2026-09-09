import { describe, expect, it, vi } from 'vitest';
import { sanitizeAnalyticsPayload, track } from '../src/analytics/events';

describe('analytics privacy', () => {
  it('allowlists payload values as well as keys and discards free text', () => {
    expect(sanitizeAnalyticsPayload({ location:'person@example.com', mode:'my private request', ids:['P04','private note'], count:NaN, extra:'secret' } as never)).toEqual({ids:['P04']});
  });
  it('disabled analytics emits no event or console message', () => {
    const event = vi.fn(); window.addEventListener('puretronics:analytics', event);
    const log = vi.spyOn(console, 'info');
    track('product_search_used', {ids:['P04']});
    expect(event).not.toHaveBeenCalled(); expect(log).not.toHaveBeenCalled();
    window.removeEventListener('puretronics:analytics', event); log.mockRestore();
  });
});
