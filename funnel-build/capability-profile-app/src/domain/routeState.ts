export const isBookingPlaceholder = () => window.location.hash === '#/booking-placeholder';

export function navigateToBooking() {
  window.location.hash = '#/booking-placeholder';
}

export function returnToProfile() {
  window.location.hash = '#top';
}
