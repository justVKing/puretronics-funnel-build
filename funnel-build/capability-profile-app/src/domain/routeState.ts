import { siteConfig } from '../config/site';
import { clearState } from '../state/persistence';

export function navigateToBooking() {
  if (siteConfig.bookingUrl) { clearState(); window.location.assign(siteConfig.bookingUrl); }
  else window.location.hash = '#prepare';
}

export function returnToProfile() {
  window.location.hash = '#top';
}
