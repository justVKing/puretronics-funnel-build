import { useMemo } from 'react';
import { families, productById } from '../data/catalog';
import { readinessQuestions } from '../data/readinessQuestions';
import { activeFamilyIds, visibleReadinessQuestions } from '../domain/fit';
import { useExplorer } from '../state/ExplorerProvider';
import { track } from '../analytics/events';
import { BriefPreview } from './BriefPreview';
import { siteConfig } from '../config/site';
import { problemOptions, productionStages, projectOptions } from '../data/productionStages';

const sectionNames = { requirement: '1. Requirement and Capability Path', application: '2. Product, Material or Sample', conditions: '3. Governed Technical Conditions', integration: '4. Integration and Evidence', project: '5. Project Context' } as const;

export function ReadinessBuilder() {
  const { state, dispatch } = useExplorer();
  const selectedProducts = state.selectedProducts.map((id) => productById.get(id)).filter(Boolean);
  const familyIds = activeFamilyIds(state);
  const carriedStageIds = [...new Set([...state.filters.stages, ...state.reviewStageIds])];
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
    <section className="imported-selection"><div><h3>Define the Application Review Scope</h3><p>Products, Product Families, requirements and stages are additive review paths. Only governed technical answers can narrow or exclude models.</p></div><div className="family-toggle-grid">{families.map((family) => { const selected = state.reviewFamilyIds.includes(family.id); return <button type="button" aria-pressed={selected} className={selected ? 'is-selected' : ''} key={family.id} onClick={() => dispatch({ type: 'TOGGLE_REVIEW_FAMILY', familyId: family.id })}><span>{family.id}</span><strong>{family.name}</strong></button>; })}</div>{(selectedProducts.length > 0 || state.filters.families.length > 0 || carriedStageIds.length > 0 || state.filters.problems.length > 0 || state.filters.routes.length > 0) && <div className="imported-products"><strong>Scope Carried Forward From the Explorer</strong>{selectedProducts.map((product) => <span key={product!.id}>Product: {product!.shortName}<button type="button" aria-label={`Remove ${product!.shortName}`} onClick={() => dispatch({ type: 'TOGGLE_SELECTED', productId: product!.id })}>×</button></span>)}{state.filters.families.map((familyId) => <span key={`family-${familyId}`}>Family: {families.find((family) => family.id === familyId)?.name}<button type="button" aria-label={`Remove ${familyId} Family`} onClick={() => dispatch({ type: 'TOGGLE_FILTER', key: 'families', value: familyId })}>×</button></span>)}{state.filters.problems.filter((problemId) => !['multiple-issues', 'not-sure'].includes(problemId)).map((problemId) => <span key={`problem-${problemId}`}>Requirement: {problemOptions.find(([id]) => id === problemId)?.[1]}<button type="button" aria-label={`Remove ${problemOptions.find(([id]) => id === problemId)?.[1]} Requirement`} onClick={() => dispatch({ type: 'TOGGLE_FILTER', key: 'problems', value: problemId })}>×</button></span>)}{carriedStageIds.map((stageId) => <span key={`stage-${stageId}`}>Stage: {productionStages.find((stage) => stage.id === stageId)?.label}<button type="button" aria-label={`Remove ${productionStages.find((stage) => stage.id === stageId)?.label} Stage`} onClick={() => { if (state.reviewStageIds.includes(stageId)) dispatch({ type: 'REMOVE_REVIEW_STAGE', stageId }); if (state.filters.stages.includes(stageId)) dispatch({ type: 'TOGGLE_FILTER', key: 'stages', value: stageId }); }}>×</button></span>)}{state.filters.routes.map((routeId) => <span key={`route-${routeId}`}>Project Route: {projectOptions.find(([id]) => id === routeId)?.[1]}<button type="button" aria-label={`Remove ${projectOptions.find(([id]) => id === routeId)?.[1]} Project Route`} onClick={() => dispatch({ type: 'TOGGLE_FILTER', key: 'routes', value: routeId })}>×</button></span>)}</div>}<p className="scope-summary" aria-live="polite"><strong>{familyIds.length}</strong> Product Families and <strong>{selectedProducts.length}</strong> Explicit Products Are Currently in Scope.</p></section>
    <div className="scientific-logic-note"><p className="proof-label">Evidence-Based Logic</p><h3>Published V4 Boundaries Narrow the Review</h3><p>A product or model is excluded only when an answer directly contradicts a current approved boundary. Unknown information never creates a false exclusion or recommendation.</p></div>
    <div className="builder-sections">{grouped.filter((group) => group.questions.length).map((group, index) => <details key={group.key} open={index === 0}><summary><span>{group.label}</span><small>{group.questions.filter((question) => state.readinessAnswers[question.id] !== undefined).length}/{group.questions.length} Answered</small></summary><div className="mcq-question-list">{group.questions.map((question) => <fieldset className="mcq-question" key={question.id}><legend>{question.label}</legend><p>{question.purpose}</p><div className="mcq-options">{question.options.map((option) => { const value = state.readinessAnswers[question.id]; const selected = Array.isArray(value) ? value.includes(option.id) : value === option.id; return <button key={option.id} type="button" role={question.mode === 'single' ? 'radio' : 'checkbox'} aria-checked={selected} className={selected ? 'is-selected' : ''} onClick={() => choose(question.id, option.id, question.mode)}><span aria-hidden="true">{selected ? '✓' : '+'}</span><strong>{option.label}</strong>{option.caveat && <small>{option.caveat}</small>}</button>; })}</div></fieldset>)}</div>{group.key === 'project' && state.readinessAnswers['project-type'] === 'support' && <div className="service-notice"><strong>Installed-Equipment Support Has a Dedicated Route.</strong><p>Continue here only when the requirement also includes a new application or upgrade.</p><a href={siteConfig.serviceSupportUrl} onClick={() => track('service_support_cta_clicked', { location: 'builder' })}>Go to Service and Support →</a></div>}</details>)}</div>
    <div className="builder-submit"><div><strong>Generate the Brief Even When Information Is Incomplete.</strong><p>No contact details or free text are collected, and nothing is submitted automatically.</p></div><button type="button" className="button" onClick={() => { dispatch({ type: 'GENERATE_BRIEF' }); track('readiness_brief_generated', { count: answered, ids: selectedProducts.map((product) => product!.id) }); }}>Build My Review Brief</button></div>
  </div>;
}
