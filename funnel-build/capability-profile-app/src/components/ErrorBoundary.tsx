import { Component, type ErrorInfo, type ReactNode } from 'react';

export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('Capability profile error', error, info); }
  render() {
    if (this.state.failed) return <main className="error-page"><div className="container"><p className="eyebrow">The Interactive Data Could Not Be Displayed</p><h1>Puretronics Wire and Cable Capabilities</h1><p>The static portfolio remains available through Puretronics. Reload this page to retry, or continue to the Application Review.</p><button type="button" className="button" onClick={() => window.location.reload()}>Reload Page</button><a className="button button-secondary" href="#/booking-placeholder">Book an Application Review</a></div></main>;
    return this.props.children;
  }
}
