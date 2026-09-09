import { useEffect } from 'react';
import { siteConfig } from './config/site';
import { validateCatalog } from './domain/catalogValidation';
import { ExplorerProvider } from './state/ExplorerProvider';
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
  'Relevant Capability and Product Paths Based on Your Selections',
  'A Clear View of Where Those Capabilities Fit in Production or Testing',
  'Technical Specifications for Direct Model-to-Model Comparison',
  'Key Operating and Project Inputs That Can Help Narrow the Selection',
  'An Application Brief to Support a Focused Technical Conversation',
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
          <div className="container section-heading-grid"><div><p className="eyebrow">Explore Puretronics Wire and Cable Capabilities</p><h2>Begin With the Requirement. Move Towards the Relevant Equipment.</h2></div><div><p className="section-lead">The Puretronics capability explorer brings the portfolio into one guided experience. Choose the way you prefer to explore, review relevant product paths and compare useful technical information without opening every brochure or knowing the final specification in advance.</p><ul className="benefit-list">{capabilityBenefits.map((item) => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul></div></div>
          <CapabilityExplorer />
        </section>
        <section className="section readiness-section" id="prepare">
          <div className="container section-heading-grid"><div><p className="eyebrow">Prepare Your Application Review</p><h2>Turn What You Know Into a Useful Application Brief.</h2></div><div><p className="section-lead">Choose a capability area, select the operating conditions you know, and prepare a brief with possible equipment options and questions for Puretronics to review.</p><p className="privacy-note"><span aria-hidden="true">○</span> Your answers stay in this browser tab. No contact details are collected, and nothing is submitted automatically.</p></div></div>
          <div className="container"><ReadinessBuilder /></div>
        </section>
        <ProofAndCertificate />
        <FaqSection />
        <FinalBookingCta />
      </main>
      <footer className="site-footer"><div className="container footer-grid"><div><img src="./assets/brand/puretronics-logo.webp" width="220" height="70" alt="Puretronics" /><strong>Puretronics Wire and Cable Industry Products</strong><p>This Capability Profile covers Puretronics products and capabilities for the Wire and Cable Industry.</p></div><address><a href="mailto:info@pureindia.net">info@pureindia.net</a><a href="tel:+912229271500">+91 22 29271500</a><a href="tel:+912229271400">+91 22 29271400</a><span>A-37, 1st Floor, Virwani Industrial Estate, near Western Express Highway, Goregaon East, Mumbai 400063, India</span></address><div className="footer-links"><a href={siteConfig.websiteUrl}>Official website</a><a href={siteConfig.linkedInUrl}>LinkedIn</a>{siteConfig.privacyUrl && <a href={siteConfig.privacyUrl}>Privacy</a>}<span>© Puretronics</span></div></div></footer>
      <MobileBookingBar />
    </ExplorerProvider>
  );
}

export default function App() {
  useEffect(() => {
    if (window.location.hash === '#/booking-placeholder') window.history.replaceState(null, '', `${window.location.pathname}#top`);
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', siteConfig.canonicalUrl);
    const errors = validateCatalog();
    if (errors.length) throw new Error(errors.join('\n'));
  }, []);
  return <ErrorBoundary><CapabilityProfile /></ErrorBoundary>;
}
