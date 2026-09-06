import { useEffect, useState } from 'react';
import { siteConfig } from './config/site';
import { validateCatalog } from './domain/catalogValidation';
import { isBookingPlaceholder } from './domain/routeState';
import { ExplorerProvider } from './state/ExplorerProvider';
import { BookingPlaceholder } from './components/BookingPlaceholder';
import { CapabilityExplorer } from './components/CapabilityExplorer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { FaqSection } from './components/FaqSection';
import { FinalBookingCta } from './components/FinalBookingCta';
import { Hero } from './components/Hero';
import { MobileBookingBar } from './components/MobileBookingBar';
import { ProofAndCertificate } from './components/ProofAndCertificate';
import { ReadinessBuilder } from './components/ReadinessBuilder';
import { SiteHeader } from './components/SiteHeader';
import { WebMcpBridge } from './components/WebMcpBridge';

const capabilityBenefits = [
  'Relevant capability and product paths based on your selections',
  'A clear view of where those capabilities fit in production or testing',
  'Comparable technical information where like-for-like comparison is useful',
  'Key operating and project inputs that can help narrow the selection',
  'A direct route to prepare an application brief or book an Application Review',
];

function CapabilityProfile() {
  return (
    <ExplorerProvider>
      <WebMcpBridge />
      <a className="skip-link" href="#main">Skip to main content</a>
      <SiteHeader />
      <main id="main">
        <Hero />
        <section className="section section-band" id="explore">
          <div className="container section-heading-grid"><div><p className="eyebrow">Explore Puretronics Wire and Cable Capabilities</p><h2>Begin with the requirement. Move towards the relevant equipment.</h2></div><div><p className="section-lead">The Puretronics capability explorer brings the portfolio into one guided experience. Choose the way you prefer to explore, review relevant product paths and compare useful technical information without opening every brochure or knowing the final specification in advance.</p><ul className="benefit-list">{capabilityBenefits.map((item) => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul></div></div>
          <CapabilityExplorer />
        </section>
        <section className="section readiness-section" id="prepare">
          <div className="container section-heading-grid"><div><p className="eyebrow">Prepare Your Application Review</p><h2>Turn what you know into a useful application brief.</h2></div><div><p className="section-lead">Choose a capability area, answer only the questions you can, mark unknowns clearly, and generate a concise brief for your team or conversation with Puretronics.</p><p className="privacy-note"><span aria-hidden="true">○</span> Ungated and browser-local. No contact details are required, and nothing is submitted automatically.</p></div></div>
          <div className="container"><ReadinessBuilder /></div>
        </section>
        <ProofAndCertificate />
        <FaqSection />
        <FinalBookingCta />
      </main>
      <footer className="site-footer"><div className="container footer-grid"><div><img src="./assets/brand/puretronics-logo.webp" width="220" height="70" alt="Puretronics" /><strong>Puretronics Wire and Cable Industry Products</strong><p>This Capability Profile covers Puretronics products and capabilities for the Wire and Cable Industry.</p></div><address><a href="mailto:info@pureindia.net">info@pureindia.net</a><a href="tel:+912229271500">+91 22 29271500</a><a href="tel:+912229271400">+91 22 29271400</a><span>A-37, 1st Floor, Virwani Industrial Estate, near Western Express Highway, Goregaon East, Mumbai 400063, India</span></address><div className="footer-links"><a href={siteConfig.websiteUrl}>Official website</a><a href={siteConfig.linkedInUrl}>LinkedIn</a>{siteConfig.privacyUrl && <a href={siteConfig.privacyUrl}>Privacy</a>}<span>Review Build · September 2026</span></div></div></footer>
      <MobileBookingBar />
    </ExplorerProvider>
  );
}

export default function App() {
  const [bookingRoute, setBookingRoute] = useState(() => isBookingPlaceholder());
  useEffect(() => {
    const onHashChange = () => { setBookingRoute(isBookingPlaceholder()); window.scrollTo({ top: 0, behavior: 'instant' }); };
    window.addEventListener('hashchange', onHashChange);
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', siteConfig.canonicalUrl);
    const errors = validateCatalog();
    if (errors.length) throw new Error(errors.join('\n'));
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  return <ErrorBoundary>{bookingRoute ? <BookingPlaceholder /> : <CapabilityProfile />}</ErrorBoundary>;
}
