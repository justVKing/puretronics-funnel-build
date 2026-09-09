import { useEffect, useMemo, useRef, useState } from 'react';
import { generateBrief, fitStatusLabels } from '../domain/brief';
import { productById } from '../data/catalog';
import { publicName, customerText } from '../data/publicContent';
import { questionById } from '../data/readinessQuestions';
import { useExplorer } from '../state/ExplorerProvider';
import { track } from '../analytics/events';
import { BookingLink } from './SiteHeader';

export function BriefPreview() {
  const { state, dispatch } = useExplorer();
  const brief = useMemo(() => generateBrief(state), [state]);
  const [copyStatus, setCopyStatus] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { headingRef.current?.focus(); }, []);
  const copy = async () => { try { await navigator.clipboard.writeText(brief.text); setCopyStatus('Brief Copied to Clipboard.'); track('readiness_brief_copied', { count: brief.known.length }); } catch { setCopyStatus('Copy Is Unavailable in This Browser. Use Print or Save Brief.'); } };
  const print = () => {
    const details = [...document.querySelectorAll<HTMLDetailsElement>('.brief-preview details')];
    const wasOpen = details.map((detail) => detail.open);
    const restore = () => { details.forEach((detail, index) => { detail.open = wasOpen[index]; }); };
    details.forEach((detail) => { detail.open = true; });
    window.addEventListener('afterprint', restore, { once: true });
    window.print();
    track('readiness_brief_printed', { count: brief.known.length });
  };
  return <section className="brief-preview" aria-labelledby="brief-heading">
    <div className="brief-header"><div><p className="proof-label">Your Review Brief</p><h3 id="brief-heading" ref={headingRef} tabIndex={-1}>{brief.title}</h3></div><span>{brief.known.length} Known · {brief.open.length} Open</span></div>
    <section className="fit-summary"><div className="fit-summary-heading"><p className="proof-label">Product and Model Review</p><h4>Preliminary Application Review</h4><p>These results compare your answers with available technical specifications. Alignment applies only to the information supplied; Puretronics must confirm the complete application.</p></div>{brief.evaluations.length ? <div className="fit-result-list">{brief.evaluations.map((evaluation) => { const product = productById.get(evaluation.productId)!; const caveats = [...new Set([...product.caveats, ...evaluation.modelIds.map((id) => product.models.find((model) => model.id === id)?.caveat).filter((value): value is string => Boolean(value))])]; return <article className={`fit-result fit-${evaluation.status}`} key={evaluation.productId}><div><strong>{product.name}</strong></div><p className="fit-status">{fitStatusLabels[evaluation.status]}</p>{evaluation.modelIds.length > 0 && <p><b>Models Remaining:</b> {evaluation.modelIds.map(publicName).join(' · ')}</p>}{evaluation.variantIds.length > 0 && <p><b>Capacity Options Remaining:</b> {evaluation.variantIds.map(publicName).join(' · ')}</p>}{evaluation.openQuestionIds.length > 0 && <p><b>Information Still Required:</b> {evaluation.openQuestionIds.map((id) => questionById.get(id)?.label).filter(Boolean).join(' · ')}</p>}{evaluation.reasons.length > 0 && <ul>{evaluation.reasons.map((reason) => <li key={reason}>{customerText(reason)}</li>)}</ul>}{evaluation.exclusions.length > 0 && <details><summary>View Excluded Options and Reasons</summary><ul>{evaluation.exclusions.map((item) => <li key={`${item.questionId}-${item.reason}`}>{customerText(item.reason)}</li>)}</ul></details>}{caveats.length > 0 && <details><summary>View Technical Selection Notes</summary><ul>{caveats.map((caveat) => <li key={caveat}>{customerText(caveat)}</li>)}</ul></details>}</article>; })}</div> : <div className="empty-state compact"><h4>No Capability Path Selected Yet</h4><p>Edit the answers and choose a requirement or Product Family to review relevant products.</p></div>}</section>
    <div className="brief-columns"><section><h4>Relevant Capability Paths</h4>{brief.capabilityPaths.length ? <ul>{brief.capabilityPaths.map((item) => <li key={item}>{item}</li>)}</ul> : <p>To Be Confirmed During Review.</p>}<h4>Known Information</h4>{brief.known.length ? <dl>{brief.known.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl> : <p>No Conditions Have Been Selected Yet.</p>}</section><section className="open-questions"><h4>Open Questions</h4>{brief.open.length ? <ul>{brief.open.map((item) => <li key={item}>{item}</li>)}</ul> : <p>No Open Questions Recorded.</p>}<h4>Useful Review Materials</h4><ul>{brief.suggestedMaterials.map((item) => <li key={item}>{item}</li>)}</ul></section></div>
    <p className="brief-disclaimer">Exact equipment and configuration selection is confirmed against the complete application, operating conditions, interfaces and project requirements.</p>
    <div className="brief-actions"><button type="button" className="button" onClick={copy}>Copy Brief</button><button type="button" className="button button-secondary" onClick={print}>Print or Save Brief</button><button type="button" className="text-button" onClick={() => dispatch({ type: 'EDIT_BRIEF' })}>Edit Answers</button>{!confirmReset ? <button type="button" className="text-button danger" onClick={() => setConfirmReset(true)}>Start a New Brief</button> : <span className="reset-confirm">Clear All Answers and Selected Requirements? <button type="button" onClick={() => { dispatch({ type: 'RESET_READINESS' }); setConfirmReset(false); }}>Yes, Reset</button><button type="button" onClick={() => setConfirmReset(false)}>Cancel</button></span>}<BookingLink location="readiness-brief">Discuss This Application With Puretronics</BookingLink></div>
    <p className="live-status" aria-live="polite">{copyStatus}</p><pre className="sr-only" aria-label="Plain Text Version of the Generated Brief">{brief.text}</pre>
  </section>;
}
