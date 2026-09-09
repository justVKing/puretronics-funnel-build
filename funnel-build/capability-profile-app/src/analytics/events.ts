import { siteConfig } from '../config/site';
import type { AnalyticsEventName, AnalyticsPayload } from '../types/analytics';
import { families, products } from '../data/catalog';
import { productionStages, problemOptions } from '../data/productionStages';

const locations = new Set(['capability-profile', 'header', 'hero', 'final-cta', 'mobile-sticky', 'readiness-brief', 'service-section', 'builder', 'certificate']);
const modes = new Set(['problem', 'stage', 'family', 'product', 'project', 'guide', 'models']);
const ids = new Set([...families.map(item => item.id), ...products.map(item => item.id), ...productionStages.map(item => item.id), ...problemOptions.map(item => item[0])]);
export function sanitizeAnalyticsPayload(payload: AnalyticsPayload): AnalyticsPayload {
  const safe: AnalyticsPayload = {};
  if (typeof payload.location === 'string' && locations.has(payload.location)) safe.location = payload.location;
  if (typeof payload.mode === 'string' && modes.has(payload.mode)) safe.mode = payload.mode;
  if (Array.isArray(payload.ids)) safe.ids = [...new Set(payload.ids.filter(id => ids.has(id)))];
  if (Number.isInteger(payload.count) && payload.count! >= 0 && payload.count! <= 1000) safe.count = payload.count;
  if (['mobile', 'tablet', 'desktop'].includes(payload.device ?? '')) safe.device = payload.device;
  return safe;
}
export function track(name: AnalyticsEventName, payload: AnalyticsPayload = {}) {
  if (siteConfig.analyticsMode === 'disabled') return;
  window.dispatchEvent(new CustomEvent('puretronics:analytics', { detail: { name, payload: sanitizeAnalyticsPayload(payload) } }));
}
