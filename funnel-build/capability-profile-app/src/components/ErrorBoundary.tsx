import { Component, type ReactNode } from 'react';
import { siteConfig } from '../config/site';
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <main className="error-page"><div className="container"><p className="eyebrow">Please Try Again</p><h1>Puretronics Wire and Cable Capabilities</h1><p>We could not display the page. Reload to try again, or visit the Puretronics website.</p><button type="button" className="button" onClick={() => window.location.reload()}>Reload Page</button><a className="button button-secondary" href={siteConfig.websiteUrl}>Visit Puretronics</a></div></main>;
    return this.props.children;
  }
}
