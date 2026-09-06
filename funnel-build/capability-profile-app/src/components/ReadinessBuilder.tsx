import { useMemo } from 'react';
import { families, productById } from '../data/catalog';
import { readinessQuestions } from '../data/readinessQuestions';
import { useExplorer } from '../state/ExplorerProvider';
import type { StructuredAnswer } from '../types/readiness';
import { track } from '../analytics/events';
import { BriefPreview } from './BriefPreview';
import { siteConfig } from '../config/site';

const sectionNames = { requirement: '1. Requirement and Outcome', product: '2. Product, Material or Sample', conditions: '3. Operating or Test Conditions', integration: '4. Integration and Evidence', project: '5. Project Context' } as const;

function TechnicalField({ id, label, help, units, value, onChange }: { id: string; label: string; help?: string; units: string[]; value?: StructuredAnswer; onChange: (value: StructuredAnswer) => void }) {
  const current = value ?? { status: 'not-known' };
  return (
    <fieldset className="technical-field"><legend>{label}</legend>{help && <p>{help}</p>}
      <div className="technical-inputs"><label><span>Value Status</span><select value={current.status} onChange={(event) => onChange({ ...current, status: event.target.value as StructuredAnswer['status'] })}><option value="not-known">Not Known Yet</option><option value="known">Known Value</option><option value="approximate">Approximate Value</option><option value="range">Range</option><option value="not-applicable">Not Applicable</option></select></label>
        {(current.status === 'known' || current.status === 'approximate') && <label><span>Value</span><input id={`${id}-value`} inputMode="decimal" value={current.value ?? ''} onChange={(event) => onChange({ ...current, value: event.target.value })} /></label>}
        {current.status === 'range' && <><label><span>Minimum</span><input inputMode="decimal" value={current.min ?? ''} onChange={(event) => onChange({ ...current, min: event.target.value })} /></label><label><span>Maximum</span><input inputMode="decimal" value={current.max ?? ''} onChange={(event) => onChange({ ...current, max: event.target.value })} /></label></>}
        {!['not-known', 'not-applicable'].includes(current.status) && <label><span>Unit</span><select value={current.unit ?? units[0]} onChange={(event) => onChange({ ...current, unit: event.target.value })}>{units.map((unit) => <option key={unit}>{unit}</option>)}</select></label>}
      </div>
    </fieldset>
  );
}

export function ReadinessBuilder() {
  const { state, dispatch } = useExplorer();
  const selectedProducts = state.selectedProducts.map((id) => productById.get(id)).filter(Boolean);
  const activeFamilyIds = [...new Set(selectedProducts.map((product) => product!.familyId).concat(state.filters.families))];
  const visibleQuestions = readinessQuestions.filter((question) => !question.familyIds || question.familyIds.some((id) => activeFamilyIds.includes(id)));
  const answered = visibleQuestions.filter((question) => {
    const value = state.readinessAnswers[question.id];
    return typeof value === 'string' ? value.trim() : value && typeof value === 'object' && (value as StructuredAnswer).status !== 'not-known';
  }).length;
  const progress = visibleQuestions.length ? Math.round(answered / visibleQuestions.length * 100) : 0;
  const grouped = useMemo(() => Object.entries(sectionNames).map(([key, label]) => ({ key, label, questions: visibleQuestions.filter((question) => question.section === key) })), [visibleQuestions]);

  if (state.briefGenerated) return <BriefPreview />;
  return (
    <div className="builder-shell">
      <div className="builder-status"><div><p className="proof-label">Brief Completeness</p><strong>{progress}% Organised</strong></div><div className="progress-track" role="progressbar" aria-label="Application review brief completeness" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><span style={{ width: `${progress}%` }} /></div><p>Unknown values remain useful open questions; completion is not required.</p></div>
      <section className="imported-selection"><div><h3>Choose the Requirement</h3><p>Select relevant families or bring forward products from the explorer.</p></div><div className="family-toggle-grid">{families.map((family) => <button type="button" aria-pressed={activeFamilyIds.includes(family.id)} className={activeFamilyIds.includes(family.id) ? 'is-selected' : ''} key={family.id} onClick={() => dispatch({ type: 'TOGGLE_FILTER', key: 'families', value: family.id })}><span>{family.id}</span><strong>{family.name}</strong></button>)}</div>{selectedProducts.length > 0 && <div className="imported-products"><strong>Products Carried Forward</strong>{selectedProducts.map((product) => <span key={product!.id}>{product!.shortName}<button type="button" aria-label={`Remove ${product!.shortName}`} onClick={() => dispatch({ type: 'TOGGLE_SELECTED', productId: product!.id })}>×</button></span>)}</div>}</section>
      <div className="builder-sections">
        {grouped.map((group, index) => <details key={group.key} open={index === 0}><summary><span>{group.label}</span><small>{group.questions.filter((q) => state.readinessAnswers[q.id]).length}/{group.questions.length} touched</small></summary><div className="question-grid">{group.questions.map((question) => {
          const value = state.readinessAnswers[question.id];
          if (question.type === 'technical') return <TechnicalField key={question.id} id={question.id} label={question.label} help={question.help} units={question.unitOptions ?? ['other']} value={value as StructuredAnswer | undefined} onChange={(answer) => dispatch({ type: 'SET_READINESS_ANSWER', questionId: question.id, value: answer })} />;
          if (question.type === 'select') return <label className="field" key={question.id}><span>{question.label}</span><select value={typeof value === 'string' ? value : ''} onChange={(event) => dispatch({ type: 'SET_READINESS_ANSWER', questionId: question.id, value: event.target.value })}><option value="">Select an answer</option>{question.options?.map((option) => <option key={option}>{option}</option>)}</select></label>;
          return <label className="field" key={question.id}><span>{question.label}</span><textarea rows={3} value={typeof value === 'string' ? value : ''} onChange={(event) => dispatch({ type: 'SET_READINESS_ANSWER', questionId: question.id, value: event.target.value })} placeholder="Enter what is known, or leave this as an open question." /></label>;
        })}</div>{group.key === 'requirement' && state.readinessAnswers.projectType === 'Existing-Equipment Support' && <div className="service-notice"><strong>Installed-Equipment Support Has a Dedicated Route.</strong><p>You may continue if this also includes a new application or upgrade.</p><a href={siteConfig.serviceSupportUrl} onClick={() => track('service_support_cta_clicked', { location: 'builder' })}>Go to Service and Support →</a></div>}</details>)}
      </div>
      <div className="builder-submit"><div><strong>Build the brief even when information is incomplete.</strong><p>Nothing is submitted automatically and no contact details are required.</p></div><button type="button" className="button" onClick={() => { dispatch({ type: 'GENERATE_BRIEF' }); track('readiness_brief_generated', { count: answered, ids: selectedProducts.map((product) => product!.id) }); }}>Build My Review Brief</button></div>
    </div>
  );
}
