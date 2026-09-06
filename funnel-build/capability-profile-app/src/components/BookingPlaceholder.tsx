import { returnToProfile } from '../domain/routeState';

export function BookingPlaceholder() {
  return <main className="booking-placeholder"><div className="booking-placeholder-card"><img src="./assets/brand/puretronics-logo.webp" width="220" height="70" alt="Puretronics" /><p className="proof-label">Review Build</p><h1>Booking System Page — Review Placeholder</h1><p>The final scheduling experience will be connected after Puretronics review.</p><button type="button" className="button" onClick={returnToProfile}>Return to Capability Profile</button></div></main>;
}
