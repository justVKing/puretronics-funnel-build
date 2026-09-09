import type { ModelVariant, TechnicalDatum, V4RecordDetails } from '../types/catalog';
import { familyById, productById } from '../data/catalog';
import { productionStages } from '../data/productionStages';
import { relationships } from '../data/relationships';
import { useExplorer } from '../state/ExplorerProvider';
import { AccessibleDialog } from './AccessibleDialog';

function SpecificationTable({ title, specifications }: { title: string; specifications: TechnicalDatum[] }) {
  return <div className="specification-table-wrap" tabIndex={0} aria-label={`Scrollable ${title}`}>
    <table className="specification-table">
      <caption>{title}</caption>
      <thead><tr><th scope="col">Technical Parameter</th><th scope="col">Specification</th></tr></thead>
      <tbody>{specifications.map((specification, index) => <tr key={`${specification.label}-${index}`}><th scope="row">{specification.label}</th><td>{specification.display}{specification.qualifier ? <small>{specification.qualifier}</small> : null}</td></tr>)}</tbody>
    </table>
  </div>;
}

function RecordContext({ record }: { record?: V4RecordDetails }) {
  if (!record) return null;
  return <dl className="record-context">
    {record.primaryFunction && <div><dt>Primary Function</dt><dd>{record.primaryFunction}</dd></div>}
    {record.primaryUseCase && <div><dt>Application</dt><dd>{record.primaryUseCase}</dd></div>}
    {record.buyerProblemSolved && <div><dt>Requirement Addressed</dt><dd>{record.buyerProblemSolved}</dd></div>}
    {record.buyerValue && <div><dt>How It Helps</dt><dd>{record.buyerValue}</dd></div>}
    {record.bestFitBuyerQuestion && <div><dt>Discuss With Puretronics</dt><dd>{record.bestFitBuyerQuestion}</dd></div>}
    {record.selectionFactors && <div><dt>Selection Factors</dt><dd>{record.selectionFactors}</dd></div>}
    {record.availability && <div><dt>Availability</dt><dd>{record.availability}</dd></div>}
  </dl>;
}

function recordDisplayName(variant: ModelVariant) {
  if (variant.record?.recordClass !== 'Support' && variant.record?.recordClass !== 'Option') return variant.name;
  const minorWords = new Set(['and', 'for', 'of', 'the', 'to', 'with']);
  return variant.name.split(' ').map((word, index) => {
    if (index > 0 && minorWords.has(word.toLocaleLowerCase())) return word.toLocaleLowerCase();
    if (word === word.toLocaleUpperCase() && /[A-Z]/.test(word)) return word;
    return word.split('-').map((part) => part ? `${part[0].toLocaleUpperCase()}${part.slice(1)}` : part).join('-');
  }).join(' ');
}

function VariantDetails({ variant, nested = false }: { variant: ModelVariant; nested?: boolean }) {
  const displayName = recordDisplayName(variant);
  return <details className={nested ? 'variant-details is-nested' : 'variant-details'}>
    <summary><span>{displayName}</span><small>{variant.record?.recordClass === 'SKU' ? 'Capacity Option' : variant.record?.recordClass === 'Configuration Class' ? 'Speed Configuration' : variant.record?.recordClass === 'Support' ? 'Accessory' : variant.record?.recordClass ?? 'Model'}</small></summary>
    <RecordContext record={variant.record} />
    <SpecificationTable title={`${displayName}: Technical Specifications`} specifications={variant.specs} />
    {variant.record?.technicalCaveats && <p className="caveat"><strong>Technical Caveat:</strong> {variant.record.technicalCaveats}</p>}
    {variant.record?.quotationConfirmationNote && <p className="quotation-note"><strong>Before Ordering:</strong> {variant.record.quotationConfirmationNote}</p>}
    {variant.children && variant.children.length > 0 && <section className="nested-variants"><h4>Capacity Options</h4>{variant.children.map((child) => <VariantDetails variant={child} nested key={child.id} />)}</section>}
  </details>;
}

export function ProductDrawer() {
  const { state, dispatch } = useExplorer();
  const product = state.drawerProductId ? productById.get(state.drawerProductId) : undefined;
  if (!product) return null;
  const related = relationships.filter((item) => item.from === product.id).map((item) => ({ ...item, product: productById.get(item.to) }));
  const uniqueProductLevelSpecifications = product.specs.filter((specification) => !specification.display.includes(' | '));

  return (
    <AccessibleDialog open title={product.name} onClose={() => dispatch({ type: 'CLOSE_DRAWER' })} className="product-drawer">
      <div className="drawer-body">
        <p className="family-label">{familyById.get(product.familyId)?.name}</p>
        <p className="drawer-lead">{product.primaryFunction}</p>
        {product.image && <img className="drawer-product-image" src={`./assets/${product.image}`} width="400" height="400" loading="lazy" alt={`${product.shortName} product view`} />}

        <section aria-labelledby={`${product.id}-review-context`}><h3 id={`${product.id}-review-context`}>Application and Selection Context</h3><RecordContext record={product.record} /></section>

        <div className="detail-grid">
          <section><h3>Primary Role</h3><p>{product.role}</p></section>
          <section><h3>System Role</h3><p>{product.systemRole}</p></section>
          <section><h3>Applications</h3><ul>{product.useCases.map((item) => <li key={item}>{item}</li>)}</ul></section>
          <section><h3>Production and Testing Stages</h3><ul>{product.stages.map((stageId) => <li key={stageId}>{productionStages.find((stage) => stage.id === stageId)?.label ?? stageId}</li>)}</ul></section>
          <section><h3>Selection Inputs</h3><ul>{product.selectionFactors.map((item) => <li key={item}>{item}</li>)}</ul></section>
        </div>

        {uniqueProductLevelSpecifications.length > 0 && <section className="technical-panel"><h3>Product Specifications</h3><SpecificationTable title={`${product.name}: Product Specifications`} specifications={uniqueProductLevelSpecifications} />{uniqueProductLevelSpecifications.length < product.specs.length && <p className="technical-panel-note">Model-dependent specifications are shown with each model below.</p>}</section>}

        {product.models.length > 0 && <section><h3>Models and Variants</h3><p className="section-supporting-copy">Open a model or configuration to review its applications, specifications and selection conditions.</p><div className="model-list">{product.models.map((model) => <VariantDetails variant={model} key={model.id} />)}</div></section>}

        {product.supportItems && product.supportItems.length > 0 && <section><h3>Accessories and Options</h3><p className="section-supporting-copy">Confirm compatibility with the selected equipment and installation.</p><div className="model-list support-list">{product.supportItems.map((item) => <VariantDetails variant={item} key={item.id} />)}</div></section>}

        <section className="caveat-panel"><h3>Selection Conditions</h3><ul>{product.caveats.map((item) => <li key={item}>{item}</li>)}</ul><p><strong>Availability:</strong> {product.availability}</p>{product.record?.quotationConfirmationNote && <p><strong>Before Ordering:</strong> {product.record.quotationConfirmationNote}</p>}</section>

        {related.length > 0 && <section><h3>Related System Roles</h3><div className="relationship-list">{related.map((item) => <button type="button" key={`${item.kind}-${item.to}`} onClick={() => dispatch({ type: 'OPEN_DRAWER', productId: item.to })}><span>{{ alternative_to: 'Related Measurement Option', works_with: 'Complementary Equipment', supports: 'System Support' }[item.kind]}</span><strong>{item.product?.shortName}</strong><small>{item.reason}</small></button>)}</div></section>}
        <div className="drawer-actions"><button className="button" type="button" onClick={() => { dispatch({ type: 'ADD_SELECTED', productId: product.id }); document.querySelector('#prepare')?.scrollIntoView(); dispatch({ type: 'CLOSE_DRAWER' }); }}>Prepare a Review for This Product</button><button className="button button-secondary" type="button" onClick={() => dispatch({ type: 'CLOSE_DRAWER' })}>Back to Results</button></div>
      </div>
    </AccessibleDialog>
  );
}
