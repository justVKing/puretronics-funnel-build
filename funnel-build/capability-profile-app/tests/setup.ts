import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
  sessionStorage.clear();
  window.location.hash = '';
});

Object.defineProperty(window, 'scrollTo', { value: () => undefined, writable: true });
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: class IntersectionObserver {
    observe() {}
    disconnect() {}
    unobserve() {}
  },
});
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', { value: () => null, writable: true });
