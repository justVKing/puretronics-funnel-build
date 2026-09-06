import { useMemo, useState } from 'react';
import { generateBrief } from '../domain/brief';
import { useExplorer } from '../state/ExplorerProvider';
import { track } from '../analytics/events';
import { BookingLink } from './SiteHeader';

export function BriefPreview() {
  const { state, dispatch } = useExplorer();
  const brief = useMemo(() => generateBrief(state), [state]);
  const [copyStatus, setCopyStatus] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);

  const copy = async () => {
    try { await navigator.clipboard.writeText(brief.text); setCopyStatus('Brief copied to clipboard.'); track('readiness_brief_copied', { count: brief.known.length }); }
    catch { setCopyStatus('Copy was unavailable. Select the brief text and copy it manually.'); }
  };

  return (
    <section className="brief-preview" aria-labelledby="brief-heading">
      <div className="brief-header"><div><p className="proof-label">Generated review brief</p><h3 id="brief-heading">{brief.title}</h3></div><span>{brief.known.length} known · {brief.open.length} open</span></div>
      <div className="brief-columns">
        <section><h4>Relevant capability paths</h4>{brief.capabilityPaths.length ? <ul>{brief.capabilityPaths.map((item) => <li key={item}>{item}</li>)}</ul> : <p>To be confirmed during review.</p>}<h4>Known information</h4>{brief.known.length ? <dl>{brief.known.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl> : <p>No operating information has been entered yet.</p>}</section>
        <section className="open-questions"><h4>Open questions</h4>{brief.open.length ? <ul>{brief.open.map((item) => <li key={item}>{item}</li>)}</ul> : <p>No open questions recorded.</p>}<h4>Useful review materials</h4><ul>{brief.suggestedMaterials.map((item) => <li key={item}>{item}</li>)}</ul></section>
      </div>
      <p className="brief-disclaimer">Exact equipment and configuration selection is confirmed against the complete application, operating conditions, interfaces and project requirements.</p>
      <div className="brief-actions"><button type="button" className="button" onClick={copy}>Copy brief</button><button type="button" className="button button-secondary" onClick={() => { window.print(); track('readiness_brief_printed', { count: brief.known.length }); }}>Print or save brief</button><button type="button" className="text-button" onClick={() => dispatch({ type: 'GENERATE_BRIEF' })}>Edit answers</button>{!confirmReset ? <button type="button" className="text-button danger" onClick={() => setConfirmReset(true)}>Start a new brief</button> : <span className="reset-confirm">Reset this brief? <button type="button" onClick={() => { dispatch({ type: 'RESET_READINESS' }); setConfirmReset(false); }}>Yes, reset</button><button type="button" onClick={() => setConfirmReset(false)}>Cancel</button></span>}<BookingLink location="readiness-brief">Book an Application Review</BookingLink></div>
      <p className="live-status" aria-live="polite">{copyStatus}</p>
      <textarea className="sr-only" readOnly value={brief.text} aria-label="Plain text version of the generated brief" />
    </section>
  );
}
