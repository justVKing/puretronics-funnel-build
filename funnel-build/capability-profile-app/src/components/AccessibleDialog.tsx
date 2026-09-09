import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export function AccessibleDialog({ open, title, onClose, children, className = '' }: { open: boolean; title: string; onClose: () => void; children: ReactNode; className?: string }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const titleId = useId();
  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const panel = panelRef.current!;
    const backdrop = panel.parentElement;
    const siblings = [...document.body.children].filter((element): element is HTMLElement => element instanceof HTMLElement && element !== backdrop);
    const originalInert = siblings.map((element) => element.inert);
    siblings.forEach((element) => { element.inert = true; });
    const focusables = () => [...panel.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea, summary, [tabindex]:not([tabindex="-1"])')].filter((item) => {
      if (item.hasAttribute('disabled') || item.closest('[hidden], [inert]')) return false;
      if (getComputedStyle(item).display === 'none' || getComputedStyle(item).visibility === 'hidden') return false;
      const closed = item.closest('details:not([open])');
      return !closed || Boolean(closed.querySelector(':scope > summary')?.contains(item));
    });
    (focusables()[0] ?? panel).focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); closeRef.current(); return; }
      if (event.key !== 'Tab') return;
      const items = focusables();
      const first = items[0] ?? panel;
      const last = items.at(-1) ?? panel;
      if (!items.length || !panel.contains(document.activeElement)) { event.preventDefault(); first.focus(); }
      else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', handleKey);
    document.body.classList.add('dialog-open');
    return () => {
      document.removeEventListener('keydown', handleKey);
      siblings.forEach((element, index) => { element.inert = originalInert[index]; });
      document.body.classList.remove('dialog-open');
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [open]);
  if (!open) return null;
  return createPortal(<div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div ref={panelRef} tabIndex={-1} className={`dialog-panel ${className}`} role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <div className="dialog-header"><h2 id={titleId}>{title}</h2><button type="button" className="icon-button" onClick={onClose} aria-label="Close details">×</button></div>
      {children}
    </div>
  </div>, document.body);
}
