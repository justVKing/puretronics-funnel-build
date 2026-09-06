import { siteConfig } from '../config/site';
import { track } from '../analytics/events';

export function BookingLink({ className = 'button', location, children }: { className?: string; location: string; children: React.ReactNode }) {
  return <a className={className} href={siteConfig.bookingUrl} onClick={() => track('application_review_cta_clicked', { location })}>{children}</a>;
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand-logo" href="#top" aria-label="Puretronics capability profile home">
          <img src="./assets/brand/puretronics-logo.webp" width="220" height="70" alt="Puretronics" />
        </a>
        <nav aria-label="Primary navigation">
          <a href="#explore">Explore Capabilities</a>
          <a href="#prepare">Prepare Your Review</a>
          <a href={siteConfig.technicalResourcesUrl}>Technical Resources</a>
          <a href="#service-support">Service and Support</a>
        </nav>
        <BookingLink className="button button-small header-cta" location="header">Book an Application Review</BookingLink>
      </div>
    </header>
  );
}
