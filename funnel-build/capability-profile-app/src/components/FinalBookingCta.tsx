import { useState } from 'react';
import { BookingLink } from './SiteHeader';

export function FinalBookingCta() {
  const [copied, setCopied] = useState('');
  return <section className="final-cta"><div className="container final-cta-grid"><div><p className="eyebrow">Ready for a focused technical conversation?</p><h2>Bring the requirement. Leave with a clearer next step.</h2><p>Use the Application Review to examine what is known, what still needs to be confirmed and the most useful route forward.</p></div><div className="final-actions"><BookingLink location="final-band">Book a Wire and Cable Application Review</BookingLink><a className="button button-outline-light" href="#prepare">Prepare My Application Brief</a><a href="#explore">Not ready to book? Continue exploring capabilities</a></div></div><div className="container page-utilities"><button type="button" onClick={() => window.print()}>Save or print this Capability Profile</button><button type="button" onClick={async () => { try { await navigator.clipboard.writeText(window.location.href.split('#')[0]); setCopied('Page link copied.'); } catch { setCopied('Copy unavailable.'); } }}>Copy page link</button><span aria-live="polite">{copied}</span></div></section>;
}
