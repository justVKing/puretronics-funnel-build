import { useMemo } from 'react';
import { families, productById } from '../data/catalog';
import { readinessQuestions } from '../data/readinessQuestions';
import { activeFamilyIds, visibleReadinessQuestions } from '../domain/fit';
import { useExplorer } from '../state/ExplorerProvider';
import { track } from '../analytics/events';
import { BriefPreview } from './BriefPreview';
import { siteConfig } from '../config/site';

const sectionNames = { requirement: '1. Requirement and Capability Path', application: '2. Product, Material or Sample', conditions: '3. Governed Technical Conditions', integration: '4. Integration and Evidence', project: '5. Project Context' } as const;

export function ReadinessBuilder() {
  const { state, dispatch } = useExplorer();
  const selectedProducts = state.selectedProducts.map((id) => productById.get(id)).filter(Boolean);
  const familyIds = activeFamilyIds(state);
  const visibleQuestions = visibleReadinessQuestions(state);
  const answered = visibleQuestions.filter((question) => state.readinessAnswers[question.id] !== undefined).length;
  const progress = visibleQuestions.length ? Math.round(answered / visibleQuestions.length * 100) : 0;
  const grouped = useMemo(() => Object.entries(sectionNames).map(([key, label]) => ({ key, label, questions: visibleQuestions.filter((question) => question.section === key) })), [visibleQuestions]);
  if (state.briefGenerated) return <BriefPreview />;

  const choose = (questionId: string, optionId: string, mode: 'single' | 'multiple') => {
    if (mode === 'single') dispatch({ type: 'SET_READINESS_ANSWER', questionId, value: optionId });
    else {
      const current = state.readinessAnswers[questionId];
      const values = Array.isArray(current) ? current : current ? [current] : [];
      const exclusive = optionId === 'none' || optionId === 'unknown' || optionId === 'not-applicable';
      const next = exclusive ? [optionId] : values.includes(optionId) ? values.filter((id) => id !== optionId) : [...values.filter((id) => !['none', 'unknown', 'not-applicable'].includes(id)), optionId];
      dispatch({ type: 'SET_READINESS_ANSWER', questionId, value: next });
    }
    track('readiness_question_answered', { ids: [questionId, optionId] });
  };

  return <div className="builder-shell mcq-builder">
    <div className="builder-status"><div><p className="proof-label">Review Organisation</p><strong>{progress}% Organised</strong></div><div className="progress-track" role="progressbar" aria-label="Application Review Brief Completeness" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><span style={{ width: `${progress}%` }} /></div><p>Every answer is a governed choice. “Not Known Yet” becomes a useful open question.</p></div>
    <section className="imported-selection"><div><h3>Choose the Capability Area</h3><p>Begin with a Product Family, or carry products forward from the Explorer. The MCQs adapt automatically.</p></div><div className="family-toggle-grid">{families.map((family) => <button type="button" aria-pressed={familyIds.includes(family.id)} className={familyIds.includes(family.id) ? 'is-selected' : ''} key={family.id} onClick={() => dispatch({ type: 'TOGGLE_FILTER', key: 'families', value: family.id })}><span>{family.id}</span><strong>{family.name}</strong></button>)}</div>{selectedProducts.length > 0 && <div className="imported-products"><strong>Products Carried Forward</strong>{selectedProducts.map((product) => <span key={product!.id}>{product!.shortName}<button type="button" aria-label={`Remove ${product!.shortName}`} onClick={() => dispatch({ type: 'TOGGLE_SELECTED', productId: product!.id })}>×</button></span>)}</div>}</section>
    <div className="scientific-logic-note"><p className="proof-label">Evidence-Based Logic</p><h3>Published V4 Boundaries Narrow the Review</h3><p>A product or model is excluded only when an answer directly contradicts a current approved boundary. Unknown information never creates a false exclusion or recommendation.</p></div>
    <div className="builder-sections">{grouped.filter((group) => group.questions.length).map((group, index) => <details key={group.key} open={index === 0}><summary><span>{group.label}</span><small>{group.questions.filter((question) => state.readinessAnswers[question.id] !== undefined).length}/{group.questions.length} Answered</small></summary><div className="mcq-question-list">{group.questions.map((question) => <fieldset className="mcq-question" key={question.id}><legend>{question.label}</legend><p>{question.purpose}</p><div className="mcq-options">{question.options.map((option) => { const value = state.readinessAnswers[question.id]; const selected = Array.isArray(value) ? value.includes(option.id) : value === option.id; return <button key={option.id} type="button" role={question.mode === 'single' ? 'radio' : 'checkbox'} aria-checked={selected} className={selected ? 'is-selected' : ''} onClick={() => choose(question.id, option.id, question.mode)}><span aria-hidden="true">{selected ? '✓' : '+'}</span><strong>{option.label}</strong>{option.caveat && <small>{option.caveat}</small>}</button>; })}</div></fieldset>)}</div>{group.key === 'project' && state.readinessAnswers['project-type'] === 'support' && <div className="service-notice"><strong>Installed-Equipment Support Has a Dedicated Route.</strong><p>Continue here only when the requirement also includes a new application or upgrade.</p><a href={siteConfig.serviceSupportUrl} onClick={() => track('service_support_cta_clicked', { location: 'builder' })}>Go to Service and Support →</a></div>}</details>)}</div>
    <div className="builder-submit"><div><strong>Generate the Brief Even When Information Is Incomplete.</strong><p>No contact details or free text are collected, and nothing is submitted automatically.</p></div><button type="button" className="button" onClick={() => { dispatch({ type: 'GENERATE_BRIEF' }); track('readiness_brief_generated', { count: answered, ids: selectedProducts.map((product) => product!.id) }); }}>Build My Review Brief</button></div>
  </div>;
}
