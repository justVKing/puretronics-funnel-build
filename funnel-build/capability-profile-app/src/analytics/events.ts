import { siteConfig } from '../config/site';
import type { AnalyticsEventName, AnalyticsPayload } from '../types/analytics';

const allowedPayloadKeys = new Set(['location', 'mode', 'ids', 'count', 'device']);

export function track(name: AnalyticsEventName, payload: AnalyticsPayload = {}) {
  const sanitized = Object.fromEntries(Object.entries(payload).filter(([key]) => allowedPayloadKeys.has(key)));
  if (siteConfig.analyticsMode === 'development') console.info('[Puretronics event]', name, sanitized);
  window.dispatchEvent(new CustomEvent('puretronics:analytics', { detail: { name, payload: sanitized } }));
}
