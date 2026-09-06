import { familyById, productById } from '../data/catalog';
import { relationships } from '../data/relationships';
import { useExplorer } from '../state/ExplorerProvider';
import { AccessibleDialog } from './AccessibleDialog';

export function ProductDrawer() {
  const { state, dispatch } = useExplorer();
  const product = state.drawerProductId ? productById.get(state.drawerProductId) : undefined;
  if (!product) return null;
  const related = relationships.filter((item) => item.from === product.id).map((item) => ({ ...item, product: productById.get(item.to) }));

  return (
    <AccessibleDialog open title={product.name} onClose={() => dispatch({ type: 'CLOSE_DRAWER' })} className="product-drawer">
      <div className="drawer-body">
        <p className="family-label">{familyById.get(product.familyId)?.name} · {product.id}</p>
        <p className="drawer-lead">{product.primaryFunction}</p>
        {product.image && <img className="drawer-product-image" src={`./assets/${product.image}`} width="400" height="400" loading="lazy" alt={`${product.shortName} product view`} />}
        <div className="detail-grid">
          <section><h3>Primary role</h3><p>{product.role}</p></section>
          <section><h3>Selection inputs</h3><ul>{product.selectionFactors.map((item) => <li key={item}>{item}</li>)}</ul></section>
        </div>
        {product.specs.length > 0 && <section className="technical-panel"><h3>Approved platform information</h3><dl>{product.specs.map((spec) => <div key={spec.label}><dt>{spec.label}</dt><dd>{spec.display}{spec.qualifier ? <small>{spec.qualifier}</small> : null}</dd></div>)}</dl></section>}
        {product.models.length > 0 && <section><h3>Approved models and variants</h3><div className="model-list">{product.models.map((model) => <details key={model.id} open={product.models.length <= 2}><summary><span>{model.name}</span><small>{model.id}</small></summary><dl>{model.specs.map((spec) => <div key={spec.label}><dt>{spec.label}</dt><dd>{spec.display}</dd></div>)}</dl>{model.caveat && <p className="caveat">{model.caveat}</p>}</details>)}</div></section>}
        <section className="caveat-panel"><h3>Technical safeguards</h3><ul>{product.caveats.map((item) => <li key={item}>{item}</li>)}</ul><p><strong>Availability:</strong> {product.availability}</p></section>
        {related.length > 0 && <section><h3>Related system roles</h3><div className="relationship-list">{related.map((item) => <button type="button" key={`${item.kind}-${item.to}`} onClick={() => dispatch({ type: 'OPEN_DRAWER', productId: item.to })}><span>{item.kind.replace('_', ' ')}</span><strong>{item.product?.shortName}</strong><small>{item.reason}</small></button>)}</div></section>}
        <div className="drawer-actions"><button className="button" type="button" onClick={() => { dispatch({ type: 'TOGGLE_SELECTED', productId: product.id }); document.querySelector('#prepare')?.scrollIntoView(); dispatch({ type: 'CLOSE_DRAWER' }); }}>Prepare a review for this product</button><button className="button button-secondary" type="button" onClick={() => dispatch({ type: 'CLOSE_DRAWER' })}>Back to results</button></div>
      </div>
    </AccessibleDialog>
  );
}
